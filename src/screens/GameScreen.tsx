// Game screen with puzzle canvas and controls

import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  Dimensions,
  Alert,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { PuzzleCanvas } from '../components/PuzzleCanvas';
import {
  PieceSortingPanel,
  SortingCriteria,
} from '../components/PieceSortingPanel';
import { PieceOrganizer } from '../components/PieceOrganizer';
import { AccessibilityEnhancements } from '../components/AccessibilityEnhancements';
import { VisualEffects } from '../components/VisualEffects';
import { AchievementDisplay } from '../components/AchievementDisplay';
import { ImagePreviewModal } from '../components/ImagePreviewModal';
import { useGameStore } from '../stores/game';
import { useAchievementStore } from '../stores/achievements';
import { PuzzleMeta, Difficulty } from '../types';
import { colors, spacing, typography, layout } from '../theme';
import {
  getAccessibilityProps,
  getProgressAccessibility,
} from '../utils/accessibility';
import { getSafeAreaPadding } from '../utils/statusBar';

interface GameScreenProps {
  puzzle: PuzzleMeta;
  difficulty: Difficulty;
  onExit: () => void;
}

export const GameScreen: React.FC<GameScreenProps> = ({
  puzzle,
  difficulty,
  onExit,
}) => {
  const insets = useSafeAreaInsets();
  const safeAreaPadding = getSafeAreaPadding();
  const { startPuzzle, currentPuzzle, resetPuzzle, exitPuzzle, useHint } =
    useGameStore();
  const { getRecommendedDifficulty } = useAchievementStore();
  const [showCelebration, setShowCelebration] = useState(false);
  const [hintMessage, setHintMessage] = useState<string | null>(null);
  const [showSortingPanel, setShowSortingPanel] = useState(false);
  const [showAccessibilityPanel, setShowAccessibilityPanel] = useState(false);
  const [showAchievementPanel, setShowAchievementPanel] = useState(false);
  const [showImagePreview, setShowImagePreview] = useState(false);
  const [currentSorting, setCurrentSorting] = useState<SortingCriteria>('none');
  const [snapEffectTrigger, setSnapEffectTrigger] = useState(false);
  const [completionEffectTrigger, setCompletionEffectTrigger] = useState(false);

  // Initialize puzzle when component mounts
  React.useEffect(() => {
    const screenWidth = Dimensions.get('window').width;
    const screenHeight = Dimensions.get('window').height;

    // Calculate canvas size (leaving space for controls and piece organizer)
    const maxWidth = screenWidth - spacing.xl * 2;
    const maxHeight = screenHeight * 0.5; // Reduced from 0.6 to make room for piece organizer
    const canvasSize = Math.min(maxWidth, maxHeight, layout.maxPuzzleSize);

    startPuzzle(puzzle, difficulty, {
      width: canvasSize,
      height: canvasSize,
    });
  }, [puzzle, difficulty, startPuzzle]);

  const handlePuzzleComplete = useCallback(() => {
    setShowCelebration(true);
    setCompletionEffectTrigger((prev) => !prev); // Trigger completion visual effect

    // Show celebration for a few seconds
    setTimeout(() => {
      setShowCelebration(false);
    }, 3000);

    // Suggest next difficulty if player is performing well
    setTimeout(() => {
      const recommendedDifficulty = getRecommendedDifficulty();
      if (recommendedDifficulty !== difficulty) {
        Alert.alert(
          'Great Job! 🎉',
          `Based on your performance, you might enjoy the ${recommendedDifficulty.replace('_', ' ')} difficulty level. Would you like to try it next time?`,
          [
            { text: 'Maybe Later', style: 'cancel' },
            { text: 'Sounds Good!', style: 'default' },
          ]
        );
      }
    }, 4000);
  }, [difficulty, getRecommendedDifficulty]);

  const handleHint = useCallback(() => {
    const hintResult = useHint();
    if (hintResult?.message) {
      setHintMessage(hintResult.message);
      // Clear hint message after 5 seconds
      setTimeout(() => setHintMessage(null), 5000);
    }
  }, [useHint]);

  const handlePieceSnap = useCallback(() => {
    setSnapEffectTrigger((prev) => !prev); // Trigger snap visual effect
  }, []);

  const handleSortingChange = useCallback((criteria: SortingCriteria) => {
    setCurrentSorting(criteria);
    // Here you could implement the actual sorting logic
    // For now, we'll just track the preference
  }, []);

  const handleReset = useCallback(() => {
    Alert.alert('Reset Puzzle', 'Are you sure you want to start over?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Reset', style: 'destructive', onPress: resetPuzzle },
    ]);
  }, [resetPuzzle]);

  const handleExit = useCallback(() => {
    Alert.alert(
      'Exit Puzzle',
      'Your progress will be saved. Exit to home screen?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Exit',
          onPress: () => {
            exitPuzzle();
            onExit();
          },
        },
      ]
    );
  }, [exitPuzzle, onExit]);

  if (!currentPuzzle) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.loadingText}>Loading puzzle...</Text>
      </SafeAreaView>
    );
  }

  const progress =
    currentPuzzle.board.completedCount /
    (currentPuzzle.board.cols * currentPuzzle.board.rows);
  const progressAccessibility = getProgressAccessibility(
    currentPuzzle.board.completedCount,
    currentPuzzle.board.cols * currentPuzzle.board.rows
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Header with enhanced controls */}
      <View
        style={[
          styles.header,
          { paddingTop: Math.max(insets.top, safeAreaPadding.paddingTop) },
        ]}
      >
        <TouchableOpacity
          style={styles.exitButton}
          onPress={handleExit}
          {...getAccessibilityProps({
            label: 'Exit puzzle and go back',
            hint: 'Returns to the puzzle selection screen',
            role: 'button',
          })}
        >
          <Text style={styles.buttonText}>← Back</Text>
        </TouchableOpacity>

        <View style={styles.titleSection}>
          <Text
            style={styles.puzzleTitle}
            accessible={true}
            accessibilityRole="header"
          >
            {puzzle.titleKey}
          </Text>
          <Text
            style={styles.progressText}
            accessible={true}
            accessibilityLabel={`Progress: ${currentPuzzle.board.completedCount} pieces placed out of ${currentPuzzle.board.cols * currentPuzzle.board.rows} total pieces`}
          >
            {currentPuzzle.board.completedCount} /{' '}
            {currentPuzzle.board.cols * currentPuzzle.board.rows}
          </Text>
        </View>

        <View style={styles.rightControls}>
          <TouchableOpacity
            style={styles.previewButton}
            onPress={() => setShowImagePreview(true)}
            accessible={true}
            accessibilityRole="button"
            accessibilityLabel="View reference image"
            accessibilityHint="Opens a full-size view of the completed puzzle image for reference"
          >
            <Text style={styles.buttonText}>🖼️</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.achievementButton}
            onPress={() => setShowAchievementPanel(true)}
            accessible={true}
            accessibilityRole="button"
            accessibilityLabel="View achievements"
            accessibilityHint="Opens the achievements panel to see your progress and unlocked rewards"
          >
            <Text style={styles.buttonText}>🏆</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.accessibilityButton}
            onPress={() => setShowAccessibilityPanel(true)}
            accessible={true}
            accessibilityRole="button"
            accessibilityLabel="Accessibility settings"
            accessibilityHint="Opens accessibility options including voice guidance and visual adjustments"
          >
            <Text style={styles.buttonText}>♿</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.hintButton}
            onPress={handleHint}
            accessible={true}
            accessibilityRole="button"
            accessibilityLabel="Get a hint"
            accessibilityHint="Provides a helpful hint for solving the current puzzle"
          >
            <Text style={styles.buttonText}>💡</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Enhanced progress bar with additional info */}
      <View style={styles.progressContainer}>
        <View
          style={styles.progressBar}
          {...getAccessibilityProps({
            label: progressAccessibility.label,
            role: 'progressbar',
          })}
          accessibilityValue={progressAccessibility.value}
        >
          <View
            style={[styles.progressFill, { width: `${progress * 100}%` }]}
          />
        </View>
        <View style={styles.progressStats}>
          <Text style={styles.progressStatsText}>
            {Math.round(progress * 100)}% Complete
          </Text>
          {currentSorting !== 'none' && (
            <Text style={styles.sortingIndicator}>
              Sorted by {currentSorting}
            </Text>
          )}
        </View>
      </View>

      {/* Hint message */}
      {hintMessage && (
        <View style={styles.hintMessageContainer}>
          <Text style={styles.hintMessageText}>{hintMessage}</Text>
        </View>
      )}

      {/* Puzzle canvas with visual effects */}
      <View style={styles.gameArea}>
        <PuzzleCanvas
          onPuzzleComplete={handlePuzzleComplete}
          onPieceSnap={handlePieceSnap}
        />
        {currentPuzzle && (
          <VisualEffects
            canvasWidth={currentPuzzle.board.width}
            canvasHeight={currentPuzzle.board.height}
            snapEffectTrigger={snapEffectTrigger}
            completionTrigger={completionEffectTrigger}
          />
        )}
      </View>

      {/* Piece organizer under the puzzle */}
      <PieceOrganizer sortingCriteria={currentSorting} />

      {/* Enhanced bottom controls */}
      <View style={styles.bottomControls}>
        <TouchableOpacity
          style={styles.sortButton}
          onPress={() => setShowSortingPanel(true)}
        >
          <Text style={styles.sortButtonText}>🧩 Sort Pieces</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.resetButton} onPress={handleReset}>
          <Text style={styles.resetButtonText}>🔄 Reset</Text>
        </TouchableOpacity>
      </View>

      {/* Celebration overlay */}
      {showCelebration && (
        <View style={styles.celebration}>
          <Text style={styles.celebrationText}>🎉 Puzzle Complete! 🎉</Text>
          <Text style={styles.celebrationSubtext}>Great job!</Text>
        </View>
      )}

      {/* Achievement Display Panel */}
      <AchievementDisplay
        visible={showAchievementPanel}
        onClose={() => setShowAchievementPanel(false)}
      />

      {/* Piece Sorting Panel */}
      <PieceSortingPanel
        visible={showSortingPanel}
        onClose={() => setShowSortingPanel(false)}
        onSortChange={handleSortingChange}
        currentSort={currentSorting}
      />

      {/* Accessibility Enhancements Panel */}
      <AccessibilityEnhancements
        visible={showAccessibilityPanel}
        onClose={() => setShowAccessibilityPanel(false)}
      />

      {/* Image Preview Modal */}
      {currentPuzzle && (
        <ImagePreviewModal
          visible={showImagePreview}
          onClose={() => setShowImagePreview(false)}
          imageAsset={currentPuzzle.board.imageAsset}
          puzzleTitle={puzzle.titleKey}
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.outline,
  },
  exitButton: {
    padding: spacing.sm,
    backgroundColor: colors.surface,
    borderRadius: layout.touchTarget / 2,
    minWidth: layout.touchTarget,
    alignItems: 'center',
  },
  titleSection: {
    flex: 1,
    alignItems: 'center',
    marginHorizontal: spacing.md,
  },
  puzzleTitle: {
    fontSize: typography.lg,
    fontWeight: typography.weight.bold,
    color: colors.onBackground,
  },
  progressText: {
    fontSize: typography.sm,
    color: colors.secondary,
    marginTop: spacing.xs / 2,
  },
  hintButton: {
    padding: spacing.sm,
    backgroundColor: colors.secondary,
    borderRadius: layout.touchTarget / 2,
    minWidth: layout.touchTarget,
    alignItems: 'center',
    marginLeft: spacing.xs,
  },
  rightControls: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  accessibilityButton: {
    padding: spacing.sm,
    backgroundColor: colors.primary,
    borderRadius: layout.touchTarget / 2,
    minWidth: layout.touchTarget,
    alignItems: 'center',
    marginLeft: spacing.xs,
  },
  achievementButton: {
    padding: spacing.sm,
    backgroundColor: colors.warning,
    borderRadius: layout.touchTarget / 2,
    minWidth: layout.touchTarget,
    alignItems: 'center',
    marginLeft: spacing.xs,
  },
  previewButton: {
    padding: spacing.sm,
    backgroundColor: colors.success,
    borderRadius: layout.touchTarget / 2,
    minWidth: layout.touchTarget,
    alignItems: 'center',
  },
  buttonText: {
    fontSize: typography.sm,
    fontWeight: typography.weight.medium,
    color: colors.onSurface,
  },
  progressContainer: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  progressBar: {
    height: 8,
    backgroundColor: colors.outline,
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: colors.success,
    borderRadius: 4,
  },
  progressStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: spacing.xs,
  },
  progressStatsText: {
    fontSize: typography.sm,
    color: colors.secondary,
    fontWeight: typography.weight.medium,
  },
  sortingIndicator: {
    fontSize: typography.xs,
    color: colors.primary,
    fontStyle: 'italic',
  },
  gameArea: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.md,
    minHeight: 200, // Ensure minimum height for puzzle canvas
  },
  bottomControls: {
    flexDirection: 'row',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.surface,
    borderTopWidth: 1,
    borderTopColor: colors.outline,
  },
  sortButton: {
    padding: spacing.md,
    backgroundColor: colors.primary,
    borderRadius: layout.touchTarget / 2,
    minWidth: layout.touchTarget * 2,
    alignItems: 'center',
    flex: 1,
    marginRight: spacing.sm,
  },
  sortButtonText: {
    fontSize: typography.md,
    fontWeight: typography.weight.medium,
    color: colors.onPrimary,
  },
  resetButton: {
    padding: spacing.md,
    backgroundColor: colors.warning,
    borderRadius: layout.touchTarget / 2,
    minWidth: layout.touchTarget * 2,
    alignItems: 'center',
    flex: 1,
    marginLeft: spacing.sm,
  },
  resetButtonText: {
    fontSize: typography.md,
    fontWeight: typography.weight.medium,
    color: colors.onSurface,
  },
  loadingText: {
    fontSize: typography.lg,
    color: colors.onBackground,
    textAlign: 'center',
    marginTop: spacing.xxl,
  },
  celebration: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  celebrationText: {
    fontSize: typography.xxxl,
    fontWeight: typography.weight.bold,
    color: colors.success,
    textAlign: 'center',
    marginBottom: spacing.md,
  },
  celebrationSubtext: {
    fontSize: typography.lg,
    color: colors.onBackground,
    textAlign: 'center',
  },
  hintMessageContainer: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    marginHorizontal: spacing.md,
    backgroundColor: colors.secondary,
    borderRadius: spacing.sm,
    alignItems: 'center',
  },
  hintMessageText: {
    fontSize: typography.md,
    color: colors.onSecondary,
    textAlign: 'center',
    fontWeight: typography.weight.medium,
  },
});
