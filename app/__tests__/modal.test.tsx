import React from 'react';
import { render } from '@testing-library/react-native';
import ModalScreen from '../modal';
import { useSelector } from 'react-redux';
import { useMerchantData } from '../../hooks/use-merchant-data';

// Mock Redux
jest.mock('react-redux', () => ({
  useSelector: jest.fn(),
}));

jest.mock('../../hooks/use-merchant-data');

jest.mock('expo-router', () => ({
  router: { push: jest.fn() },
  useRouter: () => ({ push: jest.fn(), back: jest.fn() }),
}));

jest.mock('@/constants/i18n', () => ({
  t: jest.fn((key) => key),
}));

jest.mock('react-native-safe-area-context', () => ({
  useSafeAreaInsets: () => ({ top: 0, bottom: 0, left: 0, right: 0 }),
}));

const mockUseSelector = useSelector as jest.Mock;
const mockUseMerchantData = useMerchantData as jest.Mock;

describe('ModalScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders loading state', () => {
    mockUseSelector.mockReturnValue('GBP');
    mockUseMerchantData.mockReturnValue({ activity: { items: [], loading: true }, fetchMoreActivity: jest.fn() });
    render(<ModalScreen />);
  });

  it('renders correctly with data', () => {
    mockUseSelector.mockReturnValue('GBP');
    mockUseMerchantData.mockReturnValue({
      activity: {
        loading: false,
        items: [
          { id: '1', description: 'Test', amount: 10, currency: 'GBP', date: new Date().toISOString(), status: 'completed' }
        ]
      },
      fetchMoreActivity: jest.fn()
    });
    
    const { getByText } = render(<ModalScreen />);
    expect(getByText('Test')).toBeTruthy();
  });
});
