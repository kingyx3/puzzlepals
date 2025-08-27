// Home screen showing puzzle packs

import React from 'react';
import { View, Text, ScrollView, StyleSheet, SafeAreaView } from 'react-native';
import { PackCard } from '../components/PackCard';
import { allPacks } from '../data/packs';
import { PuzzleMeta } from '../types';
import { colors, spacing, typography } from '../theme';

interface HomeScreenProps {
  onSelectPuzzle: (puzzle: PuzzleMeta) => void;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({ onSelectPuzzle }) => {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>🧩 PuzzlePals</Text>
        <Text style={styles.subtitle}>Choose your puzzle adventure!</Text>
      </View>
      
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.content}>
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