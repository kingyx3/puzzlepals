// Design system and theme for PuzzlePals

export const colors = {
  // Primary palette - kid-friendly, accessible colors
  primary: '#6B9EFF', // Soft blue
  primaryDark: '#4A7BDC',
  secondary: '#FFB86B', // Warm orange
  secondaryDark: '#E69A4C',
  
  // Background colors
  background: '#FFFDF7', // Warm white
  surface: '#FFFFFF',
  surfaceVariant: '#F5F3FF',
  
  // Content colors
  onBackground: '#2C2C2C',
  onSurface: '#2C2C2C',
  onPrimary: '#FFFFFF',
  onSecondary: '#2C2C2C',
  
  // Semantic colors
  success: '#4CAF50',
  onSuccess: '#FFFFFF',
  warning: '#FF9800',
  error: '#F44336',
  info: '#2196F3',
  
  // Utility colors
  disabled: '#9AA0A6',
  outline: '#E0E0E0',
  shadow: 'rgba(0, 0, 0, 0.1)',
  
  // Celebration colors
  confetti: ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FECA57', '#FF9FF3'],
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
  },
  
  // Kid-friendly spacing
  kidFriendlySpacing: {
    betweenButtons: 16, // Minimum space between interactive elements
    aroundTouchTargets: 8, // Padding around touch targets
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
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 8,
    elevation: 4,
  },
} as const;