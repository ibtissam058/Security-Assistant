from fastapi import APIRouter, Depends
from pydantic import BaseModel
from sqlalchemy.orm import Session
from groq import Groq
from database import get_db
from models import ScanHistory, User
from auth_utils import get_current_user
import os
from dotenv import load_dotenv

load_dotenv()

router = APIRouter()
client = Groq(api_key=os.getenv("GROQ_API_KEY"))

class EmailRequest(BaseModel):
    email_content: str

@router.post("/analyze-email")
async def analyze_email(
    data: EmailRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    response = client.chat.completions.create(
        model="llama-3.3-70b-versatile",
        messages=[
            {
                "role": "system",
                "content": """You are a cybersecurity expert specialized in email phishing detection.
                Analyze the email provided and give a structured response with:
                1. VERDICT: (Phishing / Suspicious / Legitimate)
                2. CONFIDENCE: (High / Medium / Low)
                3. RED FLAGS: List any suspicious elements found
                4. EXPLANATION: Brief explanation of your verdict
                5. ACTION: What the user should do
                Be concise and clear."""
            },
            {
                "role": "user",
                "content": f"Analyze this email:\n\n{data.email_content}"
            }
        ]
    )

    analysis = response.choices[0].message.content
    is_threat = "verdict**: phishing" in analysis.lower() or "verdict**: suspicious" in analysis.lower()

    scan = ScanHistory(
        user_id=current_user.id,
        scan_type="email",
        input_data=data.email_content[:100] + "...",
        result="phishing" if is_threat else "legitimate",
        threat_found="true" if is_threat else "false"
    )
    db.add(scan)
    db.commit()

    return {"analysis": analysis, "threat_found": is_threat}