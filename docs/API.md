# API Specifications - SignSpeak AI

Base URL: `http://localhost:8000` (or `http://<YOUR_IP>:8000`)

---

## 1. Health Check
`GET /health`

**Response `200 OK`**:
```json
{
  "status": "healthy",
  "service": "SignSpeak AI Backend",
  "version": "1.0.0",
  "inference_mode": "DEMO_MOCK",
  "supported_signs_count": 27,
  "supported_signs": ["HELLO", "THANK YOU", ...]
}
```

---

## 2. Single Frame Prediction
`POST /predict`

**Request Body**:
```json
{
  "landmarks": [0.0, 0.0, 0.12, -0.45, ...],
  "timestamp": "2026-08-14 23:15:00"
}
```

**Response `200 OK`**:
```json
{
  "sign": "HELLO",
  "confidence": 0.94,
  "timestamp": "2026-08-14 23:15:00",
  "is_valid": true,
  "inference_mode": "DEMO_MOCK"
}
```

---

## 3. Sequence Prediction
`POST /predict/sequence`

**Request Body**:
```json
{
  "sequence": [
    [0.0, 0.0, ...],
    [0.01, 0.02, ...]
  ],
  "timestamp": "2026-08-14 23:15:05"
}
```

**Response `200 OK`**:
```json
{
  "sign": "THANK YOU",
  "confidence": 0.91,
  "timestamp": "2026-08-14 23:15:05",
  "is_valid": true,
  "inference_mode": "DEMO_MOCK"
}
```

---

## 4. Research Feedback Submission
`POST /feedback`

**Request Body**:
```json
{
  "predicted_sign": "WATER",
  "actual_sign": "WATER",
  "is_correct": true,
  "confidence": 0.88,
  "user_notes": "Good gesture recognition"
}
```

**Response `200 OK`**:
```json
{
  "status": "success",
  "message": "Feedback recorded successfully",
  "timestamp": "2026-08-14 23:15:10"
}
```

---

## 5. User Session Tracking
`POST /session`

**Request Body**:
```json
{
  "user_id": "participant_04",
  "device_info": "iOS Expo Go"
}
```

**Response `200 OK`**:
```json
{
  "status": "active",
  "session_id": "e4b2a8d1-1234-5678-9abc-def012345678",
  "created_at": "2026-08-14 23:15:12"
}
```
