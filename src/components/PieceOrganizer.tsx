// Scrollable component to organize and display puzzle pieces under the main puzzle area

import React, { useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  ImageSourcePropType,
} from 'react-native';
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
import { useGameStore } from '../stores/game';
import { organizePiecesByType } from '../engine/hints';
import { colors, spacing, typography } from '../theme';
import { SortingCriteria } from './PieceSortingPanel';
import { Piece as PieceType } from '../types';
import { JigsawPieceShape } from './JigsawPieceShape';
import {
  getMobilePieceSize,
  getMobileTouchTargetSize,
  isMobileDevice,
} from '../utils/device';

interface PieceOrganizerProps {
  sortingCriteria: SortingCriteria;
}

interface PieceItemProps {
  piece: PieceType;
  index: number;
  imageAsset: ImageSourcePropType;
  boardCols: number;
  boardRows: number;
}

const PieceItem: React.FC<PieceItemProps> = ({
  piece,
  index,
  imageAsset,
  boardCols,
  boardRows,
}) => {
  const { movePiece, bringToFront } = useGameStore();

  // Animation values for dragging
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);
  const scale = useSharedValue(1);

  // Mobile-responsive sizing
  const isMobile = isMobileDevice();
  const pieceSize = getMobilePieceSize();
  const touchTargetSize = getMobileTouchTargetSize();
  const miniatureSize = pieceSize; // Use mobile-responsive size instead of fixed 40px
  const scaleRatio = miniatureSize / Math.max(piece.width, piece.height);

  const handlePress = () => {
    // Bring piece to front and move it to center of canvas for easy access
    bringToFront(piece.id);
    // Move to a proper staging area that doesn't interfere with the puzzle
    // Position pieces in the bottom area of the canvas, not off to the side
    const stagingPosition = {
      x: boardCols * piece.width * 0.5 - piece.width * 0.5, // Center horizontally in the puzzle area
      y: boardRows * piece.height + 20, // Position below the puzzle grid with some padding
    };
    movePiece(piece.id, stagingPosition.x, stagingPosition.y);
  };

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
      scale.value = withSpring(1.2); // Slightly enlarge when picked up
    },
    onActive: (event, context) => {
      // Use smooth spring animations for better performance
      translateX.value = withSpring(context.startX + event.translationX, {
        damping: 15,
        stiffness: 150,
      });
      translateY.value = withSpring(context.startY + event.translationY, {
        damping: 15,
        stiffness: 150,
      });
    },
    onEnd: (event) => {
      // If dragged upward significantly, move to main canvas
      if (event.translationY < -100) {
        // Reset position and move piece to canvas
        translateX.value = withSpring(0);
        translateY.value = withSpring(0);
        scale.value = withSpring(1);

        // Move piece to canvas staging area with better positioning
        runOnJS(bringToFront)(piece.id);
        const stagingX = boardCols * piece.width * 0.5 - piece.width * 0.5; // Center horizontally
        const stagingY = boardRows * piece.height + 20; // Position below the puzzle grid
        runOnJS(movePiece)(piece.id, stagingX, stagingY);
      } else {
        // Return to original position with smooth animation
        translateX.value = withSpring(0, {
          damping: 20,
          stiffness: 200,
        });
        translateY.value = withSpring(0, {
          damping: 20,
          stiffness: 200,
        });
        scale.value = withSpring(1);
      }
    },
  });

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: translateX.value },
      { translateY: translateY.value },
      { scale: scale.value },
    ] as any, // Type assertion to fix React Native transform compatibility
  }));

  return (
    <View style={styles.pieceItemContainer}>
      <PanGestureHandler onGestureEvent={gestureHandler}>
        <Animated.View style={[styles.pieceItem, animatedStyle]}>
          <TouchableOpacity
            style={[
              styles.piecePreview,
              isMobile && styles.mobileePiecePreview,
              {
                width: touchTargetSize,
                height: touchTargetSize,
              },
            ]}
            onPress={handlePress}
            activeOpacity={0.7}
          >
            {piece.shape === 'JIGSAW' && piece.edges ? (
              <View
                style={[
                  styles.miniaturePieceContainer,
                  {
                    width: touchTargetSize,
                    height: touchTargetSize,
                  },
                ]}
              >
                <JigsawPieceShape
                  width={miniatureSize}
                  height={miniatureSize}
                  edges={piece.edges}
                  imageAsset={imageAsset}
                  style={{
                    transform: [{ scale: scaleRatio }],
                    width: piece.width * scaleRatio,
                    height: piece.height * scaleRatio,
                  }}
                  boardWidth={miniatureSize * boardCols}
                  boardHeight={miniatureSize * boardRows}
                  totalCols={boardCols}
                  totalRows={boardRows}
                  pieceCol={piece.col}
                  pieceRow={piece.row}
                />
              </View>
            ) : (
              <View
                style={[
                  styles.miniaturePieceContainer,
                  {
                    width: touchTargetSize,
                    height: touchTargetSize,
                  },
                ]}
              >
                {/* Simplified approach: render full image at small scale with overlay showing piece location */}
                <View
                  style={[
                    styles.squarePiecePreview,
                    {
                      width: miniatureSize,
                      height: miniatureSize,
                    },
                  ]}
                >
                  {/* Show full image as background */}
                  <Image
                    source={imageAsset}
                    style={[
                      styles.fullImageSimple,
                      {
                        width: miniatureSize,
                        height: miniatureSize,
                      },
                    ]}
                    resizeMode="cover"
                  />

                  {/* Add semi-transparent overlay with grid lines to show piece location */}
                  <View style={styles.pieceLocationOverlay}>
                    <View
                      style={[
                        styles.gridOverlay,
                        {
                          borderLeftWidth: piece.col === 0 ? 2 : 1,
                          borderTopWidth: piece.row === 0 ? 2 : 1,
                          borderRightWidth: piece.col === boardCols - 1 ? 2 : 1,
                          borderBottomWidth:
                            piece.row === boardRows - 1 ? 2 : 1,
                        },
                      ]}
                    />
                  </View>

                  {/* Add piece number overlay */}
                  <View style={styles.pieceOverlay}>
                    <Text
                      style={[
                        styles.pieceNumber,
                        isMobile && styles.mobilePieceNumber,
                      ]}
                    >
                      {index + 1}
                    </Text>
                  </View>
                </View>
              </View>
            )}
          </TouchableOpacity>
          <Text
            style={[styles.pieceLabel, isMobile && styles.mobilePieceLabel]}
          >
            {piece.row}-{piece.col}
          </Text>
        </Animated.View>
      </PanGestureHandler>
    </View>
  );
};

export const PieceOrganizer: React.FC<PieceOrganizerProps> = ({
  sortingCriteria,
}) => {
  const { currentPuzzle } = useGameStore();

  // Mobile-responsive sizing
  const isMobile = isMobileDevice();
  const touchTargetSize = getMobileTouchTargetSize();

  const organizedPieces = useMemo(() => {
    if (!currentPuzzle) return null;

    const { board } = currentPuzzle;
    // Only show pieces that are not placed and are positioned in carousel area (off-screen or in staging)
    const unplacedPieces = Object.values(board.pieces).filter(
      (piece) => !piece.placed && (piece.x < 0 || piece.y > board.height)
    );

    switch (sortingCriteria) {
      case 'type': {
        const organized = organizePiecesByType(board);
        return {
          title: 'Sorted by Type',
          sections: [
            {
              title: 'Corners',
              pieces: organized.corners.filter(
                (p) => !p.placed && (p.x < 0 || p.y > board.height)
              ),
              color: colors.warning,
              icon: '📐',
            },
            {
              title: 'Edges',
              pieces: organized.edges.filter(
                (p) => !p.placed && (p.x < 0 || p.y > board.height)
              ),
              color: colors.secondary,
              icon: '📏',
            },
            {
              title: 'Interior',
              pieces: organized.interior.filter(
                (p) => !p.placed && (p.x < 0 || p.y > board.height)
              ),
              color: colors.primary,
              icon: '🔳',
            },
          ],
        };
      }
      case 'color':
        return {
          title: 'Sorted by Color',
          sections: [
            {
              title: 'All Pieces',
              pieces: unplacedPieces,
              color: colors.primary,
              icon: '🎨',
            },
          ],
        };
      case 'progress':
        // Sort by distance to target position
        return {
          title: 'Sorted by Progress',
          sections: [
            {
              title: 'Closest to Target',
              pieces: unplacedPieces.sort((a, b) => {
                const distA = Math.sqrt(
                  Math.pow(a.x - a.targetX, 2) + Math.pow(a.y - a.targetY, 2)
                );
                const distB = Math.sqrt(
                  Math.pow(b.x - b.targetX, 2) + Math.pow(b.y - b.targetY, 2)
                );
                return distA - distB;
              }),
              color: colors.success,
              icon: '🎯',
            },
          ],
        };
      default:
        return {
          title: 'All Pieces',
          sections: [
            {
              title: 'Unplaced Pieces',
              pieces: unplacedPieces,
              color: colors.outline,
              icon: '🧩',
            },
          ],
        };
    }
  }, [currentPuzzle, sortingCriteria]);

  if (!currentPuzzle || !organizedPieces) {
    return null;
  }

  const totalPieces = organizedPieces.sections.reduce(
    (sum, section) => sum + section.pieces.length,
    0
  );
  const { board } = currentPuzzle;

  return (
    <View style={[styles.container, isMobile && styles.mobileContainer]}>
      <View style={styles.header}>
        <Text style={styles.title}>🧩 Puzzle Pieces Carousel</Text>
        <Text style={[styles.subtitle, isMobile && styles.mobileSubtitle]}>
          {totalPieces} pieces remaining • Tap to bring to staging area • Drag
          up to move to puzzle
        </Text>
      </View>

      <ScrollView
        horizontal
        style={styles.scrollContainer}
        contentContainerStyle={[
          styles.scrollContent,
          isMobile && styles.mobileScrollContent,
        ]}
        showsHorizontalScrollIndicator={false}
        pagingEnabled={false}
        decelerationRate="fast"
        snapToInterval={isMobile ? touchTargetSize + spacing.md : 140}
        snapToAlignment="start"
      >
        {organizedPieces.sections.map((section, sectionIndex) => (
          <View key={sectionIndex} style={styles.section}>
            <View
              style={[styles.sectionHeader, { borderLeftColor: section.color }]}
            >
              <Text style={styles.sectionTitle}>
                {section.icon} {section.title}
              </Text>
              <Text style={styles.sectionCount}>{section.pieces.length}</Text>
            </View>

            <ScrollView
              horizontal
              style={styles.piecesContainer}
              contentContainerStyle={styles.piecesContent}
              showsHorizontalScrollIndicator={false}
            >
              {section.pieces.map((piece, pieceIndex) => (
                <PieceItem
                  key={piece.id}
                  piece={piece}
                  index={pieceIndex}
                  imageAsset={board.imageAsset}
                  boardCols={board.cols}
                  boardRows={board.rows}
                />
              ))}
            </ScrollView>
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.surface,
    borderTopWidth: 2,
    borderTopColor: colors.primary,
    maxHeight: 150, // Slightly increased height for better carousel appearance
    shadowColor: colors.shadow,
    shadowOffset: {
      width: 0,
      height: -2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
  mobileContainer: {
    maxHeight: 180, // Increased height for mobile to accommodate larger pieces
  },
  header: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.outline,
    backgroundColor: 'rgba(107, 158, 255, 0.05)',
  },
  title: {
    fontSize: typography.md,
    fontWeight: typography.weight.semibold,
    color: colors.primary,
  },
  subtitle: {
    fontSize: typography.sm,
    color: colors.secondary,
    marginTop: spacing.xs / 2,
  },
  mobileSubtitle: {
    fontSize: typography.xs, // Smaller on mobile to fit better
  },
  scrollContainer: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    alignItems: 'center',
  },
  mobileScrollContent: {
    paddingHorizontal: spacing.lg, // More padding on mobile for easier scrolling
  },
  section: {
    marginRight: spacing.lg,
    minWidth: 130,
    backgroundColor: colors.background,
    borderRadius: spacing.sm,
    padding: spacing.sm,
    shadowColor: colors.shadow,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingLeft: spacing.sm,
    paddingRight: spacing.xs,
    paddingVertical: spacing.xs,
    borderLeftWidth: 4,
    marginBottom: spacing.sm,
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    borderRadius: spacing.xs,
  },
  sectionTitle: {
    fontSize: typography.sm,
    fontWeight: typography.weight.semibold,
    color: colors.onSurface,
    flex: 1,
  },
  sectionCount: {
    fontSize: typography.xs,
    color: colors.onPrimary,
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.xs,
    paddingVertical: spacing.xs / 2,
    borderRadius: spacing.sm,
    minWidth: 24,
    textAlign: 'center',
    fontWeight: typography.weight.bold,
  },
  piecesContainer: {
    maxHeight: 70,
  },
  piecesContent: {
    paddingRight: spacing.md,
    alignItems: 'center',
  },
  pieceItemContainer: {
    marginRight: spacing.sm,
  },
  pieceItem: {
    alignItems: 'center',
  },
  piecePreview: {
    width: 44,
    height: 44,
    backgroundColor: colors.background,
    borderRadius: spacing.sm,
    borderWidth: 2,
    borderColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.xs / 2,
    overflow: 'hidden',
    shadowColor: colors.shadow,
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
  mobileePiecePreview: {
    borderWidth: 3, // Thicker border for better visibility on mobile
    borderRadius: spacing.md, // Larger border radius
    shadowOpacity: 0.3, // More prominent shadow
    shadowRadius: 3,
    elevation: 3,
  },
  miniaturePieceContainer: {
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  squarePiecePreview: {
    borderRadius: spacing.xs,
    overflow: 'hidden',
    position: 'relative',
    backgroundColor: 'white', // Ensure white background for contrast
  },
  imageClipContainer: {
    width: '100%',
    height: '100%',
    overflow: 'hidden',
    position: 'relative',
    backgroundColor: 'transparent', // Ensure container background is transparent
  },
  clippedImage: {
    position: 'absolute',
  },
  fullImage: {
    width: '100%',
    height: '100%',
  },
  fullImageSimple: {
    position: 'absolute',
    top: 0,
    left: 0,
  },
  pieceLocationOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
  },
  gridOverlay: {
    flex: 1,
    borderColor: colors.primary,
    borderStyle: 'solid',
  },
  pieceOverlay: {
    position: 'absolute',
    top: 2,
    right: 2,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    borderRadius: 8,
    width: 16,
    height: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  pieceNumber: {
    fontSize: 10,
    color: 'white',
    fontWeight: typography.weight.bold,
    textAlign: 'center',
  },
  mobilePieceNumber: {
    fontSize: 12, // Larger text for mobile
  },
  simplePiecePreview: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    borderStyle: 'dashed',
  },
  pieceIndex: {
    fontSize: typography.xs,
    color: colors.secondary,
    fontWeight: typography.weight.medium,
  },
  pieceLabel: {
    fontSize: typography.xs,
    color: colors.secondary,
    textAlign: 'center',
  },
  mobilePieceLabel: {
    fontSize: typography.sm, // Larger label text for mobile
    fontWeight: typography.weight.medium,
  },
});
