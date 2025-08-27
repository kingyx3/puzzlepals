import React, { useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { HomeScreen } from './src/screens/HomeScreen';
import { GameScreen } from './src/screens/GameScreen';
import { PuzzleMeta, Difficulty } from './src/types';

type Screen = 'home' | 'game';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<Screen>('home');
  const [selectedPuzzle, setSelectedPuzzle] = useState<PuzzleMeta | null>(null);
  const [selectedDifficulty, setSelectedDifficulty] = useState<Difficulty>('AGES_3_5');

  const handleSelectPuzzle = (puzzle: PuzzleMeta) => {
    setSelectedPuzzle(puzzle);
    setSelectedDifficulty(puzzle.defaultDifficulty);
    setCurrentScreen('game');
  };

  const handleExitGame = () => {
    setCurrentScreen('home');
    setSelectedPuzzle(null);
  };

  return (
    <>
      {currentScreen === 'home' && (
        <HomeScreen onSelectPuzzle={handleSelectPuzzle} />
      )}
      
      {currentScreen === 'game' && selectedPuzzle && (
        <GameScreen 
          puzzle={selectedPuzzle} 
          difficulty={selectedDifficulty}
          onExit={handleExitGame} 
        />
      )}
      
      <StatusBar style="auto" />
    </>
  );
}
