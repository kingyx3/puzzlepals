# Pre-Deployment Checklist

Use this checklist before deploying PuzzlePals to app stores:

## ✅ Code Quality
- [ ] All tests pass: `yarn test`
- [ ] No linting errors: `yarn lint`  
- [ ] TypeScript compiles: `npx tsc --noEmit`
- [ ] No console errors in development

## ✅ App Configuration (app.json)
- [ ] Correct app name: "PuzzlePals"
- [ ] Unique bundle identifier (iOS): `com.yourcompany.puzzlepals`
- [ ] Unique package name (Android): `com.yourcompany.puzzlepals`
- [ ] Version numbers updated
- [ ] Build numbers incremented (iOS buildNumber, Android versionCode)
- [ ] Required permissions listed
- [ ] Privacy descriptions added (iOS infoPlist)

## ✅ EAS Configuration (eas.json)
- [ ] EAS configuration file exists
- [ ] Production profile configured for both platforms
- [ ] Submit configuration includes correct credentials
- [ ] Resource class appropriate for build complexity

## ✅ Assets
- [ ] App icon (1024x1024px): `assets/icon.png`
- [ ] Adaptive icon (Android): `assets/adaptive-icon.png` 
- [ ] Splash screen: `assets/splash-icon.png`
- [ ] Favicon: `assets/favicon.png`
- [ ] All puzzle images optimized
- [ ] No placeholder images in production

## ✅ Store Listings
- [ ] App descriptions written for both stores
- [ ] Screenshots created (phone + tablet for both platforms)
- [ ] Keywords researched and selected
- [ ] Privacy policy created and published
- [ ] Content rating assessed
- [ ] Store category selected

## ✅ Legal & Compliance  
- [ ] Privacy policy links to live URL
- [ ] COPPA compliance verified (kids app)
- [ ] Terms of service (if needed)
- [ ] Data collection documented
- [ ] Third-party licenses included

## ✅ Testing
- [ ] Tested on real iOS device
- [ ] Tested on real Android device  
- [ ] Tested on tablets (both platforms)
- [ ] Performance tested with complex puzzles
- [ ] Memory usage validated
- [ ] Audio/haptics work correctly
- [ ] Accessibility features tested

## ✅ Build Process
- [ ] EAS credentials configured: `eas credentials`
- [ ] Development builds successful
- [ ] Preview builds successful  
- [ ] Production builds completed without errors
- [ ] Build artifacts downloaded and tested

## ✅ Submission
- [ ] App Store Connect app record created
- [ ] Google Play Console app created
- [ ] Store metadata completed
- [ ] Release notes written
- [ ] Builds uploaded and processed
- [ ] Review submission ready

---

**Quick Commands:**
```bash
# Run full validation
yarn test && yarn lint && npx tsc --noEmit

# Build and submit (production)
eas build --platform all --profile production
eas submit --platform all --profile production

# Check build status  
eas build:list
```