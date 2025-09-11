// Jest setup file for React Native and Expo environment

// Mock React Native modules that don't work in Node environment
global.window = {};
global.document = {};
global.navigator = { userAgent: 'node.js' };

// Mock console methods to reduce test noise
global.console = {
  ...console,
  log: jest.fn(),
  warn: jest.fn(),
  error: jest.fn(),
};

// Mock React Native modules
jest.mock('react-native', () => ({
  Platform: { OS: 'ios', select: jest.fn() },
  Dimensions: { get: jest.fn(() => ({ width: 375, height: 667 })) },
  StyleSheet: { create: jest.fn((x) => x) },
  View: 'View',
  Text: 'Text',
  TouchableOpacity: 'TouchableOpacity',
  Image: 'Image',
  Modal: 'Modal',
  SafeAreaView: 'SafeAreaView',
  ScrollView: 'ScrollView',
  ActivityIndicator: 'ActivityIndicator',
}));

// Mock Expo modules
jest.mock('expo-status-bar', () => ({
  StatusBar: 'StatusBar',
}));

jest.mock('expo-haptics', () => ({
  impactAsync: jest.fn(),
  ImpactFeedbackStyle: { Medium: 'medium' },
}));

jest.mock('expo-av', () => ({
  Audio: {
    setAudioModeAsync: jest.fn(),
    Sound: {
      createAsync: jest.fn(() => ({
        sound: { playAsync: jest.fn(), unloadAsync: jest.fn() },
      })),
    },
  },
}));

// Mock gesture handler
jest.mock('react-native-gesture-handler', () => ({
  GestureHandlerRootView: 'GestureHandlerRootView',
  PanGestureHandler: 'PanGestureHandler',
  State: { BEGAN: 'BEGAN', ACTIVE: 'ACTIVE', END: 'END' },
}));

// Mock reanimated
jest.mock('react-native-reanimated', () => ({
  default: {
    Value: jest.fn(),
    event: jest.fn(),
    add: jest.fn(),
    eq: jest.fn(),
    set: jest.fn(),
    cond: jest.fn(),
    interpolate: jest.fn(),
  },
  useSharedValue: jest.fn(() => ({ value: 0 })),
  useAnimatedStyle: jest.fn(() => ({})),
  useDerivedValue: jest.fn(),
  runOnJS: jest.fn((fn) => fn),
}));

// Mock zustand
jest.mock('zustand', () => ({
  create: jest.fn((fn) => {
    const state = fn(jest.fn(), jest.fn());
    return Object.assign(
      jest.fn(() => state),
      {
        setState: jest.fn((newState) => Object.assign(state, newState)),
        getState: jest.fn(() => state),
      }
    );
  }),
}));

// Mock MMKV storage
jest.mock('react-native-mmkv', () => ({
  MMKV: jest.fn().mockImplementation(() => ({
    set: jest.fn(),
    getString: jest.fn(),
    getNumber: jest.fn(),
    getBoolean: jest.fn(),
    delete: jest.fn(),
    clearAll: jest.fn(),
  })),
}));
