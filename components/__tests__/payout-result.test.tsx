import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { PayoutResult } from '../payout-result';

// Mocking dependencies
jest.mock('../../hooks/use-theme-color', () => ({
  useThemeColor: jest.fn(() => '#000'),
}));

jest.mock('react-native-safe-area-context', () => ({
  useSafeAreaInsets: jest.fn(() => ({ top: 50, bottom: 0, left: 0, right: 0 })),
}));

// Mock i18n
jest.mock('../../constants/i18n', () => ({
  t: jest.fn((key, params) => {
    if (params && params.amount) return `Mock Amount ${params.amount}`;
    return key;
  }),
}));

describe('PayoutResult', () => {
  const mockResult = {
    id: '123',
    amount: 10000,
    currency: 'GBP' as const,
    iban: 'GB29NWBK60161331926819',
    status: 'completed' as const,
    created_at: '2024-01-01T00:00:00Z',
  };

  const defaultProps = {
    visible: true,
    success: true,
    error: null,
    result: mockResult,
    onClose: jest.fn(),
  };

  it('renders success state correctly', () => {
    const { getByText, getByTestId } = render(<PayoutResult {...defaultProps} />);
    
    expect(getByText('payout.payout')).toBeTruthy();
    expect(getByText('payout.result.success')).toBeTruthy();
    expect(getByText('Mock Amount £100.00')).toBeTruthy();
    expect(getByText('payout.result.createAnother')).toBeTruthy();
  });

  it('renders error state correctly', () => {
    const errorProps = {
      ...defaultProps,
      success: false,
      error: 'Insufficient funds',
      result: null,
    };
    const { getByText } = render(<PayoutResult {...errorProps} />);
    
    expect(getByText('payout.payout')).toBeTruthy();
    expect(getByText('payout.result.failed')).toBeTruthy();
    expect(getByText('Insufficient funds')).toBeTruthy();
    expect(getByText('payout.result.tryAgain')).toBeTruthy();
  });

  it('renders default error message if none provided', () => {
    const errorProps = {
      ...defaultProps,
      success: false,
      error: null,
      result: null,
    };
    const { getByText } = render(<PayoutResult {...errorProps} />);
    expect(getByText('payout.result.errorDefault')).toBeTruthy();
  });

  it('calls onClose when close icon is pressed', () => {
    const { getByRole, UNSAFE_getByProps } = render(<PayoutResult {...defaultProps} />);
    // Ionicons "close" button
    const closeButton = UNSAFE_getByProps({ name: 'close' }).parent;
    fireEvent.press(closeButton);
    expect(defaultProps.onClose).toHaveBeenCalled();
  });

  it('calls onClose when action button is pressed', () => {
    const { getByText } = render(<PayoutResult {...defaultProps} />);
    const actionButton = getByText('payout.result.createAnother');
    fireEvent.press(actionButton);
    expect(defaultProps.onClose).toHaveBeenCalled();
  });
});
