import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import HomeScreen from '../index';
import { useMerchantData } from '../../../hooks/use-merchant-data';
import { useRouter } from 'expo-router';
import { useColorScheme } from 'react-native';
import i18n from '../../../constants/i18n';

// Mock dependencies
jest.mock('../../../hooks/use-merchant-data');
jest.mock('expo-router');
jest.mock('react-native/Libraries/Utilities/useColorScheme');

const mockUseMerchantData = useMerchantData as jest.Mock;
const mockUseRouter = useRouter as jest.Mock;
const mockUseColorScheme = useColorScheme as jest.Mock;

describe('HomeScreen', () => {
  const mockFetchMerchantData = jest.fn();
  const mockRouter = { push: jest.fn() };

  beforeEach(() => {
    jest.clearAllMocks();
    mockUseRouter.mockReturnValue(mockRouter);
    mockUseColorScheme.mockReturnValue('light');
    mockUseMerchantData.mockReturnValue({
      balance: null,
      recentActivity: [],
      loading: false,
      error: null,
      fetchMerchantData: mockFetchMerchantData,
    });
  });

  it('renders loading state correctly', () => {
    mockUseMerchantData.mockReturnValue({
      balance: null,
      recentActivity: [],
      loading: true,
      error: null,
      fetchMerchantData: mockFetchMerchantData,
    });

    render(<HomeScreen />);
  });

  it('renders balance and recent activity when data is loaded', () => {
    const mockBalance = {
      available_balance: 100000,
      pending_balance: 50000,
      currency: 'GBP',
    };
    const mockActivity = [
      { id: '1', description: 'Test 1', amount: 1000, currency: 'GBP', date: new Date().toISOString() },
    ];

    mockUseMerchantData.mockReturnValue({
      balance: mockBalance,
      recentActivity: mockActivity,
      loading: false,
      error: null,
      fetchMerchantData: mockFetchMerchantData,
    });

    const { getByText } = render(<HomeScreen />);

    expect(getByText(i18n.t('home.available'))).toBeTruthy();
    expect(getByText('Test 1')).toBeTruthy();
  });

  it('renders error state correctly', () => {
    const errorMessage = 'Network Error';
    mockUseMerchantData.mockReturnValue({
      balance: null,
      recentActivity: [],
      loading: false,
      error: errorMessage,
      fetchMerchantData: mockFetchMerchantData,
    });

    const { getByText } = render(<HomeScreen />);

    expect(getByText(errorMessage)).toBeTruthy();
    expect(getByText(i18n.t('home.retry'))).toBeTruthy();
    
    fireEvent.press(getByText(i18n.t('home.retry')));
    expect(mockFetchMerchantData).toHaveBeenCalled();
  });

  it('navigates to modal when "Show more" is pressed', () => {
    const mockBalance = {
      available_balance: 100000,
      pending_balance: 50000,
      currency: 'GBP',
    };
    mockUseMerchantData.mockReturnValue({
      balance: mockBalance,
      recentActivity: [],
      loading: false,
      error: null,
      fetchMerchantData: mockFetchMerchantData,
    });

    const { getByText } = render(<HomeScreen />);
    
    fireEvent.press(getByText(i18n.t('home.showMore')));
    expect(mockRouter.push).toHaveBeenCalledWith('/modal');
  });
});
