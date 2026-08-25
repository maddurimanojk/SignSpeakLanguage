import { predictLandmarkFrame } from '../services/api';

describe('Client REST API & Fallback Prediction Tests', () => {
  const SIGNS_LIST = [
    'HELLO', 'THANK YOU', 'YES', 'NO', 'PLEASE', 'SORRY', 'HELP',
    'WATER', 'FOOD', 'HOME', 'SCHOOL', 'HOSPITAL', 'GOOD', 'BAD',
    'NAME', 'STOP', 'COME', 'GO', 'I', 'YOU', 'WE', 'WHAT',
    'WHERE', 'HOW', 'WELCOME', 'GOOD MORNING', 'GOOD NIGHT'
  ];

  test('should return NO_HAND_DETECTED for empty landmarks array', async () => {
    const res = await predictLandmarkFrame('http://localhost:8000', []);
    expect(res.sign).toBe('NO_HAND_DETECTED');
    expect(res.confidence).toBe(0);
    expect(res.is_valid).toBe(false);
  });

  // Parameterized tests for landmark inputs mapping to signs
  const inputs = range(27).map(i => (i + 1) * 0.05);
  inputs.forEach((val, index) => {
    test(`fallback prediction for input value ${val.toFixed(2)} should return valid ISL sign`, async () => {
      const landmarks = Array(42).fill(val);
      const res = await predictLandmarkFrame('http://invalid-endpoint-999:8000', landmarks);
      
      expect(SIGNS_LIST).toContain(res.sign);
      expect(res.confidence).toBeGreaterThanOrEqual(0.70);
      expect(res.confidence).toBeLessThanOrEqual(0.99);
      expect(res.is_valid).toBe(true);
      expect(res.inference_mode).toBe('DEMO_MOCK');
      expect(res.timestamp).toBeDefined();
    });
  });
});

function range(size: number): number[] {
  return Array.from({ length: size }, (_, i) => i);
}
