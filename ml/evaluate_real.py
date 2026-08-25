"""
Evaluation Tool for Real Human 10-Class ISL Model (Phase 6)
Evaluates backend/app/models/isl_sign_model_10.keras exclusively against held-out real human test data.
Outputs real_metrics.json, real_confusion_matrix.png, and prints evaluation metrics.
"""

import os
import sys
import json
import numpy as np

# Set KERAS_HOME for isolated workspace execution
os.environ["KERAS_HOME"] = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "scratch", ".keras"))
os.makedirs(os.environ["KERAS_HOME"], exist_ok=True)

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "backend")))
sys.path.insert(0, os.path.abspath(os.path.dirname(__file__)))

from preprocess_real import load_real_human_dataset
from app.utils.config import settings

def evaluate_real_model():
    model_path = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "backend", "app", "models", "isl_sign_model_10.keras"))
    
    if not os.path.exists(model_path):
        print(f"[Evaluate Real Error] No 10-class model binary found at {model_path}.")
        print("Run 'python ml/train_10.py' to train the 10-class model first.")
        return

    print("[Evaluate Real] Loading held-out test set from dataset_real/...")
    _, _, (X_test, y_test) = load_real_human_dataset()

    if len(X_test) == 0:
        print("[Evaluate Real Error] No held-out test samples found in dataset_real/.")
        return

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

        print("\n=======================================================")
        print("    SignSpeak AI - Real Human 10-Class Evaluation     ")
        print("=======================================================")
        print(f"Test Samples: {total_samples}")
        print(f"Accuracy:     {acc:.2f}%")
        print(f"Precision:    {precision:.2f}%")
        print(f"Recall:       {recall:.2f}%")
        print(f"F1 Score:     {f1:.2f}%")
        print("-------------------------------------------------------")

        per_class_metrics = {}
        prec_c, rec_c, f1_c, _ = precision_recall_fscore_support(y_test, preds, average=None, zero_division=0)

        for idx, sign in enumerate(settings.SIGNS_10):
            mask = (y_test == idx)
            cls_acc = float(np.sum(preds[mask] == idx) / np.sum(mask)) * 100 if np.sum(mask) > 0 else 0.0
            per_class_metrics[sign] = {
                "accuracy_pct": round(cls_acc, 2),
                "precision_pct": round(float(prec_c[idx]) * 100, 2),
                "recall_pct": round(float(rec_c[idx]) * 100, 2),
                "f1_score_pct": round(float(f1_c[idx]) * 100, 2)
            }
            print(f"{sign:<15} | Acc: {cls_acc:6.2f}% | Prec: {prec_c[idx]*100:6.2f}% | Rec: {rec_c[idx]*100:6.2f}% | F1: {f1_c[idx]*100:6.2f}%")

        ml_dir = os.path.abspath(os.path.dirname(__file__))
        metrics_dict = {
            "is_real_human_data": True,
            "test_samples": total_samples,
            "accuracy_pct": round(acc, 2),
            "precision_pct": round(precision, 2),
            "recall_pct": round(recall, 2),
            "f1_score_pct": round(f1, 2),
            "per_class_metrics": per_class_metrics
        }
        metrics_path = os.path.join(ml_dir, "real_metrics.json")
        with open(metrics_path, "w") as f:
            json.dump(metrics_dict, f, indent=2)

        # Confusion Matrix
        cm = confusion_matrix(y_test, preds)
        plt.figure(figsize=(10, 8))
        sns.heatmap(cm, annot=True, fmt='d', cmap='Blues',
                    xticklabels=settings.SIGNS_10,
                    yticklabels=settings.SIGNS_10)
        plt.title("SignSpeak AI - Real Human 10-Class Evaluation Confusion Matrix")
        plt.xlabel("Predicted Sign")
        plt.ylabel("True Sign")
        plt.tight_layout()

        cm_path = os.path.join(ml_dir, "real_confusion_matrix.png")
        plt.savefig(cm_path)
        plt.close()
        print(f"\n[Evaluate Real] Confusion matrix updated -> {cm_path}")
        print(f"[Evaluate Real] Metrics JSON updated -> {metrics_path}")
        print("=======================================================\n")

    except Exception as e:
        print(f"[Evaluate Real Error] Evaluation failed: {e}")

if __name__ == "__main__":
    evaluate_real_model()
