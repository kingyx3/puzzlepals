// Settings state management

import { create } from 'zustand';
import { GameSettings, Difficulty } from '../types';

interface SettingsState extends GameSettings {
  // Actions
  updateSettings: (updates: Partial<GameSettings>) => void;
  toggleSound: () => void;
  toggleHaptic: () => void;
  setDifficulty: (difficulty: Difficulty) => void;
  resetSettings: () => void;
}

const defaultSettings: GameSettings = {
  soundEnabled: true,
  hapticEnabled: true,
  reducedMotion: false,
  parentalGateEnabled: true,
  defaultDifficulty: 'AGES_3_5',
  language: 'en',
};

export const useSettingsStore = create<SettingsState>((set, get) => ({
  ...defaultSettings,

  updateSettings: (updates) => {
    set(updates);
  },

  toggleSound: () => {
    set({ soundEnabled: !get().soundEnabled });
  },

  toggleHaptic: () => {
    set({ hapticEnabled: !get().hapticEnabled });
  },

  setDifficulty: (difficulty) => {
    set({ defaultDifficulty: difficulty });
  },

  resetSettings: () => {
    set(defaultSettings);
  },
}));
