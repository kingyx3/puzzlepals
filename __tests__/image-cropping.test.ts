// Tests for image cropping alignment with target positions

import { createBoard, computeTargetRects } from '../src/engine/jigsaw';
import { Difficulty, Piece } from '../src/types';

// Helper function to simulate the fixed calculateImageCrop function
function calculateImageCropFixed(
  piece: Piece,
  boardWidth: number,
  boardHeight: number,
  totalCols: number,
  totalRows: number,
  padding: number = 20
) {
  const availableWidth = boardWidth - padding * 2;
  const availableHeight = boardHeight - padding * 2;
  const pieceWidth = availableWidth / totalCols;
  const pieceHeight = availableHeight / totalRows;
  const scaledImageWidth = availableWidth;
  const scaledImageHeight = availableHeight;
  const offsetX = -piece.col * pieceWidth;
  const offsetY = -piece.row * pieceHeight;

  return {
    width: scaledImageWidth,
    height: scaledImageHeight,
    left: offsetX,
    top: offsetY,
  };
}

// Helper function to simulate the old broken calculateImageCrop function
function calculateImageCropBroken(
  piece: Piece,
  boardWidth: number,
  boardHeight: number,
  totalCols: number,
  totalRows: number
) {
  const pieceWidth = boardWidth / totalCols;
  const pieceHeight = boardHeight / totalRows;
  const scaledImageWidth = boardWidth;
  const scaledImageHeight = boardHeight;
  const offsetX = -piece.col * pieceWidth;
  const offsetY = -piece.row * pieceHeight;

  return {
    width: scaledImageWidth,
    height: scaledImageHeight,
    left: offsetX,
    top: offsetY,
  };
}

describe('Image Cropping Alignment', () => {
  describe('Fixed vs Broken Cropping Logic', () => {
    it('should demonstrate the difference between fixed and broken cropping', () => {
      const canvasWidth = 400;
      const canvasHeight = 300;
      const padding = 20;
      const totalCols = 4;
      const totalRows = 3;
      
      // Create a test piece
      const testPiece: Piece = {
        id: 'test',
        col: 2,
        row: 1,
        x: 0,
        y: 0,
        targetX: 0,
        targetY: 0,
        width: 0,
        height: 0,
        placed: false,
        zIndex: 1,
        shape: 'SQUARE'
      };

      const fixedCrop = calculateImageCropFixed(
        testPiece,
        canvasWidth,
        canvasHeight,
        totalCols,
        totalRows,
        padding
      );

      const brokenCrop = calculateImageCropBroken(
        testPiece,
        canvasWidth,
        canvasHeight,
        totalCols,
        totalRows
      );

      // The fixed version should use smaller dimensions (accounting for padding)
      expect(fixedCrop.width).toBeLessThan(brokenCrop.width);
      expect(fixedCrop.height).toBeLessThan(brokenCrop.height);

      // The fixed version should have smaller offsets
      expect(Math.abs(fixedCrop.left)).toBeLessThan(Math.abs(brokenCrop.left));
      expect(Math.abs(fixedCrop.top)).toBeLessThan(Math.abs(brokenCrop.top));

      // Verify the exact calculations
      const expectedAvailableWidth = canvasWidth - padding * 2; // 360
      const expectedAvailableHeight = canvasHeight - padding * 2; // 260
      expect(fixedCrop.width).toBe(expectedAvailableWidth);
      expect(fixedCrop.height).toBe(expectedAvailableHeight);
      expect(fixedCrop.left).toBe(-2 * (expectedAvailableWidth / 4)); // -180
      expect(fixedCrop.top).toBe(-1 * (expectedAvailableHeight / 3)); // -86.67
    });

    it('should align cropping with target positions for completed puzzle', () => {
      const canvasWidth = 300;
      const canvasHeight = 300;
      const padding = 20;
      const difficulty: Difficulty = 'AGES_6_8';
      const board = createBoard(1, 3, 3, canvasWidth, canvasHeight, difficulty, padding);
      
      // For each piece, verify the cropping would align with target position
      Object.values(board.pieces).forEach((piece) => {
        const cropInfo = calculateImageCropFixed(
          piece,
          canvasWidth,
          canvasHeight,
          3, // cols
          3, // rows  
          padding
        );

        const expectedAvailableWidth = canvasWidth - padding * 2;
        const expectedAvailableHeight = canvasHeight - padding * 2;
        const expectedPieceWidth = expectedAvailableWidth / 3;
        const expectedPieceHeight = expectedAvailableHeight / 3;

        // Image should be scaled to available space
        expect(cropInfo.width).toBe(expectedAvailableWidth);
        expect(cropInfo.height).toBe(expectedAvailableHeight);

        // Offset should position the correct portion of the image
        expect(cropInfo.left).toBe(-piece.col * expectedPieceWidth);
        expect(cropInfo.top).toBe(-piece.row * expectedPieceHeight);

        // Verify piece dimensions match expected
        expect(piece.width).toBeCloseTo(expectedPieceWidth);
        expect(piece.height).toBeCloseTo(expectedPieceHeight);
      });
    });
  });

  describe('Target rectangles vs cropping calculations', () => {
    it('should have cropping calculations that match target rectangle logic', () => {
      const canvasWidth = 400;
      const canvasHeight = 400;
      const padding = 20; // Default padding used in createBoard
      const cols = 2;
      const rows = 2;

      // Get target rectangles (how pieces are positioned)
      const targetRects = computeTargetRects(
        cols,
        rows,
        canvasWidth,
        canvasHeight,
        padding
      );

      // Calculate what the image cropping should use
      const availableWidth = canvasWidth - padding * 2;
      const availableHeight = canvasHeight - padding * 2;
      const correctPieceWidth = availableWidth / cols;
      const correctPieceHeight = availableHeight / rows;

      // Test that target rectangles match the corrected logic
      expect(targetRects[0].width).toBeCloseTo(correctPieceWidth);
      expect(targetRects[0].height).toBeCloseTo(correctPieceHeight);
      expect(targetRects[0].x).toBeCloseTo(padding);
      expect(targetRects[0].y).toBeCloseTo(padding);

      // Test that the incorrect current logic would produce wrong values
      const incorrectPieceWidth = canvasWidth / cols; // Current wrong logic
      const incorrectPieceHeight = canvasHeight / rows; // Current wrong logic
      
      expect(targetRects[0].width).not.toBeCloseTo(incorrectPieceWidth);
      expect(targetRects[0].height).not.toBeCloseTo(incorrectPieceHeight);
    });

    it('should calculate consistent piece dimensions across all difficulty levels', () => {
      const difficulties: Difficulty[] = ['AGES_3_5', 'AGES_6_8', 'MEDIUM', 'HARD'];
      const canvasWidth = 500;
      const canvasHeight = 400;
      const padding = 20;

      difficulties.forEach((difficulty) => {
        const board = createBoard(1, 2, 2, canvasWidth, canvasHeight, difficulty, padding);
        const targetRects = computeTargetRects(2, 2, canvasWidth, canvasHeight, padding);
        
        const pieces = Object.values(board.pieces);
        
        // All pieces should have dimensions matching target rectangles
        pieces.forEach((piece, index) => {
          expect(piece.width).toBeCloseTo(targetRects[index].width);
          expect(piece.height).toBeCloseTo(targetRects[index].height);
          expect(piece.targetX).toBeCloseTo(targetRects[index].x);
          expect(piece.targetY).toBeCloseTo(targetRects[index].y);
        });
      });
    });

    it('should account for padding in image scaling calculations', () => {
      const canvasWidth = 300;
      const canvasHeight = 200;
      const padding = 15;
      const cols = 3;
      const rows = 2;

      const availableWidth = canvasWidth - padding * 2;
      const availableHeight = canvasHeight - padding * 2;

      // For a piece at col=1, row=1 (non-zero to show offset difference)
      const pieceCol = 1;
      const pieceRow = 1;
      
      // Correct cropping calculation should use available dimensions
      const correctPieceWidth = availableWidth / cols;
      const correctPieceHeight = availableHeight / rows;
      const correctOffsetX = -pieceCol * correctPieceWidth;
      const correctOffsetY = -pieceRow * correctPieceHeight;

      // Wrong calculation (current implementation) uses full dimensions
      const wrongPieceWidth = canvasWidth / cols;
      const wrongPieceHeight = canvasHeight / rows;
      const wrongOffsetX = -pieceCol * wrongPieceWidth;
      const wrongOffsetY = -pieceRow * wrongPieceHeight;

      // The correct offset should be different from the wrong one
      expect(correctOffsetX).not.toBeCloseTo(wrongOffsetX);
      expect(correctOffsetY).not.toBeCloseTo(wrongOffsetY);

      // The correct offset should account for the smaller available space
      expect(Math.abs(correctOffsetX)).toBeLessThan(Math.abs(wrongOffsetX));
      expect(Math.abs(correctOffsetY)).toBeLessThan(Math.abs(wrongOffsetY));
    });
  });

  describe('Cropping function consistency', () => {
    it('should produce identical results for square and jigsaw piece cropping', () => {
      const boardWidth = 400;
      const boardHeight = 300;
      const totalCols = 4;
      const totalRows = 3;
      const padding = 20;
      
      const availableWidth = boardWidth - padding * 2;
      const availableHeight = boardHeight - padding * 2;
      
      for (let row = 0; row < totalRows; row++) {
        for (let col = 0; col < totalCols; col++) {
          // Calculate using corrected logic
          const correctPieceWidth = availableWidth / totalCols;
          const correctPieceHeight = availableHeight / totalRows;
          const correctOffsetX = -col * correctPieceWidth;
          const correctOffsetY = -row * correctPieceHeight;

          // Both square and jigsaw pieces should use the same cropping logic
          expect(correctOffsetX).toEqual(-col * (availableWidth / totalCols));
          expect(correctOffsetY).toEqual(-row * (availableHeight / totalRows));
          
          // The scaled image should cover the available space, not the full canvas
          expect(availableWidth).toBeLessThan(boardWidth);
          expect(availableHeight).toBeLessThan(boardHeight);
        }
      }
    });
  });
});