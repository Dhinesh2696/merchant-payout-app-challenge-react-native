import React from 'react';
import { render } from '@testing-library/react-native';
import { OfflineBanner } from '../offline-banner';
import { useSelector } from 'react-redux';

// Mock Redux
jest.mock('react-redux', () => ({
  useSelector: jest.fn(),
}));

jest.mock('@/constants/i18n', () => ({
  t: jest.fn((key) => key),
}));

jest.mock('react-native-safe-area-context', () => ({
  useSafeAreaInsets: () => ({ top: 0, bottom: 0, left: 0, right: 0 }),
}));

const mockUseSelector = useSelector as jest.Mock;

describe('OfflineBanner', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders nothing when online', () => {
    mockUseSelector.mockReturnValue(false);
    const { queryByText } = render(<OfflineBanner />);
    expect(queryByText('common.noInternet')).toBeNull();
  });

  it('renders banner when offline', () => {
    mockUseSelector.mockReturnValue(true);
    const { getByText } = render(<OfflineBanner />);
    expect(getByText('common.noInternet')).toBeTruthy();
  });
});
