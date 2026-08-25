import { PredictionResponse } from '../types';

export class TemporalDebouncer {
  private lastAddedSign: string = '';
  private lastAddedTimestamp: number = 0;
  private debounceWindowMs: number;
  private confidenceThreshold: number;

  constructor(debounceWindowMs: number = 1500, confidenceThreshold: number = 0.75) {
    this.debounceWindowMs = debounceWindowMs;
    this.confidenceThreshold = confidenceThreshold;
  }

  public setConfidenceThreshold(threshold: number) {
    this.confidenceThreshold = threshold;
  }

  public setDebounceWindow(ms: number) {
    this.debounceWindowMs = ms;
  }

  /**
   * Process incoming prediction and determine if sign should be appended to sentence.
   */
  public processPrediction(prediction: PredictionResponse): { shouldAdd: boolean; sign: string } {
    if (!prediction || !prediction.is_valid || prediction.confidence < this.confidenceThreshold) {
      return { shouldAdd: false, sign: '' };
    }

    const sign = prediction.sign;
    if (sign === 'NO_HAND_DETECTED' || sign === 'UNKNOWN') {
      return { shouldAdd: false, sign: '' };
    }

    const now = Date.now();
    const timeSinceLast = now - this.lastAddedTimestamp;

    // Suppress duplicate sign if received within debounce window
    if (sign === this.lastAddedSign && timeSinceLast < this.debounceWindowMs) {
      return { shouldAdd: false, sign: '' };
    }

    // Valid new sign detected
    this.lastAddedSign = sign;
    this.lastAddedTimestamp = now;
    return { shouldAdd: true, sign };
  }

  public reset() {
    this.lastAddedSign = '';
    this.lastAddedTimestamp = 0;
  }
}

export class SentenceBuilder {
  private words: string[] = [];

  public addWord(word: string): string[] {
    if (word && word.trim() !== '') {
      this.words.push(word.trim().toUpperCase());
    }
    return [...this.words];
  }

  public backspace(): string[] {
    this.words.pop();
    return [...this.words];
  }

  public clear(): string[] {
    this.words = [];
    return [];
  }

  public getSentence(): string {
    return this.words.join(' ');
  }

  public getWords(): string[] {
    return [...this.words];
  }
}
