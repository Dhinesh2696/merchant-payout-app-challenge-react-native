import { call, put } from 'redux-saga/effects';
import { 
  fetchMerchantDataSaga 
} from '../merchantSaga';
import * as actions from '../../actions/merchantActions';
import { api } from '../../../utils/api';

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
});
