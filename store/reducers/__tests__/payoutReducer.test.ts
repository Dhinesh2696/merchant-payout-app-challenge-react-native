import reducer, {
  createPayoutRequest,
  createPayoutSuccess,
  createPayoutFailure,
  resetPayoutStatus,
} from '../payoutReducer';
import { CreatePayoutRequest, PayoutResponse } from '../../../types/api';

describe('payoutReducer', () => {
  const initialState = {
    loading: false,
    error: null,
    success: false,
    result: null,
  };

  it('should return the initial state', () => {
    expect(reducer(undefined, { type: 'unknown' })).toEqual(initialState);
  });

  it('should handle createPayoutRequest', () => {
    const payload: CreatePayoutRequest = {
      amount: 1000,
      currency: 'GBP',
      iban: 'GB123',
    };
    const actual = reducer(initialState, createPayoutRequest(payload));
    expect(actual.loading).toBe(true);
    expect(actual.error).toBeNull();
  });

  it('should handle createPayoutSuccess', () => {
    const response: PayoutResponse = {
      id: 'payout_123',
      status: 'completed',
      amount: 1000,
      currency: 'GBP',
      iban: 'GB123',
      created_at: '2024-01-01',
    };
    const state = { ...initialState, loading: true };
    const actual = reducer(state, createPayoutSuccess(response));
    expect(actual.loading).toBe(false);
    expect(actual.success).toBe(true);
    expect(actual.result).toEqual(response);
  });

  it('should handle createPayoutFailure', () => {
    const error = 'Failed to process payout';
    const state = { ...initialState, loading: true };
    const actual = reducer(state, createPayoutFailure(error));
    expect(actual.loading).toBe(false);
    expect(actual.error).toBe(error);
    expect(actual.success).toBe(false);
  });

  it('should handle resetPayoutStatus', () => {
    const state = {
      loading: false,
      error: 'some error',
      success: true,
      result: {} as any,
    };
    const actual = reducer(state, resetPayoutStatus());
    expect(actual).toEqual(initialState);
  });
});
