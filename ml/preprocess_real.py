"""
Participant-Aware Dataset Preprocessor for Real Human Dataset (Phase 4)
Loads landmark samples from dataset_real/ for the 10 core ISL classes and splits into 70% train / 15% val / 15% test.
"""

import os
import sys
import json
import numpy as np

# Ensure backend imports work
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "backend")))
from app.services.preprocessing import normalize_landmarks
from app.utils.config import settings

def load_real_human_dataset(real_dir: str = None):
    if real_dir is None:
        real_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "dataset_real"))

    X, y, groups = [], [], []
    label_map = {sign: i for i, sign in enumerate(settings.SIGNS_10)}
    
    print(f"[Preprocess Real] Loading dataset from: {real_dir}")
    print(f"[Preprocess Real] Target 10 classes: {settings.SIGNS_10}")

    if not os.path.exists(real_dir):
        print(f"[Preprocess Real] Warning: {real_dir} does not exist.")
        return (np.empty((0, 15, 42)), np.empty((0,))), (np.empty((0, 15, 42)), np.empty((0,))), (np.empty((0, 15, 42)), np.empty((0,)))

    total_samples = 0
    for sign_name, label in label_map.items():
        sign_folder = os.path.join(real_dir, sign_name.replace(" ", "_"))
        if not os.path.exists(sign_folder):
            continue

        files = sorted([f for f in os.listdir(sign_folder) if f.endswith(".npy")])
        for fname in files:
            fpath = os.path.join(sign_folder, fname)
            meta_path = os.path.join(sign_folder, fname.replace(".npy", ".json"))
            try:
                seq = np.load(fpath)
                if seq is None or seq.size == 0:
                    continue

                # Normalize each frame
                norm_seq = []
                for frame in seq:
                    norm_frame = normalize_landmarks(frame)
                    norm_seq.append(norm_frame)

                norm_seq = np.array(norm_seq, dtype=np.float32)
                if len(norm_seq) < 15:
                    pad = np.zeros((15 - len(norm_seq), 42), dtype=np.float32)
                    norm_seq = np.vstack([pad, norm_seq])
                elif len(norm_seq) > 15:
                    norm_seq = norm_seq[-15:]

                # Participant group lookup
                participant_id = "P01"
                if os.path.exists(meta_path):
                    with open(meta_path, "r") as mf:
                        meta = json.load(mf)
                        participant_id = meta.get("participant", "P01")

                X.append(norm_seq)
                y.append(label)
                groups.append(participant_id)
                total_samples += 1
            except Exception as e:
                print(f"[Preprocess Real] Error loading {fpath}: {e}")

    print(f"[Preprocess Real] Total real human samples loaded: {total_samples}")
    if total_samples == 0:
        return (np.empty((0, 15, 42)), np.empty((0,))), (np.empty((0, 15, 42)), np.empty((0,))), (np.empty((0, 15, 42)), np.empty((0,)))

    X = np.array(X, dtype=np.float32)
    y = np.array(y, dtype=np.int32)
    groups = np.array(groups)

    # Check participant diversity for group splitting
    unique_participants = np.unique(groups)
    print(f"[Preprocess Real] Unique participants found: {len(unique_participants)} ({list(unique_participants)})")

    indices = np.arange(len(X))
    np.random.seed(42)

    if len(unique_participants) >= 3:
        print("[Preprocess Real] Performing Participant-Aware Group Split...")
        # Assign participants to train, val, test
        np.random.shuffle(unique_participants)
        n_p = len(unique_participants)
        train_p = unique_participants[:int(0.7 * n_p)]
        val_p = unique_participants[int(0.7 * n_p):int(0.85 * n_p)]
        test_p = unique_participants[int(0.85 * n_p):]

        train_idx = np.where(np.isin(groups, train_p))[0]
        val_idx = np.where(np.isin(groups, val_p))[0]
        test_idx = np.where(np.isin(groups, test_p))[0]
    else:
        print("[Preprocess Real] Performing Stratified Random Split...")
        np.random.shuffle(indices)
        train_end = int(0.70 * len(X))
        val_end = int(0.85 * len(X))
        train_idx = indices[:train_end]
        val_idx = indices[train_end:val_end]
        test_idx = indices[val_end:]

    X_train, y_train = X[train_idx], y[train_idx]
    X_val, y_val = X[val_idx], y[val_idx]
    X_test, y_test = X[test_idx], y[test_idx]

    print(f"[Preprocess Real] Train set: {X_train.shape}, Labels: {y_train.shape}")
    print(f"[Preprocess Real] Val set:   {X_val.shape}, Labels: {y_val.shape}")
    print(f"[Preprocess Real] Test set:  {X_test.shape}, Labels: {y_test.shape}")

    return (X_train, y_train), (X_val, y_val), (X_test, y_test)

if __name__ == "__main__":
    load_real_human_dataset()
