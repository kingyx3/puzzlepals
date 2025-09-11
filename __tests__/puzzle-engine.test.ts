// Tests for core puzzle functionality

import {
  difficultyToGrid,
  createBoard,
  isWithinSnapThreshold,
  shouldUseJigsawEdges,
} from '../src/engine/jigsaw';
import { Difficulty } from '../src/types';

describe('Puzzle Engine', () => {
  describe('difficultyToGrid', () => {
    it('should convert difficulty levels to correct grid dimensions', () => {
      expect(difficultyToGrid('AGES_3_5' as Difficulty)).toEqual({
        cols: 2,
        rows: 2,
      });
      expect(difficultyToGrid('AGES_6_8' as Difficulty)).toEqual({
        cols: 3,
        rows: 3,
      });
      expect(difficultyToGrid('AGES_9_10' as Difficulty)).toEqual({
        cols: 4,
        rows: 4,
      });
      expect(difficultyToGrid('AGES_11_PLUS' as Difficulty)).toEqual({
        cols: 6,
        rows: 6,
      });

      // Test new difficulty levels
      expect(difficultyToGrid('EASY' as Difficulty)).toEqual({
        cols: 4,
        rows: 4,
      });
      expect(difficultyToGrid('MEDIUM' as Difficulty)).toEqual({
        cols: 6,
        rows: 6,
      });
      expect(difficultyToGrid('HARD' as Difficulty)).toEqual({
        cols: 8,
        rows: 8,
      });
      expect(difficultyToGrid('EXPERT' as Difficulty)).toEqual({
        cols: 10,
        rows: 10,
      });
      expect(difficultyToGrid('MASTER' as Difficulty)).toEqual({
        cols: 12,
        rows: 8,
      });
    });
  });

  describe('shouldUseJigsawEdges', () => {
    it('should determine correct edge types for each difficulty', () => {
      expect(shouldUseJigsawEdges('AGES_3_5')).toBe(false);
      expect(shouldUseJigsawEdges('AGES_6_8')).toBe(false);
      expect(shouldUseJigsawEdges('AGES_9_10')).toBe(false);
      expect(shouldUseJigsawEdges('AGES_11_PLUS')).toBe(true);
      expect(shouldUseJigsawEdges('EASY')).toBe(false);
      expect(shouldUseJigsawEdges('MEDIUM')).toBe(true);
      expect(shouldUseJigsawEdges('HARD')).toBe(true);
      expect(shouldUseJigsawEdges('EXPERT')).toBe(true);
      expect(shouldUseJigsawEdges('MASTER')).toBe(true);
    });
  });

  describe('createBoard', () => {
    it('should create a board with correct number of pieces', () => {
      const board = createBoard(123, 2, 2, 400, 400, 'AGES_3_5');

      expect(board.cols).toBe(2);
      expect(board.rows).toBe(2);
      expect(board.width).toBe(400);
      expect(board.height).toBe(400);
      expect(Object.keys(board.pieces)).toHaveLength(4);
      expect(board.completedCount).toBe(0);
      expect(board.isCompleted).toBe(false);
    });

    it('should create pieces with correct target positions', () => {
      const board = createBoard(123, 2, 2, 400, 400, 'AGES_3_5');
      const pieces = Object.values(board.pieces);

      pieces.forEach((piece) => {
        expect(piece.targetX).toBeGreaterThanOrEqual(0);
        expect(piece.targetY).toBeGreaterThanOrEqual(0);
        expect(piece.width).toBeGreaterThan(0);
        expect(piece.height).toBeGreaterThan(0);
        expect(piece.placed).toBe(false);
        expect(piece.shape).toBeDefined();
      });
    });

    it('should create square pieces for easy difficulties', () => {
      const board = createBoard(123, 2, 2, 400, 400, 'AGES_3_5');
      const pieces = Object.values(board.pieces);

      pieces.forEach((piece) => {
        expect(piece.shape).toBe('SQUARE');
        expect(piece.edges).toBeUndefined();
      });
    });

    it('should create jigsaw pieces for hard difficulties', () => {
      const board = createBoard(123, 6, 6, 400, 400, 'MEDIUM');
      const pieces = Object.values(board.pieces);

      pieces.forEach((piece) => {
        expect(piece.shape).toBe('JIGSAW');
        expect(piece.edges).toBeDefined();
        expect(piece.edges).toHaveProperty('top');
        expect(piece.edges).toHaveProperty('right');
        expect(piece.edges).toHaveProperty('bottom');
        expect(piece.edges).toHaveProperty('left');
      });
    });
  });

  describe('isWithinSnapThreshold', () => {
    it('should detect when piece is close to target', () => {
      const piece = {
        id: 'test',
        col: 0,
        row: 0,
        x: 15, // Close to target
        y: 15,
        targetX: 20,
        targetY: 20,
        width: 100,
        height: 100,
        placed: false,
        zIndex: 1,
        shape: 'SQUARE' as const,
      };

      expect(isWithinSnapThreshold(piece, 30)).toBe(true);
      expect(isWithinSnapThreshold(piece, 5)).toBe(false);
    });
  });
});
