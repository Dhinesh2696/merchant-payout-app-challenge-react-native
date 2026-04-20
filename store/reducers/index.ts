import { combineReducers } from 'redux';
import merchantReducer from './merchantReducer';

const rootReducer = combineReducers({
  merchant: merchantReducer,
});

export type RootState = ReturnType<typeof rootReducer>;

export default rootReducer;
