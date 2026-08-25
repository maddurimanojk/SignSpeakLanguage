# SignSpeak AI — Official Web Application & Research Platform

This directory contains the production-ready React + TypeScript + Vite + Tailwind CSS web application for **SignSpeak AI**:

> *"Effectiveness of Real-Time AI-Driven Sign Language to Speech Translation System Compared with Traditional Communication Methods in Improving Communication Accuracy and Accessibility"*

---

## Technical Stack

- **Framework**: React 18
- **Language**: TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Audio Output**: Web Speech Synthesis API

---

## Features & Page Structure

1. **Sticky Header & Navigation Bar**: Responsive navigation with section anchors and mobile drawer menu.
2. **Hero Section**: Key headline, subheadline, status badge ("Prototype & ML Pipeline Ready"), and interactive 21 Hand Landmark SVG visualization widget.
3. **Transparent Model Status Card**: Transparent academic integrity notice displaying current status (Software System Ready, Real Dataset Not Yet Collected, Real Model Pending, Final Accuracy Not Available).
4. **Problem Section**: Communication gap, limited accessibility, and interpreter dependence cards.
5. **Solution Pipeline**: 7-stage process flow from camera capture to speech synthesis.
6. **How It Works**: 4-step processing pipeline (Capture, Detect, Recognize, Speak).
7. **Technology Stack Grid**: Tech cards covering React Native, Expo, TypeScript, MediaPipe, OpenCV, Python, FastAPI, TensorFlow, Keras, LSTM, AsyncStorage, TTS, and Pytest/Jest testing.
8. **Interactive Web Demo Preview**: Browser mockup with 21-joint skeleton, interactive sign switcher (`HELLO`, `THANK YOU`, `WATER`, `HELP`, `PLEASE`, `STOP`), confidence meter, and Web Speech API audio playback button.
9. **Supported & Planned Vocabulary**: Filterable/searchable dictionary across all 27 ISL target signs categorized into Basic, People, Food, Places, Emergency, and Common Phrases.
10. **Research Section**: Academic protocol, comparison methods, and experimental workflow diagram.
11. **Results Dashboard**: Performance cards transparently stating "Data collection pending / No experimental data available yet".
12. **Development Roadmap Timeline**: Phases 1 through 6 highlighting current status.
13. **Research Methodology**: Detailed explanation of Participant-Aware Group Splitting (`GroupKFold`) and synthetic vs. real dataset isolation.
14. **System Architecture Diagram**: 11-node dataflow diagram.
15. **Research Comparison Table**: Feature matrix comparing Traditional Gesture, Written Note Communication, and SignSpeak AI.
16. **Future Scope**: Roadmap for vocabulary expansion, multi-hand tracking, edge inference, and bidirectional speech-to-sign avatar synthesis.
17. **About & Academic Credentials**: Academic research metadata with configurable placeholders (`[Student Name]`, `[Student ID]`, `[Department]`, `[Institution]`, `[Supervisor]`).

---

## Getting Started

### 1. Installation
Navigate to the `web` directory and install dependencies:
```bash
cd web
npm install
```

### 2. Running Development Server
Start the local Vite development server:
```bash
npm run dev
```
Open your browser at `http://localhost:3000` (or the port displayed in terminal).

### 3. Production Build & Type Checking
To compile TypeScript and build the production bundle:
```bash
npm run build
```

### 4. Preview Production Build
To preview the compiled production build locally:
```bash
npm run preview
```

---

## Connecting to Backend API

The web demo preview operates in interactive client-side preview mode. To connect the web app to the live FastAPI backend, ensure the backend is running at `http://localhost:8000`:

```bash
./backend/venv_py310/bin/uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload --app-dir backend
```
