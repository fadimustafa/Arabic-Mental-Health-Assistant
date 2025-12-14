# routers/chat_router.py

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from models.auth_chat import Chat, Message, ChatSummary, User
from routers.auth_router import get_current_user
from services.llm_service import get_llm_summary
from services.emotion_classifier import emotion_pipeline
from services.translataion import translate_ar_to_en, translate_en_to_ar
from db import get_db
from pydantic import BaseModel
from typing import List
import re

router = APIRouter()


# 📌 Schemas
class MessagePayload(BaseModel):
    sender: str   # "user" or "assistant"
    message: str


class ConversationPayload(BaseModel):
    messages: List[MessagePayload]


# ---------------------------
# 🗑️ حذف جلسة
# ---------------------------
@router.delete("/chats/{chat_id}")
async def delete_chat(
    chat_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    chat = db.query(Chat).filter(
        Chat.id == chat_id,
        Chat.user_id == current_user.id
    ).first()

    if not chat:
        raise HTTPException(status_code=404, detail="Chat not found")

    db.delete(chat)
    db.commit()
    return {"message": "✅ Chat deleted successfully"}

# ---------------------------
# 📥 جلب الرسائل داخل جلسة محددة
# ---------------------------
@router.get("/chats/{chat_id}/messages")
async def get_chat_messages(
    chat_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    chat = db.query(Chat).filter(
        Chat.id == chat_id,
        Chat.user_id == current_user.id
    ).first()

    if not chat:
        raise HTTPException(status_code=404, detail="Chat not found")

    messages = db.query(Message).filter(
        Message.chat_id == chat.id
    ).order_by(Message.created_at.asc()).all()

    return [
        {
            "id": m.id,
            "sender": m.role,
            "text": m.content_ar,   # أو content_en حسب اللغة
            "created_at": m.created_at
        }
        for m in messages
    ]

# ---------------------------
# 📜 جلب جميع الجلسات (ID, User, Created_at)
# ---------------------------
@router.get("/chats")
async def get_chats(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    chats = (
        db.query(Chat)
        .filter(Chat.user_id == current_user.id)
        .outerjoin(ChatSummary)  # join summaries
        .all()
    )

    return [
        {
            "id": c.id,
            "created_at": c.created_at,
            "summary": {
                "id": c.summary.id if c.summary else None,
                "title": c.summary.title if c.summary else None,
                "summary": c.summary.summary if c.summary else None,
                "dominant_emotion": c.summary.dominant_emotion if c.summary else None,
                "created_at": c.summary.created_at if c.summary else None,
            }
        }
        for c in chats
    ]

# ---------------------------
# 💾 حفظ محادثة وتوليد ملخص
# ---------------------------
class SaveChatRequest(BaseModel):
    chat_id: int
# ✅ Manual mapping for emotions (no bad MT translations)
EMOTION_MAP = {
    "anger": "غضب",
    "disgust": "اشمئزاز",
    "fear": "خوف",
    "joy": "فرح",
    "neutral": "عادي",
    "sadness": "حزن",
    "surprise": "مفاجأة"
}

# ✅ Smarter title translator
def smart_translate_title(text: str) -> str:
    if not text or text.lower() in ["untitled", "title"]:
        return "بدون عنوان"
    try:
        result = translate_en_to_ar(text)
        # Heuristic: if translation looks broken, fallback to English
        if len(result.split()) < 2 or "مُحَار" in result or result.startswith("❌"):
            return text
        return result
    except Exception:
        return text or "بدون عنوان"


@router.post("/save-conversation")
async def save_conversation(
    data: SaveChatRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    # 🔎 Validate chat ownership
    chat = db.query(Chat).filter(
        Chat.id == data.chat_id,
        Chat.user_id == current_user.id
    ).first()
    if not chat:
        raise HTTPException(status_code=404, detail="Chat not found")

    # 📩 Fetch chat messages
    messages_db = db.query(Message).filter(
        Message.chat_id == chat.id
    ).order_by(Message.created_at.asc()).all()
    if not messages_db:
        raise HTTPException(status_code=400, detail="No messages in chat")

    # 🔄 Prepare English conversation for LLM
    conversation_en = [
        {"role": m.role, "content": m.content_en}
        for m in messages_db if m.content_en
    ]

    # 🧠 Emotion analysis (on all user messages)
    user_text = " ".join(
        [m.content_en for m in messages_db if m.role == "user" and m.content_en]
    )
    emotions = emotion_pipeline(user_text)
    if "error" in emotions:
        dominant_emotion = "neutral"
    else:
        dominant_emotion = emotions.get("dominant_emotion", "neutral")

    # 📋 Summarize with LLM
    llm_summary = get_llm_summary(conversation_en)
    if not llm_summary.get("success"):
        raise HTTPException(status_code=500, detail="❌ LLM summarization failed")

    raw_response = llm_summary.get("response", "")
    print(raw_response)

    # 📝 Extract Title & Summary safely
    title_en, summary_en = "Untitled", "❌ No summary generated"

    title_match = re.search(r"Title\s*:\s*(.+)", raw_response)
    summary_match = re.search(r"Summary\s*:\s*(.+)", raw_response)

    if title_match:
        title_en = title_match.group(1).strip()
    if summary_match:
        summary_en = summary_match.group(1).strip()

    # 🌍 Translate (with fallbacks)
    def safe_translate(func, text, fallback):
        try:
            result = func(text)
            if result.startswith("❌ Error"):
                return fallback
            return result
        except Exception:
            return fallback

    title_ar = smart_translate_title(title_en)
    summary_ar = safe_translate(translate_en_to_ar, summary_en, "❌ لم يتم توليد ملخص")
    dominant_emotion_ar = EMOTION_MAP.get(dominant_emotion.lower(), "عادي")

    # 💾 Save or update summary
    chat_summary = db.query(ChatSummary).filter(ChatSummary.chat_id == chat.id).first()
    if chat_summary:
        chat_summary.title = title_ar
        chat_summary.summary = summary_ar
        chat_summary.dominant_emotion = dominant_emotion_ar
    else:
        chat_summary = ChatSummary(
            chat_id=chat.id,
            title=title_ar,
            summary=summary_ar,
            dominant_emotion=dominant_emotion_ar
        )
        db.add(chat_summary)

    db.commit()

    # ✅ Return consistent Arabic data
    return {
        "message": "✅ Conversation saved and summarized",
        "chat_id": chat.id,
        "title": title_ar,
        "summary": summary_ar,
        "dominant_emotion": dominant_emotion_ar
    }
