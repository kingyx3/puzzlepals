# PuzzlePals Deployment Guide

This guide covers the complete process of deploying the PuzzlePals React Native Expo app to both the Google Play Store and Apple App Store using Expo Application Services (EAS).

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Project Setup](#project-setup)
3. [EAS Build Configuration](#eas-build-configuration)
4. [App Store Assets](#app-store-assets)
5. [Building for Production](#building-for-production)
6. [Google Play Store Submission](#google-play-store-submission)
7. [Apple App Store Submission](#apple-app-store-submission)
8. [Version Management](#version-management)
9. [Continuous Deployment](#continuous-deployment)
10. [Troubleshooting](#troubleshooting)

## Prerequisites

### Required Tools

- **Node.js 20+** (version 20.19.4 confirmed working)
- **Yarn or npm** (Yarn recommended)
- **Expo CLI** (latest version)
- **EAS CLI** (for building and submissions)

### Account Requirements

- **Expo Account** (free tier sufficient for basic builds)
- **Google Play Console Account** ($25 one-time registration fee)
- **Apple Developer Account** ($99/year subscription)

### Installation

```bash
# Install Expo CLI globally
npm install -g @expo/cli

# Install EAS CLI globally  
npm install -g eas-cli

# Login to your Expo account
npx expo login

# Login to EAS
eas login
```

## Project Setup

### 1. Initialize EAS in Your Project

```bash
cd /path/to/puzzlepals
eas build:configure
```

This creates an `eas.json` file with build configurations for iOS and Android.

### 2. Verify Dependencies

Ensure all native dependencies are compatible with EAS Build:

```bash
npx expo install --check
```

### 3. Update app.json Configuration

Your `app.json` should include store-ready metadata:

```json
{
  "expo": {
    "name": "PuzzlePals",
    "slug": "puzzlepals",
    "version": "1.0.0",
    "orientation": "portrait",
    "icon": "./assets/icon.png",
    "userInterfaceStyle": "light",
    "newArchEnabled": true,
    "splash": {
      "image": "./assets/splash-icon.png",
      "resizeMode": "contain",
      "backgroundColor": "#ffffff"
    },
    "assetBundlePatterns": ["**/*"],
    "ios": {
      "supportsTablet": true,
      "bundleIdentifier": "com.yourcompany.puzzlepals",
      "buildNumber": "1",
      "infoPlist": {
        "NSCameraUsageDescription": "This app uses the camera to create custom puzzles from your photos.",
        "NSPhotoLibraryUsageDescription": "This app accesses your photo library to create custom puzzles."
      }
    },
    "android": {
      "adaptiveIcon": {
        "foregroundImage": "./assets/adaptive-icon.png",
        "backgroundColor": "#ffffff"
      },
      "package": "com.yourcompany.puzzlepals",
      "versionCode": 1,
      "permissions": [
        "android.permission.RECORD_AUDIO",
        "android.permission.READ_EXTERNAL_STORAGE",
        "android.permission.WRITE_EXTERNAL_STORAGE"
      ]
    },
    "web": {
      "favicon": "./assets/favicon.png"
    },
    "extra": {
      "eas": {
        "projectId": "your-project-id-here"
      }
    },
    "owner": "your-expo-username"
  }
}
```

## EAS Build Configuration

Create `eas.json` in your project root:

```json
{
  "cli": {
    "version": ">= 7.0.0"
  },
  "build": {
    "development": {
      "developmentClient": true,
      "distribution": "internal",
      "ios": {
        "resourceClass": "m-medium"
      },
      "android": {
        "buildType": "apk",
        "gradleCommand": ":app:assembleDebug"
      }
    },
    "preview": {
      "distribution": "internal",
      "ios": {
        "resourceClass": "m-medium",
        "simulator": true
      },
      "android": {
        "buildType": "apk",
        "gradleCommand": ":app:assembleRelease"
      }
    },
    "production": {
      "ios": {
        "resourceClass": "m-medium"
      },
      "android": {
        "buildType": "aab"
      }
    }
  },
  "submit": {
    "production": {
      "ios": {
        "appleId": "your-apple-id@email.com",
        "ascAppId": "your-app-store-connect-app-id",
        "appleTeamId": "your-apple-team-id"
      },
      "android": {
        "serviceAccountKeyPath": "./secrets/google-service-account.json",
        "track": "internal"
      }
    }
  }
}
```

## App Store Assets

### Required Assets

Create the following assets in your `assets/` directory:

#### App Icons

- **icon.png**: 1024x1024px (used for iOS and base icon)
- **adaptive-icon.png**: 1024x1024px (Android adaptive icon foreground)
- **favicon.png**: 48x48px (web favicon)

#### Splash Screen

- **splash-icon.png**: 1284x2778px (iPhone 12 Pro Max dimensions)

#### Store Screenshots

Create screenshots for both stores:

**iOS Screenshots:**
- iPhone: 1290x2796px (iPhone 14 Pro Max) - at least 3 images
- iPad: 2048x2732px (12.9" iPad Pro) - at least 3 images

**Android Screenshots:**
- Phone: 1080x1920px - at least 2 images  
- Tablet: 1920x1080px - at least 1 image (landscape)

### Asset Generation

Use tools like:
- **Expo Asset Generator**: Built into Expo CLI
- **App Icon Generator**: Online tools for multiple sizes
- **Figma**: For custom designs and mockups

```bash
# Generate app icons automatically
npx expo prebuild --clear

# This generates all required icon sizes for iOS and Android
```

## Building for Production

### 1. iOS Production Build

```bash
# Build for iOS App Store
eas build --platform ios --profile production

# Monitor build progress
eas build:list
```

### 2. Android Production Build

```bash
# Build Android App Bundle (AAB) for Play Store
eas build --platform android --profile production

# Build APK for testing (optional)
eas build --platform android --profile preview
```

### 3. Build Both Platforms

```bash
# Build for both platforms simultaneously
eas build --platform all --profile production
```

## Google Play Store Submission

### 1. Prepare Play Console

1. **Create App**: Go to [Google Play Console](https://play.google.com/console)
2. **Fill App Details**:
   - App name: "PuzzlePals" 
   - Default language: English
   - App category: Education or Family/Education
   - Content rating: Everyone or Everyone 3+

### 2. Upload Build

```bash
# Submit to Google Play Store (internal testing track)
eas submit --platform android --profile production

# Or upload manually through Play Console
```

### 3. Store Listing Information

**Short Description** (80 characters):
```
Kid-friendly jigsaw puzzles with educational content and gentle gameplay.
```

**Full Description** (4000 characters):
```
🧩 PuzzlePals - Safe, Educational Jigsaw Puzzles for Kids

Designed specifically for tiny hands and growing minds, PuzzlePals offers a delightful puzzle experience that's both entertaining and educational.

✨ Kid-Friendly Features:
• Large, easy-to-handle puzzle pieces
• Gentle snapping and forgiving gameplay
• Celebration animations for completed puzzles
• No missing pieces - ever!
• Safe, ad-free environment

🎓 Educational Content:
• Animal facts and vocabulary building
• Age-appropriate difficulty levels (3-12 years)
• Learning prompts and discussion starters
• Multilingual support

🎨 Beautiful Puzzle Collections:
• Adorable animals and nature scenes
• Vibrant, child-friendly illustrations  
• Multiple difficulty levels
• Regular content updates

🔒 Parent-Friendly:
• Parental controls for settings
• Progress tracking
• No in-app purchases or ads
• COPPA compliant

Perfect for quiet time, learning activities, or family fun. PuzzlePals grows with your child through adjustable difficulty levels and educational content.

Download now and watch your little ones develop problem-solving skills while having fun!
```

### 4. Content Rating

Complete the content rating questionnaire:
- **Violence**: None
- **Sexual Content**: None  
- **Profanity**: None
- **Controlled Substances**: None
- **Gambling**: None
- **Target Age**: 3-12 years

### 5. App Content

- **Privacy Policy**: Required (create one addressing data collection)
- **Target Audience**: Children
- **Ads**: No ads (if applicable)
- **In-app Purchases**: None (if applicable)

### 6. Release

1. **Internal Testing**: Test with up to 100 internal testers
2. **Closed Testing**: Expand to select external users  
3. **Open Testing**: Public beta (optional)
4. **Production**: Full public release

## Apple App Store Submission

### 1. App Store Connect Setup

1. Go to [App Store Connect](https://appstoreconnect.apple.com)
2. **Create New App**:
   - Platform: iOS
   - Name: "PuzzlePals"
   - Bundle ID: `com.yourcompany.puzzlepals`
   - SKU: Unique identifier
   - User Access: Full Access

### 2. Upload Build

```bash
# Submit to App Store Connect
eas submit --platform ios --profile production

# Or use Xcode/Transporter for manual upload
```

### 3. App Information

**Description**:
```
🧩 PuzzlePals - The Perfect Puzzle App for Kids

Transform screen time into learning time with PuzzlePals, the jigsaw puzzle app designed specifically for children ages 3-12.

🌟 Why Parents Love PuzzlePals:
• Safe, ad-free environment with parental controls
• Educational content that grows with your child
• No in-app purchases or hidden costs
• COPPA compliant and privacy-focused

👶 Perfect for Little Hands:
• Extra-large puzzle pieces for easy handling
• Gentle snapping with haptic feedback
• Forgiving gameplay - pieces can't get lost!
• Colorful celebration animations

🎓 Learning Made Fun:
• Animal facts and vocabulary building
• Age-appropriate difficulty progression
• Discussion prompts for family bonding
• Multiple languages supported

🎨 Beautiful Content:
• Hand-crafted, child-friendly illustrations
• Nature, animals, and educational themes
• Regular free content updates
• High-quality, vibrant graphics

Perfect for developing:
• Problem-solving skills
• Hand-eye coordination  
• Pattern recognition
• Patience and persistence

Join thousands of families who trust PuzzlePals for quality educational entertainment!
```

**Keywords**: 
```
puzzle,kids,children,educational,jigsaw,family,learning,preschool,toddler,animals
```

### 4. Age Rating

Select appropriate age rating:
- **4+** for basic version
- Consider **Parental Guidance** if needed

### 5. Review Information

- **Demo Account**: Not needed for puzzle app
- **Contact Information**: Your support email
- **Review Notes**: Special instructions for reviewers

### 6. Version Release

Choose release option:
- **Automatically release**: After approval
- **Manually release**: You control timing
- **Scheduled release**: Set specific date/time

## Version Management

### Semantic Versioning

Follow semantic versioning (MAJOR.MINOR.PATCH):

- **MAJOR**: Breaking changes (rare for mobile apps)
- **MINOR**: New features, content packs
- **PATCH**: Bug fixes, small improvements

### Update Process

1. **Update Version Numbers**:

```bash
# Update package.json version
npm version patch  # or minor/major

# Update app.json versions
# iOS: increment buildNumber
# Android: increment versionCode
```

2. **Build and Submit**:

```bash
# Build new version
eas build --platform all --profile production

# Submit updates
eas submit --platform all --profile production
```

### Release Notes

Keep release notes user-friendly:

**Example**:
```
🎉 New in Version 1.1.0:

• 3 new animal puzzle packs
• Improved hint system
• Bug fixes and performance improvements
• Added Spanish language support

Thanks for playing PuzzlePals! 🧩
```

## Continuous Deployment

### GitHub Actions Setup

The project uses local EAS builds via GitHub Actions for better control and cost efficiency. The workflow is configured to:

- **Develop branch**: Build preview APKs for testing
- **Main branch**: Build production releases and submit to app stores
- **Local builds**: All builds run locally in GitHub Actions (no data sent to EAS cloud servers)

Current workflow (`.github/workflows/eas-build.yml`) includes:

**Key Features:**
- Local EAS builds using `--local` flag (no cloud dependency)
- Cross-platform builds (Android on Ubuntu, iOS on macOS)
- Automatic artifact uploads for easy download
- Store submission integration for production releases

**Workflow Triggers:**
```yaml
on:
  push:
    branches: [develop, main]  # Local builds for both branches
    tags: ['v*']              # Production releases
  pull_request:
    branches: [develop, main]
```

**Build Matrix:**
- **Android builds**: Run on Ubuntu with Android SDK
- **iOS builds**: Run on macOS with Xcode (production only)
- **Preview builds**: Android APK only (develop branch)
- **Production builds**: Both platforms (main branch)

### Environment Variables

Set these secrets in GitHub repository settings:

- `EXPO_TOKEN`: Your Expo access token
- `APPLE_ID`: Apple ID for app submissions
- `APPLE_APP_SPECIFIC_PASSWORD`: App-specific password
- `GOOGLE_SERVICE_ACCOUNT_KEY`: Google service account JSON

## Troubleshooting

### Common Build Issues

#### Native Dependencies

**Error**: Native module compatibility issues

**Solution**:
```bash
# Ensure all dependencies are EAS compatible
npx expo install --check

# Check for unsupported packages
npx expo doctor
```

#### Memory Issues

**Error**: Build runs out of memory

**Solution**: Upgrade build resource class in `eas.json`:
```json
{
  "build": {
    "production": {
      "ios": {
        "resourceClass": "m-large"  // or m-medium
      }
    }
  }
}
```

#### Code Signing

**Error**: iOS code signing failures

**Solution**:
1. Ensure Apple Developer account is active
2. Let EAS manage certificates: `eas credentials`
3. Verify Bundle ID matches App Store Connect

### Store Submission Issues

#### App Store Rejection

**Common reasons**:
- Missing privacy policy
- Inappropriate content rating
- UI/UX not following guidelines
- Crash on launch

**Solutions**:
- Test thoroughly on real devices
- Follow Apple Human Interface Guidelines
- Include comprehensive metadata
- Provide clear app functionality description

#### Play Store Rejection

**Common reasons**:
- Incorrect target SDK version
- Missing permissions rationale
- Privacy policy issues
- Content rating mismatch

**Solutions**:
- Update `android.compileSdkVersion` to latest
- Add permission descriptions in `app.json`
- Ensure content rating matches actual content

### Performance Issues

#### Large Bundle Size

**Solutions**:
```bash
# Analyze bundle size
npx expo export --dump-assetmap

# Enable Hermes engine (Android)
# Add to app.json:
{
  "expo": {
    "android": {
      "jsEngine": "hermes"
    }
  }
}
```

#### Slow Build Times

**Solutions**:
- Use EAS cache: `"cache": { "disabled": false }`
- Optimize dependencies
- Remove unused assets
- Use `m-large` resource class for complex builds

### Support Resources

- **Expo Docs**: https://docs.expo.dev
- **EAS Build Docs**: https://docs.expo.dev/build/introduction/
- **Apple Developer**: https://developer.apple.com
- **Google Play Console Help**: https://support.google.com/googleplay/android-developer
- **React Native Troubleshooting**: https://reactnative.dev/docs/troubleshooting

---

## Quick Reference Commands

```bash
# Initial setup
eas build:configure
eas credentials

# Development builds
eas build --profile development --platform ios
eas build --profile development --platform android

# Production builds
eas build --profile production --platform all

# Submissions
eas submit --profile production --platform all

# Check build status
eas build:list

# Cancel build
eas build:cancel [build-id]
```

Remember to test thoroughly on real devices before submitting to app stores. Both Apple and Google have strict review processes, so ensure your app meets all guidelines and requirements.

Good luck with your PuzzlePals deployment! 🧩✨