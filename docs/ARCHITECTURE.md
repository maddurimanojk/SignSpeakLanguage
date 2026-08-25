# System Architecture - SignSpeak AI

## 🏗️ High-Level System Architecture

SignSpeak AI employs a decoupled monorepo architecture separating the client-side mobile UI/sensor layer from the Python AI inference engine.

```
┌───────────────────────────────────────────────────────────────────────────────┐
│                           CLIENT LAYER (Mobile Expo App)                      │
│                                                                               │
│  ┌──────────────┐     ┌───────────────────────┐     ┌──────────────────────┐  │
│  │ Expo Camera  │ ──> │ Hand Landmark Engine  │ ──> │ SVG Skeleton Overlay │  │
│  └──────────────┘     └───────────┬───────────┘     └──────────────────────┘  │
│                                   │                                           │
│                                   ▼ Throttled Landmark Stream                 │
│                       ┌───────────────────────┐                               │
│                       │ REST API Client       │                               │
│                       └───────────┬───────────┘                               │
└───────────────────────────────────┼───────────────────────────────────────────┘
                                    │
                                    ▼ HTTP POST /predict
┌───────────────────────────────────┼───────────────────────────────────────────┐
│                           BACKEND INFERENCE LAYER                             │
│                                   │                                           │
│                       ┌───────────┴───────────┐                               │
│                       │ FastAPI Controller    │                               │
│                       └───────────┬───────────┘                               │
│                                   │                                           │
│                       ┌───────────▼───────────┐                               │
│                       │ Feature Normalizer    │                               │
│                       └───────────┬───────────┘                               │
│                                   │                                           │
│                        ┌──────────┴──────────┐                                │
│                        │ Model Router        │                                │
│                        └────┬────────────┬───┘                                │
│                             │            │                                    │
│       Model Binary Present  │            │ Model Binary Missing               │
│                             ▼            ▼                                    │
│               ┌───────────────┐        ┌───────────────┐                      │
│               │ Keras LSTM    │        │ Demo / Mock   │                      │
│               │ Neural Net    │        │ Engine        │                      │
│               └───────┬───────┘        └───────┬───────┘                      │
│                       │                        │                              │
│                       └────────────┬───────────┘                              │
│                                    │                                          │
│                                    ▼ JSON { sign, confidence, is_valid }      │
└────────────────────────────────────┼──────────────────────────────────────────┘
                                     │
┌────────────────────────────────────┼──────────────────────────────────────────┐
│                            OUTPUT & TEMPORAL ENGINE                           │
│                                    │                                          │
│  ┌──────────────┐      ┌───────────▼───────────┐     ┌─────────────────────┐  │
│  │ Text-to-     │ <─── │ Sentence Builder      │ <── │ Temporal Debouncer  │  │
│  │ Speech (TTS) │      │ (Consecutive Signs)   │     │ (Smoothing Buffer)  │  │
│  └──────────────┘      └───────────────────────┘     └─────────────────────┘  │
└───────────────────────────────────────────────────────────────────────────────┘
```

## 📐 Feature Normalization Pipeline
1. **Wrist Origin Alignment**: Shift all 21 hand points $(x_i, y_i)$ relative to the wrist origin $(x_0, y_0)$:
   $$x'_i = x_i - x_0, \quad y'_i = y_i - y_0$$
2. **Scale Invariance**: Divide all shifted coordinates by the maximum absolute coordinate distance $M$:
   $$\hat{x}_i = \frac{x'_i}{\max(|x'|, |y'|)}, \quad \hat{y}_i = \frac{y'_i}{\max(|x'|, |y'|)}$$
3. **Flat Vector**: Reshape to a 42-element float array for real-time network evaluation.

## ⏱️ Temporal Smoothing & Debouncing
- **Prediction Frequency**: Throttled to 3-5 FPS (every ~250ms) to conserve battery and bandwidth.
- **Confidence Filter**: Predictions below `CONFIDENCE_THRESHOLD` (default 0.75) are discarded.
- **Deduplication Buffer**: If consecutive frames return the same sign within 1.5 seconds, the duplicate word insertion is suppressed.
