import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { Clock, Trash2, Volume2, Calendar, Award } from 'lucide-react-native';
import { HeaderBar } from '../../src/components/HeaderBar';
import { Card } from '../../src/components/Card';
import { Button } from '../../src/components/Button';
import { colors, spacing, borderRadius } from '../../src/theme';
import { TranslationHistoryItem } from '../../src/types';
import { getTranslationHistory, deleteTranslationItem, clearAllTranslationHistory } from '../../src/services/storage';
import { speakSentence } from '../../src/services/tts';

export default function HistoryScreen() {
  const [history, setHistory] = useState<TranslationHistoryItem[]>([]);

  const loadHistory = async () => {
    const data = await getTranslationHistory();
    setHistory(data);
  };

  useEffect(() => {
    loadHistory();
  }, []);

  const handleDelete = async (id: string) => {
    const updated = await deleteTranslationItem(id);
    setHistory(updated);
  };

  const handleClearAll = async () => {
    await clearAllTranslationHistory();
    setHistory([]);
  };

  const handleSpeak = (text: string) => {
    speakSentence(text);
  };

  return (
    <View style={styles.container}>
      <HeaderBar title="Translation History" />

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.topRow}>
          <Text style={styles.countText}>SAVED LOGS ({history.length})</Text>
          {history.length > 0 && (
            <TouchableOpacity onPress={handleClearAll} style={styles.clearAllBtn}>
              <Trash2 size={14} color={colors.danger} />
              <Text style={styles.clearAllText}>Clear All</Text>
            </TouchableOpacity>
          )}
        </View>

        {history.length === 0 ? (
          <Card style={styles.emptyCard}>
            <Clock size={40} color={colors.textSecondary} />
            <Text style={styles.emptyTitle}>No History Recorded</Text>
            <Text style={styles.emptyDesc}>
              Your live sign language translations will automatically appear here once spoken or saved.
            </Text>
          </Card>
        ) : (
          history.map((item) => (
            <Card key={item.id} style={styles.historyCard}>
              <View style={styles.itemTopRow}>
                <View style={styles.dateRow}>
                  <Calendar size={14} color={colors.secondary} />
                  <Text style={styles.dateText}>{item.dateTime}</Text>
                </View>
                <TouchableOpacity onPress={() => handleDelete(item.id)} style={styles.deleteBtn}>
                  <Trash2 size={16} color={colors.textSecondary} />
                </TouchableOpacity>
              </View>

              <Text style={styles.sentenceText}>{item.sentence}</Text>

              <View style={styles.metaRow}>
                <View style={styles.metaBadge}>
                  <Award size={12} color={colors.accent} />
                  <Text style={styles.metaText}>Confidence: {Math.round(item.confidence * 100)}%</Text>
                </View>

                <Text style={styles.durationText}>{item.durationSeconds}s duration</Text>

                <TouchableOpacity onPress={() => handleSpeak(item.sentence)} style={styles.speakBtn}>
                  <Volume2 size={16} color={colors.primary} />
                </TouchableOpacity>
              </View>
            </Card>
          ))
        )}
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
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.xs,
  },
  countText: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.secondary,
    letterSpacing: 1.1,
  },
  clearAllBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    padding: 4,
  },
  clearAllText: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.danger,
  },
  emptyCard: {
    alignItems: 'center',
    paddingVertical: spacing.xl,
    marginTop: spacing.md,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.textPrimary,
    marginTop: spacing.sm,
  },
  emptyDesc: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
    marginTop: spacing.xs,
    maxWidth: 260,
  },
  historyCard: {
    marginBottom: spacing.sm,
  },
  itemTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.xs,
  },
  dateRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  dateText: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  deleteBtn: {
    padding: 4,
  },
  sentenceText: {
    fontSize: 20,
    fontWeight: '800',
    color: colors.textPrimary,
    marginVertical: spacing.xs,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: spacing.xs,
    paddingTop: spacing.xs,
    borderTopWidth: 1,
    borderTopColor: colors.surfaceBorder,
  },
  metaBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  metaText: {
    fontSize: 12,
    color: colors.accent,
    fontWeight: '600',
  },
  durationText: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  speakBtn: {
    padding: 4,
  },
});
