# Ads Integration Documentation

## Overview

PuzzlePals now includes a fully functional ads integration system that displays interstitial ads right before users start a new puzzle. This implementation follows the kid-friendly monetization strategy outlined in the main README.

## Features

### ✅ Implemented Features

- **Interstitial Ads**: Display before puzzle starts (non-disruptive)
- **Smart Frequency**: Configurable ad frequency (default: every 3rd puzzle)
- **Premium Support**: Premium users automatically skip all ads
- **Timeout Protection**: 5-second timeout to prevent game blocking
- **Error Resilience**: Game starts even if ads fail to load
- **Console Logging**: Detailed logging for monitoring and debugging
- **Test Coverage**: Comprehensive test suite included

### 🔄 Future Enhancements

- **Real Ad SDKs**: Integration with Google AdMob, Facebook Audience Network
- **In-App Purchases**: Real premium upgrade via app stores
- **Analytics**: Revenue tracking and user behavior monitoring
- **Settings UI**: Parental controls for ad preferences

## Implementation Details

### Core Files

```
src/services/monetization.ts     # Main ads service implementation
App.tsx                         # Integration point - handleSelectPuzzle
__tests__/monetization.test.ts  # Comprehensive test suite
```

### Code Flow

1. **User selects puzzle** → `App.tsx: handleSelectPuzzle()`
2. **Check ad conditions** → `monetization.ts: showAd()`
3. **Display ad (if applicable)** → Simulated 1-3 second loading
4. **Start puzzle** → Game begins regardless of ad success/failure

### Configuration

The ads system is configurable via `updateMonetizationConfig()`:

```typescript
updateMonetizationConfig({
  adsEnabled: true,           // Enable/disable ads globally
  premiumPurchased: false,    // Premium status (skips ads)
  adFrequency: 3,            // Show ad every N puzzle starts
  adTimeout: 5000            // Timeout in milliseconds
});
```

### Usage Statistics

Monitor ads performance with `getMonetizationStats()`:

```typescript
const stats = getMonetizationStats();
// Returns: { puzzleStartCount, isPremium, adsEnabled, adFrequency }
```

## Testing

Run the ads tests:

```bash
yarn test __tests__/monetization.test.ts
```

Test scenarios covered:
- Ad frequency logic (every 3rd puzzle)
- Premium user ad skipping
- Timeout handling
- Configuration updates
- Statistics tracking
- State reset functionality

## Console Output Examples

When ads are working correctly, you'll see:

```
🎬 Showing interstitial ad before puzzle start...
✅ Ad displayed successfully
```

For premium users:
```
📊 Monetization config updated: { premiumPurchased: true }
```

When ads timeout:
```
⏰ Ad timed out
```

## Integration with Real Ad SDKs

To integrate with real ad networks, replace the simulation code in `showAd()` with:

### Google AdMob Example

```typescript
import { InterstitialAd, AdEventType, TestIds } from 'react-native-google-mobile-ads';

const adUnitId = __DEV__ ? TestIds.INTERSTITIAL : 'ca-app-pub-xxxxx/yyyyyy';
const interstitial = InterstitialAd.createForAdRequest(adUnitId);

// In showAd() function:
await interstitial.load();
await interstitial.show();
```

### Facebook Audience Network Example

```typescript
import { InterstitialAdManager } from 'react-native-fbads';

// In showAd() function:
await InterstitialAdManager.showAd('YOUR_PLACEMENT_ID');
```

## Privacy & Compliance

### COPPA Compliance

- Ads are only shown in menu screens (never during gameplay)
- No personally identifiable information is collected
- Frequency limits prevent ad overexposure to children
- Premium option provides ad-free experience

### Parental Controls

The system respects the app's parental control settings:
- Math-based verification required for premium purchases
- Parents can disable ads via premium upgrade
- Transparent about when and why ads are shown

## Performance Considerations

- **Non-blocking**: Game always starts, even if ads fail
- **Timeout protection**: 5-second maximum wait time
- **Memory efficient**: Ads are requested just-in-time
- **Network resilient**: Works offline (skips ads gracefully)

## Troubleshooting

### Common Issues

**Ads not showing**: Check `adsEnabled` and `adFrequency` settings
**Game hanging**: Verify timeout is properly configured
**Test failures**: Use `resetMonetizationState()` between tests

### Debug Mode

Enable verbose logging by checking console output:
- 🎬 = Ad loading started
- ✅ = Ad displayed successfully  
- ❌ = Ad failed to load
- ⏰ = Ad timed out
- 📊 = Configuration changed

## Revenue Optimization

### Best Practices

1. **Frequency**: Start with every 3rd puzzle, adjust based on user feedback
2. **Timing**: Show ads during natural break points (before puzzle start)
3. **Premium value**: Make premium upgrade compelling ($9.99 for ad-free + content)
4. **User experience**: Never interrupt gameplay with ads

### Analytics to Track

- Ad impression rate
- Ad completion rate  
- Revenue per user (RPU)
- Premium conversion rate
- User retention with/without ads

## Next Steps

1. **Production Setup**: Replace simulation with real ad SDK
2. **Analytics Integration**: Add revenue and performance tracking
3. **A/B Testing**: Test different ad frequencies and placements
4. **Premium Features**: Add more premium-exclusive content
5. **Parental Dashboard**: Add ad statistics to parent view