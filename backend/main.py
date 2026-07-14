from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routers import breach, scanner, chatbot, auth, history, score, email_analyzer
from database import engine
import models

models.Base.metadata.create_all(bind=engine)

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router)
app.include_router(breach.router)
app.include_router(scanner.router)
app.include_router(chatbot.router)
app.include_router(history.router)
app.include_router(score.router)
app.include_router(email_analyzer.router)

@app.get("/health")
def health():
    return {"status": "backend is running"}