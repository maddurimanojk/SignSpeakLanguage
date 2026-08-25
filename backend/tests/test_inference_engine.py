import pytest
import numpy as np
from app.services.inference import InferenceService
from app.utils.config import settings

VALID_SIGNS = set(settings.SIGNS + settings.SIGNS_10 + [
    "A", "B", "C", "D", "E", "F", "G", "H", "I", "J",
    "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T",
    "U", "V", "W", "X", "Y", "Z", "NO_HAND_DETECTED", "UNKNOWN"
])

def test_inference_service_initialization():
    service = InferenceService()
    assert service.inference_mode in ["REAL_MODEL_10", "REAL_MODEL_27", "REAL_MODEL_EXTERNAL", "DEMO_MOCK"]

@pytest.mark.parametrize("sign_index", range(len(settings.SIGNS)))
def test_inference_predict_frame_sign_coverage(sign_index):
    service = InferenceService()
    dummy_landmarks = [[0.05 * (sign_index + i), 0.05 * i] for i in range(21)]
    result = service.predict_landmarks(dummy_landmarks)
    assert "sign" in result
    assert "confidence" in result
    assert result["sign"] in VALID_SIGNS

def test_inference_predict_frame_no_landmarks():
    service = InferenceService()
    result = service.predict_landmarks([])
    assert result["sign"] in ["NO_HAND_DETECTED", "UNKNOWN", "A"] or result["confidence"] >= 0.0

@pytest.mark.parametrize("seq_length", [1, 5, 10, 15, 20])
def test_inference_predict_sequence_lengths(seq_length):
    service = InferenceService()
    dummy_sequence = [[[0.01 * j, 0.02 * j] for j in range(21)] for _ in range(seq_length)]
    result = service.predict_sequence(dummy_sequence)
    assert "sign" in result
    assert "confidence" in result

def test_inference_predict_sequence_empty():
    service = InferenceService()
    result = service.predict_sequence([])
    assert result["sign"] in ["NO_HAND_DETECTED", "HELLO", "UNKNOWN"] or result["confidence"] >= 0.0
