# SignSpeak AI 🤟🗣️

**Real-Time AI-Driven Sign Language to Speech Translation System**

> *Effectiveness of Real-Time AI-Driven Sign Language to Speech Translation System Compared with Traditional Communication Methods in Improving Communication Accuracy and Accessibility*

---

## 📌 Project Overview
SignSpeak AI is an accessible, real-time mobile application and AI pipeline designed to translate **Indian Sign Language (ISL)** gestures into text and natural text-to-speech output. The system is engineered to evaluate communication accuracy, response time, task completion rate, and user satisfaction compared to traditional non-verbal communication methods (gestures, writing).

```
┌─────────────────┐       ┌─────────────────┐       ┌─────────────────┐       ┌─────────────────┐
│   Expo Camera   │ ────> │  Landmark Overlay│ ────> │ FastAPI Backend │ ────> │ Text-to-Speech  │
│  (Live Stream)  │       │  (21 Hand Joints)│       │  (LSTM / Demo)  │       │ (Sentence Audio)│
└─────────────────┘       └─────────────────┘       └─────────────────┘       └─────────────────┘
```

---

## ✨ Features
- **Real-Time Camera & Landmark Overlay**: High-frame-rate Expo camera feed with live 21-joint 3D SVG hand landmark skeleton.
- **ISL Initial Vocabulary**: Supports 27 core Indian Sign Language signs:
  `HELLO`, `THANK YOU`, `YES`, `NO`, `PLEASE`, `SORRY`, `HELP`, `WATER`, `FOOD`, `HOME`, `SCHOOL`, `HOSPITAL`, `GOOD`, `BAD`, `NAME`, `STOP`, `COME`, `GO`, `I`, `YOU`, `WE`, `WHAT`, `WHERE`, `HOW`, `WELCOME`, `GOOD MORNING`, `GOOD NIGHT`.
- **Temporal Debouncing & Sentence Builder**: Prevents duplicate word spam through frame throttling, confidence thresholds (0.75+), and temporal smoothing.
- **Text-to-Speech (TTS) Engine**: Device-native voice synthesis (`expo-speech`) with customizable speed, pitch, and volume.
- **Persistent Translation History**: SQLite / AsyncStorage local persistence with viewing, deletion, and clear-all features.
- **Interactive ISL Learning Dictionary**: Visual learning cards categorized into Basic, People, Food, Places, Emergency, and Common Phrases with practice mode.
- **Academic Research Suite**: Experiment logging tool (Participant ID, method, task, timings) and live comparative analytics dashboard (Accuracy %, Avg Response Time, Completion Rate, Satisfaction). *Initially shows "No data collected" until real trials are recorded.*
- **Dual-Mode AI Backend**: Seamless fallback to a clearly labeled `DEMO_MOCK` mode if no trained Keras binary is detected, ensuring 100% end-to-end functionality out of the box.

---

## 🛠️ Tech Stack
- **Mobile App**: React Native, Expo, TypeScript, Expo Router, Expo Camera, Expo Speech, React Native SVG, AsyncStorage.
- **Backend API**: Python 3.10+, FastAPI, Uvicorn, Pydantic, Pytest.
- **AI & ML Pipeline**: TensorFlow / Keras, OpenCV, MediaPipe, NumPy, Scikit-Learn.

---

## 🚀 Quick Start Guide (macOS)

### 1. Backend Setup
```bash
cd backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
```
*Verify backend health at `http://localhost:8000/health` or `http://<your-mac-ip>:8000/health`.*

### 2. Mobile App Setup
```bash
cd mobile
npm install
npm run dev
```

---

## 🧪 Testing DEMO Mode
If you haven't trained a model yet, SignSpeak AI automatically initializes in `DEMO_MOCK` mode.
1. Open the mobile app.
2. Navigate to **Live Translation**.
3. Point your camera at a hand or click "Start".
4. The AI Status badge will display `DEMO MODE`. Signs will be recognized, added to the sentence, and synthesized to speech!

---

## 🔬 Running the Machine Learning Pipeline
To collect real ISL sign data and train the TensorFlow LSTM model:
```bash
# 1. Collect Landmark Samples (Webcam)
python ml/collect_landmarks.py HELLO

# 2. Preprocess & Split Dataset
python ml/preprocess.py

# 3. Train Keras Model
python ml/train.py

# 4. Evaluate Model Metrics & Confusion Matrix
python ml/evaluate.py
```

---

## 📑 Documentation
- [`docs/SETUP.md`](docs/SETUP.md): Detailed installation and environment troubleshooting.
- [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md): System architecture and data flow diagrams.
- [`docs/API.md`](docs/API.md): FastAPI REST API specifications.
- [`docs/RESEARCH.md`](docs/RESEARCH.md): Research study design, hypothesis, and evaluation metrics.
