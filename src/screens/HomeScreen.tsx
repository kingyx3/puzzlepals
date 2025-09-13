// Home screen showing puzzle packs

import React, { useState } from 'react';
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
  const [isSettingsPressed, setIsSettingsPressed] = useState(false);
  const insets = useSafeAreaInsets();
  const safeAreaPadding = getSafeAreaPadding();

  const handleSettingsPress = () => {
    setIsSettingsPressed(true);
    // Add slight delay for visual feedback
    setTimeout(() => {
      onOpenSettings();
      setIsSettingsPressed(false);
    }, 100);
  };

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
          style={[
            styles.settingsButton,
            isSettingsPressed && styles.settingsButtonPressed,
          ]}
          onPress={handleSettingsPress}
          onPressIn={() => setIsSettingsPressed(true)}
          onPressOut={() => setIsSettingsPressed(false)}
          activeOpacity={0.9}
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
    paddingBottom: spacing.xl,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.surface,
    ...shadows.lg,
    borderBottomLeftRadius: borderRadius.xl,
    borderBottomRightRadius: borderRadius.xl,
    // Add subtle gradient effect
    position: 'relative',
  },
  titleContainer: {
    flex: 1,
    alignItems: 'center',
  },
  title: {
    fontSize: typography.display, // Use the new display size
    fontWeight: typography.weight.heavy,
    color: colors.primary,
    marginBottom: spacing.sm,
    textShadowColor: colors.primaryUltraLight,
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 6,
    letterSpacing: typography.letterSpacing.tight,
  },
  subtitle: {
    fontSize: typography.xl,
    color: colors.textSecondary,
    textAlign: 'center',
    fontWeight: typography.weight.medium,
    lineHeight: typography.lineHeight.relaxed * typography.xl,
    letterSpacing: typography.letterSpacing.normal,
  },
  settingsButton: {
    padding: spacing.md,
    backgroundColor: colors.primary,
    borderRadius: layout.touchTargetLarge / 2,
    minWidth: layout.touchTargetLarge,
    minHeight: layout.touchTargetLarge,
    alignItems: 'center',
    justifyContent: 'center',
    ...shadows.colored.primary,
    // Add hover/press states for web
    transform: [{ scale: 1 }],
  },
  settingsButtonPressed: {
    backgroundColor: colors.primaryDark,
    transform: [{ scale: 0.96 }],
  },
  settingsButtonText: {
    fontSize: typography.xl,
    color: colors.onPrimary,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: spacing.lg,
    paddingTop: spacing.xl,
  },
  packCard: {
    marginBottom: layout.kidFriendlySpacing.sectionGap,
  },
});
