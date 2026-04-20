import { all, fork } from 'redux-saga/effects';
import { watchMerchantSaga } from './merchantSaga';

export default function* rootSaga() {
  yield all([
    fork(watchMerchantSaga),
  ]);
}
