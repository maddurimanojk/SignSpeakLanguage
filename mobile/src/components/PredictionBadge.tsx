import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { colors, spacing, borderRadius } from '../theme';
import { PredictionResponse } from '../types';

interface Props {
  prediction: PredictionResponse | null;
}

export const PredictionBadge: React.FC<Props> = ({ prediction }) => {
  const sign = prediction?.sign || 'READY';
  const confidence = prediction ? Math.round(prediction.confidence * 100) : 0;
  const mode = prediction?.inference_mode || 'DEMO_MOCK';
  const isDemo = mode === 'DEMO_MOCK';

  let badgeLabel = 'DEMO MODE';
  if (mode === 'REAL_MODEL_10') {
    badgeLabel = 'REAL MODEL (10 ISL Signs)';
  } else if (mode === 'REAL_MODEL_27') {
    badgeLabel = 'REAL MODEL (27 ISL Signs)';
  } else if (mode.startsWith('REAL_MODEL')) {
    badgeLabel = 'REAL MODEL';
  }

  return (
    <View style={styles.card}>
      <View style={styles.topRow}>
        <Text style={styles.headerLabel}>DETECTED SIGN</Text>
        {prediction && (
          <View style={[styles.badge, isDemo ? styles.demoBadge : styles.realBadge]}>
            <Text style={styles.badgeText}>{badgeLabel}</Text>
          </View>
        )}
      </View>

      <Text style={styles.signText}>{sign}</Text>

      {prediction && prediction.sign !== 'READY' && prediction.sign !== 'NO_HAND_DETECTED' && (
        <View style={styles.meterContainer}>
          <View style={styles.meterBarBackground}>
            <View style={[styles.meterBarFill, { width: `${confidence}%` }]} />
          </View>
          <Text style={styles.confidenceText}>Confidence: {confidence}%</Text>
        </View>
      )}
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
    alignItems: 'center',
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: spacing.xs,
  },
  headerLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.secondary,
    letterSpacing: 1.2,
  },
  badge: {
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: borderRadius.sm,
  },
  demoBadge: {
    backgroundColor: 'rgba(245, 158, 11, 0.2)',
    borderColor: colors.warning,
    borderWidth: 1,
  },
  realBadge: {
    backgroundColor: 'rgba(16, 185, 129, 0.2)',
    borderColor: colors.accent,
    borderWidth: 1,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  signText: {
    fontSize: 34,
    fontWeight: '800',
    color: colors.textPrimary,
    marginVertical: spacing.xs,
    letterSpacing: 1,
    textAlign: 'center',
  },
  meterContainer: {
    width: '100%',
    alignItems: 'center',
    marginTop: spacing.xs,
  },
  meterBarBackground: {
    width: '100%',
    height: 8,
    backgroundColor: '#0F172A',
    borderRadius: 4,
    overflow: 'hidden',
  },
  meterBarFill: {
    height: '100%',
    backgroundColor: colors.accent,
    borderRadius: 4,
  },
  confidenceText: {
    fontSize: 13,
    color: colors.textSecondary,
    marginTop: 4,
    fontWeight: '600',
  },
});
