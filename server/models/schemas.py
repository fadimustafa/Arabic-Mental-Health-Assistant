from pydantic import BaseModel
from typing import Optional, Dict

class Message(BaseModel):
    role: str      # "user" or "assistant"
    content: str   # message text

class ChatRequest(BaseModel):
    chat_id: Optional[int] = None
    message: str

class ChatResponse(BaseModel):
    response: str
    emotion: Dict[str, float]   # emotion classification scores
    chat_id: int
