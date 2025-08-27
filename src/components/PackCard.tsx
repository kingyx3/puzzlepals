// Puzzle pack card component for home screen

import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { PuzzlePack, PuzzleMeta } from '../types';
import { colors, spacing, borderRadius, typography, shadows } from '../theme';

interface PackCardProps {
  pack: PuzzlePack;
  onSelectPuzzle: (puzzle: PuzzleMeta) => void;
  style?: object;
}

export const PackCard: React.FC<PackCardProps> = ({ pack, onSelectPuzzle, style }) => {
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
            style={styles.puzzleItem}
            onPress={() => onSelectPuzzle(puzzle)}
            activeOpacity={0.8}
          >
            <Image source={puzzle.imageAsset} style={styles.puzzleImage} />
            <Text style={styles.puzzleTitle}>{puzzle.titleKey}</Text>
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
    padding: spacing.sm,
    minWidth: 100,
    alignItems: 'center',
    ...shadows.sm,
  },
  puzzleImage: {
    width: 60,
    height: 60,
    borderRadius: borderRadius.sm,
    marginBottom: spacing.xs,
  },
  puzzleTitle: {
    fontSize: typography.sm,
    fontWeight: typography.weight.medium,
    color: colors.onSurface,
    textAlign: 'center',
    marginBottom: spacing.xs,
  },
  difficultyBadge: {
    backgroundColor: colors.secondary,
    paddingHorizontal: spacing.xs,
    paddingVertical: 2,
    borderRadius: borderRadius.sm,
  },
  difficultyText: {
    fontSize: typography.xs,
    fontWeight: typography.weight.medium,
    color: colors.onSecondary,
  },
});