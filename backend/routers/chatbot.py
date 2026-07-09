from fastapi import APIRouter
from pydantic import BaseModel
from groq import Groq
import os
from dotenv import load_dotenv

load_dotenv()

router = APIRouter()

client = Groq(api_key=os.getenv("GROQ_API_KEY"))

class ChatRequest(BaseModel):
    message: str

@router.post("/chat")
async def chat(data: ChatRequest):
    response = client.chat.completions.create(
        model="llama-3.3-70b-versatile",
        messages=[
            {
                "role": "system",
                "content": """You are a cybersecurity assistant. 
                Your job is to help users identify phishing emails, 
                suspicious URLs, and social engineering attacks.
                Be clear, concise and explain in simple terms.
                Always tell the user what to do next."""
            },
            {
                "role": "user",
                "content": data.message
            }
        ]
    )
    
    reply = response.choices[0].message.content
    return {"reply": reply}