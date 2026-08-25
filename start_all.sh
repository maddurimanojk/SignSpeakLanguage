#!/bin/bash
# SignSpeak AI - Automated 1-Click Launch Script

echo "================================================================="
echo "           SignSpeak AI - Launching System Services              "
echo "================================================================="

# Get Mac local Wi-Fi IP address
MAC_IP=$(ipconfig getifaddr en0 2>/dev/null || ipconfig getifaddr en1 2>/dev/null || echo "127.0.0.1")

echo "✔ Detected Mac IP Address: http://${MAC_IP}:8000"
echo "✔ Starting Python FastAPI AI Backend Server..."

# Start FastAPI backend in background
cd /Users/apple/.gemini/antigravity/scratch/SignSpeakAI
export PYTHONPATH=backend
./backend/venv_py310/bin/uvicorn app.main:app --host 0.0.0.0 --port 8000 &
BACKEND_PID=$!

sleep 2

echo "✔ Starting Expo Mobile Development Server (SDK 57)..."
cd /Users/apple/.gemini/antigravity/scratch/SignSpeakAI/mobile
npx expo start --host lan -c

# Cleanup backend on exit
kill $BACKEND_PID 2>/dev/null
