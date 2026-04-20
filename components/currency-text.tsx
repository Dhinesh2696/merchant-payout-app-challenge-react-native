import React from 'react';
import { StyleProp, TextStyle } from 'react-native';
import { ThemedText } from './themed-text';
import { formatCurrency } from '../utils/format';
import { Currency } from '../types/api';

interface CurrencyTextProps {
  amount: number;
  currency: Currency;
  style?: StyleProp<TextStyle>;
  type?: 'default' | 'title' | 'defaultSemiBold' | 'subtitle' | 'link';
}

export function CurrencyText({ amount, currency, style, type = 'defaultSemiBold' }: CurrencyTextProps) {
  return (
    <ThemedText style={style} type={type}>
      {formatCurrency(amount, currency)}
    </ThemedText>
  );
}
