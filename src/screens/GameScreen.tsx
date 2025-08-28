// Game screen with puzzle canvas and controls

import React, { useState, useCallback } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  SafeAreaView, 
  Dimensions,
  Alert 
} from 'react-native';
import { PuzzleCanvas } from '../components/PuzzleCanvas';
import { useGameStore } from '../stores/game';
import { PuzzleMeta, Difficulty } from '../types';
import { colors, spacing, typography, layout } from '../theme';

interface GameScreenProps {
  puzzle: PuzzleMeta;
  difficulty: Difficulty;
  onExit: () => void;
}

export const GameScreen: React.FC<GameScreenProps> = ({ puzzle, difficulty, onExit }) => {
  const { startPuzzle, currentPuzzle, resetPuzzle, exitPuzzle, useHint } = useGameStore();
  const [showCelebration, setShowCelebration] = useState(false);
  const [hintMessage, setHintMessage] = useState<string | null>(null);
  
  // Initialize puzzle when component mounts
  React.useEffect(() => {
    const screenWidth = Dimensions.get('window').width;
    const screenHeight = Dimensions.get('window').height;
    
    // Calculate canvas size (leaving space for controls)
    const maxWidth = screenWidth - spacing.xl * 2;
    const maxHeight = screenHeight * 0.6; // 60% of screen height
    const canvasSize = Math.min(maxWidth, maxHeight, layout.maxPuzzleSize);
    
    startPuzzle(puzzle, difficulty, { 
      width: canvasSize, 
      height: canvasSize 
    });
  }, [puzzle, difficulty, startPuzzle]);
  
  const handlePuzzleComplete = useCallback(() => {
    setShowCelebration(true);
    // Show celebration for a few seconds
    setTimeout(() => {
      setShowCelebration(false);
    }, 3000);
  }, []);
  
  const handleHint = useCallback(() => {
    const hintResult = useHint();
    if (hintResult?.message) {
      setHintMessage(hintResult.message);
      // Clear hint message after 5 seconds
      setTimeout(() => setHintMessage(null), 5000);
    }
  }, [useHint]);
  
  const handleReset = useCallback(() => {
    Alert.alert(
      'Reset Puzzle',
      'Are you sure you want to start over?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Reset', style: 'destructive', onPress: resetPuzzle },
      ]
    );
  }, [resetPuzzle]);
  
  const handleExit = useCallback(() => {
    Alert.alert(
      'Exit Puzzle',
      'Your progress will be saved. Exit to home screen?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Exit', onPress: () => {
          exitPuzzle();
          onExit();
        }},
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
  
  const progress = currentPuzzle.board.completedCount / (currentPuzzle.board.cols * currentPuzzle.board.rows);
  
  return (
    <SafeAreaView style={styles.container}>
      {/* Header with controls */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.exitButton} onPress={handleExit}>
          <Text style={styles.buttonText}>← Back</Text>
        </TouchableOpacity>
        
        <View style={styles.titleSection}>
          <Text style={styles.puzzleTitle}>{puzzle.titleKey}</Text>
          <Text style={styles.progressText}>
            {currentPuzzle.board.completedCount} / {currentPuzzle.board.cols * currentPuzzle.board.rows}
          </Text>
        </View>
        
        <TouchableOpacity style={styles.hintButton} onPress={handleHint}>
          <Text style={styles.buttonText}>💡 Hint</Text>
        </TouchableOpacity>
      </View>
      
      {/* Progress bar */}
      <View style={styles.progressContainer}>
        <View style={styles.progressBar}>
          <View style={[styles.progressFill, { width: `${progress * 100}%` }]} />
        </View>
      </View>
      
      {/* Hint message */}
      {hintMessage && (
        <View style={styles.hintMessageContainer}>
          <Text style={styles.hintMessageText}>{hintMessage}</Text>
        </View>
      )}
      
      {/* Puzzle canvas */}
      <View style={styles.gameArea}>
        <PuzzleCanvas onPuzzleComplete={handlePuzzleComplete} />
      </View>
      
      {/* Bottom controls */}
      <View style={styles.bottomControls}>
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
  gameArea: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.md,
  },
  bottomControls: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    alignItems: 'center',
  },
  resetButton: {
    padding: spacing.md,
    backgroundColor: colors.warning,
    borderRadius: layout.touchTarget / 2,
    minWidth: layout.touchTarget * 2,
    alignItems: 'center',
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