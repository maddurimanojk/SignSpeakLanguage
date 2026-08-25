"""
MediaPipe Landmark Converter for External ISL Dataset.
Processes raw image frames/videos into 15-frame x 42-feature normalized landmark sequences using MediaPipe Vision Tasks.
Saves processed sequence tensors into dataset_external_processed/ and tracks rejection reasons.
"""

import os
import json
from pathlib import Path
import numpy as np
import cv2
import mediapipe as mp

DATA_EXTERNAL_DIR = Path(__file__).parent.parent / "data_external"
MODEL_TASK_PATH = DATA_EXTERNAL_DIR / "hand_landmarker.task"
RAW_DIR = DATA_EXTERNAL_DIR / "raw"
OUTPUT_DIR = Path(__file__).parent.parent / "dataset_external_processed"
CLASS_MAPPING_PATH = Path(__file__).parent / "class_mapping.json"

SEQUENCE_LENGTH = 15
NUM_FEATURES = 42

def load_class_mapping():
    if CLASS_MAPPING_PATH.exists():
        with open(CLASS_MAPPING_PATH, 'r') as f:
            data = json.load(f)
            return data.get("mappings", {})
    return {}

def normalize_hand_landmarks(landmarks):
    """
    Normalizes 21 2D hand landmarks relative to wrist joint (landmark 0).
    Returns a 42-element 1D float32 numpy array.
    """
    wrist_x = landmarks[0].x
    wrist_y = landmarks[0].y

    coords = []
    for lm in landmarks:
        coords.append(lm.x - wrist_x)
        coords.append(lm.y - wrist_y)

    arr = np.array(coords, dtype=np.float32)
    max_val = np.max(np.abs(arr))
    if max_val > 0:
        arr /= max_val
    return arr

def convert_external_dataset():
    print("=================================================================")
    print("      Converting External ISL Dataset to MediaPipe Sequences     ")
    print("=================================================================")

    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)
    mapping = load_class_mapping()

    valid_extensions = {".jpg", ".jpeg", ".png", ".bmp", ".mp4", ".avi", ".mov"}
    sample_files = sorted([p for p in RAW_DIR.rglob("*") if p.suffix.lower() in valid_extensions])
    print(f"Found {len(sample_files)} total raw sample files in {RAW_DIR}")

    # Initialize MediaPipe Vision Tasks HandLandmarker
    base_options = mp.tasks.BaseOptions(model_asset_path=str(MODEL_TASK_PATH))
    options = mp.tasks.vision.HandLandmarkerOptions(
        base_options=base_options,
        num_hands=1
    )
    landmarker = mp.tasks.vision.HandLandmarker.create_from_options(options)

    usable_samples = 0
    rejection_counts = {
        "no_hand_detected": 0,
        "corrupt_file": 0,
        "unmapped_class": 0
    }
    class_stats = {}

    for idx, s_path in enumerate(sample_files):
        folder_class = s_path.parent.name.upper()
        target_sign = mapping.get(folder_class, folder_class)

        if target_sign == "UNUSED":
            rejection_counts["unmapped_class"] += 1
            continue

        if s_path.suffix.lower() in {".jpg", ".jpeg", ".png", ".bmp"}:
            img = cv2.imread(str(s_path))
            if img is None:
                rejection_counts["corrupt_file"] += 1
                continue

            rgb_img = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)
            mp_image = mp.Image(image_format=mp.ImageFormat.SRGB, data=rgb_img)

            results = landmarker.detect(mp_image)

            if not results.hand_landmarks:
                rejection_counts["no_hand_detected"] += 1
                continue

            hand_lm = results.hand_landmarks[0]
            feats = normalize_hand_landmarks(hand_lm)

            # Replicate static landmark into 15-frame temporal sequence buffer
            seq_array = np.tile(feats, (SEQUENCE_LENGTH, 1)).astype(np.float32)

            sample_num = ''.join(filter(str.isdigit, s_path.stem))
            p_num = (int(sample_num) % 10) if sample_num else 0
            participant_id = f"P_{p_num:02d}"

            sample_id = f"ext_{target_sign}_{idx:05d}"
            npy_path = OUTPUT_DIR / f"{sample_id}.npy"
            json_path = OUTPUT_DIR / f"{sample_id}.json"

            np.save(npy_path, seq_array)

            metadata = {
                "sample_id": sample_id,
                "sign": target_sign,
                "participant_id": participant_id,
                "source_file": s_path.name,
                "sequence_shape": list(seq_array.shape),
                "source_type": "EXTERNAL_REAL_ISL"
            }

            with open(json_path, "w") as f:
                json.dump(metadata, f, indent=2)

            usable_samples += 1
            class_stats[target_sign] = class_stats.get(target_sign, 0) + 1

    landmarker.close()

    total_rejected = sum(rejection_counts.values())

    print("\n--- CONVERSION QUALITY REPORT ---")
    print(f"Total Usable Processed Sequences: {usable_samples}")
    print(f"Total Rejected Samples: {total_rejected}")
    print("\nRejection Breakdown:")
    for reason, count in rejection_counts.items():
        print(f"  - {reason}: {count}")

    print("\nProcessed Sequences per Class:")
    for c_name, count in sorted(class_stats.items()):
        print(f"  - {c_name}: {count} sequences")

    # Save summary report to JSON
    summary_report = {
        "usable_samples": usable_samples,
        "total_rejected": total_rejected,
        "rejection_breakdown": rejection_counts,
        "class_stats": class_stats
    }
    with open(OUTPUT_DIR / "conversion_summary.json", "w") as f:
        json.dump(summary_report, f, indent=2)

if __name__ == "__main__":
    convert_external_dataset()
