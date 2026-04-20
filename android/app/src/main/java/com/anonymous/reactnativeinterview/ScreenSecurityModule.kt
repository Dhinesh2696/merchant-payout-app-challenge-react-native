package com.anonymous.reactnativeinterview

import android.provider.Settings
import com.facebook.react.bridge.*

class ScreenSecurityModule(reactContext: ReactApplicationContext) : ReactContextBaseJavaModule(reactContext) {

    override fun getName(): String {
        return "ScreenSecurity"
    }

    // Step 4: Device Identity
    @ReactMethod
    fun getDeviceId(promise: Promise) {
        try {
            val deviceId = Settings.Secure.getString(
                reactApplicationContext.contentResolver,
                Settings.Secure.ANDROID_ID
            )
            promise.resolve(deviceId ?: "unknown-android-device")
        } catch (e: Exception) {
            promise.reject("device_id_error", "Could not capture device identity", e)
        }
    }
}
