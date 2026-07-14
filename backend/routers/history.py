from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from database import get_db
from models import ScanHistory, User
from auth_utils import get_current_user

router = APIRouter()

@router.get("/history")
def get_history(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    scans = db.query(ScanHistory)\
        .filter(ScanHistory.user_id == current_user.id)\
        .order_by(ScanHistory.created_at.desc())\
        .limit(20)\
        .all()

    return [
        {
            "id": s.id,
            "scan_type": s.scan_type,
            "input_data": s.input_data,
            "result": s.result,
            "threat_found": s.threat_found,
            "created_at": s.created_at.strftime("%Y-%m-%d %H:%M")
        }
        for s in scans
    ]

@router.delete("/history")
def clear_history(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    db.query(ScanHistory)\
        .filter(ScanHistory.user_id == current_user.id)\
        .delete()
    db.commit()
    return {"message": "History cleared successfully"}