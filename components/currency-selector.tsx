import React, { useState } from 'react';
import { StyleSheet, TouchableOpacity, View, Modal, FlatList, Pressable } from 'react-native';
import { ThemedText } from './themed-text';
import { ThemedView } from './themed-view';
import { Ionicons } from '@expo/vector-icons';
import { Currency } from '../types/api';
import { useThemeColor } from '@/hooks/use-theme-color';

import i18n from '../constants/i18n';

interface CurrencySelectorProps {
  value: Currency;
  onSelect: (currency: Currency) => void;
  style?: any;
}

const getSupportedCurrencies = (): { label: string; value: Currency }[] => [
  { label: i18n.t('payout.currencies.GBP'), value: 'GBP' },
  { label: i18n.t('payout.currencies.EUR'), value: 'EUR' },
];

export function CurrencySelector({ value, onSelect, style }: CurrencySelectorProps) {
  const [modalVisible, setModalVisible] = useState(false);
  const tintColor = useThemeColor({}, 'tint');
  const textColor = useThemeColor({}, 'text');
  const cardBackgroundColor = useThemeColor({}, 'cardBackground');
  const borderColor = useThemeColor({}, 'border');
  
  const SUPPORTED_CURRENCIES = getSupportedCurrencies();

  const handleSelect = (currency: Currency) => {
    onSelect(currency);
    setModalVisible(false);
  };

  return (
    <>
      <TouchableOpacity
        style={[styles.container, { backgroundColor: cardBackgroundColor, borderColor }, style]}
        onPress={() => setModalVisible(true)}
      >
        <ThemedText type="defaultSemiBold" style={styles.valueText}>{value}</ThemedText>
        <Ionicons name="caret-down" size={14} color={textColor} opacity={0.5} />
      </TouchableOpacity>

      <Modal
        visible={modalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setModalVisible(false)}
      >
        <Pressable 
          style={styles.overlay} 
          onPress={() => setModalVisible(false)}
        >
          <ThemedView style={styles.modalContent}>
            <View style={styles.header}>
              <View style={[styles.handle, { backgroundColor: borderColor }]} />
            </View>
            
            <FlatList
              data={SUPPORTED_CURRENCIES}
              keyExtractor={(item) => item.value}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.option}
                  onPress={() => handleSelect(item.value)}
                >
                  <ThemedText style={[
                    styles.optionLabel,
                    item.value === value && { color: tintColor, fontWeight: '700' }
                  ]}>
                    {item.label}
                  </ThemedText>
                  {item.value === value && (
                    <Ionicons name="checkmark" size={20} color={tintColor} />
                  )}
                </TouchableOpacity>
              )}
              ItemSeparatorComponent={() => <View style={[styles.separator, { backgroundColor: borderColor }]} />}
            />
          </ThemedView>
        </Pressable>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 8,
    borderWidth: 1,
    height: 60,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  valueText: {
    fontSize: 16,
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingBottom: 40,
    maxHeight: '40%',
  },
  header: {
    alignItems: 'center',
    paddingVertical: 12,
  },
  handle: {
    width: 40,
    height: 4,
    borderRadius: 2,
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingVertical: 20,
  },
  optionLabel: {
    fontSize: 16,
  },
  separator: {
    height: 1,
    marginHorizontal: 24,
  },
});
