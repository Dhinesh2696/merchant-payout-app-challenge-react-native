import { NativeModules, NativeEventEmitter } from "react-native";

const { ScreenSecurity } = NativeModules;

const eventEmitter = ScreenSecurity
  ? new NativeEventEmitter(ScreenSecurity)
  : null;

export async function getDeviceId(): Promise<string> {
  if (!ScreenSecurity) {
    console.warn("Native ScreenSecurity module is not available");
    return "unknown";
  }
  return ScreenSecurity.getDeviceId();
}

export async function isBiometricAuthenticated(
  title: string,
  subtitle: string,
): Promise<boolean> {
  if (!ScreenSecurity) {
    console.warn("Native ScreenSecurity module is not available");
    return false;
  }
  return ScreenSecurity.isBiometricAuthenticated(title, subtitle);
}


export function addScreenshotListener(callback: (event: any) => void) {
  if (!eventEmitter) {
    console.warn("Native ScreenSecurity event emitter is not available");
    return { remove: () => {} };
  }
  return eventEmitter.addListener("onScreenshotTaken", callback);
}

export default ScreenSecurity;


