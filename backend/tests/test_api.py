import os
import sys
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

import pytest
from fastapi.testclient import TestClient
from app.main import app
from app.utils.config import settings

client = TestClient(app)

def test_root_endpoint():
    response = client.get("/")
    assert response.status_code == 200
    data = response.json()
    assert "app" in data
    assert "version" in data

def test_health():
    response = client.get("/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "healthy"
    assert "inference_mode" in data
    assert data["supported_signs_count"] in [10, 26, 27]
    assert isinstance(data["supported_signs"], list)

def test_predict_single_frame():
    dummy_landmarks = [[0.1 * i, 0.2 * i] for i in range(21)]
    payload = {
        "landmarks": dummy_landmarks,
        "timestamp": "2026-08-14 23:00:00"
    }
    response = client.post("/predict", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert "sign" in data
    assert "confidence" in data
    assert "inference_mode" in data
    assert 0.0 <= data["confidence"] <= 1.0

def test_predict_sequence():
    dummy_sequence = [
        [[0.01 * (i + j), 0.02 * (i + j)] for j in range(21)]
        for i in range(15)
    ]
    payload = {
        "sequence": dummy_sequence,
        "timestamp": "2026-08-14 23:00:00"
    }
    response = client.post("/predict/sequence", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert "sign" in data
    assert "confidence" in data
    assert "inference_mode" in data
    assert 0.0 <= data["confidence"] <= 1.0
