import AsyncStorage from '@react-native-async-storage/async-storage';
import { TranslationHistoryItem, ResearchTrial, ResearchAnalytics, AppSettings, CommunicationMethod } from '../types';

const STORAGE_KEYS = {
  HISTORY: '@signspeak_history_v1',
  RESEARCH_TRIALS: '@signspeak_research_trials_v1',
  SETTINGS: '@signspeak_settings_v1',
};

export const defaultSettings: AppSettings = {
  speechSpeed: 1.0,
  speechPitch: 1.0,
  speechVolume: 1.0,
  confidenceThreshold: 0.75,
  backendUrl: process.env.EXPO_PUBLIC_API_URL || 'https://signspeak-ai-api.onrender.com',
  isDemoMode: false,
  themeMode: 'dark',
  cameraType: 'back',
};

// --- TRANSLATION HISTORY STORAGE ---
export const getTranslationHistory = async (): Promise<TranslationHistoryItem[]> => {
  try {
    const json = await AsyncStorage.getItem(STORAGE_KEYS.HISTORY);
    return json ? JSON.parse(json) : [];
  } catch (e) {
    console.error('Error fetching history:', e);
    return [];
  }
};

export const saveTranslationItem = async (item: Omit<TranslationHistoryItem, 'id'>): Promise<TranslationHistoryItem> => {
  const history = await getTranslationHistory();
  const newItem: TranslationHistoryItem = {
    ...item,
    id: 'hist_' + Date.now() + '_' + Math.floor(Math.random() * 1000),
  };
  const updated = [newItem, ...history];
  await AsyncStorage.setItem(STORAGE_KEYS.HISTORY, JSON.stringify(updated));
  return newItem;
};

export const deleteTranslationItem = async (id: string): Promise<TranslationHistoryItem[]> => {
  const history = await getTranslationHistory();
  const updated = history.filter((h) => h.id !== id);
  await AsyncStorage.setItem(STORAGE_KEYS.HISTORY, JSON.stringify(updated));
  return updated;
};

export const clearAllTranslationHistory = async (): Promise<void> => {
  await AsyncStorage.removeItem(STORAGE_KEYS.HISTORY);
};

// --- RESEARCH TRIALS & ANALYTICS ---
export const getResearchTrials = async (): Promise<ResearchTrial[]> => {
  try {
    const json = await AsyncStorage.getItem(STORAGE_KEYS.RESEARCH_TRIALS);
    return json ? JSON.parse(json) : [];
  } catch (e) {
    console.error('Error fetching research trials:', e);
    return [];
  }
};

export const saveResearchTrial = async (trial: Omit<ResearchTrial, 'id'>): Promise<ResearchTrial> => {
  const trials = await getResearchTrials();
  const newTrial: ResearchTrial = {
    ...trial,
    id: 'trial_' + Date.now(),
  };
  const updated = [newTrial, ...trials];
  await AsyncStorage.setItem(STORAGE_KEYS.RESEARCH_TRIALS, JSON.stringify(updated));
  return newTrial;
};

export const clearAllResearchTrials = async (): Promise<void> => {
  await AsyncStorage.removeItem(STORAGE_KEYS.RESEARCH_TRIALS);
};

export const computeResearchAnalytics = (trials: ResearchTrial[]): ResearchAnalytics => {
  if (trials.length === 0) {
    return {
      accuracy: 0,
      avgResponseTimeSeconds: 0,
      taskCompletionRate: 0,
      userSatisfactionScore: 0,
      totalTrials: 0,
      methodBreakdown: {
        'Traditional Gesture': { trials: 0, accuracy: 0, avgTime: 0, satisfaction: 0 },
        'Written Communication': { trials: 0, accuracy: 0, avgTime: 0, satisfaction: 0 },
        'AI SignSpeak': { trials: 0, accuracy: 0, avgTime: 0, satisfaction: 0 },
      },
    };
  }

  const total = trials.length;
  const correctCount = trials.filter((t) => t.isCorrect).length;
  const accuracy = (correctCount / total) * 100;
  const totalDuration = trials.reduce((acc, t) => acc + t.durationSeconds, 0);
  const avgResponseTimeSeconds = totalDuration / total;
  const totalSatisfaction = trials.reduce((acc, t) => acc + t.rating, 0);
  const userSatisfactionScore = totalSatisfaction / total;
  const taskCompletionRate = accuracy; // Completed correctly

  const methods: CommunicationMethod[] = ['Traditional Gesture', 'Written Communication', 'AI SignSpeak'];
  const breakdown: any = {};

  methods.forEach((m) => {
    const mTrials = trials.filter((t) => t.method === m);
    if (mTrials.length === 0) {
      breakdown[m] = { trials: 0, accuracy: 0, avgTime: 0, satisfaction: 0 };
    } else {
      const mCorrect = mTrials.filter((t) => t.isCorrect).length;
      const mAccuracy = (mCorrect / mTrials.length) * 100;
      const mTime = mTrials.reduce((acc, t) => acc + t.durationSeconds, 0) / mTrials.length;
      const mSat = mTrials.reduce((acc, t) => acc + t.rating, 0) / mTrials.length;
      breakdown[m] = {
        trials: mTrials.length,
        accuracy: Math.round(mAccuracy),
        avgTime: Math.round(mTime * 10) / 10,
        satisfaction: Math.round(mSat * 10) / 10,
      };
    }
  });

  return {
    accuracy: Math.round(accuracy),
    avgResponseTimeSeconds: Math.round(avgResponseTimeSeconds * 10) / 10,
    taskCompletionRate: Math.round(taskCompletionRate),
    userSatisfactionScore: Math.round(userSatisfactionScore * 10) / 10,
    totalTrials: total,
    methodBreakdown: breakdown,
  };
};

// --- APP SETTINGS STORAGE ---
export const getAppSettings = async (): Promise<AppSettings> => {
  try {
    const json = await AsyncStorage.getItem(STORAGE_KEYS.SETTINGS);
    return json ? { ...defaultSettings, ...JSON.parse(json) } : defaultSettings;
  } catch (e) {
    return defaultSettings;
  }
};

export const saveAppSettings = async (settings: Partial<AppSettings>): Promise<AppSettings> => {
  const current = await getAppSettings();
  const updated = { ...current, ...settings };
  await AsyncStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(updated));
  return updated;
};

export const resetAppSettings = async (): Promise<AppSettings> => {
  await AsyncStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(defaultSettings));
  return defaultSettings;
};
