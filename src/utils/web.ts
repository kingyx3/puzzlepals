// Web-specific utilities for PuzzlePals

import { Platform, Dimensions } from 'react-native';

/**
 * Check if the current platform is web
 */
export function isWeb(): boolean {
  return Platform.OS === 'web';
}

/**
 * Check if running on mobile web (responsive breakpoint)
 */
export function isMobileWeb(): boolean {
  if (!isWeb()) return false;
  const { width } = Dimensions.get('window');
  return width < 768;
}

/**
 * Check if running on tablet web (responsive breakpoint)
 */
export function isTabletWeb(): boolean {
  if (!isWeb()) return false;
  const { width } = Dimensions.get('window');
  return width >= 768 && width < 1024;
}

/**
 * Check if running on desktop web
 */
export function isDesktopWeb(): boolean {
  if (!isWeb()) return false;
  const { width } = Dimensions.get('window');
  return width >= 1024;
}

/**
 * Get web-optimized canvas size based on viewport
 */
export function getWebOptimalCanvasSize(): { width: number; height: number } {
  if (!isWeb()) {
    // Fallback to mobile calculation
    const screen = Dimensions.get('window');
    const size = Math.min(screen.width - 40, screen.height * 0.6, 500);
    return { width: size, height: size };
  }

  const screen = Dimensions.get('window');
  let maxSize: number;
  let padding: number;

  if (isDesktopWeb()) {
    maxSize = 600; // Larger on desktop
    padding = 80; // More padding on desktop
  } else if (isTabletWeb()) {
    maxSize = 500; // Medium on tablet
    padding = 60;
  } else {
    maxSize = 400; // Smaller on mobile web
    padding = 40;
  }

  const availableWidth = screen.width - padding;
  const availableHeight = screen.height * 0.7; // Leave room for controls

  const size = Math.min(availableWidth, availableHeight, maxSize);

  return {
    width: size,
    height: size,
  };
}

/**
 * Get web-optimized touch target size
 */
export function getWebTouchTargetSize(): number {
  if (!isWeb()) return 48;

  if (isMobileWeb()) {
    return 56; // Larger for mobile web (touch devices)
  } else {
    return 44; // Smaller for desktop (mouse interaction)
  }
}

/**
 * Get web-optimized typography scale
 */
export function getWebTypographyScale(): {
  small: number;
  medium: number;
  large: number;
  xlarge: number;
} {
  if (!isWeb()) {
    return { small: 14, medium: 16, large: 18, xlarge: 20 };
  }

  if (isDesktopWeb()) {
    return { small: 14, medium: 16, large: 20, xlarge: 24 };
  } else if (isTabletWeb()) {
    return { small: 14, medium: 16, large: 19, xlarge: 22 };
  } else {
    return { small: 14, medium: 16, large: 18, xlarge: 20 };
  }
}

/**
 * Check if device supports hover (desktop/laptop)
 */
export function supportsHover(): boolean {
  if (!isWeb()) return false;
  
  // Check for hover capability
  if (typeof window !== 'undefined' && window.matchMedia) {
    return window.matchMedia('(hover: hover)').matches;
  }
  
  // Fallback: assume desktop supports hover
  return isDesktopWeb();
}

/**
 * Get web-optimized spacing for different screen sizes
 */
export function getWebSpacing(): {
  xs: number;
  sm: number;
  md: number;
  lg: number;
  xl: number;
} {
  if (!isWeb()) {
    return { xs: 4, sm: 8, md: 16, lg: 24, xl: 32 };
  }

  if (isDesktopWeb()) {
    return { xs: 6, sm: 12, md: 20, lg: 32, xl: 48 };
  } else if (isTabletWeb()) {
    return { xs: 5, sm: 10, md: 18, lg: 28, xl: 40 };
  } else {
    return { xs: 4, sm: 8, md: 16, lg: 24, xl: 32 };
  }
}

/**
 * Check if browser supports certain web features
 */
export function getWebCapabilities(): {
  supportsTouch: boolean;
  supportsHover: boolean;
  supportsFullscreen: boolean;
  supportsVibration: boolean;
} {
  if (!isWeb() || typeof window === 'undefined') {
    return {
      supportsTouch: false,
      supportsHover: false,
      supportsFullscreen: false,
      supportsVibration: false,
    };
  }

  return {
    supportsTouch: 'ontouchstart' in window || navigator.maxTouchPoints > 0,
    supportsHover: supportsHover(),
    supportsFullscreen: 'requestFullscreen' in document.documentElement,
    supportsVibration: 'vibrate' in navigator,
  };
}

/**
 * Get optimal grid layout for web based on screen size
 */
export function getWebGridLayout(): {
  columns: number;
  gap: number;
  cardMinWidth: number;
} {
  if (!isWeb()) {
    return { columns: 2, gap: 12, cardMinWidth: 150 };
  }

  const { width } = Dimensions.get('window');

  if (width >= 1200) {
    return { columns: 4, gap: 20, cardMinWidth: 200 };
  } else if (width >= 768) {
    return { columns: 3, gap: 16, cardMinWidth: 180 };
  } else {
    return { columns: 2, gap: 12, cardMinWidth: 150 };
  }
}

/**
 * Web-specific performance optimization flags
 */
export function getWebPerformanceSettings(): {
  enableAnimations: boolean;
  enableShadows: boolean;
  enableGradients: boolean;
  maxConcurrentAnimations: number;
} {
  if (!isWeb()) {
    return {
      enableAnimations: true,
      enableShadows: true,
      enableGradients: true,
      maxConcurrentAnimations: 10,
    };
  }

  // Check if user prefers reduced motion
  const prefersReducedMotion = 
    typeof window !== 'undefined' && 
    window.matchMedia && 
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  return {
    enableAnimations: !prefersReducedMotion,
    enableShadows: isDesktopWeb(), // Shadows can be performance-heavy on mobile
    enableGradients: true,
    maxConcurrentAnimations: isMobileWeb() ? 5 : 10,
  };
}