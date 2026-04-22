import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { PayoutConfirmation } from '../payout-confirmation';
import i18n from '../../constants/i18n';

// Mocking dependencies
jest.mock('../../hooks/use-theme-color', () => ({
  useThemeColor: jest.fn(() => '#000'),
}));

// Mock safe area insets if needed, but this component doesn't use them directly
// Mock i18n
jest.mock('../../constants/i18n', () => ({
  t: jest.fn((key, params) => {
    if (params && params.amount) return `Mock Amount ${params.amount}`;
    return key;
  }),
}));

describe('PayoutConfirmation', () => {
  const defaultProps = {
    visible: true,
    amount: 10000, // £100.00
    currency: 'GBP' as const,
    iban: 'GB29NWBK60161331926819',
    loading: false,
    onConfirm: jest.fn(),
    onCancel: jest.fn(),
  };

  it('renders correctly when visible', () => {
    const { getByText } = render(<PayoutConfirmation {...defaultProps} />);
    expect(getByText('payout.confirm.title')).toBeTruthy();
  });

  it('displays masked IBAN', () => {
    const { getByText } = render(<PayoutConfirmation {...defaultProps} />);
    // GB29 (4) + 14 stars + 6819 (4) = 22 total
    expect(getByText('GB29**************6819')).toBeTruthy();
  });

  it('displays formatted amount', () => {
    const { getByText } = render(<PayoutConfirmation {...defaultProps} />);
    expect(getByText('£100.00')).toBeTruthy();
  });

  it('calls onConfirm when confirm button is pressed', () => {
    const { getByText } = render(<PayoutConfirmation {...defaultProps} />);
    const confirmButton = getByText('payout.confirm.confirm');
    fireEvent.press(confirmButton);
    expect(defaultProps.onConfirm).toHaveBeenCalled();
  });

  it('calls onCancel when cancel button is pressed', () => {
    const { getByText } = render(<PayoutConfirmation {...defaultProps} />);
    const cancelButton = getByText('payout.confirm.cancel');
    fireEvent.press(cancelButton);
    expect(defaultProps.onCancel).toHaveBeenCalled();
  });

  it('shows processing state when loading', () => {
    const { getByText } = render(<PayoutConfirmation {...defaultProps} loading={true} />);
    expect(getByText('payout.confirm.processing')).toBeTruthy();
  });

  it('disables buttons when loading', () => {
    const onConfirmMock = jest.fn();
    const { getByText } = render(
      <PayoutConfirmation 
        {...defaultProps} 
        loading={true} 
        onConfirm={onConfirmMock} 
      />
    );
    
    const confirmButton = getByText('payout.confirm.processing');
    fireEvent.press(confirmButton);
    expect(onConfirmMock).not.toHaveBeenCalled();
  });
});
