import React from 'react';
import { StyleSheet, View, Modal, TouchableOpacity } from 'react-native';
import { ThemedText } from './themed-text';
import { ThemedView } from './themed-view';
import { CurrencyText } from './currency-text';
import { Currency } from '../types/api';
import i18n from '../constants/i18n';
import { useThemeColor } from '@/hooks/use-theme-color';

interface PayoutConfirmationProps {
  visible: boolean;
  amount: number; // in cents
  currency: Currency;
  iban: string;
  onConfirm: () => void;
  onCancel: () => void;
  loading: boolean;
}

export function PayoutConfirmation({
  visible,
  amount,
  currency,
  iban,
  onConfirm,
  onCancel,
  loading
}: PayoutConfirmationProps) {
  const buttonPrimary = useThemeColor({}, 'buttonPrimary');
  const buttonDisabled = useThemeColor({}, 'buttonDisabled');
  const buttonDisabledText = useThemeColor({}, 'buttonDisabledText');
  const textColor = useThemeColor({}, 'text');
  const secondaryTextColor = useThemeColor({}, 'secondaryText');
  const cardBackgroundColor = useThemeColor({}, 'cardBackground');
  const borderColor = useThemeColor({}, 'border');

  const maskIban = (text: string) => {
    if (text.length < 8) return text;
    return `${text.slice(0, 4)}${'*'.repeat(text.length - 8)}${text.slice(-4)}`;
  };

  const getFormattedAmount = () => {
    const symbol = currency === 'GBP' ? '£' : '€';
    return `${symbol}${(amount / 100).toFixed(2)}`;
  };

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.overlay}>
        <ThemedView style={[styles.content, { backgroundColor: cardBackgroundColor }]}>
          <ThemedText style={styles.title}>{i18n.t('payout.confirm.title')}</ThemedText>
          
          <View style={styles.details}>
            <View style={styles.detailRow}>
              <ThemedText style={[styles.label, { color: secondaryTextColor }]}>{i18n.t('payout.confirm.amount')}</ThemedText>
              <ThemedText style={[styles.value, { color: textColor }]}>{getFormattedAmount()}</ThemedText>
            </View>
            <View style={[styles.divider, { backgroundColor: borderColor }]} />

            <View style={styles.detailRow}>
              <ThemedText style={[styles.label, { color: secondaryTextColor }]}>{i18n.t('payout.confirm.currency')}</ThemedText>
              <ThemedText style={[styles.value, { color: textColor }]}>{currency}</ThemedText>
            </View>
            <View style={[styles.divider, { backgroundColor: borderColor }]} />

            <View style={styles.detailRow}>
              <ThemedText style={[styles.label, { color: secondaryTextColor }]}>{i18n.t('payout.confirm.recipient')}</ThemedText>
              <ThemedText style={[styles.value, { color: textColor }]}>{maskIban(iban)}</ThemedText>
            </View>
            <View style={[styles.divider, { backgroundColor: borderColor }]} />
          </View>

          <View style={styles.buttonContainer}>
            <TouchableOpacity 
              onPress={onCancel} 
              disabled={loading}
              style={[styles.cancelButton, { backgroundColor: borderColor }]}
            >
              <ThemedText style={[styles.cancelText, { color: textColor }]}>{i18n.t('payout.confirm.cancel')}</ThemedText>
            </TouchableOpacity>
            
            <TouchableOpacity 
              onPress={onConfirm} 
              disabled={loading}
              style={[styles.confirmButton, { backgroundColor: loading ? buttonDisabled : buttonPrimary }]}
            >
              <ThemedText style={[styles.confirmText, { color: loading ? buttonDisabledText : '#FFF' }]}>
                {loading ? i18n.t('payout.confirm.processing') : i18n.t('payout.confirm.confirm')}
              </ThemedText>
            </TouchableOpacity>
          </View>
        </ThemedView>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    padding: 24,
  },
  content: {
    borderRadius: 24,
    padding: 24,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 32,
    textAlign: 'center',
  },
  details: {
    marginBottom: 32,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
  },
  label: {
    fontSize: 15,
  },
  value: {
    fontSize: 15,
    fontWeight: '600',
  },
  divider: {
    height: 1,
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 16,
  },
  cancelButton: {
    flex: 1,
    height: 56,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  confirmButton: {
    flex: 1,
    height: 56,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cancelText: {
    fontSize: 16,
    fontWeight: '600',
  },
  confirmText: {
    fontSize: 16,
    fontWeight: '600',
  },
});
