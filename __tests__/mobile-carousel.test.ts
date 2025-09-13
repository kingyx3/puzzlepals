// Test mobile carousel responsiveness

import {
  isMobileDevice,
  isSmallMobileDevice,
  getMobileTouchTargetSize,
  getMobilePieceSize,
} from '../src/utils/device';

// Mock Dimensions for testing
jest.mock('react-native', () => ({
  Dimensions: {
    get: jest.fn(() => ({ width: 375, height: 667 })), // Default to mobile size
  },
  Platform: {
    OS: 'ios',
  },
}));

describe('Mobile Carousel Responsiveness', () => {
  beforeEach(() => {
    // Reset the mock before each test
    jest.clearAllMocks();
  });

  it('should detect mobile devices correctly', () => {
    // Mock mobile device dimensions (iPhone SE)
    const mockDimensions = require('react-native').Dimensions;
    mockDimensions.get.mockReturnValue({ width: 375, height: 667 });

    expect(isMobileDevice()).toBe(true);
    expect(isSmallMobileDevice()).toBe(true);
  });

  it('should detect tablet devices correctly', () => {
    // Mock tablet dimensions (iPad)
    const mockDimensions = require('react-native').Dimensions;
    mockDimensions.get.mockReturnValue({ width: 768, height: 1024 });

    expect(isMobileDevice()).toBe(false);
    expect(isSmallMobileDevice()).toBe(false);
  });

  it('should detect desktop correctly', () => {
    // Mock desktop dimensions
    const mockDimensions = require('react-native').Dimensions;
    mockDimensions.get.mockReturnValue({ width: 1024, height: 768 });

    expect(isMobileDevice()).toBe(false);
    expect(isSmallMobileDevice()).toBe(false);
  });

  it('should provide correct touch target sizes for small mobile', () => {
    // Mock small mobile device (iPhone SE)
    const mockDimensions = require('react-native').Dimensions;
    mockDimensions.get.mockReturnValue({ width: 375, height: 667 });

    expect(getMobileTouchTargetSize()).toBe(56); // Larger for small phones
    expect(getMobilePieceSize()).toBe(60); // Much larger for small phones
  });

  it('should provide correct touch target sizes for medium mobile', () => {
    // Mock medium mobile device (between 480-768)
    const mockDimensions = require('react-native').Dimensions;
    mockDimensions.get.mockReturnValue({ width: 500, height: 800 });

    expect(getMobileTouchTargetSize()).toBe(52); // Medium for tablets
    expect(getMobilePieceSize()).toBe(52); // Larger for tablets
  });

  it('should provide correct touch target sizes for desktop', () => {
    // Mock desktop dimensions
    const mockDimensions = require('react-native').Dimensions;
    mockDimensions.get.mockReturnValue({ width: 1024, height: 768 });

    expect(getMobileTouchTargetSize()).toBe(48); // Default for desktop
    expect(getMobilePieceSize()).toBe(44); // Default for desktop
  });

  it('should handle edge cases correctly', () => {
    // Test exactly at breakpoint
    const mockDimensions = require('react-native').Dimensions;

    // Exactly at mobile breakpoint
    mockDimensions.get.mockReturnValue({ width: 768, height: 1024 });
    expect(isMobileDevice()).toBe(false);

    // Just under mobile breakpoint
    mockDimensions.get.mockReturnValue({ width: 767, height: 1024 });
    expect(isMobileDevice()).toBe(true);

    // Exactly at small mobile breakpoint
    mockDimensions.get.mockReturnValue({ width: 480, height: 800 });
    expect(isSmallMobileDevice()).toBe(false);

    // Just under small mobile breakpoint
    mockDimensions.get.mockReturnValue({ width: 479, height: 800 });
    expect(isSmallMobileDevice()).toBe(true);
  });
});
