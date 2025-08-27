#!/bin/bash

# Version bump script for PuzzlePals
# Usage: ./scripts/bump-version.sh [patch|minor|major]

set -e

VERSION_TYPE=${1:-patch}

echo "🚀 Bumping $VERSION_TYPE version..."

# Update package.json version
npm version $VERSION_TYPE --no-git-tag-version

# Get new version
NEW_VERSION=$(node -p "require('./package.json').version")
echo "📝 New version: $NEW_VERSION"

# Update app.json version
if [[ "$OSTYPE" == "darwin"* ]]; then
    # macOS
    sed -i '' "s/\"version\": \".*\"/\"version\": \"$NEW_VERSION\"/" app.json
else
    # Linux
    sed -i "s/\"version\": \".*\"/\"version\": \"$NEW_VERSION\"/" app.json
fi

# Increment build numbers
echo "📱 Incrementing build numbers..."

# Get current iOS buildNumber
CURRENT_IOS_BUILD=$(node -p "
  const config = require('./app.json');
  config.expo.ios && config.expo.ios.buildNumber || '1'
")

# Get current Android versionCode  
CURRENT_ANDROID_VERSION=$(node -p "
  const config = require('./app.json');
  config.expo.android && config.expo.android.versionCode || 1
")

NEW_IOS_BUILD=$((CURRENT_IOS_BUILD + 1))
NEW_ANDROID_VERSION=$((CURRENT_ANDROID_VERSION + 1))

# Update iOS buildNumber
if [[ "$OSTYPE" == "darwin"* ]]; then
    sed -i '' "s/\"buildNumber\": \".*\"/\"buildNumber\": \"$NEW_IOS_BUILD\"/" app.json
    sed -i '' "s/\"versionCode\": [0-9]*/\"versionCode\": $NEW_ANDROID_VERSION/" app.json
else
    sed -i "s/\"buildNumber\": \".*\"/\"buildNumber\": \"$NEW_IOS_BUILD\"/" app.json
    sed -i "s/\"versionCode\": [0-9]*/\"versionCode\": $NEW_ANDROID_VERSION/" app.json
fi

echo "✅ Version bumped to $NEW_VERSION"
echo "📱 iOS build number: $NEW_IOS_BUILD"  
echo "🤖 Android version code: $NEW_ANDROID_VERSION"
echo ""
echo "Next steps:"
echo "1. Review changes: git diff"
echo "2. Test app: yarn test && yarn lint"
echo "3. Commit changes: git add . && git commit -m 'Bump version to $NEW_VERSION'"
echo "4. Create tag: git tag v$NEW_VERSION"
echo "5. Build: eas build --platform all --profile production"