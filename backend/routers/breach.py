from fastapi import APIRouter

router = APIRouter()

@router.get("/check-breach/{email}")
async def check_breach(email: str):
    # Mock data for testing - replace with real HIBP call later
    mock_breached = ["test@gmail.com", "admin@yahoo.com", "user@hotmail.com"]
    
    if email in mock_breached:
        return {
            "breached": True,
            "count": 3,
            "breaches": ["Adobe", "LinkedIn", "Dropbox"]
        }
    else:
        return {
            "breached": False,
            "message": "Good news! No breaches found."
        }