// Tests for monetization service

import { 
  showAd, 
  isPremiumUser, 
  updateMonetizationConfig, 
  getMonetizationStats, 
  resetMonetizationState 
} from '../src/services/monetization';

describe('Monetization Service', () => {
  beforeEach(() => {
    resetMonetizationState();
    jest.clearAllTimers();
  });

  afterEach(() => {
    jest.clearAllTimers();
  });

  describe('showAd', () => {
    it('should show ad before every puzzle start', async () => {
      // Every puzzle start should show ad (may succeed or fail based on simulation)
      let result = await showAd();
      expect(typeof result.success).toBe('boolean');
      if (result.success) {
        expect(result.revenue).toBeGreaterThanOrEqual(0);
        expect(typeof result.skipped).toBe('boolean');
      } else {
        expect(result.error).toBeDefined();
      }
      
      // Second puzzle start should also show ad
      result = await showAd();
      expect(typeof result.success).toBe('boolean');
      if (result.success) {
        expect(result.revenue).toBeGreaterThanOrEqual(0);
        expect(typeof result.skipped).toBe('boolean');
      } else {
        expect(result.error).toBeDefined();
      }
      
      // Third puzzle start should also show ad
      result = await showAd();
      expect(typeof result.success).toBe('boolean');
      if (result.success) {
        expect(result.revenue).toBeGreaterThanOrEqual(0);
        expect(typeof result.skipped).toBe('boolean');
      } else {
        expect(result.error).toBeDefined();
      }
    });

    it('should skip ads for premium users', async () => {
      updateMonetizationConfig({ premiumPurchased: true });
      
      // Should skip ad on every attempt
      let result = await showAd();
      expect(result.success).toBe(true);
      expect(result.revenue).toBeUndefined();
      expect(result.skipped).toBeUndefined();
      
      result = await showAd();
      expect(result.success).toBe(true);
      expect(result.revenue).toBeUndefined();
      expect(result.skipped).toBeUndefined();
    });

    it('should respect ad timeout (30 seconds)', async () => {
      updateMonetizationConfig({ adTimeout: 100 }); // Very short timeout for testing
      
      const startTime = Date.now();
      const result = await showAd();
      const endTime = Date.now();
      
      // Should complete quickly due to timeout or simulation
      expect(endTime - startTime).toBeLessThan(8000); // Allow time for simulation
      expect(typeof result.success).toBe('boolean');
    }, 10000); // 10 second test timeout
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
      
      await showAd();
      stats = getMonetizationStats();
      expect(stats.puzzleStartCount).toBe(1);
      
      await showAd();
      await showAd();
      stats = getMonetizationStats();
      expect(stats.puzzleStartCount).toBe(3);
    });

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
        adsEnabled: false 
      });
      
      const stats = getMonetizationStats();
      expect(stats.adFrequency).toBe(2);
      expect(stats.adsEnabled).toBe(false);
    });
  });

  describe('reset functionality', () => {
    it('should reset to default state', async () => {
      // Make some changes
      await showAd();
      await showAd();
      updateMonetizationConfig({ premiumPurchased: true });
      
      let stats = getMonetizationStats();
      expect(stats.puzzleStartCount).toBe(2);
      expect(stats.isPremium).toBe(true);
      
      // Reset
      resetMonetizationState();
      
      stats = getMonetizationStats();
      expect(stats.puzzleStartCount).toBe(0);
      expect(stats.isPremium).toBe(false);
    });
  });
});