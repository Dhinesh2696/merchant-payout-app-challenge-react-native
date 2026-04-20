import { API_BASE_URL } from '../constants';
import { 
  BalanceResponse, 
  MerchantDataResponse, 
  PaginatedActivityResponse, 
  CreatePayoutRequest, 
  PayoutResponse 
} from '../types/api';

const handleResponse = async (response: Response) => {
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || `API Error: ${response.status}`);
  }
  return response.json();
};

export const api = {
  getMerchantData: (): Promise<MerchantDataResponse> => 
    fetch(`${API_BASE_URL}/api/merchant`).then(handleResponse),

  getActivity: (cursor?: string, limit: number = 15): Promise<PaginatedActivityResponse> => {
    let url = `${API_BASE_URL}/api/merchant/activity?limit=${limit}`;
    if (cursor) {
      url += `&cursor=${cursor}`;
    }
    return fetch(url).then(handleResponse);
  },

  createPayout: (payoutData: CreatePayoutRequest): Promise<PayoutResponse> => 
    fetch(`${API_BASE_URL}/api/payouts`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payoutData),
    }).then(handleResponse),
};
