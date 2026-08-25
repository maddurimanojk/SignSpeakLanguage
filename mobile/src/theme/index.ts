export const colors = {
  background: '#0F172A',      // Dark slate background
  surface: '#1E293B',         // Dark surface card
  surfaceBorder: '#334155',   // Surface border outline
  primary: '#3B82F6',         // Modern vibrant blue
  primaryHover: '#2563EB',
  secondary: '#06B6D4',       // Vibrant cyan
  accent: '#10B981',          // Success emerald
  warning: '#F59E0B',         // Warning amber
  danger: '#EF4444',          // Alert red
  textPrimary: '#F8FAFC',     // High contrast main text
  textSecondary: '#94A3B8',   // Muted label text
  textDark: '#0F172A',
  overlayBackground: 'rgba(15, 23, 42, 0.75)',
  landmarkJoint: '#38BDF8',    // Bright sky blue for hand joint overlay
  landmarkBone: '#10B981',     // Emerald green for hand skeleton bones
};

export const typography = {
  h1: { fontSize: 28, fontWeight: '700' as const, color: colors.textPrimary },
  h2: { fontSize: 22, fontWeight: '600' as const, color: colors.textPrimary },
  h3: { fontSize: 18, fontWeight: '600' as const, color: colors.textPrimary },
  body: { fontSize: 15, fontWeight: '400' as const, color: colors.textPrimary },
  caption: { fontSize: 13, fontWeight: '400' as const, color: colors.textSecondary },
  button: { fontSize: 16, fontWeight: '600' as const, color: colors.textPrimary },
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
};

export const borderRadius = {
  sm: 8,
  md: 12,
  lg: 20,
  full: 9999,
};
