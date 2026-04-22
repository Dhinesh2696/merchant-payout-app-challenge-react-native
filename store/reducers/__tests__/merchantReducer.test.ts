import reducer, {
  fetchMerchantDataRequest,
  fetchMerchantDataSuccess,
  fetchMerchantDataFailure,
  fetchActivityRequest,
  fetchActivitySuccess,
  fetchActivityFailure,
} from '../merchantReducer';
import { MerchantDataResponse, PaginatedActivityResponse } from '../../../types/api';

describe('merchantReducer', () => {
  const initialState = {
    balance: null,
    activity: {
      items: [],
      nextCursor: null,
      hasMore: true,
      loading: false,
      error: null,
    },
    loading: false,
    error: null,
  };

  it('should return initial state', () => {
    expect(reducer(undefined, { type: 'unknown' })).toEqual(initialState);
  });

  it('should handle fetchMerchantDataRequest', () => {
    const actual = reducer(initialState, fetchMerchantDataRequest());
    expect(actual.loading).toBe(true);
    expect(actual.error).toBeNull();
  });

  it('should handle fetchMerchantDataSuccess', () => {
    const payload: MerchantDataResponse = {
      available_balance: 50000,
      pending_balance: 10000,
      currency: 'GBP',
      activity: [
        { id: '1', type: 'payout', amount: 5000, currency: 'GBP', date: '2024-01-01', description: 'Test', status: 'completed' }
      ],
      next_cursor: '1',
      has_more: true,
    };
    const actual = reducer(initialState, fetchMerchantDataSuccess(payload));
    expect(actual.loading).toBe(false);
    expect(actual.balance).toEqual({
      available_balance: 50000,
      pending_balance: 10000,
      currency: 'GBP',
    });
    expect(actual.activity.items).toHaveLength(1);
    expect(actual.activity.nextCursor).toBe('1');
    expect(actual.activity.hasMore).toBe(true);
  });

  it('should handle fetchActivityRequest', () => {
    const actual = reducer(initialState, fetchActivityRequest('cursor'));
    expect(actual.activity.loading).toBe(true);
  });

  it('should append items on fetchActivitySuccess if nextCursor exists', () => {
    const existingState = {
      ...initialState,
      activity: {
        ...initialState.activity,
        items: [{ id: '1' } as any],
        nextCursor: '1',
      }
    };
    const payload: PaginatedActivityResponse = {
      items: [{ id: '2' } as any],
      next_cursor: '2',
      has_more: false,
    };
    const actual = reducer(existingState, fetchActivitySuccess(payload));
    expect(actual.activity.items).toHaveLength(2);
    expect(actual.activity.items[1].id).toBe('2');
    expect(actual.activity.hasMore).toBe(false);
  });
});
