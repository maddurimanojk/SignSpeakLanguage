"""
Audit script for external Indian Sign Language (ISL) dataset.
Scans data_external/ directory for image/video files, inspects metadata, checks file integrity,
class distribution, image dimensions, corrupt/duplicate files, and split metadata.
"""

import os
import json
import hashlib
from pathlib import Path
import cv2

DATA_EXTERNAL_DIR = Path(__file__).parent.parent / "data_external"
RAW_DIR = DATA_EXTERNAL_DIR / "raw"

def get_file_md5(filepath: Path) -> str:
    hasher = hashlib.md5()
    with open(filepath, 'rb') as f:
        for chunk in iter(lambda: f.read(65536), b''):
            hasher.update(chunk)
    return hasher.hexdigest()

def audit_dataset():
    print("=================================================================")
    print("              Auditing External ISL Dataset                      ")
    print("=================================================================")

    if not RAW_DIR.exists():
        print(f"Directory {RAW_DIR} does not exist. Please download dataset first.")
        return

    # Discover image and video files
    valid_extensions = {".jpg", ".jpeg", ".png", ".bmp", ".mp4", ".avi", ".mov"}
    sample_files = [p for p in RAW_DIR.rglob("*") if p.suffix.lower() in valid_extensions]

    total_files = len(sample_files)
    print(f"Total dataset files found: {total_files}")

    class_counts = {}
    corrupt_files = []
    duplicate_files = []
    seen_hashes = {}
    dimensions = set()

    for idx, s_path in enumerate(sample_files):
        # Class folder is parent directory name
        class_name = s_path.parent.name.upper()
        class_counts[class_name] = class_counts.get(class_name, 0) + 1

        # File hash check for duplicates
        file_hash = get_file_md5(s_path)
        if file_hash in seen_hashes:
            duplicate_files.append((str(s_path), str(seen_hashes[file_hash])))
        else:
            seen_hashes[file_hash] = str(s_path)

        # Integrity Check
        if s_path.suffix.lower() in {".jpg", ".jpeg", ".png", ".bmp"}:
            img = cv2.imread(str(s_path))
            if img is None:
                corrupt_files.append(str(s_path))
            else:
                h, w, _ = img.shape
                dimensions.add((w, h))
        else:
            cap = cv2.VideoCapture(str(s_path))
            if not cap.isOpened():
                corrupt_files.append(str(s_path))
            else:
                w = int(cap.get(cv2.CAP_PROP_FRAME_WIDTH))
                h = int(cap.get(cv2.CAP_PROP_FRAME_HEIGHT))
                if w > 0 and h > 0:
                    dimensions.add((w, h))
                else:
                    corrupt_files.append(str(s_path))
            cap.release()

    # Report Summary
    print("\n--- DATASET AUDIT SUMMARY ---")
    print(f"Total Files: {total_files}")
    print(f"Total Distinct Classes: {len(class_counts)}")
    print(f"Corrupt Files: {len(corrupt_files)}")
    print(f"Duplicate Files: {len(duplicate_files)}")
    print(f"Observed Image Dimensions (W x H): {list(dimensions)}")

    print("\n--- CLASS DISTRIBUTION ---")
    for c_name, count in sorted(class_counts.items()):
        print(f"  Class '{c_name}': {count} samples")

    # Save audit report to JSON
    audit_report = {
        "total_files": total_files,
        "total_classes": len(class_counts),
        "corrupt_files_count": len(corrupt_files),
        "duplicate_files_count": len(duplicate_files),
        "class_counts": class_counts,
        "dimensions": [list(d) for d in dimensions]
    }

    report_path = DATA_EXTERNAL_DIR / "audit_report.json"
    with open(report_path, "w") as f:
        json.dump(audit_report, f, indent=2)

    print(f"\nAudit report saved to: {report_path}")

if __name__ == "__main__":
    audit_dataset()
