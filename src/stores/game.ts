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

interface GameState {
  // Current game state
  currentPuzzle?: {
    puzzle: PuzzleMeta;
    difficulty: Difficulty;
    board: BoardState;
    startTime: number;
    hintsUsed: number;
  };
  
  // Loading state
  isLoading: boolean;
  
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
  
  useHint: () => void;
}

export const useGameStore = create<GameState>((set, get) => ({
  isLoading: false,
  
  startPuzzle: (puzzle, difficulty, canvasSize) => {
    const { cols, rows } = difficultyToGrid(difficulty);
    const board = createBoard(
      puzzle.imageAsset,
      cols,
      rows,
      canvasSize.width,
      canvasSize.height
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
    });
  },
  
  useHint: () => {
    const state = get();
    if (!state.currentPuzzle) return;
    
    set({
      currentPuzzle: {
        ...state.currentPuzzle,
        hintsUsed: state.currentPuzzle.hintsUsed + 1,
      },
    });
  },
}));