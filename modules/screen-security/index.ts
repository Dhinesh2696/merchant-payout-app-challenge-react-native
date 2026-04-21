import { NativeModules } from "react-native";

const { ScreenSecurity } = NativeModules;

export async function getDeviceId(): Promise<string> {
  if (!ScreenSecurity) {
    console.warn("Native ScreenSecurity module is not available");
    return "unknown";
  }
  return ScreenSecurity.getDeviceId();
}

export async function isBiometricAuthenticated(): Promise<boolean> {
  if (!ScreenSecurity) {
    console.warn("Native ScreenSecurity module is not available");
    return false;
  }
  return ScreenSecurity.isBiometricAuthenticated();
}

export default ScreenSecurity;

