import ssl
import urllib.request
from pathlib import Path

MODEL_PATH = Path(__file__).parent / "hand_landmarker.task"
URL = "https://storage.googleapis.com/mediapipe-models/hand_landmarker/hand_landmarker/float16/1/hand_landmarker.task"

if not MODEL_PATH.exists():
    print("Downloading MediaPipe hand_landmarker.task model...")
    ssl_context = ssl._create_unverified_context()
    with urllib.request.urlopen(URL, context=ssl_context) as response, open(MODEL_PATH, 'wb') as out_file:
        out_file.write(response.read())
    print(f"Downloaded hand_landmarker.task ({MODEL_PATH.stat().st_size} bytes)")
else:
    print("hand_landmarker.task already exists.")
