// Tests for core puzzle functionality

import { difficultyToGrid, createBoard, isWithinSnapThreshold } from '../src/engine/jigsaw';
import { Difficulty } from '../src/types';

describe('Puzzle Engine', () => {
  describe('difficultyToGrid', () => {
    it('should convert difficulty levels to correct grid dimensions', () => {
      expect(difficultyToGrid('AGES_3_5' as Difficulty)).toEqual({ cols: 2, rows: 2 });
      expect(difficultyToGrid('AGES_6_8' as Difficulty)).toEqual({ cols: 3, rows: 3 });
      expect(difficultyToGrid('AGES_9_10' as Difficulty)).toEqual({ cols: 4, rows: 4 });
      expect(difficultyToGrid('AGES_11_PLUS' as Difficulty)).toEqual({ cols: 6, rows: 6 });
    });
  });

  describe('createBoard', () => {
    it('should create a board with correct number of pieces', () => {
      const board = createBoard(123, 2, 2, 400, 400);
      
      expect(board.cols).toBe(2);
      expect(board.rows).toBe(2);
      expect(board.width).toBe(400);
      expect(board.height).toBe(400);
      expect(Object.keys(board.pieces)).toHaveLength(4);
      expect(board.completedCount).toBe(0);
      expect(board.isCompleted).toBe(false);
    });

    it('should create pieces with correct target positions', () => {
      const board = createBoard(123, 2, 2, 400, 400);
      const pieces = Object.values(board.pieces);
      
      pieces.forEach(piece => {
        expect(piece.targetX).toBeGreaterThanOrEqual(0);
        expect(piece.targetY).toBeGreaterThanOrEqual(0);
        expect(piece.width).toBeGreaterThan(0);
        expect(piece.height).toBeGreaterThan(0);
        expect(piece.placed).toBe(false);
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
      };

      expect(isWithinSnapThreshold(piece, 30)).toBe(true);
      expect(isWithinSnapThreshold(piece, 5)).toBe(false);
    });
  });
});