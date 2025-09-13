// Essential web utilities for PuzzlePals

import { Platform, Dimensions } from 'react-native';

/**
 * Check if the current platform is web
 */
export function isWeb(): boolean {
  return Platform.OS === 'web';
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
  const isDesktop = screen.width >= 1024;
  const maxSize = isDesktop ? 600 : 400;
  const padding = isDesktop ? 80 : 40;

  const availableWidth = screen.width - padding;
  const availableHeight = screen.height * 0.7;
  const size = Math.min(availableWidth, availableHeight, maxSize);

  return { width: size, height: size };
}