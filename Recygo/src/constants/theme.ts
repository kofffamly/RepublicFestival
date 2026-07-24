// ─── Couleurs principales ──────────────────────────────────────────────
export const COLORS = {
  // Verts (marque)
  greenDark: '#0F5C34',
  greenMid: '#1E7A46',
  greenCta: '#2ECC71',
  greenLight: '#22C55E',
  greenBright: '#2ECC71',

  // Accents
  gold: '#F5A524',
  orange: '#EA8A2E',
  blue: '#3B82F6',
  purple: '#8B5CF6',
  yellow: '#EAB308',
  red: '#EF4444',

  // Neutres
  white: '#FFFFFF',
  textDark: '#111827',
  textGray: '#6B7280',
  textMuted: '#9CA3AF',
  border: '#D1D5DB',
  borderLight: '#E5E7EB',
  bgLight: '#F8FAFC',
  bgWhite: '#FFFFFF',

  // Fonds pastel
  greenPastel: '#E9F8EF',
  greenPastelLight: '#EAF7F0',
  orangePastel: '#FDF3DD',
  bluePastel: '#EFF6FF',
  purplePastel: '#F5F3FF',
  yellowPastel: '#FEFCE8',
  redPastel: '#FEF2F2',

  // Semi-transparents
  whiteTransparent10: 'rgba(255,255,255,0.1)',
  whiteTransparent15: 'rgba(255,255,255,0.15)',
  whiteTransparent20: 'rgba(255,255,255,0.2)',
  whiteTransparent85: 'rgba(255,255,255,0.85)',
} as const;

export const SPACING = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  xxxl: 32,
} as const;

// Alias used by web components (app-tabs.web.tsx, hint-row.tsx, etc.)
export const Spacing = {
  half: 2,
  one: 4,
  two: 8,
  three: 12,
  four: 16,
  five: 20,
} as const;

export const MaxContentWidth = 1024;

export const RADIUS = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  full: 9999,
} as const;

export const FONT_SIZE = {
  xs: 10,
  sm: 12,
  md: 14,
  lg: 16,
  xl: 20,
  xxl: 24,
  xxxl: 28,
  display: 32,
} as const;

export const FONT_WEIGHT = {
  regular: '400' as const,
  medium: '500' as const,
  semibold: '600' as const,
  bold: '700' as const,
  extrabold: '800' as const,
  black: '900' as const,
};

export const SHADOWS = {
  sm: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 1,
  },
  md: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  lg: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 4,
  },
} as const;

export const TAB_BAR = {
  height: 65,
  paddingBottom: 8,
  paddingTop: 8,
} as const;

// ─── Thème unifié (pour useTheme) ─────────────────────────────────────
export type ThemeColor =
  | 'background'
  | 'backgroundElement'
  | 'backgroundSelected'
  | 'text'
  | 'textSecondary'
  | 'border'
  | 'card'
  | 'error'
  | 'success'
  | 'tint';

export const Colors = {
  light: {
    green: COLORS.greenCta,
    charcoal: COLORS.greenDark,
    orange: COLORS.orange,
    white: COLORS.white,
    lightBg: COLORS.bgLight,
    inactive: COLORS.textMuted,
    background: COLORS.bgWhite,
    text: COLORS.textDark,
    textSecondary: COLORS.textGray,
    border: COLORS.borderLight,
    card: COLORS.bgWhite,
    error: COLORS.red,
    success: COLORS.greenCta,
    backgroundElement: COLORS.bgLight,
    backgroundSelected: COLORS.greenPastel,
    tint: COLORS.greenCta,
  },
  dark: {
    green: COLORS.greenCta,
    charcoal: COLORS.greenDark,
    orange: COLORS.orange,
    white: COLORS.white,
    lightBg: COLORS.greenDark,
    inactive: COLORS.textMuted,
    background: COLORS.greenDark,
    text: COLORS.white,
    textSecondary: COLORS.textGray,
    border: COLORS.borderLight,
    card: COLORS.greenMid,
    error: COLORS.red,
    success: COLORS.greenLight,
    backgroundElement: COLORS.greenMid,
    backgroundSelected: COLORS.greenPastel,
    tint: COLORS.greenCta,
  },
} as const;

export const Fonts = {
  regular: 'Inter',
  medium: 'Inter',
  semibold: 'Inter',
  bold: 'Inter',
  mono: 'monospace',
} as const;
