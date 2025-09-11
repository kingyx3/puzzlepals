// Smart piece sorting panel for better puzzle organization

import React, { useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Modal,
  SafeAreaView,
} from 'react-native';
import { useGameStore } from '../stores/game';
import { organizePiecesByType } from '../engine/hints';
import { colors, spacing, typography } from '../theme';

export type SortingCriteria = 'type' | 'color' | 'progress' | 'none';

interface PieceSortingPanelProps {
  visible: boolean;
  onClose: () => void;
  onSortChange: (criteria: SortingCriteria) => void;
  currentSort: SortingCriteria;
}

export const PieceSortingPanel: React.FC<PieceSortingPanelProps> = ({
  visible,
  onClose,
  onSortChange,
  currentSort,
}) => {
  const { currentPuzzle } = useGameStore();

  const sortedPiecesAnalysis = useMemo(() => {
    if (!currentPuzzle) return null;

    const { board } = currentPuzzle;
    const organized = organizePiecesByType(board);
    const unplacedPieces = Object.values(board.pieces).filter((p) => !p.placed);

    return {
      corners: {
        total: organized.corners.length,
        remaining: organized.corners.filter((p) => !p.placed).length,
      },
      edges: {
        total: organized.edges.length,
        remaining: organized.edges.filter((p) => !p.placed).length,
      },
      interior: {
        total: organized.interior.length,
        remaining: organized.interior.filter((p) => !p.placed).length,
      },
      totalRemaining: unplacedPieces.length,
    };
  }, [currentPuzzle]);

  const handleSortSelection = (criteria: SortingCriteria) => {
    onSortChange(criteria);
    onClose();
  };

  if (!currentPuzzle || !sortedPiecesAnalysis) {
    return null;
  }

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <SafeAreaView style={styles.overlay}>
        <View style={styles.panel}>
          <View style={styles.header}>
            <Text style={styles.title}>Smart Piece Sorting</Text>
            <TouchableOpacity style={styles.closeButton} onPress={onClose}>
              <Text style={styles.closeButtonText}>✕</Text>
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.content}>
            {/* Piece Analysis */}
            <View style={styles.analysisSection}>
              <Text style={styles.sectionTitle}>Remaining Pieces</Text>
              <View style={styles.statsContainer}>
                <View style={styles.statItem}>
                  <Text style={styles.statNumber}>
                    {sortedPiecesAnalysis.corners.remaining}
                  </Text>
                  <Text style={styles.statLabel}>Corners</Text>
                  <Text style={styles.statTotal}>
                    of {sortedPiecesAnalysis.corners.total}
                  </Text>
                </View>
                <View style={styles.statItem}>
                  <Text style={styles.statNumber}>
                    {sortedPiecesAnalysis.edges.remaining}
                  </Text>
                  <Text style={styles.statLabel}>Edges</Text>
                  <Text style={styles.statTotal}>
                    of {sortedPiecesAnalysis.edges.total}
                  </Text>
                </View>
                <View style={styles.statItem}>
                  <Text style={styles.statNumber}>
                    {sortedPiecesAnalysis.interior.remaining}
                  </Text>
                  <Text style={styles.statLabel}>Interior</Text>
                  <Text style={styles.statTotal}>
                    of {sortedPiecesAnalysis.interior.total}
                  </Text>
                </View>
              </View>
            </View>

            {/* Sorting Options */}
            <View style={styles.sortingSection}>
              <Text style={styles.sectionTitle}>Sorting Options</Text>

              <TouchableOpacity
                style={[
                  styles.sortOption,
                  currentSort === 'type' && styles.selectedOption,
                ]}
                onPress={() => handleSortSelection('type')}
              >
                <View style={styles.optionContent}>
                  <Text style={styles.optionTitle}>🧩 By Piece Type</Text>
                  <Text style={styles.optionDescription}>
                    Group corners, edges, and interior pieces
                  </Text>
                </View>
                {currentSort === 'type' && (
                  <Text style={styles.selectedIcon}>✓</Text>
                )}
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.sortOption,
                  currentSort === 'color' && styles.selectedOption,
                ]}
                onPress={() => handleSortSelection('color')}
              >
                <View style={styles.optionContent}>
                  <Text style={styles.optionTitle}>🎨 By Color Dominance</Text>
                  <Text style={styles.optionDescription}>
                    Sort by dominant colors in piece areas
                  </Text>
                </View>
                {currentSort === 'color' && (
                  <Text style={styles.selectedIcon}>✓</Text>
                )}
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.sortOption,
                  currentSort === 'progress' && styles.selectedOption,
                ]}
                onPress={() => handleSortSelection('progress')}
              >
                <View style={styles.optionContent}>
                  <Text style={styles.optionTitle}>
                    📊 By Placement Progress
                  </Text>
                  <Text style={styles.optionDescription}>
                    Show pieces closest to correct position first
                  </Text>
                </View>
                {currentSort === 'progress' && (
                  <Text style={styles.selectedIcon}>✓</Text>
                )}
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.sortOption,
                  currentSort === 'none' && styles.selectedOption,
                ]}
                onPress={() => handleSortSelection('none')}
              >
                <View style={styles.optionContent}>
                  <Text style={styles.optionTitle}>🔄 Random (Default)</Text>
                  <Text style={styles.optionDescription}>
                    Pieces arranged randomly as intended
                  </Text>
                </View>
                {currentSort === 'none' && (
                  <Text style={styles.selectedIcon}>✓</Text>
                )}
              </TouchableOpacity>
            </View>

            {/* Tips */}
            <View style={styles.tipsSection}>
              <Text style={styles.sectionTitle}>💡 Solving Tips</Text>
              <Text style={styles.tipText}>
                • Start with corners - they're the easiest to identify
              </Text>
              <Text style={styles.tipText}>
                • Build the edges next to create a frame
              </Text>
              <Text style={styles.tipText}>
                • Group similar colors or patterns together
              </Text>
              <Text style={styles.tipText}>
                • Use hints when you're stuck, but try first!
              </Text>
            </View>
          </ScrollView>
        </View>
      </SafeAreaView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  panel: {
    backgroundColor: colors.surface,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '80%',
    minHeight: '50%',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.outline,
  },
  title: {
    fontSize: typography.xl,
    fontWeight: typography.weight.bold,
    color: colors.onSurface,
  },
  closeButton: {
    padding: spacing.xs,
    borderRadius: 20,
    backgroundColor: colors.outline,
    minWidth: 32,
    minHeight: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeButtonText: {
    fontSize: typography.md,
    color: colors.onSurface,
  },
  content: {
    padding: spacing.lg,
  },
  analysisSection: {
    marginBottom: spacing.lg,
  },
  sectionTitle: {
    fontSize: typography.lg,
    fontWeight: typography.weight.semibold,
    color: colors.onSurface,
    marginBottom: spacing.md,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: colors.background,
    borderRadius: 12,
    padding: spacing.md,
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statNumber: {
    fontSize: typography.xl,
    fontWeight: typography.weight.bold,
    color: colors.primary,
  },
  statLabel: {
    fontSize: typography.sm,
    color: colors.onSurface,
    fontWeight: typography.weight.medium,
    marginTop: spacing.xs / 2,
  },
  statTotal: {
    fontSize: typography.xs,
    color: colors.secondary,
    marginTop: spacing.xs / 4,
  },
  sortingSection: {
    marginBottom: spacing.lg,
  },
  sortOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.md,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.outline,
    marginBottom: spacing.sm,
    backgroundColor: colors.background,
  },
  selectedOption: {
    borderColor: colors.primary,
    backgroundColor: 'rgba(107, 158, 255, 0.1)',
  },
  optionContent: {
    flex: 1,
  },
  optionTitle: {
    fontSize: typography.md,
    fontWeight: typography.weight.semibold,
    color: colors.onSurface,
    marginBottom: spacing.xs / 2,
  },
  optionDescription: {
    fontSize: typography.sm,
    color: colors.secondary,
  },
  selectedIcon: {
    fontSize: typography.lg,
    color: colors.primary,
    fontWeight: typography.weight.bold,
  },
  tipsSection: {
    backgroundColor: 'rgba(76, 175, 80, 0.1)',
    borderRadius: 12,
    padding: spacing.md,
  },
  tipText: {
    fontSize: typography.sm,
    color: colors.onSurface,
    marginBottom: spacing.xs,
    lineHeight: typography.sm * 1.4,
  },
});
