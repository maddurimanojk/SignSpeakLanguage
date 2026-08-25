import sys
import os
import pytest
from fastapi.testclient import TestClient

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))
from app.main import app
from app.utils.config import settings

client = TestClient(app)

@pytest.mark.parametrize("sign_name", settings.SIGNS)
def test_feedback_for_all_signs(sign_name):
    payload = {
        "predicted_sign": sign_name,
        "actual_sign": sign_name,
        "is_correct": True,
        "confidence": 0.95,
        "user_notes": f"Verified prediction for {sign_name}"
    }
    response = client.post("/feedback", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "success"
    assert data["received_data"]["predicted_sign"] == sign_name
    assert data["received_data"]["is_correct"] is True

@pytest.mark.parametrize("is_correct", [True, False])
def test_feedback_accuracy_flag(is_correct):
    payload = {
        "predicted_sign": "HELLO",
        "actual_sign": "HELLO" if is_correct else "NO",
        "is_correct": is_correct,
        "confidence": 0.85
    }
    response = client.post("/feedback", json=payload)
    assert response.status_code == 200
    assert response.json()["received_data"]["is_correct"] == is_correct

@pytest.mark.parametrize("conf_val", [0.0, 0.25, 0.50, 0.75, 0.90, 1.0])
def test_feedback_confidence_levels(conf_val):
    payload = {
        "predicted_sign": "WATER",
        "is_correct": conf_val > 0.70,
        "confidence": conf_val
    }
    response = client.post("/feedback", json=payload)
    assert response.status_code == 200
    assert response.json()["received_data"]["confidence"] == conf_val

@pytest.mark.parametrize("user_id", ["user_101", "participant_02", "researcher_alpha", "", "anon_test"])
def test_session_user_ids(user_id):
    payload = {"user_id": user_id, "device_info": "iOS Simulator"}
    response = client.post("/session", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "active"
    assert "session_id" in data
    assert len(data["session_id"]) > 10
    expected_user = user_id if user_id else "anonymous"
    assert data["user_id"] == expected_user

def test_session_anonymous_default():
    payload = {}
    response = client.post("/session", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert data["user_id"] == "anonymous"
    assert "created_at" in data
