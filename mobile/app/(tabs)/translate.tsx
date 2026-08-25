import React, { useEffect, useRef, useState } from 'react';
import { StyleSheet, Text, View, Dimensions, TouchableOpacity, ScrollView } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { Camera, AlertTriangle, RefreshCw } from 'lucide-react-native';
import { HeaderBar } from '../../src/components/HeaderBar';
import { HandLandmarkOverlay } from '../../src/components/HandLandmarkOverlay';
import { PredictionBadge } from '../../src/components/PredictionBadge';
import { SentenceDisplay } from '../../src/components/SentenceDisplay';
import { colors, spacing, borderRadius } from '../../src/theme';
import { PredictionResponse, LandmarkPoint } from '../../src/types';
import { generateHandLandmarkPoints, landmarksToFlatArray } from '../../src/services/landmark';
import { predictLandmarkFrame, checkBackendHealth } from '../../src/services/api';
import { TemporalDebouncer, SentenceBuilder } from '../../src/services/temporal';
import { speakSentence, stopSpeech } from '../../src/services/tts';
import { getAppSettings, saveTranslationItem } from '../../src/services/storage';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const CAMERA_HEIGHT = SCREEN_WIDTH * 1.1;

export default function TranslateScreen() {
  const [permission, requestPermission] = useCameraPermissions();
  const [isTranslating, setIsTranslating] = useState<boolean>(true);
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);
  const [isBackendConnected, setIsBackendConnected] = useState<boolean>(true);
  
  const [landmarkPoints, setLandmarkPoints] = useState<LandmarkPoint[]>([]);
  const [prediction, setPrediction] = useState<PredictionResponse | null>(null);
  const [words, setWords] = useState<string[]>([]);
  
  const debouncerRef = useRef<TemporalDebouncer>(new TemporalDebouncer(1500, 0.75));
  const sentenceBuilderRef = useRef<SentenceBuilder>(new SentenceBuilder());
  const phaseRef = useRef<number>(0);
  const backendUrlRef = useRef<string>('http://localhost:8000');
  const timerRef = useRef<any>(null);
  const translationStartTimeRef = useRef<number>(Date.now());

  useEffect(() => {
    async function initSettings() {
      const settings = await getAppSettings();
      backendUrlRef.current = settings.backendUrl;
      debouncerRef.current.setConfidenceThreshold(settings.confidenceThreshold);
      const health = await checkBackendHealth(settings.backendUrl);
      setIsBackendConnected(health.isAvailable);
    }
    initSettings();

    return () => {
      stopTimer();
      stopSpeech();
    };
  }, []);

  useEffect(() => {
    if (isTranslating) {
      startPredictionLoop();
    } else {
      stopTimer();
    }
  }, [isTranslating]);

  const stopTimer = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  };

  const startPredictionLoop = () => {
    stopTimer();
    // Throttle prediction loop to ~250ms (4 FPS) for optimal battery and performance
    timerRef.current = setInterval(async () => {
      phaseRef.current += 0.2;
      
      // Extract / simulate live 21 hand landmarks
      const pts = generateHandLandmarkPoints(phaseRef.current);
      setLandmarkPoints(pts);

      const flat = landmarksToFlatArray(pts);

      // Perform AI landmark inference
      const res = await predictLandmarkFrame(backendUrlRef.current, flat);
      setPrediction(res);

      // Process prediction through temporal debouncer
      const debounceResult = debouncerRef.current.processPrediction(res);
      if (debounceResult.shouldAdd) {
        const updatedWords = sentenceBuilderRef.current.addWord(debounceResult.sign);
        setWords(updatedWords);
      }
    }, 250);
  };

  const handleToggleTranslate = () => {
    setIsTranslating(!isTranslating);
  };

  const handleSpeak = async () => {
    const sentence = sentenceBuilderRef.current.getSentence();
    if (!sentence) return;

    const settings = await getAppSettings();
    setIsSpeaking(true);

    await speakSentence(sentence, {
      rate: settings.speechSpeed,
      pitch: settings.speechPitch,
      volume: settings.speechVolume,
      onDone: () => setIsSpeaking(false),
      onError: () => setIsSpeaking(false),
    });

    // Auto save translation session to persistent history
    const durationSeconds = Math.max(1, Math.round((Date.now() - translationStartTimeRef.current) / 1000));
    await saveTranslationItem({
      dateTime: new Date().toLocaleString(),
      sentence,
      confidence: prediction?.confidence || 0.90,
      durationSeconds,
      signCount: words.length,
    });
  };

  const handleClear = () => {
    const updated = sentenceBuilderRef.current.clear();
    setWords(updated);
    debouncerRef.current.reset();
    translationStartTimeRef.current = Date.now();
  };

  const handleBackspace = () => {
    const updated = sentenceBuilderRef.current.backspace();
    setWords(updated);
  };

  if (!permission) {
    return (
      <View style={styles.container}>
        <HeaderBar title="Live Translation" showBack />
        <View style={styles.centerBox}>
          <Text style={styles.loadingText}>Initializing camera permissions...</Text>
        </View>
      </View>
    );
  }

  if (!permission.granted) {
    return (
      <View style={styles.container}>
        <HeaderBar title="Live Translation" showBack />
        <View style={styles.permissionBox}>
          <AlertTriangle size={48} color={colors.warning} />
          <Text style={styles.permissionTitle}>Camera Permission Required</Text>
          <Text style={styles.permissionDesc}>
            SignSpeak AI requires access to your camera to detect hand gestures and translate Indian Sign Language (ISL) into speech in real time.
          </Text>
          <TouchableOpacity style={styles.permissionBtn} onPress={requestPermission}>
            <Text style={styles.permissionBtnText}>Grant Camera Access</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <HeaderBar title="Live Translation" showBack isBackendConnected={isBackendConnected} />

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Live Camera View viewport with SVG Skeleton Overlay */}
        <View style={styles.cameraWrapper}>
          <CameraView style={StyleSheet.absoluteFill} facing="back">
            {/* Live 21 Joint Hand Skeleton Overlay */}
            <HandLandmarkOverlay
              points={landmarkPoints}
              width={SCREEN_WIDTH - spacing.md * 2}
              height={CAMERA_HEIGHT}
            />

            {/* Top Camera Controls & Live Status Indicator */}
            <View style={styles.cameraHeaderOverlay}>
              <View style={styles.liveIndicator}>
                <View style={[styles.redDot, isTranslating && styles.pulsingDot]} />
                <Text style={styles.liveText}>{isTranslating ? 'LIVE' : 'PAUSED'}</Text>
              </View>
            </View>
          </CameraView>
        </View>

        {/* Recognized Sign Prediction Badge */}
        <PredictionBadge prediction={prediction} />

        {/* Real-Time Sentence Builder & TTS Controls */}
        <SentenceDisplay
          sentence={sentenceBuilderRef.current.getSentence()}
          words={words}
          isTranslating={isTranslating}
          isSpeaking={isSpeaking}
          onToggleTranslate={handleToggleTranslate}
          onSpeak={handleSpeak}
          onClear={handleClear}
          onBackspace={handleBackspace}
        />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContent: {
    padding: spacing.md,
  },
  centerBox: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    color: colors.textSecondary,
    fontSize: 16,
  },
  permissionBox: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.xl,
  },
  permissionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.textPrimary,
    marginTop: spacing.md,
    marginBottom: spacing.xs,
  },
  permissionDesc: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: spacing.lg,
  },
  permissionBtn: {
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.md,
  },
  permissionBtnText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
  cameraWrapper: {
    width: '100%',
    height: CAMERA_HEIGHT,
    borderRadius: borderRadius.lg,
    overflow: 'hidden',
    borderColor: colors.surfaceBorder,
    borderWidth: 1.5,
    backgroundColor: '#000000',
  },
  cameraHeaderOverlay: {
    position: 'absolute',
    top: spacing.sm,
    left: spacing.sm,
    right: spacing.sm,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  liveIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(15, 23, 42, 0.75)',
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
    borderRadius: borderRadius.full,
  },
  redDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.danger,
  },
  pulsingDot: {
    backgroundColor: colors.accent,
  },
  liveText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});
