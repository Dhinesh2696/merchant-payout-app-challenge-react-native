import { call, put, takeLatest } from 'redux-saga/effects';
import * as actions from '../actions/merchantActions';
import { api } from '../../utils/api';
import i18n from '../../constants/i18n';
import { 
  MerchantDataResponse, 
  PaginatedActivityResponse, 
  PayoutResponse, 
  CreatePayoutRequest 
} from '../../types/api';

// Workers
function* fetchMerchantDataSaga() {
  try {
    const data: MerchantDataResponse = yield call(api.getMerchantData);
    yield put(actions.fetchMerchantDataSuccess(data));
  } catch (error: any) {
    yield put(actions.fetchMerchantDataFailure(error.message || i18n.t('errors.fetchMerchant')));
  }
}

function* fetchActivitySaga(action: { type: string, payload?: string }) {
  try {
    const data: PaginatedActivityResponse = yield call(api.getActivity, action.payload);
    yield put(actions.fetchActivitySuccess(data));
  } catch (error: any) {
    yield put(actions.fetchActivityFailure(error.message || i18n.t('errors.fetchActivity')));
  }
}

// Watchers
export function* watchMerchantSaga() {
  yield takeLatest(actions.fetchMerchantDataRequest.type, fetchMerchantDataSaga);
  yield takeLatest(actions.fetchActivityRequest.type, fetchActivitySaga);
}
