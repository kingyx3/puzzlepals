// Sample puzzle packs and data

import { PuzzlePack } from '../types';

// For now, we'll use placeholder assets - replace with actual images
const placeholderImage = require('../../assets/adaptive-icon.png'); // Using the existing adaptive icon as placeholder

export const AnimalsPack: PuzzlePack = {
  id: 'animals',
  titleKey: 'packs.animals',
  coverAsset: placeholderImage,
  puzzles: [
    {
      id: 'animals-lion',
      titleKey: 'puzzles.lion',
      imageAsset: placeholderImage,
      defaultDifficulty: 'AGES_3_5',
      educationalContent: {
        facts: ['Lions live in groups called prides', 'Male lions have manes'],
        vocabulary: ['pride', 'mane', 'savanna'],
        learningPrompts: [
          'What sound does a lion make?',
          'Where do lions live?',
        ],
      },
    },
    {
      id: 'animals-panda',
      titleKey: 'puzzles.panda',
      imageAsset: placeholderImage,
      defaultDifficulty: 'AGES_6_8',
      educationalContent: {
        facts: [
          'Pandas eat bamboo all day',
          'Baby pandas are very small when born',
        ],
        vocabulary: ['bamboo', 'habitat', 'endangered'],
        learningPrompts: [
          'What do pandas like to eat?',
          'What colors are pandas?',
        ],
      },
    },
    {
      id: 'animals-elephant',
      titleKey: 'puzzles.elephant',
      imageAsset: placeholderImage,
      defaultDifficulty: 'AGES_9_10',
      educationalContent: {
        facts: [
          'Elephants have excellent memories',
          'Elephants use their trunks like we use our hands',
        ],
        vocabulary: ['trunk', 'herd', 'memory'],
        learningPrompts: [
          'How do elephants pick up things?',
          'What do you remember best?',
        ],
      },
    },
  ],
};

export const VehiclesPack: PuzzlePack = {
  id: 'vehicles',
  titleKey: 'packs.vehicles',
  coverAsset: placeholderImage,
  puzzles: [
    {
      id: 'vehicles-car',
      titleKey: 'puzzles.car',
      imageAsset: placeholderImage,
      defaultDifficulty: 'AGES_3_5',
    },
    {
      id: 'vehicles-airplane',
      titleKey: 'puzzles.airplane',
      imageAsset: placeholderImage,
      defaultDifficulty: 'AGES_6_8',
    },
  ],
};

export const allPacks: PuzzlePack[] = [AnimalsPack, VehiclesPack];

// Helper function to find puzzle by ID
export function findPuzzleById(puzzleId: string): { pack: PuzzlePack; puzzle: PuzzleMeta } | null {
  for (const pack of allPacks) {
    const puzzle = pack.puzzles.find(p => p.id === puzzleId);
    if (puzzle) {
      return { pack, puzzle };
    }
  }
  return null;
}