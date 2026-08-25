"""
CLI Prediction Script for SignSpeak AI
"""

import sys
import os
import numpy as np

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "backend")))
from app.services.inference import inference_service

def run_cli_predict():
    print("[CLI Predict] Testing SignSpeak AI Inference Engine...")
    
    # Generate mock landmark input (42 float values)
    sample_landmarks = [float(0.05 * (i % 10)) for i in range(42)]
    
    result = inference_service.predict_frame(sample_landmarks)
    
    print("\n--- Inference Result ---")
    print(f"Predicted Sign:  {result['sign']}")
    print(f"Confidence:      {result['confidence'] * 100:.1f}%")
    print(f"Inference Mode:  {result['inference_mode']}")
    print(f"Timestamp:       {result['timestamp']}")
    print(f"Valid Gesture:   {result['is_valid']}")
    print("------------------------\n")

if __name__ == "__main__":
    run_cli_predict()
