from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_health_endpoint():
    response = client.get("/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "healthy"
    assert "service" in data
    assert "version" in data

def test_health_endpoint_inference_mode_present():
    response = client.get("/health")
    assert response.status_code == 200
    data = response.json()
    assert "inference_mode" in data
    assert data["inference_mode"] in ["REAL_MODEL_10", "REAL_MODEL_27", "REAL_MODEL_EXTERNAL", "REAL_MODEL", "DEMO_MOCK"]
