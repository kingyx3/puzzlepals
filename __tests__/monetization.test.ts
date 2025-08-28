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
    it('should show ad on 3rd puzzle start by default', async () => {
      // First two puzzle starts should skip ads
      let result = await showAd();
      expect(result.success).toBe(true);
      
      result = await showAd();
      expect(result.success).toBe(true);
      
      // Third puzzle start should show ad (may succeed or fail based on simulation)
      result = await showAd();
      expect(typeof result.success).toBe('boolean');
      if (result.success) {
        expect(result.revenue).toBeGreaterThanOrEqual(0);
      } else {
        expect(result.error).toBeDefined();
      }
    });

    it('should skip ads for premium users', async () => {
      updateMonetizationConfig({ premiumPurchased: true });
      
      // Should skip ad even on 3rd attempt
      await showAd();
      await showAd();
      const result = await showAd();
      
      expect(result.success).toBe(true);
      expect(result.revenue).toBeUndefined();
    });

    it('should respect ad timeout', async () => {
      updateMonetizationConfig({ adTimeout: 50 }); // Very short timeout
      
      // Skip to 3rd puzzle start
      await showAd();
      await showAd();
      
      const startTime = Date.now();
      const result = await showAd();
      const endTime = Date.now();
      
      // Should complete quickly due to timeout
      expect(endTime - startTime).toBeLessThan(200);
      expect(typeof result.success).toBe('boolean');
    }, 5000); // 5 second test timeout
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
      expect(stats.adFrequency).toBe(3);
    });
  });

  describe('configuration', () => {
    it('should allow config updates', () => {
      updateMonetizationConfig({ 
        adFrequency: 1, // Show ad every puzzle
        adsEnabled: false 
      });
      
      const stats = getMonetizationStats();
      expect(stats.adFrequency).toBe(1);
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