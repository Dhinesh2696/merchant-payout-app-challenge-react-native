import { call, put, takeLatest } from 'redux-saga/effects';
import * as actions from '../actions/merchantActions';
import * as payoutActions from "../actions/payoutActions";
import { api } from '../../utils/api';
import i18n from '../../constants/i18n';
import { getDeviceId } from "../../modules/screen-security";
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

function* createPayoutSaga(action: {
  type: string;
  payload: CreatePayoutRequest;
}) {
  try {
    let deviceId = "unknown";
    try {
      deviceId = yield call(getDeviceId);
    } catch (e) {
      console.warn("Native ScreenSecurity module not available:", e);
    }

    const payloadWithId: CreatePayoutRequest = {
      ...action.payload,
      device_id: deviceId,
    };

    const data: PayoutResponse = yield call(api.createPayout, payloadWithId);
    yield put(payoutActions.createPayoutSuccess(data));
    // Refresh merchant data (balance) after successful payout
    yield put(actions.fetchMerchantDataRequest());
  } catch (error: any) {
    yield put(
      payoutActions.createPayoutFailure(
        error.message || i18n.t("errors.payoutFailed"),
      ),
    );
  }
}

// Watchers
export function* watchMerchantSaga() {
  yield takeLatest(actions.fetchMerchantDataRequest.type, fetchMerchantDataSaga);
  yield takeLatest(actions.fetchActivityRequest.type, fetchActivitySaga);
  yield takeLatest(payoutActions.createPayoutRequest.type, createPayoutSaga);
}
