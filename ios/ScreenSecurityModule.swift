import Foundation
import UIKit

@objc(ScreenSecurity)
class ScreenSecurity: NSObject, RCTBridgeModule {
  
  static func moduleName() -> String! {
    return "ScreenSecurity"
  }
  
  static func requiresMainQueueSetup() -> Bool {
    return true
  }
  
  // Step 4: Device Identity
  @objc
  func getDeviceId(_ resolve: @escaping RCTPromiseResolveBlock, rejecter reject: @escaping RCTPromiseRejectBlock) {
    DispatchQueue.main.async {
      if let deviceId = UIDevice.current.identifierForVendor?.uuidString {
        resolve(deviceId)
      } else {
        reject("device_id_error", "Could not capture device identity", nil)
      }
    }
  }
}
