#import <React/RCTBridgeModule.h>

@interface RCT_EXTERN_MODULE(ScreenSecurity, NSObject)

RCT_EXTERN_METHOD(getDeviceId:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject)

RCT_EXTERN_METHOD(isBiometricAuthenticated:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject)


@end
