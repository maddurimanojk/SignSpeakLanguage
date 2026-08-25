"""
Automated unit test suite for SignSpeak AI External Dataset Pipeline.
Tests dataset info provenance, audit logic, class mapping rules, MediaPipe landmark normalization,
participant-aware splitting, model architecture loading, and inference service integration.
"""

import json
import pytest
import numpy as np
from pathlib import Path
from app.services.preprocessing import normalize_landmarks
from app.services.inference import inference_service, InferenceService

DATA_EXTERNAL_DIR = Path(__file__).parent.parent.parent / "data_external"
CLASS_MAPPING_PATH = Path(__file__).parent.parent.parent / "ml" / "class_mapping.json"

class TestDatasetInfoAndProvenance:
    def test_dataset_info_exists(self):
        info_file = DATA_EXTERNAL_DIR / "DATASET_INFO.md"
        assert info_file.exists(), "DATASET_INFO.md must exist in data_external/"

    def test_dataset_info_content(self):
        info_file = DATA_EXTERNAL_DIR / "DATASET_INFO.md"
        content = info_file.read_text()
        assert "Indian Sign Language" in content
        assert "ayeshatasnim-h" in content or "INCLUDE" in content

class TestClassMapping:
    def test_class_mapping_file_exists(self):
        assert CLASS_MAPPING_PATH.exists(), "class_mapping.json must exist in ml/"

    def test_class_mapping_validity(self):
        with open(CLASS_MAPPING_PATH, 'r') as f:
            data = json.load(f)
        assert "target_vocabulary_26" in data or "target_vocabulary_10" in data
        assert "mappings" in data

class TestLandmarkNormalization:
    def test_normalize_landmarks_shape(self):
        dummy_landmarks = np.random.rand(21, 2).astype(np.float32)
        norm = normalize_landmarks(dummy_landmarks)
        assert len(norm) == 42
        assert isinstance(norm, np.ndarray) or isinstance(norm, list)

    def test_normalize_wrist_centering(self):
        dummy_landmarks = np.ones((21, 2), dtype=np.float32)
        norm = normalize_landmarks(dummy_landmarks)
        assert norm[0] == 0.0
        assert norm[1] == 0.0

class TestModelInferenceService:
    def test_inference_service_modes(self):
        service = InferenceService()
        assert service.inference_mode in ["REAL_MODEL_10", "REAL_MODEL_27", "DEMO_MOCK", "REAL_MODEL_EXTERNAL"]

    def test_predict_single_frame(self):
        dummy_landmarks = np.random.rand(21, 2).tolist()
        result = inference_service.predict_landmarks(dummy_landmarks)
        assert "sign" in result
        assert "confidence" in result
        assert "inference_mode" in result

    def test_predict_sequence_frames(self):
        dummy_seq = [np.random.rand(21, 2).tolist() for _ in range(15)]
        result = inference_service.predict_sequence(dummy_seq)
        assert "sign" in result
        assert "confidence" in result
        assert "inference_mode" in result

class TestParticipantAwareSplittingLogic:
    def test_split_group_isolation(self):
        from sklearn.model_selection import GroupKFold
        X = np.random.rand(20, 15, 42)
        y = np.random.randint(0, 5, size=20)
        groups = np.array(["P1", "P1", "P2", "P2", "P3", "P3", "P4", "P4", "P5", "P5",
                           "P6", "P6", "P7", "P7", "P8", "P8", "P9", "P9", "P10", "P10"])

        gkf = GroupKFold(n_splits=5)
        train_idx, test_idx = next(gkf.split(X, y, groups))

        train_groups = set(groups[train_idx])
        test_groups = set(groups[test_idx])

        # Assert zero overlap between train and test participant IDs
        assert len(train_groups.intersection(test_groups)) == 0
