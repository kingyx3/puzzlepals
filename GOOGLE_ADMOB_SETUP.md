# Google AdMob Integration Setup

This document outlines the steps required to integrate Google AdMob with PuzzlePals for real ad monetization.

## Prerequisites

1. **Google AdMob Account**: Create an account at [https://admob.google.com](https://admob.google.com)
2. **App Registration**: Register your app in AdMob console
3. **Ad Unit IDs**: Create interstitial ad units for iOS and Android

## Installation Steps

### 1. Install React Native Google Mobile Ads

```bash
# Install the main AdMob package
npm install react-native-google-mobile-ads

# For Expo managed workflow (if using):
npx expo install react-native-google-mobile-ads

# iOS additional setup (if using bare React Native):
cd ios && pod install
```

### 2. Configure App.json/App.config.js (Expo)

Add AdMob configuration to your app.json:

```json
{
  "expo": {
    "plugins": [
      [
        "react-native-google-mobile-ads",
        {
          "androidAppId": "ca-app-pub-YOUR_ANDROID_APP_ID~YOUR_ANDROID_APP_ID",
          "iosAppId": "ca-app-pub-YOUR_IOS_APP_ID~YOUR_IOS_APP_ID"
        }
      ]
    ]
  }
}
```

### 3. Configure Native Projects (Bare React Native)

#### Android (android/app/src/main/AndroidManifest.xml):

```xml
<application>
    <!-- AdMob App ID -->
    <meta-data
        android:name="com.google.android.gms.ads.APPLICATION_ID"
        android:value="ca-app-pub-YOUR_ANDROID_APP_ID~YOUR_ANDROID_APP_ID"/>
</application>
```

#### iOS (ios/PuzzlePals/Info.plist):

```xml
<key>GADApplicationIdentifier</key>
<string>ca-app-pub-YOUR_IOS_APP_ID~YOUR_IOS_APP_ID</string>
```

## Implementation

### 1. Replace Simulation Code

In `src/services/monetization.ts`, replace the `showInterstitialAd` function:

```typescript
import {
  InterstitialAd,
  AdEventType,
  TestIds,
} from 'react-native-google-mobile-ads';

async function showInterstitialAd(): Promise<AdResult> {
  // Use test ads in development, real ads in production
  const adUnitId = __DEV__
    ? TestIds.INTERSTITIAL
    : Platform.select({
        ios: 'ca-app-pub-YOUR_PUBLISHER_ID/YOUR_IOS_INTERSTITIAL_ID',
        android: 'ca-app-pub-YOUR_PUBLISHER_ID/YOUR_ANDROID_INTERSTITIAL_ID',
      });

  const interstitial = InterstitialAd.createForAdRequest(adUnitId!);

  return new Promise((resolve) => {
    let adShown = false;
    let skipTimer: NodeJS.Timeout;

    // Ad loaded successfully
    interstitial.addAdEventListener(AdEventType.LOADED, () => {
      console.log('AdMob: Interstitial ad loaded');
      interstitial.show();
    });

    // Ad displayed
    interstitial.addAdEventListener(AdEventType.OPENED, () => {
      console.log('AdMob: Interstitial ad opened');
      adShown = true;

      // Track skip availability (skip button appears after 5 seconds)
      skipTimer = setTimeout(() => {
        console.log('AdMob: Skip button now available');
      }, 5000);
    });

    // Ad closed (completed or skipped)
    interstitial.addAdEventListener(AdEventType.CLOSED, () => {
      console.log('AdMob: Interstitial ad closed');
      clearTimeout(skipTimer);
      resolve({
        success: true,
        revenue: 0.02, // Update with real eCPM data
        skipped: false, // AdMob doesn't directly track skips
      });
    });

    // Ad failed to load
    interstitial.addAdEventListener(AdEventType.ERROR, (error) => {
      console.log('AdMob: Interstitial ad failed:', error);
      clearTimeout(skipTimer);
      resolve({
        success: false,
        error: error.message,
      });
    });

    // Start loading the ad
    interstitial.load();

    // Timeout fallback
    setTimeout(() => {
      if (!adShown) {
        console.log('AdMob: Ad load timeout');
        clearTimeout(skipTimer);
        resolve({
          success: false,
          error: 'Ad load timeout',
        });
      }
    }, config.adTimeout);
  });
}
```

### 2. Initialize AdMob

Add to your App.tsx or main entry point:

```typescript
import { mobileAds } from 'react-native-google-mobile-ads';

export default function App() {
  useEffect(() => {
    // Initialize Google Mobile Ads SDK
    mobileAds()
      .initialize()
      .then((adapterStatuses) => {
        console.log('AdMob initialized:', adapterStatuses);
      })
      .catch((error) => {
        console.error('AdMob initialization failed:', error);
      });
  }, []);

  // ... rest of your app
}
```

## Ad Unit Configuration

### Creating Ad Units in AdMob Console

1. **Go to AdMob Console**: [https://apps.admob.com](https://apps.admob.com)
2. **Select Your App**: Choose your registered app
3. **Ad Units**: Click "Ad units" → "Add ad unit"
4. **Select Interstitial**: Choose "Interstitial" ad format
5. **Configure Settings**:
   - Name: "Puzzle Start Interstitial"
   - Ad format: Interstitial
   - Platform: iOS/Android
6. **Save**: Copy the generated ad unit ID

### Recommended Settings

- **Ad Frequency**: Every puzzle start (current implementation)
- **Skip Timer**: 5 seconds (industry standard)
- **Timeout**: 30 seconds (prevents hanging)
- **Test Mode**: Always use test ads during development

## Testing

### Test Ads

Always use test ad unit IDs during development:

- Interstitial: `TestIds.INTERSTITIAL`
- Banner: `TestIds.BANNER`
- Rewarded: `TestIds.REWARDED`

### Real Device Testing

Test on real devices before release:

1. Use test ads to verify integration
2. Test ad loading and display
3. Test skip functionality
4. Test error handling
5. Test with poor network conditions

## Compliance & Policies

### Google AdMob Policies

- **Content Rating**: Ensure app is rated appropriately for kids
- **COPPA Compliance**: Tag ad requests for child-directed treatment
- **Ad Placement**: Follow placement policies (no accidental clicks)

### Child-Directed Content

For apps targeting children under 13, add to ad requests:

```typescript
import { AdsConsent } from 'react-native-google-mobile-ads';

// Configure for child-directed treatment
const requestConfig = {
  tagForChildDirectedTreatment: true,
  tagForUnderAgeOfConsent: true,
};
```

## Production Checklist

- [ ] Replace test ad unit IDs with production IDs
- [ ] Configure app.json with real AdMob app IDs
- [ ] Test on real devices with test ads
- [ ] Verify COPPA compliance settings
- [ ] Set up ad mediation (optional, for better fill rates)
- [ ] Configure ad frequency caps if needed
- [ ] Monitor performance in AdMob console after release

## Monitoring & Analytics

### Key Metrics to Track

- **Fill Rate**: Percentage of ad requests that return ads
- **eCPM**: Effective cost per mille (revenue per 1000 impressions)
- **Click-Through Rate**: Ad engagement metrics
- **User Retention**: Impact of ads on user experience

### AdMob Console

Monitor performance at: [https://apps.admob.com](https://apps.admob.com)

- Revenue reports
- Ad unit performance
- User metrics
- Policy violations

## Troubleshooting

### Common Issues

1. **Ads not loading**: Check network, ad unit IDs, and app registration
2. **App crashes**: Verify SDK initialization and error handling
3. **Policy violations**: Review AdMob policies and content guidelines
4. **Low fill rates**: Consider ad mediation or different ad networks

### Debug Logs

Enable verbose logging for troubleshooting:

```typescript
import { mobileAds } from 'react-native-google-mobile-ads';

// Enable debug logging (development only)
if (__DEV__) {
  mobileAds().setRequestConfiguration({
    debugGeography: 'EEA', // For testing GDPR
    testDeviceIdentifiers: ['YOUR_TEST_DEVICE_ID'],
  });
}
```

## Support Resources

- **AdMob Documentation**: [https://developers.google.com/admob](https://developers.google.com/admob)
- **React Native Google Mobile Ads**: [https://rnfirebase.io/](https://rnfirebase.io/)
- **AdMob Help Center**: [https://support.google.com/admob](https://support.google.com/admob)
- **Policy Center**: [https://support.google.com/admob/answer/6128543](https://support.google.com/admob/answer/6128543)
