import { BackendHealthResponse, PredictionResponse } from '../types';

const DEFAULT_BACKEND_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

export function getBackendUrl(): string {
  return localStorage.getItem('signspeak_backend_url') || DEFAULT_BACKEND_URL;
}

export function setBackendUrl(url: string): void {
  localStorage.setItem('signspeak_backend_url', url);
}

export function isInternetOnline(): boolean {
  return typeof navigator !== 'undefined' ? navigator.onLine : true;
}

export async function fetchBackendHealth(urlOverride?: string): Promise<{ isAvailable: boolean; info: BackendHealthResponse | null; error?: string }> {
  if (!isInternetOnline()) {
    return { isAvailable: false, info: null, error: 'Internet connection required for SignSpeak AI translation.' };
  }

  const targetUrl = urlOverride || getBackendUrl();
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 4000);

    const response = await fetch(`${targetUrl}/health`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (response.ok) {
      const data: BackendHealthResponse = await response.json();
      return { isAvailable: true, info: data };
    }
    return { isAvailable: false, info: null, error: `Backend returned status ${response.status}` };
  } catch (err: any) {
    return {
      isAvailable: false,
      info: null,
      error: err.name === 'AbortError' ? 'Connection timeout' : 'Unable to connect to SignSpeak AI server.',
    };
  }
}

export async function predictLandmarks(landmarks: number[][]): Promise<PredictionResponse | null> {
  if (!isInternetOnline()) {
    throw new Error('Internet connection required for SignSpeak AI translation.');
  }

  const targetUrl = getBackendUrl();
  try {
    const response = await fetch(`${targetUrl}/predict`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ landmarks, timestamp: new Date().toISOString() }),
    });

    if (response.ok) {
      return await response.json();
    }
    return null;
  } catch (err) {
    console.error('API Prediction error:', err);
    return null;
  }
}

export async function predictSequence(sequence: number[][][]): Promise<PredictionResponse | null> {
  if (!isInternetOnline()) {
    throw new Error('Internet connection required for SignSpeak AI translation.');
  }

  const targetUrl = getBackendUrl();
  try {
    const response = await fetch(`${targetUrl}/predict/sequence`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ sequence, timestamp: new Date().toISOString() }),
    });

    if (response.ok) {
      return await response.json();
    }
    return null;
  } catch (err) {
    console.error('API Sequence Prediction error:', err);
    return null;
  }
}
