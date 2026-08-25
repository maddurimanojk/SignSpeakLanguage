import sys
import os
import pytest
import numpy as np

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..", "backend")))
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..", "ml")))

from app.utils.config import settings
from app.models.sign_model import build_sequence_model
from preprocess import load_and_preprocess_dataset

def test_sign_vocabulary_count():
    assert len(settings.SIGNS) == 27

@pytest.mark.parametrize("sign_name", settings.SIGNS)
def test_dataset_sign_folders_exist(sign_name):
    dataset_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..", "dataset"))
    sign_folder = os.path.join(dataset_dir, sign_name.replace(" ", "_"))
    assert os.path.exists(sign_folder)

def test_load_and_preprocess_dataset_shapes():
    (X_train, y_train), (X_val, y_val), (X_test, y_test) = load_and_preprocess_dataset()
    
    assert X_train.ndim == 3
    assert X_train.shape[1:] == (15, 42)
    assert X_val.shape[1:] == (15, 42)
    assert X_test.shape[1:] == (15, 42)
    
    total_samples = len(X_train) + len(X_val) + len(X_test)
    assert total_samples > 0
    
    # Train set should be approximately 70% of total
    assert len(X_train) == int(0.70 * total_samples)

def test_keras_sequence_model_structure():
    try:
        model = build_sequence_model(input_shape=(15, 42), num_classes=27)
        if model is not None:
            assert model.input_shape == (None, 15, 42)
            assert model.output_shape == (None, 27)
            assert len(model.layers) >= 5
    except ImportError:
        pytest.skip("TensorFlow is not installed in current environment.")
