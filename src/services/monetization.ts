// Monetization service - ads and in-app purchases
// This is a placeholder implementation that can be extended with real ad SDKs

// Types for monetization
export interface AdResult {
  success: boolean;
  error?: string;
  revenue?: number;
  skipped?: boolean;
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
  adFrequency: 1, // Show ad before every puzzle
  adTimeout: 30000, // 30 second timeout for blocking ads
};

let puzzleStartCount = 0; // Track puzzle starts for ad frequency

/**
 * Show interstitial ad before starting a puzzle
 * BLOCKING - game will not start until ad is completed or skipped
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

    // Check ad frequency - show before every puzzle now
    puzzleStartCount++;
    if (puzzleStartCount % config.adFrequency !== 0) {
      return { success: true };
    }

    console.log('🎬 Loading interstitial ad (BLOCKING)...');
    
    // Real Google AdMob implementation would go here
    // For now, simulate the blocking ad experience
    return await showInterstitialAd();

  } catch (error) {
    console.error('Ad error:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown ad error' 
    };
  }
}

/**
 * Show interstitial ad with Google AdMob integration
 * This function simulates the real AdMob behavior until integration is complete
 */
async function showInterstitialAd(): Promise<AdResult> {
  // TODO: Replace with real Google AdMob implementation
  // import { InterstitialAd, AdEventType } from 'react-native-google-mobile-ads';
  // 
  // const adUnitId = __DEV__ 
  //   ? TestIds.INTERSTITIAL // Test ad unit ID
  //   : 'ca-app-pub-YOUR_PUBLISHER_ID/YOUR_AD_UNIT_ID'; // Production ad unit ID
  // 
  // const interstitial = InterstitialAd.createForAdRequest(adUnitId);
  // 
  // return new Promise((resolve) => {
  //   let adShown = false;
  //   let skipTimer: NodeJS.Timeout;
  //   
  //   // Ad loaded successfully
  //   interstitial.addAdEventListener(AdEventType.LOADED, () => {
  //     console.log('AdMob: Interstitial ad loaded');
  //     interstitial.show();
  //   });
  //   
  //   // Ad displayed
  //   interstitial.addAdEventListener(AdEventType.OPENED, () => {
  //     console.log('AdMob: Interstitial ad opened');
  //     adShown = true;
  //     
  //     // Enable skip after 5 seconds
  //     skipTimer = setTimeout(() => {
  //       console.log('AdMob: Skip button now available');
  //       // In real implementation, this would show skip button in UI
  //     }, 5000);
  //   });
  //   
  //   // Ad closed (completed or skipped)
  //   interstitial.addAdEventListener(AdEventType.CLOSED, () => {
  //     console.log('AdMob: Interstitial ad closed');
  //     clearTimeout(skipTimer);
  //     resolve({ 
  //       success: true, 
  //       revenue: 0.02,
  //       skipped: false // Would track if skip button was used
  //     });
  //   });
  //   
  //   // Ad failed to load
  //   interstitial.addAdEventListener(AdEventType.ERROR, (error) => {
  //     console.log('AdMob: Interstitial ad failed:', error);
  //     clearTimeout(skipTimer);
  //     resolve({ 
  //       success: false, 
  //       error: error.message 
  //     });
  //   });
  //   
  //   // Start loading the ad
  //   interstitial.load();
  //   
  //   // Timeout fallback
  //   setTimeout(() => {
  //     if (!adShown) {
  //       console.log('AdMob: Ad load timeout');
  //       clearTimeout(skipTimer);
  //       resolve({ 
  //         success: false, 
  //         error: 'Ad load timeout' 
  //       });
  //     }
  //   }, config.adTimeout);
  // });

  // SIMULATION: Remove this when implementing real AdMob
  return new Promise<AdResult>((resolve) => {
    console.log('🎬 [SIMULATION] Showing interstitial ad...');
    
    // Simulate ad loading time (2-5 seconds)
    const loadTime = Math.random() * 3000 + 2000;
    
    setTimeout(() => {
      // Simulate 95% success rate (higher than non-blocking ads)
      const success = Math.random() > 0.05;
      
      if (success) {
        console.log('✅ [SIMULATION] Ad displayed successfully');
        
        // Simulate ad duration (5-15 seconds, skippable after 5)
        const adDuration = Math.random() * 10000 + 5000;
        const skipAvailableAt = 5000;
        
        setTimeout(() => {
          console.log('⏭️ [SIMULATION] Skip button now available');
        }, skipAvailableAt);
        
        setTimeout(() => {
          // Simulate user behavior: 30% skip, 70% watch full ad
          const wasSkipped = Math.random() < 0.3;
          
          if (wasSkipped) {
            console.log('⏭️ [SIMULATION] Ad was skipped by user');
            resolve({ 
              success: true, 
              revenue: 0.01, // Lower revenue for skipped ads
              skipped: true 
            });
          } else {
            console.log('✅ [SIMULATION] Ad watched completely');
            resolve({ 
              success: true, 
              revenue: 0.02, // Full revenue for completed ads
              skipped: false 
            });
          }
        }, adDuration);
        
      } else {
        console.log('❌ [SIMULATION] Ad failed to load');
        resolve({ 
          success: false, 
          error: 'Ad failed to load' 
        });
      }
    }, loadTime);
  });
}

/**
 * Handle premium upgrade purchase ($5.00)
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
    adFrequency: 1, // Show ad before every puzzle
    adTimeout: 30000, // 30 second timeout for blocking ads
  };
  console.log('🔄 Monetization state reset');
}