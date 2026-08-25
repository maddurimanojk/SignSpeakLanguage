import sys
import os
import pytest
import numpy as np

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))
from app.services.preprocessing import normalize_landmarks, preprocess_sequence

def test_normalize_landmarks_flat_2d_shape():
    landmarks = [0.1 * i for i in range(42)]
    res = normalize_landmarks(landmarks)
    assert isinstance(res, np.ndarray)
    assert res.shape == (42,)

def test_normalize_landmarks_flat_3d_shape():
    landmarks = [0.1 * i for i in range(63)]
    res = normalize_landmarks(landmarks)
    assert isinstance(res, np.ndarray)
    assert res.shape == (42,)

def test_normalize_landmarks_wrist_origin_zero():
    # Construct points where wrist (point 0) is at (5.0, 10.0)
    points = [(5.0 + i, 10.0 + i) for i in range(21)]
    flat = [c for p in points for c in p]
    res = normalize_landmarks(flat)
    
    # Reshape back to 21 points
    res_points = res.reshape(21, 2)
    # Wrist (index 0) must be shifted to exactly (0.0, 0.0)
    assert res_points[0][0] == pytest.approx(0.0, abs=1e-5)
    assert res_points[0][1] == pytest.approx(0.0, abs=1e-5)

@pytest.mark.parametrize("scale_factor", [0.5, 1.0, 2.0, 5.0, 10.0])
def test_normalize_landmarks_scale_invariance(scale_factor):
    base_points = [(0.1 * i, 0.2 * i) for i in range(21)]
    scaled_points = [(p[0] * scale_factor, p[1] * scale_factor) for p in base_points]
    
    flat_base = [c for p in base_points for c in p]
    flat_scaled = [c for p in scaled_points for c in p]
    
    res_base = normalize_landmarks(flat_base)
    res_scaled = normalize_landmarks(flat_scaled)
    
    # Relative normalized vectors should be identical regardless of scale factor
    np.testing.assert_allclose(res_base, res_scaled, atol=1e-4)

@pytest.mark.parametrize("shift_x, shift_y", [(1.0, 2.0), (-5.0, 10.0), (100.0, -50.0)])
def test_normalize_landmarks_translation_invariance(shift_x, shift_y):
    base_points = [(0.05 * i, 0.08 * i) for i in range(21)]
    shifted_points = [(p[0] + shift_x, p[1] + shift_y) for p in base_points]
    
    flat_base = [c for p in base_points for c in p]
    flat_shifted = [c for p in shifted_points for c in p]
    
    res_base = normalize_landmarks(flat_base)
    res_shifted = normalize_landmarks(flat_shifted)
    
    # Translation shift should be eliminated by wrist origin subtraction
    np.testing.assert_allclose(res_base, res_shifted, atol=1e-4)

def test_normalize_landmarks_empty_input():
    res = normalize_landmarks([])
    assert res.shape == (42,)
    assert np.all(res == 0.0)

def test_normalize_landmarks_invalid_length():
    res = normalize_landmarks([1.0, 2.0, 3.0])
    assert res.shape == (42,)
    assert np.all(res == 0.0)

@pytest.mark.parametrize("num_frames", [1, 5, 10, 14])
def test_preprocess_sequence_padding(num_frames):
    single_frame = [0.1 * i for i in range(42)]
    short_sequence = [single_frame for _ in range(num_frames)]
    
    res = preprocess_sequence(short_sequence, seq_length=15)
    assert res.shape == (15, 42)
    # Check that initial frames were zero-padded
    num_padded = 15 - num_frames
    assert np.all(res[:num_padded] == 0.0)

@pytest.mark.parametrize("num_frames", [16, 20, 30, 50])
def test_preprocess_sequence_truncating(num_frames):
    sequence = [[0.01 * f * i for i in range(42)] for f in range(num_frames)]
    
    res = preprocess_sequence(sequence, seq_length=15)
    assert res.shape == (15, 42)

def test_preprocess_sequence_exact_length():
    exact_sequence = [[0.05 * i for i in range(42)] for _ in range(15)]
    res = preprocess_sequence(exact_sequence, seq_length=15)
    assert res.shape == (15, 42)
