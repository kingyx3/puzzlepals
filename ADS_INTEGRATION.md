# Ads Integration Documentation

## Overview

PuzzlePals now includes a fully functional ads integration system that displays **blocking** interstitial ads before users start each puzzle. The game will not start until the ad is completed or skipped (after 5 seconds). This implementation follows the kid-friendly monetization strategy outlined in the main README.

## Current Implementation

### ✅ Implemented Features

- **Blocking Interstitial Ads**: Display before EVERY puzzle start (game waits for completion)
- **Skippable After 5 Seconds**: Users can skip ads after waiting 5 seconds
- **Google AdMob Ready**: Full integration code provided (see GOOGLE_ADMOB_SETUP.md)
- **Premium Support**: Premium users ($5) automatically skip all ads
- **Error Resilience**: Game starts even if ads fail to load
- **Loading UI**: User-friendly loading screen during ad display
- **Console Logging**: Detailed logging for monitoring and debugging
- **Test Coverage**: Comprehensive test suite included

### 🔄 Ready for Production

- **Real Ad SDKs**: Google AdMob integration code ready (see setup guide)
- **In-App Purchases**: Real premium upgrade via app stores
- **Analytics**: Revenue tracking and user behavior monitoring
- **Settings UI**: Premium upgrade in settings screen

## Implementation Details

### Core Files

```
src/services/monetization.ts          # Main ads service implementation
App.tsx                              # Integration point with blocking UI
GOOGLE_ADMOB_SETUP.md               # Complete Google AdMob integration guide
__tests__/monetization.test.ts       # Comprehensive test suite
```

### Code Flow

1. **User selects puzzle** → `App.tsx: handleSelectPuzzle()`
2. **Show loading screen** → `App.tsx: 'loading-ad' state`
3. **Display blocking ad** → `monetization.ts: showAd()` (waits for completion)
4. **User watches or skips** → Ad completes after 5+ seconds
5. **Start puzzle** → Game begins after ad is finished

### Configuration

The ads system is configurable via `updateMonetizationConfig()`:

```typescript
updateMonetizationConfig({
  adsEnabled: true, // Enable/disable ads globally
  premiumPurchased: false, // Premium status (skips ads)
  adFrequency: 1, // Show ad before EVERY puzzle
  adTimeout: 30000, // 30 second timeout for blocking ads
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

- Blocking ad behavior (game waits for completion)
- Ad frequency logic (every puzzle)
- Skip functionality after 5 seconds
- Premium user ad skipping
- Timeout handling (30 seconds)
- Configuration updates
- Statistics tracking
- State reset functionality

## Console Output Examples

When ads are working correctly, you'll see:

```
🎬 Loading interstitial ad (BLOCKING)...
🎬 [SIMULATION] Showing interstitial ad...
⏭️ [SIMULATION] Skip button now available
✅ [SIMULATION] Ad watched completely
```

For skipped ads:

```
⏭️ [SIMULATION] Ad was skipped by user
```

For premium users:

```
📊 Monetization config updated: { premiumPurchased: true }
```

When ads timeout:

```
❌ [SIMULATION] Ad failed to load
```

## Integration with Real Ad SDKs

**See GOOGLE_ADMOB_SETUP.md for complete integration guide.**

The current simulation code in `showInterstitialAd()` function is designed to be easily replaced with real Google AdMob integration. The function already includes:

- Proper async/await structure
- Event handling (loaded, opened, closed, error)
- Skip tracking after 5 seconds
- Timeout protection (30 seconds)
- Comprehensive error handling

### Quick Integration Steps

1. **Install**: `npm install react-native-google-mobile-ads`
2. **Configure**: Add AdMob app IDs to app.json
3. **Replace**: Swap simulation code with real AdMob calls
4. **Test**: Use test ad unit IDs during development

See GOOGLE_ADMOB_SETUP.md for detailed implementation instructions.

## Privacy & Compliance

### COPPA Compliance

- Ads are shown before puzzle start (clear transition, not during gameplay)
- No personally identifiable information is collected
- Ads are skippable after 5 seconds to prevent forced viewing
- Premium option provides ad-free experience for $5
- Loading screen clearly indicates ad is coming

### Parental Controls

The system respects the app's parental control settings:

- Math-based verification required for premium purchases
- Parents can disable ads via premium upgrade ($5)
- Transparent about when and why ads are shown
- Settings screen accessible via gear icon on home screen

## Performance Considerations

- **Blocking but safe**: Game waits for ads but has 30-second timeout protection
- **Skip-friendly**: Users can skip after 5 seconds to prevent frustration
- **Memory efficient**: Ads are requested just-in-time
- **Network resilient**: Works offline (skips ads gracefully)
- **UI feedback**: Loading screen provides clear user feedback

## Troubleshooting

### Common Issues

**Ads not showing**: Check `adsEnabled` and `adFrequency` settings
**Game hanging**: Verify timeout is properly configured (30 seconds)
**Test failures**: Use `resetMonetizationState()` between tests
**Skip not working**: Check 5-second timer implementation

### Debug Mode

Enable verbose logging by checking console output:

- 🎬 = Ad loading started
- ✅ = Ad displayed successfully
- ❌ = Ad failed to load
- ⏭️ = Ad was skipped by user
- ⏰ = Ad timed out
- 📊 = Configuration changed

## Revenue Optimization

### Best Practices

1. **Frequency**: Show ads before every puzzle for maximum revenue
2. **Timing**: Show ads during natural break points (before puzzle start)
3. **Premium value**: Make premium upgrade compelling ($5 for ad-free experience)
4. **User experience**: Ads are skippable after 5 seconds
5. **Clear UI**: Loading screen sets proper expectations

### Analytics to Track

- Ad impression rate (should be close to 100% for every puzzle)
- Ad completion rate vs skip rate
- Revenue per user (RPU)
- Premium conversion rate ($5 upgrade)
- User retention with/without ads

## Next Steps

1. **Production Setup**: Replace simulation with real ad SDK
2. **Analytics Integration**: Add revenue and performance tracking
3. **A/B Testing**: Test different ad frequencies and placements
4. **Premium Features**: Add more premium-exclusive content
5. **Parental Dashboard**: Add ad statistics to parent view
