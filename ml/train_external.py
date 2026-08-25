"""
Training and evaluation script for SignSpeak AI External ISL Model.
Trains a 2-layer LSTM on MediaPipe hand landmark sequence tensors (15 frames x 42 features).
Applies participant-aware GroupKFold splitting and computes comprehensive metrics (Macro/Weighted F1, Recall, Precision).
"""

import os
import json
import numpy as np
import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt
from pathlib import Path
from sklearn.model_selection import GroupKFold
from sklearn.metrics import accuracy_score, precision_recall_fscore_support, confusion_matrix
import tensorflow as tf
from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import LSTM, Dense, Dropout, BatchNormalization
from tensorflow.keras.callbacks import EarlyStopping, ModelCheckpoint, ReduceLROnPlateau

PROCESSED_DIR = Path(__file__).parent.parent / "dataset_external_processed"
MODELS_DIR = Path(__file__).parent.parent / "backend" / "app" / "models"
ML_DIR = Path(__file__).parent

SEQUENCE_LENGTH = 15
NUM_FEATURES = 42

def load_processed_data():
    if not PROCESSED_DIR.exists():
        raise FileNotFoundError(f"Processed dataset directory {PROCESSED_DIR} does not exist.")

    npy_files = sorted(list(PROCESSED_DIR.glob("*.npy")))
    if len(npy_files) == 0:
        raise ValueError(f"No processed .npy files found in {PROCESSED_DIR}.")

    X, y, groups, class_names = [], [], [], []
    sign_to_label = {}

    for npy_path in npy_files:
        json_path = npy_path.with_suffix(".json")
        if not json_path.exists():
            continue

        with open(json_path, "r") as f:
            meta = json.load(f)

        sign = meta["sign"]
        p_id = meta.get("participant_id", "P_DEFAULT")

        if sign not in sign_to_label:
            sign_to_label[sign] = len(sign_to_label)
            class_names.append(sign)

        arr = np.load(npy_path)
        if arr.shape == (SEQUENCE_LENGTH, NUM_FEATURES):
            X.append(arr)
            y.append(sign_to_label[sign])
            groups.append(p_id)

    X = np.array(X, dtype=np.float32)
    y = np.array(y, dtype=np.int32)
    groups = np.array(groups)

    return X, y, groups, class_names

def build_lstm_model(num_classes: int):
    model = Sequential([
        LSTM(64, return_sequences=True, input_shape=(SEQUENCE_LENGTH, NUM_FEATURES)),
        BatchNormalization(),
        Dropout(0.3),
        LSTM(32, return_sequences=False),
        BatchNormalization(),
        Dropout(0.3),
        Dense(32, activation='relu'),
        Dense(num_classes, activation='softmax')
    ])

    model.compile(
        optimizer=tf.keras.optimizers.Adam(learning_rate=0.001),
        loss='sparse_categorical_crossentropy',
        metrics=['accuracy']
    )
    return model

def plot_history(history, save_path: Path):
    fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(12, 4))
    ax1.plot(history.history['accuracy'], label='Train Accuracy')
    ax1.plot(history.history['val_accuracy'], label='Val Accuracy')
    ax1.set_title('Model Accuracy')
    ax1.set_xlabel('Epoch')
    ax1.set_ylabel('Accuracy')
    ax1.legend()

    ax2.plot(history.history['loss'], label='Train Loss')
    ax2.plot(history.history['val_loss'], label='Val Loss')
    ax2.set_title('Model Loss')
    ax2.set_xlabel('Epoch')
    ax2.set_ylabel('Loss')
    ax2.legend()

    plt.tight_layout()
    plt.savefig(save_path, dpi=150)
    plt.close()

def plot_cm(cm, class_names, save_path: Path):
    fig, ax = plt.subplots(figsize=(8, 6))
    im = ax.imshow(cm, interpolation='nearest', cmap=plt.cm.Blues)
    ax.figure.colorbar(im, ax=ax)
    ax.set(xticks=np.arange(cm.shape[1]),
           yticks=np.arange(cm.shape[0]),
           xticklabels=class_names, yticklabels=class_names,
           title='Held-Out Test Set Confusion Matrix',
           ylabel='True Sign',
           xlabel='Predicted Sign')
    plt.setp(ax.get_xticklabels(), rotation=45, ha="right", rotation_mode="anchor")

    fmt = 'd'
    thresh = cm.max() / 2.
    for i in range(cm.shape[0]):
        for j in range(cm.shape[1]):
            ax.text(j, i, format(cm[i, j], fmt),
                    ha="center", va="center",
                    color="white" if cm[i, j] > thresh else "black")
    plt.tight_layout()
    plt.savefig(save_path, dpi=150)
    plt.close()

def train_and_evaluate():
    print("=================================================================")
    print("      Training & Evaluating External ISL LSTM Sequence Model     ")
    print("=================================================================")

    X, y, groups, class_names = load_processed_data()
    num_classes = len(class_names)
    print(f"Loaded {len(X)} total sequence samples across {num_classes} classes.")
    print(f"Classes: {class_names}")

    # Participant-Aware Train (70%) / Val (15%) / Test (15%) Split
    gkf = GroupKFold(n_splits=5)
    splits = list(gkf.split(X, y, groups))
    train_val_idx, test_idx = splits[0]

    X_train_val, y_train_val, g_train_val = X[train_val_idx], y[train_val_idx], groups[train_val_idx]
    X_test, y_test = X[test_idx], y[test_idx]

    # Split train_val into Train (80% of train_val = 64% total) and Val (20% of train_val = 16% total)
    gkf_inner = GroupKFold(n_splits=4)
    inner_splits = list(gkf_inner.split(X_train_val, y_train_val, g_train_val))
    train_idx, val_idx = inner_splits[0]

    X_train, y_train = X_train_val[train_idx], y_train_val[train_idx]
    X_val, y_val = X_train_val[val_idx], y_train_val[val_idx]

    print(f"\nSplit Distribution:")
    print(f"  - Train Set: {len(X_train)} samples")
    print(f"  - Validation Set: {len(X_val)} samples")
    print(f"  - Test Set: {len(X_test)} samples")

    MODELS_DIR.mkdir(parents=True, exist_ok=True)
    model_path = MODELS_DIR / "isl_external_model.keras"
    model_path_10 = MODELS_DIR / "isl_sign_model_10.keras"

    model = build_lstm_model(num_classes)

    callbacks = [
        EarlyStopping(monitor='val_loss', patience=15, restore_best_weights=True),
        ModelCheckpoint(filepath=str(model_path), monitor='val_accuracy', save_best_only=True),
        ReduceLROnPlateau(monitor='val_loss', factor=0.5, patience=5, min_lr=1e-5)
    ]

    print("\nStarting Training...")
    history = model.fit(
        X_train, y_train,
        validation_data=(X_val, y_val),
        epochs=80,
        batch_size=16,
        callbacks=callbacks,
        verbose=1
    )

    # Save also as primary 10-class model
    model.save(str(model_path))
    model.save(str(model_path_10))
    print(f"\nModel saved to {model_path} and {model_path_10}")

    # Plot training history
    plot_history(history, ML_DIR / "external_training_history.png")

    # Evaluate on held-out test set
    y_pred_prob = model.predict(X_test)
    y_pred = np.argmax(y_pred_prob, axis=1)

    acc = float(accuracy_score(y_test, y_pred))
    precision_macro, recall_macro, f1_macro, _ = precision_recall_fscore_support(y_test, y_pred, average='macro', zero_division=0)
    precision_weighted, recall_weighted, f1_weighted, _ = precision_recall_fscore_support(y_test, y_pred, average='weighted', zero_division=0)

    cm = confusion_matrix(y_test, y_pred)
    plot_cm(cm, class_names, ML_DIR / "external_confusion_matrix.png")

    # Per-class accuracy
    per_class_acc = {}
    for idx, c_name in enumerate(class_names):
        mask = (y_test == idx)
        if np.sum(mask) > 0:
            c_acc = float(accuracy_score(y_test[mask], y_pred[mask]))
            per_class_acc[c_name] = c_acc

    metrics = {
        "dataset_name": "INCLUDE-50 (AI4Bharat)",
        "total_samples": int(len(X)),
        "train_samples": int(len(X_train)),
        "val_samples": int(len(X_val)),
        "test_samples": int(len(X_test)),
        "num_classes": num_classes,
        "classes": class_names,
        "test_accuracy": acc,
        "macro_precision": float(precision_macro),
        "macro_recall": float(recall_macro),
        "macro_f1": float(f1_macro),
        "weighted_precision": float(precision_weighted),
        "weighted_recall": float(recall_weighted),
        "weighted_f1": float(f1_weighted),
        "per_class_accuracy": per_class_acc,
        "confusion_matrix": cm.tolist()
    }

    metrics_path = ML_DIR / "external_metrics.json"
    with open(metrics_path, "w") as f:
        json.dump(metrics, f, indent=2)

    print("\n=================================================================")
    print("            HELD-OUT TEST SET EVALUATION RESULTS                 ")
    print("=================================================================")
    print(f"Test Accuracy:       {acc * 100:.2f}%")
    print(f"Macro F1 Score:      {f1_macro:.4f}")
    print(f"Weighted F1 Score:   {f1_weighted:.4f}")
    print(f"Macro Precision:     {precision_macro:.4f}")
    print(f"Macro Recall:        {recall_macro:.4f}")
    print("\nPer-Class Accuracy:")
    for c_name, c_acc in per_class_acc.items():
        print(f"  - {c_name}: {c_acc * 100:.2f}%")
    print(f"\nMetrics report saved to: {metrics_path}")

if __name__ == "__main__":
    train_and_evaluate()
