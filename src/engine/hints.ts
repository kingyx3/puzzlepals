// Smart hint system for puzzle assistance

import { Piece, BoardState } from '../types';
import { distance, getRectCenter } from './geometry';

export type HintLevel = 'outline' | 'ghost' | 'highlight' | 'autoplace';

export interface HintResult {
  type: HintLevel;
  targetPieceId?: string;
  showGhostImage?: boolean;
  highlightTargets?: string[];
  autoPlacePiece?: string;
  message?: string;
}

/**
 * Analyze board state and suggest the best hint
 */
export function suggestBestHint(
  board: BoardState,
  hintsUsed: number
): HintResult {
  const unplacedPieces = Object.values(board.pieces).filter(
    (piece) => !piece.placed
  );

  if (unplacedPieces.length === 0) {
    return { type: 'outline', message: 'Puzzle is complete!' };
  }

  // Progressive hint system based on usage and difficulty
  if (hintsUsed === 0) {
    return {
      type: 'outline',
      message: 'Try the outline view to see where pieces belong',
    };
  } else if (hintsUsed === 1) {
    return {
      type: 'ghost',
      showGhostImage: true,
      message: 'Use the ghost image to match colors and patterns',
    };
  } else if (hintsUsed === 2) {
    const nextPiece = findBestNextPiece(board);
    return {
      type: 'highlight',
      targetPieceId: nextPiece?.id,
      highlightTargets: nextPiece ? [nextPiece.id] : [],
      message: `Try placing the highlighted piece`,
    };
  } else {
    // Auto-place for struggling players
    const easyPiece = findEasiestPiece(board);
    return {
      type: 'autoplace',
      autoPlacePiece: easyPiece?.id,
      message: `Let me help place this piece for you`,
    };
  }
}

/**
 * Find the best next piece to place based on strategy
 */
export function findBestNextPiece(board: BoardState): Piece | null {
  const unplacedPieces = Object.values(board.pieces).filter(
    (piece) => !piece.placed
  );

  if (unplacedPieces.length === 0) return null;

  // Strategy 1: Prefer corner pieces
  const cornerPieces = unplacedPieces.filter((piece) =>
    isCornerPiece(piece, board)
  );
  if (cornerPieces.length > 0) {
    return cornerPieces[0];
  }

  // Strategy 2: Prefer edge pieces
  const edgePieces = unplacedPieces.filter((piece) =>
    isEdgePiece(piece, board)
  );
  if (edgePieces.length > 0) {
    return edgePieces[0];
  }

  // Strategy 3: Find piece closest to correct position
  return unplacedPieces.reduce(
    (best, piece) => {
      const distanceToTarget = distance(
        getRectCenter({
          x: piece.x,
          y: piece.y,
          width: piece.width,
          height: piece.height,
        }),
        getRectCenter({
          x: piece.targetX,
          y: piece.targetY,
          width: piece.width,
          height: piece.height,
        })
      );

      const bestDistance = best
        ? distance(
            getRectCenter({
              x: best.x,
              y: best.y,
              width: best.width,
              height: best.height,
            }),
            getRectCenter({
              x: best.targetX,
              y: best.targetY,
              width: best.width,
              height: best.height,
            })
          )
        : Infinity;

      return distanceToTarget < bestDistance ? piece : best;
    },
    null as Piece | null
  );
}

/**
 * Find the easiest piece to place (for auto-place hint)
 */
export function findEasiestPiece(board: BoardState): Piece | null {
  const unplacedPieces = Object.values(board.pieces).filter(
    (piece) => !piece.placed
  );

  if (unplacedPieces.length === 0) return null;

  // Find the piece that's already closest to its target
  return unplacedPieces.reduce(
    (easiest, piece) => {
      const distanceToTarget = distance(
        getRectCenter({
          x: piece.x,
          y: piece.y,
          width: piece.width,
          height: piece.height,
        }),
        getRectCenter({
          x: piece.targetX,
          y: piece.targetY,
          width: piece.width,
          height: piece.height,
        })
      );

      const easiestDistance = easiest
        ? distance(
            getRectCenter({
              x: easiest.x,
              y: easiest.y,
              width: easiest.width,
              height: easiest.height,
            }),
            getRectCenter({
              x: easiest.targetX,
              y: easiest.targetY,
              width: easiest.width,
              height: easiest.height,
            })
          )
        : Infinity;

      return distanceToTarget < easiestDistance ? piece : easiest;
    },
    null as Piece | null
  );
}

/**
 * Check if a piece is a corner piece
 */
export function isCornerPiece(piece: Piece, board: BoardState): boolean {
  return (
    (piece.row === 0 && piece.col === 0) ||
    (piece.row === 0 && piece.col === board.cols - 1) ||
    (piece.row === board.rows - 1 && piece.col === 0) ||
    (piece.row === board.rows - 1 && piece.col === board.cols - 1)
  );
}

/**
 * Check if a piece is an edge piece
 */
export function isEdgePiece(piece: Piece, board: BoardState): boolean {
  return (
    piece.row === 0 ||
    piece.row === board.rows - 1 ||
    piece.col === 0 ||
    piece.col === board.cols - 1
  );
}

/**
 * Get pieces organized by type for easier solving
 */
export function organizePiecesByType(board: BoardState): {
  corners: Piece[];
  edges: Piece[];
  interior: Piece[];
} {
  const pieces = Object.values(board.pieces);

  return {
    corners: pieces.filter((piece) => isCornerPiece(piece, board)),
    edges: pieces.filter(
      (piece) => isEdgePiece(piece, board) && !isCornerPiece(piece, board)
    ),
    interior: pieces.filter((piece) => !isEdgePiece(piece, board)),
  };
}

/**
 * Calculate hint cooldown based on difficulty and progress
 */
export function calculateHintCooldown(
  hintsUsed: number,
  completionPercentage: number,
  baseCooldownMs: number = 30000
): number {
  // Reduce cooldown as player struggles more
  const struggleFactor = Math.max(0.3, 1 - hintsUsed * 0.1);

  // Reduce cooldown for early stages of puzzle
  const progressFactor = Math.max(0.5, completionPercentage + 0.3);

  return baseCooldownMs * struggleFactor * progressFactor;
}
