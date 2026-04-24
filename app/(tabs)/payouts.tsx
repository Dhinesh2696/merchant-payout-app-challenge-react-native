import React, { useState, useEffect, useCallback, useMemo } from "react";
import {
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  useColorScheme,
} from "react-native";

import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { PayoutConfirmation } from "@/components/payout-confirmation";
import { PayoutResult } from "@/components/payout-result";
import { Currency } from "@/types/api";
import { SafeAreaView } from "react-native-safe-area-context";
import { useThemeColor } from "../../hooks/use-theme-color";
import { usePayoutData } from "../../hooks/use-payout-data";
import { useFocusEffect } from "expo-router";
import i18n from "../../constants/i18n";
import { CurrencySelector } from "@/components/currency-selector";
import { isValidIBAN } from "@/utils/validation";
import { Colors } from "@/constants/theme";
import * as ScreenSecurity from "@/modules/screen-security";
import { Alert } from "react-native";

export default function PayoutsScreen() {
  const { loading, error, success, result, initiatePayout, resetPayout } =
    usePayoutData();
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? "light"];
  const iconColor = useThemeColor({}, "icon");

  // Threshold for biometric authentication: 1,000.00 in current currency
  const BIOMETRIC_THRESHOLD = 1000 * 100; // 100,000 cents/pence

  // Form State
  const [amount, setAmount] = useState("");
  const [currency, setCurrency] = useState<Currency>("GBP");
  const [iban, setIban] = useState("");

  // UI State
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [showResult, setShowResult] = useState(false);

  const isFormValid = useMemo(() => {
    if (amount.length === 0) return false;
    const numericAmount = parseFloat(amount);
    if (!Number.isFinite(numericAmount) || numericAmount <= 0) return false;
    return isValidIBAN(iban);
  }, [amount, iban]);

  useEffect(() => {
    if (success || error) {
      setShowConfirmation(false);
      setShowResult(true);
    }
  }, [success, error]);

  useFocusEffect(
    useCallback(() => {
      const subscription = ScreenSecurity.addScreenshotListener(() => {
        Alert.alert(
          i18n.t("security.alertTitle"),
          i18n.t("security.screenshotDetected"),
          [{ text: i18n.t("common.done") }],
        );
      });

      return () => {
        subscription.remove();
      };
    }, []),
  );

  const handleAmountChange = (text: string) => {
    const filtered = text.replace(/[^0-9.]/g, "");
    const parts = filtered.split(".");
    if (parts.length > 2) return;
    setAmount(filtered);
  };

  const handleInitiatePress = () => {
    if (!isFormValid) return;
    setShowConfirmation(true);
  };

  const handleConfirmPayout = async () => {
    const amountInCents = Math.round(parseFloat(amount) * 100);

    try {
      // Step 5: Native Biometric for Payouts over £1,000.00
      if (amountInCents >= BIOMETRIC_THRESHOLD) {
        const authenticated = await ScreenSecurity.isBiometricAuthenticated(
          i18n.t("security.biometricTitle"),
          i18n.t("security.biometricSubtitle"),
        );
        if (!authenticated) {
          // Abort if user canceled
          return;
        }
      }

      initiatePayout({
        amount: amountInCents,
        currency,
        iban: iban.trim(),
      });
    } catch (err: any) {
      if (
        err.code === "biometric_not_enrolled" ||
        err.code === "biometric_not_available"
      ) {
        Alert.alert(i18n.t("security.alertTitle"), err.message);
      } else {
        console.error("Payout error:", err);
        // Fallback for other errors
        Alert.alert(i18n.t("common.error"), i18n.t("result.errorDefault"));
      }
    }
  };

  const handleCloseResult = () => {
    setShowResult(false);
    if (success) {
      setAmount("");
      setIban("");
    }
    resetPayout();
  };

  return (
    <SafeAreaView
      style={[styles.safeArea, { backgroundColor: theme.background }]}
      edges={["top"]}
    >
      <ThemedView style={styles.container}>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={{ flex: 1 }}
        >
          <ScrollView
            contentContainerStyle={styles.scrollContent}
            keyboardShouldPersistTaps="handled"
          >
            <ThemedView style={styles.header}>
              <ThemedText style={styles.title}>
                {i18n.t("payout.title")}
              </ThemedText>
              <ThemedText
                style={[styles.subtitle, { color: theme.secondaryText }]}
              >
                {i18n.t("payout.subtitle")}
              </ThemedText>
            </ThemedView>

            <ThemedView style={styles.form}>
              <ThemedView style={styles.inputGroup}>
                <ThemedText style={[styles.label, { color: theme.text }]}>
                  {i18n.t("payout.amountLabel")}
                </ThemedText>
                <ThemedView style={styles.row}>
                  <ThemedView
                    style={[
                      styles.amountContainer,
                      { borderColor: theme.border },
                    ]}
                  >
                    <TextInput
                      style={[styles.amountInput, { color: theme.text }]}
                      placeholder={i18n.t("payout.amountPlaceholder")}
                      placeholderTextColor={theme.icon}
                      keyboardType="decimal-pad"
                      value={amount}
                      onChangeText={handleAmountChange}
                    />
                  </ThemedView>
                  <CurrencySelector
                    value={currency}
                    onSelect={setCurrency}
                    style={styles.currencySelector}
                  />
                </ThemedView>
              </ThemedView>

              <ThemedView style={styles.inputGroup}>
                <ThemedText style={[styles.label, { color: theme.text }]}>
                  {i18n.t("payout.ibanLabel")}
                </ThemedText>
                <TextInput
                  style={[
                    styles.ibanInput,
                    { color: theme.text, borderColor: theme.border },
                  ]}
                  placeholder={i18n.t("payout.ibanPlaceholder")}
                  placeholderTextColor={theme.icon}
                  value={iban}
                  onChangeText={setIban}
                  maxLength={34}
                />
                <ThemedText
                  style={[styles.hint, { color: theme.secondaryText }]}
                >
                  {i18n.t("payout.ibanHint")}
                </ThemedText>
              </ThemedView>

              <TouchableOpacity
                style={[
                  styles.submitButton,
                  {
                    backgroundColor: isFormValid
                      ? theme.buttonPrimary
                      : theme.buttonDisabled,
                  },
                ]}
                onPress={handleInitiatePress}
                disabled={!isFormValid}
              >
                <ThemedText
                  style={[
                    styles.submitButtonText,
                    {
                      color: isFormValid
                        ? theme.buttonPrimaryText
                        : theme.buttonDisabledText,
                    },
                  ]}
                >
                  {i18n.t("payout.continue")}
                </ThemedText>
              </TouchableOpacity>
            </ThemedView>
          </ScrollView>
        </KeyboardAvoidingView>

        <PayoutConfirmation
          visible={showConfirmation}
          amount={Math.round(parseFloat(amount || "0") * 100)}
          currency={currency}
          iban={iban}
          loading={loading}
          onConfirm={handleConfirmPayout}
          onCancel={() => setShowConfirmation(false)}
        />

        <PayoutResult
          visible={showResult}
          success={success}
          error={error}
          result={result}
          onClose={handleCloseResult}
        />
      </ThemedView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  container: {
    flex: 1,
  },
  scrollContent: {
    padding: 24,
    paddingTop: 20,
  },
  header: {
    marginBottom: 48,
  },
  title: {
    fontSize: 28,
    fontWeight: "800",
    lineHeight: 36,
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 15,
    marginTop: 8,
  },
  form: {
    gap: 32,
  },
  inputGroup: {
    gap: 8,
  },
  label: {
    fontSize: 13,
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  row: {
    flexDirection: "row",
    gap: 12,
  },
  amountContainer: {
    flex: 1,
    height: 56,
    borderWidth: 1.5,
    paddingHorizontal: 16,
    justifyContent: "center",
  },
  amountInput: {
    fontSize: 20,
    fontWeight: "600",
  },
  currencySelector: {
    width: 100,
    height: 56,
    borderWidth: 1.5,
    borderRadius: 0,
    backgroundColor: "transparent",
  },
  ibanInput: {
    height: 56,
    borderWidth: 1.5,
    paddingHorizontal: 16,
    fontSize: 16,
    fontWeight: "500",
  },
  hint: {
    fontSize: 12,
    marginTop: 4,
  },
  submitButton: {
    height: 56,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 8,
  },
  submitButtonText: {
    fontSize: 16,
    fontWeight: "700",
  },
});
