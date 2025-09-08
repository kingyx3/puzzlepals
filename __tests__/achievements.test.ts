// Tests for achievement system functionality

import { useAchievementStore } from '../src/stores/achievements';
import { PuzzleStats } from '../src/stores/achievements';

// Mock data for testing
const mockPuzzleStats: PuzzleStats = {
  puzzleId: 'test-puzzle',
  difficulty: 'EASY',
  completionTime: 5 * 60 * 1000, // 5 minutes
  hintsUsed: 2,
  completedAt: Date.now(),
  efficiency: 0.7,
};

describe('Achievement System', () => {
  beforeEach(() => {
    // Reset store state before each test
    useAchievementStore.setState({
      unlockedAchievements: [],
      playerStats: {
        totalPuzzlesCompleted: 0,
        totalTimeSpent: 0,
        averageCompletionTime: 0,
        totalHintsUsed: 0,
        currentStreak: 0,
        longestStreak: 0,
        difficultyStats: {
          AGES_3_5: {
            completed: 0,
            averageTime: 0,
            bestTime: 0,
            averageHints: 0,
          },
          AGES_6_8: {
            completed: 0,
            averageTime: 0,
            bestTime: 0,
            averageHints: 0,
          },
          AGES_9_10: {
            completed: 0,
            averageTime: 0,
            bestTime: 0,
            averageHints: 0,
          },
          AGES_11_PLUS: {
            completed: 0,
            averageTime: 0,
            bestTime: 0,
            averageHints: 0,
          },
          EASY: { completed: 0, averageTime: 0, bestTime: 0, averageHints: 0 },
          MEDIUM: {
            completed: 0,
            averageTime: 0,
            bestTime: 0,
            averageHints: 0,
          },
          HARD: { completed: 0, averageTime: 0, bestTime: 0, averageHints: 0 },
          EXPERT: {
            completed: 0,
            averageTime: 0,
            bestTime: 0,
            averageHints: 0,
          },
          MASTER: {
            completed: 0,
            averageTime: 0,
            bestTime: 0,
            averageHints: 0,
          },
        },
      },
      puzzleHistory: [],
    });
  });

  describe('recordPuzzleCompletion', () => {
    it('should update player stats correctly', () => {
      const { recordPuzzleCompletion } = useAchievementStore.getState();
      recordPuzzleCompletion(mockPuzzleStats);

      const state = useAchievementStore.getState();
      expect(state.playerStats.totalPuzzlesCompleted).toBe(1);
      expect(state.playerStats.totalTimeSpent).toBe(
        mockPuzzleStats.completionTime
      );
      expect(state.playerStats.totalHintsUsed).toBe(mockPuzzleStats.hintsUsed);
      expect(state.playerStats.currentStreak).toBe(1);
      expect(state.puzzleHistory).toHaveLength(1);
    });

    it('should update difficulty-specific stats', () => {
      const { recordPuzzleCompletion } = useAchievementStore.getState();
      recordPuzzleCompletion(mockPuzzleStats);

      const state = useAchievementStore.getState();
      const easyStats = state.playerStats.difficultyStats.EASY;

      expect(easyStats.completed).toBe(1);
      expect(easyStats.averageTime).toBe(mockPuzzleStats.completionTime);
      expect(easyStats.bestTime).toBe(mockPuzzleStats.completionTime);
      expect(easyStats.averageHints).toBe(mockPuzzleStats.hintsUsed);
    });

    it('should calculate averages correctly with multiple completions', () => {
      const firstStats = {
        ...mockPuzzleStats,
        completionTime: 10000,
        hintsUsed: 1,
      };
      const secondStats = {
        ...mockPuzzleStats,
        completionTime: 20000,
        hintsUsed: 3,
      };

      const { recordPuzzleCompletion } = useAchievementStore.getState();
      recordPuzzleCompletion(firstStats);
      recordPuzzleCompletion(secondStats);

      const state = useAchievementStore.getState();
      const easyStats = state.playerStats.difficultyStats.EASY;

      expect(easyStats.completed).toBe(2);
      expect(easyStats.averageTime).toBe(15000); // (10000 + 20000) / 2
      expect(easyStats.bestTime).toBe(10000); // Min of 10000 and 20000
      expect(easyStats.averageHints).toBe(2); // (1 + 3) / 2
    });
  });

  describe('checkAchievements', () => {
    it('should unlock first puzzle achievement', () => {
      const { recordPuzzleCompletion, checkAchievements } =
        useAchievementStore.getState();
      recordPuzzleCompletion(mockPuzzleStats);

      const newAchievements = checkAchievements();
      const state = useAchievementStore.getState();

      expect(newAchievements).toHaveLength(1);
      expect(newAchievements[0].id).toBe('first_puzzle');
      expect(state.unlockedAchievements).toContain('first_puzzle');
    });

    it('should unlock speed demon achievement for fast completion', () => {
      const fastStats = { ...mockPuzzleStats, completionTime: 60000 }; // 1 minute
      const { recordPuzzleCompletion, checkAchievements } =
        useAchievementStore.getState();
      recordPuzzleCompletion(fastStats);

      const newAchievements = checkAchievements();

      expect(newAchievements.some((a) => a.id === 'speed_demon')).toBe(true);
    });

    it('should unlock no hints hero achievement', () => {
      const noHintsStats = { ...mockPuzzleStats, hintsUsed: 0 };
      const { recordPuzzleCompletion, checkAchievements } =
        useAchievementStore.getState();
      recordPuzzleCompletion(noHintsStats);

      const newAchievements = checkAchievements();

      expect(newAchievements.some((a) => a.id === 'no_hints_hero')).toBe(true);
    });

    it('should not unlock achievements already unlocked', () => {
      const { recordPuzzleCompletion, checkAchievements } =
        useAchievementStore.getState();

      // First completion - should unlock first_puzzle
      recordPuzzleCompletion(mockPuzzleStats);
      let newAchievements = checkAchievements();
      expect(newAchievements).toHaveLength(1);

      // Second completion - should not unlock first_puzzle again
      recordPuzzleCompletion(mockPuzzleStats);
      newAchievements = checkAchievements();
      expect(newAchievements.some((a) => a.id === 'first_puzzle')).toBe(false);
    });
  });

  describe('getEfficiencyScore', () => {
    it('should calculate efficiency score correctly', () => {
      const { getEfficiencyScore } = useAchievementStore.getState();
      const score1 = getEfficiencyScore(5 * 60 * 1000, 0, 'EASY'); // Good performance
      const score2 = getEfficiencyScore(30 * 60 * 1000, 5, 'EASY'); // Poor performance

      expect(score1).toBeGreaterThan(score2);
      expect(score1).toBeLessThanOrEqual(1);
      expect(score2).toBeGreaterThanOrEqual(0);
    });

    it('should adjust for different difficulty levels', () => {
      const { getEfficiencyScore } = useAchievementStore.getState();
      const easyScore = getEfficiencyScore(10 * 60 * 1000, 0, 'EASY'); // No hints, good time for easy
      const hardScore = getEfficiencyScore(45 * 60 * 1000, 0, 'HARD'); // No hints, good time for hard

      // Both should be reasonable efficiency scores
      expect(easyScore).toBeGreaterThan(0.5);
      expect(hardScore).toBeGreaterThan(0.5);
    });
  });

  describe('getRecommendedDifficulty', () => {
    it('should recommend starter difficulty for new players', () => {
      const { getRecommendedDifficulty } = useAchievementStore.getState();
      const recommendation = getRecommendedDifficulty();
      expect(recommendation).toBe('AGES_3_5');
    });

    it('should recommend harder difficulty for good performance', () => {
      const { recordPuzzleCompletion, getRecommendedDifficulty } =
        useAchievementStore.getState();

      // Record several high-efficiency completions
      const highEfficiencyStats = {
        ...mockPuzzleStats,
        efficiency: 0.9,
        hintsUsed: 0,
      };

      for (let i = 0; i < 5; i++) {
        recordPuzzleCompletion({
          ...highEfficiencyStats,
          puzzleId: `puzzle-${i}`,
        });
      }

      const recommendation = getRecommendedDifficulty();
      expect(recommendation).not.toBe('AGES_3_5'); // Should progress beyond starter
    });

    it('should recommend easier difficulty for poor performance', () => {
      const { recordPuzzleCompletion, getRecommendedDifficulty } =
        useAchievementStore.getState();

      // Record several low-efficiency completions
      const lowEfficiencyStats = {
        ...mockPuzzleStats,
        difficulty: 'HARD' as const,
        efficiency: 0.3,
        hintsUsed: 5,
      };

      for (let i = 0; i < 5; i++) {
        recordPuzzleCompletion({
          ...lowEfficiencyStats,
          puzzleId: `puzzle-${i}`,
        });
      }

      const recommendation = getRecommendedDifficulty();
      expect(recommendation).toBe('EASY'); // Should step back to easier difficulty
    });
  });
});
