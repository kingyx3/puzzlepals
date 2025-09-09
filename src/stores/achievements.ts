// Achievement and progress tracking system

import { create } from 'zustand';
import { Difficulty } from '../types';

export interface Achievement {
  id: string;
  titleKey: string;
  descriptionKey: string;
  icon: string;
  unlockedAt?: number;
  progress?: number;
  maxProgress?: number;
}

export interface PuzzleStats {
  puzzleId: string;
  difficulty: Difficulty;
  completionTime: number; // milliseconds
  hintsUsed: number;
  completedAt: number; // timestamp
  efficiency: number; // 0-1 score based on time and hints
}

export interface PlayerStats {
  totalPuzzlesCompleted: number;
  totalTimeSpent: number;
  averageCompletionTime: number;
  totalHintsUsed: number;
  currentStreak: number;
  longestStreak: number;
  lastPlayDate?: number;
  difficultyStats: Record<Difficulty, {
    completed: number;
    averageTime: number;
    bestTime: number;
    averageHints: number;
  }>;
}

interface AchievementState {
  achievements: Achievement[];
  unlockedAchievements: string[];
  playerStats: PlayerStats;
  puzzleHistory: PuzzleStats[];
  
  // Actions
  unlockAchievement: (achievementId: string) => void;
  recordPuzzleCompletion: (stats: PuzzleStats) => void;
  updatePlayerStats: (stats: Partial<PlayerStats>) => void;
  checkAchievements: () => Achievement[];
  getRecommendedDifficulty: () => Difficulty;
  getEfficiencyScore: (completionTime: number, hintsUsed: number, difficulty: Difficulty) => number;
}

// Default achievement definitions
const defaultAchievements: Achievement[] = [
  {
    id: 'first_puzzle',
    titleKey: 'achievements.first_puzzle.title',
    descriptionKey: 'achievements.first_puzzle.description',
    icon: '🧩',
  },
  {
    id: 'speed_demon',
    titleKey: 'achievements.speed_demon.title', 
    descriptionKey: 'achievements.speed_demon.description',
    icon: '⚡',
  },
  {
    id: 'puzzle_master',
    titleKey: 'achievements.puzzle_master.title',
    descriptionKey: 'achievements.puzzle_master.description', 
    icon: '👑',
    maxProgress: 100,
  },
  {
    id: 'no_hints_hero',
    titleKey: 'achievements.no_hints_hero.title',
    descriptionKey: 'achievements.no_hints_hero.description',
    icon: '🎯',
  },
  {
    id: 'streak_master',
    titleKey: 'achievements.streak_master.title',
    descriptionKey: 'achievements.streak_master.description',
    icon: '🔥',
    maxProgress: 7,
  },
  {
    id: 'difficulty_explorer', 
    titleKey: 'achievements.difficulty_explorer.title',
    descriptionKey: 'achievements.difficulty_explorer.description',
    icon: '🗺️',
    maxProgress: 9, // Number of difficulty levels
  },
];

// Default player stats
const defaultPlayerStats: PlayerStats = {
  totalPuzzlesCompleted: 0,
  totalTimeSpent: 0,
  averageCompletionTime: 0,
  totalHintsUsed: 0,
  currentStreak: 0,
  longestStreak: 0,
  difficultyStats: {
    AGES_3_5: { completed: 0, averageTime: 0, bestTime: 0, averageHints: 0 },
    AGES_6_8: { completed: 0, averageTime: 0, bestTime: 0, averageHints: 0 },
    AGES_9_10: { completed: 0, averageTime: 0, bestTime: 0, averageHints: 0 },
    AGES_11_PLUS: { completed: 0, averageTime: 0, bestTime: 0, averageHints: 0 },
    EASY: { completed: 0, averageTime: 0, bestTime: 0, averageHints: 0 },
    MEDIUM: { completed: 0, averageTime: 0, bestTime: 0, averageHints: 0 },
    HARD: { completed: 0, averageTime: 0, bestTime: 0, averageHints: 0 },
    EXPERT: { completed: 0, averageTime: 0, bestTime: 0, averageHints: 0 },
    MASTER: { completed: 0, averageTime: 0, bestTime: 0, averageHints: 0 },
  },
};

export const useAchievementStore = create<AchievementState>((set, get) => ({
  achievements: defaultAchievements,
  unlockedAchievements: [],
  playerStats: defaultPlayerStats,
  puzzleHistory: [],
  
  unlockAchievement: (achievementId) => {
    const state = get();
    if (!state.unlockedAchievements.includes(achievementId)) {
      set({
        unlockedAchievements: [...state.unlockedAchievements, achievementId],
        achievements: state.achievements.map(achievement =>
          achievement.id === achievementId
            ? { ...achievement, unlockedAt: Date.now() }
            : achievement
        ),
      });
    }
  },
  
  recordPuzzleCompletion: (stats) => {
    const state = get();
    
    // Defensive check to handle undefined state in tests
    if (!state || !state.puzzleHistory || !state.playerStats) {
      console.warn('Store state not properly initialized, skipping operation');
      return;
    }
    
    // Add to puzzle history
    const newHistory = [...state.puzzleHistory, stats];
    
    // Update player stats
    const currentStats = state.playerStats.difficultyStats[stats.difficulty];
    const newCompletionCount = currentStats.completed + 1;
    
    const updatedDifficultyStats = {
      ...state.playerStats.difficultyStats,
      [stats.difficulty]: {
        completed: newCompletionCount,
        averageTime: (currentStats.averageTime * currentStats.completed + stats.completionTime) / newCompletionCount,
        bestTime: currentStats.bestTime === 0 ? stats.completionTime : Math.min(currentStats.bestTime, stats.completionTime),
        averageHints: (currentStats.averageHints * currentStats.completed + stats.hintsUsed) / newCompletionCount,
      },
    };
    
    // Check if streak continues (played within last 24 hours)
    const now = Date.now();
    const oneDayMs = 24 * 60 * 60 * 1000;
    const streakContinues = !state.playerStats.lastPlayDate || 
      (now - state.playerStats.lastPlayDate) <= oneDayMs;
    
    const newStreak = streakContinues ? state.playerStats.currentStreak + 1 : 1;
    
    const updatedPlayerStats: PlayerStats = {
      ...state.playerStats,
      totalPuzzlesCompleted: state.playerStats.totalPuzzlesCompleted + 1,
      totalTimeSpent: state.playerStats.totalTimeSpent + stats.completionTime,
      totalHintsUsed: state.playerStats.totalHintsUsed + stats.hintsUsed,
      currentStreak: newStreak,
      longestStreak: Math.max(state.playerStats.longestStreak, newStreak),
      lastPlayDate: now,
      difficultyStats: updatedDifficultyStats,
    };
    
    // Calculate average completion time
    updatedPlayerStats.averageCompletionTime = 
      updatedPlayerStats.totalTimeSpent / updatedPlayerStats.totalPuzzlesCompleted;
    
    set({
      puzzleHistory: newHistory,
      playerStats: updatedPlayerStats,
    });
    
    // Check for new achievements
    setTimeout(() => get().checkAchievements(), 100);
  },
  
  updatePlayerStats: (updates) => {
    set({
      playerStats: { ...get().playerStats, ...updates },
    });
  },
  
  checkAchievements: () => {
    const state = get();
    const newlyUnlocked: Achievement[] = [];
    
    state.achievements.forEach(achievement => {
      if (state.unlockedAchievements.includes(achievement.id)) return;
      
      let shouldUnlock = false;
      let progress = 0;
      
      switch (achievement.id) {
        case 'first_puzzle':
          shouldUnlock = state.playerStats.totalPuzzlesCompleted >= 1;
          break;
          
        case 'speed_demon':
          // Unlock if any puzzle completed in under 2 minutes
          shouldUnlock = state.puzzleHistory.some(puzzle => puzzle.completionTime < 2 * 60 * 1000);
          break;
          
        case 'puzzle_master':
          progress = state.playerStats.totalPuzzlesCompleted;
          shouldUnlock = progress >= 100;
          break;
          
        case 'no_hints_hero':
          // Complete any puzzle without using hints
          shouldUnlock = state.puzzleHistory.some(puzzle => puzzle.hintsUsed === 0);
          break;
          
        case 'streak_master':
          progress = state.playerStats.currentStreak;
          shouldUnlock = progress >= 7;
          break;
          
        case 'difficulty_explorer':
          // Count unique difficulties completed
          const completedDifficulties = Object.values(state.playerStats.difficultyStats)
            .filter(stats => stats.completed > 0).length;
          progress = completedDifficulties;
          shouldUnlock = progress >= 5; // At least 5 different difficulties
          break;
      }
      
      // Update progress
      if (achievement.maxProgress) {
        set({
          achievements: state.achievements.map(a =>
            a.id === achievement.id ? { ...a, progress } : a
          ),
        });
      }
      
      if (shouldUnlock) {
        get().unlockAchievement(achievement.id);
        newlyUnlocked.push(achievement);
      }
    });
    
    return newlyUnlocked;
  },
  
  getRecommendedDifficulty: (): Difficulty => {
    const state = get();
    
    // Defensive check to handle undefined state in tests
    if (!state || !state.playerStats || !state.puzzleHistory) {
      console.warn('Store state not properly initialized in getRecommendedDifficulty');
      return 'AGES_3_5' as Difficulty;
    }
    
    // For new players, start with age-appropriate difficulty
    if (state.playerStats.totalPuzzlesCompleted === 0) {
      return 'AGES_3_5' as Difficulty;
    }
    
    // Analyze recent performance to suggest next difficulty
    const recentPuzzles = state.puzzleHistory.slice(-5); // Last 5 puzzles
    
    if (recentPuzzles.length === 0) return 'EASY' as Difficulty;
    
    const averageEfficiency = recentPuzzles.reduce((sum, puzzle) => sum + puzzle.efficiency, 0) / recentPuzzles.length;
    const averageHints = recentPuzzles.reduce((sum, puzzle) => sum + puzzle.hintsUsed, 0) / recentPuzzles.length;
    
    // If performing well (high efficiency, low hints), suggest harder difficulty
    if (averageEfficiency > 0.8 && averageHints < 2) {
      const currentMaxDifficulty = recentPuzzles.reduce((max, puzzle) => {
        const difficultyOrder = ['AGES_3_5', 'AGES_6_8', 'AGES_9_10', 'AGES_11_PLUS', 'EASY', 'MEDIUM', 'HARD', 'EXPERT', 'MASTER'];
        const currentIndex = difficultyOrder.indexOf(max);
        const puzzleIndex = difficultyOrder.indexOf(puzzle.difficulty);
        return puzzleIndex > currentIndex ? puzzle.difficulty : max;
      }, 'AGES_3_5');
      
      const difficultyProgression: Record<Difficulty, Difficulty> = {
        AGES_3_5: 'AGES_6_8',
        AGES_6_8: 'AGES_9_10', 
        AGES_9_10: 'AGES_11_PLUS',
        AGES_11_PLUS: 'EASY',
        EASY: 'MEDIUM',
        MEDIUM: 'HARD',
        HARD: 'EXPERT',
        EXPERT: 'MASTER',
        MASTER: 'MASTER', // Max difficulty
      };
      
      return difficultyProgression[currentMaxDifficulty as Difficulty] || (currentMaxDifficulty as Difficulty);
    }
    
    // If struggling, suggest easier difficulty
    if (averageEfficiency < 0.5 || averageHints > 3) {
      return 'EASY' as Difficulty;
    }
    
    // Default to current performance level
    return recentPuzzles[recentPuzzles.length - 1].difficulty as Difficulty;
  },
  
  getEfficiencyScore: (completionTime, hintsUsed, difficulty) => {
    // Base scoring algorithm - can be refined based on analytics
    const difficultyMultipliers: Record<Difficulty, { timeTarget: number; hintPenalty: number }> = {
      AGES_3_5: { timeTarget: 2 * 60 * 1000, hintPenalty: 0.1 }, // 2 minutes target
      AGES_6_8: { timeTarget: 5 * 60 * 1000, hintPenalty: 0.15 }, // 5 minutes target  
      AGES_9_10: { timeTarget: 10 * 60 * 1000, hintPenalty: 0.2 }, // 10 minutes
      AGES_11_PLUS: { timeTarget: 20 * 60 * 1000, hintPenalty: 0.25 }, // 20 minutes
      EASY: { timeTarget: 15 * 60 * 1000, hintPenalty: 0.2 },
      MEDIUM: { timeTarget: 30 * 60 * 1000, hintPenalty: 0.25 },
      HARD: { timeTarget: 45 * 60 * 1000, hintPenalty: 0.3 },
      EXPERT: { timeTarget: 60 * 60 * 1000, hintPenalty: 0.35 },
      MASTER: { timeTarget: 90 * 60 * 1000, hintPenalty: 0.4 },
    };
    
    const { timeTarget, hintPenalty } = difficultyMultipliers[difficulty];
    
    // Time score (0-1, higher is better)
    const timeScore = Math.max(0, Math.min(1, timeTarget / completionTime));
    
    // Hint penalty
    const hintScore = Math.max(0, 1 - (hintsUsed * hintPenalty));
    
    // Combined efficiency score
    return Math.min(1, (timeScore + hintScore) / 2);
  },
}));