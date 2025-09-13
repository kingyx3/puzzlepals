// Individual puzzle piece component

import React, { memo } from 'react';
import { Image, StyleSheet, View } from 'react-native';
import {
  PanGestureHandler,
  PanGestureHandlerGestureEvent,
} from 'react-native-gesture-handler';
import Animated, {
  useAnimatedGestureHandler,
  useAnimatedStyle,
  useSharedValue,
  runOnJS,
  withSpring,
} from 'react-native-reanimated';
import { Piece as PieceType } from '../types';
import { JigsawPieceShape } from './JigsawPieceShape';

/**
 * Calculate image positioning and scaling for cropping to show only the piece's portion
 * This must match the logic in computeTargetRects to ensure proper alignment
 */
function calculateImageCrop(
  piece: PieceType,
  boardWidth: number,
  boardHeight: number,
  totalCols: number,
  totalRows: number,
  padding: number = 20 // Default padding used in createBoard
) {
  // Calculate available space (same logic as computeTargetRects)
  const availableWidth = boardWidth - padding * 2;
  const availableHeight = boardHeight - padding * 2;

  // Calculate the size of each piece using available space
  const pieceWidth = availableWidth / totalCols;
  const pieceHeight = availableHeight / totalRows;

  // Scale the entire source image to match the available space
  const scaledImageWidth = availableWidth;
  const scaledImageHeight = availableHeight;

  // Calculate the offset to show only this piece's portion of the full image
  const offsetX = -piece.col * pieceWidth;
  const offsetY = -piece.row * pieceHeight;

  return {
    width: scaledImageWidth,
    height: scaledImageHeight,
    left: offsetX,
    top: offsetY,
  };
}

interface PieceProps {
  piece: PieceType;
  imageAsset: number;
  onMove: (pieceId: string, x: number, y: number) => void;
  onMoveEnd: (pieceId: string) => void;
  onBringToFront: (pieceId: string) => void;
  disabled?: boolean;
  highlighted?: boolean;
  // Add board dimensions for image cropping
  boardWidth?: number;
  boardHeight?: number;
  totalCols?: number;
  totalRows?: number;
  padding?: number; // Add padding parameter
}

export const Piece: React.FC<PieceProps> = memo(
  ({
    piece,
    imageAsset,
    onMove,
    onMoveEnd,
    onBringToFront,
    disabled = false,
    highlighted = false,
    boardWidth = 400,
    boardHeight = 400,
    totalCols = 2,
    totalRows = 2,
    padding = 20, // Default padding matching createBoard
  }) => {
    // Only re-initialize shared values when piece position changes or when piece is reset
    const translateX = useSharedValue(piece.x);
    const translateY = useSharedValue(piece.y);

    // Update shared values when piece position changes externally (like reset)
    React.useEffect(() => {
      translateX.value = piece.x;
      translateY.value = piece.y;
    }, [piece.x, piece.y, translateX, translateY]);

    // Update position when piece prop changes
    React.useEffect(() => {
      translateX.value = withSpring(piece.x, {
        damping: 18,
        stiffness: 120,
      });
      translateY.value = withSpring(piece.y, {
        damping: 18,
        stiffness: 120,
      });
    }, [piece.x, piece.y, translateX, translateY]);

    const gestureHandler = useAnimatedGestureHandler<
      PanGestureHandlerGestureEvent,
      {
        startX: number;
        startY: number;
      }
    >({
      onStart: (_, context) => {
        context.startX = translateX.value;
        context.startY = translateY.value;
        runOnJS(onBringToFront)(piece.id);
      },
      onActive: (event, context) => {
        const newX = context.startX + event.translationX;
        const newY = context.startY + event.translationY;

        // Use smooth spring animation for better performance
        translateX.value = newX;
        translateY.value = newY;

        // Only update JS state periodically to reduce bridge calls and improve performance
        // Remove constant JS calls during active dragging
      },
      onEnd: (event, context) => {
        const finalX = context.startX + event.translationX;
        const finalY = context.startY + event.translationY;

        // Update JS state only once at the end for better performance
        runOnJS(onMove)(piece.id, finalX, finalY);
        runOnJS(onMoveEnd)(piece.id);
      },
    });

    const animatedStyle = useAnimatedStyle(() => ({
      transform: [
        { translateX: translateX.value },
        { translateY: translateY.value },
      ] as any, // Type assertion to fix React Native transform compatibility
    }));

    const pieceStyle = [
      styles.piece,
      {
        width: piece.width,
        height: piece.height,
        zIndex: piece.zIndex,
      },
      // Remove border radius for placed pieces to avoid covering picture
      piece.placed && styles.placedPiece,
      highlighted && styles.highlighted,
      animatedStyle,
    ];

    // Calculate image cropping for this piece
    const imageCrop = calculateImageCrop(
      piece,
      boardWidth,
      boardHeight,
      totalCols,
      totalRows,
      padding
    );

    if (disabled || piece.placed) {
      // Static piece (no gesture handling)
      return (
        <Animated.View style={pieceStyle}>
          {piece.shape === 'JIGSAW' && piece.edges ? (
            <JigsawPieceShape
              width={piece.width}
              height={piece.height}
              edges={piece.edges}
              imageAsset={imageAsset}
              style={{ opacity: piece.placed ? 1 : 0.8 }}
              placed={piece.placed} // Pass placed status to remove stroke outline
              // Pass cropping info for jigsaw pieces
              boardWidth={boardWidth}
              boardHeight={boardHeight}
              totalCols={totalCols}
              totalRows={totalRows}
              pieceCol={piece.col}
              pieceRow={piece.row}
              padding={padding} // Pass padding for correct cropping
            />
          ) : (
            <View
              style={[
                styles.imageContainer,
                piece.placed && { borderRadius: 0 }, // Remove border radius for placed pieces
              ]}
            >
              <Image
                source={imageAsset}
                style={[
                  styles.croppedImage,
                  {
                    width: imageCrop.width,
                    height: imageCrop.height,
                    left: imageCrop.left,
                    top: imageCrop.top,
                    opacity: piece.placed ? 1 : 0.8,
                  },
                ]}
                resizeMode="cover"
              />
            </View>
          )}
          {piece.placed && <Animated.View style={styles.placedOverlay} />}
        </Animated.View>
      );
    }

    return (
      <PanGestureHandler onGestureEvent={gestureHandler}>
        <Animated.View style={pieceStyle}>
          {piece.shape === 'JIGSAW' && piece.edges ? (
            <JigsawPieceShape
              width={piece.width}
              height={piece.height}
              edges={piece.edges}
              imageAsset={imageAsset}
              placed={piece.placed} // Pass placed status to remove stroke outline
              // Pass cropping info for jigsaw pieces
              boardWidth={boardWidth}
              boardHeight={boardHeight}
              totalCols={totalCols}
              totalRows={totalRows}
              pieceCol={piece.col}
              pieceRow={piece.row}
              padding={padding} // Pass padding for correct cropping
            />
          ) : (
            <View
              style={[
                styles.imageContainer,
                piece.placed && { borderRadius: 0 }, // Remove border radius for placed pieces
              ]}
            >
              <Image
                source={imageAsset}
                style={[
                  styles.croppedImage,
                  {
                    width: imageCrop.width,
                    height: imageCrop.height,
                    left: imageCrop.left,
                    top: imageCrop.top,
                  },
                ]}
                resizeMode="cover"
              />
            </View>
          )}
        </Animated.View>
      </PanGestureHandler>
    );
  }
);

const styles = StyleSheet.create({
  piece: {
    position: 'absolute',
    borderRadius: 4,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  placedPiece: {
    borderRadius: 0, // Remove border radius for placed pieces to avoid covering picture
    shadowOpacity: 0.1, // Reduce shadow for placed pieces
    elevation: 2, // Lower elevation for placed pieces
  },
  imageContainer: {
    width: '100%',
    height: '100%',
    overflow: 'hidden',
    borderRadius: 4,
  },
  image: {
    width: '100%',
    height: '100%',
    borderRadius: 4,
  },
  croppedImage: {
    position: 'absolute',
  },
  placedOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(76, 175, 80, 0.05)', // Much more transparent
    borderWidth: 0, // Remove border completely
    borderRadius: 0, // Remove border radius
  },
  highlighted: {
    borderWidth: 3,
    borderColor: '#FFB86B',
    shadowColor: '#FFB86B',
    shadowOpacity: 0.6,
    shadowRadius: 8,
    elevation: 8,
  },
});

// Add display name for debugging
Piece.displayName = 'Piece';
