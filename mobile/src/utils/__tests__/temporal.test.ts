import { TemporalDebouncer, SentenceBuilder } from '../../services/temporal';
import { PredictionResponse } from '../../types';

describe('TemporalDebouncer Unit Tests', () => {
  let debouncer: TemporalDebouncer;

  beforeEach(() => {
    debouncer = new TemporalDebouncer(1500, 0.75);
  });

  test('should accept valid high-confidence prediction', () => {
    const pred: PredictionResponse = {
      sign: 'HELLO',
      confidence: 0.92,
      timestamp: new Date().toISOString(),
      is_valid: true,
      inference_mode: 'DEMO_MOCK',
    };
    const res = debouncer.processPrediction(pred);
    expect(res.shouldAdd).toBe(true);
    expect(res.sign).toBe('HELLO');
  });

  test('should reject low confidence prediction below threshold', () => {
    const pred: PredictionResponse = {
      sign: 'HELLO',
      confidence: 0.60,
      timestamp: new Date().toISOString(),
      is_valid: true,
      inference_mode: 'DEMO_MOCK',
    };
    const res = debouncer.processPrediction(pred);
    expect(res.shouldAdd).toBe(false);
  });

  test('should debounce duplicate sign within time window', () => {
    const pred: PredictionResponse = {
      sign: 'THANK YOU',
      confidence: 0.88,
      timestamp: new Date().toISOString(),
      is_valid: true,
      inference_mode: 'DEMO_MOCK',
    };

    const res1 = debouncer.processPrediction(pred);
    expect(res1.shouldAdd).toBe(true);

    const res2 = debouncer.processPrediction(pred);
    expect(res2.shouldAdd).toBe(false);
  });
});

describe('SentenceBuilder Unit Tests', () => {
  let builder: SentenceBuilder;

  beforeEach(() => {
    builder = new SentenceBuilder();
  });

  test('should construct sentence correctly', () => {
    builder.addWord('I');
    builder.addWord('YOU');
    builder.addWord('HELP');
    expect(builder.getSentence()).toBe('I YOU HELP');
  });

  test('should handle backspace and clear', () => {
    builder.addWord('HELLO');
    builder.addWord('WATER');
    builder.backspace();
    expect(builder.getSentence()).toBe('HELLO');

    builder.clear();
    expect(builder.getSentence()).toBe('');
  });
});
