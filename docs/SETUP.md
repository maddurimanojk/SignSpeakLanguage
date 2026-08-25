# Setup & Installation Guide - SignSpeak AI

This document provides step-by-step instructions for running SignSpeak AI on macOS.

---

## 📋 Prerequisites
- **Node.js**: v18.0 or higher (`node -v`)
- **Python**: v3.9 or higher (`python3 --version`)
- **Git**: Installed
- **Expo Go App** (optional, if testing on physical iPhone/Android device)

---

## 🐍 1. Python Backend Installation

```bash
# Navigate to the backend directory
cd /Users/apple/.gemini/antigravity/scratch/SignSpeakAI/backend

# Create virtual environment
python3 -m venv venv

# Activate virtual environment
source venv/bin/activate

# Upgrade pip
pip install --upgrade pip

# Install backend dependencies
pip install -r requirements.txt

# Launch FastAPI development server
uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
```

---

## 📱 2. Mobile App Installation

```bash
# Navigate to the mobile directory
cd /Users/apple/.gemini/antigravity/scratch/SignSpeakAI/mobile

# Install Node dependencies
npm install

# Start Expo development server
npx expo start
```

---

## 🌐 3. Configuring Physical Device IP Address

When running on a physical phone using Expo Go over Wi-Fi:
1. Find your Mac's local IP address:
   ```bash
   ipconfig getifaddr en0
   ```
   *(Example output: `192.168.1.50`)*

2. In the SignSpeak AI mobile app:
   - Go to **Settings**.
   - Under **Backend Server Configuration**, update the Server URL to:
     `http://192.168.1.50:8000`
   - Tap **Save & Test Connection**.

---

## 🧪 4. Running Tests

### Backend Unit & Endpoint Tests
```bash
cd backend
source venv/bin/activate
pytest tests/test_api.py
```

### Mobile Frontend Unit Tests
```bash
cd mobile
npm test
```
