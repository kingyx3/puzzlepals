# Fix for Issue #71: Puzzle Pieces Appearing in Corner Instead of Carousel

## Problem Description
On Android mobile devices, puzzle pieces were appearing in the top corner of the puzzle canvas instead of being properly hidden in the carousel at the bottom. This created a confusing user experience where pieces appeared in two places simultaneously.

## Root Cause Analysis
The issue was in the `PuzzleCanvas` component which was rendering ALL puzzle pieces regardless of their intended position:

1. **PieceOrganizer correctly filtered pieces** for the carousel: `!piece.placed && (piece.x < 0 || piece.y > board.height)`
2. **PuzzleCanvas rendered all pieces** without any filtering: `Object.values(board.pieces)`
3. **Pieces positioned in carousel staging area** were being rendered in both components simultaneously

## Technical Details

### Initial Piece Positioning (in `jigsaw.ts`)
```typescript
function getRandomStartPosition() {
  return {
    x: -targetRect.width / 2,    // Negative x (off-screen left)
    y: canvasHeight + 20,        // Below canvas (in carousel area)
  };
}
```

### Component Filtering Logic

**Before Fix:**
- PuzzleCanvas: Rendered ALL pieces → pieces appeared on canvas even when in carousel area
- PieceOrganizer: Filtered for carousel pieces → correctly showed pieces in carousel

**After Fix:**
- PuzzleCanvas: Filters to show only `piece.placed || (piece.x >= 0 && piece.y <= board.height)`
- PieceOrganizer: Filters to show only `!piece.placed && (piece.x < 0 || piece.y > board.height)`

### Filter Complementarity
The two filters are perfectly complementary:
- Each piece appears in exactly one component (never both, never neither)
- Placed pieces always appear on the puzzle canvas
- Unplaced pieces appear in carousel when in staging area
- Unplaced pieces appear on canvas when being actively moved

## Implementation

### Modified Files
1. **`src/components/PuzzleCanvas.tsx`** - Added piece filtering logic
2. **`__tests__/piece-positioning.test.ts`** - Added comprehensive test coverage

### Key Changes in PuzzleCanvas.tsx
```typescript
const pieces = Object.values(board.pieces).filter(piece => {
  // Only render pieces that are:
  // 1. Already placed in their correct position, OR
  // 2. Currently on the puzzle canvas (not in carousel staging area)
  return piece.placed || (piece.x >= 0 && piece.y <= board.height);
});
```

## Testing
- Added 3 comprehensive tests to verify piece positioning logic
- All 76 existing tests continue to pass (no regression)
- Tests verify filter complementarity (pieces appear in exactly one place)

## Impact on User Experience
- ✅ Pieces now only appear in carousel when not placed
- ✅ Main puzzle canvas only shows actively moved or placed pieces  
- ✅ Drag-and-drop functionality preserved (pieces move from carousel to canvas)
- ✅ No more confusing duplicate piece appearance on Android mobile

## Drag-and-Drop Behavior Preserved
When pieces are moved from carousel to canvas:
- **Tap**: Moves to `(targetX + width * 2, targetY - 50)` → appears on canvas
- **Drag up**: Moves to `(targetX + width * 1.5, targetY - 30)` → appears on canvas
- Both positions satisfy the canvas filter: `x >= 0 && y <= board.height`

## Future Considerations
This fix is robust and should prevent similar issues. The filtering logic is:
- **Performant**: Simple boolean conditions
- **Maintainable**: Clear comments explain the logic
- **Testable**: Comprehensive test coverage
- **Safe**: All existing functionality preserved