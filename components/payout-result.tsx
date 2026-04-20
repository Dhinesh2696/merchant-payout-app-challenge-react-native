import React from 'react';
import { StyleSheet, View, Modal, TouchableOpacity, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ThemedText } from './themed-text';
import { ThemedView } from './themed-view';
import { PayoutResponse } from '../types/api';
import { Ionicons } from '@expo/vector-icons';
import { useThemeColor } from '@/hooks/use-theme-color';

import i18n from '../constants/i18n';

interface PayoutResultProps {
  visible: boolean;
  success: boolean;
  error: string | null;
  result: PayoutResponse | null;
  onClose: () => void;
}

export function PayoutResult({
  visible,
  success,
  error,
  result,
  onClose
}: PayoutResultProps) {
  const insets = useSafeAreaInsets();
  const buttonPrimary = useThemeColor({}, 'buttonPrimary');
  const textColor = useThemeColor({}, 'text');
  const backgroundColor = useThemeColor({}, 'background');
  const successColor = useThemeColor({}, 'positive');
  const errorColor = useThemeColor({}, 'negative');
  const secondaryTextColor = useThemeColor({}, 'secondaryText');

  const getFormattedAmount = () => {
    if (!result) return "";
    const symbol = result.currency === 'GBP' ? '£' : '€';
    return `${symbol}${(result.amount / 100).toFixed(2)}`;
  };

  const safeTopPadding = Math.max(insets.top, 50);

  return (
    <Modal visible={visible} transparent animationType="none">
      <View style={[styles.overlay, { backgroundColor }]}>
        <ThemedView style={[styles.content, { paddingTop: safeTopPadding, backgroundColor }]}>
          <TouchableOpacity 
            style={[styles.xButton, { top: safeTopPadding }]} 
            onPress={onClose}
          >
            <Ionicons name="close" size={28} color={textColor} />
          </TouchableOpacity>

          <ThemedText style={styles.headerTitle}>
            {i18n.t('payout.payout')}
          </ThemedText>

          <View style={styles.centerContent}>
            <View 
              style={[
                styles.iconCircle, 
                { backgroundColor: 'transparent' }
              ]}
            >
              <Ionicons 
                name={success ? "checkmark-circle" : "close"} 
                size={80} 
                color={success ? successColor : errorColor} 
              />
            </View>

            <ThemedText 
              style={[
                styles.statusTitle, 
                !success && { color: errorColor }
              ]}
            >
              {success ? i18n.t('payout.result.success') : i18n.t('payout.result.failed')}
            </ThemedText>

            {success && result ? (
              <ThemedText style={[styles.description, { color: secondaryTextColor }]}>
                {i18n.t('payout.result.successDesc', { amount: getFormattedAmount() })}
              </ThemedText>
            ) : (
              <ThemedText style={[styles.errorText, !success && { color: errorColor, opacity: 0.8 }]}>
                {error || i18n.t('payout.result.errorDefault')}
              </ThemedText>
            )}

            <TouchableOpacity 
              style={[styles.actionButton, { backgroundColor: buttonPrimary }]} 
              onPress={onClose}
            >
              <ThemedText style={[styles.actionButtonText, { color: '#FFF' }]}>
                {success ? i18n.t('payout.result.createAnother') : i18n.t('payout.result.tryAgain')}
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
  },
  content: {
    flex: 1,
    padding: 24,
  },
  xButton: {
    position: 'absolute',
    right: 24,
    zIndex: 10,
  },
  headerTitle: {
    fontSize: 32,
    lineHeight: 42,
    fontWeight: '800',
    marginTop: 20, 
    marginBottom: 40,
  },
  centerContent: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: 100,
  },
  iconCircle: {
    width: 80,
    height: 80,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 32,
  },
  statusTitle: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 16,
    textAlign: 'center',
  },
  description: {
    fontSize: 16,
    textAlign: 'center',
    paddingHorizontal: 40,
    lineHeight: 24,
  },
  errorText: {
    fontSize: 16,
    textAlign: 'center',
    paddingHorizontal: 40,
    lineHeight: 24,
  },
  actionButton: {
    marginTop: 48,
    paddingHorizontal: 32,
    paddingVertical: 18,
    borderRadius: 12,
    minWidth: 240,
    alignItems: 'center',
  },
  actionButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
});
