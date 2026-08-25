"""
Automated unit tests for real human ISL dataset pipeline & multi-model versioning.
"""

import pytest
import numpy as np
from app.services.inference import InferenceService, inference_service

def test_inference_service_multi_model_modes():
    service = InferenceService()
    assert service.inference_mode in ("REAL_MODEL_10", "REAL_MODEL_27", "REAL_MODEL_EXTERNAL", "DEMO_MOCK")
    assert service.class_names is not None
    assert len(service.class_names) >= 10

def test_inference_predict_frame_structure():
    dummy_landmarks = [[0.1 * i, 0.2 * i] for i in range(21)]
    res = inference_service.predict_landmarks(dummy_landmarks)
    assert "sign" in res
    assert "confidence" in res
    assert "inference_mode" in res
    assert "all_probabilities" in res
    assert isinstance(res["confidence"], float)

def test_inference_predict_sequence_structure():
    dummy_seq = [[[0.01 * (i + j), 0.02 * (i + j)] for j in range(21)] for i in range(15)]
    res = inference_service.predict_sequence(dummy_seq)
    assert "sign" in res
    assert "confidence" in res
    assert "inference_mode" in res
    assert "all_probabilities" in res
    assert isinstance(res["confidence"], float)
