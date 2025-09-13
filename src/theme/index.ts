// Design system and theme for PuzzlePals

export const colors = {
  // Primary palette - kid-friendly, accessible colors
  primary: '#6B9EFF', // Soft blue
  primaryDark: '#4A7BDC',
  primaryLight: '#A3C4FF',
  secondary: '#FFB86B', // Warm orange
  secondaryDark: '#E69A4C',
  secondaryLight: '#FFCB8E',

  // Accent colors for more visual appeal
  accent: '#FF6B9D', // Playful pink
  accentDark: '#E64A7B',
  accentLight: '#FF8FB8',
  tertiary: '#7ED321', // Fresh green
  tertiaryDark: '#6AB01C',
  tertiaryLight: '#9FE142',

  // Background colors with gradients
  background: '#FFFDF7', // Warm white
  backgroundGradient: ['#FFFDF7', '#F8F6FF'], // Subtle gradient
  surface: '#FFFFFF',
  surfaceVariant: '#F5F3FF',
  surfaceElevated: '#FFFFFF',

  // Content colors
  onBackground: '#2C2C2C',
  onSurface: '#2C2C2C',
  onPrimary: '#FFFFFF',
  onSecondary: '#2C2C2C',
  textSecondary: '#6B7280',

  // Semantic colors - more vibrant
  success: '#10B981', // Emerald green
  onSuccess: '#FFFFFF',
  warning: '#F59E0B', // Amber
  error: '#EF4444', // Red
  info: '#3B82F6', // Blue

  // Utility colors
  disabled: '#9CA3AF',
  outline: '#E5E7EB',
  shadow: 'rgba(0, 0, 0, 0.1)',
  shadowStrong: 'rgba(0, 0, 0, 0.15)',

  // Celebration colors - more vibrant
  confetti: [
    '#FF6B6B',
    '#4ECDC4',
    '#45B7D1',
    '#96CEB4',
    '#FECA57',
    '#FF9FF3',
    '#A78BFA',
    '#34D399',
  ],

  // Card colors for different puzzle packs
  cardGradients: {
    animals: ['#FFE4E1', '#FFB6C1'], // Pink gradient
    vehicles: ['#E0F2FE', '#BAE6FD'], // Blue gradient
    advanced: ['#FEF3C7', '#FCD34D'], // Yellow gradient
    nature: ['#DCFCE7', '#86EFAC'], // Green gradient
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
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  round: 999,
} as const;

export const typography = {
  // Font sizes
  xs: 12,
  sm: 14,
  md: 16,
  lg: 18,
  xl: 20,
  xxl: 24,
  xxxl: 28,

  // Line heights
  lineHeight: {
    tight: 1.2,
    normal: 1.4,
    relaxed: 1.6,
  },

  // Font weights
  weight: {
    normal: '400' as const,
    medium: '500' as const,
    semibold: '600' as const,
    bold: '700' as const,
  },
} as const;

export const layout = {
  // Touch targets - minimum 44pt for accessibility (increased for kids)
  touchTarget: 48, // Increased from 44 for kid-friendly design
  touchTargetLarge: 56, // For primary actions
  touchTargetXLarge: 64, // For hero buttons

  // Game area dimensions
  minPuzzleSize: 200,
  maxPuzzleSize: 400,

  // Snap threshold for puzzle pieces
  snapThreshold: 30,

  // Animation durations
  animation: {
    fast: 150,
    normal: 300,
    slow: 500,
    celebration: 1000, // For completion celebrations
    spring: {
      stiffness: 100,
      damping: 10,
      mass: 1,
    },
  },

  // Kid-friendly spacing
  kidFriendlySpacing: {
    betweenButtons: 16, // Minimum space between interactive elements
    aroundTouchTargets: 8, // Padding around touch targets
    cardGap: 12, // Space between cards
    sectionGap: 24, // Space between sections
  },

  // Card dimensions for consistent sizing
  card: {
    minHeight: 120,
    aspectRatio: 1.2,
    borderRadius: borderRadius.lg,
  },

  // Screen breakpoints
  breakpoints: {
    sm: 576,
    md: 768,
    lg: 992,
    xl: 1200,
  },
} as const;

export const shadows = {
  sm: {
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 1,
    shadowRadius: 2,
    elevation: 1,
  },
  md: {
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 4,
    elevation: 2,
  },
  lg: {
    shadowColor: colors.shadowStrong,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 8,
    elevation: 4,
  },
  xl: {
    shadowColor: colors.shadowStrong,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 1,
    shadowRadius: 12,
    elevation: 6,
  },
  colored: {
    primary: {
      shadowColor: colors.primary,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.3,
      shadowRadius: 8,
      elevation: 4,
    },
    secondary: {
      shadowColor: colors.secondary,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.3,
      shadowRadius: 8,
      elevation: 4,
    },
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
