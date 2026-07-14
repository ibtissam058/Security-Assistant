from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from database import get_db
from models import ScanHistory, User
from auth_utils import get_current_user

router = APIRouter()

@router.get("/security-score")
def get_security_score(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    scans = db.query(ScanHistory)\
        .filter(ScanHistory.user_id == current_user.id)\
        .all()

    total_scans = len(scans)
    threats_found = len([s for s in scans if s.threat_found == "true"])

    # Calculate score
    if total_scans == 0:
        score = 100
    else:
        threat_ratio = threats_found / total_scans
        score = max(0, int(100 - (threat_ratio * 100)))

    # Generate personalized advice
    advice = []

    if total_scans == 0:
        advice.append("Start by scanning your email for breaches.")
        advice.append("Check any suspicious URLs before clicking them.")
        advice.append("Use the chatbot to analyze suspicious emails.")

    elif threat_ratio >= 0.7:
        advice.append("⚠️ High threat rate detected — be very careful online.")
        advice.append("Change passwords for any breached accounts immediately.")
        advice.append("Enable two-factor authentication on all important accounts.")
        advice.append("Avoid clicking links from unknown senders.")
        advice.append("Consider using a password manager.")

    elif threat_ratio >= 0.4:
        advice.append("You've encountered several threats — stay cautious.")
        advice.append("Review your breached accounts and update passwords.")
        advice.append("Always verify URLs before entering login credentials.")
        advice.append("Be skeptical of urgent emails asking for personal info.")

    elif threat_ratio >= 0.1:
        advice.append("You're doing well but stay vigilant.")
        advice.append("Keep scanning suspicious URLs and emails regularly.")
        advice.append("Make sure your passwords are unique for each account.")

    else:
        advice.append("Excellent! Your digital hygiene looks great.")
        advice.append("Keep scanning suspicious links before clicking them.")
        advice.append("Share this tool with friends and family to keep them safe.")

    return {
        "score": score,
        "total_scans": total_scans,
        "threats_found": threats_found,
        "advice": advice
    }