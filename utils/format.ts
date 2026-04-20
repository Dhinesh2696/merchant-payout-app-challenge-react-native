import { Currency } from '../types/api';

/**
 * Formats a given amount in the lowest denomination (e.g. pence) 
 * into a human-readable currency string.
 */
export const formatCurrency = (amount: number, currency: Currency): string => {
  const value = amount / 100;
  return new Intl.NumberFormat('en-GB', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
};

/**
 * Capitalizes the first letter of a string.
 */
export const capitalize = (str: string): string => {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1);
};
