import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useRouter } from 'expo-router';
import { ArrowLeft, Wifi, WifiOff } from 'lucide-react-native';
import { colors, spacing, borderRadius } from '../theme';

interface Props {
  title: string;
  showBack?: boolean;
  isBackendConnected?: boolean;
}

export const HeaderBar: React.FC<Props> = ({ title, showBack = false, isBackendConnected = true }) => {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <View style={styles.leftRow}>
        {showBack && (
          <TouchableOpacity
            style={styles.backBtn}
            onPress={() => router.back()}
            accessibilityLabel="Go Back"
          >
            <ArrowLeft size={20} color={colors.textPrimary} />
          </TouchableOpacity>
        )}
        <Text style={styles.titleText}>{title}</Text>
      </View>

      <View style={[styles.statusBadge, isBackendConnected ? styles.connectedBadge : styles.disconnectedBadge]}>
        {isBackendConnected ? (
          <>
            <Wifi size={12} color={colors.accent} />
            <Text style={[styles.statusText, { color: colors.accent }]}>AI Connected</Text>
          </>
        ) : (
          <>
            <WifiOff size={12} color={colors.warning} />
            <Text style={[styles.statusText, { color: colors.warning }]}>Offline/Demo</Text>
          </>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 56,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.md,
    backgroundColor: colors.background,
    borderBottomWidth: 1,
    borderBottomColor: colors.surfaceBorder,
  },
  leftRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  backBtn: {
    padding: spacing.xs,
  },
  titleText: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
    borderRadius: borderRadius.sm,
  },
  connectedBadge: {
    backgroundColor: 'rgba(16, 185, 129, 0.15)',
  },
  disconnectedBadge: {
    backgroundColor: 'rgba(245, 158, 11, 0.15)',
  },
  statusText: {
    fontSize: 11,
    fontWeight: '600',
  },
});
