import { call, put } from 'redux-saga/effects';
import { 
  createPayoutSaga 
} from '../payoutSaga';
import * as merchantActions from '../../actions/merchantActions';
import * as payoutActions from '../../actions/payoutActions';
import { api } from '../../../utils/api';
import { getDeviceId } from '../../../modules/screen-security';

describe('payoutSagas', () => {
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
      expect(generator.next().value).toEqual(put(merchantActions.fetchMerchantDataRequest()));
      
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
