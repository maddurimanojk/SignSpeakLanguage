"""
Dataset Generator & Extractor for SignSpeak AI (ISL 27-Sign Vocabulary)
Generates landmark sequence samples (.npy) per sign class with realistic spatial-temporal variations.
"""

import os
import sys
import numpy as np

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "backend")))
from app.utils.config import settings

def generate_isl_dataset(samples_per_sign: int = 40, sequence_length: int = 15):
    dataset_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "dataset"))
    os.makedirs(dataset_dir, exist_ok=True)
    
    print(f"[Dataset Generator] Generating landmark dataset for {len(settings.SIGNS)} ISL sign classes...")
    print(f"[Dataset Generator] Samples per sign: {samples_per_sign} | Sequence length: {sequence_length} frames")

    np.random.seed(42) # Fixed seed for reproducible dataset creation

    total_samples = 0
    class_sample_counts = {}

    for sign_idx, sign_name in enumerate(settings.SIGNS):
        sign_dir_name = sign_name.replace(" ", "_")
        sign_folder = os.path.join(dataset_dir, sign_dir_name)
        os.makedirs(sign_folder, exist_ok=True)

        # Base gesture archetype pattern per sign index
        base_x = (sign_idx % 5) * 0.15 - 0.3
        base_y = (sign_idx // 5) * 0.15 - 0.3
        base_freq = 0.5 + (sign_idx % 4) * 0.3

        count = 0
        for sample_idx in range(samples_per_sign):
            # Session variation (simulating different users/hand positions)
            user_scale = 0.8 + np.random.uniform(-0.15, 0.15)
            user_tilt = np.random.uniform(-0.1, 0.1)

            sequence = []
            for frame_idx in range(sequence_length):
                t = frame_idx / float(sequence_length)
                
                # Wrist movement (landmark 0)
                wx = base_x + np.sin(t * np.pi * base_freq) * 0.08 + user_tilt
                wy = base_y + np.cos(t * np.pi * base_freq) * 0.08
                
                # 21 2D landmarks (42 floats)
                landmarks_2d = []
                landmarks_2d.extend([wx, wy]) # Point 0 (Wrist)

                # 5 Finger configurations
                for finger_idx in range(5):
                    finger_angle = (finger_idx - 2) * 0.35 + user_tilt
                    for joint_idx in range(1, 5):
                        length = joint_idx * 0.04 * user_scale
                        jx = wx + np.sin(finger_angle + t * 0.2) * length
                        jy = wy - np.cos(finger_angle + t * 0.2) * length
                        # Add slight Gaussian noise simulating real MediaPipe landmark jitter
                        jx += np.random.normal(0, 0.003)
                        jy += np.random.normal(0, 0.003)
                        landmarks_2d.extend([jx, jy])

                sequence.append(landmarks_2d)

            np_seq = np.array(sequence, dtype=np.float32)
            file_path = os.path.join(sign_folder, f"sample_{sample_idx:03d}.npy")
            np.save(file_path, np_seq)
            count += 1
            total_samples += 1

        class_sample_counts[sign_name] = count

    print(f"[Dataset Generator] Successfully generated {total_samples} dataset samples across {len(settings.SIGNS)} ISL sign classes!")
    return total_samples, class_sample_counts

if __name__ == "__main__":
    generate_isl_dataset()
