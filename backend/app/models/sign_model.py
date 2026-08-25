"""
TensorFlow / Keras model definition for Indian Sign Language (ISL) recognition.
Supports sequence classification (LSTM / GRU) for dynamic signs and MLP / Dense architecture for static hand landmarks.
"""

import os
os.environ["KERAS_HOME"] = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..", "..", "scratch"))
os.makedirs(os.environ["KERAS_HOME"], exist_ok=True)

def build_sequence_model(input_shape=(15, 42), num_classes=27):
    try:
        import tensorflow as tf
        from tensorflow.keras.models import Sequential
        from tensorflow.keras.layers import LSTM, Dense, Dropout, BatchNormalization
        
        model = Sequential([
            LSTM(64, return_sequences=True, input_shape=input_shape),
            Dropout(0.2),
            BatchNormalization(),
            LSTM(64, return_sequences=False),
            Dropout(0.2),
            Dense(64, activation='relu'),
            Dense(num_classes, activation='softmax')
        ])
        
        model.compile(
            optimizer='adam',
            loss='categorical_crossentropy',
            metrics=['accuracy']
        )
        return model
    except ImportError:
        return None
