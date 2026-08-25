import os
import json
import numpy as np
from pathlib import Path
import tensorflow as tf
from app.services.preprocessing import normalize_landmarks, preprocess_sequence
from app.utils.config import settings

class InferenceService:
    def __init__(self):
        self.model = None
        self.inference_mode = "DEMO_MOCK"
        self.class_names = [
            "A", "B", "C", "D", "E", "F", "G", "H", "I", "J",
            "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T",
            "U", "V", "W", "X", "Y", "Z"
        ]
        self._load_model()

    def _load_model(self):
        ext_model_path = Path(__file__).parent.parent / "models" / "isl_external_model.keras"
        model_10_path = Path(settings.MODEL_10_PATH)
        model_27_path = Path(settings.MODEL_27_PATH)

        if ext_model_path.exists():
            try:
                self.model = tf.keras.models.load_model(str(ext_model_path))
                self.inference_mode = "REAL_MODEL_EXTERNAL"
                print(f"Loaded Real External ISL Model from {ext_model_path}")
                return
            except Exception as e:
                print(f"Error loading external model: {e}")

        if model_10_path.exists():
            try:
                self.model = tf.keras.models.load_model(str(model_10_path))
                self.inference_mode = "REAL_MODEL_10"
                print(f"Loaded Real 10-Class ISL Model from {model_10_path}")
                return
            except Exception as e:
                print(f"Error loading 10-class model: {e}")

        if model_27_path.exists():
            try:
                self.model = tf.keras.models.load_model(str(model_27_path))
                self.inference_mode = "REAL_MODEL_27"
                print(f"Loaded Real 27-Class ISL Model from {model_27_path}")
                return
            except Exception as e:
                print(f"Error loading 27-class model: {e}")

        self.inference_mode = "DEMO_MOCK"
        print("Using DEMO_MOCK Inference Service")

    def predict_frame(self, landmarks_list: list) -> dict:
        if landmarks_list is None or len(landmarks_list) == 0:
            return {
                "sign": "NO_HAND_DETECTED",
                "confidence": 0.0,
                "is_valid": False,
                "inference_mode": self.inference_mode,
                "all_probabilities": {}
            }

        if self.inference_mode.startswith("REAL_MODEL") and self.model is not None:
            norm_feats = normalize_landmarks(landmarks_list)
            seq_tensor = np.tile(norm_feats, (15, 1)).astype(np.float32)
            input_tensor = np.expand_dims(seq_tensor, axis=0)

            preds = self.model.predict(input_tensor, verbose=0)[0]
            top_idx = int(np.argmax(preds))
            confidence = float(preds[top_idx])
            sign = self.class_names[top_idx] if top_idx < len(self.class_names) else "UNKNOWN"

            return {
                "sign": sign,
                "confidence": confidence,
                "is_valid": True,
                "inference_mode": self.inference_mode,
                "all_probabilities": {
                    self.class_names[i]: float(preds[i]) for i in range(min(len(preds), len(self.class_names)))
                }
            }

        mock_sign = "A"
        return {
            "sign": mock_sign,
            "confidence": 0.95,
            "is_valid": True,
            "inference_mode": "DEMO_MOCK",
            "all_probabilities": {mock_sign: 0.95}
        }

    def predict_landmarks(self, landmarks_list: list) -> dict:
        return self.predict_frame(landmarks_list)

    def predict_sequence(self, sequence_landmarks: list) -> dict:
        if sequence_landmarks is None or len(sequence_landmarks) == 0:
            return {
                "sign": "NO_HAND_DETECTED",
                "confidence": 0.0,
                "is_valid": False,
                "inference_mode": self.inference_mode,
                "all_probabilities": {}
            }

        if self.inference_mode.startswith("REAL_MODEL") and self.model is not None:
            processed_seq = preprocess_sequence(sequence_landmarks, seq_length=15)
            input_tensor = np.expand_dims(processed_seq, axis=0)

            preds = self.model.predict(input_tensor, verbose=0)[0]
            top_idx = int(np.argmax(preds))
            confidence = float(preds[top_idx])
            sign = self.class_names[top_idx] if top_idx < len(self.class_names) else "UNKNOWN"

            return {
                "sign": sign,
                "confidence": confidence,
                "is_valid": True,
                "inference_mode": self.inference_mode,
                "all_probabilities": {
                    self.class_names[i]: float(preds[i]) for i in range(min(len(preds), len(self.class_names)))
                }
            }

        mock_sign = "HELLO"
        return {
            "sign": mock_sign,
            "confidence": 0.92,
            "is_valid": True,
            "inference_mode": "DEMO_MOCK",
            "all_probabilities": {mock_sign: 0.92}
        }

inference_service = InferenceService()
