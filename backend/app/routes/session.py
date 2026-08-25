from fastapi import APIRouter
from pydantic import BaseModel
from typing import Optional
import uuid
import time

router = APIRouter()

class SessionPayload(BaseModel):
    user_id: Optional[str] = None
    device_info: Optional[str] = None

@router.post("/session")
def start_session(payload: SessionPayload):
    session_id = str(uuid.uuid4())
    return {
        "status": "active",
        "session_id": session_id,
        "created_at": time.strftime("%Y-%m-%d %H:%M:%S"),
        "user_id": payload.user_id or "anonymous"
    }
