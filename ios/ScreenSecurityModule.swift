import Foundation
import UIKit
import LocalAuthentication

@objc(ScreenSecurity)
class ScreenSecurity: NSObject, RCTBridgeModule {
  
  static func moduleName() -> String! {
    return "ScreenSecurity"
  }
  
  static func requiresMainQueueSetup() -> Bool {
    return true
  }
  
  // Step 4: Device Identity
  @objc(getDeviceId:rejecter:)
  func getDeviceId(_ resolve: @escaping RCTPromiseResolveBlock, rejecter reject: @escaping RCTPromiseRejectBlock) {
    DispatchQueue.main.async {
      if let deviceId = UIDevice.current.identifierForVendor?.uuidString {
        resolve(deviceId)
      } else {
        reject("device_id_error", "Could not capture device identity", nil)
      }
    }
  }

  // Step 5: Biometric Authentication
  @objc(isBiometricAuthenticated:rejecter:)
  func isBiometricAuthenticated(_ resolve: @escaping RCTPromiseResolveBlock, rejecter reject: @escaping RCTPromiseRejectBlock) {
    let context = LAContext()
    var error: NSError?

    // Check if biometric authentication or passcode is available
    if context.canEvaluatePolicy(.deviceOwnerAuthentication, error: &error) {
      let reason = "Authorize your payout request"
      
      context.evaluatePolicy(.deviceOwnerAuthentication, localizedReason: reason) { (success, evaluateError) in
        DispatchQueue.main.async {
          if success {
            resolve(true)
          } else {
            // Authentication failed or was canceled
            if let error = evaluateError as NSError? {
              if error.code == LAError.userCancel.rawValue {
                resolve(false) // User canceled
              } else {
                reject("biometric_error", error.localizedDescription, error)
              }
            } else {
              resolve(false)
            }
          }
        }
      }
    } else {
      // Security not available or not enrolled
      DispatchQueue.main.async {
        if let error = error {
          if error.code == LAError.biometryNotEnrolled.rawValue {
            reject("biometric_not_enrolled", "Please setup security settings (Passcode/Biometrics) in your phone settings to authorize large payouts.", nil)
          } else {
            reject("biometric_not_available", error.localizedDescription, nil)
          }
        } else {
          reject("biometric_not_available", "Security authentication is not available on this device", nil)
        }
      }
    }

  }
}

