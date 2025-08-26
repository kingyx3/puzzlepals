# PuzzlePals - Copilot Instructions

## Project Overview
PuzzlePals is a delightful, kid-friendly jigsaw puzzle app built with React Native + Expo. This app is designed for tiny hands with big tiles, gentle snapping mechanics, celebratory animations, and a safe, engaging experience for children.

## Tech Stack
- **Framework**: Expo (React Native + TypeScript)
- **State Management**: Zustand
- **Navigation**: Expo Router
- **Animations**: React Native Reanimated
- **Gestures**: React Native Gesture Handler
- **Storage**: MMKV (with AsyncStorage fallback)
- **Localization**: i18next + react-i18next
- **Testing**: Jest + React Native Testing Library
- **Audio**: Expo AV
- **Haptics**: Expo Haptics

## Architecture Guidelines

### Project Structure
```
apps/puzzlepals/
├─ app/                           # Expo Router screens
│  ├─ _layout.tsx                 # Root navigation layout
│  ├─ index.tsx                   # Home screen (packs, continue)
│  ├─ play/[puzzleId].tsx         # Play screen with canvas
│  ├─ settings.tsx                # Parent settings
│  ├─ rewards.tsx                 # Sticker book/badges
│  └─ store/                      # Zustand stores
├─ src/
│  ├─ components/                 # Reusable components
│  │  ├─ PuzzleCanvas.tsx         # Main game canvas
│  │  ├─ Piece.tsx                # Individual puzzle piece
│  │  ├─ HUD.tsx                  # Game interface
│  │  ├─ PackCard.tsx             # Pack selection card
│  │  └─ ParentalGate.tsx         # Safety gate
│  ├─ engine/                     # Core game logic
│  │  ├─ jigsaw.ts                # Puzzle engine
│  │  └─ geometry.ts              # Math utilities
│  ├─ hooks/                      # Custom hooks
│  ├─ i18n/                       # Internationalization
│  ├─ types/                      # TypeScript definitions
│  ├─ utils/                      # Utility functions
│  └─ services/                   # External services
├─ assets/                        # Images, sounds, fonts
└─ __tests__/                     # Test files
```

### Core Types
Always use these TypeScript interfaces:
- `Difficulty`: 'EASY' | 'MEDIUM' | 'HARD' | 'EXPERT' (2x2, 3x3, 4x4, 6x6)
- `PuzzlePack`: Contains id, titleKey, coverAsset, puzzles array
- `PuzzleMeta`: Individual puzzle metadata
- `Piece`: Individual puzzle piece with position, placement status
- `BoardState`: Complete game board state
- `Progress`: Save/resume functionality

### Key Features to Implement

#### 1. Jigsaw Engine (`src/engine/jigsaw.ts`)
- Grid-based slicing (2x2 to 6x6 pieces)
- Piece shuffling with staging area
- Snap-to-target detection with configurable threshold
- Win condition detection
- Progress saving/loading

#### 2. Drag & Drop System
- Use React Native Gesture Handler + Reanimated
- Smooth piece movement with haptic feedback
- Snap animation when piece is close to target
- Visual feedback for successful placement

#### 3. Kid-Friendly UX
- Large touch areas (minimum 44x44pt)
- Haptic feedback on interactions
- Celebration animations on completion
- Ghost hint system (overlay background image)
- No timers by default (stress-free gameplay)

#### 4. Accessibility
- VoiceOver labels for all interactive elements
- Reduced motion support
- High contrast colors
- RTL language support

## Development Guidelines

### Code Style
- Use TypeScript strict mode
- Prefer functional components with hooks
- Use Zustand for state management (avoid prop drilling)
- Keep components small and focused
- Add comprehensive JSDoc comments for complex functions

### Performance Considerations
- Use React.memo for components that render frequently
- Optimize Reanimated worklets for smooth 60fps animations
- Lazy load puzzle images and assets
- Use MMKV for fast storage operations

### Testing Strategy
- Unit tests for engine/jigsaw.ts (core game logic)
- Component tests for interactive elements
- Accessibility snapshot tests
- Integration tests for game flow

### Asset Management
- Bundle core assets with app
- Support for future remote pack loading
- Optimize images for mobile (WebP when possible)
- Include placeholder/loading states

### Internationalization
- Use i18next with proper pluralization
- Support RTL languages
- Keep all user-facing text in translation files
- Test with pseudo-localization

### Security & Safety
- Implement parental gate for settings/purchases
- No external links without parental consent
- COPPA-compliant data handling
- Safe, age-appropriate content only

## Common Patterns

### Zustand Store Pattern
```typescript
export const useGameStore = create<GameStore>((set, get) => ({
  // State
  currentPuzzle: null,
  
  // Actions
  startPuzzle: (puzzle, difficulty) => {
    // Implementation
  },
  
  // Computed values via get()
  isCompleted: () => get().placedPieces === get().totalPieces,
}));
```

### Component Structure
```typescript
interface ComponentProps {
  // Always define prop interfaces
}

export const Component: React.FC<ComponentProps> = ({ prop }) => {
  // Use hooks at top
  const store = useGameStore();
  
  // Event handlers
  const handleAction = useCallback(() => {
    // Implementation
  }, [dependencies]);
  
  // Render
  return (
    <View accessible accessibilityLabel="Descriptive label">
      {/* Content */}
    </View>
  );
};
```

### Animation Pattern
```typescript
const animatedValue = useSharedValue(0);

const animatedStyle = useAnimatedStyle(() => ({
  transform: [{ translateX: animatedValue.value }],
}));

// Trigger animation
const startAnimation = () => {
  animatedValue.value = withSpring(targetValue);
};
```

## Error Handling
- Always handle async operations with try/catch
- Provide graceful fallbacks for failed operations
- Log errors appropriately (dev vs production)
- Show kid-friendly error messages when needed

## Performance Targets
- 60fps animations during gameplay
- < 3 second app startup time
- < 1 second puzzle loading time
- Smooth scrolling in pack selection

## Monetization Considerations (Future)
- IAP-ready architecture
- Ad-free gameplay experience
- Parental gate for all purchases
- COPPA-compliant implementation

Remember: This is a kids' app, so prioritize safety, simplicity, and joy in every implementation decision.
=======
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

**Remember**: This project starts completely empty except for README.md. You must bootstrap the entire Expo project structure before implementing any features.
