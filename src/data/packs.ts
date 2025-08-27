// Sample puzzle packs and data

import { PuzzlePack, PuzzleMeta } from '../types';

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
    {
      id: 'animals-eagle',
      titleKey: 'puzzles.eagle',
      imageAsset: placeholderImage,
      defaultDifficulty: 'AGES_11_PLUS',
      educationalContent: {
        facts: [
          'Eagles have incredible eyesight',
          'Eagles are birds of prey',
        ],
        vocabulary: ['predator', 'eyesight', 'soar'],
        learningPrompts: [
          'How do eagles hunt for food?',
          'What makes eagles good hunters?',
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

export const AdvancedPack: PuzzlePack = {
  id: 'advanced',
  titleKey: 'packs.advanced',
  coverAsset: placeholderImage,
  puzzles: [
    {
      id: 'advanced-nature',
      titleKey: 'puzzles.nature',
      imageAsset: placeholderImage,
      defaultDifficulty: 'EASY',
    },
    {
      id: 'advanced-landscape',
      titleKey: 'puzzles.landscape',
      imageAsset: placeholderImage,
      defaultDifficulty: 'MEDIUM',
    },
    {
      id: 'advanced-cityscape',
      titleKey: 'puzzles.cityscape',
      imageAsset: placeholderImage,
      defaultDifficulty: 'HARD',
    },
    {
      id: 'advanced-masterpiece',
      titleKey: 'puzzles.masterpiece',
      imageAsset: placeholderImage,
      defaultDifficulty: 'EXPERT',
    },
    {
      id: 'advanced-ultimate',
      titleKey: 'puzzles.ultimate',
      imageAsset: placeholderImage,
      defaultDifficulty: 'MASTER',
    },
  ],
};

export const allPacks: PuzzlePack[] = [AnimalsPack, VehiclesPack, AdvancedPack];

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