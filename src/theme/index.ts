// Design system and theme for PuzzlePals

export const colors = {
  // Primary palette - enhanced kid-friendly, accessible colors
  primary: '#4F7FFF', // More vibrant blue
  primaryDark: '#3B6AE6',
  primaryLight: '#7BA3FF',
  primaryUltraLight: '#E8F0FF',
  secondary: '#FF9F43', // Brighter orange
  secondaryDark: '#E6882D',
  secondaryLight: '#FFB366',
  secondaryUltraLight: '#FFF4E6',

  // Accent colors for more visual appeal
  accent: '#FF5E9D', // More vibrant pink
  accentDark: '#E5417A',
  accentLight: '#FF7FB8',
  accentUltraLight: '#FFE8F3',
  tertiary: '#32D74B', // iOS-style green
  tertiaryDark: '#28C840',
  tertiaryLight: '#5FE06F',
  tertiaryUltraLight: '#E8FAE8',

  // Enhanced background system
  background: '#FAFBFF', // Cooler, more modern white
  backgroundGradient: ['#FAFBFF', '#F0F4FF'], // Enhanced gradient
  backgroundSecondary: '#F5F8FF',
  surface: '#FFFFFF',
  surfaceVariant: '#F8FAFF',
  surfaceElevated: '#FFFFFF',
  surfacePressed: '#F0F4FF',

  // Enhanced content colors
  onBackground: '#1A1A1A',
  onSurface: '#1A1A1A',
  onPrimary: '#FFFFFF',
  onSecondary: '#1A1A1A',
  textPrimary: '#1A1A1A',
  textSecondary: '#4A5568',
  textTertiary: '#7A8B9A',
  textLight: '#A0B0C0',

  // Enhanced semantic colors
  success: '#32D74B', // iOS-style success green
  onSuccess: '#FFFFFF',
  successLight: '#E8FAE8',
  warning: '#FF9F0A', // iOS-style warning
  onWarning: '#FFFFFF',
  warningLight: '#FFF4E6',
  error: '#FF453A', // iOS-style error
  onError: '#FFFFFF',
  errorLight: '#FFE6E6',
  info: '#007AFF', // iOS-style info
  onInfo: '#FFFFFF',
  infoLight: '#E6F3FF',

  // Enhanced utility colors
  disabled: '#A0B0C0',
  disabledLight: '#F0F4F8',
  outline: '#E2E8F0',
  outlineVariant: '#CBD5E0',
  shadow: 'rgba(0, 0, 0, 0.08)',
  shadowMedium: 'rgba(0, 0, 0, 0.12)',
  shadowStrong: 'rgba(0, 0, 0, 0.16)',
  shadowColored: 'rgba(79, 127, 255, 0.15)',

  // Enhanced celebration colors
  confetti: [
    '#FF5E9D', // Vibrant pink
    '#32D74B', // Success green
    '#FF9F0A', // Warning orange
    '#4F7FFF', // Primary blue
    '#AF52DE', // Purple
    '#FF453A', // Error red
    '#00C896', // Teal
    '#FFD60A', // Yellow
  ],

  // Enhanced card colors for different puzzle packs
  cardGradients: {
    animals: ['#FFE8F3', '#FFF0F8'], // Soft pink gradient
    vehicles: ['#E6F3FF', '#F0F8FF'], // Soft blue gradient
    advanced: ['#FFF4E6', '#FFFBF0'], // Soft yellow gradient
    nature: ['#E8FAE8', '#F0FDF0'], // Soft green gradient
  },

  // Interactive states
  interactive: {
    hover: 'rgba(79, 127, 255, 0.08)',
    pressed: 'rgba(79, 127, 255, 0.12)',
    focus: 'rgba(79, 127, 255, 0.16)',
  },
} as const;

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
} as const;

export const borderRadius = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 28,
  round: 999,
} as const;

export const typography = {
  // Enhanced font sizes with better scaling
  xs: 12,
  sm: 14,
  md: 16,
  lg: 18,
  xl: 21, // Slightly larger
  xxl: 24,
  xxxl: 30, // More prominent
  display: 36, // For hero text

  // Enhanced line heights for better readability
  lineHeight: {
    tight: 1.1,
    normal: 1.4,
    relaxed: 1.6,
    loose: 1.8,
  },

  // Font weights
  weight: {
    light: '300' as const,
    normal: '400' as const,
    medium: '500' as const,
    semibold: '600' as const,
    bold: '700' as const,
    heavy: '800' as const,
  },

  // Letter spacing for different use cases
  letterSpacing: {
    tight: -0.5,
    normal: 0,
    wide: 0.5,
    wider: 1,
  },
} as const;

export const layout = {
  // Enhanced touch targets - optimized for kids
  touchTarget: 48, // Minimum accessibility standard
  touchTargetLarge: 56, // For primary actions
  touchTargetXLarge: 64, // For hero buttons
  touchTargetXXLarge: 72, // For very important actions

  // Game area dimensions
  minPuzzleSize: 200,
  maxPuzzleSize: 400,

  // Snap threshold for puzzle pieces
  snapThreshold: 30,

  // Enhanced animation system
  animation: {
    fast: 150,
    normal: 250, // Slightly faster
    slow: 400,
    celebration: 1200, // Longer celebrations
    spring: {
      stiffness: 120, // More responsive
      damping: 12,
      mass: 1,
    },
    bounce: {
      stiffness: 200,
      damping: 8,
      mass: 0.8,
    },
  },

  // Enhanced kid-friendly spacing
  kidFriendlySpacing: {
    betweenButtons: 20, // More space between interactive elements
    aroundTouchTargets: 12, // More padding around touch targets
    cardGap: 16, // Larger space between cards
    sectionGap: 32, // More space between sections
    contentPadding: 24, // Standard content padding
  },

  // Enhanced card dimensions
  card: {
    minHeight: 140, // Taller cards
    aspectRatio: 1.3, // Better aspect ratio
    borderRadius: borderRadius.xl,
    elevatedBorderRadius: borderRadius.xxl,
  },

  // Screen breakpoints for responsive design
  breakpoints: {
    sm: 576,
    md: 768,
    lg: 992,
    xl: 1200,
    xxl: 1600,
  },
} as const;

export const shadows = {
  none: {
    shadowColor: 'transparent',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0,
    shadowRadius: 0,
    elevation: 0,
  },
  xs: {
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 1,
    shadowRadius: 1,
    elevation: 1,
  },
  sm: {
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 1,
    shadowRadius: 3,
    elevation: 2,
  },
  md: {
    shadowColor: colors.shadowMedium,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 6,
    elevation: 3,
  },
  lg: {
    shadowColor: colors.shadowStrong,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 12,
    elevation: 6,
  },
  xl: {
    shadowColor: colors.shadowStrong,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 1,
    shadowRadius: 16,
    elevation: 8,
  },
  colored: {
    primary: {
      shadowColor: colors.shadowColored,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 1,
      shadowRadius: 12,
      elevation: 6,
    },
    secondary: {
      shadowColor: colors.secondary,
      shadowOffset: { width: 0, height: 3 },
      shadowOpacity: 0.2,
      shadowRadius: 8,
      elevation: 4,
    },
    success: {
      shadowColor: colors.success,
      shadowOffset: { width: 0, height: 3 },
      shadowOpacity: 0.2,
      shadowRadius: 8,
      elevation: 4,
    },
  },
  inset: {
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: -1 },
    shadowOpacity: 1,
    shadowRadius: 2,
    elevation: 0,
  },
} as const;

// Gradient utilities for React Native
export const gradients = {
  primary: [colors.primary, colors.primaryDark],
  secondary: [colors.secondary, colors.secondaryDark],
  accent: [colors.accent, colors.accentDark],
  success: [colors.success, '#059669'],
  background: colors.backgroundGradient,
} as const;
