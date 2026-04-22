import React from 'react';
import { StyleSheet, View, Modal, TouchableOpacity } from 'react-native';
import { ThemedText } from './themed-text';
import { ThemedView } from './themed-view';
import { CurrencyText } from './currency-text';
import { Currency } from '../types/api';
import i18n from '../constants/i18n';
import { formatCurrency } from '../utils/format';
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
  const overlayColor = useThemeColor({}, 'overlay');
  const buttonPrimaryText = useThemeColor({}, 'buttonPrimaryText');

  const maskIban = (text: string) => {
    if (text.length < 8) return text;
    return `${text.slice(0, 4)}${'*'.repeat(text.length - 8)}${text.slice(-4)}`;
  };

  const getFormattedAmount = () => {
    return formatCurrency(amount, currency);
  };

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={[styles.overlay, { backgroundColor: overlayColor }]}>
        <ThemedView style={[styles.content, { backgroundColor: cardBackgroundColor, borderColor }]}>
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
              <ThemedText style={[styles.confirmText, { color: loading ? buttonDisabledText : buttonPrimaryText }]}>
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
    justifyContent: 'center',
    padding: 24,
  },
  content: {
    borderRadius: 0,
    padding: 32,
    borderWidth: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: '800',
    marginBottom: 32,
    textAlign: 'left',
    letterSpacing: -0.5,
  },
  details: {
    marginBottom: 40,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
  },
  value: {
    fontSize: 15,
    fontWeight: '700',
  },
  divider: {
    height: 1,
  },
  buttonContainer: {
    flexDirection: 'column',
    gap: 12,
  },
  confirmButton: {
    height: 56,
    borderRadius: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cancelButton: {
    height: 56,
    borderRadius: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
    borderWidth: 1.5,
  },
  confirmText: {
    fontSize: 16,
    fontWeight: '700',
  },
  cancelText: {
    fontSize: 16,
    fontWeight: '700',
  },
});

