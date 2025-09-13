import React, { useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import {
  Text,
  ActivityIndicator,
  StyleSheet,
  SafeAreaView,
  Platform,
} from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import {
  SafeAreaProvider,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';
import { HomeScreen } from './src/screens/HomeScreen';
import { GameScreen } from './src/screens/GameScreen';
import { SettingsScreen } from './src/screens/SettingsScreen';
import { PuzzleMeta, Difficulty } from './src/types';
import { showAd } from './src/services/monetization';
import { getStatusBarConfig, getSafeAreaPadding } from './src/utils/statusBar';

type Screen = 'home' | 'game' | 'settings' | 'loading-ad';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<Screen>('home');
  const [selectedPuzzle, setSelectedPuzzle] = useState<PuzzleMeta | null>(null);
  const [selectedDifficulty, setSelectedDifficulty] =
    useState<Difficulty>('AGES_3_5');

  const handleSelectPuzzle = async (puzzle: PuzzleMeta) => {
    try {
      // Set loading state while ad is showing
      setCurrentScreen('loading-ad');

      console.log('🎬 Starting ad before puzzle...');

      // BLOCKING: Wait for ad to complete or be skipped before starting game
      const adResult = await showAd();

      if (adResult.success) {
        if (adResult.skipped) {
          console.log('⏭️ Ad was skipped, starting puzzle');
        } else {
          console.log('✅ Ad completed successfully, starting puzzle');
        }
      } else {
        console.log('❌ Ad failed, starting puzzle anyway');
      }

      // Start the puzzle after ad is done
      setSelectedPuzzle(puzzle);
      setSelectedDifficulty(puzzle.defaultDifficulty);
      setCurrentScreen('game');
    } catch (error) {
      console.error('Error in puzzle selection flow:', error);
      // Always allow game to start even if ad system fails
      setSelectedPuzzle(puzzle);
      setSelectedDifficulty(puzzle.defaultDifficulty);
      setCurrentScreen('game');
    }
  };

  const handleExitGame = () => {
    setCurrentScreen('home');
    setSelectedPuzzle(null);
  };

  const handleOpenSettings = () => {
    setCurrentScreen('settings');
  };

  const handleExitSettings = () => {
    setCurrentScreen('home');
  };

  return (
    <SafeAreaProvider>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <StatusBar
          style={
            getStatusBarConfig(currentScreen === 'game' ? 'game' : 'normal')
              .style
          }
          backgroundColor={
            getStatusBarConfig(currentScreen === 'game' ? 'game' : 'normal')
              .backgroundColor
          }
          translucent={
            getStatusBarConfig(currentScreen === 'game' ? 'game' : 'normal')
              .translucent
          }
          hidden={
            getStatusBarConfig(currentScreen === 'game' ? 'game' : 'normal')
              .hidden
          }
        />

        {currentScreen === 'home' && (
          <HomeScreen
            onSelectPuzzle={handleSelectPuzzle}
            onOpenSettings={handleOpenSettings}
          />
        )}

        {currentScreen === 'loading-ad' && <AdLoadingScreen />}

        {currentScreen === 'game' && selectedPuzzle && (
          <GameScreen
            puzzle={selectedPuzzle}
            difficulty={selectedDifficulty}
            onExit={handleExitGame}
          />
        )}

        {currentScreen === 'settings' && (
          <SettingsScreen onExit={handleExitSettings} />
        )}
      </GestureHandlerRootView>
    </SafeAreaProvider>
  );
}

// Loading screen shown while interstitial ad is playing
function AdLoadingScreen() {
  const insets = useSafeAreaInsets();
  const safeAreaPadding = getSafeAreaPadding();

  return (
    <SafeAreaView
      style={[
        styles.adLoadingContainer,
        { paddingTop: Math.max(insets.top, safeAreaPadding.paddingTop) },
      ]}
    >
      <ActivityIndicator size="large" color="#007AFF" />
      <Text style={styles.adLoadingText}>Loading...</Text>
      <Text style={styles.adLoadingSubtext}>
        Ad will be skippable in a few seconds
      </Text>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  adLoadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    paddingHorizontal: 20,
  },
  adLoadingText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginTop: 16,
  },
  adLoadingSubtext: {
    fontSize: 14,
    color: '#666',
    marginTop: 8,
    textAlign: 'center',
    lineHeight: 20,
  },
});
