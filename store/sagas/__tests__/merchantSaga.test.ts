import { call, put } from 'redux-saga/effects';
import { 
  fetchMerchantDataSaga, 
  createPayoutSaga 
} from '../merchantSaga';
import * as actions from '../../actions/merchantActions';
import * as payoutActions from '../../actions/payoutActions';
import { api } from '../../../utils/api';
import { getDeviceId } from '../../../modules/screen-security';

describe('merchantSagas', () => {
  describe('fetchMerchantDataSaga', () => {
    it('should handle successful fetch', () => {
      const generator = fetchMerchantDataSaga();
      const mockData = { available_balance: 100 } as any;

      expect(generator.next().value).toEqual(call(api.getMerchantData));
      expect(generator.next(mockData).value).toEqual(put(actions.fetchMerchantDataSuccess(mockData)));
      expect(generator.next().done).toBe(true);
    });

    it('should handle failure', () => {
      const generator = fetchMerchantDataSaga();
      const error = new Error('API Error');

      expect(generator.next().value).toEqual(call(api.getMerchantData));
      expect(generator.throw!(error).value).toEqual(put(actions.fetchMerchantDataFailure('API Error')));
      expect(generator.next().done).toBe(true);
    });
  });

  describe('createPayoutSaga', () => {
    const action = {
      type: payoutActions.createPayoutRequest.type,
      payload: { amount: 1000, currency: 'GBP', iban: 'GB123' } as any
    };

    it('should handle successful payout including device_id capture', () => {
      const generator = createPayoutSaga(action);
      const mockDeviceId = 'mock-id';
      const mockPayoutResponse = { id: 'payout_1' } as any;

      // 1. Call getDeviceId
      expect(generator.next().value).toEqual(call(getDeviceId));
      
      // 2. Call api.createPayout with device_id
      expect(generator.next(mockDeviceId).value).toEqual(call(api.createPayout, {
        ...action.payload,
        device_id: mockDeviceId
      }));

      // 3. Dispatch success
      expect(generator.next(mockPayoutResponse).value).toEqual(put(payoutActions.createPayoutSuccess(mockPayoutResponse)));

      // 4. Refresh merchant data
      expect(generator.next().value).toEqual(put(actions.fetchMerchantDataRequest()));
      
      expect(generator.next().done).toBe(true);
    });

    it('should continue with "unknown" if getDeviceId fails', () => {
      const generator = createPayoutSaga(action);
      const error = new Error('Native Error');
      const mockPayoutResponse = { id: 'payout_1' } as any;

      expect(generator.next().value).toEqual(call(getDeviceId));
      
      // Throw in the try-catch block
      expect(generator.throw!(error).value).toEqual(call(api.createPayout, {
        ...action.payload,
        device_id: 'unknown'
      }));

      expect(generator.next(mockPayoutResponse).value).toEqual(put(payoutActions.createPayoutSuccess(mockPayoutResponse)));
    });
  });
});
