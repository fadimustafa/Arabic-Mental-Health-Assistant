# routers/chat_router.py
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from models.auth_chat import User, Chat, Message
from models.schemas import ChatResponse, ChatRequest
from services.emotion_classifier import emotion_pipeline
from services.llm_service import get_llm_response
from services.translataion import translate_ar_to_en, translate_en_to_ar
from routers.auth_router import get_current_user
from db import get_db

router = APIRouter()

@router.post("/chat", response_model=ChatResponse)
async def chat_with_llm(
    req: ChatRequest,   # 🔹 chat_id + message
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    # 1️⃣ ترجم الرسالة
    text_en = translate_ar_to_en(req.message)

    # 2️⃣ إما جلب المحادثة أو إنشاء جديدة
    chat = None
    if req.chat_id:
        chat = db.query(Chat).filter(
            Chat.id == req.chat_id,
            Chat.user_id == current_user.id
        ).first()

    if not chat:
        chat = Chat(user_id=current_user.id)
        db.add(chat)
        db.commit()
        db.refresh(chat)

    # 3️⃣ خزّن رسالة المستخدم
    user_msg = Message(chat_id=chat.id, role="user", content_ar=req.message, content_en=text_en)
    db.add(user_msg)
    db.commit()

    # 4️⃣ استخرج المحادثة كلها بالإنجليزية لإرسالها لـ LLM
    conversation_en = [
        {"role": msg.role, "content": msg.content_en}
        for msg in db.query(Message).filter(Message.chat_id == chat.id).order_by(Message.created_at).all()
    ]

    # 5️⃣ تحليل المشاعر على آخر رسالة
    emotions = emotion_pipeline(text_en)
    if "error" in emotions:
        return ChatResponse(response="❌ خطأ أثناء تحليل المشاعر", emotion={})
    dom_emotion = emotions["dominant_emotion"]

    # 6️⃣ أرسل للـ LLM
    llm_result = get_llm_response(conversation_en, dom_emotion)

    if llm_result.get("success"):
        llm_response_en = llm_result["response"]
        llm_response_ar = translate_en_to_ar(llm_response_en)
    else:
        llm_response_en = ""
        llm_response_ar = f"❌ خطأ في LLM: {llm_result.get('error', 'غير معروف')}"

    # 7️⃣ خزّن رد البوت
    bot_msg = Message(chat_id=chat.id, role="assistant", content_ar=llm_response_ar, content_en=llm_response_en)
    db.add(bot_msg)
    db.commit()

    return ChatResponse(response=llm_response_ar, emotion=emotions["emotion_scores"],chat_id=chat.id )
