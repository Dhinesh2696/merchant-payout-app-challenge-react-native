import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { 
  createPayoutRequest, 
  resetPayoutStatus, 
  selectPayoutState 
} from '../store/actions/payoutActions';
import { CreatePayoutRequest } from '../types/api';

export function usePayoutData() {
  const dispatch = useDispatch();
  const { loading, error, success, result } = useSelector(selectPayoutState);

  const initiatePayout = useCallback((payload: CreatePayoutRequest) => {
    dispatch(createPayoutRequest(payload));
  }, [dispatch]);

  const resetPayout = useCallback(() => {
    dispatch(resetPayoutStatus());
  }, [dispatch]);

  return {
    loading,
    error,
    success,
    result,
    initiatePayout,
    resetPayout,
  };
}
