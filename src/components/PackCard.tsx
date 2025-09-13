// Puzzle pack card component for home screen

import React, { useState } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { PuzzlePack, PuzzleMeta } from '../types';
import {
  colors,
  spacing,
  borderRadius,
  typography,
  shadows,
  layout,
} from '../theme';
import {
  getAccessibilityProps,
  getPuzzleAccessibilityLabel,
} from '../utils/accessibility';

interface PackCardProps {
  pack: PuzzlePack;
  onSelectPuzzle: (puzzle: PuzzleMeta) => void;
  style?: object;
}

export const PackCard: React.FC<PackCardProps> = ({
  pack,
  onSelectPuzzle,
  style,
}) => {
  const [pressedPuzzle, setPressedPuzzle] = useState<string | null>(null);

  const handlePuzzlePress = (puzzle: PuzzleMeta) => {
    setPressedPuzzle(puzzle.id);
    // Add a slight delay for visual feedback before navigating
    setTimeout(() => {
      onSelectPuzzle(puzzle);
      setPressedPuzzle(null);
    }, 150);
  };

  // Get pack-specific gradient colors
  const getPackGradient = (packId: string) => {
    switch (packId) {
      case 'animals':
        return colors.cardGradients.animals;
      case 'vehicles':
        return colors.cardGradients.vehicles;
      case 'advanced':
        return colors.cardGradients.advanced;
      default:
        return colors.cardGradients.nature;
    }
  };

  const packGradient = getPackGradient(pack.id);

  return (
    <View style={[styles.container, style]}>
      {/* Header with enhanced visual appeal */}
      <View
        style={[
          styles.header,
          {
            backgroundColor: packGradient[0],
            borderBottomColor: packGradient[1],
          },
        ]}
      >
        <View style={styles.coverImageContainer}>
          <Image source={pack.coverAsset} style={styles.coverImage} />
        </View>
        <Text style={styles.title}>{pack.titleKey}</Text>
      </View>

      <View style={styles.puzzlesGrid}>
        {pack.puzzles.map((puzzle) => (
          <TouchableOpacity
            key={puzzle.id}
            style={[
              styles.puzzleItem,
              pressedPuzzle === puzzle.id && styles.puzzleItemPressed,
            ]}
            onPress={() => handlePuzzlePress(puzzle)}
            activeOpacity={0.8}
            {...getAccessibilityProps({
              label: getPuzzleAccessibilityLabel(
                puzzle.titleKey,
                getDifficultyLabel(puzzle.defaultDifficulty)
              ),
              hint: 'Tap to start this puzzle',
              role: 'button',
            })}
          >
            <View style={styles.puzzleImageContainer}>
              <Image
                source={puzzle.imageAsset}
                style={styles.puzzleImage}
                {...getAccessibilityProps({
                  label: `Preview image for ${puzzle.titleKey} puzzle`,
                  role: 'image',
                })}
              />
            </View>
            <Text
              style={styles.puzzleTitle}
              accessible={true}
              accessibilityRole="text"
            >
              {puzzle.titleKey}
            </Text>
            <View
              style={[
                styles.difficultyBadge,
                {
                  backgroundColor: getDifficultyColor(puzzle.defaultDifficulty),
                },
              ]}
            >
              <Text style={styles.difficultyText}>
                {getDifficultyLabel(puzzle.defaultDifficulty)}
              </Text>
            </View>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

function getDifficultyLabel(difficulty: string): string {
  switch (difficulty) {
    case 'AGES_3_5':
      return '2×2';
    case 'AGES_6_8':
      return '3×3';
    case 'AGES_9_10':
      return '4×4';
    case 'AGES_11_PLUS':
      return '6×6';
    case 'EASY':
      return 'Easy 4×4';
    case 'MEDIUM':
      return 'Medium 6×6';
    case 'HARD':
      return 'Hard 8×8';
    case 'EXPERT':
      return 'Expert 10×10';
    case 'MASTER':
      return 'Master 12×8';
    default:
      return '2×2';
  }
}

function getDifficultyColor(difficulty: string): string {
  switch (difficulty) {
    case 'AGES_3_5':
    case 'EASY':
      return colors.success;
    case 'AGES_6_8':
    case 'MEDIUM':
      return colors.secondary;
    case 'AGES_9_10':
    case 'HARD':
      return colors.warning;
    case 'AGES_11_PLUS':
    case 'EXPERT':
    case 'MASTER':
      return colors.accent;
    default:
      return colors.success;
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.xl,
    marginVertical: spacing.sm,
    overflow: 'hidden',
    ...shadows.lg,
    borderWidth: 1,
    borderColor: colors.outline,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
    borderBottomWidth: 3,
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
  },
  coverImageContainer: {
    ...shadows.md,
    borderRadius: borderRadius.md,
    overflow: 'hidden',
  },
  coverImage: {
    width: 60,
    height: 60,
    borderRadius: borderRadius.md,
  },
  title: {
    fontSize: typography.xl,
    fontWeight: typography.weight.bold,
    color: colors.primary,
    flex: 1,
    marginLeft: spacing.md,
    textShadowColor: 'rgba(255, 255, 255, 0.5)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  puzzlesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: layout.kidFriendlySpacing.cardGap,
    padding: spacing.md,
  },
  puzzleItem: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    minWidth: 120,
    minHeight: layout.touchTargetXLarge + 40,
    alignItems: 'center',
    justifyContent: 'center',
    ...shadows.md,
    borderWidth: 2,
    borderColor: colors.outline,
    // Enhanced visual appeal
    transform: [{ scale: 1 }],
  },
  puzzleItemPressed: {
    backgroundColor: colors.primaryLight,
    borderColor: colors.primary,
    transform: [{ scale: 0.96 }],
    ...shadows.xl,
    shadowColor: colors.primary,
    shadowOpacity: 0.3,
  },
  puzzleImageContainer: {
    ...shadows.sm,
    borderRadius: borderRadius.md,
    overflow: 'hidden',
    marginBottom: spacing.sm,
  },
  puzzleImage: {
    width: 70,
    height: 70,
    borderRadius: borderRadius.md,
  },
  puzzleTitle: {
    fontSize: typography.md,
    fontWeight: typography.weight.semibold,
    color: colors.onSurface,
    textAlign: 'center',
    marginBottom: spacing.sm,
    lineHeight: typography.md * typography.lineHeight.normal,
  },
  difficultyBadge: {
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.round,
    minHeight: 28,
    alignItems: 'center',
    justifyContent: 'center',
    ...shadows.sm,
  },
  difficultyText: {
    fontSize: typography.sm,
    fontWeight: typography.weight.bold,
    color: colors.onPrimary,
    textAlign: 'center',
  },
});
