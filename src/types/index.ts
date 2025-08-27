// Core TypeScript types for PuzzlePals

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
  educationalContent?: EducationalContent;
}

export interface EducationalContent {
  facts: string[];
  vocabulary: string[];
  learningPrompts: string[];
  ageAppropriate?: boolean;
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