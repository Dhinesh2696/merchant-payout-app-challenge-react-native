import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { CurrencySelector } from '../currency-selector';

// Mock i18n
jest.mock('../../constants/i18n', () => ({
  t: jest.fn((key) => key),
}));

describe('CurrencySelector', () => {
  const onSelectMock = jest.fn();

  it('renders correctly with current value', () => {
    const { getByText } = render(
      <CurrencySelector value="GBP" onSelect={onSelectMock} />
    );
    expect(getByText('GBP')).toBeTruthy();
  });

  it('opens modal on press', () => {
    const { getByTestId, getByText } = render(
      <CurrencySelector value="GBP" onSelect={onSelectMock} />
    );
    
    // The component uses a TouchableOpacity for the button
    const button = getByText('GBP');
    fireEvent.press(button);

    // Should show "payout.currencyLabel" in modal
    expect(getByText('payout.currencyLabel')).toBeTruthy();
  });

  it('calls onSelect and closes when a currency is selected', () => {
    const { getByText } = render(
      <CurrencySelector value="GBP" onSelect={onSelectMock} />
    );
    
    fireEvent.press(getByText('GBP'));
    
    // Select EUR in the modal
    const eurOption = getByText('payout.currencies.EUR');
    fireEvent.press(eurOption);

    expect(onSelectMock).toHaveBeenCalledWith('EUR');
  });
});
