/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

import { Platform } from 'react-native';

const tintColorLight = '#0a7ea4';
const tintColorDark = '#fff';

export const Colors = {
  light: {
    text: "#171717",
    background: "#FFFFFF",
    tint: tintColorLight,
    icon: "#737373",
    tabIconDefault: "#A3A3A3",
    tabIconSelected: tintColorLight,
    border: "#E5E5E5",
    cardBackground: "#FFFFFF",
    inputBackground: "#F9F9F9",
    positive: "#10B981",
    negative: "#EF4444",
    secondaryText: "#737373",
    buttonPrimary: "#0a7ea4",
    buttonDisabled: "#F5F5F5",
    buttonDisabledText: "#D4D4D4",
    buttonPrimaryText: "#FFFFFF",
    overlay: "rgba(0,0,0,0.4)",
  },
  dark: {
    text: "#FAFAFA",
    background: "#0A0A0A",
    tint: tintColorDark,
    icon: "#A3A3A3",
    tabIconDefault: "#525252",
    tabIconSelected: tintColorDark,
    border: "#262626",
    cardBackground: "#171717",
    inputBackground: "#171717",
    positive: "#34D399",
    negative: "#F87171",
    secondaryText: "#A3A3A3",
    buttonPrimary: "#0a7ea4",
    buttonDisabled: "#262626",
    buttonDisabledText: "#525252",
    buttonPrimaryText: "#FFFFFF",
    overlay: "rgba(0,0,0,0.6)",
  },


};



export const Fonts = Platform.select({
  ios: {
    /** iOS `UIFontDescriptorSystemDesignDefault` */
    sans: 'system-ui',
    /** iOS `UIFontDescriptorSystemDesignSerif` */
    serif: 'ui-serif',
    /** iOS `UIFontDescriptorSystemDesignRounded` */
    rounded: 'ui-rounded',
    /** iOS `UIFontDescriptorSystemDesignMonospaced` */
    mono: 'ui-monospace',
  },
  default: {
    sans: 'normal',
    serif: 'serif',
    rounded: 'normal',
    mono: 'monospace',
  },
  web: {
    sans: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    serif: "Georgia, 'Times New Roman', serif",
    rounded: "'SF Pro Rounded', 'Hiragino Maru Gothic ProN', Meiryo, 'MS PGothic', sans-serif",
    mono: "SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
  },
});
