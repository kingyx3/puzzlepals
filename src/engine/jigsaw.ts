// Core jigsaw puzzle engine

import { Difficulty, Piece, BoardState, Rectangle, Position } from '../types';
import { distance, getRectCenter } from './geometry';
import { layout } from '../theme';

/**
 * Convert difficulty level to grid dimensions
 */
export function difficultyToGrid(difficulty: Difficulty): { cols: number; rows: number } {
  const gridMap = {
    AGES_3_5: { cols: 2, rows: 2 },     // 4 pieces
    AGES_6_8: { cols: 3, rows: 3 },     // 9 pieces
    AGES_9_10: { cols: 4, rows: 4 },    // 16 pieces
    AGES_11_PLUS: { cols: 6, rows: 6 }, // 36 pieces
  };
  return gridMap[difficulty];
}

/**
 * Calculate target rectangles for puzzle pieces in a grid
 */
export function computeTargetRects(
  cols: number,
  rows: number,
  canvasWidth: number,
  canvasHeight: number,
  padding: number = 0
): Rectangle[] {
  const availableWidth = canvasWidth - padding * 2;
  const availableHeight = canvasHeight - padding * 2;
  
  const pieceWidth = availableWidth / cols;
  const pieceHeight = availableHeight / rows;
  
  const rects: Rectangle[] = [];
  
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      rects.push({
        x: padding + col * pieceWidth,
        y: padding + row * pieceHeight,
        width: pieceWidth,
        height: pieceHeight,
      });
    }
  }
  
  return rects;
}

/**
 * Create puzzle pieces from target rectangles
 */
export function createPiecesFromRects(
  imageAsset: number,
  targetRects: Rectangle[],
  cols: number,
  rows: number,
  canvasWidth: number,
  canvasHeight: number
): Record<string, Piece> {
  const pieces: Record<string, Piece> = {};
  
  targetRects.forEach((rect, index) => {
    const col = index % cols;
    const row = Math.floor(index / cols);
    const pieceId = `piece_${row}_${col}`;
    
    // Start pieces in a shuffled position around the staging area
    const startPos = getRandomStartPosition(rect, canvasWidth, canvasHeight);
    
    pieces[pieceId] = {
      id: pieceId,
      col,
      row,
      x: startPos.x,
      y: startPos.y,
      targetX: rect.x,
      targetY: rect.y,
      width: rect.width,
      height: rect.height,
      placed: false,
      zIndex: 1,
    };
  });
  
  return pieces;
}

/**
 * Get a random starting position for a piece (outside the puzzle area)
 */
function getRandomStartPosition(
  targetRect: Rectangle,
  canvasWidth: number,
  canvasHeight: number
): Position {
  // Define staging areas around the puzzle
  const stagingAreas = [
    // Bottom staging area
    {
      x: 0,
      y: canvasHeight * 0.7,
      width: canvasWidth,
      height: canvasHeight * 0.3,
    },
  ];
  
  // For now, use the bottom staging area
  const stagingArea = stagingAreas[0];
  
  return {
    x: stagingArea.x + Math.random() * (stagingArea.width - targetRect.width),
    y: stagingArea.y + Math.random() * (stagingArea.height - targetRect.height),
  };
}

/**
 * Shuffle pieces to random positions
 */
export function shufflePieces(
  pieces: Record<string, Piece>,
  canvasWidth: number,
  canvasHeight: number
): Record<string, Piece> {
  const shuffled = { ...pieces };
  
  Object.values(shuffled).forEach(piece => {
    const startPos = getRandomStartPosition(
      { x: piece.targetX, y: piece.targetY, width: piece.width, height: piece.height },
      canvasWidth,
      canvasHeight
    );
    piece.x = startPos.x;
    piece.y = startPos.y;
    piece.placed = false;
    piece.zIndex = 1;
  });
  
  return shuffled;
}

/**
 * Check if a piece is within snapping threshold of its target
 */
export function isWithinSnapThreshold(
  piece: Piece,
  threshold: number = layout.snapThreshold
): boolean {
  const pieceCenter = getRectCenter({
    x: piece.x,
    y: piece.y,
    width: piece.width,
    height: piece.height,
  });
  
  const targetCenter = getRectCenter({
    x: piece.targetX,
    y: piece.targetY,
    width: piece.width,
    height: piece.height,
  });
  
  return distance(pieceCenter, targetCenter) <= threshold;
}

/**
 * Snap a piece to its target position
 */
export function snapToTarget(piece: Piece): Piece {
  return {
    ...piece,
    x: piece.targetX,
    y: piece.targetY,
    placed: true,
    zIndex: 0, // Lower z-index for placed pieces
  };
}

/**
 * Create a complete board state
 */
export function createBoard(
  imageAsset: number,
  cols: number,
  rows: number,
  canvasWidth: number,
  canvasHeight: number,
  padding: number = 20
): BoardState {
  const targetRects = computeTargetRects(cols, rows, canvasWidth, canvasHeight, padding);
  const pieces = createPiecesFromRects(imageAsset, targetRects, cols, rows, canvasWidth, canvasHeight);
  
  return {
    pieces,
    cols,
    rows,
    width: canvasWidth,
    height: canvasHeight,
    imageAsset,
    completedCount: 0,
    isCompleted: false,
  };
}

/**
 * Check if the puzzle is completed
 */
export function checkPuzzleCompletion(board: BoardState): boolean {
  const totalPieces = board.cols * board.rows;
  const placedPieces = Object.values(board.pieces).filter(piece => piece.placed).length;
  return placedPieces === totalPieces;
}

/**
 * Update board completion status
 */
export function updateBoardCompletion(board: BoardState): BoardState {
  const completedCount = Object.values(board.pieces).filter(piece => piece.placed).length;
  const isCompleted = completedCount === board.cols * board.rows;
  
  return {
    ...board,
    completedCount,
    isCompleted,
  };
}