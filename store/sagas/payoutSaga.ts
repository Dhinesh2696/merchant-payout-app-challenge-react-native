import { call, put, takeLatest } from 'redux-saga/effects';
import * as payoutActions from "../actions/payoutActions";
import * as merchantActions from "../actions/merchantActions";
import { api } from '../../utils/api';
import i18n from '../../constants/i18n';
import { getDeviceId } from "../../modules/screen-security";
import { 
  PayoutResponse, 
  CreatePayoutRequest 
} from '../../types/api';

// Workers
export function* createPayoutSaga(action: {
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
    yield put(merchantActions.fetchMerchantDataRequest());
  } catch (error: any) {
    yield put(
      payoutActions.createPayoutFailure(
        error.message || i18n.t("errors.payoutFailed"),
      ),
    );
  }
}

// Watchers
export function* watchPayoutSaga() {
  yield takeLatest(payoutActions.createPayoutRequest.type, createPayoutSaga);
}
