import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Camera, BookOpen, Clock, BarChart3, Info, Sparkles, CheckCircle2 } from 'lucide-react-native';
import { HeaderBar } from '../../src/components/HeaderBar';
import { Card } from '../../src/components/Card';
import { Button } from '../../src/components/Button';
import { colors, spacing, borderRadius } from '../../src/theme';
import { checkBackendHealth } from '../../src/services/api';
import { getAppSettings } from '../../src/services/storage';

export default function HomeScreen() {
  const router = useRouter();
  const [isConnected, setIsConnected] = useState<boolean>(true);
  const [inferenceMode, setInferenceMode] = useState<string>('DEMO_MOCK');

  useEffect(() => {
    async function loadHealth() {
      const settings = await getAppSettings();
      const res = await checkBackendHealth(settings.backendUrl);
      setIsConnected(res.isAvailable);
      if (res.isAvailable && res.info) {
        setInferenceMode(res.info.inference_mode);
      }
    }
    loadHealth();
  }, []);

  return (
    <View style={styles.container}>
      <HeaderBar title="SignSpeak AI" isBackendConnected={isConnected} />

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Hero Card */}
        <Card style={styles.heroCard}>
          <View style={styles.heroBadgeRow}>
            <Sparkles size={16} color={colors.secondary} />
            <Text style={styles.heroBadgeText}>Academic AI Prototype</Text>
          </View>
          <Text style={styles.heroTitle}>Real-Time Sign Language → Speech</Text>
          <Text style={styles.heroSubtitle}>
            Translate Indian Sign Language (ISL) hand gestures into spoken text instantly using live hand landmark detection.
          </Text>

          <Button
            title="Start Live Translation"
            onPress={() => router.push('/(tabs)/translate')}
            icon={<Camera size={20} color="#FFFFFF" />}
            style={styles.heroButton}
          />
        </Card>

        {/* Quick Actions Grid */}
        <Text style={styles.sectionHeader}>QUICK ACTIONS</Text>
        <View style={styles.grid}>
          <TouchableOpacity
            style={styles.gridCard}
            onPress={() => router.push('/(tabs)/learn')}
          >
            <View style={[styles.iconBox, { backgroundColor: 'rgba(6, 182, 212, 0.15)' }]}>
              <BookOpen size={24} color={colors.secondary} />
            </View>
            <Text style={styles.gridTitle}>Learn Signs</Text>
            <Text style={styles.gridDesc}>Browse 27 ISL sign cards & gestures</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.gridCard}
            onPress={() => router.push('/(tabs)/history')}
          >
            <View style={[styles.iconBox, { backgroundColor: 'rgba(59, 130, 246, 0.15)' }]}>
              <Clock size={24} color={colors.primary} />
            </View>
            <Text style={styles.gridTitle}>History</Text>
            <Text style={styles.gridDesc}>View saved translation logs</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.gridCard}
            onPress={() => router.push('/(tabs)/research')}
          >
            <View style={[styles.iconBox, { backgroundColor: 'rgba(16, 185, 129, 0.15)' }]}>
              <BarChart3 size={24} color={colors.accent} />
            </View>
            <Text style={styles.gridTitle}>Research Suite</Text>
            <Text style={styles.gridDesc}>Compare AI vs Traditional metrics</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.gridCard}
            onPress={() => router.push('/(tabs)/settings')}
          >
            <View style={[styles.iconBox, { backgroundColor: 'rgba(245, 158, 11, 0.15)' }]}>
              <Info size={24} color={colors.warning} />
            </View>
            <Text style={styles.gridTitle}>Settings</Text>
            <Text style={styles.gridDesc}>Backend URL & speech parameters</Text>
          </TouchableOpacity>
        </View>

        {/* System Information Card */}
        <Card style={styles.infoCard}>
          <View style={styles.infoTitleRow}>
            <Info size={20} color={colors.secondary} />
            <Text style={styles.infoTitle}>How SignSpeak AI Works</Text>
          </View>

          <View style={styles.infoStep}>
            <CheckCircle2 size={16} color={colors.accent} />
            <Text style={styles.infoStepText}>
              <Text style={{ fontWeight: '700' }}>Camera Feed:</Text> Captures live video stream and extracts 21 3D hand landmark coordinates.
            </Text>
          </View>

          <View style={styles.infoStep}>
            <CheckCircle2 size={16} color={colors.accent} />
            <Text style={styles.infoStepText}>
              <Text style={{ fontWeight: '700' }}>AI Classifier:</Text> Evaluates feature vector via FastAPI Keras LSTM or Demo engine ({inferenceMode}).
            </Text>
          </View>

          <View style={styles.infoStep}>
            <CheckCircle2 size={16} color={colors.accent} />
            <Text style={styles.infoStepText}>
              <Text style={{ fontWeight: '700' }}>Debounce & Sentence:</Text> Prevents duplicate sign spam and builds consecutive word sentences.
            </Text>
          </View>

          <View style={styles.infoStep}>
            <CheckCircle2 size={16} color={colors.accent} />
            <Text style={styles.infoStepText}>
              <Text style={{ fontWeight: '700' }}>Speech Synthesis:</Text> Converts final sentence into clear voice output using native TTS.
            </Text>
          </View>

          <View style={styles.scopeNotice}>
            <Text style={styles.scopeNoticeText}>
              Notice: Prototype supports 27 initial core ISL vocabulary signs.
            </Text>
          </View>
        </Card>
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
  heroCard: {
    backgroundColor: '#1E293B',
    borderColor: colors.primary,
    borderWidth: 1.5,
    padding: spacing.lg,
  },
  heroBadgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: spacing.xs,
  },
  heroBadgeText: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.secondary,
  },
  heroTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: colors.textPrimary,
    marginBottom: spacing.xs,
  },
  heroSubtitle: {
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 20,
    marginBottom: spacing.md,
  },
  heroButton: {
    marginTop: spacing.xs,
  },
  sectionHeader: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.textSecondary,
    letterSpacing: 1.2,
    marginTop: spacing.md,
    marginBottom: spacing.xs,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  gridCard: {
    width: '48%',
    backgroundColor: colors.surface,
    borderColor: colors.surfaceBorder,
    borderWidth: 1,
    borderRadius: borderRadius.md,
    padding: spacing.md,
  },
  iconBox: {
    width: 44,
    height: 44,
    borderRadius: borderRadius.sm,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  gridTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: 2,
  },
  gridDesc: {
    fontSize: 12,
    color: colors.textSecondary,
    lineHeight: 16,
  },
  infoCard: {
    marginTop: spacing.md,
  },
  infoTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    marginBottom: spacing.sm,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  infoStep: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.xs,
    marginVertical: 4,
  },
  infoStepText: {
    fontSize: 13,
    color: colors.textSecondary,
    flex: 1,
    lineHeight: 18,
  },
  scopeNotice: {
    marginTop: spacing.sm,
    padding: spacing.xs,
    backgroundColor: 'rgba(245, 158, 11, 0.1)',
    borderRadius: borderRadius.sm,
    borderColor: 'rgba(245, 158, 11, 0.3)',
    borderWidth: 1,
  },
  scopeNoticeText: {
    fontSize: 12,
    color: colors.warning,
    fontWeight: '600',
    textAlign: 'center',
  },
});
