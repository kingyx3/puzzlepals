// Core jigsaw puzzle engine

import {
  Difficulty,
  Piece,
  BoardState,
  Rectangle,
  Position,
  EdgeShape,
} from '../types';
import { distance, getRectCenter } from './geometry';
import { layout } from '../theme';

/**
 * Convert difficulty level to grid dimensions
 */
export function difficultyToGrid(difficulty: Difficulty): {
  cols: number;
  rows: number;
} {
  const gridMap = {
    AGES_3_5: { cols: 2, rows: 2 }, // 4 pieces (square)
    AGES_6_8: { cols: 3, rows: 3 }, // 9 pieces (square)
    AGES_9_10: { cols: 4, rows: 4 }, // 16 pieces (square)
    AGES_11_PLUS: { cols: 6, rows: 6 }, // 36 pieces (jigsaw)
    EASY: { cols: 4, rows: 4 }, // 16 pieces (square)
    MEDIUM: { cols: 6, rows: 6 }, // 36 pieces (jigsaw)
    HARD: { cols: 8, rows: 8 }, // 64 pieces (jigsaw)
    EXPERT: { cols: 10, rows: 10 }, // 100 pieces (jigsaw)
    MASTER: { cols: 12, rows: 8 }, // 96 pieces (jigsaw)
  };
  return gridMap[difficulty];
}

/**
 * Determine if difficulty level should use jigsaw edges
 */
export function shouldUseJigsawEdges(difficulty: Difficulty): boolean {
  const jigsawDifficulties: Difficulty[] = [
    'AGES_11_PLUS',
    'MEDIUM',
    'HARD',
    'EXPERT',
    'MASTER',
  ];
  return jigsawDifficulties.includes(difficulty);
}

/**
 * Generate jigsaw edge shapes for a puzzle piece
 */
export function generateJigsawEdges(
  col: number,
  row: number,
  cols: number,
  rows: number,
  seed: number = 0
): EdgeShape {
  // Use deterministic random based on position and seed
  const random = (n: number) => {
    const x = Math.sin(seed + col * 1000 + row * 100 + n) * 10000;
    return x - Math.floor(x);
  };

  return {
    // Top edge: flat if top row, otherwise random in/out
    top: row === 0 ? 'flat' : random(1) < 0.5 ? 'in' : 'out',

    // Right edge: flat if rightmost column, otherwise random in/out
    right: col === cols - 1 ? 'flat' : random(2) < 0.5 ? 'in' : 'out',

    // Bottom edge: flat if bottom row, otherwise random in/out
    bottom: row === rows - 1 ? 'flat' : random(3) < 0.5 ? 'in' : 'out',

    // Left edge: flat if leftmost column, otherwise random in/out
    left: col === 0 ? 'flat' : random(4) < 0.5 ? 'in' : 'out',
  };
}

/**
 * Ensure neighboring pieces have complementary edges
 */
export function harmonizeJigsawEdges(
  pieces: Record<string, Piece>,
  cols: number,
  rows: number
): Record<string, Piece> {
  const harmonizedPieces = { ...pieces };

  // Iterate through all pieces and ensure complementary edges
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      const pieceId = `piece_${row}_${col}`;
      const piece = harmonizedPieces[pieceId];

      if (!piece || !piece.edges) continue;

      // Harmonize with right neighbor
      if (col < cols - 1) {
        const rightPieceId = `piece_${row}_${col + 1}`;
        const rightPiece = harmonizedPieces[rightPieceId];

        if (rightPiece && rightPiece.edges) {
          // Right piece's left edge should be opposite of current piece's right edge
          if (piece.edges.right === 'in') {
            rightPiece.edges.left = 'out';
          } else if (piece.edges.right === 'out') {
            rightPiece.edges.left = 'in';
          }
        }
      }

      // Harmonize with bottom neighbor
      if (row < rows - 1) {
        const bottomPieceId = `piece_${row + 1}_${col}`;
        const bottomPiece = harmonizedPieces[bottomPieceId];

        if (bottomPiece && bottomPiece.edges) {
          // Bottom piece's top edge should be opposite of current piece's bottom edge
          if (piece.edges.bottom === 'in') {
            bottomPiece.edges.top = 'out';
          } else if (piece.edges.bottom === 'out') {
            bottomPiece.edges.top = 'in';
          }
        }
      }
    }
  }

  return harmonizedPieces;
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
  canvasHeight: number,
  difficulty: Difficulty,
  seed: number = 123
): Record<string, Piece> {
  const pieces: Record<string, Piece> = {};
  const useJigsaw = shouldUseJigsawEdges(difficulty);

  targetRects.forEach((rect, index) => {
    const col = index % cols;
    const row = Math.floor(index / cols);
    const pieceId = `piece_${row}_${col}`;

    // Start pieces in a shuffled position around the staging area
    const startPos = getRandomStartPosition(rect, canvasWidth, canvasHeight);

    const piece: Piece = {
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
      shape: useJigsaw ? 'JIGSAW' : 'SQUARE',
    };

    // Add jigsaw edges if needed
    if (useJigsaw) {
      piece.edges = generateJigsawEdges(col, row, cols, rows, seed);
    }

    pieces[pieceId] = piece;
  });

  // Harmonize jigsaw edges between neighboring pieces
  if (useJigsaw) {
    return harmonizeJigsawEdges(pieces, cols, rows);
  }

  return pieces;
}

/**
 * Get a starting position for a piece in the carousel area (not on the puzzle board)
 */
function getRandomStartPosition(
  targetRect: Rectangle,
  canvasWidth: number,
  canvasHeight: number
): Position {
  // Position pieces off-screen in the carousel area initially
  // This ensures they don't block the puzzle board and appear in the carousel component
  return {
    x: -targetRect.width - 20, // Position off-screen to the left
    y: canvasHeight + 50, // Position below the canvas in carousel area
  };
}

/**
 * Shuffle pieces to carousel positions (not on the puzzle board)
 */
export function shufflePieces(
  pieces: Record<string, Piece>,
  canvasWidth: number,
  canvasHeight: number
): Record<string, Piece> {
  const shuffled = { ...pieces };

  Object.values(shuffled).forEach((piece) => {
    // Position pieces in carousel area, not on the puzzle board
    const startPos = getRandomStartPosition(
      {
        x: piece.targetX,
        y: piece.targetY,
        width: piece.width,
        height: piece.height,
      },
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
 * Enhanced snap detection with edge-aware magnetic zones
 */
export function isWithinSnapThreshold(
  piece: Piece,
  threshold: number = layout.snapThreshold
): boolean {
  const pieceRect = {
    x: piece.x,
    y: piece.y,
    width: piece.width,
    height: piece.height,
  };

  const targetRect = {
    x: piece.targetX,
    y: piece.targetY,
    width: piece.width,
    height: piece.height,
  };

  // Primary check - center-to-center distance
  const pieceCenter = getRectCenter(pieceRect);
  const targetCenter = getRectCenter(targetRect);
  const centerDistance = distance(pieceCenter, targetCenter);

  if (centerDistance <= threshold) {
    return true;
  }

  // Only apply enhanced magnetic zones if base threshold is reasonably large
  if (threshold < 15) {
    return false; // For small thresholds, use only center-to-center distance
  }

  // Enhanced magnetic zone - check edge alignment
  const magneticThreshold = threshold * 1.2;

  // Check for edge alignment (horizontal or vertical)
  const horizontalOverlap =
    Math.min(pieceRect.x + pieceRect.width, targetRect.x + targetRect.width) -
    Math.max(pieceRect.x, targetRect.x);
  const verticalOverlap =
    Math.min(pieceRect.y + pieceRect.height, targetRect.y + targetRect.height) -
    Math.max(pieceRect.y, targetRect.y);

  // If there's significant overlap in one dimension and the other dimension is close
  const overlapThreshold = Math.min(piece.width, piece.height) * 0.6;

  if (horizontalOverlap > overlapThreshold) {
    const verticalDistance = Math.abs(pieceCenter.y - targetCenter.y);
    if (verticalDistance <= magneticThreshold) {
      return true;
    }
  }

  if (verticalOverlap > overlapThreshold) {
    const horizontalDistance = Math.abs(pieceCenter.x - targetCenter.x);
    if (horizontalDistance <= magneticThreshold) {
      return true;
    }
  }

  return false;
}

/**
 * Calculate optimal snap position with edge-aware alignment
 */
export function calculateSnapPosition(piece: Piece): { x: number; y: number } {
  // For now, always snap to exact target position
  // This can be enhanced to snap to best-fit position considering overlaps
  return {
    x: piece.targetX,
    y: piece.targetY,
  };
}

/**
 * Snap a piece to its optimal target position
 */
export function snapToTarget(piece: Piece): Piece {
  const snapPosition = calculateSnapPosition(piece);

  return {
    ...piece,
    x: snapPosition.x,
    y: snapPosition.y,
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
  difficulty: Difficulty,
  padding: number = 20,
  seed: number = 123
): BoardState {
  const targetRects = computeTargetRects(
    cols,
    rows,
    canvasWidth,
    canvasHeight,
    padding
  );
  const pieces = createPiecesFromRects(
    imageAsset,
    targetRects,
    cols,
    rows,
    canvasWidth,
    canvasHeight,
    difficulty,
    seed
  );

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
  const placedPieces = Object.values(board.pieces).filter(
    (piece) => piece.placed
  ).length;
  return placedPieces === totalPieces;
}

/**
 * Update board completion status
 */
export function updateBoardCompletion(board: BoardState): BoardState {
  const completedCount = Object.values(board.pieces).filter(
    (piece) => piece.placed
  ).length;
  const isCompleted = completedCount === board.cols * board.rows;

  return {
    ...board,
    completedCount,
    isCompleted,
  };
}
