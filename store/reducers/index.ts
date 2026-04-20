import { combineReducers } from 'redux';
import merchantReducer from './merchantReducer';
import appReducer from "./appReducer";

const rootReducer = combineReducers({
  merchant: merchantReducer,
  app: appReducer,
});

export type RootState = ReturnType<typeof rootReducer>;

export default rootReducer;
