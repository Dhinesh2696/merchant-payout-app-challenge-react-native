import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { 
  CreatePayoutRequest, 
  PayoutResponse 
} from '../../types/api';
import { RootState } from './index';

interface PayoutState {
  loading: boolean;
  error: string | null;
  success: boolean;
  result: PayoutResponse | null;
}

const initialState: PayoutState = {
  loading: false,
  error: null,
  success: false,
  result: null,
};

const payoutSlice = createSlice({
  name: 'payout',
  initialState,
  reducers: {
    createPayoutRequest: (state, _action: PayloadAction<CreatePayoutRequest>) => {
      state.loading = true;
      state.error = null;
      state.success = false;
      state.result = null;
    },
    createPayoutSuccess: (state, action: PayloadAction<PayoutResponse>) => {
      state.loading = false;
      state.success = true;
      state.result = action.payload;
    },
    createPayoutFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
      state.success = false;
    },
    resetPayoutStatus: (state) => {
      state.loading = false;
      state.error = null;
      state.success = false;
      state.result = null;
    },
  },
});

export const {
  createPayoutRequest,
  createPayoutSuccess,
  createPayoutFailure,
  resetPayoutStatus,
} = payoutSlice.actions;

// Selectors
export const selectPayoutState = (state: RootState) => state.payout;

export default payoutSlice.reducer;
