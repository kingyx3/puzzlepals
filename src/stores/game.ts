// Game state management using Zustand

import { create } from 'zustand';
import { BoardState, Difficulty, PuzzleMeta } from '../types';
import { 
  createBoard, 
  isWithinSnapThreshold, 
  snapToTarget, 
  updateBoardCompletion,
  difficultyToGrid 
} from '../engine/jigsaw';
import { suggestBestHint, HintResult, calculateHintCooldown } from '../engine/hints';

interface GameState {
  // Current game state
  currentPuzzle?: {
    puzzle: PuzzleMeta;
    difficulty: Difficulty;
    board: BoardState;
    startTime: number;
    hintsUsed: number;
    lastHintTime?: number;
    currentHint?: HintResult;
  };
  
  // Loading state
  isLoading: boolean;
  
  // UI state
  showGhostImage: boolean;
  highlightedPieces: string[];
  
  // Actions
  startPuzzle: (
    puzzle: PuzzleMeta,
    difficulty: Difficulty,
    canvasSize: { width: number; height: number }
  ) => void;
  
  movePiece: (pieceId: string, x: number, y: number) => void;
  
  trySnapPiece: (pieceId: string) => boolean;
  
  bringToFront: (pieceId: string) => void;
  
  resetPuzzle: () => void;
  
  exitPuzzle: () => void;
  
  useHint: () => HintResult | null;
  
  clearHint: () => void;
  
  autoPlacePiece: (pieceId: string) => void;
}

export const useGameStore = create<GameState>((set, get) => ({
  isLoading: false,
  showGhostImage: false,
  highlightedPieces: [],
  
  startPuzzle: (puzzle, difficulty, canvasSize) => {
    const { cols, rows } = difficultyToGrid(difficulty);
    const board = createBoard(
      puzzle.imageAsset,
      cols,
      rows,
      canvasSize.width,
      canvasSize.height,
      difficulty
    );
    
    set({
      currentPuzzle: {
        puzzle,
        difficulty,
        board,
        startTime: Date.now(),
        hintsUsed: 0,
      },
      isLoading: false,
      showGhostImage: false,
      highlightedPieces: [],
    });
  },
  
  movePiece: (pieceId, x, y) => {
    const state = get();
    if (!state.currentPuzzle) return;
    
    const updatedPieces = {
      ...state.currentPuzzle.board.pieces,
      [pieceId]: {
        ...state.currentPuzzle.board.pieces[pieceId],
        x,
        y,
      },
    };
    
    const updatedBoard = updateBoardCompletion({
      ...state.currentPuzzle.board,
      pieces: updatedPieces,
    });
    
    set({
      currentPuzzle: {
        ...state.currentPuzzle,
        board: updatedBoard,
      },
    });
  },
  
  trySnapPiece: (pieceId) => {
    const state = get();
    if (!state.currentPuzzle) return false;
    
    const piece = state.currentPuzzle.board.pieces[pieceId];
    if (!piece || piece.placed) return false;
    
    const shouldSnap = isWithinSnapThreshold(piece);
    if (!shouldSnap) return false;
    
    // Snap the piece to target
    const snappedPiece = snapToTarget(piece);
    const updatedPieces = {
      ...state.currentPuzzle.board.pieces,
      [pieceId]: snappedPiece,
    };
    
    const updatedBoard = updateBoardCompletion({
      ...state.currentPuzzle.board,
      pieces: updatedPieces,
    });
    
    set({
      currentPuzzle: {
        ...state.currentPuzzle,
        board: updatedBoard,
      },
    });
    
    return true;
  },
  
  bringToFront: (pieceId) => {
    const state = get();
    if (!state.currentPuzzle) return;
    
    // Find the highest z-index
    const maxZ = Math.max(
      ...Object.values(state.currentPuzzle.board.pieces).map(p => p.zIndex)
    );
    
    const updatedPieces = {
      ...state.currentPuzzle.board.pieces,
      [pieceId]: {
        ...state.currentPuzzle.board.pieces[pieceId],
        zIndex: maxZ + 1,
      },
    };
    
    const updatedBoard = {
      ...state.currentPuzzle.board,
      pieces: updatedPieces,
    };
    
    set({
      currentPuzzle: {
        ...state.currentPuzzle,
        board: updatedBoard,
      },
    });
  },
  
  resetPuzzle: () => {
    const state = get();
    if (!state.currentPuzzle) return;
    
    // Reset the current puzzle
    const { puzzle, difficulty } = state.currentPuzzle;
    const canvasSize = {
      width: state.currentPuzzle.board.width,
      height: state.currentPuzzle.board.height,
    };
    
    get().startPuzzle(puzzle, difficulty, canvasSize);
  },
  
  exitPuzzle: () => {
    set({
      currentPuzzle: undefined,
      isLoading: false,
      showGhostImage: false,
      highlightedPieces: [],
    });
  },
  
  useHint: () => {
    const state = get();
    if (!state.currentPuzzle) return null;
    
    const now = Date.now();
    const lastHintTime = state.currentPuzzle.lastHintTime || 0;
    const timeSinceLastHint = now - lastHintTime;
    
    // Calculate completion percentage
    const totalPieces = state.currentPuzzle.board.cols * state.currentPuzzle.board.rows;
    const completionPercentage = state.currentPuzzle.board.completedCount / totalPieces;
    
    // Check cooldown
    const cooldown = calculateHintCooldown(
      state.currentPuzzle.hintsUsed,
      completionPercentage
    );
    
    if (timeSinceLastHint < cooldown) {
      return null; // Still in cooldown
    }
    
    // Get hint suggestion
    const hintResult = suggestBestHint(
      state.currentPuzzle.board,
      state.currentPuzzle.hintsUsed
    );
    
    // Apply hint effects
    const updates: Partial<GameState> = {
      currentPuzzle: {
        ...state.currentPuzzle,
        hintsUsed: state.currentPuzzle.hintsUsed + 1,
        lastHintTime: now,
        currentHint: hintResult,
      },
    };
    
    if (hintResult.type === 'ghost') {
      updates.showGhostImage = true;
      // Auto-hide ghost image after 10 seconds
      setTimeout(() => {
        const currentState = get();
        if (currentState.showGhostImage) {
          set({ showGhostImage: false });
        }
      }, 10000);
    }
    
    if (hintResult.highlightTargets) {
      updates.highlightedPieces = hintResult.highlightTargets;
      // Auto-clear highlights after 15 seconds
      setTimeout(() => {
        const currentState = get();
        if (currentState.highlightedPieces.length > 0) {
          set({ highlightedPieces: [] });
        }
      }, 15000);
    }
    
    if (hintResult.autoPlacePiece) {
      // Auto-place the piece after a short delay
      setTimeout(() => {
        get().autoPlacePiece(hintResult.autoPlacePiece!);
      }, 1000);
    }
    
    set(updates);
    return hintResult;
  },
  
  clearHint: () => {
    const state = get();
    if (!state.currentPuzzle) return;
    
    set({
      showGhostImage: false,
      highlightedPieces: [],
      currentPuzzle: {
        ...state.currentPuzzle,
        currentHint: undefined,
      },
    });
  },
  
  autoPlacePiece: (pieceId) => {
    const state = get();
    if (!state.currentPuzzle) return;
    
    const piece = state.currentPuzzle.board.pieces[pieceId];
    if (!piece || piece.placed) return;
    
    const snappedPiece = snapToTarget(piece);
    
    const updatedPieces = {
      ...state.currentPuzzle.board.pieces,
      [pieceId]: snappedPiece,
    };
    
    const updatedBoard = updateBoardCompletion({
      ...state.currentPuzzle.board,
      pieces: updatedPieces,
    });
    
    set({
      currentPuzzle: {
        ...state.currentPuzzle,
        board: updatedBoard,
      },
    });
  },
}));