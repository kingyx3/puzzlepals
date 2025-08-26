PuzzlePals — React Native (Expo) Jigsaw Puzzles for Kids

A delightful, kid-friendly jigsaw puzzle app built with React Native + Expo. Designed for tiny hands: big tiles, gentle snapping, celebratory animations, and zero missing pieces. This README is written to be Copilot-friendly—it specifies architecture, components, types, and acceptance criteria so Copilot can scaffold the app quickly.

Tech stack: Expo (React Native + TypeScript), Zustand for state, React Navigation, Reanimated for smooth drag & drop, React Query for async, Jest + Testing Library.
Monetization ready (IAP/ads), localization (i18n), analytics hooks, and parental gate included.

Goals (for Copilot)

Build a jigsaw engine that turns images into N×M tiles with snap-to-target placement and win detection.

Kid-safe UX: large hit areas, haptic feedback, confetti on completion, no timers by default.

Modular design for adding new puzzle packs (animals, vehicles, space).

Offline-first: assets bundled; future remote packs possible.

Features

Jigsaws: 4, 9, 16, 25, 36 pieces (2×2 → 6×6 grids).

Snapping: piece snaps when within threshold; supports “magnet” easing.

Hint modes: show outline, ghost image, or peek.

Progress saving: resume unfinished puzzle; track best time (optional).

Rewards: stickers/badges; animated “you did it!” sequence.

Accessibility: large controls, VoiceOver labels, reduced motion mode.

Localization: i18n with pluralization; RTL-safe.

Parental gate: math gate for settings/purchases.

Project Structure
apps/puzzlepals/
├─ app/
│  ├─ _layout.tsx                  # Root navigation layout (Expo Router) or use React Navigation
│  ├─ index.tsx                    # Home screen (packs, continue button)
│  ├─ play/[puzzleId].tsx          # Play screen with canvas
│  ├─ settings.tsx                 # Parent settings (difficulty, sound, language)
│  ├─ rewards.tsx                  # Sticker book / badges
│  └─ store/                       # Zustand stores (game, settings)
├─ src/
│  ├─ components/
│  │  ├─ PuzzleCanvas.tsx          # Renders board, pieces, ghost image, drag logic
│  │  ├─ Piece.tsx                 # Single draggable piece
│  │  ├─ HUD.tsx                   # Top bar: hint, reset, pause
│  │  ├─ PackCard.tsx              # Pack tile in home
│  │  └─ ParentalGate.tsx
│  ├─ engine/
│  │  ├─ jigsaw.ts                 # Slicing, shuffling, snapping logic
│  │  └─ geometry.ts               # Rect math, thresholds, positions
│  ├─ hooks/
│  │  ├─ usePieceDrag.ts           # Reanimated gesture logic
│  │  └─ useHaptics.ts
│  ├─ i18n/
│  │  ├─ index.ts                  # i18next setup
│  │  ├─ en.json
│  │  └─ zh.json
│  ├─ theme/
│  │  └─ index.ts                  # Colors, spacing, typography
│  ├─ types/
│  │  └─ index.ts
│  ├─ utils/
│  │  ├─ device.ts                 # Layout helpers (safe area, size)
│  │  └─ sound.ts                  # Expo AV helpers
│  └─ services/
│     ├─ analytics.ts              # noop wrappers to plug Amplitude/GA later
│     ├─ storage.ts                # MMKV/AsyncStorage for progress
│     └─ monetization.ts           # IAP/Ads placeholders
├─ assets/
│  ├─ packs/animals/*.jpg
│  ├─ packs/vehicles/*.jpg
│  ├─ fonts/
│  └─ sfx/
├─ package.json
├─ app.json / expo.json
└─ README.md


If you prefer React Navigation over Expo Router, swap app/ routing for src/navigation/* and an App.tsx entrypoint. The rest stays the same.

Quick Start
# Prereqs: Node 20+, Yarn or PNPM
npx create-expo-app puzzlepals --template
cd puzzlepals
yarn add zustand @tanstack/react-query @react-navigation/native \
  @react-navigation/native-stack react-native-gesture-handler \
  react-native-reanimated react-native-safe-area-context \
  react-native-screens expo-haptics expo-av react-native-mmkv \
  i18next react-i18next react-native-localize react-native-svg
# (Expo config plugins for Reanimated + Gesture are auto with SDK >= 51)
yarn ios   # or yarn android / yarn web

Data Model (TypeScript)
// src/types/index.ts
export type Difficulty = 'EASY' | 'MEDIUM' | 'HARD' | 'EXPERT'; // 2x2, 3x3, 4x4, 6x6

export interface PuzzlePack {
  id: string;             // e.g. 'animals'
  titleKey: string;       // i18n key
  coverAsset: number;     // require('.../cover.jpg')
  puzzles: PuzzleMeta[];
}

export interface PuzzleMeta {
  id: string;             // 'animals-lion'
  titleKey: string;       // 'puzzles.lion'
  imageAsset: number;     // require('.../lion.jpg')
  defaultDifficulty: Difficulty;
}

export interface Piece {
  id: string;
  col: number;            // target col (0..cols-1)
  row: number;            // target row (0..rows-1)
  x: number; y: number;   // current pixel position in canvas coords
  width: number; height: number;
  placed: boolean;
}

export interface BoardState {
  cols: number;
  rows: number;
  width: number;
  height: number;
  pieces: Record<string, Piece>;
  ghostOpacity: number;   // for hints
}

export interface Progress {
  puzzleId: string;
  difficulty: Difficulty;
  placedCount: number;
  startedAt: number;
  completedAt?: number;
}

Jigsaw Engine Overview

Grid slicing (rectangular to start):

Choose cols×rows from difficulty.

Compute tile rects (target positions).

Create Piece instances with shuffled starting positions around a staging area.

Draw each piece via <Image> clipped with SVG mask or use react-native-svg to crop.

Drag & Snap:

Use react-native-gesture-handler + Reanimated.

On release, if piece center within SNAP_THRESHOLD px of target rect center, snap to target and mark placed=true.

Play haptics and sfx on snap.

Win detection:

When placedCount === cols*rows, trigger celebration:

Confetti (Lottie or simple particle spray),

Sound,

Reward sticker unlock,

Save completion.

Zustand Store (Game)
// app/store/game.ts
import { create } from 'zustand';
import { BoardState, Difficulty, PuzzleMeta } from '@/src/types';

type GameStore = {
  current?: { puzzle: PuzzleMeta; difficulty: Difficulty; board: BoardState };
  startPuzzle: (puzzle: PuzzleMeta, difficulty: Difficulty, size: {w:number,h:number}) => void;
  movePiece: (id: string, x: number, y: number) => void;
  placePieceIfSnapped: (id: string) => boolean;
  reset: () => void;
};

export const useGame = create<GameStore>((set, get) => ({
  startPuzzle: (p, difficulty, size) => {
    const { cols, rows } = diffToGrid(difficulty);
    const board = createBoard(p.imageAsset, cols, rows, size.w, size.h);
    set({ current: { puzzle: p, difficulty, board } });
  },
  movePiece: (id, x, y) => set(s => {
    if (!s.current) return s;
    s.current.board.pieces[id].x = x; s.current.board.pieces[id].y = y;
    return { ...s };
  }),
  placePieceIfSnapped: (id) => {
    const s = get();
    if (!s.current) return false;
    const piece = s.current.board.pieces[id];
    const snapped = isWithinSnapThreshold(piece, s.current.board);
    if (snapped) {
      snapToTarget(piece, s.current.board);
      return true;
    }
    return false;
  },
  reset: () => set({ current: undefined }),
}));

// Helpers (pseudo signatures for Copilot to fill)
function diffToGrid(d: Difficulty){ /* EASY->2x2, MEDIUM->3x3, HARD->4x4, EXPERT->6x6 */ return { cols:2, rows:2 }; }
function createBoard(img: number, cols:number, rows:number, w:number, h:number): BoardState { /* ... */ return {} as any; }
function isWithinSnapThreshold(piece:any, board:BoardState){ /* ... */ return false; }
function snapToTarget(piece:any, board:BoardState){ /* ... */ }

Core Components
PuzzleCanvas.tsx

Accepts BoardState, renders background ghost image (optional), pieces, and HUD.

Calculates layout based on device width/height + safe areas.

Provides snap threshold via context.

Piece.tsx

Renders individual piece (clipped bitmap) and attaches PanGestureHandler.

On onEnd, calls placePieceIfSnapped(id); animates to target with Reanimated withTiming.

HUD.tsx

Buttons: Hint, Reset, Home. Optional Timer.

Exposes onHint to toggle ghost opacity for a few seconds.

Screens
Home (packs + continue)

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

Example Screen (Play)
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

  // TODO: load puzzle meta by id, then call startPuzzle on mount with layout size.
  // onLayout of container determines available width/height.

  return (
    <View style={{ flex: 1, paddingTop: top }} onLayout={(e) => {
      const { width, height } = e.nativeEvent.layout;
      // Copilot: fetch puzzle meta by id and call startPuzzle(meta, defaultDifficulty, {w: width, h: height - 80})
    }}>
      {game.current && <PuzzleCanvas board={game.current.board} />}
      <HUD />
    </View>
  );
}

Internationalization (i18n)

Library: i18next + react-i18next + react-native-localize.

Keep copy in /src/i18n/en.json, /src/i18n/zh.json.

// src/i18n/index.ts
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import * as RNLocalize from 'react-native-localize';
import en from './en.json';
import zh from './zh.json';

i18n.use(initReactI18next).init({
  compatibilityJSON: 'v4',
  resources: { en: { translation: en }, zh: { translation: zh } },
  lng: RNLocalize.getLocales()[0]?.languageCode ?? 'en',
  fallbackLng: 'en',
  interpolation: { escapeValue: false },
});
export default i18n;

Accessibility

Label buttons and pieces: accessibilityLabel, accessible.

Reduced motion: disable confetti/large animations if user enabled.

Contrast-safe palette; minimum 44×44 touch targets.

Support RTL mirroring via I18nManager.

Persisting Progress

Use MMKV (fast) with fallback to AsyncStorage.

Key pattern: progress:<puzzleId>:<difficulty> → Progress.

Sounds & Haptics

expo-av: load short .wav for snap and win.

expo-haptics: selectionAsync() on snap, notificationAsync(Success) on win.

Analytics (Noop by default)

Wrap events to be vendor-agnostic:

// src/services/analytics.ts
export const Analytics = {
  track(event: string, props?: Record<string, any>) {
    // TODO: plug Amplitude/Segment/GA4
    if (__DEV__) console.log('[analytics]', event, props);
  },
};


Trigger at:

PuzzleStarted, PiecePlaced, PuzzleCompleted, HintUsed, SettingsChanged.

Monetization (Optional)

Free base pack; additional packs via IAP (iOS/Android).

Alternatively Ads in menus only (never during play).

Parental gate before purchases.

// src/services/monetization.ts
export async function purchasePack(packId: string) { /* TODO */ }
export async function restorePurchases() { /* TODO */ }

Theming
// src/theme/index.ts
export const theme = {
  colors: {
    bg: '#FFFDF7',
    primary: '#6B9EFF',
    accent: '#FFB86B',
    text: '#1E1E1E',
    muted: '#9AA0A6',
  },
  spacing: (n: number) => n * 8,
  radius: { sm: 8, md: 16, lg: 24 },
};

Testing
yarn add -D jest @testing-library/react-native jest-expo ts-jest @types/jest


Unit test engine/jigsaw.ts (slice, shuffle, snap).

Component test Piece.tsx (drag→snap).

Accessibility snapshot: labels present.

Example:

// __tests__/engine.jest.ts
import { computeTargetRects, isWithinSnapThreshold } from '@/src/engine/jigsaw';

test('snap within threshold', () => {
  // Copilot: build board + piece, move piece near target, expect true
});

CI & Lint

ESLint (RN config), TypeScript strict, Prettier.

GitHub Actions: expo/expo-github-action to run jest and expo doctor.

Build & Release

EAS Build: configure iOS/Android in eas.json.

Use app signing and store credentials in EAS.

Add app icons and splash in app.json.

Copilot TODO Map

Add these TODO comments in files to guide Copilot:

engine/jigsaw.ts:

// TODO: implement computeTargetRects(cols, rows, width, height)

// TODO: implement createPiecesFromRects(imageAsset, rects)

// TODO: implement shufflePieces(pieces)

// TODO: implement isWithinSnapThreshold(piece, board)

// TODO: implement snapToTarget(piece, board)

components/Piece.tsx:

// TODO: implement PanGestureHandler with Reanimated position

// TODO: onEnd → check snap; animate to target

app/index.tsx:

// TODO: load packs from assets; render PackCard list

// TODO: resume progress button if saved

services/storage.ts:

// TODO: saveProgress(progress)

// TODO: getProgress(puzzleId, difficulty)

Sample Assets Bootstrap (Animals pack)
// src/data/packs.ts
import { PuzzlePack } from '@/src/types';

export const AnimalsPack: PuzzlePack = {
  id: 'animals',
  titleKey: 'packs.animals',
  coverAsset: require('../../assets/packs/animals/cover.jpg'),
  puzzles: [
    { id: 'animals-lion', titleKey: 'puzzles.lion', imageAsset: require('../../assets/packs/animals/lion.jpg'), defaultDifficulty: 'EASY' },
    { id: 'animals-panda', titleKey: 'puzzles.panda', imageAsset: require('../../assets/packs/animals/panda.jpg'), defaultDifficulty: 'MEDIUM' },
  ],
};

Drag & Drop Implementation Notes

Use absolute positioning for pieces in a fixed canvas container.

Store target rects (x, y, w, h) for each (row, col).

During drag: clamp within canvas bounds.

On release:

Compute distance to target center; if < threshold, snap and mark placed.

When placed, disable hit testing for that piece to avoid re-drag.

Roadmap

Interlocking puzzle edges (non-rectangular, Bezier masks).

Level editor (turn kid’s photo into puzzle).

Remote content packs & CDN updates.

Co-op mode (two players on tablet).

License

MIT © PuzzlePals Contributors

One-shot script to generate rectangles (hint for Copilot)
// src/engine/geometry.ts
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

Enable Reanimated plugin in babel.config.js:

module.exports = function(api){
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: ['react-native-reanimated/plugin'],
  };
};


Ensure react-native-gesture-handler is imported at the app entry.
