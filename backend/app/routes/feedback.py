from fastapi import APIRouter
from pydantic import BaseModel
from typing import Optional
import time

router = APIRouter()

class FeedbackPayload(BaseModel):
    predicted_sign: str
    actual_sign: Optional[str] = None
    is_correct: bool
    confidence: float
    user_notes: Optional[str] = None

@router.post("/feedback")
def submit_feedback(payload: FeedbackPayload):
    return {
        "status": "success",
        "message": "Feedback recorded successfully",
        "timestamp": time.strftime("%Y-%m-%d %H:%M:%S"),
        "received_data": payload.model_dump()
    }
