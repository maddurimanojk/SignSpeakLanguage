"""
Model Evaluation Script for SignSpeak AI (Phase 6)
Loads the trained Keras model, evaluates performance on test set, prints metrics,
and updates confusion_matrix.png and metrics.json.
"""

import os
import sys
import json
import numpy as np

# Set environment variables for isolated workspace execution
os.environ["KERAS_HOME"] = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "scratch", ".keras"))
os.makedirs(os.environ["KERAS_HOME"], exist_ok=True)

# Ensure root & backend imports work
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "backend")))
sys.path.insert(0, os.path.abspath(os.path.dirname(__file__)))

from preprocess import load_and_preprocess_dataset
from app.utils.config import settings

def run_evaluation():
    model_path = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "backend", "app", "models", "isl_sign_model.keras"))
    
    if not os.path.exists(model_path):
        print(f"[Evaluate Error] No trained model binary found at {model_path}.")
        return

    print("[Evaluate] Loading test set for model evaluation...")
    _, _, (X_test, y_test) = load_and_preprocess_dataset()

    try:
        import tensorflow as tf
        from sklearn.metrics import classification_report, confusion_matrix, accuracy_score, precision_recall_fscore_support
        import matplotlib.pyplot as plt
        import seaborn as sns

        model = tf.keras.models.load_model(model_path)
        
        preds_prob = model.predict(X_test, verbose=0)
        preds = np.argmax(preds_prob, axis=1)

        total_samples = len(y_test)
        acc = float(accuracy_score(y_test, preds)) * 100
        precision, recall, f1, _ = precision_recall_fscore_support(y_test, preds, average='macro', zero_division=0)
        precision *= 100
        recall *= 100
        f1 *= 100

        print("\nModel Evaluation")
        print("----------------")
        print(f"Test Samples: {total_samples}")
        print(f"Accuracy:     {acc:.2f}%")
        print(f"Precision:    {precision:.2f}%")
        print(f"Recall:       {recall:.2f}%")
        print(f"F1 Score:     {f1:.2f}%")
        print("----------------\n")

        # Per-class accuracy calculation
        per_class_acc = {}
        for idx, sign in enumerate(settings.SIGNS):
            mask = (y_test == idx)
            if np.sum(mask) > 0:
                cls_acc = float(np.sum(preds[mask] == idx) / np.sum(mask)) * 100
            else:
                cls_acc = 0.0
            per_class_acc[sign] = round(cls_acc, 2)

        # Update metrics.json
        ml_dir = os.path.abspath(os.path.dirname(__file__))
        metrics_dict = {
            "test_samples": total_samples,
            "accuracy_pct": round(acc, 2),
            "precision_pct": round(precision, 2),
            "recall_pct": round(recall, 2),
            "f1_score_pct": round(f1, 2),
            "per_class_accuracy_pct": per_class_acc
        }
        metrics_path = os.path.join(ml_dir, "metrics.json")
        with open(metrics_path, "w") as f:
            json.dump(metrics_dict, f, indent=2)

        # Save confusion matrix plot
        cm = confusion_matrix(y_test, preds)
        plt.figure(figsize=(12, 10))
        sns.heatmap(cm, annot=True, fmt='d', cmap='Blues',
                    xticklabels=settings.SIGNS,
                    yticklabels=settings.SIGNS)
        plt.title("SignSpeak AI - ISL Model Evaluation Confusion Matrix")
        plt.xlabel("Predicted Sign")
        plt.ylabel("True Sign")
        plt.tight_layout()

        cm_path = os.path.join(ml_dir, "confusion_matrix.png")
        plt.savefig(cm_path)
        plt.close()
        print(f"[Evaluate] Confusion matrix updated -> {cm_path}")
        print(f"[Evaluate] Metrics JSON updated -> {metrics_path}")

    except Exception as e:
        print(f"[Evaluate Error] Evaluation failed: {e}")

if __name__ == "__main__":
    run_evaluation()
