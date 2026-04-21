import React from 'react';
import { Text } from 'react-native';
import { render, fireEvent } from '@testing-library/react-native';
import { ThemedButton } from '../themed-button';

// Mock useThemeColor
jest.mock('@/hooks/use-theme-color', () => ({
  useThemeColor: jest.fn(() => '#007AFF'),
}));

describe('ThemedButton', () => {
  it('renders correctly with children', () => {
    const { getByText } = render(
      <ThemedButton onPress={() => {}}>
        <Text>Test Button</Text>
      </ThemedButton>
    );
    expect(getByText('Test Button')).toBeTruthy();
  });

  it('calls onPress when pressed', () => {
    const onPress = jest.fn();
    const { getByText } = render(
      <ThemedButton onPress={onPress}>
        <Text>Press Me</Text>
      </ThemedButton>
    );
    
    fireEvent.press(getByText('Press Me'));
    expect(onPress).toHaveBeenCalled();
  });

  it('is disabled when disabled prop is true', () => {
    const onPress = jest.fn();
    const { getByTestId } = render(
      <ThemedButton onPress={onPress} disabled={true} testID="disabled-btn">
        <Text>Disabled</Text>
      </ThemedButton>
    );
    
    // We can simulate a press even if it's disabled, but we expect our component to handle the disabled state.
    // However, TouchableOpacity handles the disabled state internally, so the mock might just pass the press anyway depending on how RNTL handles it.
    // Let's check if the component has the disabled prop set correctly.
    const button = getByTestId('disabled-btn');
    expect(button.props.accessibilityState.disabled).toBe(true);
  });
});
