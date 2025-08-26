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