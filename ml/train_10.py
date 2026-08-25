"""
10-Class Keras Model Training Pipeline for Real Human Dataset (Phase 5)
Trains TensorFlow sequence LSTM model on real human ISL dataset and outputs model artifacts.
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
from app.models.sign_model import build_sequence_model
from app.utils.config import settings

def train_10_class_model(epochs: int = 30, batch_size: int = 16):
    print("[Train 10-Class] Loading real human dataset...")
    (X_train, y_train), (X_val, y_val), (X_test, y_test) = load_real_human_dataset()

    if len(X_train) == 0:
        print("[Train 10-Class Error] No real human dataset samples found in dataset_real/.")
        print("Run 'python ml/collect_landmarks.py' to collect real human samples first!")
        return

    import tensorflow as tf
    from tensorflow.keras.utils import to_categorical
    from tensorflow.keras.callbacks import EarlyStopping, ModelCheckpoint, ReduceLROnPlateau
    from sklearn.metrics import classification_report, confusion_matrix, accuracy_score, precision_recall_fscore_support
    import matplotlib.pyplot as plt
    import seaborn as sns

    num_classes = len(settings.SIGNS_10)
    y_train_cat = to_categorical(y_train, num_classes=num_classes)
    y_val_cat = to_categorical(y_val, num_classes=num_classes)
    y_test_cat = to_categorical(y_test, num_classes=num_classes)

    model = build_sequence_model(input_shape=(15, 42), num_classes=num_classes)
    if model is None:
        raise RuntimeError("Failed to initialize Keras 10-class model.")

    model.summary()

    # Callbacks
    model_output_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "backend", "app", "models"))
    os.makedirs(model_output_dir, exist_ok=True)
    model_path = os.path.join(model_output_dir, "isl_sign_model_10.keras")

    callbacks = [
        EarlyStopping(monitor='val_loss', patience=10, restore_best_weights=True, verbose=1),
        ModelCheckpoint(filepath=model_path, monitor='val_accuracy', save_best_only=True, verbose=1),
        ReduceLROnPlateau(monitor='val_loss', factor=0.5, patience=5, verbose=1)
    ]

    print(f"\n[Train 10-Class] Training Keras model on {len(X_train)} real samples for {epochs} epochs...")
    history = model.fit(
        X_train, y_train_cat,
        validation_data=(X_val, y_val_cat),
        epochs=epochs,
        batch_size=batch_size,
        callbacks=callbacks,
        verbose=1
    )

    # 1. Save Trained Model & Class Names
    model.save(model_path)
    print(f"\n[Artifact Saved] Trained 10-class model -> {model_path}")

    class_names_path = os.path.join(model_output_dir, "class_names_10.json")
    with open(class_names_path, "w") as f:
        json.dump(settings.SIGNS_10, f, indent=2)
    print(f"[Artifact Saved] 10-class labels JSON -> {class_names_path}")

    # 2. Save Training History Plot
    ml_dir = os.path.abspath(os.path.dirname(__file__))
    plt.figure(figsize=(10, 4))
    plt.subplot(1, 2, 1)
    plt.plot(history.history['accuracy'], label='Train Accuracy')
    plt.plot(history.history['val_accuracy'], label='Val Accuracy')
    plt.title('SignSpeak AI (10-Class Real Model) Accuracy')
    plt.xlabel('Epoch')
    plt.ylabel('Accuracy')
    plt.legend()

    plt.subplot(1, 2, 2)
    plt.plot(history.history['loss'], label='Train Loss')
    plt.plot(history.history['val_loss'], label='Val Loss')
    plt.title('SignSpeak AI (10-Class Real Model) Loss')
    plt.xlabel('Epoch')
    plt.ylabel('Loss')
    plt.legend()
    plt.tight_layout()

    history_plot_path = os.path.join(ml_dir, "real_training_history.png")
    plt.savefig(history_plot_path)
    plt.close()
    print(f"[Artifact Saved] Real training history plot -> {history_plot_path}")

    # 3. Evaluate on Held-Out Test Set
    if len(X_test) > 0:
        preds_prob = model.predict(X_test, verbose=0)
        preds = np.argmax(preds_prob, axis=1)

        acc = float(accuracy_score(y_test, preds)) * 100
        precision, recall, f1, _ = precision_recall_fscore_support(y_test, preds, average='macro', zero_division=0)
        precision *= 100
        recall *= 100
        f1 *= 100

        per_class_acc = {}
        for idx, sign in enumerate(settings.SIGNS_10):
            mask = (y_test == idx)
            if np.sum(mask) > 0:
                cls_acc = float(np.sum(preds[mask] == idx) / np.sum(mask)) * 100
            else:
                cls_acc = 0.0
            per_class_acc[sign] = round(cls_acc, 2)

        metrics_dict = {
            "is_real_human_data": True,
            "num_classes": num_classes,
            "test_samples": len(X_test),
            "accuracy_pct": round(acc, 2),
            "precision_macro_pct": round(precision, 2),
            "recall_macro_pct": round(recall, 2),
            "f1_score_macro_pct": round(f1, 2),
            "per_class_accuracy_pct": per_class_acc
        }

        metrics_path = os.path.join(ml_dir, "real_metrics.json")
        with open(metrics_path, "w") as f:
            json.dump(metrics_dict, f, indent=2)
        print(f"[Artifact Saved] Real metrics JSON -> {metrics_path}")

        # Confusion Matrix
        cm = confusion_matrix(y_test, preds)
        plt.figure(figsize=(10, 8))
        sns.heatmap(cm, annot=True, fmt='d', cmap='Blues',
                    xticklabels=settings.SIGNS_10,
                    yticklabels=settings.SIGNS_10)
        plt.title("SignSpeak AI - 10-Class Real Model Confusion Matrix")
        plt.xlabel("Predicted Sign")
        plt.ylabel("True Sign")
        plt.tight_layout()

        cm_path = os.path.join(ml_dir, "real_confusion_matrix.png")
        plt.savefig(cm_path)
        plt.close()
        print(f"[Artifact Saved] Real confusion matrix -> {cm_path}")

        print("\n================ 10-CLASS REAL MODEL TRAINING COMPLETED ================")
        print(f"Total Test Samples:  {len(X_test)}")
        print(f"Test Accuracy:       {acc:.2f}%")
        print(f"Test Precision:      {precision:.2f}%")
        print(f"Test Recall:         {recall:.2f}%")
        print(f"Test F1 Score:       {f1:.2f}%")
        print("========================================================================\n")

if __name__ == "__main__":
    train_10_class_model()
