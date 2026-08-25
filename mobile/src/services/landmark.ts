import { LandmarkPoint } from '../types';

// MediaPipe 21 Hand Landmark joint connections (pairs of joint indices)
export const HAND_CONNECTIONS: [number, number][] = [
  // Wrist & Thumb
  [0, 1], [1, 2], [2, 3], [3, 4],
  // Index Finger
  [0, 5], [5, 6], [6, 7], [7, 8],
  // Middle Finger
  [0, 9], [9, 10], [10, 11], [11, 12],
  // Ring Finger
  [0, 13], [13, 14], [14, 15], [15, 16],
  // Pinky
  [0, 17], [17, 18], [18, 19], [19, 20],
  // Palm connections between knuckle bases
  [5, 9], [9, 13], [13, 17]
];

/**
 * Generates realistic hand landmarks for camera live preview & overlay.
 * Shifts landmark joint coordinates dynamically based on phase angle.
 */
export function generateHandLandmarkPoints(phase: number = 0): LandmarkPoint[] {
  const cx = 0.5 + Math.sin(phase) * 0.05;
  const cy = 0.55 + Math.cos(phase * 0.8) * 0.05;

  const points: LandmarkPoint[] = [
    { x: cx, y: cy }, // 0: Wrist
    // Thumb
    { x: cx - 0.08, y: cy - 0.06 }, { x: cx - 0.12, y: cy - 0.12 }, { x: cx - 0.15, y: cy - 0.18 }, { x: cx - 0.17, y: cy - 0.22 },
    // Index
    { x: cx - 0.04, y: cy - 0.14 }, { x: cx - 0.05, y: cy - 0.22 }, { x: cx - 0.06, y: cy - 0.28 }, { x: cx - 0.06, y: cy - 0.34 },
    // Middle
    { x: cx + 0.01, y: cy - 0.15 }, { x: cx + 0.01, y: cy - 0.24 }, { x: cx + 0.01, y: cy - 0.31 }, { x: cx + 0.01, y: cy - 0.37 },
    // Ring
    { x: cx + 0.05, y: cy - 0.14 }, { x: cx + 0.06, y: cy - 0.22 }, { x: cx + 0.07, y: cy - 0.28 }, { x: cx + 0.07, y: cy - 0.34 },
    // Pinky
    { x: cx + 0.09, y: cy - 0.10 }, { x: cx + 0.11, y: cy - 0.17 }, { x: cx + 0.12, y: cy - 0.22 }, { x: cx + 0.13, y: cy - 0.27 },
  ];

  return points;
}

/**
 * Converts 21 2D Landmark Points into flat float array [42]
 */
export function landmarksToFlatArray(points: LandmarkPoint[]): number[] {
  const arr: number[] = [];
  points.forEach((p) => {
    arr.push(p.x, p.y);
  });
  return arr;
}
