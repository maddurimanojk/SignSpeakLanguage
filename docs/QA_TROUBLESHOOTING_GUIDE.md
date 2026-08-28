# SignSpeak AI - QA Automation Troubleshooting Guide

## Common Issues & Resolutions

### 1. LIVE Deployment HTTP Check Fails (Stage 7)
- **Symptom**: `Deployment Health Check Failed! Status Code: 404` or `000`
- **Cause**: Domain DNS/SSL propagation delay or invalid `BASE_URL` secret.
- **Fix**: Verify `BASE_URL` repository variable on GitHub (**Settings -> Secrets and variables -> Actions -> Variables**).

### 2. Selenium Headless Browser Connection Error
- **Symptom**: `WebDriverException: chrome not reachable`
- **Fix**: Ensure `--headless=new` and `--no-sandbox` flags are present in `automation/config/config.py`.

### 3. OpenPyXL / Excel Generation Missing Module
- **Symptom**: `ModuleNotFoundError: No module named 'openpyxl'`
- **Fix**: Run `pip install openpyxl pandas`.

### 4. Permission Denied on Artifact Upload
- **Fix**: Ensure workflow permissions include `pages: write` and `id-token: write`.
