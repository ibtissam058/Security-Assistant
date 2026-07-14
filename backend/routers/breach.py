from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from database import get_db
from models import ScanHistory, User
from auth_utils import get_current_user

router = APIRouter()

@router.get("/check-breach/{email}")
async def check_breach(
    email: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    mock_breached = ["test@gmail.com", "admin@yahoo.com", "user@hotmail.com"]

    if email in mock_breached:
        result = "breached"
        threat_found = "true"
        response = {
            "breached": True,
            "count": 3,
            "breaches": ["Adobe", "LinkedIn", "Dropbox"]
        }
    else:
        result = "safe"
        threat_found = "false"
        response = {
            "breached": False,
            "message": "Good news! No breaches found."
        }

    scan = ScanHistory(
        user_id=current_user.id,
        scan_type="breach",
        input_data=email,
        result=result,
        threat_found=threat_found
    )
    db.add(scan)
    db.commit()

    return response