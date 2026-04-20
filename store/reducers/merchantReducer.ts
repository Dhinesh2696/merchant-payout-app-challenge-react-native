import { createSlice, PayloadAction, createSelector } from '@reduxjs/toolkit';
import { 
  Currency, 
  ActivityItem, 
  PayoutResponse,
  MerchantDataResponse,
  PaginatedActivityResponse
} from '../../types/api';
import { RootState } from './index';

interface MerchantState {
  balance: {
    available_balance: number;
    pending_balance: number;
    currency: Currency;
  } | null;
  activity: {
    items: ActivityItem[];
    nextCursor: string | null;
    hasMore: boolean;
    loading: boolean;
    error: string | null;
  };
  loading: boolean;
  error: string | null;
}

const initialState: MerchantState = {
  balance: null,
  activity: {
    items: [],
    nextCursor: null,
    hasMore: true,
    loading: false,
    error: null,
  },
  loading: false,
  error: null,
};

const merchantSlice = createSlice({
  name: 'merchant',
  initialState,
  reducers: {
    fetchMerchantDataRequest: (state) => {
      state.loading = true;
      state.error = null;
    },
    fetchMerchantDataSuccess: (state, action: PayloadAction<MerchantDataResponse>) => {
      state.loading = false;
      state.balance = {
        available_balance: action.payload.available_balance,
        pending_balance: action.payload.pending_balance,
        currency: action.payload.currency,
      };
      state.activity.items = action.payload.activity;
      // Seed pagination state from the initial activity list
      if (action.payload.activity.length > 0) {
        state.activity.nextCursor = action.payload.activity[action.payload.activity.length - 1].id;
        state.activity.hasMore = true; // Safe to assume more exist for first load
      } else {
        state.activity.nextCursor = null;
        state.activity.hasMore = false;
      }
    },
    fetchMerchantDataFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
    },
    fetchActivityRequest: (state, _action: PayloadAction<string | undefined>) => {
      state.activity.loading = true;
      state.activity.error = null;
    },
    fetchActivitySuccess: (state, action: PayloadAction<PaginatedActivityResponse>) => {
      state.activity.loading = false;
      state.activity.items = state.activity.nextCursor 
        ? [...state.activity.items, ...action.payload.items]
        : action.payload.items;
      state.activity.nextCursor = action.payload.next_cursor;
      state.activity.hasMore = action.payload.has_more;
    },
    fetchActivityFailure: (state, action: PayloadAction<string>) => {
      state.activity.loading = false;
      state.activity.error = action.payload;
    },
  },
});

export const {
  fetchMerchantDataRequest,
  fetchMerchantDataSuccess,
  fetchMerchantDataFailure,
  fetchActivityRequest,
  fetchActivitySuccess,
  fetchActivityFailure,
} = merchantSlice.actions;

// Selectors
export const selectMerchantState = (state: RootState) => state.merchant;
export const selectBalance = (state: RootState) => state.merchant.balance;
export const selectActivity = (state: RootState) => state.merchant.activity;
export const selectActivityItems = (state: RootState) => state.merchant.activity.items;

export const selectRecentActivity = createSelector(
  [selectActivityItems],
  (items) => items.slice(0, 3)
);
export const selectIsMerchantLoading = (state: RootState) => state.merchant.loading;
export const selectMerchantError = (state: RootState) => state.merchant.error;

export default merchantSlice.reducer;
