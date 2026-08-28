# SignSpeak AI - Local QA Automation Execution Guide

## Overview
This framework executes automated end-to-end (E2E) testing across the web application (Selenium), Android mobile application (Appium), unit functions, load/stress scenarios, and input boundary validation.

---

## Environment Prerequisites
- Python 3.10+
- Node.js 20+
- Chrome / Chromium Browser (Headless or GUI)

---

## Local Execution Steps

### 1. Install Dependencies
```bash
pip install selenium appium-python-client openpyxl pandas requests jinja2 beautifulsoup4 pytest
```

### 2. Configure Environment Variable (Optional)
```bash
export BASE_URL=https://signspeak-ai.vercel.app
export HEADLESS=true
export PYTHONPATH=.
```

### 3. Run Complete Enterprise QA Suite
```bash
python automation/run_enterprise_qa.py
```

---

## Generated Reports Output
All reports are generated automatically inside `automation/reports/`:

- `automation/reports/Excel/Automation_Test_Report.xlsx` (440+ Executed Web E2E Cases)
- `automation/reports/Excel/Appium_Mobile_Test_Report.xlsx` (300+ Appium Android Cases)
- `automation/reports/Excel/Unit_Test_Cases.xlsx` (300+ Unit Cases)
- `automation/reports/Excel/Load_Performance_Test_Cases.xlsx` (300+ Performance Cases)
- `automation/reports/Excel/Validation_Test_Cases.xlsx` (300+ Validation Cases)
- `automation/reports/Excel/Passed_Test_Cases.xlsx`
- `automation/reports/Excel/Failed_Test_Cases.xlsx`
- `automation/reports/Excel/Summary_Report.xlsx`
- `automation/reports/HTML/execution-report.html`
- `automation/reports/HTML/dashboard.html`
- `automation/reports/JSON/execution-results.json`
- `automation/reports/Summary/summary.md`
