import { useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { 
  fetchMerchantDataRequest, 
  fetchActivityRequest 
} from '../store/actions/merchantActions';
import { 
  selectBalance, 
  selectActivity, 
  selectRecentActivity, 
  selectIsMerchantLoading, 
  selectMerchantError 
} from '../store/reducers/merchantReducer';

export function useMerchantData() {
  const dispatch = useDispatch();
  
  const balance = useSelector(selectBalance);
  const activity = useSelector(selectActivity);
  const recentActivity = useSelector(selectRecentActivity);
  const loading = useSelector(selectIsMerchantLoading);
  const error = useSelector(selectMerchantError);

  const fetchMerchantData = useCallback(() => {
    dispatch(fetchMerchantDataRequest());
  }, [dispatch]);

  const fetchMoreActivity = useCallback(() => {
    if (activity.hasMore && !activity.loading) {
      dispatch(fetchActivityRequest(activity.nextCursor || undefined));
    }
  }, [dispatch, activity]);

  return {
    balance,
    activity,
    recentActivity,
    loading,
    error,
    fetchMerchantData,
    fetchMoreActivity,
  };
}
