from fastapi import APIRouter
import httpx
import os
import base64
from dotenv import load_dotenv
from pydantic import BaseModel

load_dotenv()

router = APIRouter()

class URLRequest(BaseModel):
    url: str

@router.post("/check-url")
async def check_url(data: URLRequest):
    url = data.url
    api_key = os.getenv("VIRUSTOTAL_API_KEY")
    
    # VirusTotal requires URL to be base64 encoded
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
        return {
            "url": url,
            "malicious": stats["malicious"],
            "suspicious": stats["suspicious"],
            "harmless": stats["harmless"],
            "safe": stats["malicious"] < 3
        }
    else:
        return {"error": "URL not found in VirusTotal. Try submitting it first."}