import { computeResearchAnalytics } from '../services/storage';
import { ResearchTrial } from '../types';

describe('Research Analytics Mathematical Formulas & Aggregation Tests', () => {
  test('should return zeroes for empty research trials list', () => {
    const res = computeResearchAnalytics([]);
    expect(res.accuracy).toBe(0);
    expect(res.avgResponseTimeSeconds).toBe(0);
    expect(res.taskCompletionRate).toBe(0);
    expect(res.userSatisfactionScore).toBe(0);
    expect(res.totalTrials).toBe(0);
    expect(res.methodBreakdown['AI SignSpeak'].trials).toBe(0);
  });

  test('should calculate 100% accuracy for all correct trials', () => {
    const trials: ResearchTrial[] = [
      { id: '1', participantId: 'P01', method: 'AI SignSpeak', task: 'Task 1', startTime: '', endTime: '', durationSeconds: 4.0, isCorrect: true, rating: 5 },
      { id: '2', participantId: 'P02', method: 'AI SignSpeak', task: 'Task 2', startTime: '', endTime: '', durationSeconds: 6.0, isCorrect: true, rating: 4 },
    ];
    const res = computeResearchAnalytics(trials);
    expect(res.accuracy).toBe(100);
    expect(res.totalTrials).toBe(2);
    expect(res.avgResponseTimeSeconds).toBe(5.0);
    expect(res.userSatisfactionScore).toBe(4.5);
  });

  test('should calculate 0% accuracy for all incorrect trials', () => {
    const trials: ResearchTrial[] = [
      { id: '1', participantId: 'P01', method: 'Traditional Gesture', task: 'Task 1', startTime: '', endTime: '', durationSeconds: 12.0, isCorrect: false, rating: 2 },
    ];
    const res = computeResearchAnalytics(trials);
    expect(res.accuracy).toBe(0);
    expect(res.avgResponseTimeSeconds).toBe(12.0);
    expect(res.userSatisfactionScore).toBe(2.0);
  });

  const accuracyTestCases = [
    { correctCount: 1, totalCount: 4, expectedAcc: 25 },
    { correctCount: 2, totalCount: 4, expectedAcc: 50 },
    { correctCount: 3, totalCount: 4, expectedAcc: 75 },
    { correctCount: 4, totalCount: 4, expectedAcc: 100 },
  ];

  accuracyTestCases.forEach(({ correctCount, totalCount, expectedAcc }) => {
    test(`should calculate accuracy of ${expectedAcc}% for ${correctCount}/${totalCount} correct trials`, () => {
      const trials: ResearchTrial[] = [];
      for (let i = 0; i < totalCount; i++) {
        trials.push({
          id: `t_${i}`,
          participantId: `P0${i}`,
          method: 'AI SignSpeak',
          task: 'Emergency Help',
          startTime: '',
          endTime: '',
          durationSeconds: 5.0,
          isCorrect: i < correctCount,
          rating: 4,
        });
      }
      const res = computeResearchAnalytics(trials);
      expect(res.accuracy).toBe(expectedAcc);
    });
  });

  test('should correctly compute method breakdown comparisons', () => {
    const trials: ResearchTrial[] = [
      // AI SignSpeak (2 trials: 100% acc, 3s avg, 5 rating)
      { id: '1', participantId: 'P01', method: 'AI SignSpeak', task: 'T1', startTime: '', endTime: '', durationSeconds: 2.0, isCorrect: true, rating: 5 },
      { id: '2', participantId: 'P02', method: 'AI SignSpeak', task: 'T2', startTime: '', endTime: '', durationSeconds: 4.0, isCorrect: true, rating: 5 },
      // Traditional Gesture (2 trials: 50% acc, 10s avg, 2 rating)
      { id: '3', participantId: 'P03', method: 'Traditional Gesture', task: 'T3', startTime: '', endTime: '', durationSeconds: 8.0, isCorrect: true, rating: 3 },
      { id: '4', participantId: 'P04', method: 'Traditional Gesture', task: 'T4', startTime: '', endTime: '', durationSeconds: 12.0, isCorrect: false, rating: 1 },
    ];

    const res = computeResearchAnalytics(trials);
    expect(res.totalTrials).toBe(4);

    const aiBreakdown = res.methodBreakdown['AI SignSpeak'];
    expect(aiBreakdown.trials).toBe(2);
    expect(aiBreakdown.accuracy).toBe(100);
    expect(aiBreakdown.avgTime).toBe(3.0);
    expect(aiBreakdown.satisfaction).toBe(5.0);

    const tradBreakdown = res.methodBreakdown['Traditional Gesture'];
    expect(tradBreakdown.trials).toBe(2);
    expect(tradBreakdown.accuracy).toBe(50);
    expect(tradBreakdown.avgTime).toBe(10.0);
    expect(tradBreakdown.satisfaction).toBe(2.0);
  });
});
