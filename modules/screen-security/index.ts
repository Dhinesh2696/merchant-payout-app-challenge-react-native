import { NativeModules } from "react-native";

const { ScreenSecurity } = NativeModules;

export async function getDeviceId(): Promise<string> {
  if (!ScreenSecurity) {
    console.warn("Native ScreenSecurity module is not available");
    return "unknown";
  }
  return ScreenSecurity.getDeviceId();
}

export default ScreenSecurity;
