# SignSpeak AI - CI/CD Pipeline & GitHub Actions Execution Guide

## Pipeline Architecture
The CI/CD workflow `.github/workflows/deploy-and-test.yml` runs automatically on `push`, `pull_request`, and `workflow_dispatch`.

---

## 13 Pipeline Stages
1. **Stage 1: Repository Checkout** (`actions/checkout@v4`)
2. **Stage 2: Dependency Installation** (Node.js & Python setup)
3. **Stage 3: Build Application** (`npm run build` in `web/`)
4. **Stage 4: Static Analysis** (`npx tsc --noEmit`)
5. **Stage 5: Deploy to GitHub Pages / Host** (`actions/deploy-pages@v4`)
6. **Stage 6: Wait for Deployment** (Propagation delay)
7. **Stage 7: Deployment Verification** (HTTP 200 health check)
8. **Stage 8: Run Enterprise QA Test Suites** (Selenium 440+ & Appium 300+ tests against LIVE URL)
9. **Stage 9: Generate HTML Reports**
10. **Stage 10: Generate Excel Reports** (8 styled XLSX workbooks)
11. **Stage 11: Upload Artifacts** (30-day retention)
12. **Stage 12: Publish GitHub Summary** (`$GITHUB_STEP_SUMMARY`)
13. **Stage 13: Store Historical Results**

---

## Accessing GitHub Action Artifacts
1. Open your repository on GitHub.
2. Click **Actions** tab → Select the latest run.
3. Scroll down to **Artifacts** section.
4. Download `SignSpeak-AI-QA-Test-Artifacts.zip`.
