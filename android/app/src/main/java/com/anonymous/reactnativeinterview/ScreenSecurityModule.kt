package com.anonymous.reactnativeinterview

import android.app.Activity
import android.os.Build
import android.provider.Settings
import androidx.annotation.RequiresApi
import androidx.biometric.BiometricManager
import androidx.biometric.BiometricPrompt
import androidx.core.content.ContextCompat
import androidx.fragment.app.FragmentActivity
import com.facebook.react.bridge.*
import com.facebook.react.modules.core.DeviceEventManagerModule
import java.util.concurrent.Executor

class ScreenSecurityModule(reactContext: ReactApplicationContext) : ReactContextBaseJavaModule(reactContext), LifecycleEventListener {

    private var screenCaptureCallback: Activity.ScreenCaptureCallback? = null

    init {
        reactContext.addLifecycleEventListener(this)
    }

    override fun getName(): String {
        return "ScreenSecurity"
    }

    private fun sendEvent(eventName: String, params: WritableMap?) {
        reactApplicationContext
            .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter::class.java)
            .emit(eventName, params)
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

    // Step 5: Biometric Authentication
    @ReactMethod
    fun isBiometricAuthenticated(title: String, subtitle: String, promise: Promise) {
        val activity = getCurrentActivity()
        if (activity == null || activity !is FragmentActivity) {
            promise.reject("biometric_error", "Activity is not available or not compatible with BiometricPrompt")
            return
        }

        val biometricManager = BiometricManager.from(reactApplicationContext)
        val canAuthenticate = biometricManager.canAuthenticate(BiometricManager.Authenticators.BIOMETRIC_STRONG)

        if (canAuthenticate != BiometricManager.BIOMETRIC_SUCCESS) {
            when (canAuthenticate) {
                BiometricManager.BIOMETRIC_ERROR_NONE_ENROLLED -> {
                    promise.reject("biometric_not_enrolled", subtitle)
                }
                else -> {
                    promise.reject("biometric_not_available", title, null)
                }
            }
            return
        }

        activity.runOnUiThread {
            try {
                val executor: Executor = ContextCompat.getMainExecutor(activity)
                
                val callback = object : BiometricPrompt.AuthenticationCallback() {
                    override fun onAuthenticationError(errorCode: Int, errString: CharSequence) {
                        super.onAuthenticationError(errorCode, errString)
                        if (errorCode == BiometricPrompt.ERROR_USER_CANCELED || errorCode == BiometricPrompt.ERROR_NEGATIVE_BUTTON) {
                            promise.resolve(false)
                        } else {
                            promise.reject("biometric_error", errString.toString())
                        }
                    }

                    override fun onAuthenticationSucceeded(result: BiometricPrompt.AuthenticationResult) {
                        super.onAuthenticationSucceeded(result)
                        promise.resolve(true)
                    }

                    override fun onAuthenticationFailed() {
                        super.onAuthenticationFailed()
                    }
                }

                val biometricPrompt = BiometricPrompt(activity, executor, callback)
                
                val promptInfo = BiometricPrompt.PromptInfo.Builder()
                    .setTitle(title)
                    .setSubtitle(subtitle)
                    .setAllowedAuthenticators(BiometricManager.Authenticators.BIOMETRIC_STRONG or BiometricManager.Authenticators.DEVICE_CREDENTIAL)
                    .build()

                biometricPrompt.authenticate(promptInfo)
            } catch (e: Exception) {
                promise.reject("biometric_error", "An error occurred during biometric authentication: ${e.message}")
            }
        }
    }


    override fun onHostResume() {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.UPSIDE_DOWN_CAKE) {
            registerScreenCaptureCallback()
        }
    }

    override fun onHostPause() {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.UPSIDE_DOWN_CAKE) {
            unregisterScreenCaptureCallback()
        }
    }

    override fun onHostDestroy() {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.UPSIDE_DOWN_CAKE) {
            unregisterScreenCaptureCallback()
        }
    }

    @RequiresApi(Build.VERSION_CODES.UPSIDE_DOWN_CAKE)
    private fun registerScreenCaptureCallback() {
        val activity = getCurrentActivity() ?: return

        if (screenCaptureCallback == null) {
            screenCaptureCallback = Activity.ScreenCaptureCallback {
                sendEvent("onScreenshotTaken", Arguments.createMap().apply {
                    putString("type", "screenshot")
                })
            }
            activity.registerScreenCaptureCallback(activity.mainExecutor, screenCaptureCallback!!)
        }
    }

    @RequiresApi(Build.VERSION_CODES.UPSIDE_DOWN_CAKE)
    private fun unregisterScreenCaptureCallback() {
        val activity = getCurrentActivity() ?: return

        screenCaptureCallback?.let {
            activity.unregisterScreenCaptureCallback(it)
            screenCaptureCallback = null
        }
    }
}
