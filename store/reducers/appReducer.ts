import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from './index';

interface AppState {
  isOffline: boolean;
}

const initialState: AppState = {
  isOffline: false,
};

const appSlice = createSlice({
  name: 'app',
  initialState,
  reducers: {
    setOfflineStatus: (state, action: PayloadAction<boolean>) => {
      state.isOffline = action.payload;
    },
  },
});

export const { setOfflineStatus } = appSlice.actions;

// Selectors
export const selectIsOffline = (state: RootState) => state.app.isOffline;

export default appSlice.reducer;
