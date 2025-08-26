# PuzzlePals - React Native Expo Jigsaw Puzzle App

PuzzlePals is a delightful, kid-friendly jigsaw puzzle app built with React Native + Expo. This is currently an empty repository with specifications in README.md. The app needs to be built from scratch following the detailed specifications provided.

**ALWAYS reference these instructions first and fallback to search or bash commands only when you encounter unexpected information that does not match the info here.**

## Working Effectively

### CRITICAL: Timeout and Timing Information
- **NEVER CANCEL** any build, test, or installation commands. Always set appropriate timeouts.
- Project creation: 2-3 minutes - Set timeout to 300+ seconds
- Dependency installation: 2-3 minutes total - Set timeout to 300+ seconds  
- Development server startup: 15-30 seconds - Set timeout to 60+ seconds
- Tests: 5-10 seconds - Set timeout to 30+ seconds
- Linting/formatting: 1-2 seconds - Set timeout to 30+ seconds

### Bootstrap the Project (REQUIRED - Repository is Empty)

**Prerequisites:**
- Node.js 20+ (20.19.4 confirmed working)
- Yarn (preferred) or npm
- Current repository only contains README.md with specifications

**Step 1: Create the Expo Project** - NEVER CANCEL, takes 2-3 minutes:
```bash
# In the repository root (not a subdirectory)
npx create-expo-app@latest . --template blank-typescript
# This creates the basic Expo TypeScript project structure
```

**Step 2: Install Core Dependencies** - NEVER CANCEL, takes 2-3 minutes:
```bash
yarn add zustand @tanstack/react-query @react-navigation/native @react-navigation/native-stack react-native-gesture-handler react-native-reanimated react-native-safe-area-context react-native-screens expo-haptics expo-av react-native-mmkv i18next react-i18next react-native-localize react-native-svg
```

**Step 3: Install Expo SDK Compatible Versions** - CRITICAL for compatibility:
```bash
npx expo install react-native-gesture-handler@~2.24.0 react-native-reanimated@~3.17.4 react-native-safe-area-context@5.4.0 react-native-screens@~4.11.1 react-native-svg@15.11.2
```

**Step 4: Install Web Support Dependencies**:
```bash
npx expo install react-dom react-native-web @expo/metro-runtime
```

**Step 5: Install Development Dependencies**:
```bash
yarn add -D jest @testing-library/react-native ts-jest @types/jest eslint prettier @typescript-eslint/eslint-plugin @typescript-eslint/parser react-test-renderer@19.0.0 @eslint/eslintrc
```

**Step 6: Configure Development Tools**:

Create `jest.config.js`:
```javascript
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testMatch: [
    '**/__tests__/**/*.(js|jsx|ts|tsx)',
    '**/*.(test|spec).(js|jsx|ts|tsx)',
  ],
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx'],
  collectCoverageFrom: ['src/**/*.{ts,tsx,js,jsx}', '!src/**/*.d.ts'],
};
```

Create `eslint.config.js` (ESLint v9 flat config):
```javascript
const ts = require('@typescript-eslint/eslint-plugin');
const tsParser = require('@typescript-eslint/parser');

module.exports = [
  {
    files: ['**/*.{js,jsx,ts,tsx}'],
    languageOptions: {
      parser: tsParser,
      ecmaVersion: 2020,
      sourceType: 'module',
      parserOptions: {
        ecmaFeatures: { jsx: true },
      },
      globals: {
        console: 'readonly', process: 'readonly', Buffer: 'readonly',
        __dirname: 'readonly', __filename: 'readonly', global: 'readonly',
        module: 'readonly', require: 'readonly', exports: 'readonly',
      },
    },
    plugins: { '@typescript-eslint': ts },
    rules: {
      '@typescript-eslint/no-unused-vars': 'warn',
      '@typescript-eslint/no-explicit-any': 'warn',
    },
  },
  { ignores: ['node_modules/', '.expo/', 'dist/', 'build/'] },
];
```

Create `.prettierrc.js`:
```javascript
module.exports = {
  semi: true,
  trailingComma: 'es5',
  singleQuote: true,
  printWidth: 80,
  tabWidth: 2,
};
```

Update `package.json` scripts section:
```json
"scripts": {
  "start": "expo start",
  "android": "expo start --android",
  "ios": "expo start --ios", 
  "web": "expo start --web",
  "test": "jest",
  "test:watch": "jest --watch",
  "lint": "eslint . --ext .js,.jsx,.ts,.tsx",
  "lint:fix": "eslint . --ext .js,.jsx,.ts,.tsx --fix",
  "format": "prettier --write ."
}
```

## Build, Test, and Lint Commands

### Development Server
- **Web development**: `npx expo start --web --offline`
  - Starts in 15-30 seconds, set timeout to 60+ seconds
  - Runs on http://localhost:19006 (or next available port)
  - **NEVER CANCEL** - Wait for "Webpack compiled successfully" message

### Testing  
- **Run all tests**: `yarn test` - takes 5-10 seconds
- **Watch mode**: `yarn test:watch`  
- **IMPORTANT**: Use `ts-jest` preset, NOT `jest-expo` (has compatibility issues)
- Tests are fast, but set timeout to 30+ seconds to be safe

### Linting and Formatting
- **Lint code**: `yarn lint` - takes 1-2 seconds, set timeout to 30+ seconds
- **Fix lint issues**: `yarn lint:fix` 
- **Format code**: `yarn format` - takes 1-2 seconds
- **ALWAYS** run these before committing changes

## Validation Scenarios

**ALWAYS** perform these validation steps after making changes:

### 1. Complete Setup Validation
```bash
# Verify all dependencies installed correctly
npx expo install --check
# Should show no dependency issues (offline warnings are normal)
```

### 2. Development Server Test
```bash
# Start web development server
npx expo start --web --offline
# Wait 15-30 seconds, should see "Webpack compiled successfully"
# Open browser to http://localhost:19006 
# Should see default Expo app with "Open up App.tsx to start working"
```

### 3. Test Suite Validation
```bash
# Run tests to ensure framework works
yarn test
# Should pass all tests (starts with 0 tests in empty project)
```

### 4. Code Quality Validation  
```bash
# Verify linting and formatting work
yarn lint && yarn format
# Should complete without errors
```

### 5. Manual Functionality Testing
After implementing features:
- **Puzzle Loading**: Test loading different puzzle packs and images
- **Drag & Drop**: Test piece dragging with smooth animation 
- **Snapping**: Test piece snapping to correct positions
- **Win Detection**: Complete a puzzle and verify celebration triggers
- **Settings**: Test parental gate, sound toggles, difficulty changes
- **Persistence**: Test progress saving and resuming puzzles

### 6. Enhanced Features Testing (Phase 2)
After implementing enhanced features:
- **Hint System**: Test progressive hint levels work correctly
- **Educational Content**: Verify facts and prompts display appropriately  
- **Photo Puzzles**: Test family photo import and puzzle generation
- **Achievements**: Verify unlockables and milestone tracking
- **Sorting**: Test auto-organization of pieces by type
- **Accessibility**: Test voice guidance and motor adaptations
- **Parent Dashboard**: Verify progress tracking and insights accuracy

## Project Structure (After Implementation)

The repository starts empty except for README.md. After setup, implement this structure:

```
├── app/                          # Expo Router screens
│   ├── _layout.tsx              # Root layout
│   ├── index.tsx                # Home screen (puzzle packs)
│   ├── play/[puzzleId].tsx      # Play screen with puzzle canvas  
│   ├── settings.tsx             # Settings with parental gate
│   └── rewards.tsx              # Sticker rewards
├── src/
│   ├── components/              # Reusable UI components
│   │   ├── PuzzleCanvas.tsx     # Main game canvas
│   │   ├── Piece.tsx            # Individual puzzle piece
│   │   ├── HUD.tsx              # Game controls (hint, reset)
│   │   └── PackCard.tsx         # Puzzle pack tiles
│   ├── engine/                  # Puzzle game logic
│   │   ├── jigsaw.ts            # Core puzzle algorithms
│   │   └── geometry.ts          # Rect calculations, snap detection
│   ├── hooks/                   # Custom React hooks
│   │   ├── usePieceDrag.ts      # Reanimated gesture handling
│   │   └── useHaptics.ts        # Haptic feedback
│   ├── stores/                  # Zustand state management
│   │   ├── game.ts              # Game state (current puzzle)
│   │   └── settings.ts          # App settings (sound, difficulty)
│   ├── services/                # External services
│   │   ├── storage.ts           # Progress persistence (MMKV)
│   │   ├── analytics.ts         # Event tracking (placeholder)
│   │   └── monetization.ts      # IAP/ads (placeholder)
│   ├── types/                   # TypeScript definitions
│   │   └── index.ts             # Core types (Puzzle, Piece, Board)
│   ├── theme/                   # Design system
│   │   └── index.ts             # Colors, spacing, typography
│   └── utils/                   # Helper functions
│       ├── device.ts            # Screen size, safe area helpers
│       └── sound.ts             # Audio playback (expo-av)
├── assets/                      # Static assets
│   ├── packs/                   # Puzzle images by theme
│   ├── sounds/                  # Audio files
│   └── fonts/                   # Custom fonts
└── __tests__/                   # Test files
```

## Architecture Overview

**Tech Stack**: 
- React Native + Expo SDK 53
- TypeScript (strict mode)
- Zustand for state management
- React Navigation or Expo Router
- Reanimated 3 + Gesture Handler for animations
- Jest + Testing Library for testing
- ESLint + Prettier for code quality

**Key Features to Implement**:
- Grid-based puzzle slicing (2×2 to 6×6 pieces)
- Smooth drag & drop with snap detection
- Progress persistence with MMKV
- Haptic feedback and sound effects  
- Multiple difficulty levels
- Kid-friendly UI with large touch targets
- Celebration animations on completion
- Localization support (i18n)
- Parental controls for settings

**Enhanced Features for Future Development**:
- Custom puzzle creation from family photos
- Educational content integration (animal facts, learning prompts)
- Progressive hint system (outline → ghost → piece highlighting)
- Photo sharing for completed puzzles with parental approval
- Avatar customization and kid-friendly personalization
- Seasonal and holiday-themed puzzle content
- Enhanced accessibility (voice guidance, colorblind support)
- Parent dashboard with progress tracking and insights
- Community features with moderated user-generated content
- Advanced piece sorting (edges, corners, color groups)

## Common Issues and Solutions

### Dependency Version Conflicts
- Always use `npx expo install <package>` for Expo-compatible versions
- If conflicts arise, check Expo SDK compatibility guide
- React and react-test-renderer versions must match exactly

### ESLint Configuration
- ESLint v9 requires flat config format (eslint.config.js)
- Do NOT use .eslintrc.* files with ESLint v9
- The provided config works with TypeScript and React Native

### Jest Configuration  
- Use `ts-jest` preset for reliable testing
- `jest-expo` preset has compatibility issues with current setup
- React component testing requires additional setup (not included in basic config)

### Development Server Issues
- Use `--offline` flag to avoid networking restrictions
- Web server typically runs on port 19006
- iOS/Android require physical device or emulator (not available in current environment)

## Frequently Referenced Commands

Quick reference for common operations:

```bash
# Start development (most common)
npx expo start --web --offline

# Run tests before committing  
yarn test && yarn lint && yarn format

# Install new dependency (Expo-compatible)
npx expo install <package-name>

# Check dependency compatibility
npx expo install --check

# Reset Metro cache if issues
npx expo start --clear
```

## Implementation Priority

When implementing the app, follow this sequence:

### Phase 1: Core Foundation
1. **Core Types & Data Models** (src/types/index.ts)
2. **Basic Navigation** (app/ screens)
3. **Puzzle Engine** (src/engine/ - slicing, snapping logic)
4. **Game Components** (src/components/ - Canvas, Pieces)  
5. **State Management** (src/stores/ - game state)
6. **Drag & Drop** (gesture handlers, animations)
7. **UI Polish** (sounds, haptics, celebrations)
8. **Persistence** (progress saving)
9. **Settings & Parental Controls**
10. **Testing & Validation**

### Phase 2: Enhanced Features (Post-MVP)
11. **Advanced Hint System** (progressive hints, smart suggestions)
12. **Educational Content Integration** (facts, learning prompts)
13. **Photo Puzzle Creation** (family photo import with safety controls)
14. **Achievement & Reward System** (unlockables, progress milestones)
15. **Smart Piece Sorting** (edge detection, color grouping)
16. **Seasonal Content System** (holiday puzzles, timed events)
17. **Enhanced Accessibility** (voice guidance, motor adaptations)
18. **Parent Dashboard** (progress tracking, insights)
19. **Photo Sharing Features** (controlled social sharing)
20. **Daily Challenge System** (special puzzles, unique rewards)

**Remember**: This project starts completely empty except for README.md. You must bootstrap the entire Expo project structure before implementing any features. Focus on Phase 1 for initial development, then progressively add Phase 2 features based on user feedback and testing.