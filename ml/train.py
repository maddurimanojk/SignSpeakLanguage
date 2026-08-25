"""
Model Training & Artifact Generation Pipeline for SignSpeak AI
Trains TensorFlow/Keras sequence LSTM model on ISL landmark dataset and outputs all required artifacts.
"""

import os
import sys
import json
import numpy as np

# Set environment variables for isolated workspace execution
os.environ["KERAS_HOME"] = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "scratch", ".keras"))
os.makedirs(os.environ["KERAS_HOME"], exist_ok=True)

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "backend")))
sys.path.insert(0, os.path.abspath(os.path.dirname(__file__)))

from preprocess import load_and_preprocess_dataset
from app.models.sign_model import build_sequence_model
from app.utils.config import settings

def train_and_export_pipeline(epochs: int = 25, batch_size: int = 16):
    print("[Train Pipeline] Loading dataset and performing group split...")
    (X_train, y_train), (X_val, y_val), (X_test, y_test) = load_and_preprocess_dataset()

    import tensorflow as tf
    from tensorflow.keras.utils import to_categorical
    from sklearn.metrics import classification_report, confusion_matrix, accuracy_score, precision_recall_fscore_support
    import matplotlib.pyplot as plt
    import seaborn as sns

    num_classes = len(settings.SIGNS)
    y_train_cat = to_categorical(y_train, num_classes=num_classes)
    y_val_cat = to_categorical(y_val, num_classes=num_classes)
    y_test_cat = to_categorical(y_test, num_classes=num_classes)

    model = build_sequence_model(input_shape=(15, 42), num_classes=num_classes)
    if model is None:
        raise RuntimeError("Failed to initialize Keras sequence model.")

    model.summary()

    print(f"\n[Train Pipeline] Training Keras sequence model on {len(X_train)} samples for {epochs} epochs...")
    history = model.fit(
        X_train, y_train_cat,
        validation_data=(X_val, y_val_cat),
        epochs=epochs,
        batch_size=batch_size,
        verbose=1
    )

    # 1. Save Keras Trained Model
    model_output_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "backend", "app", "models"))
    os.makedirs(model_output_dir, exist_ok=True)
    model_path = os.path.join(model_output_dir, "isl_sign_model.keras")
    model.save(model_path)
    print(f"\n[Artifact Saved] Trained Keras model -> {model_path}")

    # 2. Save Class Names JSON
    class_names_path = os.path.join(model_output_dir, "class_names.json")
    with open(class_names_path, "w") as f:
        json.dump(settings.SIGNS, f, indent=2)
    print(f"[Artifact Saved] Class names JSON -> {class_names_path}")

    # 3. Plot and Save Training History
    plt.figure(figsize=(10, 4))
    plt.subplot(1, 2, 1)
    plt.plot(history.history['accuracy'], label='Train Accuracy')
    plt.plot(history.history['val_accuracy'], label='Val Accuracy')
    plt.title('SignSpeak AI Model Accuracy')
    plt.xlabel('Epoch')
    plt.ylabel('Accuracy')
    plt.legend()

    plt.subplot(1, 2, 2)
    plt.plot(history.history['loss'], label='Train Loss')
    plt.plot(history.history['val_loss'], label='Val Loss')
    plt.title('SignSpeak AI Model Loss')
    plt.xlabel('Epoch')
    plt.ylabel('Loss')
    plt.legend()
    plt.tight_layout()

    ml_dir = os.path.abspath(os.path.dirname(__file__))
    history_plot_path = os.path.join(ml_dir, "training_history.png")
    plt.savefig(history_plot_path)
    plt.close()
    print(f"[Artifact Saved] Training history plot -> {history_plot_path}")

    # 4. Evaluate Model on Test Set
    preds_prob = model.predict(X_test, verbose=0)
    preds = np.argmax(preds_prob, axis=1)

    acc = float(accuracy_score(y_test, preds))
    precision, recall, f1, _ = precision_recall_fscore_support(y_test, preds, average='macro', zero_division=0)
    prec_per_class, rec_per_class, f1_per_class, _ = precision_recall_fscore_support(y_test, preds, average=None, zero_division=0)

    per_class_acc = {}
    for idx, sign in enumerate(settings.SIGNS):
        mask = (y_test == idx)
        if np.sum(mask) > 0:
            cls_acc = float(np.sum(preds[mask] == idx) / np.sum(mask))
        else:
            cls_acc = 0.0
        per_class_acc[sign] = round(cls_acc * 100, 2)

    # 5. Save Metrics JSON
    metrics_dict = {
        "dataset_total_samples": len(X_train) + len(X_val) + len(X_test),
        "num_classes": num_classes,
        "train_samples": len(X_train),
        "val_samples": len(X_val),
        "test_samples": len(X_test),
        "overall_accuracy_pct": round(acc * 100, 2),
        "precision_macro_pct": round(float(precision) * 100, 2),
        "recall_macro_pct": round(float(recall) * 100, 2),
        "f1_score_macro_pct": round(float(f1) * 100, 2),
        "per_class_accuracy_pct": per_class_acc
    }

    metrics_path = os.path.join(ml_dir, "metrics.json")
    with open(metrics_path, "w") as f:
        json.dump(metrics_dict, f, indent=2)
    print(f"[Artifact Saved] Evaluation metrics JSON -> {metrics_path}")

    # 6. Generate and Save Confusion Matrix Plot
    cm = confusion_matrix(y_test, preds)
    plt.figure(figsize=(12, 10))
    sns.heatmap(cm, annot=True, fmt='d', cmap='Blues',
                xticklabels=settings.SIGNS,
                yticklabels=settings.SIGNS)
    plt.title("SignSpeak AI - Real ISL Model Confusion Matrix")
    plt.xlabel("Predicted Sign")
    plt.ylabel("True Sign")
    plt.tight_layout()

    cm_path = os.path.join(ml_dir, "confusion_matrix.png")
    plt.savefig(cm_path)
    plt.close()
    print(f"[Artifact Saved] Confusion matrix plot -> {cm_path}")

    print("\n================ MODEL TRAINING COMPLETED ================")
    print(f"Total Test Samples:  {len(X_test)}")
    print(f"Test Accuracy:       {acc * 100:.2f}%")
    print(f"Test Precision:      {precision * 100:.2f}%")
    print(f"Test Recall:         {recall * 100:.2f}%")
    print(f"Test F1 Score:       {f1 * 100:.2f}%")
    print("===========================================================\n")

if __name__ == "__main__":
    train_and_export_pipeline()
