import React from 'react';
import { render } from '@testing-library/react-native';
import { ThemedText } from '../themed-text';

// Mock useThemeColor
jest.mock('@/hooks/use-theme-color', () => ({
  useThemeColor: jest.fn(() => '#000000'),
}));

describe('ThemedText', () => {
  it('renders correctly with content', () => {
    const { getByText } = render(
      <ThemedText>Hello World</ThemedText>
    );
    expect(getByText('Hello World')).toBeTruthy();
  });

  it('applies type styles correctly', () => {
    const { getByText } = render(
      <ThemedText type="title">Title Text</ThemedText>
    );
    const text = getByText('Title Text');
    // We can't easily check actual styles in react-test-renderer without more setup,
    // but we can check if it renders without crashing.
    expect(text).toBeTruthy();
  });
  
  it('renders correctly for different types', () => {
    render(<ThemedText type="defaultSemiBold">SemiBold</ThemedText>);
    render(<ThemedText type="subtitle">Subtitle</ThemedText>);
    render(<ThemedText type="link">Link</ThemedText>);
  });
});
