import { TemporalDebouncer } from '../services/temporal';
import { PredictionResponse } from '../types';

describe('TemporalDebouncer Extensive Unit Tests', () => {
  let debouncer: TemporalDebouncer;

  beforeEach(() => {
    debouncer = new TemporalDebouncer(1500, 0.75);
  });

  test('should initialize with default parameters', () => {
    expect(debouncer).toBeDefined();
  });

  test('should accept valid prediction with confidence above default threshold (0.75)', () => {
    const pred: PredictionResponse = {
      sign: 'HELLO',
      confidence: 0.85,
      timestamp: new Date().toISOString(),
      is_valid: true,
      inference_mode: 'DEMO_MOCK',
    };
    const res = debouncer.processPrediction(pred);
    expect(res.shouldAdd).toBe(true);
    expect(res.sign).toBe('HELLO');
  });

  test('should reject prediction with confidence below threshold (0.70 < 0.75)', () => {
    const pred: PredictionResponse = {
      sign: 'HELLO',
      confidence: 0.70,
      timestamp: new Date().toISOString(),
      is_valid: true,
      inference_mode: 'DEMO_MOCK',
    };
    const res = debouncer.processPrediction(pred);
    expect(res.shouldAdd).toBe(false);
    expect(res.sign).toBe('');
  });

  // Parameterized tests across various custom confidence threshold settings
  const thresholds = [0.50, 0.60, 0.70, 0.80, 0.90, 0.95];
  thresholds.forEach((th) => {
    test(`should respect custom confidence threshold setting ${th}`, () => {
      debouncer.setConfidenceThreshold(th);
      
      const lowPred: PredictionResponse = {
        sign: 'WATER',
        confidence: th - 0.05,
        timestamp: new Date().toISOString(),
        is_valid: true,
        inference_mode: 'DEMO_MOCK',
      };
      expect(debouncer.processPrediction(lowPred).shouldAdd).toBe(false);

      const highPred: PredictionResponse = {
        sign: 'WATER',
        confidence: th + 0.02,
        timestamp: new Date().toISOString(),
        is_valid: true,
        inference_mode: 'DEMO_MOCK',
      };
      expect(debouncer.processPrediction(highPred).shouldAdd).toBe(true);
    });
  });

  test('should suppress duplicate sign received within 1500ms time window', () => {
    const pred: PredictionResponse = {
      sign: 'THANK YOU',
      confidence: 0.90,
      timestamp: new Date().toISOString(),
      is_valid: true,
      inference_mode: 'DEMO_MOCK',
    };

    const first = debouncer.processPrediction(pred);
    expect(first.shouldAdd).toBe(true);

    const duplicate = debouncer.processPrediction(pred);
    expect(duplicate.shouldAdd).toBe(false);
  });

  test('should allow different sign immediately without debouncing', () => {
    const pred1: PredictionResponse = {
      sign: 'HELP',
      confidence: 0.88,
      timestamp: new Date().toISOString(),
      is_valid: true,
      inference_mode: 'DEMO_MOCK',
    };
    const pred2: PredictionResponse = {
      sign: 'WATER',
      confidence: 0.89,
      timestamp: new Date().toISOString(),
      is_valid: true,
      inference_mode: 'DEMO_MOCK',
    };

    expect(debouncer.processPrediction(pred1).shouldAdd).toBe(true);
    expect(debouncer.processPrediction(pred2).shouldAdd).toBe(true);
  });

  test('should reset debouncer state allowing duplicate sign after reset', () => {
    const pred: PredictionResponse = {
      sign: 'SCHOOL',
      confidence: 0.92,
      timestamp: new Date().toISOString(),
      is_valid: true,
      inference_mode: 'DEMO_MOCK',
    };

    expect(debouncer.processPrediction(pred).shouldAdd).toBe(true);
    expect(debouncer.processPrediction(pred).shouldAdd).toBe(false);

    debouncer.reset();
    expect(debouncer.processPrediction(pred).shouldAdd).toBe(true);
  });

  test('should reject NO_HAND_DETECTED predictions', () => {
    const pred: PredictionResponse = {
      sign: 'NO_HAND_DETECTED',
      confidence: 0.99,
      timestamp: new Date().toISOString(),
      is_valid: false,
      inference_mode: 'DEMO_MOCK',
    };
    expect(debouncer.processPrediction(pred).shouldAdd).toBe(false);
  });

  test('should reject UNKNOWN predictions', () => {
    const pred: PredictionResponse = {
      sign: 'UNKNOWN',
      confidence: 0.80,
      timestamp: new Date().toISOString(),
      is_valid: true,
      inference_mode: 'DEMO_MOCK',
    };
    expect(debouncer.processPrediction(pred).shouldAdd).toBe(false);
  });
});
