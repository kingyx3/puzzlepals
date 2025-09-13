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
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { PackCard } from '../components/PackCard';
import { allPacks } from '../data/packs';
import { PuzzleMeta } from '../types';
import { colors, spacing, typography, layout, shadows, borderRadius } from '../theme';
import { getSafeAreaPadding } from '../utils/statusBar';

interface HomeScreenProps {
  onSelectPuzzle: (puzzle: PuzzleMeta) => void;
  onOpenSettings: () => void;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({
  onSelectPuzzle,
  onOpenSettings,
}) => {
  const insets = useSafeAreaInsets();
  const safeAreaPadding = getSafeAreaPadding();

  return (
    <SafeAreaView style={styles.container}>
      <View
        style={[
          styles.header,
          { paddingTop: Math.max(insets.top, safeAreaPadding.paddingTop) },
        ]}
      >
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
    backgroundColor: colors.surface,
    ...shadows.md,
    borderBottomLeftRadius: borderRadius.xl,
    borderBottomRightRadius: borderRadius.xl,
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
    textShadowColor: colors.primaryLight,
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  subtitle: {
    fontSize: typography.lg,
    color: colors.textSecondary,
    textAlign: 'center',
    fontWeight: typography.weight.medium,
  },
  settingsButton: {
    padding: spacing.sm,
    backgroundColor: colors.primary,
    borderRadius: layout.touchTargetLarge / 2,
    minWidth: layout.touchTargetLarge,
    minHeight: layout.touchTargetLarge,
    alignItems: 'center',
    justifyContent: 'center',
    ...shadows.colored.primary,
  },
  settingsButtonText: {
    fontSize: typography.lg,
    color: colors.onPrimary,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: spacing.md,
    paddingTop: spacing.lg,
  },
  packCard: {
    marginBottom: layout.kidFriendlySpacing.sectionGap,
  },
});
