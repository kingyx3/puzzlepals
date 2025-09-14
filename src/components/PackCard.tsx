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
} from '../theme';
import {
  getAccessibilityProps,
  getPuzzleAccessibilityLabel,
} from '../utils/accessibility';
import { isSmallMobileDevice } from '../utils/device';

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

  // Get pack-specific gradient colors with enhanced styling
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

  // Get pack-specific header styling
  const getPackHeaderStyle = (packId: string) => {
    const gradient = getPackGradient(packId);
    return {
      backgroundColor: gradient[0],
      borderBottomColor: gradient[1],
    };
  };

  const headerStyle = getPackHeaderStyle(pack.id);

  return (
    <View style={[styles.container, style]}>
      {/* Header with enhanced visual appeal */}
      <View style={[styles.header, headerStyle]}>
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
    borderColor: colors.outlineVariant,
    // Add subtle glow effect
    shadowColor: colors.shadowColored,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.lg,
    paddingVertical: spacing.xl,
    borderBottomWidth: 1,
    borderBottomColor: colors.outlineVariant,
    // Create gradient-like effect
    position: 'relative',
  },
  coverImageContainer: {
    ...shadows.md,
    borderRadius: borderRadius.lg,
    overflow: 'hidden',
    backgroundColor: colors.surface,
    padding: 4, // White padding around image
  },
  coverImage: {
    width: isSmallMobileDevice() ? 48 : 72, // Smaller on mobile
    height: isSmallMobileDevice() ? 48 : 72,
    borderRadius: borderRadius.md,
  },
  title: {
    fontSize: isSmallMobileDevice() ? typography.lg : typography.xxl,
    fontWeight: typography.weight.bold,
    color: colors.primary,
    flex: 1,
    marginLeft: spacing.lg,
    textShadowColor: colors.primaryUltraLight,
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
    letterSpacing: -0.3,
  },
  puzzlesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: isSmallMobileDevice() ? spacing.sm : spacing.md,
    padding: isSmallMobileDevice() ? spacing.md : spacing.lg,
    backgroundColor: colors.backgroundSecondary,
  },
  puzzleItem: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.xl,
    padding: isSmallMobileDevice() ? spacing.md : spacing.lg,
    minWidth: isSmallMobileDevice() ? 120 : 140, // Smaller on mobile
    minHeight: isSmallMobileDevice() ? 150 : 180, // Smaller on mobile
    alignItems: 'center',
    justifyContent: 'space-between',
    ...shadows.md,
    borderWidth: 2,
    borderColor: colors.outlineVariant,
    transform: [{ scale: 1 }],
    // Add subtle hover effect preparation
    position: 'relative',
  },
  puzzleItemPressed: {
    backgroundColor: colors.primaryUltraLight,
    borderColor: colors.primary,
    transform: [{ scale: 0.97 }],
    ...shadows.lg,
    shadowColor: colors.shadowColored,
  },
  puzzleImageContainer: {
    ...shadows.sm,
    borderRadius: borderRadius.lg,
    overflow: 'hidden',
    marginBottom: spacing.md,
    backgroundColor: colors.surface,
    padding: 3,
  },
  puzzleImage: {
    width: isSmallMobileDevice() ? 60 : 80, // Smaller on mobile
    height: isSmallMobileDevice() ? 60 : 80,
    borderRadius: borderRadius.md,
  },
  puzzleTitle: {
    fontSize: isSmallMobileDevice() ? typography.sm : typography.md,
    fontWeight: typography.weight.semibold,
    color: colors.textPrimary,
    textAlign: 'center',
    marginBottom: spacing.sm,
    lineHeight: (isSmallMobileDevice() ? typography.sm : typography.md) * typography.lineHeight.normal,
    minHeight: (isSmallMobileDevice() ? typography.sm : typography.md) * typography.lineHeight.normal * 2, // Ensure consistent height
  },
  difficultyBadge: {
    paddingHorizontal: isSmallMobileDevice() ? spacing.sm : spacing.md,
    paddingVertical: isSmallMobileDevice() ? 4 : spacing.sm,
    borderRadius: borderRadius.round,
    minHeight: isSmallMobileDevice() ? 28 : 32,
    minWidth: isSmallMobileDevice() ? 50 : 60,
    alignItems: 'center',
    justifyContent: 'center',
    ...shadows.sm,
    // Add subtle border for better definition
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  difficultyText: {
    fontSize: typography.sm,
    fontWeight: typography.weight.bold,
    color: colors.onPrimary,
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.1)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 1,
  },
});
