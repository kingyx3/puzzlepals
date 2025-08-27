# PuzzlePals - React Native Expo Jigsaw Puzzle App

PuzzlePals is a delightful, kid-friendly jigsaw puzzle app built with React Native + Expo. Designed for tiny hands: big tiles, gentle snapping, celebratory animations, and zero missing pieces. Optimized for children with age-appropriate difficulty levels and engaging, safe gameplay.

This README provides comprehensive specifications for implementing the app from scratch. The repository currently contains only this specification document - the entire app needs to be built following the detailed architecture and requirements provided below.

## Tech Stack

- **React Native + Expo SDK 53** - Cross-platform mobile development
- **TypeScript** (strict mode) - Type safety and better development experience
- **Zustand** - Lightweight state management
- **React Navigation or Expo Router** - App navigation
- **Reanimated 3 + Gesture Handler** - Smooth animations and drag & drop
- **React Query** - Async state management
- **Jest + Testing Library** - Testing framework
- **ESLint + Prettier** - Code quality and formatting

## Key Features

- **Jigsaw Engine**: Converts images into N×M grid tiles with snap-to-target placement and win detection
- **Kid-Safe UX**: Large hit areas, haptic feedback, confetti on completion, no timers by default
- **Multiple Difficulties**: 2×2, 3×3, 4×4, 6×6 grids for ages 3-10+
- **Modular Design**: Easy to add new puzzle packs (animals, vehicles, space)
- **Offline-First**: Assets bundled; future remote packs possible
- **Monetization Ready**: Ad-supported free version + $9.99 premium upgrade
- **Accessibility**: VoiceOver support, large controls, reduced motion mode
- **Localization**: i18n support with RTL mirroring
- **Parental Controls**: Math gate for settings and purchases

## Game Features

### Puzzle Mechanics

- **Grid-based Puzzles**: 4, 9, 16, 25, 36 pieces (2×2 → 6×6 grids) designed for ages 3-10+

- **Smart Snapping**: Pieces snap when within threshold with "magnet" easing animation
- **Hint System**: Show outline, ghost image, or peek functionality
- **Progress Persistence**: Resume unfinished puzzles, track completion times

### User Experience

- **Reward System**: Unlock stickers/badges with animated "you did it!" sequences
- **Sound & Haptics**: Snap sounds, win celebrations, tactile feedback
- **Accessibility**: Large controls, VoiceOver labels, reduced motion support
- **Internationalization**: Multi-language support with RTL layout compatibility
- **Parental Controls**: Math-based gate for settings and purchase access

### Enhanced Game Features

- **Advanced Hint System**: Progressive hint levels from piece outline to ghost image to auto-placement
- **Educational Content**: Animal facts, learning prompts, and vocabulary building integrated with puzzle themes
- **Custom Puzzle Creation**: Turn family photos into puzzles with parental approval and safety controls
- **Smart Sorting**: Auto-organize pieces by edges, corners, colors, or patterns for easier gameplay
- **Achievement System**: Unlock stickers, avatars, and special content based on progress milestones
- **Seasonal Content**: Holiday-themed puzzles and special events throughout the year
- **Photo Sharing**: Share completed puzzle screenshots with family using parental-controlled sharing
- **Voice Guidance**: Audio descriptions and hints for enhanced accessibility support
- **Daily Challenges**: Special daily puzzles with unique rewards to encourage regular engagement

## Project Structure

The recommended project structure after implementation:

```
├── app/                             # Expo Router screens
│   ├── _layout.tsx                  # Root navigation layout
│   ├── index.tsx                    # Home screen (puzzle packs)
│   ├── play/[puzzleId].tsx          # Play screen with puzzle canvas
│   ├── settings.tsx                 # Settings with parental gate
│   ├── rewards.tsx                  # Sticker rewards
│   └── store/                       # Zustand stores (game, settings)
├── src/
│   ├── components/                  # Reusable UI components
│   │   ├── PuzzleCanvas.tsx         # Main game canvas with drag logic
│   │   ├── Piece.tsx                # Individual puzzle piece component
│   │   ├── HUD.tsx                  # Game controls (hint, reset, pause)
│   │   ├── PackCard.tsx             # Puzzle pack tiles
│   │   └── ParentalGate.tsx         # Math-based parental control
│   ├── engine/                      # Puzzle game logic
│   │   ├── jigsaw.ts                # Core puzzle algorithms
│   │   └── geometry.ts              # Rectangle math, snap detection
│   ├── hooks/                       # Custom React hooks
│   │   ├── usePieceDrag.ts          # Reanimated gesture handling
│   │   └── useHaptics.ts            # Haptic feedback integration
│   ├── stores/                      # Zustand state management
│   │   ├── game.ts                  # Game state (current puzzle)
│   │   └── settings.ts              # App settings (sound, difficulty)
│   ├── services/                    # External services
│   │   ├── storage.ts               # Progress persistence (MMKV)
│   │   ├── analytics.ts             # Event tracking (placeholder)
│   │   └── monetization.ts          # IAP/ads (placeholder)
│   ├── i18n/                        # Internationalization
│   │   ├── index.ts                 # i18next configuration
│   │   ├── en.json                  # English translations
│   │   └── zh.json                  # Chinese translations
│   ├── theme/                       # Design system
│   │   └── index.ts                 # Colors, spacing, typography
│   ├── types/                       # TypeScript definitions
│   │   └── index.ts                 # Core types (Puzzle, Piece, Board)
│   └── utils/                       # Helper functions
│       ├── device.ts                # Screen size, safe area helpers
│       └── sound.ts                 # Audio playback (expo-av)
├── assets/                          # Static assets
│   ├── packs/                       # Puzzle images by theme
│   │   ├── animals/*.jpg            # Animal puzzle images
│   │   └── vehicles/*.jpg           # Vehicle puzzle images
│   ├── sounds/                      # Audio files (snap, win sounds)
│   └── fonts/                       # Custom fonts
├── __tests__/                       # Test files
└── README.md                        # Project documentation
```

**Note:** If you prefer React Navigation over Expo Router, swap the `app/` routing structure for `src/navigation/*` and create an `App.tsx` entrypoint. The rest of the structure remains the same.

## Quick Start

### Prerequisites

- **Node.js 20+** (version 20.19.4 confirmed working)
- **Yarn or npm** (Yarn recommended for faster installs)

### Project Setup

**Step 1: Create Expo Project**

```bash
# In the repository root directory
npx create-expo-app@latest . --template blank-typescript
```

**Step 2: Install Core Dependencies**

```bash
yarn add zustand @tanstack/react-query @react-navigation/native \
  @react-navigation/native-stack react-native-gesture-handler \
  react-native-reanimated react-native-safe-area-context \
  react-native-screens expo-haptics expo-av react-native-mmkv \
  i18next react-i18next react-native-localize react-native-svg
```

**Step 3: Install Expo SDK Compatible Versions**

```bash
npx expo install react-native-gesture-handler@~2.24.0 \
  react-native-reanimated@~3.17.4 react-native-safe-area-context@5.4.0 \
  react-native-screens@~4.11.1 react-native-svg@15.11.2
```

**Step 4: Install Development Dependencies**

```bash
yarn add -D jest @testing-library/react-native ts-jest @types/jest \
  eslint prettier @typescript-eslint/eslint-plugin \
  @typescript-eslint/parser react-test-renderer@19.0.0 @eslint/eslintrc
```

**Step 5: Start Development**

```bash
# For web development (recommended for testing)
npx expo start --web --offline

# For iOS/Android (requires simulator/device)
yarn ios    # iOS
yarn android # Android
```

> **Note:** Expo config plugins for Reanimated + Gesture Handler are automatically configured with SDK >= 51

## Data Models

### Core TypeScript Types

```typescript
// src/types/index.ts
export type Difficulty = 'AGES_3_5' | 'AGES_6_8' | 'AGES_9_10' | 'AGES_11_PLUS'; // 2x2, 3x3, 4x4, 6x6

export interface PuzzlePack {
  id: string; // e.g. 'animals'
  titleKey: string; // i18n key
  coverAsset: number; // require('.../cover.jpg')
  puzzles: PuzzleMeta[];
}

export interface PuzzleMeta {
  id: string; // 'animals-lion'
  titleKey: string; // 'puzzles.lion'
  imageAsset: number; // require('.../lion.jpg')
  defaultDifficulty: Difficulty;
}

export interface Piece {
  id: string;
  col: number; // target col (0..cols-1)
  row: number; // target row (0..rows-1)
  x: number;
  y: number; // current pixel position in canvas coords
  width: number;
  height: number;
  placed: boolean;
}

export interface BoardState {
  cols: number;
  rows: number;
  width: number;
  height: number;
  pieces: Record<string, Piece>;
  ghostOpacity: number; // for hints
}

export interface Progress {
  puzzleId: string;
  difficulty: Difficulty;
  placedCount: number;
  startedAt: number;
  completedAt?: number;
}
```

## Jigsaw Engine Architecture

### Core Puzzle Logic

**Grid Slicing Process:**

1. Choose `cols × rows` grid dimensions based on difficulty level
2. Compute tile rectangles (target positions) for each grid cell
3. Create `Piece` instances with shuffled starting positions around staging area
4. Render each piece using `<Image>` component clipped with SVG mask or react-native-svg

### Drag & Drop Mechanics

**Implementation Approach:**

- Use `react-native-gesture-handler` + `Reanimated` for smooth interactions
- On gesture release: check if piece center is within `SNAP_THRESHOLD` pixels of target
- If within threshold: snap to target position and mark `placed = true`
- Provide haptic feedback and sound effects on successful snap

### Win Detection

**Celebration Sequence Triggered when `placedCount === cols × rows`:**

- **Visual Effects**: Confetti animation (Lottie or particle spray)
- **Audio**: Victory sound effect
- **Rewards**: Unlock new stickers/badges
- **Persistence**: Save completion data and progress

## State Management

### Zustand Game Store

```typescript
// app/store/game.ts
import { create } from 'zustand';
import { BoardState, Difficulty, PuzzleMeta } from '@/src/types';

interface GameStore {
  current?: {
    puzzle: PuzzleMeta;
    difficulty: Difficulty;
    board: BoardState;
  };
  startPuzzle: (
    puzzle: PuzzleMeta,
    difficulty: Difficulty,
    size: { w: number; h: number }
  ) => void;
  movePiece: (id: string, x: number, y: number) => void;
  placePieceIfSnapped: (id: string) => boolean;
  reset: () => void;
}

export const useGame = create<GameStore>((set, get) => ({
  startPuzzle: (puzzle, difficulty, size) => {
    const { cols, rows } = diffToGrid(difficulty);
    const board = createBoard(puzzle.imageAsset, cols, rows, size.w, size.h);
    set({ current: { puzzle, difficulty, board } });
  },

  movePiece: (id, x, y) =>
    set((state) => {
      if (!state.current) return state;
      state.current.board.pieces[id].x = x;
      state.current.board.pieces[id].y = y;
      return { ...state };
    }),

  placePieceIfSnapped: (id) => {
    const state = get();
    if (!state.current) return false;
    const piece = state.current.board.pieces[id];
    const snapped = isWithinSnapThreshold(piece, state.current.board);
    if (snapped) {
      snapToTarget(piece, state.current.board);
      return true;
    }
    return false;
  },

  reset: () => set({ current: undefined }),
}));

// Helper functions (implementation details to be completed)
function diffToGrid(difficulty: Difficulty) {
  // AGES_3_5 -> 2x2, AGES_6_8 -> 3x3, AGES_9_10 -> 4x4, AGES_11_PLUS -> 6x6
  const gridMap = {
    AGES_3_5: { cols: 2, rows: 2 },
    AGES_6_8: { cols: 3, rows: 3 },
    AGES_9_10: { cols: 4, rows: 4 },
    AGES_11_PLUS: { cols: 6, rows: 6 },
  };
  return gridMap[difficulty];
}

function createBoard(
  imageAsset: number,
  cols: number,
  rows: number,
  width: number,
  height: number
): BoardState {
  // TODO: Implement board creation logic
  return {} as BoardState;
}

function isWithinSnapThreshold(piece: any, board: BoardState): boolean {
  // TODO: Implement snap threshold detection
  return false;
}

function snapToTarget(piece: any, board: BoardState): void {
  // TODO: Implement snap animation to target position
}
```

## Core Components

### PuzzleCanvas.tsx

**Responsibilities:**

- Accept `BoardState` and render background ghost image (optional)
- Render all puzzle pieces with proper positioning
- Calculate layout based on device dimensions and safe areas
- Provide snap threshold configuration via React Context

### Piece.tsx

**Functionality:**

- Render individual puzzle piece using clipped bitmap
- Attach `PanGestureHandler` for drag interactions
- On gesture end: call `placePieceIfSnapped(id)` to check snap
- Animate to target position using Reanimated `withTiming`

### HUD.tsx

**Features:**

- **Control Buttons**: Hint, Reset, Home navigation
- **Optional Timer**: Display elapsed time (can be disabled for younger kids)
- **Hint System**: Toggle ghost image opacity for 5 seconds on hint activation

## App Screens

### Home Screen (Puzzle Packs + Continue)

Acceptance Criteria

Shows list of Puzzle Packs with cover art and “Play” buttons.

“Continue” appears if unfinished progress exists.

Tap pack → list of puzzles with difficulty selector.

Play (canvas)

Acceptance Criteria

Renders board at max fit; pieces start shuffled around edges.

Drag piece: smooth, no jitter; snap when close to target.

Haptics on snap.

“Hint” overlays ghost background at 50% for 5s.

On completion: confetti + sticker unlock + save progress.

Settings (parental gate)

Acceptance Criteria

Parental gate (simple sum/difference).

Toggles: sound, music, reduced motion, language.

Difficulty default.

// app/play/[puzzleId].tsx
import { View } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useGame } from '../store/game';
import PuzzleCanvas from '@/src/components/PuzzleCanvas';
import HUD from '@/src/components/HUD';

export default function PlayScreen() {
const { puzzleId } = useLocalSearchParams<{ puzzleId: string }>();
const { top } = useSafeAreaInsets();
const game = useGame();

const handleLayout = (event: any) => {
const { width, height } = event.nativeEvent.layout;
// TODO: Load puzzle metadata by ID and call startPuzzle
// startPuzzle(meta, defaultDifficulty, { w: width, h: height - 80 })
};

return (
<View
style={{ flex: 1, paddingTop: top }}
onLayout={handleLayout} >
{game.current && <PuzzleCanvas board={game.current.board} />}
<HUD />
</View>
);
}

````

## Internationalization (i18n)

### Setup & Configuration

**Libraries Used:** `i18next` + `react-i18next` + `react-native-localize`

**Translation Files:** `/src/i18n/en.json`, `/src/i18n/zh.json`

```typescript
// src/i18n/index.ts
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import * as RNLocalize from 'react-native-localize';
import en from './en.json';
import zh from './zh.json';

i18n.use(initReactI18next).init({
  compatibilityJSON: 'v4',
  resources: {
    en: { translation: en },
    zh: { translation: zh }
  },
  lng: RNLocalize.getLocales()[0]?.languageCode ?? 'en',
  fallbackLng: 'en',
  interpolation: { escapeValue: false },
});

export default i18n;
````

## Accessibility Features

### Core Accessibility Support

- **VoiceOver/TalkBack**: All buttons and pieces include `accessibilityLabel` and `accessible` props
- **Reduced Motion**: Disable confetti and large animations when user has enabled reduced motion
- **Touch Targets**: Minimum 44×44 point touch targets for all interactive elements
- **Color Contrast**: Contrast-safe color palette for visual accessibility
- **RTL Support**: Right-to-left layout mirroring via `I18nManager`

## Progress Persistence

### Storage Strategy

- **Primary**: MMKV for fast, synchronous storage
- **Fallback**: AsyncStorage for broader compatibility
- **Key Pattern**: `progress:<puzzleId>:<difficulty>` → `Progress` object

## Audio & Haptics

### Sound Effects

- **Library**: `expo-av` for loading and playing short `.wav` files
- **Events**: Snap confirmation sound, puzzle completion celebration

### Haptic Feedback

- **Library**: `expo-haptics`
- **Snap Feedback**: `selectionAsync()` on successful piece snap
- **Win Celebration**: `notificationAsync('success')` on puzzle completion

## Analytics Integration

### Event Tracking Framework

```typescript
// src/services/analytics.ts
export const Analytics = {
  track(event: string, props?: Record<string, any>) {
    // TODO: Integrate with Amplitude/Segment/GA4
    if (__DEV__) console.log('[analytics]', event, props);
  },
};
```

**Key Events to Track:**

- `PuzzleStarted`
- `PiecePlaced`
- `PuzzleCompleted`
- `HintUsed`
- `SettingsChanged`

## Monetization Strategy

### Revenue Model

- **Free Tier**: Base puzzle pack with ads displayed in menus only (never during gameplay)
- **Premium Upgrade**: One-time $9.99 purchase removes ads + unlocks additional puzzle packs
- **Parental Gate**: Math-based verification required before any purchase

### Implementation Placeholders

```typescript
// src/services/monetization.ts
export async function purchasePremium(): Promise<void> {
  // TODO: Handle $9.99 premium upgrade via app store
}

export async function purchasePack(packId: string): Promise<void> {
  // TODO: Handle individual pack purchases
}

export async function restorePurchases(): Promise<void> {
  // TODO: Restore previous purchases
}

export async function showAd(): Promise<void> {
  // TODO: Display interstitial ad in menu screens only
}
```

## Design System

### Theme Configuration

```typescript
// src/theme/index.ts
export const theme = {
  colors: {
    background: '#FFFDF7',
    primary: '#6B9EFF',
    accent: '#FFB86B',
    text: '#1E1E1E',
    muted: '#9AA0A6',
  },
  spacing: (n: number) => n * 8,
  radius: { sm: 8, md: 16, lg: 24 },
};
```

## Testing & Development

### Test Setup

**Development Dependencies:**

```bash
yarn add -D jest @testing-library/react-native jest-expo ts-jest @types/jest
```

### Testing Strategy

- **Unit Tests**: Test `engine/jigsaw.ts` functions (slice, shuffle, snap detection)
- **Component Tests**: Test `Piece.tsx` drag & drop interactions
- **Accessibility Tests**: Verify labels and accessibility properties are present

**Example Test:**

```typescript
// __tests__/engine.test.ts
import { computeTargetRects, isWithinSnapThreshold } from '@/src/engine/jigsaw';

test('piece snaps when within threshold', () => {
  // TODO: Create test board and piece, move piece near target, expect snap
});
```

### Code Quality

**Linting & Formatting:**

- **ESLint**: React Native configuration with TypeScript support
- **TypeScript**: Strict mode enabled for better type safety
- **Prettier**: Code formatting consistency

**CI/CD:**

- **GitHub Actions**: Use `expo/expo-github-action` to run Jest tests and `expo doctor`

### Build & Release

**Production Builds:**

- **EAS Build**: Configure iOS/Android builds in `eas.json`
- **Code Signing**: Use app signing and store credentials in EAS
- **Assets**: Add app icons and splash screens in `app.json`

## Development Guidance

### Copilot Implementation Checklist

**Core Engine (`engine/jigsaw.ts`):**

- [ ] `computeTargetRects(cols, rows, width, height)` - Calculate grid positions
- [ ] `createPiecesFromRects(imageAsset, rects)` - Generate puzzle pieces
- [ ] `shufflePieces(pieces)` - Randomize starting positions
- [ ] `isWithinSnapThreshold(piece, board)` - Detect snap proximity
- [ ] `snapToTarget(piece, board)` - Animate piece to target

**Drag & Drop (`components/Piece.tsx`):**

- [ ] Implement `PanGestureHandler` with Reanimated position tracking
- [ ] On gesture end → check snap threshold and animate to target

**Navigation (`app/index.tsx`):**

- [ ] Load puzzle packs from assets and render `PackCard` list
- [ ] Show "Continue" button if saved progress exists

**Data Persistence (`services/storage.ts`):**

- [ ] `saveProgress(progress)` - Store puzzle state
- [ ] `getProgress(puzzleId, difficulty)` - Load saved state

### Sample Asset Structure

```typescript
// src/data/packs.ts
import { PuzzlePack } from '@/src/types';

export const AnimalsPack: PuzzlePack = {
  id: 'animals',
  titleKey: 'packs.animals',
  coverAsset: require('../../assets/packs/animals/cover.jpg'),
  puzzles: [
    {
      id: 'animals-lion',
      titleKey: 'puzzles.lion',
      imageAsset: require('../../assets/packs/animals/lion.jpg'),
      defaultDifficulty: 'AGES_3_5',
      educationalContent: {
        facts: ['Lions live in groups called prides', 'Male lions have manes'],
        vocabulary: ['pride', 'mane', 'savanna'],
        learningPrompts: [
          'What sound does a lion make?',
          'Where do lions live?',
        ],
      },
    },
    {
      id: 'animals-panda',
      titleKey: 'puzzles.panda',
      imageAsset: require('../../assets/packs/animals/panda.jpg'),
      defaultDifficulty: 'AGES_6_8',
      educationalContent: {
        facts: [
          'Pandas eat bamboo all day',
          'Baby pandas are very small when born',
        ],
        vocabulary: ['bamboo', 'habitat', 'endangered'],
        learningPrompts: [
          'What do pandas like to eat?',
          'What colors are pandas?',
        ],
      },
    },
  ],
};

// Enhanced types for educational content
export interface EducationalContent {
  facts: string[];
  vocabulary: string[];
  learningPrompts: string[];
  ageAppropriate?: boolean;
}

export interface PuzzleMeta {
  id: string;
  titleKey: string;
  imageAsset: number;
  defaultDifficulty: Difficulty;
  educationalContent?: EducationalContent;
  seasonal?: boolean;
  customCreated?: boolean;
}
```

### Enhanced Hint System Implementation

```typescript
// src/components/HintSystem.tsx
import { useState } from 'react';
import { View, TouchableOpacity, Text } from 'react-native';

export type HintLevel = 'outline' | 'ghost' | 'highlight' | 'autoplace';

interface HintSystemProps {
  currentLevel: HintLevel;
  onHintRequest: (level: HintLevel) => void;
  cooldownMs?: number;
}

export function HintSystem({ currentLevel, onHintRequest, cooldownMs = 30000 }: HintSystemProps) {
  const [cooldownActive, setCooldownActive] = useState(false);

  const requestHint = (level: HintLevel) => {
    if (cooldownActive) return;

    onHintRequest(level);
    setCooldownActive(true);

    setTimeout(() => setCooldownActive(false), cooldownMs);
  };

  const hintLevels: Array<{ level: HintLevel; label: string; description: string }> = [
    { level: 'outline', label: 'Show Outline', description: 'See piece shapes' },
    { level: 'ghost', label: 'Ghost Image', description: 'See faded picture' },
    { level: 'highlight', label: 'Highlight Piece', description: 'Find next piece' },
    { level: 'autoplace', label: 'Auto Place', description: 'Place one piece' },
  ];

  return (
    <View style={{ flexDirection: 'row', gap: 8 }}>
      {hintLevels.map(({ level, label }) => (
        <TouchableOpacity
          key={level}
          onPress={() => requestHint(level)}
          disabled={cooldownActive}
          style={{
            padding: 12,
            backgroundColor: cooldownActive ? '#ccc' : '#6B9EFF',
            borderRadius: 8,
            opacity: cooldownActive ? 0.5 : 1,
          }}
        >
          <Text style={{ color: 'white', fontWeight: 'bold' }}>{label}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}
```

## Technical Implementation Details

### Drag & Drop Implementation

**Core Approach:**

- Use absolute positioning for pieces within a fixed canvas container
- Store target rectangles `(x, y, w, h)` for each grid cell `(row, col)`
- During drag: clamp piece movement within canvas boundaries
- On gesture release: compute distance to target center and snap if within threshold
- When placed: disable hit testing for that piece to prevent accidental re-dragging

Roadmap

Interlocking puzzle edges (non-rectangular, Bezier masks).

Level editor (turn kid’s photo into puzzle).

## Future Roadmap

### Core V1 Features

- **Advanced Piece Shapes**: Interlocking puzzle edges with non-rectangular Bezier curve masks
- **User-Generated Content**: Level editor allowing kids to turn their photos into puzzles
- **Cloud Content**: Remote puzzle packs with CDN-based content delivery
- **Multiplayer**: Cooperative mode for two players on tablet devices

### Enhanced Learning & Engagement Features

- **Educational Integration**:
  - Animal facts and information cards when completing nature puzzles
  - Learning prompts and vocabulary building for age-appropriate content
  - Counting practice integration (count pieces as they're placed)
  - Color and shape recognition activities

- **Advanced Hint System**:
  - Progressive hint levels: piece outline → ghost image → piece highlighting → auto-place
  - Smart hints that adapt to child's skill level
  - Hint cooldown system to encourage independent problem solving

- **Customization & Personalization**:
  - Custom puzzle creation from family photos with parental approval
  - Kid-friendly avatar system with unlockable accessories
  - Personalized backgrounds and themed interfaces
  - Custom difficulty settings beyond standard grid sizes

- **Social & Family Features**:
  - Photo sharing of completed puzzles with parental controls
  - Family profiles with multiple child accounts
  - Achievement sharing and milestone celebrations
  - Parent-child collaborative puzzle modes

- **Content Expansion**:
  - Seasonal and holiday-themed puzzle collections
  - Daily challenge puzzles with special rewards
  - Progressive content unlock based on skill development
  - Community-generated puzzles with moderation

- **Enhanced Accessibility**:
  - Voice guidance and audio descriptions for pieces
  - Colorblind support with pattern overlays
  - Motor accessibility with larger controls and simplified interactions
  - One-handed mode for children with motor disabilities

- **Parent Dashboard**:
  - Progress tracking and skill development insights
  - Screen time controls and healthy usage recommendations
  - Difficulty progression suggestions based on performance
  - Learning milestone notifications

- **Advanced Technical Features**:
  - Cloud sync across family devices
  - Offline content packs for travel
  - AI-powered difficulty adaptation
  - Performance analytics and optimization

## License

MIT © PuzzlePals Contributors

## Development Utilities

### Geometry Helper Functions

````typescript src/engine/geometry.ts
export type Rect = { x: number; y: number; w: number; h: number };

export function computeTargetRects(cols: number, rows: number, width: number, height: number): Rect[] {
  const cellW = Math.floor(width / cols);
  const cellH = Math.floor(height / rows);
  const rects: Rect[] = [];
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      rects.push({ x: c * cellW, y: r * cellH, w: cellW, h: cellH });
    }
  }
  return rects;
}

Developer Notes

Use the latest Expo SDK and libraries when installing (don’t pin versions unless required).


### Configuration Notes

**Development Best Practices:**
- Use the latest Expo SDK and libraries when installing (avoid pinning versions unless required)
- Enable Reanimated plugin in `babel.config.js` for gesture handling

**Babel Configuration for Reanimated:**
```javascript
// babel.config.js
module.exports = function(api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: ['react-native-reanimated/plugin'],
  };
};
````

**Gesture Handler Setup:**
Ensure `react-native-gesture-handler` is imported at the app entry point for proper initialization.

---

_This comprehensive specification provides all the technical details needed to implement PuzzlePals from scratch. Follow the architecture, use the provided code examples, and implement features incrementally following the priority order outlined in the copilot instructions._
