# Pre-Deployment Checklist

Use this checklist before deploying PuzzlePals to app stores:

## ✅ Prerequisites Setup
- [ ] Node.js 20+ installed locally
- [ ] Expo CLI installed: `npm install -g @expo/cli`
- [ ] EAS CLI installed: `npm install -g eas-cli` 
- [ ] Expo account created and logged in: `npx expo login`
- [ ] EAS account set up: `eas login`
- [ ] Apple Developer Account ($99/year) - if targeting iOS
- [ ] Google Play Console Account ($25 one-time) - if targeting Android

## ✅ Code Quality
- [ ] All tests pass: `yarn test`
- [ ] No linting errors: `yarn lint`  
- [ ] TypeScript compiles: `npx tsc --noEmit`
- [ ] No console errors in development
- [ ] App runs successfully: `npx expo start --web --offline`

## ✅ App Configuration (app.json)
- [ ] Correct app name: "PuzzlePals"
- [ ] Unique bundle identifier (iOS): `com.yourdomain.puzzlepals` (replace yourdomain)
- [ ] Unique package name (Android): `com.yourdomain.puzzlepals` (replace yourdomain)
- [ ] Version numbers updated (use `./scripts/bump-version.sh`)
- [ ] Build numbers incremented (iOS buildNumber, Android versionCode)
- [ ] Expo project ID added to `extra.eas.projectId`
- [ ] Expo owner/username set correctly
- [ ] Required permissions listed for camera and photo access
- [ ] Privacy descriptions added (iOS infoPlist)

## ✅ EAS Configuration (eas.json)
- [ ] EAS configuration file exists (✅ Created: `eas.json`)
- [ ] Production profile configured for both platforms
- [ ] Submit configuration includes correct credentials
- [ ] Resource class appropriate for build complexity (using m-medium)
- [ ] Project initialized with EAS: `eas project:init`

## ✅ Credentials Setup
- [ ] iOS credentials configured: `eas credentials:configure -p ios`
- [ ] Android credentials configured: `eas credentials:configure -p android`
- [ ] Google Service Account JSON downloaded and saved to `secrets/`
- [ ] Apple Developer team ID obtained and added to eas.json
- [ ] App Store Connect App ID created and added to eas.json

## ✅ GitHub Secrets (for CI/CD)
- [ ] `EXPO_TOKEN` added to GitHub repository secrets
- [ ] Repository Actions enabled in Settings > Actions
- [ ] Workflow file activated (✅ Created: `.github/workflows/eas-build.yml`)

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
- [ ] EAS project initialized: `eas project:init`
- [ ] Development builds successful: `eas build -p all --profile development`
- [ ] Preview builds successful: `eas build -p all --profile preview`  
- [ ] Production builds completed: `eas build -p all --profile production`
- [ ] Build artifacts downloaded and tested locally
- [ ] Build status checked: `eas build:list`

## ✅ Version Management (scripts/bump-version.sh)
- [ ] Version bumping script is executable (✅ Ready)
- [ ] Test version bump: `./scripts/bump-version.sh patch`
- [ ] Git tags created for releases: `git tag v1.0.0`
- [ ] Version numbers aligned between package.json and app.json

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