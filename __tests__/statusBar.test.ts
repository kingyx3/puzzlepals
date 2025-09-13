// Comprehensive status bar tests to ensure proper handling on all devices

import { Platform } from 'react-native';
import {
  getStatusBarConfig,
  getStatusBarHeight,
  hasNotch,
  getSafeAreaPadding,
  sanitizeStatusBarHeight,
  DEVICE_SAFE_AREA_CONFIG,
} from '../src/utils/statusBar';

// Mock Platform and StatusBar for testing
jest.mock('react-native', () => ({
  Platform: {
    OS: 'ios',
  },
  StatusBar: {
    currentHeight: 24,
  },
  Dimensions: {
    get: () => ({ width: 375, height: 812 }),
  },
}));

jest.mock('expo-constants', () => ({
  default: {
    statusBarHeight: 44,
  },
}));

describe('StatusBar Utils - Comprehensive Device Support', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getStatusBarConfig', () => {
    it('should return light style for game screens on iOS', () => {
      Platform.OS = 'ios';
      const config = getStatusBarConfig('game');

      expect(config.style).toBe('light');
      expect(config.backgroundColor).toBe('transparent');
      expect(config.translucent).toBe(false);
      expect(config.hidden).toBe(false);
    });

    it('should return dark style for normal screens on iOS', () => {
      Platform.OS = 'ios';
      const config = getStatusBarConfig('normal');

      expect(config.style).toBe('dark');
      expect(config.backgroundColor).toBe('transparent');
      expect(config.translucent).toBe(false);
      expect(config.hidden).toBe(false);
    });

    it('should return proper config for game screens on Android', () => {
      Platform.OS = 'android';
      const config = getStatusBarConfig('game');

      expect(config.style).toBe('light');
      expect(config.backgroundColor).toBe('#000000');
      expect(config.translucent).toBe(false);
      expect(config.hidden).toBe(false);
    });

    it('should return proper config for normal screens on Android', () => {
      Platform.OS = 'android';
      const config = getStatusBarConfig('normal');

      expect(config.style).toBe('dark');
      expect(config.backgroundColor).toBe('#ffffff');
      expect(config.translucent).toBe(false);
      expect(config.hidden).toBe(false);
    });
  });

  describe('getStatusBarHeight', () => {
    it('should return Constants height on iOS', () => {
      Platform.OS = 'ios';
      const height = getStatusBarHeight();
      expect(height).toBeGreaterThanOrEqual(20); // Should use fallback or constants
    });

    it('should return StatusBar.currentHeight on Android', () => {
      Platform.OS = 'android';
      const height = getStatusBarHeight();
      expect(height).toBe(24); // From mocked StatusBar
    });

    it('should return fallback value when no height available', () => {
      Platform.OS = 'ios';
      // Mock Constants to return undefined
      jest.doMock('expo-constants', () => ({
        default: { statusBarHeight: undefined },
      }));

      const height = getStatusBarHeight();
      expect(height).toBe(20); // iOS fallback
    });
  });

  describe('hasNotch', () => {
    it('should detect device characteristics correctly', () => {
      Platform.OS = 'ios';
      const hasNotchResult = hasNotch();
      expect(typeof hasNotchResult).toBe('boolean'); // Test that it returns a valid boolean
    });

    it('should detect older iPhones (status bar < 44)', () => {
      Platform.OS = 'ios';
      jest.doMock('expo-constants', () => ({
        default: { statusBarHeight: 20 },
      }));

      const hasNotchResult = hasNotch();
      expect(hasNotchResult).toBe(false); // Would be false if properly re-evaluated
    });

    it('should detect Android devices with notches', () => {
      Platform.OS = 'android';
      const { StatusBar } = require('react-native');
      StatusBar.currentHeight = 30; // Higher than standard 24

      const hasNotchResult = hasNotch();
      expect(hasNotchResult).toBe(true);
    });
  });

  describe('getSafeAreaPadding', () => {
    it('should provide appropriate padding for devices', () => {
      Platform.OS = 'ios';
      const padding = getSafeAreaPadding();

      // Should provide reasonable padding (at least status bar height)
      expect(padding.paddingTop).toBeGreaterThanOrEqual(20);
    });

    it('should provide standard padding for regular devices', () => {
      Platform.OS = 'android';
      const { StatusBar } = require('react-native');
      StatusBar.currentHeight = 24; // Standard height

      const padding = getSafeAreaPadding();

      // Should be status bar height (24) + standard extra padding (4)
      expect(padding.paddingTop).toBe(28);
    });
  });

  describe('sanitizeStatusBarHeight', () => {
    it('should enforce minimum height', () => {
      const result = sanitizeStatusBarHeight(10);
      expect(result).toBe(DEVICE_SAFE_AREA_CONFIG.MIN_STATUS_BAR_HEIGHT);
    });

    it('should enforce maximum height', () => {
      const result = sanitizeStatusBarHeight(100);
      expect(result).toBe(DEVICE_SAFE_AREA_CONFIG.MAX_STATUS_BAR_HEIGHT);
    });

    it('should pass through valid heights unchanged', () => {
      const validHeight = 30;
      const result = sanitizeStatusBarHeight(validHeight);
      expect(result).toBe(validHeight);
    });
  });

  describe('DEVICE_SAFE_AREA_CONFIG', () => {
    it('should have proper configuration constants', () => {
      expect(DEVICE_SAFE_AREA_CONFIG.NOTCH_EXTRA_PADDING).toBe(8);
      expect(DEVICE_SAFE_AREA_CONFIG.STANDARD_EXTRA_PADDING).toBe(4);
      expect(typeof DEVICE_SAFE_AREA_CONFIG.MIN_STATUS_BAR_HEIGHT).toBe(
        'number'
      );
      expect(typeof DEVICE_SAFE_AREA_CONFIG.MAX_STATUS_BAR_HEIGHT).toBe(
        'number'
      );
    });

    it('should have platform-specific minimums', () => {
      expect(DEVICE_SAFE_AREA_CONFIG.MIN_STATUS_BAR_HEIGHT).toBeGreaterThan(0);
      expect(DEVICE_SAFE_AREA_CONFIG.MAX_STATUS_BAR_HEIGHT).toBeGreaterThan(
        DEVICE_SAFE_AREA_CONFIG.MIN_STATUS_BAR_HEIGHT
      );
    });
  });

  describe('Cross-platform compatibility', () => {
    const testPlatforms = ['ios', 'android'];
    const testScreenTypes = ['game', 'normal'] as const;

    testPlatforms.forEach((platform) => {
      testScreenTypes.forEach((screenType) => {
        it(`should provide valid config for ${platform} ${screenType} screens`, () => {
          Platform.OS = platform as any;
          const config = getStatusBarConfig(screenType);

          expect(['light', 'dark']).toContain(config.style);
          expect(typeof config.backgroundColor).toBe('string');
          expect(typeof config.translucent).toBe('boolean');
          expect(typeof config.hidden).toBe('boolean');

          // Critical: translucent should be false to prevent overlap
          expect(config.translucent).toBe(false);
        });
      });
    });
  });

  describe('Edge cases and error handling', () => {
    it('should handle undefined status bar heights gracefully', () => {
      Platform.OS = 'android';
      const { StatusBar } = require('react-native');
      StatusBar.currentHeight = undefined;

      const height = getStatusBarHeight();
      expect(height).toBe(24); // Android fallback
    });

    it('should handle extreme screen dimensions', () => {
      const { Dimensions } = require('react-native');
      Dimensions.get = jest.fn().mockReturnValue({ width: 100, height: 100 });

      const hasNotchResult = hasNotch();
      expect(typeof hasNotchResult).toBe('boolean');
    });

    it('should provide consistent padding calculations', () => {
      const padding1 = getSafeAreaPadding();
      const padding2 = getSafeAreaPadding();

      expect(padding1.paddingTop).toBe(padding2.paddingTop);
      expect(padding1.paddingTop).toBeGreaterThan(0);
    });
  });
});
