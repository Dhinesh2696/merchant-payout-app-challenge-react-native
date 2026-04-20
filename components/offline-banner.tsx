import React from 'react';
import { StyleSheet, View } from 'react-native';
import { useSelector } from 'react-redux';
import { selectIsOffline } from '../store/reducers/appReducer';
import { ThemedText } from './themed-text';
import { useThemeColor } from '@/hooks/use-theme-color';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import i18n from '../constants/i18n';

export function OfflineBanner() {
  const isOffline = useSelector(selectIsOffline);
  const insets = useSafeAreaInsets();
  const backgroundColor = useThemeColor({}, 'negative');
  const textColor = '#FFFFFF';

  if (!isOffline) return null;

return (
    <View style={[
      styles.banner, 
      { 
        backgroundColor,
        paddingBottom: Math.max(insets.bottom, 10),
      }
    ]}>
      <ThemedText style={[styles.text, { color: textColor }]}>
        {i18n.t('common.noInternet')}
      </ThemedText>
    </View>
  );
}

const styles = StyleSheet.create({
  banner: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingTop: 10,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 9999,
  },
  text: {
    fontSize: 14,
    fontWeight: '700',
  },
});
