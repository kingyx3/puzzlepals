// Web-specific theme extensions for PuzzlePals

import { colors, spacing, typography, layout } from './index';
import { isWeb, isDesktopWeb, isTabletWeb, getWebSpacing, getWebTypographyScale } from '../utils/web';

/**
 * Get web-optimized theme based on screen size and capabilities
 */
export function getWebTheme() {
  if (!isWeb()) {
    // Return default theme for non-web platforms
    return {
      colors,
      spacing,
      typography,
      layout,
    };
  }

  const webSpacing = getWebSpacing();
  const webTypography = getWebTypographyScale();

  return {
    colors: {
      ...colors,
      // Web-specific color adjustments
      webHover: colors.primary + '10', // 10% opacity for hover states
      webFocus: colors.primary + '20', // 20% opacity for focus states
      webActive: colors.primaryDark,
    },
    spacing: webSpacing,
    typography: {
      ...typography,
      // Web-optimized font sizes
      xs: webTypography.small - 2,
      sm: webTypography.small,
      md: webTypography.medium,
      lg: webTypography.large,
      xl: webTypography.xlarge,
      xxl: webTypography.xlarge + 4,
      xxxl: webTypography.xlarge + 8,
      
      // Web-specific line heights
      lineHeight: {
        tight: 1.2,
        normal: 1.5, // Slightly more relaxed for web
        relaxed: 1.7,
      },
    },
    layout: {
      ...layout,
      // Web-specific layout adjustments
      touchTarget: isDesktopWeb() ? 40 : layout.touchTarget,
      touchTargetLarge: isDesktopWeb() ? 48 : layout.touchTargetLarge,
      touchTargetXLarge: isDesktopWeb() ? 56 : layout.touchTargetXLarge,
      
      // Web-specific spacing
      webSpacing: {
        containerPadding: isDesktopWeb() ? 40 : isTabletWeb() ? 24 : 16,
        maxContentWidth: isDesktopWeb() ? 1200 : '100%',
        sidebarWidth: 280,
        headerHeight: isDesktopWeb() ? 80 : 64,
      },
      
      // Responsive breakpoints for CSS-in-JS
      breakpoints: {
        mobile: 0,
        tablet: 768,
        desktop: 1024,
        wide: 1200,
      },
    },
    // Web-specific utilities
    web: {
      cursor: {
        pointer: isDesktopWeb() ? 'pointer' : 'default',
        grab: isDesktopWeb() ? 'grab' : 'default',
        grabbing: isDesktopWeb() ? 'grabbing' : 'default',
      },
      transitions: {
        fast: 'all 0.15s ease',
        normal: 'all 0.3s ease',
        slow: 'all 0.5s ease',
      },
      hover: {
        enabled: isDesktopWeb(),
        scale: 1.05,
        brightness: 1.1,
      },
      focus: {
        outline: `2px solid ${colors.primary}`,
        outlineOffset: '2px',
      },
    },
  };
}

/**
 * CSS-in-JS helpers for web-specific styling
 */
export const webStyles = {
  // Container styles
  container: {
    maxWidth: isDesktopWeb() ? 1200 : '100%',
    margin: '0 auto',
    padding: isDesktopWeb() ? 40 : isTabletWeb() ? 24 : 16,
  },
  
  // Responsive grid
  grid: {
    display: 'flex',
    flexWrap: 'wrap' as const,
    gap: isDesktopWeb() ? 20 : isTabletWeb() ? 16 : 12,
  },
  
  // Card hover effects (desktop only)
  cardHover: isDesktopWeb() ? {
    ':hover': {
      transform: 'translateY(-2px)',
      boxShadow: '0 8px 25px rgba(0, 0, 0, 0.15)',
      transition: 'all 0.3s ease',
    },
  } : {},
  
  // Button hover effects
  buttonHover: isDesktopWeb() ? {
    ':hover': {
      transform: 'translateY(-1px)',
      filter: 'brightness(1.1)',
      transition: 'all 0.2s ease',
    },
    ':active': {
      transform: 'translateY(0)',
    },
  } : {},
  
  // Focus styles for accessibility
  focusRing: {
    ':focus': {
      outline: `2px solid ${colors.primary}`,
      outlineOffset: '2px',
    },
    ':focus:not(:focus-visible)': {
      outline: 'none',
    },
  },
  
  // Responsive text
  responsiveText: {
    fontSize: isDesktopWeb() ? 18 : isTabletWeb() ? 16 : 14,
    lineHeight: isDesktopWeb() ? 1.6 : 1.5,
  },
  
  // Smooth scrolling
  smoothScroll: {
    scrollBehavior: 'smooth' as const,
    WebkitOverflowScrolling: 'touch',
  },
  
  // Prevent text selection on interactive elements
  noSelect: {
    userSelect: 'none' as const,
    WebkitUserSelect: 'none',
    MozUserSelect: 'none',
    msUserSelect: 'none',
  },
};

/**
 * Media queries for responsive design
 */
export const mediaQueries = {
  mobile: `@media (max-width: 767px)`,
  tablet: `@media (min-width: 768px) and (max-width: 1023px)`,
  desktop: `@media (min-width: 1024px)`,
  wide: `@media (min-width: 1200px)`,
  touch: `@media (hover: none) and (pointer: coarse)`,
  hover: `@media (hover: hover) and (pointer: fine)`,
  reducedMotion: `@media (prefers-reduced-motion: reduce)`,
};

/**
 * Animation utilities with reduced motion support
 */
export function getWebAnimation(animation: string) {
  if (!isWeb()) return {};
  
  const baseAnimation = {
    fast: 'all 0.15s ease',
    normal: 'all 0.3s ease',
    slow: 'all 0.5s ease',
    bounce: 'all 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55)',
  }[animation] || animation;
  
  return {
    transition: baseAnimation,
    // Disable animations if user prefers reduced motion
    [mediaQueries.reducedMotion]: {
      transition: 'none',
      animation: 'none',
    },
  };
}