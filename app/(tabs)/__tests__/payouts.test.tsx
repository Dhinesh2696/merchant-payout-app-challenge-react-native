import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import PayoutsScreen from '../payouts';

// Mock dependencies
jest.mock('expo-router', () => ({
  router: { push: jest.fn() },
}));

jest.mock('react-native-safe-area-context', () => ({
  SafeAreaView: ({ children }: any) => children,
  useSafeAreaInsets: () => ({ top: 0, bottom: 0, left: 0, right: 0 }),
}));

jest.mock('@/constants/i18n', () => ({
  t: jest.fn((key) => key),
}));

// Mock child components to isolate PayoutsScreen logic
// Using require('react') inside factories to ensure they are valid components
jest.mock('@/components/currency-selector', () => {
  const React = require('react');
  return {
    CurrencySelector: () => React.createElement('View'),
  };
});

jest.mock('@/components/payout-confirmation', () => {
  const React = require('react');
  return {
    PayoutConfirmation: () => React.createElement('View'),
  };
});

jest.mock('@/components/payout-result', () => {
  const React = require('react');
  return {
    PayoutResult: () => React.createElement('View'),
  };
});

// Simple mock for validation
jest.mock('@/utils/validation', () => ({
  isValidIBAN: jest.fn((iban) => iban === 'GB29NWBK60161331926819'),
}));

const mockReducer = (state = { loading: false, error: null, success: false, result: null }, action: any) => {
  switch (action.type) {
    case 'payout/createRequest':
      return { ...state, loading: true };
    case 'payout/createSuccess':
      return { ...state, loading: false, success: true, result: action.payload };
    default:
      return state;
  }
};

const renderWithRedux = (component: React.ReactElement, { initialState }: any = {}) => {
  const store = configureStore({
    reducer: {
      payout: mockReducer, 
    },
    preloadedState: initialState,
  });
  return {
    ...render(<Provider store={store}>{component}</Provider>),
    store,
  };
};

describe('PayoutsScreen', () => {
  it('renders initial state correctly', () => {
    const { getByPlaceholderText, getByText } = renderWithRedux(<PayoutsScreen />);
    
    expect(getByText('payout.title')).toBeTruthy();
    expect(getByPlaceholderText('payout.amountPlaceholder')).toBeTruthy();
    expect(getByPlaceholderText('payout.ibanPlaceholder')).toBeTruthy();
  });

  it('button remains disabled with invalid input', () => {
    const { getByPlaceholderText, getByText } = renderWithRedux(<PayoutsScreen />);
    
    const amountInput = getByPlaceholderText('payout.amountPlaceholder');
    const ibanInput = getByPlaceholderText('payout.ibanPlaceholder');

    fireEvent.changeText(amountInput, '100');
    fireEvent.changeText(ibanInput, 'INVALID');
  });

  it('button enables with valid input', async () => {
    const { getByPlaceholderText, getByText } = renderWithRedux(<PayoutsScreen />);
    
    const amountInput = getByPlaceholderText('payout.amountPlaceholder');
    const ibanInput = getByPlaceholderText('payout.ibanPlaceholder');

    fireEvent.changeText(amountInput, '100');
    fireEvent.changeText(ibanInput, 'GB29NWBK60161331926819');

    const confirmButton = getByText('payout.continue');
    fireEvent.press(confirmButton);
  });
});
