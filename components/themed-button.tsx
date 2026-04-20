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
  // Use provided colors or defaults based on variant
  const backgroundColor = useThemeColor(
    { 
      light: lightColor || (variant === 'secondary' ? '#E5F6FF' : undefined), 
      dark: darkColor || (variant === 'secondary' ? '#1A2B33' : undefined) 
    }, 
    'background'
  );

  return (
    <TouchableOpacity
      style={[
        styles.base,
        variant === 'secondary' && { backgroundColor },
        style,
      ]}
      {...rest}
    />
  );
}

const styles = StyleSheet.create({
  base: {
    borderRadius: 12,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
