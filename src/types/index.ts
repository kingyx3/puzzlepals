// Core TypeScript types for PuzzlePals

export type Difficulty = 
  | 'AGES_3_5'      // 2x2 = 4 pieces (square pieces)
  | 'AGES_6_8'      // 3x3 = 9 pieces (square pieces) 
  | 'AGES_9_10'     // 4x4 = 16 pieces (square pieces)
  | 'AGES_11_PLUS'  // 6x6 = 36 pieces (jigsaw edges)
  | 'EASY'          // 4x4 = 16 pieces (square pieces)
  | 'MEDIUM'        // 6x6 = 36 pieces (jigsaw edges)
  | 'HARD'          // 8x8 = 64 pieces (jigsaw edges)
  | 'EXPERT'        // 10x10 = 100 pieces (jigsaw edges)
  | 'MASTER';       // 12x8 = 96 pieces (jigsaw edges)

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
  educationalContent?: EducationalContent;
}

export interface EducationalContent {
  facts: string[];
  vocabulary: string[];
  learningPrompts: string[];
  ageAppropriate?: boolean;
}

export type PieceShape = 'SQUARE' | 'JIGSAW';

export interface EdgeShape {
  top: 'flat' | 'in' | 'out';
  right: 'flat' | 'in' | 'out';
  bottom: 'flat' | 'in' | 'out';
  left: 'flat' | 'in' | 'out';
}

export interface Piece {
  id: string;
  col: number; // target col (0..cols-1)
  row: number; // target row (0..rows-1)
  x: number; // current x position
  y: number; // current y position
  targetX: number; // target x position
  targetY: number; // target y position
  width: number;
  height: number;
  placed: boolean; // true when snapped to target
  zIndex: number; // for layering during drag
  shape: PieceShape; // shape type (square or jigsaw)
  edges?: EdgeShape; // edge configuration for jigsaw pieces
}

export interface BoardState {
  pieces: Record<string, Piece>; // id -> piece
  cols: number;
  rows: number;
  width: number; // canvas width
  height: number; // canvas height
  imageAsset: number;
  completedCount: number;
  isCompleted: boolean;
}

export interface Progress {
  puzzleId: string;
  difficulty: Difficulty;
  board?: BoardState;
  completedAt?: number; // timestamp
  timeSpent: number; // milliseconds
  hintsUsed: number;
}

export interface GameSettings {
  soundEnabled: boolean;
  hapticEnabled: boolean;
  reducedMotion: boolean;
  parentalGateEnabled: boolean;
  defaultDifficulty: Difficulty;
  language: string;
}

// Utility types for grid calculations
export interface Rectangle {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface Position {
  x: number;
  y: number;
}