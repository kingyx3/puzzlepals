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
 */
function calculateImageCrop(
  piece: PieceType,
  boardWidth: number,
  boardHeight: number,
  totalCols: number,
  totalRows: number
) {
  // Calculate the scale factor to fit the entire source image within the board
  const scaleX = boardWidth / totalCols;
  const scaleY = boardHeight / totalRows;
  
  // Use the larger scale to ensure the image covers the entire board
  const scale = Math.max(scaleX, scaleY);
  
  // Calculate the scaled image dimensions
  const scaledImageWidth = scale * totalCols;
  const scaledImageHeight = scale * totalRows;
  
  // Calculate the offset needed to show only this piece's portion
  const offsetX = -piece.col * scale;
  const offsetY = -piece.row * scale;
  
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
      highlighted && styles.highlighted,
      animatedStyle,
    ];

    // Calculate image cropping for this piece
    const imageCrop = calculateImageCrop(
      piece,
      boardWidth,
      boardHeight,
      totalCols,
      totalRows
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
              // Pass cropping info for jigsaw pieces
              boardWidth={boardWidth}
              boardHeight={boardHeight}
              totalCols={totalCols}
              totalRows={totalRows}
              pieceCol={piece.col}
              pieceRow={piece.row}
            />
          ) : (
            <View style={styles.imageContainer}>
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
              // Pass cropping info for jigsaw pieces
              boardWidth={boardWidth}
              boardHeight={boardHeight}
              totalCols={totalCols}
              totalRows={totalRows}
              pieceCol={piece.col}
              pieceRow={piece.row}
            />
          ) : (
            <View style={styles.imageContainer}>
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
    backgroundColor: 'rgba(76, 175, 80, 0.1)',
    borderWidth: 2,
    borderColor: '#4CAF50',
    borderRadius: 4,
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
