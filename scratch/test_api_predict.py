import os
import sys
import numpy as np

os.environ["KERAS_HOME"] = os.path.abspath(os.path.join(os.path.dirname(__file__), ".keras"))
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "backend")))
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "ml")))

from fastapi.testclient import TestClient
from app.main import app
from app.utils.config import settings
from preprocess import load_and_preprocess_dataset

def verify_api_and_predictions():
    client = TestClient(app)
    
    print("=== GET /health VERIFICATION ===")
    res = client.get("/health")
    print(f"Status Code: {res.status_code}")
    print("Health Payload:")
    data = res.json()
    print(data)

    print("\n=== POST /predict SEQUENCE TEST ON 10 HELD-OUT TEST SAMPLES ===")
    dataset_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "dataset"))
    
    # Select 10 diverse sign folders and pick sample_039.npy (from test set split)
    signs = settings.SIGNS[:10]
    results = []

    for sign in signs:
        folder = os.path.join(dataset_dir, sign.replace(" ", "_"))
        sample_path = os.path.join(folder, "sample_039.npy")
        if not os.path.exists(sample_path):
            continue
        
        seq_np = np.load(sample_path) # Shape [15, 42]
        seq_list = seq_np.tolist()

        payload = {"sequence": seq_list}
        pred_res = client.post("/predict/sequence", json=payload)
        res_json = pred_res.json()
        
        pred_sign = res_json.get("sign")
        confidence = res_json.get("confidence")
        inference_mode = res_json.get("inference_mode")
        is_correct = (pred_sign == sign)
        
        results.append({
            "expected_sign": sign,
            "predicted_sign": pred_sign,
            "confidence": confidence,
            "inference_mode": inference_mode,
            "is_correct": is_correct
        })

    print(f"{'EXPECTED SIGN':<15} | {'PREDICTED SIGN':<15} | {'CONFIDENCE':<10} | {'MODE':<12} | {'CORRECT'}")
    print("-" * 75)
    for r in results:
        print(f"{r['expected_sign']:<15} | {r['predicted_sign']:<15} | {r['confidence']:<10} | {r['inference_mode']:<12} | {r['is_correct']}")

if __name__ == "__main__":
    verify_api_and_predictions()
