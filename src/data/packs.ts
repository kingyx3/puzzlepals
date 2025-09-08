// Puzzle packs and data with organized assets

import { PuzzlePack, PuzzleMeta } from '../types';

// Animal pack assets
const animalsCover = require('../../assets/packs/animals/cover.jpg');
const lionImage = require('../../assets/packs/animals/lion.jpg');
const pandaImage = require('../../assets/packs/animals/panda.jpg');
const elephantImage = require('../../assets/packs/animals/elephant.jpg');
const eagleImage = require('../../assets/packs/animals/eagle.jpg');

export const AnimalsPack: PuzzlePack = {
  id: 'animals',
  titleKey: 'packs.animals',
  coverAsset: animalsCover,
  puzzles: [
    {
      id: 'animals-lion',
      titleKey: 'puzzles.lion',
      imageAsset: lionImage,
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
      imageAsset: pandaImage,
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
      imageAsset: elephantImage,
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
      imageAsset: eagleImage,
      defaultDifficulty: 'AGES_11_PLUS',
      educationalContent: {
        facts: ['Eagles have incredible eyesight', 'Eagles are birds of prey'],
        vocabulary: ['predator', 'eyesight', 'soar'],
        learningPrompts: [
          'How do eagles hunt for food?',
          'What makes eagles good hunters?',
        ],
      },
    },
  ],
};

// Vehicle pack assets
const vehiclesCover = require('../../assets/packs/vehicles/cover.jpg');
const carImage = require('../../assets/packs/vehicles/car.jpg');
const airplaneImage = require('../../assets/packs/vehicles/airplane.jpg');

export const VehiclesPack: PuzzlePack = {
  id: 'vehicles',
  titleKey: 'packs.vehicles',
  coverAsset: vehiclesCover,
  puzzles: [
    {
      id: 'vehicles-car',
      titleKey: 'puzzles.car',
      imageAsset: carImage,
      defaultDifficulty: 'AGES_3_5',
    },
    {
      id: 'vehicles-airplane',
      titleKey: 'puzzles.airplane',
      imageAsset: airplaneImage,
      defaultDifficulty: 'AGES_6_8',
    },
  ],
};

// Advanced pack assets
const advancedCover = require('../../assets/packs/advanced/cover.jpg');
const natureImage = require('../../assets/packs/advanced/nature.jpg');
const landscapeImage = require('../../assets/packs/advanced/landscape.jpg');
const cityscapeImage = require('../../assets/packs/advanced/cityscape.jpg');
const masterpieceImage = require('../../assets/packs/advanced/masterpiece.jpg');
const ultimateImage = require('../../assets/packs/advanced/ultimate.jpg');

export const AdvancedPack: PuzzlePack = {
  id: 'advanced',
  titleKey: 'packs.advanced',
  coverAsset: advancedCover,
  puzzles: [
    {
      id: 'advanced-nature',
      titleKey: 'puzzles.nature',
      imageAsset: natureImage,
      defaultDifficulty: 'EASY',
    },
    {
      id: 'advanced-landscape',
      titleKey: 'puzzles.landscape',
      imageAsset: landscapeImage,
      defaultDifficulty: 'MEDIUM',
    },
    {
      id: 'advanced-cityscape',
      titleKey: 'puzzles.cityscape',
      imageAsset: cityscapeImage,
      defaultDifficulty: 'HARD',
    },
    {
      id: 'advanced-masterpiece',
      titleKey: 'puzzles.masterpiece',
      imageAsset: masterpieceImage,
      defaultDifficulty: 'EXPERT',
    },
    {
      id: 'advanced-ultimate',
      titleKey: 'puzzles.ultimate',
      imageAsset: ultimateImage,
      defaultDifficulty: 'MASTER',
    },
  ],
};

export const allPacks: PuzzlePack[] = [AnimalsPack, VehiclesPack, AdvancedPack];

// Helper function to find puzzle by ID
export function findPuzzleById(
  puzzleId: string
): { pack: PuzzlePack; puzzle: PuzzleMeta } | null {
  for (const pack of allPacks) {
    const puzzle = pack.puzzles.find((p) => p.id === puzzleId);
    if (puzzle) {
      return { pack, puzzle };
    }
  }
  return null;
}
