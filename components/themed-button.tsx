import { TouchableOpacity, type TouchableOpacityProps, StyleSheet } from 'react-native';
import { useThemeColor } from '@/hooks/use-theme-color';

export type ThemedButtonProps = TouchableOpacityProps & {
  lightColor?: string;
  darkColor?: string;
  variant?: 'primary' | 'secondary' | 'outline';
};

export function ThemedButton({
  style,
  lightColor,
  darkColor,
  variant = 'primary',
  ...rest
}: ThemedButtonProps) {
  const primaryColor = useThemeColor({ light: lightColor, dark: darkColor }, 'buttonPrimary');
  const backgroundColor = variant === 'primary' ? primaryColor : 'transparent';
  const borderColor = variant === 'outline' ? primaryColor : 'transparent';
  const borderWidth = variant === 'outline' ? 1 : 0;

  return (
    <TouchableOpacity
      style={[
        styles.base,
        { backgroundColor, borderColor, borderWidth },
        style,
      ]}
      {...rest}
    />
  );
}

const styles = StyleSheet.create({
  base: {
    borderRadius: 0,
    height: 56,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

