import { generateHandLandmarkPoints, landmarksToFlatArray, HAND_CONNECTIONS } from '../services/landmark';

describe('Hand Landmark Generator & Topology Tests', () => {
  test('generateHandLandmarkPoints should return exactly 21 landmark points', () => {
    const points = generateHandLandmarkPoints(0);
    expect(points.length).toBe(21);
  });

  const phases = [0, 0.5, 1.0, 1.5, 2.0, 3.14, 5.0];
  phases.forEach((phase) => {
    test(`landmark points at phase ${phase} should remain within normalized bounding box 0..1`, () => {
      const points = generateHandLandmarkPoints(phase);
      points.forEach((pt) => {
        expect(pt.x).toBeGreaterThanOrEqual(0.0);
        expect(pt.x).toBeLessThanOrEqual(1.0);
        expect(pt.y).toBeGreaterThanOrEqual(0.0);
        expect(pt.y).toBeLessThanOrEqual(1.0);
      });
    });
  });

  test('landmarksToFlatArray should convert 21 points to 42 float values', () => {
    const points = generateHandLandmarkPoints(0);
    const flat = landmarksToFlatArray(points);
    expect(flat.length).toBe(42);
    expect(flat[0]).toBe(points[0].x);
    expect(flat[1]).toBe(points[0].y);
  });

  test('HAND_CONNECTIONS matrix should contain exactly 23 skeleton bone pairs', () => {
    expect(HAND_CONNECTIONS.length).toBe(23);
    HAND_CONNECTIONS.forEach(([start, end]) => {
      expect(start).toBeGreaterThanOrEqual(0);
      expect(start).toBeLessThan(21);
      expect(end).toBeGreaterThanOrEqual(0);
      expect(end).toBeLessThan(21);
    });
  });
});
