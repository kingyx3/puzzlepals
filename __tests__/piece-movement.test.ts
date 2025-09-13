// Tests for puzzle piece movement improvements

import { createPiecesFromRects, difficultyToGrid } from '../src/engine/jigsaw';
import { PuzzleMeta, Difficulty } from '../src/types';

// Mock puzzle data
const mockPuzzle: PuzzleMeta = {
  id: 'test-puzzle',
  titleKey: 'Test Puzzle',
  imageAsset: 1,
  defaultDifficulty: 'AGES_3_5',
};

describe('Piece Movement Improvements', () => {
  test('pieces are initially positioned in carousel area (off-screen)', () => {
    const difficulty: Difficulty = 'AGES_3_5';
    const { cols, rows } = difficultyToGrid(difficulty);
    const canvasWidth = 300;
    const canvasHeight = 300;

    // Create target rectangles
    const targetRects = [];
    const pieceWidth = canvasWidth / cols;
    const pieceHeight = canvasHeight / rows;

    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        targetRects.push({
          x: col * pieceWidth,
          y: row * pieceHeight,
          width: pieceWidth,
          height: pieceHeight,
        });
      }
    }

    // Create pieces
    const pieces = createPiecesFromRects(
      1, // mock image asset
      targetRects,
      cols,
      rows,
      canvasWidth,
      canvasHeight,
      difficulty
    );

    // Check that all pieces are positioned off-screen (in carousel area)
    Object.values(pieces).forEach((piece) => {
      // Pieces should be positioned outside the puzzle canvas
      expect(piece.x).toBeLessThan(0); // Off-screen to the left
      expect(piece.y).toBeGreaterThan(canvasHeight); // Below the canvas
      expect(piece.placed).toBe(false);

      // Target positions should be on the canvas
      expect(piece.targetX).toBeGreaterThanOrEqual(0);
      expect(piece.targetY).toBeGreaterThanOrEqual(0);
      expect(piece.targetX).toBeLessThan(canvasWidth);
      expect(piece.targetY).toBeLessThan(canvasHeight);
    });
  });

  test('pieces do not overlap with puzzle board initially', () => {
    const difficulty: Difficulty = 'AGES_6_8';
    const { cols, rows } = difficultyToGrid(difficulty);
    const canvasWidth = 400;
    const canvasHeight = 400;

    // Create target rectangles
    const targetRects = [];
    const pieceWidth = canvasWidth / cols;
    const pieceHeight = canvasHeight / rows;

    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        targetRects.push({
          x: col * pieceWidth,
          y: row * pieceHeight,
          width: pieceWidth,
          height: pieceHeight,
        });
      }
    }

    // Create pieces
    const pieces = createPiecesFromRects(
      1,
      targetRects,
      cols,
      rows,
      canvasWidth,
      canvasHeight,
      difficulty
    );

    // Verify no pieces are positioned within the puzzle board area
    Object.values(pieces).forEach((piece) => {
      const isWithinPuzzleArea =
        piece.x >= 0 &&
        piece.x < canvasWidth &&
        piece.y >= 0 &&
        piece.y < canvasHeight;

      expect(isWithinPuzzleArea).toBe(false);
    });
  });

  test('all pieces have valid target positions within canvas bounds', () => {
    const difficulty: Difficulty = 'EASY';
    const { cols, rows } = difficultyToGrid(difficulty);
    const canvasWidth = 500;
    const canvasHeight = 500;

    // Create target rectangles
    const targetRects = [];
    const pieceWidth = canvasWidth / cols;
    const pieceHeight = canvasHeight / rows;

    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        targetRects.push({
          x: col * pieceWidth,
          y: row * pieceHeight,
          width: pieceWidth,
          height: pieceHeight,
        });
      }
    }

    // Create pieces
    const pieces = createPiecesFromRects(
      1,
      targetRects,
      cols,
      rows,
      canvasWidth,
      canvasHeight,
      difficulty
    );

    // Check that target positions are valid
    Object.values(pieces).forEach((piece) => {
      expect(piece.targetX).toBeGreaterThanOrEqual(0);
      expect(piece.targetY).toBeGreaterThanOrEqual(0);
      expect(piece.targetX + piece.width).toBeLessThanOrEqual(canvasWidth);
      expect(piece.targetY + piece.height).toBeLessThanOrEqual(canvasHeight);
    });
  });

  test('pieces have correct grid coordinates', () => {
    const difficulty: Difficulty = 'AGES_3_5';
    const { cols, rows } = difficultyToGrid(difficulty);
    const canvasWidth = 300;
    const canvasHeight = 300;

    // Should be 2x2 grid for AGES_3_5
    expect(cols).toBe(2);
    expect(rows).toBe(2);

    // Create target rectangles
    const targetRects = [];
    const pieceWidth = canvasWidth / cols;
    const pieceHeight = canvasHeight / rows;

    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        targetRects.push({
          x: col * pieceWidth,
          y: row * pieceHeight,
          width: pieceWidth,
          height: pieceHeight,
        });
      }
    }

    // Create pieces
    const pieces = createPiecesFromRects(
      1,
      targetRects,
      cols,
      rows,
      canvasWidth,
      canvasHeight,
      difficulty
    );

    // Verify grid coordinates
    const expectedCoords = [
      { row: 0, col: 0 },
      { row: 0, col: 1 },
      { row: 1, col: 0 },
      { row: 1, col: 1 },
    ];

    Object.values(pieces).forEach((piece) => {
      const expectedCoord = expectedCoords.find(
        (coord) => coord.row === piece.row && coord.col === piece.col
      );
      expect(expectedCoord).toBeDefined();
    });
  });
});
