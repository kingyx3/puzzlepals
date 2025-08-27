// Main puzzle canvas component

import React, { useEffect, useCallback } from 'react';
import { View, StyleSheet } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import * as Haptics from 'expo-haptics';
import { Piece } from './Piece';
import { useGameStore } from '../stores/game';
import { useSettingsStore } from '../stores/settings';
import { colors } from '../theme';
import { playSnapSound, playCelebrationSound } from '../utils/sound';

interface PuzzleCanvasProps {
  onPuzzleComplete?: () => void;
}

export const PuzzleCanvas: React.FC<PuzzleCanvasProps> = ({ onPuzzleComplete }) => {
  const { currentPuzzle, movePiece, trySnapPiece, bringToFront } = useGameStore();
  const { hapticEnabled, soundEnabled } = useSettingsStore();
  
  const handlePieceMove = useCallback((pieceId: string, x: number, y: number) => {
    movePiece(pieceId, x, y);
  }, [movePiece]);
  
  const handlePieceMoveEnd = useCallback(async (pieceId: string) => {
    const wasSnapped = trySnapPiece(pieceId);
    
    if (wasSnapped) {
      if (hapticEnabled) {
        await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      }
      if (soundEnabled) {
        await playSnapSound();
      }
    }
  }, [trySnapPiece, hapticEnabled, soundEnabled]);
  
  const handleBringToFront = useCallback((pieceId: string) => {
    bringToFront(pieceId);
  }, [bringToFront]);
  
  // Check for puzzle completion
  useEffect(() => {
    if (currentPuzzle?.board.isCompleted && onPuzzleComplete) {
      if (soundEnabled) {
        playCelebrationSound();
      }
      onPuzzleComplete();
    }
  }, [currentPuzzle?.board.isCompleted, onPuzzleComplete, soundEnabled]);
  
  if (!currentPuzzle) {
    return null;
  }
  
  const { board } = currentPuzzle;
  const pieces = Object.values(board.pieces);
  
  return (
    <GestureHandlerRootView style={styles.container}>
      <View style={[styles.canvas, { width: board.width, height: board.height }]}>
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
          />
        ))}
      </View>
    </GestureHandlerRootView>
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
});