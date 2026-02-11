import os
from dotenv import load_dotenv
import httpx
from fastapi import HTTPException, APIRouter
from fastapi.responses import JSONResponse

load_dotenv()
REALTIME_API_KEY = os.getenv("REALTIME_API_KEY")
print(REALTIME_API_KEY)

router = APIRouter(
    prefix="/convo",
    tags=["convo"],
)

@router.get("/token")
async def get_token():
    """
    Generates ephemeral token for browser WebRTC usage.
    """

    try:
        async with httpx.AsyncClient() as client:
            # Using default session config (voice can be updated later per session)
            r = await client.post(
                "https://api.openai.com/v1/realtime/client_secrets",
                headers={
                    "Authorization": f"Bearer {REALTIME_API_KEY}",
                    "Content-Type": "application/json"
                },
                json={
                    "session": {
                        "type": "realtime",
                        "model": "gpt-realtime",
                        "audio": {
                            "output": {"voice": "alloy"}
                        }
                    }
                }
            )

        r.raise_for_status()
        return JSONResponse(content=r.json())

    except Exception as e:
        print("Token generation error:", e)
        raise HTTPException(status_code=500, detail="Failed to generate token")
