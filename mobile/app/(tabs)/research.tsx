import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, ScrollView, TextInput, TouchableOpacity } from 'react-native';
import { BarChart3, Plus, CheckCircle, XCircle, Trash2, Award, Clock, Star } from 'lucide-react-native';
import { HeaderBar } from '../../src/components/HeaderBar';
import { Card } from '../../src/components/Card';
import { Button } from '../../src/components/Button';
import { colors, spacing, borderRadius } from '../../src/theme';
import { CommunicationMethod, ResearchTrial, ResearchAnalytics } from '../../src/types';
import { getResearchTrials, saveResearchTrial, clearAllResearchTrials, computeResearchAnalytics } from '../../src/services/storage';

export default function ResearchScreen() {
  const [trials, setTrials] = useState<ResearchTrial[]>([]);
  const [analytics, setAnalytics] = useState<ResearchAnalytics | null>(null);
  
  // Trial logger form state
  const [participantId, setParticipantId] = useState<string>('P01');
  const [selectedMethod, setSelectedMethod] = useState<CommunicationMethod>('AI SignSpeak');
  const [taskText, setTaskText] = useState<string>('Communicate emergency request HELP WATER');
  const [durationSec, setDurationSec] = useState<string>('4.5');
  const [isCorrect, setIsCorrect] = useState<boolean>(true);
  const [rating, setRating] = useState<number>(5);
  const [notes, setNotes] = useState<string>('Fast response');
  const [showLogForm, setShowLogForm] = useState<boolean>(false);

  const loadData = async () => {
    const list = await getResearchTrials();
    setTrials(list);
    const calculated = computeResearchAnalytics(list);
    setAnalytics(calculated);
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleAddTrial = async () => {
    if (!participantId || !taskText) return;

    await saveResearchTrial({
      participantId: participantId.trim(),
      method: selectedMethod,
      task: taskText.trim(),
      startTime: new Date().toISOString(),
      endTime: new Date().toISOString(),
      durationSeconds: parseFloat(durationSec) || 5.0,
      isCorrect,
      rating,
      notes: notes.trim(),
    });

    setShowLogForm(false);
    loadData();
  };

  const handleClearTrials = async () => {
    await clearAllResearchTrials();
    loadData();
  };

  const methodsList: CommunicationMethod[] = [
    'AI SignSpeak',
    'Traditional Gesture',
    'Written Communication',
  ];

  return (
    <View style={styles.container}>
      <HeaderBar title="Research Evaluation" />

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Research Study Header Card */}
        <Card style={styles.headerCard}>
          <View style={styles.titleRow}>
            <BarChart3 size={24} color={colors.secondary} />
            <Text style={styles.headerTitle}>Comparative Research Study</Text>
          </View>
          <Text style={styles.headerDesc}>
            Evaluating AI-driven sign language translation against traditional communication methods (gestures, writing) to measure accuracy, speed, and accessibility.
          </Text>

          <Button
            title={showLogForm ? 'Hide Experiment Logger' : 'Log New Experiment Trial'}
            onPress={() => setShowLogForm(!showLogForm)}
            icon={<Plus size={18} color="#FFFFFF" />}
            variant={showLogForm ? 'outline' : 'accent'}
            style={{ marginTop: spacing.xs }}
          />
        </Card>

        {/* Experiment Trial Logging Form */}
        {showLogForm && (
          <Card style={styles.formCard}>
            <Text style={styles.formTitle}>NEW EXPERIMENT TRIAL LOG</Text>

            <Text style={styles.inputLabel}>Participant ID:</Text>
            <TextInput
              style={styles.textInput}
              value={participantId}
              onChangeText={setParticipantId}
              placeholder="e.g. P01"
              placeholderTextColor={colors.textSecondary}
            />

            <Text style={styles.inputLabel}>Communication Method:</Text>
            <View style={styles.methodSelector}>
              {methodsList.map((m) => (
                <TouchableOpacity
                  key={m}
                  style={[styles.methodChip, selectedMethod === m && styles.activeMethodChip]}
                  onPress={() => setSelectedMethod(m)}
                >
                  <Text style={[styles.methodText, selectedMethod === m && styles.activeMethodText]}>
                    {m}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <Text style={styles.inputLabel}>Assigned Task / Phrase:</Text>
            <TextInput
              style={styles.textInput}
              value={taskText}
              onChangeText={setTaskText}
              placeholder="e.g. Request Water"
              placeholderTextColor={colors.textSecondary}
            />

            <View style={styles.rowTwo}>
              <View style={{ flex: 1 }}>
                <Text style={styles.inputLabel}>Duration (Seconds):</Text>
                <TextInput
                  style={styles.textInput}
                  value={durationSec}
                  onChangeText={setDurationSec}
                  keyboardType="numeric"
                />
              </View>

              <View style={{ flex: 1 }}>
                <Text style={styles.inputLabel}>Outcome:</Text>
                <TouchableOpacity
                  style={[styles.toggleBtn, isCorrect ? styles.correctBtn : styles.incorrectBtn]}
                  onPress={() => setIsCorrect(!isCorrect)}
                >
                  {isCorrect ? <CheckCircle size={16} color="#FFFFFF" /> : <XCircle size={16} color="#FFFFFF" />}
                  <Text style={styles.toggleBtnText}>{isCorrect ? 'Correct' : 'Incorrect'}</Text>
                </TouchableOpacity>
              </View>
            </View>

            <Text style={styles.inputLabel}>User Rating (1 - 5 Likert Scale):</Text>
            <View style={styles.ratingRow}>
              {[1, 2, 3, 4, 5].map((star) => (
                <TouchableOpacity key={star} onPress={() => setRating(star)}>
                  <Star size={26} color={star <= rating ? colors.warning : colors.surfaceBorder} fill={star <= rating ? colors.warning : 'transparent'} />
                </TouchableOpacity>
              ))}
            </View>

            <Button title="Save Experiment Trial" onPress={handleAddTrial} style={{ marginTop: spacing.md }} />
          </Card>
        )}

        {/* RESULTS DASHBOARD */}
        <View style={styles.dashboardHeaderRow}>
          <Text style={styles.sectionHeader}>RESEARCH RESULTS DASHBOARD</Text>
          {trials.length > 0 && (
            <TouchableOpacity onPress={handleClearTrials} style={styles.clearBtn}>
              <Trash2 size={14} color={colors.danger} />
              <Text style={styles.clearText}>Clear Logs</Text>
            </TouchableOpacity>
          )}
        </View>

        {!analytics || analytics.totalTrials === 0 ? (
          <Card style={styles.emptyCard}>
            <BarChart3 size={36} color={colors.textSecondary} />
            <Text style={styles.emptyTitle}>No Data Collected</Text>
            <Text style={styles.emptyDesc}>
              No experimental trial data has been recorded yet. Log trials above to compute empirical metrics.
            </Text>
          </Card>
        ) : (
          <>
            {/* Metric Summary Cards */}
            <View style={styles.metricsGrid}>
              <View style={styles.metricCard}>
                <Award size={20} color={colors.accent} />
                <Text style={styles.metricValue}>{analytics.accuracy}%</Text>
                <Text style={styles.metricLabel}>Accuracy Rate</Text>
              </View>

              <View style={styles.metricCard}>
                <Clock size={20} color={colors.secondary} />
                <Text style={styles.metricValue}>{analytics.avgResponseTimeSeconds}s</Text>
                <Text style={styles.metricLabel}>Avg Response Time</Text>
              </View>

              <View style={styles.metricCard}>
                <CheckCircle size={20} color={colors.primary} />
                <Text style={styles.metricValue}>{analytics.taskCompletionRate}%</Text>
                <Text style={styles.metricLabel}>Completion Rate</Text>
              </View>

              <View style={styles.metricCard}>
                <Star size={20} color={colors.warning} />
                <Text style={styles.metricValue}>{analytics.userSatisfactionScore} / 5</Text>
                <Text style={styles.metricLabel}>Satisfaction Index</Text>
              </View>
            </View>

            {/* Method Breakdown Comparison Table */}
            <Card style={styles.tableCard}>
              <Text style={styles.tableTitle}>METHOD COMPARISON SUMMARY</Text>

              <View style={styles.tableHeader}>
                <Text style={[styles.th, { flex: 2 }]}>Method</Text>
                <Text style={styles.th}>Accuracy</Text>
                <Text style={styles.th}>Avg Time</Text>
                <Text style={styles.th}>Rating</Text>
              </View>

              {methodsList.map((m) => {
                const b = analytics.methodBreakdown[m];
                return (
                  <View key={m} style={styles.tableRow}>
                    <Text style={[styles.td, { flex: 2, fontWeight: '700' }]}>{m}</Text>
                    <Text style={styles.td}>{b.trials > 0 ? `${b.accuracy}%` : '-'}</Text>
                    <Text style={styles.td}>{b.trials > 0 ? `${b.avgTime}s` : '-'}</Text>
                    <Text style={styles.td}>{b.trials > 0 ? `${b.satisfaction}/5` : '-'}</Text>
                  </View>
                );
              })}
            </Card>
          </>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  scrollContent: { padding: spacing.md },
  headerCard: { marginBottom: spacing.md },
  titleRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.xs, marginBottom: spacing.xs },
  headerTitle: { fontSize: 20, fontWeight: '800', color: colors.textPrimary },
  headerDesc: { fontSize: 13, color: colors.textSecondary, lineHeight: 18, marginBottom: spacing.sm },
  formCard: { borderColor: colors.primary, borderWidth: 1.5, marginBottom: spacing.md },
  formTitle: { fontSize: 13, fontWeight: '700', color: colors.secondary, letterSpacing: 1 },
  inputLabel: { fontSize: 13, color: colors.textSecondary, marginTop: spacing.sm, marginBottom: 4, fontWeight: '600' },
  textInput: { backgroundColor: '#0F172A', borderColor: colors.surfaceBorder, borderWidth: 1, borderRadius: borderRadius.md, paddingHorizontal: spacing.sm, paddingVertical: spacing.xs, color: colors.textPrimary, fontSize: 14 },
  methodSelector: { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
  methodChip: { paddingHorizontal: spacing.sm, paddingVertical: 6, borderRadius: borderRadius.sm, backgroundColor: '#0F172A', borderColor: colors.surfaceBorder, borderWidth: 1 },
  activeMethodChip: { backgroundColor: colors.primary, borderColor: colors.primary },
  methodText: { fontSize: 12, color: colors.textSecondary, fontWeight: '600' },
  activeMethodText: { color: '#FFFFFF' },
  rowTwo: { flexDirection: 'row', gap: spacing.sm },
  toggleBtn: { height: 40, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, borderRadius: borderRadius.md },
  correctBtn: { backgroundColor: colors.accent },
  incorrectBtn: { backgroundColor: colors.danger },
  toggleBtnText: { color: '#FFFFFF', fontWeight: '700', fontSize: 13 },
  ratingRow: { flexDirection: 'row', gap: spacing.sm, marginVertical: spacing.xs },
  dashboardHeaderRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: spacing.xs, marginBottom: spacing.xs },
  sectionHeader: { fontSize: 12, fontWeight: '700', color: colors.textSecondary, letterSpacing: 1.2 },
  clearBtn: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  clearText: { fontSize: 12, color: colors.danger, fontWeight: '600' },
  emptyCard: { alignItems: 'center', paddingVertical: spacing.xl },
  emptyTitle: { fontSize: 18, fontWeight: '700', color: colors.textPrimary, marginTop: spacing.sm },
  emptyDesc: { fontSize: 13, color: colors.textSecondary, textAlign: 'center', marginTop: spacing.xs, maxWidth: 280 },
  metricsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm, marginBottom: spacing.md },
  metricCard: { width: '48%', backgroundColor: colors.surface, borderColor: colors.surfaceBorder, borderWidth: 1, borderRadius: borderRadius.md, padding: spacing.md, alignItems: 'center' },
  metricValue: { fontSize: 24, fontWeight: '800', color: colors.textPrimary, marginVertical: 4 },
  metricLabel: { fontSize: 12, color: colors.textSecondary, fontWeight: '600' },
  tableCard: { marginTop: spacing.xs },
  tableTitle: { fontSize: 12, fontWeight: '700', color: colors.secondary, letterSpacing: 1, marginBottom: spacing.sm },
  tableHeader: { flexDirection: 'row', paddingBottom: spacing.xs, borderBottomWidth: 1, borderBottomColor: colors.surfaceBorder },
  th: { flex: 1, fontSize: 11, fontWeight: '700', color: colors.textSecondary, textAlign: 'center' },
  tableRow: { flexDirection: 'row', paddingVertical: spacing.sm, borderBottomWidth: 1, borderBottomColor: colors.surfaceBorder },
  td: { flex: 1, fontSize: 13, color: colors.textPrimary, textAlign: 'center' },
});
