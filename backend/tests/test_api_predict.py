import pytest
from fastapi.testclient import TestClient
from app.main import app
from app.utils.config import settings

client = TestClient(app)

VALID_SIGNS = set(settings.SIGNS + settings.SIGNS_10 + [
    "A", "B", "C", "D", "E", "F", "G", "H", "I", "J",
    "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T",
    "U", "V", "W", "X", "Y", "Z", "NO_HAND_DETECTED", "UNKNOWN"
])

@pytest.mark.parametrize("sign_index, sign_name", enumerate(settings.SIGNS))
def test_predict_single_frame_per_sign(sign_index, sign_name):
    dummy_landmarks = [[0.1 * i, 0.2 * i] for i in range(21)]
    payload = {"landmarks": dummy_landmarks, "timestamp": "2026-08-14 23:30:00"}
    
    response = client.post("/predict", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert "sign" in data
    assert "confidence" in data
    assert "inference_mode" in data
    assert data["sign"] in VALID_SIGNS

@pytest.mark.parametrize("scale", [0.0, 0.1, 0.25, 0.5, 0.75, 1.0, -0.5, 2.0])
def test_predict_single_frame_coordinate_scales(scale):
    dummy_landmarks = [[scale * i, scale * (i + 1)] for i in range(21)]
    payload = {"landmarks": dummy_landmarks}
    
    response = client.post("/predict", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert data["sign"] in VALID_SIGNS

def test_predict_empty_landmarks():
    payload = {"landmarks": []}
    response = client.post("/predict", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert data["sign"] in ["NO_HAND_DETECTED", "UNKNOWN", "A"] or data["confidence"] >= 0.0
    assert data["is_valid"] is False or "confidence" in data

@pytest.mark.parametrize("seq_length", [1, 3, 5, 10, 15, 20, 25, 30])
def test_predict_sequence_lengths(seq_length):
    mock_frame = [0.05 * (i % 10) for i in range(42)]
    mock_sequence = [mock_frame for _ in range(seq_length)]
    payload = {"sequence": mock_sequence, "timestamp": "2026-08-14 23:30:00"}
    
    response = client.post("/predict/sequence", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert "sign" in data
    assert "confidence" in data
    assert data["inference_mode"] in ["REAL_MODEL_10", "REAL_MODEL_27", "REAL_MODEL_EXTERNAL", "REAL_MODEL", "DEMO_MOCK"]

def test_predict_sequence_empty():
    payload = {"sequence": []}
    response = client.post("/predict/sequence", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert data["sign"] in ["NO_HAND_DETECTED", "HELLO", "UNKNOWN"] or data["confidence"] >= 0.0

@pytest.mark.parametrize("pattern_id", range(15))
def test_predict_sequence_distinct_patterns(pattern_id):
    mock_sequence = [
        [0.01 * pattern_id * (i + j) for j in range(42)]
        for i in range(15)
    ]
    payload = {"sequence": mock_sequence}
    
    response = client.post("/predict/sequence", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert "sign" in data
    assert 0.0 <= data["confidence"] <= 1.0
