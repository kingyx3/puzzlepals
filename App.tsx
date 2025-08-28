import React, { useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { HomeScreen } from './src/screens/HomeScreen';
import { GameScreen } from './src/screens/GameScreen';
import { SettingsScreen } from './src/screens/SettingsScreen';
import { PuzzleMeta, Difficulty } from './src/types';
import { showAd } from './src/services/monetization';

type Screen = 'home' | 'game' | 'settings';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<Screen>('home');
  const [selectedPuzzle, setSelectedPuzzle] = useState<PuzzleMeta | null>(null);
  const [selectedDifficulty, setSelectedDifficulty] = useState<Difficulty>('AGES_3_5');

  const handleSelectPuzzle = async (puzzle: PuzzleMeta) => {
    // Show ad before starting puzzle (non-blocking)
    const adResult = await showAd();
    if (adResult.success) {
      console.log('Ad display completed, starting puzzle');
    } else {
      console.log('Ad failed or skipped, starting puzzle anyway');
    }
    
    // Always start the puzzle regardless of ad success/failure
    setSelectedPuzzle(puzzle);
    setSelectedDifficulty(puzzle.defaultDifficulty);
    setCurrentScreen('game');
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
    <>
      {currentScreen === 'home' && (
        <HomeScreen 
          onSelectPuzzle={handleSelectPuzzle} 
          onOpenSettings={handleOpenSettings}
        />
      )}
      
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
      
      <StatusBar style="auto" />
    </>
  );
}
