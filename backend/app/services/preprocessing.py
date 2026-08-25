import numpy as np

def normalize_landmarks(landmarks: list) -> np.ndarray:
    """
    Normalizes 21 3D hand landmark points (63 floats: x, y, z or 42 floats: x, y).
    1. Wrist centered: subtract wrist landmark (point 0) from all points.
    2. Scaling: divide by max distance from wrist for scale invariance.
    """
    if landmarks is None or (isinstance(landmarks, (list, tuple)) and len(landmarks) == 0) or (isinstance(landmarks, np.ndarray) and landmarks.size == 0):
        return np.zeros(42, dtype=np.float32)
    
    arr = np.array(landmarks, dtype=np.float32)
    
    # If passed as 21 tuples or flat list
    if arr.ndim == 1:
        if len(arr) == 42:
            arr = arr.reshape(21, 2)
        elif len(arr) == 63:
            arr = arr.reshape(21, 3)
            # Use only x, y for 2D classification if z is zero/noisy
            arr = arr[:, :2]
        else:
            return np.zeros(42, dtype=np.float32)

    # Shift origin to wrist (landmark index 0)
    wrist = arr[0]
    arr = arr - wrist

    # Find max absolute distance to normalize scale
    max_dist = np.max(np.abs(arr))
    if max_dist > 0:
        arr = arr / max_dist

    return arr.flatten()

def preprocess_sequence(sequence: list, seq_length: int = 15) -> np.ndarray:
    """
    Preprocesses a list of landmark frames into a fixed sequence array [seq_length, feature_dim].
    """
    normalized_frames = [normalize_landmarks(frame) for frame in sequence]
    
    if len(normalized_frames) < seq_length:
        # Pad with zeroes if shorter than required sequence
        padding = [np.zeros(42, dtype=np.float32) for _ in range(seq_length - len(normalized_frames))]
        normalized_frames = padding + normalized_frames
    elif len(normalized_frames) > seq_length:
        # Truncate to recent seq_length frames
        normalized_frames = normalized_frames[-seq_length:]
        
    return np.array(normalized_frames, dtype=np.float32)
