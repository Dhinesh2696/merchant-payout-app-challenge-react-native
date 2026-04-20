import { combineReducers } from 'redux';
import merchantReducer from './merchantReducer';
import appReducer from "./appReducer";
import payoutReducer from "./payoutReducer";

const rootReducer = combineReducers({
  merchant: merchantReducer,
  app: appReducer,
  payout: payoutReducer,
});

export type RootState = ReturnType<typeof rootReducer>;

export default rootReducer;
