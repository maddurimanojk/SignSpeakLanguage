export type SignCategory = 'Basic' | 'People' | 'Food' | 'Places' | 'Emergency' | 'Phrases';

export interface ISLSignItem {
  id: string;
  name: string;
  category: SignCategory;
  description: string;
  gestureHint: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  isModelSupported?: boolean;
}

export interface User {
  id: string;
  fullName: string;
  email: string;
  avatarUrl?: string;
  createdAt: string;
}

export interface PredictionResponse {
  sign: string;
  confidence: number;
  is_valid: boolean;
  inference_mode: string;
  all_probabilities?: Record<string, number>;
}

export interface TranslationRecord {
  id: string;
  userId: string;
  dateTime: string;
  sentence: string;
  confidence: number;
  durationSeconds: number;
  signCount: number;
  status: 'Completed' | 'Processing' | 'Failed';
}

export interface BackendHealthResponse {
  status: string;
  service: string;
  version: string;
  inference_mode: string;
  model_name: string;
  classes_count: number;
  supported_signs_count: number;
  supported_signs: string[];
}

export interface UserSettings {
  speechRate: number;
  speechPitch: number;
  speechVolume: number;
  confidenceThreshold: number;
  backendUrl: string;
  autoSpeak: boolean;
}
