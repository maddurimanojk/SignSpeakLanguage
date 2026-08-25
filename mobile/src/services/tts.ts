import * as Speech from 'expo-speech';

export interface TTSSpeechOptions {
  rate?: number;
  pitch?: number;
  volume?: number;
  onStart?: () => void;
  onDone?: () => void;
  onError?: (e: any) => void;
}

export const speakSentence = async (text: string, options: TTSSpeechOptions = {}): Promise<void> => {
  if (!text || text.trim() === '') return;

  const isSpeaking = await Speech.isSpeakingAsync();
  if (isSpeaking) {
    await Speech.stop();
  }

  Speech.speak(text, {
    rate: options.rate || 1.0,
    pitch: options.pitch || 1.0,
    volume: options.volume || 1.0,
    language: 'en-IN', // Indian English voice preferred for ISL context
    onStart: options.onStart,
    onDone: options.onDone,
    onError: options.onError,
  });
};

export const stopSpeech = async (): Promise<void> => {
  try {
    await Speech.stop();
  } catch (e) {
    console.error('Error stopping speech:', e);
  }
};

export const isSpeakingAsync = async (): Promise<boolean> => {
  try {
    return await Speech.isSpeakingAsync();
  } catch (e) {
    return false;
  }
};
