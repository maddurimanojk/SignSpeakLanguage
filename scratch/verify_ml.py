import os
import sys
import json
import numpy as np

os.environ["KERAS_HOME"] = os.path.abspath(os.path.join(os.path.dirname(__file__), ".keras"))
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "backend")))
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "ml")))

from app.utils.config import settings

def run_verification():
    dataset_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "dataset"))
    model_path = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "backend", "app", "models", "isl_sign_model.keras"))
    
    print("=== 1. DATASET ANALYSIS ===")
    print(f"Dataset Path: {dataset_dir}")
    print(f"Configured Classes ({len(settings.SIGNS)}): {settings.SIGNS}")

    class_counts = {}
    total_files = 0
    if os.path.exists(dataset_dir):
        folders = sorted([f for f in os.listdir(dataset_dir) if os.path.isdir(os.path.join(dataset_dir, f))])
        print(f"Dataset Folders Found: {len(folders)}")
        for f in folders:
            fpath = os.path.join(dataset_dir, f)
            files = [file for file in os.listdir(fpath) if file.endswith('.npy')]
            class_counts[f] = len(files)
            total_files += len(files)
    
    print(f"Total Dataset Files: {total_files}")
    for cls, count in class_counts.items():
        print(f"  - {cls}: {count} files")

    print("\n=== 2. MODEL FILE INSPECTION ===")
    print(f"Model Path: {model_path}")
    if os.path.exists(model_path):
        size_bytes = os.path.getsize(model_path)
        print(f"File Size: {size_bytes / 1024:.2f} KB ({size_bytes} bytes)")
        try:
            import tensorflow as tf
            model = tf.keras.models.load_model(model_path)
            print("Model Load Status: SUCCESSFUL")
            print(f"Input Shape: {model.input_shape}")
            print(f"Output Shape: {model.output_shape}")
            print(f"Number of Layers: {len(model.layers)}")
            print(f"Total Parameters: {model.count_params()}")
            model.summary()
        except Exception as e:
            print(f"Model Load Status: FAILED ({e})")
    else:
        print("Model Load Status: NOT FOUND")

    print("\n=== 3. METRICS JSON & ARTIFACTS ===")
    metrics_path = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "ml", "metrics.json"))
    if os.path.exists(metrics_path):
        with open(metrics_path, "r") as f:
            metrics = json.load(f)
        print("Metrics Content:")
        print(json.dumps(metrics, indent=2))
    else:
        print("metrics.json NOT FOUND")

if __name__ == "__main__":
    run_verification()
