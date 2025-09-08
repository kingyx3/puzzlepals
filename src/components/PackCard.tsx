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

  return (
    <View style={[styles.container, style]}>
      <View style={styles.header}>
        <Image source={pack.coverAsset} style={styles.coverImage} />
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
            <Image
              source={puzzle.imageAsset}
              style={styles.puzzleImage}
              {...getAccessibilityProps({
                label: `Preview image for ${puzzle.titleKey} puzzle`,
                role: 'image',
              })}
            />
            <Text
              style={styles.puzzleTitle}
              accessible={true}
              accessibilityRole="text"
            >
              {puzzle.titleKey}
            </Text>
            <View style={styles.difficultyBadge}>
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

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    marginVertical: spacing.sm,
    ...shadows.md,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  coverImage: {
    width: 60,
    height: 60,
    borderRadius: borderRadius.md,
    marginRight: spacing.md,
  },
  title: {
    fontSize: typography.xl,
    fontWeight: typography.weight.bold,
    color: colors.primary,
    flex: 1,
  },
  puzzlesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  puzzleItem: {
    backgroundColor: colors.surfaceVariant,
    borderRadius: borderRadius.md,
    padding: spacing.md, // Increased from spacing.sm for better touch area
    minWidth: 120, // Increased from 100 for better touch targets for kids
    minHeight: layout.touchTargetLarge + 40, // Use larger touch target for kids
    alignItems: 'center',
    justifyContent: 'center',
    ...shadows.sm,
    // Added visual feedback for pressed state
    borderWidth: 2,
    borderColor: 'transparent',
  },
  puzzleItemPressed: {
    backgroundColor: colors.primary + '20', // Lighter version of primary color
    borderColor: colors.primary,
    transform: [{ scale: 0.98 }], // Slight scale down for pressed effect
    ...shadows.lg, // Enhanced shadow when pressed
  },
  puzzleImage: {
    width: 70, // Increased from 60 for better visibility for kids
    height: 70, // Increased from 60 for better visibility for kids
    borderRadius: borderRadius.sm,
    marginBottom: spacing.sm, // Increased from spacing.xs
  },
  puzzleTitle: {
    fontSize: typography.md, // Increased from typography.sm for better readability
    fontWeight: typography.weight.semibold, // Increased from medium for better emphasis
    color: colors.onSurface,
    textAlign: 'center',
    marginBottom: spacing.sm, // Increased from spacing.xs
    lineHeight: typography.md * typography.lineHeight.normal, // Added line height for better readability
  },
  difficultyBadge: {
    backgroundColor: colors.secondary,
    paddingHorizontal: spacing.sm, // Increased from spacing.xs for better touch area
    paddingVertical: spacing.xs, // Increased from 2 for better visual balance
    borderRadius: borderRadius.sm,
    minHeight: 24, // Added minimum height for consistency
    alignItems: 'center',
    justifyContent: 'center',
  },
  difficultyText: {
    fontSize: typography.sm, // Increased from typography.xs for better readability
    fontWeight: typography.weight.semibold, // Increased from medium for better emphasis
    color: colors.onSecondary,
    textAlign: 'center',
  },
});
