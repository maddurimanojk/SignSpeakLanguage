from fastapi import APIRouter
from app.services.inference import inference_service

router = APIRouter()

@router.get("/health")
def health_check():
    return {
        "status": "healthy",
        "service": "SignSpeak AI Backend API",
        "version": "1.0.0",
        "inference_mode": inference_service.inference_mode,
        "model_name": "isl_external_model.keras" if inference_service.inference_mode == "REAL_MODEL_EXTERNAL" else "isl_sign_model_10.keras",
        "classes_count": len(inference_service.class_names),
        "supported_signs_count": len(inference_service.class_names),
        "supported_signs": inference_service.class_names
    }
