#!/bin/bash
# SignSpeak AI - Instant Live Online Deployment Script

echo "================================================================="
echo "        SignSpeak AI - Starting Live Online Services             "
echo "================================================================="

# Start FastAPI backend in background
cd /Users/apple/.gemini/antigravity/scratch/SignSpeakAI
export PYTHONPATH=backend
./backend/venv_py310/bin/uvicorn app.main:app --host 0.0.0.0 --port 8000 &
BACKEND_PID=$!

sleep 3

echo ""
echo "✔ Starting Public HTTPS Tunnel for AI Backend Server..."
npx --yes localtunnel --port 8000 --subdomain signspeak-ai-api &
TUNNEL_PID=$!

sleep 3

echo ""
echo "================================================================="
echo "🌍 YOUR BACKEND IS NOW ONLINE PUBLICLY!"
echo "   Public HTTPS URL: https://signspeak-ai-api.loca.lt"
echo "   Health Check:     https://signspeak-ai-api.loca.lt/health"
echo "================================================================="
echo ""

# Launch Expo
cd /Users/apple/.gemini/antigravity/scratch/SignSpeakAI/mobile
npx expo start --host lan -c

# Cleanup on termination
kill $BACKEND_PID 2>/dev/null
kill $TUNNEL_PID 2>/dev/null
