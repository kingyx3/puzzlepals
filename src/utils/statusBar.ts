// Comprehensive status bar utilities for preventing overlap on all devices

import { Platform, StatusBar, Dimensions } from 'react-native';
import Constants from 'expo-constants';

export interface StatusBarConfig {
  style: 'light' | 'dark';
  backgroundColor: string;
  translucent: boolean;
  hidden: boolean;
}

/**
 * Get platform-specific status bar configuration
 * @param screenType - The current screen type (game screens typically use dark backgrounds)
 * @returns StatusBar configuration optimized for the platform and screen
 */
export function getStatusBarConfig(screenType: 'game' | 'normal'): StatusBarConfig {
  const isGame = screenType === 'game';
  
  if (Platform.OS === 'ios') {
    return {
      style: isGame ? 'light' : 'dark',
      backgroundColor: 'transparent', // iOS ignores this
      translucent: false, // Ensures proper safe area calculations
      hidden: false,
    };
  }
  
  // Android configuration
  return {
    style: isGame ? 'light' : 'dark',
    backgroundColor: isGame ? '#000000' : '#ffffff',
    translucent: false, // Critical for preventing overlap
    hidden: false,
  };
}

/**
 * Get the status bar height for the current platform and device
 * @returns Status bar height in pixels
 */
export function getStatusBarHeight(): number {
  if (Platform.OS === 'ios') {
    return Constants.statusBarHeight || 20;
  }
  
  // Android
  return StatusBar.currentHeight || 24;
}

/**
 * Check if device has a notch or dynamic island
 * @returns true if device has special top area considerations
 */
export function hasNotch(): boolean {
  const { height, width } = Dimensions.get('window');
  const statusBarHeight = getStatusBarHeight();
  
  if (Platform.OS === 'ios') {
    // iPhone X and newer have status bar height >= 44
    return statusBarHeight >= 44;
  }
  
  // Android devices with notches typically have higher status bar
  return statusBarHeight > 24;
}

/**
 * Get recommended safe area padding for content
 * @returns Object with top padding recommendation
 */
export function getSafeAreaPadding() {
  const statusBarHeight = getStatusBarHeight();
  const hasSpecialArea = hasNotch();
  
  return {
    paddingTop: hasSpecialArea ? statusBarHeight + 8 : statusBarHeight + 4,
  };
}

/**
 * Device-specific safe area configuration
 */
export const DEVICE_SAFE_AREA_CONFIG = {
  // Extra padding for devices with special areas
  NOTCH_EXTRA_PADDING: 8,
  STANDARD_EXTRA_PADDING: 4,
  
  // Minimum safe area values as fallbacks
  MIN_STATUS_BAR_HEIGHT: Platform.OS === 'ios' ? 20 : 24,
  
  // Maximum values for sanity checking
  MAX_STATUS_BAR_HEIGHT: Platform.OS === 'ios' ? 60 : 48,
};

/**
 * Validate and sanitize status bar height
 * @param height - Raw status bar height
 * @returns Sanitized height within expected bounds
 */
export function sanitizeStatusBarHeight(height: number): number {
  const { MIN_STATUS_BAR_HEIGHT, MAX_STATUS_BAR_HEIGHT } = DEVICE_SAFE_AREA_CONFIG;
  
  if (height < MIN_STATUS_BAR_HEIGHT) return MIN_STATUS_BAR_HEIGHT;
  if (height > MAX_STATUS_BAR_HEIGHT) return MAX_STATUS_BAR_HEIGHT;
  
  return height;
}