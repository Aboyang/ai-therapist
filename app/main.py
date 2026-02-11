from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routes import chat, convo, summary

app = FastAPI()

app.include_router(chat.router)
app.include_router(convo.router)
# app.include_router(summary.router)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
