"""
Real Human ISL Landmark Data Collection Tool (Phase 1 & Phase 2)
Uses MediaPipe and OpenCV live camera feed to collect 15-frame hand landmark sequences.
Saves normalized landmark arrays (.npy) and sample metadata (.json) to dataset_real/.
"""

import os
import sys
import time
import json
import argparse
import numpy as np

# Ensure backend imports work
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "backend")))
from app.services.preprocessing import normalize_landmarks
from app.utils.config import settings

def parse_args():
    parser = argparse.ArgumentParser(description="Real Human ISL Hand Landmark Data Collector")
    parser.add_argument("--sign", type=str, default="HELLO", help="Target sign to collect (e.g., HELLO)")
    parser.add_argument("--samples", type=int, default=150, help="Target samples to collect per sign")
    parser.add_argument("--output", type=str, default="dataset_real", help="Output directory for real human dataset")
    parser.add_argument("--participant", type=str, default="P01", help="Participant / Session ID (e.g., P01)")
    parser.add_argument("--camera", type=int, default=0, help="Webcam camera index (default: 0)")
    return parser.parse_args()

def collect_landmarks():
    args = parse_args()
    target_sign = args.sign.upper()
    target_samples = args.samples
    output_base_dir = os.path.abspath(args.output)
    participant_id = args.participant
    camera_idx = args.camera

    sign_folder = os.path.join(output_base_dir, target_sign.replace(" ", "_"))
    os.makedirs(sign_folder, exist_ok=True)

    try:
        import cv2
        import mediapipe as mp
    except ImportError:
        print("[Error] cv2 and mediapipe must be installed to run data collection!")
        print("Run: ./backend/venv_py310/bin/pip install opencv-python mediapipe")
        sys.exit(1)

    mp_hands = mp.solutions.hands
    mp_drawing = mp.solutions.drawing_utils
    hands = mp_hands.Hands(
        static_image_mode=False,
        max_num_hands=1,
        min_detection_confidence=0.7,
        min_tracking_confidence=0.7
    )

    cap = cv2.VideoCapture(camera_idx)
    if not cap.isOpened():
        print(f"[Error] Could not open camera at index {camera_idx}.")
        sys.exit(1)

    existing_files = [f for f in os.listdir(sign_folder) if f.endswith(".npy")]
    sample_counter = len(existing_files)

    print("\n=======================================================")
    print("      SignSpeak AI - Real Human Data Collector        ")
    print("=======================================================")
    print(f"Target Sign:   {target_sign}")
    print(f"Target Count:  {target_samples}")
    print(f"Participant:   {participant_id}")
    print(f"Directory:     {sign_folder}")
    print("-------------------------------------------------------")
    print("CONTROLS:")
    print("  [SPACE] - Start Countdown & Capture 15-frame sequence")
    print("  [N]     - Next Sign in Vocabulary")
    print("  [R]     - Reset / Delete last sample")
    print("  [Q]     - Quit Collection Tool")
    print("=======================================================\n")

    state = "READY" # READY, COUNTDOWN, RECORDING
    countdown_start = 0
    recording_sequence = []

    sign_list = settings.SIGNS_10
    current_sign_idx = sign_list.index(target_sign) if target_sign in sign_list else 0

    while cap.isOpened():
        ret, frame = cap.read()
        if not ret:
            print("[Warning] Failed to grab frame from camera.")
            break

        # Flip horizontally for natural mirror display
        frame = cv2.flip(frame, 1)
        h, w, c = frame.shape
        rgb_frame = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
        results = hands.process(rgb_frame)

        hand_detected = False
        current_landmarks = []

        if results.multi_hand_landmarks:
            hand_detected = True
            hand_landmarks = results.multi_hand_landmarks[0]
            mp_drawing.draw_landmarks(frame, hand_landmarks, mp_hands.HAND_CONNECTIONS)

            # Extract 21 (x, y) landmark points
            for lm in hand_landmarks.landmark:
                current_landmarks.extend([lm.x, lm.y])

        # State Machine Logic
        current_time = time.time()
        if state == "COUNTDOWN":
            elapsed = current_time - countdown_start
            remaining = 3 - int(elapsed)
            if remaining > 0:
                cv2.putText(frame, f"RECORDING IN {remaining}...", (w // 2 - 180, h // 2),
                            cv2.FONT_HERSHEY_SIMPLEX, 1.5, (0, 165, 255), 4)
            else:
                state = "RECORDING"
                recording_sequence = []

        elif state == "RECORDING":
            cv2.putText(frame, "● RECORDING 15 FRAMES", (30, 80),
                        cv2.FONT_HERSHEY_SIMPLEX, 1.0, (0, 0, 255), 3)

            if hand_detected and len(current_landmarks) == 42:
                norm_feat = normalize_landmarks(current_landmarks)
                recording_sequence.append(norm_feat)

                cv2.putText(frame, f"Frames: {len(recording_sequence)} / 15", (30, 120),
                            cv2.FONT_HERSHEY_SIMPLEX, 0.8, (0, 255, 0), 2)

                if len(recording_sequence) == 15:
                    # Save completed valid sequence
                    sample_file = os.path.join(sign_folder, f"sample_{sample_counter:03d}.npy")
                    meta_file = os.path.join(sign_folder, f"sample_{sample_counter:03d}.json")

                    seq_array = np.array(recording_sequence, dtype=np.float32)
                    np.save(sample_file, seq_array)

                    metadata = {
                        "sign": target_sign,
                        "participant": participant_id,
                        "sample_id": sample_counter,
                        "timestamp": time.strftime("%Y-%m-%d %H:%M:%S"),
                        "sequence_length": 15,
                        "feature_shape": list(seq_array.shape),
                        "is_real_human_data": True
                    }
                    with open(meta_file, "w") as mf:
                        json.dump(metadata, mf, indent=2)

                    print(f"[Captured Sample {sample_counter:03d}] Saved to {sample_file}")
                    sample_counter += 1
                    recording_sequence = []
                    state = "READY"
            else:
                cv2.putText(frame, "NO HAND DETECTED - PAUSED", (30, 120),
                            cv2.FONT_HERSHEY_SIMPLEX, 0.8, (0, 0, 255), 2)

        # Draw HUD Box
        cv2.rectangle(frame, (10, 10), (w - 10, 60), (0, 0, 0), -1)
        hud_text = f"Sign: {target_sign} | Samples: {sample_counter}/{target_samples} | Participant: {participant_id} | Status: {state}"
        cv2.putText(frame, hud_text, (20, 40), cv2.FONT_HERSHEY_SIMPLEX, 0.65, (255, 255, 255), 2)

        cv2.imshow("SignSpeak AI - Real Human Data Collector", frame)

        key = cv2.waitKey(1) & 0xFF
        if key == ord('q'):
            print("\n[Data Collector] Quitting data collection...")
            break
        elif key == ord(' '): # SPACE
            if state == "READY":
                state = "COUNTDOWN"
                countdown_start = time.time()
        elif key == ord('n'): # N
            current_sign_idx = (current_sign_idx + 1) % len(sign_list)
            target_sign = sign_list[current_sign_idx]
            sign_folder = os.path.join(output_base_dir, target_sign.replace(" ", "_"))
            os.makedirs(sign_folder, exist_ok=True)
            existing_files = [f for f in os.listdir(sign_folder) if f.endswith(".npy")]
            sample_counter = len(existing_files)
            print(f"\n[Data Collector] Switched to Next Sign: {target_sign}")
        elif key == ord('r'): # R
            if sample_counter > 0:
                sample_counter -= 1
                last_npy = os.path.join(sign_folder, f"sample_{sample_counter:03d}.npy")
                last_json = os.path.join(sign_folder, f"sample_{sample_counter:03d}.json")
                if os.path.exists(last_npy):
                    os.remove(last_npy)
                if os.path.exists(last_json):
                    os.remove(last_json)
                print(f"\n[Data Collector] Removed last sample {sample_counter:03d}")

    cap.release()
    cv2.destroyAllWindows()
    hands.close()

if __name__ == "__main__":
    collect_landmarks()
