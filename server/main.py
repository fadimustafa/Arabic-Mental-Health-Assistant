from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routers import auth_router, chat_router, save_chat_router
from db import Base, engine

app = FastAPI()

# CORS for frontend (React runs on port 5173 by default with Vite)
app.add_middleware(
    CORSMiddleware,
   allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(chat_router.router, prefix="/api")
app.include_router(auth_router.router, prefix="/auth")
app.include_router(save_chat_router.router)

Base.metadata.create_all(bind=engine)
