"""
Dataset Quality & Audit Tool for SignSpeak AI (Phase 3)
Audits dataset_real/ and strictly distinguishes REAL HUMAN DATA from SYNTHETIC DATA.
Reports class counts, sequence shapes, duplicate files, and participant distribution.
"""

import os
import sys
import json
import hashlib
import numpy as np

# Ensure backend imports work
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "backend")))
from app.utils.config import settings

def analyze_real_dataset(target_samples_per_class: int = 150):
    real_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "dataset_real"))
    synth_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "dataset"))

    print("\n=======================================================")
    print("        SignSpeak AI - Dataset Quality Audit           ")
    print("=======================================================")
    print(f"Target Vocabulary: {len(settings.SIGNS_10)} Core Signs")
    print(f"Target Per Class:  {target_samples_per_class} real human samples")
    print("-------------------------------------------------------")

    # 1. Inspect Synthetic Dataset
    synth_counts = {}
    total_synth = 0
    if os.path.exists(synth_dir):
        folders = [f for f in os.listdir(synth_dir) if os.path.isdir(os.path.join(synth_dir, f))]
        for f in folders:
            files = [file for file in os.listdir(os.path.join(synth_dir, f)) if file.endswith('.npy')]
            synth_counts[f] = len(files)
            total_synth += len(files)
    
    print(f"\n[SYNTHETIC DATASET STATUS] Path: {synth_dir}")
    print(f"Total Synthetic Files Found: {total_synth} files across {len(synth_counts)} classes")
    print("NOTE: Synthetic data is STRICTLY ISOLATED and NOT used for real model training.")

    # 2. Audit Real Human Dataset
    print(f"\n[REAL HUMAN DATASET STATUS] Path: {real_dir}")
    if not os.path.exists(real_dir):
        print("Status: dataset_real/ directory does NOT exist yet.")
        print("Run 'python ml/collect_landmarks.py' to collect real human samples.")
        return

    real_counts = {}
    missing_counts = {}
    invalid_sequences = []
    participant_dist = {}
    hashes = set()
    duplicates = 0
    total_real = 0

    for sign in settings.SIGNS_10:
        sign_folder = os.path.join(real_dir, sign.replace(" ", "_"))
        if not os.path.exists(sign_folder):
            real_counts[sign] = 0
            missing_counts[sign] = target_samples_per_class
            continue

        npy_files = sorted([f for f in os.listdir(sign_folder) if f.endswith(".npy")])
        real_counts[sign] = len(npy_files)
        total_real += len(npy_files)
        missing_counts[sign] = max(0, target_samples_per_class - len(npy_files))

        for npy_name in npy_files:
            npy_path = os.path.join(sign_folder, npy_name)
            meta_path = os.path.join(sign_folder, npy_name.replace(".npy", ".json"))

            # Check sequence array validity
            try:
                seq = np.load(npy_path)
                if seq.shape != (15, 42) or np.isnan(seq).any() or np.isinf(seq).any():
                    invalid_sequences.append(npy_path)

                # Check duplicates via md5 hash
                file_hash = hashlib.md5(seq.tobytes()).hexdigest()
                if file_hash in hashes:
                    duplicates += 1
                else:
                    hashes.add(file_hash)
            except Exception:
                invalid_sequences.append(npy_path)

            # Audit metadata
            if os.path.exists(meta_path):
                try:
                    with open(meta_path, "r") as mf:
                        meta = json.load(mf)
                        p_id = meta.get("participant", "UNKNOWN")
                        participant_dist[p_id] = participant_dist.get(p_id, 0) + 1
                except Exception:
                    pass

    print(f"\n--- REAL HUMAN DATASET METRICS ---")
    print(f"Total Valid Real Samples:  {total_real} files")
    print(f"Target Total (10 Classes): {target_samples_per_class * len(settings.SIGNS_10)} files")
    print(f"Invalid Sequences:         {len(invalid_sequences)}")
    print(f"Duplicate Sequence Files:  {duplicates}")

    print("\n--- SAMPLES PER CLASS ---")
    print(f"{'SIGN CLASS':<15} | {'REAL SAMPLES':<15} | {'MISSING TO TARGET':<20}")
    print("-" * 55)
    for sign in settings.SIGNS_10:
        c_count = real_counts.get(sign, 0)
        m_count = missing_counts.get(sign, target_samples_per_class)
        print(f"{sign:<15} | {c_count:<15} | {m_count:<20}")

    print("\n--- PARTICIPANT DISTRIBUTION ---")
    if participant_dist:
        for p_id, p_count in participant_dist.items():
            print(f"  - Participant '{p_id}': {p_count} samples ({p_count / float(total_real) * 100:.1f}%)")
    else:
        print("  - No participant metadata files found.")

    print("\n=======================================================\n")

if __name__ == "__main__":
    analyze_real_dataset()
