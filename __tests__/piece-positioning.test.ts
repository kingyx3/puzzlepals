// Test puzzle piece positioning logic
import { Piece } from '../src/types';

describe('Piece Positioning Logic', () => {
  const boardHeight = 400;
  
  // Mock pieces in different states
  const placedPiece: Piece = {
    id: 'piece_0_0',
    col: 0,
    row: 0,
    x: 100,
    y: 100,
    targetX: 100,
    targetY: 100,
    width: 50,
    height: 50,
    placed: true,
    zIndex: 1,
    shape: 'SQUARE',
  };

  const pieceInCarousel: Piece = {
    id: 'piece_0_1',
    col: 0,
    row: 1,
    x: -25, // In carousel area (x < 0)
    y: 420, // In carousel area (y > boardHeight)
    targetX: 100,
    targetY: 150,
    width: 50,
    height: 50,
    placed: false,
    zIndex: 1,
    shape: 'SQUARE',
  };

  const pieceOnCanvas: Piece = {
    id: 'piece_1_0',
    col: 1,
    row: 0,
    x: 200, // On canvas (x >= 0)
    y: 50,  // On canvas (y <= boardHeight)
    targetX: 150,
    targetY: 100,
    width: 50,
    height: 50,
    placed: false,
    zIndex: 1,
    shape: 'SQUARE',
  };

  test('PuzzleCanvas filter should show placed pieces and pieces on canvas', () => {
    // PuzzleCanvas filter: piece.placed || (piece.x >= 0 && piece.y <= board.height)
    const puzzleCanvasFilter = (piece: Piece) =>
      piece.placed || (piece.x >= 0 && piece.y <= boardHeight);

    expect(puzzleCanvasFilter(placedPiece)).toBe(true); // Placed piece should show
    expect(puzzleCanvasFilter(pieceInCarousel)).toBe(false); // Carousel piece should NOT show
    expect(puzzleCanvasFilter(pieceOnCanvas)).toBe(true); // Canvas piece should show
  });

  test('PieceOrganizer filter should show unplaced pieces in carousel area', () => {
    // PieceOrganizer filter: !piece.placed && (piece.x < 0 || piece.y > board.height)
    const pieceOrganizerFilter = (piece: Piece) =>
      !piece.placed && (piece.x < 0 || piece.y > boardHeight);

    expect(pieceOrganizerFilter(placedPiece)).toBe(false); // Placed piece should NOT show
    expect(pieceOrganizerFilter(pieceInCarousel)).toBe(true); // Carousel piece should show
    expect(pieceOrganizerFilter(pieceOnCanvas)).toBe(false); // Canvas piece should NOT show
  });

  test('Filters should be complementary - no piece should appear in both or neither', () => {
    const pieces = [placedPiece, pieceInCarousel, pieceOnCanvas];
    
    const puzzleCanvasFilter = (piece: Piece) =>
      piece.placed || (piece.x >= 0 && piece.y <= boardHeight);
    
    const pieceOrganizerFilter = (piece: Piece) =>
      !piece.placed && (piece.x < 0 || piece.y > boardHeight);

    pieces.forEach(piece => {
      const inCanvas = puzzleCanvasFilter(piece);
      const inCarousel = pieceOrganizerFilter(piece);
      
      // Each piece should appear in exactly one place (canvas OR carousel, not both or neither)
      expect(inCanvas || inCarousel).toBe(true); // Should appear somewhere
      expect(inCanvas && inCarousel).toBe(false); // Should not appear in both places
    });
  });
});