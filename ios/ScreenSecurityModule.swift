import Foundation
import UIKit
import LocalAuthentication

@objc(ScreenSecurity)
class ScreenSecurity: RCTEventEmitter {
  
  private var hasListeners = false

  override static func moduleName() -> String! {
    return "ScreenSecurity"
  }
  
  override static func requiresMainQueueSetup() -> Bool {
    return true
  }

  override func supportedEvents() -> [String]! {
    return ["onScreenshotTaken"]
  }

  override func startObserving() {
    hasListeners = true
    NotificationCenter.default.addObserver(
      self,
      selector: #selector(handleScreenshot),
      name: UIApplication.userDidTakeScreenshotNotification,
      object: nil
    )
    NotificationCenter.default.addObserver(
      self,
      selector: #selector(handleScreenshot),
      name: UIScreen.capturedDidChangeNotification,
      object: nil
    )
  }

  override func stopObserving() {
    hasListeners = false
    NotificationCenter.default.removeObserver(self)
  }

  @objc private func handleScreenshot() {
    if hasListeners {
      sendEvent(withName: "onScreenshotTaken", body: ["type": "screenshot"])
    }
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
  @objc(isBiometricAuthenticated:subtitle:resolver:rejecter:)
  func isBiometricAuthenticated(title: String, subtitle: String, _ resolve: @escaping RCTPromiseResolveBlock, rejecter reject: @escaping RCTPromiseRejectBlock) {
    let context = LAContext()
    var error: NSError?

    // Check if biometric authentication or passcode is available
    if context.canEvaluatePolicy(.deviceOwnerAuthentication, error: &error) {
      context.evaluatePolicy(.deviceOwnerAuthentication, localizedReason: subtitle) { (success, evaluateError) in
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
            reject("biometric_not_enrolled", subtitle, nil)
          } else {
            reject("biometric_not_available", error.localizedDescription, nil)
          }
        } else {
          reject("biometric_not_available", title, nil)
        }
      }
    }
  }

}


