// Tests for hint system functionality

import { suggestBestHint, findBestNextPiece, isCornerPiece, isEdgePiece, calculateHintCooldown } from '../src/engine/hints';
import { BoardState, Piece } from '../src/types';

// Mock piece data for testing
const mockPiece: Piece = {
  id: 'test-piece',
  col: 0,
  row: 0,
  x: 100,
  y: 100,
  targetX: 50,
  targetY: 50,
  width: 50,
  height: 50,
  placed: false,
  zIndex: 1,
  shape: 'SQUARE',
};

const mockBoard: BoardState = {
  pieces: {
    'test-piece': mockPiece,
    'corner-piece': {
      ...mockPiece,
      id: 'corner-piece',
      col: 1,
      row: 1,
      x: 200,
      y: 200,
      targetX: 100,
      targetY: 100,
    },
  },
  cols: 2,
  rows: 2,
  width: 200,
  height: 200,
  imageAsset: 123,
  completedCount: 0,
  isCompleted: false,
};

describe('Hint System', () => {
  describe('suggestBestHint', () => {
    it('should suggest outline hint for first hint', () => {
      const result = suggestBestHint(mockBoard, 0);
      
      expect(result.type).toBe('outline');
      expect(result.message).toContain('outline');
    });
    
    it('should suggest ghost image for second hint', () => {
      const result = suggestBestHint(mockBoard, 1);
      
      expect(result.type).toBe('ghost');
      expect(result.showGhostImage).toBe(true);
      expect(result.message).toContain('ghost');
    });
    
    it('should suggest piece highlighting for third hint', () => {
      const result = suggestBestHint(mockBoard, 2);
      
      expect(result.type).toBe('highlight');
      expect(result.targetPieceId).toBeDefined();
      expect(result.highlightTargets).toBeDefined();
      expect(result.highlightTargets!.length).toBeGreaterThan(0);
    });
    
    it('should suggest auto-placement for excessive hints', () => {
      const result = suggestBestHint(mockBoard, 3);
      
      expect(result.type).toBe('autoplace');
      expect(result.autoPlacePiece).toBeDefined();
      expect(result.message).toContain('place');
    });
  });
  
  describe('findBestNextPiece', () => {
    it('should find a piece when board has unplaced pieces', () => {
      const result = findBestNextPiece(mockBoard);
      
      expect(result).toBeDefined();
      expect(result!.placed).toBe(false);
    });
    
    it('should return null when all pieces are placed', () => {
      const completedBoard = {
        ...mockBoard,
        pieces: {
          'test-piece': { ...mockPiece, placed: true },
          'corner-piece': { ...mockBoard.pieces['corner-piece'], placed: true },
        },
      };
      
      const result = findBestNextPiece(completedBoard);
      expect(result).toBeNull();
    });
  });
  
  describe('piece classification', () => {
    it('should identify corner pieces correctly', () => {
      expect(isCornerPiece({ ...mockPiece, col: 0, row: 0 }, mockBoard)).toBe(true);
      expect(isCornerPiece({ ...mockPiece, col: 1, row: 1 }, mockBoard)).toBe(true);
      expect(isCornerPiece({ ...mockPiece, col: 0, row: 1 }, mockBoard)).toBe(true);
      expect(isCornerPiece({ ...mockPiece, col: 1, row: 0 }, mockBoard)).toBe(true);
    });
    
    it('should identify edge pieces correctly', () => {
      const largerBoard = { ...mockBoard, cols: 3, rows: 3 };
      
      expect(isEdgePiece({ ...mockPiece, col: 0, row: 1 }, largerBoard)).toBe(true);
      expect(isEdgePiece({ ...mockPiece, col: 1, row: 0 }, largerBoard)).toBe(true);
      expect(isEdgePiece({ ...mockPiece, col: 1, row: 2 }, largerBoard)).toBe(true);
      expect(isEdgePiece({ ...mockPiece, col: 2, row: 1 }, largerBoard)).toBe(true);
      expect(isEdgePiece({ ...mockPiece, col: 1, row: 1 }, largerBoard)).toBe(false); // interior piece
    });
  });
  
  describe('calculateHintCooldown', () => {
    it('should reduce cooldown as player struggles more', () => {
      const baseCooldown = 30000;
      const lowHintsCooldown = calculateHintCooldown(1, 0.5, baseCooldown);
      const highHintsCooldown = calculateHintCooldown(5, 0.5, baseCooldown);
      
      expect(highHintsCooldown).toBeLessThan(lowHintsCooldown);
    });
    
    it('should reduce cooldown for early puzzle stages', () => {
      const baseCooldown = 30000;
      const earlyCooldown = calculateHintCooldown(2, 0.1, baseCooldown);
      const lateCooldown = calculateHintCooldown(2, 0.9, baseCooldown);
      
      expect(earlyCooldown).toBeLessThan(lateCooldown);
    });
    
    it('should not go below minimum cooldown threshold', () => {
      const baseCooldown = 30000;
      const minimumCooldown = calculateHintCooldown(10, 0.0, baseCooldown);
      
      expect(minimumCooldown).toBeGreaterThanOrEqual(baseCooldown * 0.15); // Should be at least 15% of base
    });
  });
});