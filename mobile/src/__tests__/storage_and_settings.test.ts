import { defaultSettings } from '../services/storage';
import { AppSettings, TranslationHistoryItem, ResearchTrial } from '../types';

describe('Storage Models & Settings Defaults Tests', () => {
  test('defaultSettings should contain valid default properties', () => {
    expect(defaultSettings.speechSpeed).toBe(1.0);
    expect(defaultSettings.speechPitch).toBe(1.0);
    expect(defaultSettings.speechVolume).toBe(1.0);
    expect(defaultSettings.confidenceThreshold).toBe(0.75);
    expect(defaultSettings.backendUrl).toBe('http://localhost:8000');
    expect(defaultSettings.isDemoMode).toBe(true);
    expect(defaultSettings.themeMode).toBe('dark');
    expect(defaultSettings.cameraType).toBe('back');
  });

  const speedOptions = [0.5, 0.75, 1.0, 1.25, 1.5, 2.0];
  speedOptions.forEach((speed) => {
    test(`should validate speech speed parameter ${speed}x`, () => {
      const custom: AppSettings = { ...defaultSettings, speechSpeed: speed };
      expect(custom.speechSpeed).toBe(speed);
    });
  });

  const confidenceOptions = [0.50, 0.60, 0.70, 0.75, 0.85, 0.90, 0.95];
  confidenceOptions.forEach((conf) => {
    test(`should validate confidence threshold parameter ${Math.round(conf * 100)}%`, () => {
      const custom: AppSettings = { ...defaultSettings, confidenceThreshold: conf };
      expect(custom.confidenceThreshold).toBe(conf);
    });
  });

  test('should validate TranslationHistoryItem payload structure', () => {
    const item: TranslationHistoryItem = {
      id: 'hist_123',
      dateTime: '2026-08-14 23:40:00',
      sentence: 'HELLO WATER PLEASE',
      confidence: 0.94,
      durationSeconds: 12,
      signCount: 3,
    };

    expect(item.id).toBe('hist_123');
    expect(item.sentence).toBe('HELLO WATER PLEASE');
    expect(item.confidence).toBe(0.94);
    expect(item.durationSeconds).toBe(12);
    expect(item.signCount).toBe(3);
  });

  test('should validate ResearchTrial payload structure', () => {
    const trial: ResearchTrial = {
      id: 'trial_456',
      participantId: 'P01',
      method: 'AI SignSpeak',
      task: 'Communicate Hospital Help',
      startTime: '2026-08-14 23:40:00',
      endTime: '2026-08-14 23:40:05',
      durationSeconds: 5.0,
      isCorrect: true,
      rating: 5,
      notes: 'Excellent speed',
    };

    expect(trial.participantId).toBe('P01');
    expect(trial.method).toBe('AI SignSpeak');
    expect(trial.isCorrect).toBe(true);
    expect(trial.rating).toBe(5);
  });
});
