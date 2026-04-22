import { all, fork } from 'redux-saga/effects';
import { watchMerchantSaga } from './merchantSaga';
import { watchPayoutSaga } from './payoutSaga';

export default function* rootSaga() {
  yield all([
    fork(watchMerchantSaga),
    fork(watchPayoutSaga),
  ]);
}
