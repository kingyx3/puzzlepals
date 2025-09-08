// Tests for piece hover highlighting functionality

import { useGameStore } from '../src/stores/game';

// Mock the sound utils since we're not testing audio
jest.mock('../src/utils/sound', () => ({
  playSnapSound: jest.fn().mockResolvedValue(undefined),
  playCelebrationSound: jest.fn().mockResolvedValue(undefined),
}));

describe('Piece Hover Highlighting', () => {
  beforeEach(() => {
    // Reset the store state before each test
    useGameStore.setState({
      currentPuzzle: undefined,
      isLoading: false,
      showGhostImage: false,
      highlightedPieces: [],
    });
  });

  it('should highlight target area when piece hovers over correct location', () => {
    const store = useGameStore.getState();
    
    // Create a simple 2x2 puzzle for testing
    const puzzle = {
      id: 'test-puzzle',
      titleKey: 'test.title',
      imageAsset: 123,
      defaultDifficulty: 'AGES_3_5' as const,
    };
    
    const canvasSize = { width: 400, height: 400 };
    store.startPuzzle(puzzle, 'AGES_3_5', canvasSize);
    
    const currentState = useGameStore.getState();
    expect(currentState.currentPuzzle).toBeDefined();
    
    const pieceId = Object.keys(currentState.currentPuzzle!.board.pieces)[0];
    const piece = currentState.currentPuzzle!.board.pieces[pieceId];
    
    // Move piece to a position close to its target (within snap threshold)
    const closeX = piece.targetX + 10; // Close to target position
    const closeY = piece.targetY + 10;
    
    store.movePiece(pieceId, closeX, closeY);
    
    const updatedState = useGameStore.getState();
    expect(updatedState.highlightedPieces).toContain(pieceId);
  });

  it('should not highlight when piece is far from target location', () => {
    const store = useGameStore.getState();
    
    const puzzle = {
      id: 'test-puzzle',
      titleKey: 'test.title',
      imageAsset: 123,
      defaultDifficulty: 'AGES_3_5' as const,
    };
    
    const canvasSize = { width: 400, height: 400 };
    store.startPuzzle(puzzle, 'AGES_3_5', canvasSize);
    
    const currentState = useGameStore.getState();
    const pieceId = Object.keys(currentState.currentPuzzle!.board.pieces)[0];
    const piece = currentState.currentPuzzle!.board.pieces[pieceId];
    
    // Move piece to a position far from its target (outside snap threshold)
    const farX = piece.targetX + 100; // Far from target position
    const farY = piece.targetY + 100;
    
    store.movePiece(pieceId, farX, farY);
    
    const updatedState = useGameStore.getState();
    expect(updatedState.highlightedPieces).not.toContain(pieceId);
  });

  it('should clear highlight when piece is moved away from target', () => {
    const store = useGameStore.getState();
    
    const puzzle = {
      id: 'test-puzzle',
      titleKey: 'test.title',
      imageAsset: 123,
      defaultDifficulty: 'AGES_3_5' as const,
    };
    
    const canvasSize = { width: 400, height: 400 };
    store.startPuzzle(puzzle, 'AGES_3_5', canvasSize);
    
    const currentState = useGameStore.getState();
    const pieceId = Object.keys(currentState.currentPuzzle!.board.pieces)[0];
    const piece = currentState.currentPuzzle!.board.pieces[pieceId];
    
    // First, move piece close to target to trigger highlight
    store.movePiece(pieceId, piece.targetX + 10, piece.targetY + 10);
    expect(useGameStore.getState().highlightedPieces).toContain(pieceId);
    
    // Then move piece far from target
    store.movePiece(pieceId, piece.targetX + 100, piece.targetY + 100);
    expect(useGameStore.getState().highlightedPieces).not.toContain(pieceId);
  });

  it('should clear highlight when piece is successfully snapped', () => {
    const store = useGameStore.getState();
    
    const puzzle = {
      id: 'test-puzzle',
      titleKey: 'test.title',
      imageAsset: 123,
      defaultDifficulty: 'AGES_3_5' as const,
    };
    
    const canvasSize = { width: 400, height: 400 };
    store.startPuzzle(puzzle, 'AGES_3_5', canvasSize);
    
    const currentState = useGameStore.getState();
    const pieceId = Object.keys(currentState.currentPuzzle!.board.pieces)[0];
    const piece = currentState.currentPuzzle!.board.pieces[pieceId];
    
    // Move piece close to target to trigger highlight
    store.movePiece(pieceId, piece.targetX + 10, piece.targetY + 10);
    expect(useGameStore.getState().highlightedPieces).toContain(pieceId);
    
    // Try to snap the piece
    const wasSnapped = store.trySnapPiece(pieceId);
    expect(wasSnapped).toBe(true);
    
    // Highlight should be cleared after successful snap
    expect(useGameStore.getState().highlightedPieces).not.toContain(pieceId);
  });

  it('should clear highlights when clearHighlights is called', () => {
    const store = useGameStore.getState();
    
    // Manually set some highlighted pieces
    useGameStore.setState({
      highlightedPieces: ['piece1', 'piece2'],
    });
    
    expect(useGameStore.getState().highlightedPieces).toEqual(['piece1', 'piece2']);
    
    store.clearHighlights();
    
    expect(useGameStore.getState().highlightedPieces).toEqual([]);
  });
});