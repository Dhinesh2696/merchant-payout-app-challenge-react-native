// Mocks for components and native modules
const React = require('react');
const { NativeModules } = require('react-native');

// Mock ScreenSecurity Native Module
NativeModules.ScreenSecurity = {
  getDeviceId: jest.fn(() => Promise.resolve('mock-device-id')),
  isBiometricAuthenticated: jest.fn(() => Promise.resolve(true)),
  addListener: jest.fn(),
  removeListeners: jest.fn(),
};

// Mock KeyboardObserver
NativeModules.KeyboardObserver = {
  addListener: jest.fn(),
  removeListeners: jest.fn(),
};

// Targeted mock for the crashing RN component
jest.mock('react-native/Libraries/Components/Keyboard/KeyboardAvoidingView', () => {
  return {
    __esModule: true,
    default: (props) => require('react').createElement('View', props, props.children),
  };
});

// Mock NativeEventEmitter
jest.mock('react-native/Libraries/EventEmitter/NativeEventEmitter', () => {
  return {
    __esModule: true,
    default: jest.fn().mockImplementation(() => ({
      addListener: jest.fn(),
      removeListeners: jest.fn(),
    })),
  };
});

// Mock expo-localization
jest.mock('expo-localization', () => ({
  getLocales: () => [{ languageCode: 'en' }],
}));

// Mock Ionicons
jest.mock('@expo/vector-icons', () => {
  return {
    Ionicons: (props) => require('react').createElement('Ionicons', props),
  };
});

// Mock useThemeColor
jest.mock('@/hooks/use-theme-color', () => ({
  useThemeColor: jest.fn((props, colorName) => '#000'),
}));
