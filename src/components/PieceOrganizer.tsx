// Scrollable component to organize and display puzzle pieces under the main puzzle area

import React, { useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { useGameStore } from '../stores/game';
import { organizePiecesByType } from '../engine/hints';
import { colors, spacing, typography } from '../theme';
import { SortingCriteria } from './PieceSortingPanel';
import { Piece as PieceType } from '../types';

interface PieceOrganizerProps {
  sortingCriteria: SortingCriteria;
}

interface PieceItemProps {
  piece: PieceType;
  index: number;
}

const PieceItem: React.FC<PieceItemProps> = ({ piece, index }) => {
  const { movePiece, bringToFront } = useGameStore();
  
  const handlePress = () => {
    // Bring piece to front and move it to center for easy access
    bringToFront(piece.id);
    // Move to a staging area in the center-bottom of the canvas
    movePiece(piece.id, piece.targetX, piece.targetY + 100);
  };

  return (
    <TouchableOpacity 
      style={styles.pieceItem}
      onPress={handlePress}
      activeOpacity={0.7}
    >
      <View style={styles.piecePreview}>
        <Text style={styles.pieceIndex}>{index + 1}</Text>
      </View>
      <Text style={styles.pieceLabel}>
        {piece.row}-{piece.col}
      </Text>
    </TouchableOpacity>
  );
};

export const PieceOrganizer: React.FC<PieceOrganizerProps> = ({
  sortingCriteria,
}) => {
  const { currentPuzzle } = useGameStore();
  
  const organizedPieces = useMemo(() => {
    if (!currentPuzzle) return null;
    
    const { board } = currentPuzzle;
    const unplacedPieces = Object.values(board.pieces).filter(piece => !piece.placed);
    
    switch (sortingCriteria) {
      case 'type': {
        const organized = organizePiecesByType(board);
        return {
          title: 'Sorted by Type',
          sections: [
            {
              title: 'Corners',
              pieces: organized.corners.filter(p => !p.placed),
              color: colors.warning,
              icon: '📐',
            },
            {
              title: 'Edges', 
              pieces: organized.edges.filter(p => !p.placed),
              color: colors.secondary,
              icon: '📏',
            },
            {
              title: 'Interior',
              pieces: organized.interior.filter(p => !p.placed),
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
                const distA = Math.sqrt(Math.pow(a.x - a.targetX, 2) + Math.pow(a.y - a.targetY, 2));
                const distB = Math.sqrt(Math.pow(b.x - b.targetX, 2) + Math.pow(b.y - b.targetY, 2));
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

  const totalPieces = organizedPieces.sections.reduce((sum, section) => sum + section.pieces.length, 0);
  
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{organizedPieces.title}</Text>
        <Text style={styles.subtitle}>
          {totalPieces} pieces remaining • Tap to bring to staging area
        </Text>
      </View>
      
      <ScrollView 
        horizontal 
        style={styles.scrollContainer}
        contentContainerStyle={styles.scrollContent}
        showsHorizontalScrollIndicator={false}
      >
        {organizedPieces.sections.map((section, sectionIndex) => (
          <View key={sectionIndex} style={styles.section}>
            <View style={[styles.sectionHeader, { borderLeftColor: section.color }]}>
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
    borderTopWidth: 1,
    borderTopColor: colors.outline,
    maxHeight: 140, // Fixed height to control layout
  },
  header: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.outline,
  },
  title: {
    fontSize: typography.md,
    fontWeight: typography.weight.semibold,
    color: colors.onSurface,
  },
  subtitle: {
    fontSize: typography.sm,
    color: colors.secondary,
    marginTop: spacing.xs / 2,
  },
  scrollContainer: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  section: {
    marginRight: spacing.lg,
    minWidth: 120,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingLeft: spacing.sm,
    paddingRight: spacing.xs,
    paddingVertical: spacing.xs,
    borderLeftWidth: 3,
    marginBottom: spacing.xs,
  },
  sectionTitle: {
    fontSize: typography.sm,
    fontWeight: typography.weight.medium,
    color: colors.onSurface,
    flex: 1,
  },
  sectionCount: {
    fontSize: typography.xs,
    color: colors.secondary,
    backgroundColor: colors.background,
    paddingHorizontal: spacing.xs,
    paddingVertical: spacing.xs / 2,
    borderRadius: spacing.xs,
    minWidth: 20,
    textAlign: 'center',
  },
  piecesContainer: {
    maxHeight: 60,
  },
  piecesContent: {
    paddingRight: spacing.md,
  },
  pieceItem: {
    marginRight: spacing.xs,
    alignItems: 'center',
  },
  piecePreview: {
    width: 40,
    height: 40,
    backgroundColor: colors.background,
    borderRadius: spacing.xs,
    borderWidth: 1,
    borderColor: colors.outline,
    borderStyle: 'dashed',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.xs / 2,
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
});