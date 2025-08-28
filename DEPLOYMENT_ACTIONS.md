# Deployment Action List for @kingyx3

This is your personalized checklist of actions needed to deploy PuzzlePals to app stores. Complete these steps in order:

## 🔧 Required Setup Actions (Do First)

### 1. Account Setup
- [ ] **Create Apple Developer Account** ($99/year) - if targeting iOS
  - Visit: https://developer.apple.com/programs/
  - Complete enrollment process (can take 24-48 hours)
  
- [ ] **Create Google Play Console Account** ($25 one-time) - if targeting Android  
  - Visit: https://play.google.com/console/
  - Complete developer registration

- [ ] **Create/Login to Expo Account** (free)
  - Run: `npx expo login` 
  - If no account: `npx expo register`

### 2. Project Configuration
- [ ] **Update app.json with your details:**
  ```bash
  # Replace these placeholder values:
  "bundleIdentifier": "com.yourdomain.puzzlepals"  # Change yourdomain
  "package": "com.yourdomain.puzzlepals"          # Change yourdomain  
  "owner": "your-expo-username"                   # Your Expo username
  ```

- [ ] **Initialize EAS project:**
  ```bash
  eas project:init
  # This will add your project ID to app.json automatically
  ```

### 3. Credentials Setup
- [ ] **Configure iOS credentials** (if targeting iOS):
  ```bash
  eas credentials:configure -p ios
  ```
  - Follow prompts to create/upload certificates
  - Note down your Team ID for eas.json

- [ ] **Configure Android credentials** (if targeting Android):
  ```bash
  eas credentials:configure -p android
  ```
  - Creates keystore automatically or lets you upload existing one

### 4. Google Play Store Setup (Android)
- [ ] **Create Google Service Account:**
  1. Go to Google Cloud Console
  2. Create service account with Google Play Console access
  3. Download JSON key file
  4. Save as `secrets/google-service-account.json`

- [ ] **Update eas.json with your Apple details:**
  ```json
  "ios": {
    "appleId": "your-actual-email@email.com",
    "ascAppId": "your-app-store-connect-app-id",
    "appleTeamId": "your-actual-team-id"
  }
  ```

### 5. GitHub Actions Setup (Optional but Recommended)
- [ ] **Generate Expo Access Token:**
  - Visit: https://expo.dev/accounts/[username]/settings/access-tokens
  - Create token with appropriate permissions

- [ ] **Add GitHub Secret:**
  - Go to: https://github.com/kingyx3/puzzlepals/settings/secrets/actions
  - Add `EXPO_TOKEN` with your Expo access token

## 🚀 Build & Test Actions

### 6. First Build Test
- [ ] **Test development build:**
  ```bash
  eas build --platform all --profile development
  ```

- [ ] **Test preview build:**
  ```bash
  eas build --platform all --profile preview  
  ```

- [ ] **Production build:**
  ```bash
  eas build --platform all --profile production
  ```

### 7. Version Management
- [ ] **Test version bumping:**
  ```bash
  ./scripts/bump-version.sh patch
  git add . && git commit -m "Bump version to $(node -p "require('./package.json').version")"
  ```

## 📱 Store Submission Actions

### 8. Create App Store Listings
- [ ] **Apple App Store Connect:**
  - Create new app record
  - Upload screenshots (required sizes in DEPLOYMENT.md)
  - Write app description
  - Set up pricing and availability

- [ ] **Google Play Console:**  
  - Create new app
  - Complete store listing
  - Upload screenshots and graphics
  - Set content rating

### 9. Submit for Review
- [ ] **Upload builds to stores:**
  ```bash
  eas submit --platform all --profile production
  ```

- [ ] **Submit for review in respective consoles**

## 📋 Before You Start - Quick Validation

Run these commands to make sure everything is ready:

```bash
# Verify project works
yarn test && yarn lint && npx tsc --noEmit

# Check Expo setup
npx expo whoami
eas whoami

# Verify files are ready
ls -la eas.json                              # Should exist ✅
ls -la .github/workflows/eas-build.yml       # Should exist ✅  
ls -la scripts/bump-version.sh               # Should be executable ✅
```

## 🔍 Need Help?

- **Detailed instructions:** See `DEPLOYMENT.md` for complete step-by-step guides
- **Quick checklist:** Use `deployment-checklist.md` before each deployment
- **Troubleshooting:** Check the Troubleshooting section in `DEPLOYMENT.md`

## 📝 Notes

- **iOS builds**: Require macOS for local testing, but EAS builds work on any platform
- **Cost estimation**: Apple Developer ($99/year) + Google Play Console ($25 one-time) 
- **Timeline**: Initial setup takes 2-4 hours, subsequent deployments take 30-60 minutes
- **Build times**: Production builds typically take 10-20 minutes per platform

---

**Files I've prepared for you:**
- ✅ `eas.json` - Ready to use EAS configuration
- ✅ `.github/workflows/eas-build.yml` - CI/CD pipeline ready 
- ✅ `scripts/bump-version.sh` - Made executable, ready to use
- ✅ Updated `.gitignore` - Protects your secret files
- ✅ Updated `deployment-checklist.md` - More specific and actionable

**What you need to customize:**
- Bundle identifiers in `app.json` 
- Expo project ID (run `eas project:init`)
- Apple/Google credentials in `eas.json`
- Service account JSON file in `secrets/`