from fastapi import APIRouter, Depends
from pydantic import BaseModel
from sqlalchemy.orm import Session
from database import get_db
from models import ScanHistory, User
from auth_utils import get_current_user
import httpx
import os
import base64
from dotenv import load_dotenv

load_dotenv()

router = APIRouter()

class URLRequest(BaseModel):
    url: str

@router.post("/check-url")
async def check_url(
    data: URLRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    url = data.url
    api_key = os.getenv("VIRUSTOTAL_API_KEY")
    url_id = base64.urlsafe_b64encode(url.encode()).decode().strip("=")
    headers = {"x-apikey": api_key}

    async with httpx.AsyncClient() as client:
        response = await client.get(
            f"https://www.virustotal.com/api/v3/urls/{url_id}",
            headers=headers
        )

    if response.status_code == 200:
        result = response.json()
        stats = result["data"]["attributes"]["last_analysis_stats"]
        is_safe = stats["malicious"] < 3
        threat_found = "false" if is_safe else "true"

        scan = ScanHistory(
            user_id=current_user.id,
            scan_type="url",
            input_data=url,
            result="safe" if is_safe else "malicious",
            threat_found=threat_found
        )
        db.add(scan)
        db.commit()

        return {
            "url": url,
            "malicious": stats["malicious"],
            "suspicious": stats["suspicious"],
            "harmless": stats["harmless"],
            "safe": is_safe
        }
    else:
        return {"error": "URL not found in VirusTotal."}