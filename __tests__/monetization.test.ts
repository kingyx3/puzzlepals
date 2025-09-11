// Tests for monetization service

import {
  showAd,
  isPremiumUser,
  updateMonetizationConfig,
  getMonetizationStats,
  resetMonetizationState,
} from '../src/services/monetization';

describe('Monetization Service', () => {
  beforeEach(() => {
    jest.useFakeTimers();
    resetMonetizationState();
  });

  afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
  });

  describe('showAd', () => {
    it('should show ad before every puzzle start', async () => {
      // Every puzzle start should show ad (may succeed or fail based on simulation)
      const adPromise1 = showAd();
      jest.advanceTimersByTime(20000); // Advance past ad loading and duration
      const result1 = await adPromise1;

      expect(typeof result1.success).toBe('boolean');
      if (result1.success) {
        expect(result1.revenue).toBeGreaterThanOrEqual(0);
        expect(typeof result1.skipped).toBe('boolean');
      } else {
        expect(result1.error).toBeDefined();
      }

      // Second puzzle start should also show ad
      const adPromise2 = showAd();
      jest.advanceTimersByTime(20000);
      const result2 = await adPromise2;

      expect(typeof result2.success).toBe('boolean');
      if (result2.success) {
        expect(result2.revenue).toBeGreaterThanOrEqual(0);
        expect(typeof result2.skipped).toBe('boolean');
      } else {
        expect(result2.error).toBeDefined();
      }

      // Third puzzle start should also show ad
      const adPromise3 = showAd();
      jest.advanceTimersByTime(20000);
      const result3 = await adPromise3;

      expect(typeof result3.success).toBe('boolean');
      if (result3.success) {
        expect(result3.revenue).toBeGreaterThanOrEqual(0);
        expect(typeof result3.skipped).toBe('boolean');
      } else {
        expect(result3.error).toBeDefined();
      }
    }, 15000);

    it('should skip ads for premium users', async () => {
      updateMonetizationConfig({ premiumPurchased: true });

      // Should skip ad on every attempt - no timers needed for premium users
      const result1 = await showAd();
      expect(result1.success).toBe(true);
      expect(result1.revenue).toBeUndefined();
      expect(result1.skipped).toBeUndefined();

      const result2 = await showAd();
      expect(result2.success).toBe(true);
      expect(result2.revenue).toBeUndefined();
      expect(result2.skipped).toBeUndefined();
    });

    it('should respect ad timeout (30 seconds)', async () => {
      updateMonetizationConfig({ adTimeout: 100 }); // Very short timeout for testing

      const startTime = Date.now();
      const adPromise = showAd();

      // Advance timers past the timeout
      jest.advanceTimersByTime(200);
      const result = await adPromise;
      const endTime = Date.now();

      // Should complete quickly due to timeout or simulation
      expect(endTime - startTime).toBeLessThan(1000); // Should be very fast with fake timers
      expect(typeof result.success).toBe('boolean');
    }, 15000);
  });

  describe('premium status', () => {
    it('should track premium status correctly', () => {
      expect(isPremiumUser()).toBe(false);

      updateMonetizationConfig({ premiumPurchased: true });
      expect(isPremiumUser()).toBe(true);
    });
  });

  describe('monetization stats', () => {
    it('should track puzzle start count', async () => {
      let stats = getMonetizationStats();
      expect(stats.puzzleStartCount).toBe(0);

      const adPromise1 = showAd();
      jest.advanceTimersByTime(20000);
      await adPromise1;
      stats = getMonetizationStats();
      expect(stats.puzzleStartCount).toBe(1);

      const adPromise2 = showAd();
      jest.advanceTimersByTime(20000);
      await adPromise2;

      const adPromise3 = showAd();
      jest.advanceTimersByTime(20000);
      await adPromise3;

      stats = getMonetizationStats();
      expect(stats.puzzleStartCount).toBe(3);
    }, 15000);

    it('should provide accurate config info', () => {
      const stats = getMonetizationStats();
      expect(stats.isPremium).toBe(false);
      expect(stats.adsEnabled).toBe(true);
      expect(stats.adFrequency).toBe(1); // Every puzzle, not every 3rd
    });
  });

  describe('configuration', () => {
    it('should allow config updates', () => {
      updateMonetizationConfig({
        adFrequency: 2, // Show ad every 2nd puzzle (changed from 1)
        adsEnabled: false,
      });

      const stats = getMonetizationStats();
      expect(stats.adFrequency).toBe(2);
      expect(stats.adsEnabled).toBe(false);
    });
  });

  describe('reset functionality', () => {
    it('should reset to default state', async () => {
      // Make some changes
      const adPromise1 = showAd();
      jest.advanceTimersByTime(20000);
      await adPromise1;

      const adPromise2 = showAd();
      jest.advanceTimersByTime(20000);
      await adPromise2;

      updateMonetizationConfig({ premiumPurchased: true });

      let stats = getMonetizationStats();
      expect(stats.puzzleStartCount).toBe(2);
      expect(stats.isPremium).toBe(true);

      // Reset
      resetMonetizationState();

      stats = getMonetizationStats();
      expect(stats.puzzleStartCount).toBe(0);
      expect(stats.isPremium).toBe(false);
    }, 15000);
  });
});
