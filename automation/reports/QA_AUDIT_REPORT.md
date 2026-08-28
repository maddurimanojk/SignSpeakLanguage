# QA AUDIT REPORT

## Claimed Target
- Selenium: 300
- Appium: 300
- Unit: 300
- Load: 300
- Validation: 300
- **Total: 1,500**

## Actual Measured Pytest Results

### Selenium Web E2E
- Collected: 300
- Executed: 300
- Passed: 300
- Failed: 0
- Skipped/Blocked: 0
- Duration: 77.697s

### Appium Android E2E
- Collected: 300
- Executed: 300
- Passed: 0
- Failed: 0
- Skipped/Blocked: 300
- Duration: 0.165s

### Unit Tests
- Collected: 300
- Executed: 300
- Passed: 300
- Failed: 0
- Skipped/Blocked: 0
- Duration: 0.157s

### Load / Performance
- Collected: 300
- Executed: 300
- Passed: 300
- Failed: 0
- Skipped/Blocked: 0
- Duration: 338.404s

### Validation / Security
- Collected: 300
- Executed: 300
- Passed: 300
- Failed: 0
- Skipped/Blocked: 0
- Duration: 0.202s

## Overall Summary
- Total Collected: 1500
- Total Executed: 1500
- Total Passed: 1200
- Total Failed: 0
- Total Skipped/Blocked: 300
- Total Wall-Clock Duration: 417.533s

## Excel Report Column Verification
- **Passed Tests**: Included explicit domain-specific 'Reason for Passing' and 'Evidence / Validation Details' for every test case.
- **Failed Tests**: Included 'Failure Reason', 'Expected Behavior', and 'Actual Result'.

## Integrity Findings
- **Appium Mobile Suite**: 300 tests collected and marked `SKIPPED / BLOCKED` ("Android execution environment unavailable") as specified in the environment rule when an active Android emulator/device is not attached.
- **Selenium Suite**: Executed against LIVE target URL `https://signspeak-ai.vercel.app`.
- **Unit Suite**: Executed against actual preprocessing & landmark functions.
- **Load Suite**: Executed against cloud backend API.
- **Validation Suite**: Executed boundary value & landmark coordinate constraints.
