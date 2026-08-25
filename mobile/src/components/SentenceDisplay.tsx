import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Volume2, Trash2, Delete, Play, Pause } from 'lucide-react-native';
import { colors, spacing, borderRadius } from '../theme';

interface Props {
  sentence: string;
  words: string[];
  isTranslating: boolean;
  isSpeaking: boolean;
  onToggleTranslate: () => void;
  onSpeak: () => void;
  onClear: () => void;
  onBackspace: () => void;
}

export const SentenceDisplay: React.FC<Props> = ({
  sentence,
  words,
  isTranslating,
  isSpeaking,
  onToggleTranslate,
  onSpeak,
  onClear,
  onBackspace,
}) => {
  return (
    <View style={styles.card}>
      <Text style={styles.headerLabel}>CURRENT TRANSLATION</Text>

      <View style={styles.sentenceBox}>
        {words.length === 0 ? (
          <Text style={styles.placeholderText}>
            {isTranslating
              ? 'Perform ISL signs in front of the camera...'
              : 'Translation paused. Press Start to resume.'}
          </Text>
        ) : (
          <View style={styles.chipsContainer}>
            {words.map((w, idx) => (
              <View key={`word_${idx}_${w}`} style={styles.wordChip}>
                <Text style={styles.chipText}>{w}</Text>
              </View>
            ))}
          </View>
        )}
      </View>

      {/* Control Buttons */}
      <View style={styles.controlsRow}>
        <TouchableOpacity
          style={[styles.btn, isTranslating ? styles.pauseBtn : styles.startBtn]}
          onPress={onToggleTranslate}
          accessibilityLabel={isTranslating ? 'Pause Translation' : 'Start Translation'}
        >
          {isTranslating ? (
            <Pause size={18} color="#FFFFFF" />
          ) : (
            <Play size={18} color="#FFFFFF" />
          )}
          <Text style={styles.btnText}>{isTranslating ? 'Pause' : 'Start'}</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.btn, styles.speakBtn, isSpeaking && styles.speakingActiveBtn]}
          onPress={onSpeak}
          disabled={words.length === 0}
          accessibilityLabel="Speak Sentence"
        >
          <Volume2 size={18} color="#FFFFFF" />
          <Text style={styles.btnText}>{isSpeaking ? 'Speaking...' : 'Speak'}</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.iconBtn, styles.subtleBtn]}
          onPress={onBackspace}
          disabled={words.length === 0}
          accessibilityLabel="Delete Last Word"
        >
          <Delete size={18} color={colors.textPrimary} />
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.iconBtn, styles.dangerBtn]}
          onPress={onClear}
          disabled={words.length === 0}
          accessibilityLabel="Clear Sentence"
        >
          <Trash2 size={18} color="#FFFFFF" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderColor: colors.surfaceBorder,
    borderWidth: 1,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    marginVertical: spacing.sm,
  },
  headerLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.secondary,
    letterSpacing: 1.2,
    marginBottom: spacing.xs,
  },
  sentenceBox: {
    minHeight: 64,
    backgroundColor: '#0F172A',
    borderRadius: borderRadius.md,
    padding: spacing.sm,
    justifyContent: 'center',
    marginBottom: spacing.md,
    borderColor: colors.surfaceBorder,
    borderWidth: 1,
  },
  placeholderText: {
    fontSize: 14,
    color: colors.textSecondary,
    fontStyle: 'italic',
    textAlign: 'center',
  },
  chipsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.xs,
  },
  wordChip: {
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.sm,
  },
  chipText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  controlsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  btn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.md,
  },
  startBtn: {
    backgroundColor: colors.accent,
  },
  pauseBtn: {
    backgroundColor: colors.warning,
  },
  speakBtn: {
    backgroundColor: colors.primary,
    flex: 1,
    justifyContent: 'center',
  },
  speakingActiveBtn: {
    backgroundColor: '#8B5CF6',
  },
  iconBtn: {
    padding: spacing.sm,
    borderRadius: borderRadius.md,
    justifyContent: 'center',
    alignItems: 'center',
  },
  subtleBtn: {
    backgroundColor: colors.surfaceBorder,
  },
  dangerBtn: {
    backgroundColor: colors.danger,
  },
  btnText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});
