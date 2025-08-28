// Monetization service - ads and in-app purchases
// This is a placeholder implementation that can be extended with real ad SDKs

// Types for monetization
export interface AdResult {
  success: boolean;
  error?: string;
  revenue?: number;
}

export interface PurchaseResult {
  success: boolean;
  error?: string;
  productId?: string;
}

// Configuration - can be moved to settings store later
interface MonetizationConfig {
  adsEnabled: boolean;
  premiumPurchased: boolean;
  adFrequency: number; // Show ad every N puzzle starts
  adTimeout: number; // Timeout in milliseconds
}

let config: MonetizationConfig = {
  adsEnabled: true,
  premiumPurchased: false,
  adFrequency: 3, // Show ad every 3rd puzzle
  adTimeout: 5000, // 5 second timeout
};

let puzzleStartCount = 0; // Track puzzle starts for ad frequency

/**
 * Show interstitial ad before starting a puzzle
 * Non-blocking - returns immediately and doesn't prevent game from starting
 */
export async function showAd(): Promise<AdResult> {
  try {
    // Skip ads if premium purchased
    if (config.premiumPurchased) {
      return { success: true };
    }

    // Skip ads if disabled
    if (!config.adsEnabled) {
      return { success: true };
    }

    // Check ad frequency - only show every N puzzle starts
    puzzleStartCount++;
    if (puzzleStartCount % config.adFrequency !== 0) {
      return { success: true };
    }

    console.log('🎬 Showing interstitial ad before puzzle start...');
    
    // Simulate ad loading and display
    // In real implementation, this would integrate with:
    // - Google AdMob (react-native-google-mobile-ads)
    // - Facebook Audience Network
    // - Unity Ads
    // - AppLovin MAX
    
    const adPromise = new Promise<AdResult>((resolve) => {
      // Simulate ad loading time (1-3 seconds)
      const loadTime = Math.random() * 2000 + 1000;
      
      setTimeout(() => {
        // Simulate 90% success rate
        const success = Math.random() > 0.1;
        
        if (success) {
          console.log('✅ Ad displayed successfully');
          resolve({ 
            success: true, 
            revenue: 0.02 // Typical interstitial CPM 
          });
        } else {
          console.log('❌ Ad failed to load');
          resolve({ 
            success: false, 
            error: 'Ad failed to load' 
          });
        }
      }, loadTime);
    });

    // Race against timeout to ensure game isn't blocked
    const timeoutPromise = new Promise<AdResult>((resolve) => {
      setTimeout(() => {
        console.log('⏰ Ad timed out');
        resolve({ 
          success: false, 
          error: 'Ad timeout' 
        });
      }, config.adTimeout);
    });

    return await Promise.race([adPromise, timeoutPromise]);

  } catch (error) {
    console.error('Ad error:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown ad error' 
    };
  }
}

/**
 * Handle premium upgrade purchase ($9.99)
 */
export async function purchasePremium(): Promise<PurchaseResult> {
  try {
    console.log('💳 Processing premium upgrade...');
    
    // TODO: Integrate with app store purchases
    // - iOS: StoreKit via react-native-iap
    // - Android: Google Play Billing via react-native-iap
    
    // Simulate purchase flow
    const purchasePromise = new Promise<PurchaseResult>((resolve) => {
      setTimeout(() => {
        // Simulate purchase success/failure
        const success = Math.random() > 0.2; // 80% success rate
        
        if (success) {
          config.premiumPurchased = true;
          console.log('✅ Premium upgrade successful');
          resolve({ 
            success: true, 
            productId: 'puzzlepals.premium' 
          });
        } else {
          console.log('❌ Premium upgrade failed');
          resolve({ 
            success: false, 
            error: 'Purchase was cancelled or failed' 
          });
        }
      }, 2000);
    });

    return await purchasePromise;
    
  } catch (error) {
    console.error('Purchase error:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown purchase error' 
    };
  }
}

/**
 * Purchase individual puzzle pack
 */
export async function purchasePack(packId: string): Promise<PurchaseResult> {
  try {
    console.log(`💳 Processing pack purchase: ${packId}`);
    
    // TODO: Handle individual pack purchases
    // Similar to premium but for specific content packs
    
    return { success: false, error: 'Pack purchases not yet implemented' };
    
  } catch (error) {
    console.error('Pack purchase error:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown purchase error' 
    };
  }
}

/**
 * Restore previous purchases
 */
export async function restorePurchases(): Promise<PurchaseResult[]> {
  try {
    console.log('🔄 Restoring purchases...');
    
    // TODO: Query app store for previous purchases
    // - Check for premium upgrade
    // - Check for pack purchases
    // - Update local config
    
    return [{ success: false, error: 'Purchase restoration not yet implemented' }];
    
  } catch (error) {
    console.error('Restore purchases error:', error);
    return [{ 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown restore error' 
    }];
  }
}

/**
 * Check if user has premium
 */
export function isPremiumUser(): boolean {
  return config.premiumPurchased;
}

/**
 * Update monetization configuration
 */
export function updateMonetizationConfig(updates: Partial<MonetizationConfig>): void {
  config = { ...config, ...updates };
  console.log('📊 Monetization config updated:', updates);
}

/**
 * Get current monetization stats
 */
export function getMonetizationStats() {
  return {
    puzzleStartCount,
    isPremium: config.premiumPurchased,
    adsEnabled: config.adsEnabled,
    adFrequency: config.adFrequency,
  };
}

/**
 * Reset monetization state (for testing)
 */
export function resetMonetizationState(): void {
  puzzleStartCount = 0;
  config = {
    adsEnabled: true,
    premiumPurchased: false,
    adFrequency: 3,
    adTimeout: 5000,
  };
  console.log('🔄 Monetization state reset');
}