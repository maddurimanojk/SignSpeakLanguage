#!/bin/bash
set -e

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$ROOT_DIR"

echo "================================================================="
echo "        SignSpeak AI - Unified Monorepo Automated Test Suite      "
echo "================================================================="
echo ""

echo "[1/2] Running Python Backend & ML Pytest Suite with Coverage..."
./backend/venv_py310/bin/pytest backend/tests ml/tests --cov=backend/app --cov=ml/preprocess.py

echo ""
echo "[2/2] Running Mobile React Native Jest Suite with Coverage..."
cd mobile
npx jest --coverage --forceExit
cd "$ROOT_DIR"

echo ""
echo "================================================================="
echo "                COMPLETED AUTOMATED TEST RUN SUMMARY              "
echo "================================================================="
