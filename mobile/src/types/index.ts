export type SignCategory = 'Basic' | 'People' | 'Food' | 'Places' | 'Emergency' | 'Phrases';

export interface ISLSignItem {
  id: string;
  name: string;
  category: SignCategory;
  description: string;
  gestureHint: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  svgPath?: string;
}

export interface LandmarkPoint {
  x: number;
  y: number;
  z?: number;
}

export type InferenceMode = 'REAL_MODEL' | 'REAL_MODEL_10' | 'REAL_MODEL_27' | 'REAL_MODEL_EXTERNAL' | 'DEMO_MOCK' | (string & {});

export interface PredictionResponse {
  sign: string;
  confidence: number;
  timestamp: string;
  is_valid: boolean;
  inference_mode: InferenceMode;
}

export interface TranslationHistoryItem {
  id: string;
  dateTime: string;
  sentence: string;
  confidence: number;
  durationSeconds: number;
  signCount: number;
}

export type CommunicationMethod = 'Traditional Gesture' | 'Written Communication' | 'AI SignSpeak';

export interface ResearchTrial {
  id: string;
  participantId: string;
  method: CommunicationMethod;
  task: string;
  startTime: string;
  endTime: string;
  durationSeconds: number;
  isCorrect: boolean;
  rating: number; // 1-5 scale
  notes?: string;
}

export interface ResearchAnalytics {
  accuracy: number;
  avgResponseTimeSeconds: number;
  taskCompletionRate: number;
  userSatisfactionScore: number;
  totalTrials: number;
  methodBreakdown: Record<CommunicationMethod, {
    trials: number;
    accuracy: number;
    avgTime: number;
    satisfaction: number;
  }>;
}

export interface AppSettings {
  speechSpeed: number;
  speechPitch: number;
  speechVolume: number;
  confidenceThreshold: number;
  backendUrl: string;
  isDemoMode: boolean;
  themeMode: 'dark' | 'light';
  cameraType: 'front' | 'back';
}
