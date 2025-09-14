// Device utilities for screen dimensions and safe area

import { Dimensions, Platform } from 'react-native';
import { isWeb, getWebOptimalCanvasSize, getWebTouchTargetSize } from './web';

// Type declarations for web globals
declare const navigator: any;
declare const window: any;

export interface ScreenDimensions {
  width: number;
  height: number;
  isLandscape: boolean;
}

/**
 * Get current screen dimensions
 */
export function getScreenDimensions(): ScreenDimensions {
  const { width, height } = Dimensions.get('window');
  return {
    width,
    height,
    isLandscape: width > height,
  };
}

/**
 * Calculate optimal puzzle canvas size based on screen
 */
export function getOptimalCanvasSize(): { width: number; height: number } {
  // Use web-specific sizing if on web platform
  if (isWeb()) {
    return getWebOptimalCanvasSize();
  }

  const screen = getScreenDimensions();
  const padding = 40; // Total padding around canvas

  let maxWidth = screen.width - padding;
  let maxHeight = screen.height * 0.6; // Leave space for controls

  // On larger screens, limit the maximum size
  const maxSize = 500;
  maxWidth = Math.min(maxWidth, maxSize);
  maxHeight = Math.min(maxHeight, maxSize);

  // Keep it square
  const size = Math.min(maxWidth, maxHeight);

  return {
    width: size,
    height: size,
  };
}

/**
 * Check if device has haptic feedback support
 */
export function hasHapticSupport(): boolean {
  // Web generally doesn't support haptics (except for some newer APIs)
  if (isWeb()) {
    return typeof navigator !== 'undefined' && 'vibrate' in navigator;
  }
  return Platform.OS === 'ios' || Platform.OS === 'android';
}

/**
 * Check if device prefers reduced motion
 */
export function prefersReducedMotion(): boolean {
  // Check for web accessibility preference
  if (isWeb() && typeof window !== 'undefined' && window.matchMedia) {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }
  // For native platforms, this would need platform-specific implementation
  // For now, return false as default
  return false;
}

/**
 * Check if current device is mobile (small screen)
 */
export function isMobileDevice(): boolean {
  const { width } = getScreenDimensions();
  return width < 768; // Tablets and phones
}

/**
 * Check if current device is a small mobile phone
 */
export function isSmallMobileDevice(): boolean {
  const { width } = getScreenDimensions();
  return width <= 414; // Include iPhone Pro Max and smaller
}

/**
 * Get mobile-optimized touch target size
 */
export function getMobileTouchTargetSize(): number {
  // Use web-specific sizing if on web platform
  if (isWeb()) {
    return getWebTouchTargetSize();
  }

  if (isSmallMobileDevice()) {
    return 48; // Reduced for small phones but still accessible
  } else if (isMobileDevice()) {
    return 52; // Medium for tablets
  }
  return 48; // Default for desktop
}

/**
 * Get mobile-optimized piece preview size
 */
export function getMobilePieceSize(): number {
  if (isSmallMobileDevice()) {
    return 50; // Reduced for small phones
  } else if (isMobileDevice()) {
    return 52; // Larger for tablets
  }
  return 44; // Default for desktop
}
