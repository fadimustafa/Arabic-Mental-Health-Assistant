# models/auth_chat.py

from sqlalchemy import Column, Integer, String, ForeignKey, DateTime, Text
from sqlalchemy.orm import relationship
from datetime import datetime
from db import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True, nullable=False)
    email = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)

    # one-to-many: user -> chats
    chats = relationship("Chat", back_populates="user")

class Chat(Base):
    __tablename__ = "chats"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)

    # relations
    user = relationship("User", back_populates="chats")
    messages = relationship("Message", back_populates="chat", cascade="all, delete-orphan")
    summary = relationship("ChatSummary", back_populates="chat", uselist=False, cascade="all, delete-orphan")


class Message(Base):
    __tablename__ = "messages"

    id = Column(Integer, primary_key=True, index=True)
    chat_id = Column(Integer, ForeignKey("chats.id"), nullable=False)
    role = Column(String, nullable=False)    
    content_ar = Column(Text, nullable=True)  
    content_en = Column(Text, nullable=True) 
    created_at = Column(DateTime, default=datetime.utcnow)

    # relation back
    chat = relationship("Chat", back_populates="messages")


class ChatSummary(Base):
    __tablename__ = "chat_summaries"

    id = Column(Integer, primary_key=True, index=True)
    chat_id = Column(Integer, ForeignKey("chats.id"), nullable=False, unique=True)  
    title = Column(String, nullable=True)              # عنوان المحادثة
    summary = Column(Text, nullable=True)              # ملخص المحادثة
    dominant_emotion = Column(String, nullable=True)   # المشاعر الغالبة
    created_at = Column(DateTime, default=datetime.utcnow)

    # relation back
    chat = relationship("Chat", back_populates="summary")
