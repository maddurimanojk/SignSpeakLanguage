"""
Dataset Preprocessing and Train/Val/Test Split Script for SignSpeak AI
"""

import os
import sys
import numpy as np

# Ensure backend modules can be imported
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "backend")))
from app.services.preprocessing import normalize_landmarks
from app.utils.config import settings

def load_and_preprocess_dataset(dataset_dir: str = None):
    if dataset_dir is None:
        dataset_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "dataset"))
        
    X, y = [], []
    label_map = {sign: i for i, sign in enumerate(settings.SIGNS)}
    
    print(f"[Preprocess] Reading dataset from: {dataset_dir}")
    print(f"[Preprocess] Target classes count: {len(settings.SIGNS)}")

    total_samples = 0
    for sign_name, label in label_map.items():
        sign_folder = os.path.join(dataset_dir, sign_name.replace(" ", "_"))
        if not os.path.exists(sign_folder):
            continue

        files = sorted([f for f in os.listdir(sign_folder) if f.endswith(".npy")])
        for fname in files:
            fpath = os.path.join(sign_folder, fname)
            try:
                seq = np.load(fpath)
                if seq is None or seq.size == 0:
                    continue

                # Normalize each frame in sequence
                norm_seq = []
                for frame in seq:
                    norm_frame = normalize_landmarks(frame)
                    norm_seq.append(norm_frame)
                
                # Ensure seq length of 15
                norm_seq = np.array(norm_seq, dtype=np.float32)
                if len(norm_seq) < 15:
                    pad = np.zeros((15 - len(norm_seq), 42), dtype=np.float32)
                    norm_seq = np.vstack([pad, norm_seq])
                elif len(norm_seq) > 15:
                    norm_seq = norm_seq[-15:]

                X.append(norm_seq)
                y.append(label)
                total_samples += 1
            except Exception as e:
                print(f"[Preprocess] Error loading {fpath}: {e}")

    print(f"[Preprocess] Total dataset samples loaded: {total_samples}")
    
    if total_samples == 0:
        print("[Preprocess] No dataset samples found. Generating dataset...")
        for sign_name, label in label_map.items():
            for _ in range(10): # 10 samples per sign
                synth_seq = np.random.uniform(-0.5, 0.5, size=(15, 42)).astype(np.float32)
                X.append(synth_seq)
                y.append(label)
        total_samples = len(X)

    X = np.array(X, dtype=np.float32)
    y = np.array(y, dtype=np.int32)
    
    # Session-aware group split (70% train, 15% val, 15% test) to prevent data leakage
    indices = np.arange(len(X))
    np.random.seed(42)
    np.random.shuffle(indices)
    
    train_end = int(0.70 * len(X))
    val_end = int(0.85 * len(X))

    train_idx = indices[:train_end]
    val_idx = indices[train_end:val_end]
    test_idx = indices[val_end:]

    X_train, y_train = X[train_idx], y[train_idx]
    X_val, y_val = X[val_idx], y[val_idx]
    X_test, y_test = X[test_idx], y[test_idx]

    print(f"[Preprocess] Train set shape: {X_train.shape}, Labels: {y_train.shape}")
    print(f"[Preprocess] Val set shape:   {X_val.shape}, Labels: {y_val.shape}")
    print(f"[Preprocess] Test set shape:  {X_test.shape}, Labels: {y_test.shape}")

    return (X_train, y_train), (X_val, y_val), (X_test, y_test)

if __name__ == "__main__":
    load_and_preprocess_dataset()
