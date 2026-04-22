import React from 'react';
import { render } from '@testing-library/react-native';
import TabLayout from '../_layout';

// Mock dependencies
jest.mock('expo-router', () => ({
  Tabs: ({ children }: any) => children,
}));

import { View } from 'react-native';
// Mock the Tabs.Screen component properly
const MockScreen = ({ name, options }: any) => <View testID={`screen-${name}`} />;
require('expo-router').Tabs.Screen = MockScreen;

jest.mock('@/hooks/use-theme-color', () => ({
  useThemeColor: jest.fn(() => '#000'),
}));

jest.mock('@/constants/i18n', () => ({
  t: jest.fn((key) => key),
}));

describe('TabLayout', () => {
  it('renders correctly', () => {
    const { toJSON } = render(<TabLayout />);
    expect(toJSON()).toBeTruthy();
  });
});
