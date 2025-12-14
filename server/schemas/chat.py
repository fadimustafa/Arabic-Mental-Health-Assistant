# models/schemas.py

from pydantic import BaseModel
from typing import Dict

class ChatRequest(BaseModel):
    message: str

class ChatResponse(BaseModel):
    response: str
    emotion: Dict[str, float]   # now it accepts a dict of scores
