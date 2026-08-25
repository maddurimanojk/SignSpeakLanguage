import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, ScrollView, TextInput, TouchableOpacity, Switch, Alert } from 'react-native';
import { Settings, Server, Volume2, Shield, Info, CheckCircle2, AlertCircle, RefreshCw, RotateCcw } from 'lucide-react-native';
import { HeaderBar } from '../../src/components/HeaderBar';
import { Card } from '../../src/components/Card';
import { Button } from '../../src/components/Button';
import { colors, spacing, borderRadius } from '../../src/theme';
import { AppSettings } from '../../src/types';
import { getAppSettings, saveAppSettings, resetAppSettings } from '../../src/services/storage';
import { checkBackendHealth } from '../../src/services/api';

export default function SettingsScreen() {
  const [settings, setSettings] = useState<AppSettings>({
    speechSpeed: 1.0,
    speechPitch: 1.0,
    speechVolume: 1.0,
    confidenceThreshold: 0.75,
    backendUrl: 'http://localhost:8000',
    isDemoMode: true,
    themeMode: 'dark',
    cameraType: 'back',
  });

  const [connectionStatus, setConnectionStatus] = useState<'checking' | 'connected' | 'failed'>('checking');

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    const s = await getAppSettings();
    setSettings(s);
    testConnection(s.backendUrl);
  };

  const testConnection = async (url: string) => {
    setConnectionStatus('checking');
    const res = await checkBackendHealth(url);
    setConnectionStatus(res.isAvailable ? 'connected' : 'failed');
  };

  const handleSaveBackendUrl = async () => {
    const updated = await saveAppSettings({ backendUrl: settings.backendUrl });
    setSettings(updated);
    testConnection(updated.backendUrl);
  };

  const handleToggleDemo = async (val: boolean) => {
    const updated = await saveAppSettings({ isDemoMode: val });
    setSettings(updated);
  };

  const handleUpdateConfidence = async (val: number) => {
    const updated = await saveAppSettings({ confidenceThreshold: val });
    setSettings(updated);
  };

  const handleUpdateSpeed = async (val: number) => {
    const updated = await saveAppSettings({ speechSpeed: val });
    setSettings(updated);
  };

  const handleResetSettings = () => {
    Alert.alert(
      'Reset Settings',
      'Are you sure you want to restore default application settings?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Reset',
          style: 'destructive',
          onPress: async () => {
            const res = await resetAppSettings();
            setSettings(res);
            testConnection(res.backendUrl);
          },
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <HeaderBar title="Application Settings" />

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Backend Configuration Card */}
        <Card style={styles.card}>
          <View style={styles.cardTitleRow}>
            <Server size={20} color={colors.secondary} />
            <Text style={styles.cardTitle}>Backend Server Configuration</Text>
          </View>

          <Text style={styles.label}>FastAPI Server URL:</Text>
          <TextInput
            style={styles.textInput}
            value={settings.backendUrl}
            onChangeText={(txt) => setSettings({ ...settings, backendUrl: txt })}
            placeholder="http://192.168.1.50:8000"
            placeholderTextColor={colors.textSecondary}
            autoCapitalize="none"
            autoCorrect={false}
          />

          <View style={styles.connectionStatusRow}>
            <View style={styles.statusLeft}>
              {connectionStatus === 'connected' && <CheckCircle2 size={16} color={colors.accent} />}
              {connectionStatus === 'failed' && <AlertCircle size={16} color={colors.warning} />}
              {connectionStatus === 'checking' && <RefreshCw size={16} color={colors.secondary} />}
              <Text style={styles.statusText}>
                {connectionStatus === 'connected' && 'Backend Connected & Active'}
                {connectionStatus === 'failed' && 'Offline / Demo Mode Active'}
                {connectionStatus === 'checking' && 'Testing endpoint...'}
              </Text>
            </View>

            <TouchableOpacity style={styles.testBtn} onPress={handleSaveBackendUrl}>
              <Text style={styles.testBtnText}>Save & Test</Text>
            </TouchableOpacity>
          </View>

          <Text style={styles.helperText}>
            Tip for Physical Phone: Replace 'localhost' with your Mac's Wi-Fi IP address (e.g. http://192.168.1.X:8000).
          </Text>
        </Card>

        {/* AI & Inference Preferences */}
        <Card style={styles.card}>
          <View style={styles.cardTitleRow}>
            <Settings size={20} color={colors.primary} />
            <Text style={styles.cardTitle}>AI & Inference Controls</Text>
          </View>

          <View style={styles.switchRow}>
            <View style={{ flex: 1 }}>
              <Text style={styles.switchLabel}>Demo / Mock Inference Mode</Text>
              <Text style={styles.switchDesc}>Enables client fallback when model is not trained.</Text>
            </View>
            <Switch
              value={settings.isDemoMode}
              onValueChange={handleToggleDemo}
              trackColor={{ false: colors.surfaceBorder, true: colors.primary }}
            />
          </View>

          <Text style={styles.label}>Confidence Threshold: {Math.round(settings.confidenceThreshold * 100)}%</Text>
          <View style={styles.chipSelector}>
            {[0.60, 0.70, 0.75, 0.85, 0.90].map((th) => (
              <TouchableOpacity
                key={th}
                style={[styles.chip, settings.confidenceThreshold === th && styles.activeChip]}
                onPress={() => handleUpdateConfidence(th)}
              >
                <Text style={[styles.chipText, settings.confidenceThreshold === th && styles.activeChipText]}>
                  {Math.round(th * 100)}%
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </Card>

        {/* Text-to-Speech Settings */}
        <Card style={styles.card}>
          <View style={styles.cardTitleRow}>
            <Volume2 size={20} color={colors.accent} />
            <Text style={styles.cardTitle}>Text-to-Speech Output</Text>
          </View>

          <Text style={styles.label}>Speech Speed Rate: {settings.speechSpeed}x</Text>
          <View style={styles.chipSelector}>
            {[0.75, 1.0, 1.25, 1.5].map((spd) => (
              <TouchableOpacity
                key={spd}
                style={[styles.chip, settings.speechSpeed === spd && styles.activeChip]}
                onPress={() => handleUpdateSpeed(spd)}
              >
                <Text style={[styles.chipText, settings.speechSpeed === spd && styles.activeChipText]}>
                  {spd}x
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </Card>

        {/* Privacy & Reset */}
        <Card style={styles.card}>
          <View style={styles.cardTitleRow}>
            <Shield size={20} color={colors.warning} />
            <Text style={styles.cardTitle}>About & Reset</Text>
          </View>

          <Text style={styles.aboutText}>
            SignSpeak AI v1.0.0 | Academic Research Prototype{'\n'}
            Designed for Indian Sign Language (ISL) Real-Time Gesture Translation & Accessibility Evaluation.
          </Text>
          <Text style={styles.privacyText}>
            🔒 Privacy Policy: Camera frames and hand landmarks are processed locally on device or sent exclusively to your designated backend server. No camera video streams are stored remotely.
          </Text>

          <TouchableOpacity style={styles.resetBtn} onPress={handleResetSettings}>
            <RotateCcw size={16} color={colors.danger} />
            <Text style={styles.resetBtnText}>Reset Settings to Default</Text>
          </TouchableOpacity>
        </Card>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  scrollContent: { padding: spacing.md },
  card: { marginBottom: spacing.md },
  cardTitleRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.xs, marginBottom: spacing.sm },
  cardTitle: { fontSize: 16, fontWeight: '700', color: colors.textPrimary },
  label: { fontSize: 13, fontWeight: '600', color: colors.textSecondary, marginBottom: 4, marginTop: spacing.xs },
  textInput: { backgroundColor: '#0F172A', borderColor: colors.surfaceBorder, borderWidth: 1, borderRadius: borderRadius.md, paddingHorizontal: spacing.sm, paddingVertical: spacing.xs, color: colors.textPrimary, fontSize: 14 },
  connectionStatusRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: spacing.sm },
  statusLeft: { flexDirection: 'row', alignItems: 'center', gap: 6, flex: 1 },
  statusText: { fontSize: 12, color: colors.textSecondary, fontWeight: '600' },
  testBtn: { backgroundColor: colors.primary, paddingHorizontal: spacing.sm, paddingVertical: 6, borderRadius: borderRadius.sm },
  testBtnText: { color: '#FFFFFF', fontSize: 12, fontWeight: '700' },
  helperText: { fontSize: 11, color: colors.textSecondary, fontStyle: 'italic', marginTop: spacing.xs, lineHeight: 15 },
  switchRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginVertical: spacing.xs },
  switchLabel: { fontSize: 14, fontWeight: '700', color: colors.textPrimary },
  switchDesc: { fontSize: 12, color: colors.textSecondary },
  chipSelector: { flexDirection: 'row', gap: spacing.xs, marginTop: 4 },
  chip: { paddingHorizontal: spacing.sm, paddingVertical: 6, borderRadius: borderRadius.sm, backgroundColor: '#0F172A', borderColor: colors.surfaceBorder, borderWidth: 1 },
  activeChip: { backgroundColor: colors.primary, borderColor: colors.primary },
  chipText: { fontSize: 12, color: colors.textSecondary, fontWeight: '600' },
  activeChipText: { color: '#FFFFFF' },
  aboutText: { fontSize: 13, color: colors.textPrimary, lineHeight: 18, marginBottom: spacing.xs },
  privacyText: { fontSize: 12, color: colors.textSecondary, lineHeight: 16 },
  resetBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, marginTop: spacing.md, paddingVertical: spacing.xs, borderWidth: 1, borderColor: 'rgba(239, 68, 68, 0.4)', borderRadius: borderRadius.sm, backgroundColor: 'rgba(239, 68, 68, 0.1)' },
  resetBtnText: { color: colors.danger, fontSize: 13, fontWeight: '700' },
});
