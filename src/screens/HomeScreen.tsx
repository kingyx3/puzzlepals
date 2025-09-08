// Home screen showing puzzle packs

import React from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
} from 'react-native';
import { PackCard } from '../components/PackCard';
import { allPacks } from '../data/packs';
import { PuzzleMeta } from '../types';
import { colors, spacing, typography, layout } from '../theme';

interface HomeScreenProps {
  onSelectPuzzle: (puzzle: PuzzleMeta) => void;
  onOpenSettings: () => void;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({
  onSelectPuzzle,
  onOpenSettings,
}) => {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.titleContainer}>
          <Text style={styles.title}>🧩 PuzzlePals</Text>
          <Text style={styles.subtitle}>Choose your puzzle adventure!</Text>
        </View>
        <TouchableOpacity
          style={styles.settingsButton}
          onPress={onOpenSettings}
          accessible={true}
          accessibilityRole="button"
          accessibilityLabel="Open settings"
          accessibilityHint="Opens the settings screen where you can adjust app preferences and accessibility options"
        >
          <Text style={styles.settingsButtonText}>⚙️</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.content}
        accessible={false}
        accessibilityLabel="Puzzle packs list"
      >
        {allPacks.map((pack) => (
          <PackCard
            key={pack.id}
            pack={pack}
            onSelectPuzzle={onSelectPuzzle}
            style={styles.packCard}
          />
        ))}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    padding: spacing.lg,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  titleContainer: {
    flex: 1,
    alignItems: 'center',
  },
  title: {
    fontSize: typography.xxxl,
    fontWeight: typography.weight.bold,
    color: colors.primary,
    marginBottom: spacing.xs,
  },
  subtitle: {
    fontSize: typography.lg,
    color: colors.secondary,
    textAlign: 'center',
  },
  settingsButton: {
    padding: spacing.sm,
    backgroundColor: colors.surface,
    borderRadius: layout.touchTargetLarge / 2,
    minWidth: layout.touchTargetLarge, // Increased for kid-friendly design
    minHeight: layout.touchTargetLarge, // Increased for kid-friendly design
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 2,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  settingsButtonText: {
    fontSize: typography.lg,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: spacing.md,
  },
  packCard: {
    marginBottom: spacing.md,
  },
});
