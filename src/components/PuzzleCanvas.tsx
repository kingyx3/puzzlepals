// Main puzzle canvas component

import React, { useEffect, useCallback } from 'react';
import { View, StyleSheet, Image } from 'react-native';
import * as Haptics from 'expo-haptics';
import { Piece } from './Piece';
import { useGameStore } from '../stores/game';
import { useSettingsStore } from '../stores/settings';
import { useAchievementStore } from '../stores/achievements';
import { colors } from '../theme';
import { playSnapSound, playCelebrationSound } from '../utils/sound';

interface PuzzleCanvasProps {
  onPuzzleComplete?: () => void;
  onPieceSnap?: () => void;
}

export const PuzzleCanvas: React.FC<PuzzleCanvasProps> = ({
  onPuzzleComplete,
  onPieceSnap,
}) => {
  const {
    currentPuzzle,
    movePiece,
    trySnapPiece,
    bringToFront,
    showGhostImage,
    highlightedPieces,
  } = useGameStore();
  const { hapticEnabled, soundEnabled } = useSettingsStore();

  const handlePieceMove = useCallback(
    (pieceId: string, x: number, y: number) => {
      movePiece(pieceId, x, y);
    },
    [movePiece]
  );

  const handlePieceMoveEnd = useCallback(
    async (pieceId: string) => {
      const wasSnapped = trySnapPiece(pieceId);

      if (wasSnapped) {
        if (hapticEnabled) {
          await Haptics.notificationAsync(
            Haptics.NotificationFeedbackType.Success
          );
        }
        if (soundEnabled) {
          await playSnapSound();
        }
        // Trigger visual snap effect
        onPieceSnap?.();
      }
    },
    [trySnapPiece, hapticEnabled, soundEnabled, onPieceSnap]
  );

  const handleBringToFront = useCallback(
    (pieceId: string) => {
      bringToFront(pieceId);
    },
    [bringToFront]
  );

  // Check for puzzle completion
  useEffect(() => {
    if (currentPuzzle?.board.isCompleted && onPuzzleComplete) {
      // Record completion stats for achievements
      const completionTime = Date.now() - currentPuzzle.startTime;
      const { recordPuzzleCompletion, getEfficiencyScore } =
        useAchievementStore.getState();

      const efficiency = getEfficiencyScore(
        completionTime,
        currentPuzzle.hintsUsed,
        currentPuzzle.difficulty
      );

      recordPuzzleCompletion({
        puzzleId: currentPuzzle.puzzle.id,
        difficulty: currentPuzzle.difficulty,
        completionTime,
        hintsUsed: currentPuzzle.hintsUsed,
        completedAt: Date.now(),
        efficiency,
      });

      if (soundEnabled) {
        playCelebrationSound();
      }
      onPuzzleComplete();
    }
  }, [
    currentPuzzle?.board.isCompleted,
    currentPuzzle?.startTime,
    currentPuzzle?.hintsUsed,
    currentPuzzle?.difficulty,
    currentPuzzle?.puzzle.id,
    onPuzzleComplete,
    soundEnabled,
  ]);

  if (!currentPuzzle) {
    return null;
  }

  const { board } = currentPuzzle;
  const pieces = Object.values(board.pieces);

  return (
    <View style={styles.container}>
      <View
        style={[styles.canvas, { width: board.width, height: board.height }]}
      >
        {/* Ghost image overlay for hints */}
        {showGhostImage && (
          <View style={styles.ghostImageContainer}>
            <Image
              source={
                typeof board.imageAsset === 'number'
                  ? board.imageAsset
                  : { uri: board.imageAsset }
              }
              style={[
                styles.ghostImage,
                { width: board.width, height: board.height },
              ]}
              resizeMode="cover"
            />
          </View>
        )}

        {/* Render puzzle outline/grid */}
        <View style={styles.puzzleArea}>
          {pieces.map((piece) => (
            <View
              key={`target-${piece.id}`}
              style={[
                styles.targetArea,
                {
                  left: piece.targetX,
                  top: piece.targetY,
                  width: piece.width,
                  height: piece.height,
                },
                highlightedPieces.includes(piece.id) &&
                  styles.highlightedTarget,
              ]}
            />
          ))}
        </View>

        {/* Render puzzle pieces */}
        {pieces.map((piece) => (
          <Piece
            key={piece.id}
            piece={piece}
            imageAsset={board.imageAsset}
            onMove={handlePieceMove}
            onMoveEnd={handlePieceMoveEnd}
            onBringToFront={handleBringToFront}
            highlighted={highlightedPieces.includes(piece.id)}
            boardWidth={board.width}
            boardHeight={board.height}
            totalCols={board.cols}
            totalRows={board.rows}
            padding={20} // Pass the default padding used in createBoard
          />
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background,
  },
  canvas: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    shadowColor: colors.shadow,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    position: 'relative',
  },
  ghostImageContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    zIndex: 1,
    opacity: 0.3,
  },
  ghostImage: {
    borderRadius: 12,
  },
  puzzleArea: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  targetArea: {
    position: 'absolute',
    borderWidth: 1,
    borderColor: colors.outline,
    borderStyle: 'dashed',
    backgroundColor: 'rgba(107, 158, 255, 0.05)',
  },
  highlightedTarget: {
    borderWidth: 3,
    borderColor: colors.secondary,
    borderStyle: 'solid',
    backgroundColor: 'rgba(255, 184, 107, 0.2)',
  },
});
