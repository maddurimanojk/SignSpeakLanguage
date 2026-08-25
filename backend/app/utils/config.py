import os

class Settings:
    PROJECT_NAME: str = "SignSpeak AI Backend"
    VERSION: str = "1.0.0"
    API_V1_STR: str = "/api/v1"
    
    # Environment & Demo settings
    ENV: str = os.getenv("ENV", "development")
    DEMO_MODE: bool = os.getenv("DEMO_MODE", "true").lower() == "true"
    
    # Model configurations
    MODEL_PATH: str = os.getenv("MODEL_PATH", "backend/app/models/isl_sign_model.keras")
    MODEL_10_PATH: str = os.getenv("MODEL_10_PATH", "backend/app/models/isl_sign_model_10.keras")
    MODEL_27_PATH: str = os.getenv("MODEL_27_PATH", "backend/app/models/isl_sign_model.keras")
    
    CONFIDENCE_THRESHOLD: float = float(os.getenv("CONFIDENCE_THRESHOLD", "0.75"))
    
    # Core 10-Sign Target Vocabulary for Phase 4 Real Human Model
    SIGNS_10 = [
        "HELLO", "THANK YOU", "YES", "NO", "PLEASE",
        "SORRY", "HELP", "WATER", "FOOD", "STOP"
    ]

    # Full ISL Target Vocabulary (27 signs)
    SIGNS = [
        "HELLO", "THANK YOU", "YES", "NO", "PLEASE", "SORRY", "HELP",
        "WATER", "FOOD", "HOME", "SCHOOL", "HOSPITAL", "GOOD", "BAD",
        "NAME", "STOP", "COME", "GO", "I", "YOU", "WE", "WHAT",
        "WHERE", "HOW", "WELCOME", "GOOD MORNING", "GOOD NIGHT"
    ]

settings = Settings()
