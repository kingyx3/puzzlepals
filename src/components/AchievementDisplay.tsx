// Enhanced achievement system with better engagement features

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { useAchievementStore, Achievement } from '../stores/achievements';
import { colors, spacing, typography } from '../theme';

interface AchievementDisplayProps {
  visible: boolean;
  onClose: () => void;
}

export const AchievementDisplay: React.FC<AchievementDisplayProps> = ({
  visible,
  onClose,
}) => {
  const { achievements, unlockedAchievements, playerStats } =
    useAchievementStore();

  const unlockedAchievementsData = achievements.filter((achievement) =>
    unlockedAchievements.includes(achievement.id)
  );

  const lockedAchievements = achievements.filter(
    (achievement) => !unlockedAchievements.includes(achievement.id)
  );

  // Helper functions to get display text from keys
  const getAchievementTitle = (achievement: Achievement): string => {
    // For now, return simple English titles based on titleKey
    // TODO: Implement proper i18n when translation system is ready
    const titleMap: Record<string, string> = {
      'achievements.first_puzzle.title': 'First Steps',
      'achievements.puzzle_master.title': 'Puzzle Master',
      'achievements.speed_demon.title': 'Speed Demon',
      'achievements.no_hints_hero.title': 'No Hints Hero',
      'achievements.streak_master.title': 'Streak Champion',
      'achievements.difficulty_explorer.title': 'Difficulty Climber',
    };
    return titleMap[achievement.titleKey] || achievement.titleKey;
  };

  const getAchievementDescription = (achievement: Achievement): string => {
    // For now, return simple English descriptions based on descriptionKey
    // TODO: Implement proper i18n when translation system is ready
    const descriptionMap: Record<string, string> = {
      'achievements.first_puzzle.description': 'Complete your first puzzle',
      'achievements.puzzle_master.description': 'Complete 100 puzzles',
      'achievements.speed_demon.description': 'Complete a puzzle in under 2 minutes',
      'achievements.no_hints_hero.description': 'Complete a puzzle without hints',
      'achievements.streak_master.description': 'Maintain a 7-day streak',
      'achievements.difficulty_explorer.description': 'Complete puzzles on all difficulties',
    };
    return (
      descriptionMap[achievement.descriptionKey] || achievement.descriptionKey
    );
  };

  const getProgressText = (achievement: Achievement) => {
    switch (achievement.id) {
      case 'puzzle_master':
        return `${playerStats.totalPuzzlesCompleted}/100 puzzles`;
      case 'speed_demon':
        const fastestTime = Math.min(
          ...Object.values(playerStats.difficultyStats).map(
            (stat) => stat.bestTime
          )
        );
        return fastestTime < 2 * 60 * 1000 ? 'Completed!' : 'Keep practicing!';
      case 'streak_master':
        return `${playerStats.currentStreak} day streak`;
      case 'no_hints_hero':
        const hintsUsed = playerStats.totalHintsUsed;
        return hintsUsed === 0 ? 'No hints used!' : `${hintsUsed} hints used`;
      case 'difficulty_explorer':
        const completedDifficulties = Object.values(playerStats.difficultyStats).filter(
          (stats) => stats.completed > 0
        ).length;
        return `${completedDifficulties}/5 difficulties`;
      default:
        return '';
    }
  };

  const getAchievementIcon = (achievementId: string, isUnlocked: boolean) => {
    const icons: Record<string, string> = {
      first_puzzle: '🧩',
      puzzle_master: '👑',
      speed_demon: '⚡',
      no_hints_hero: '🎯',
      streak_master: '🔥',
      difficulty_explorer: '🗺️',
    };

    return isUnlocked ? icons[achievementId] || '🏆' : '🔒';
  };

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
            <Text style={styles.title}>🏆 Achievements</Text>
            <TouchableOpacity style={styles.closeButton} onPress={onClose}>
              <Text style={styles.closeButtonText}>✕</Text>
            </TouchableOpacity>
          </View>

          <ScrollView
            style={styles.content}
            showsVerticalScrollIndicator={false}
          >
            {/* Player Stats Summary */}
            <View style={styles.statsSection}>
              <Text style={styles.sectionTitle}>Your Progress</Text>
              <View style={styles.statsGrid}>
                <View style={styles.statCard}>
                  <Text style={styles.statNumber}>
                    {playerStats.totalPuzzlesCompleted}
                  </Text>
                  <Text style={styles.statLabel}>Puzzles Completed</Text>
                </View>
                <View style={styles.statCard}>
                  <Text style={styles.statNumber}>
                    {playerStats.currentStreak}
                  </Text>
                  <Text style={styles.statLabel}>Current Streak</Text>
                </View>
                <View style={styles.statCard}>
                  <Text style={styles.statNumber}>
                    {Math.floor(
                      playerStats.averageCompletionTime / (60 * 1000)
                    )}
                    m
                  </Text>
                  <Text style={styles.statLabel}>Avg. Time</Text>
                </View>
                <View style={styles.statCard}>
                  <Text style={styles.statNumber}>
                    {unlockedAchievementsData.length}
                  </Text>
                  <Text style={styles.statLabel}>Achievements</Text>
                </View>
              </View>
            </View>

            {/* Unlocked Achievements */}
            {unlockedAchievementsData.length > 0 && (
              <View style={styles.achievementsSection}>
                <Text style={styles.sectionTitle}>
                  🎉 Unlocked Achievements
                </Text>
                {unlockedAchievementsData.map((achievement) => (
                  <View
                    key={achievement.id}
                    style={[styles.achievementCard, styles.unlockedCard]}
                  >
                    <View style={styles.achievementIcon}>
                      <Text style={styles.achievementIconText}>
                        {getAchievementIcon(achievement.id, true)}
                      </Text>
                    </View>
                    <View style={styles.achievementContent}>
                      <Text style={styles.achievementTitle}>
                        {getAchievementTitle(achievement)}
                      </Text>
                      <Text style={styles.achievementDescription}>
                        {getAchievementDescription(achievement)}
                      </Text>
                      <Text style={styles.achievementProgress}>
                        {getProgressText(achievement)}
                      </Text>
                    </View>
                  </View>
                ))}
              </View>
            )}

            {/* Locked Achievements */}
            {lockedAchievements.length > 0 && (
              <View style={styles.achievementsSection}>
                <Text style={styles.sectionTitle}>🎯 Keep Going</Text>
                {lockedAchievements.map((achievement) => (
                  <View
                    key={achievement.id}
                    style={[styles.achievementCard, styles.lockedCard]}
                  >
                    <View style={styles.achievementIcon}>
                      <Text style={styles.achievementIconText}>
                        {getAchievementIcon(achievement.id, false)}
                      </Text>
                    </View>
                    <View style={styles.achievementContent}>
                      <Text
                        style={[styles.achievementTitle, styles.lockedTitle]}
                      >
                        {getAchievementTitle(achievement)}
                      </Text>
                      <Text
                        style={[
                          styles.achievementDescription,
                          styles.lockedDescription,
                        ]}
                      >
                        {getAchievementDescription(achievement)}
                      </Text>
                      <Text style={styles.achievementProgress}>
                        {getProgressText(achievement)}
                      </Text>
                    </View>
                  </View>
                ))}
              </View>
            )}

            {/* Tips Section */}
            <View style={styles.tipsSection}>
              <Text style={styles.sectionTitle}>💡 Achievement Tips</Text>
              <Text style={styles.tipText}>
                • Complete puzzles daily to maintain your streak
              </Text>
              <Text style={styles.tipText}>
                • Try harder difficulties for bonus achievements
              </Text>
              <Text style={styles.tipText}>
                • Challenge yourself to use fewer hints
              </Text>
              <Text style={styles.tipText}>
                • Speed runs unlock special achievements
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
    maxHeight: '90%',
    minHeight: '70%',
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
  statsSection: {
    marginBottom: spacing.xl,
  },
  sectionTitle: {
    fontSize: typography.lg,
    fontWeight: typography.weight.semibold,
    color: colors.onSurface,
    marginBottom: spacing.md,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  statCard: {
    flex: 1,
    minWidth: '22%',
    backgroundColor: colors.background,
    borderRadius: 12,
    padding: spacing.md,
    alignItems: 'center',
  },
  statNumber: {
    fontSize: typography.xl,
    fontWeight: typography.weight.bold,
    color: colors.primary,
    marginBottom: spacing.xs / 2,
  },
  statLabel: {
    fontSize: typography.xs,
    color: colors.secondary,
    textAlign: 'center',
    lineHeight: typography.xs * 1.2,
  },
  achievementsSection: {
    marginBottom: spacing.xl,
  },
  achievementCard: {
    flexDirection: 'row',
    backgroundColor: colors.background,
    borderRadius: 12,
    padding: spacing.md,
    marginBottom: spacing.md,
    borderWidth: 2,
  },
  unlockedCard: {
    borderColor: colors.success,
    backgroundColor: 'rgba(76, 175, 80, 0.05)',
  },
  lockedCard: {
    borderColor: colors.outline,
    opacity: 0.7,
  },
  achievementIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: colors.surface,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
  },
  achievementIconText: {
    fontSize: typography.xl,
  },
  achievementContent: {
    flex: 1,
    justifyContent: 'center',
  },
  achievementTitle: {
    fontSize: typography.md,
    fontWeight: typography.weight.semibold,
    color: colors.onSurface,
    marginBottom: spacing.xs / 2,
  },
  lockedTitle: {
    color: colors.secondary,
  },
  achievementDescription: {
    fontSize: typography.sm,
    color: colors.secondary,
    marginBottom: spacing.xs,
    lineHeight: typography.sm * 1.3,
  },
  lockedDescription: {
    color: colors.outline,
  },
  achievementProgress: {
    fontSize: typography.xs,
    color: colors.primary,
    fontWeight: typography.weight.medium,
    fontStyle: 'italic',
  },
  tipsSection: {
    backgroundColor: 'rgba(107, 158, 255, 0.1)',
    borderRadius: 12,
    padding: spacing.md,
    marginBottom: spacing.lg,
  },
  tipText: {
    fontSize: typography.sm,
    color: colors.onSurface,
    marginBottom: spacing.xs,
    lineHeight: typography.sm * 1.4,
  },
});
