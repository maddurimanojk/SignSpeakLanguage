from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List, Optional, Union, Any
from app.services.inference import inference_service

router = APIRouter()

class LandmarkPayload(BaseModel):
    landmarks: List[Any]
    timestamp: Optional[str] = None

class SequenceLandmarkPayload(BaseModel):
    sequence: List[Any]
    timestamp: Optional[str] = None

@router.post("/predict")
def predict_landmark(payload: LandmarkPayload):
    try:
        result = inference_service.predict_frame(payload.landmarks)
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/predict/sequence")
def predict_sequence_landmarks(payload: SequenceLandmarkPayload):
    try:
        result = inference_service.predict_sequence(payload.sequence)
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
