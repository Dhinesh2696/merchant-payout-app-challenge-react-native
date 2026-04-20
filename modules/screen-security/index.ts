import { requireNativeModule } from 'expo-modules-core';

// It loads the native module object from the JSI or falls back to the bridge on older versions of the SDK.
const ScreenSecurityModule = requireNativeModule('ScreenSecurity');

export function getDeviceId(): string {
  return ScreenSecurityModule.getDeviceId();
}

export default ScreenSecurityModule;
