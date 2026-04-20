import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";

import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { PayoutConfirmation } from "@/components/payout-confirmation";
import { PayoutResult } from "@/components/payout-result";
import { Currency } from "@/types/api";
import {
  createPayoutRequest,
  resetPayoutStatus,
  selectPayoutState,
} from "@/store/actions/payoutActions";
import { useThemeColor } from "@/hooks/use-theme-color";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import i18n from "@/constants/i18n";
import { CurrencySelector } from "@/components/currency-selector";
import { isValidIBAN } from "@/utils/validation";

export default function PayoutsScreen() {
  const dispatch = useDispatch();
  const { loading, error, success, result } = useSelector(selectPayoutState);

  // Form State
  const [amount, setAmount] = useState("");
  const [currency, setCurrency] = useState<Currency>("GBP");
  const [iban, setIban] = useState("");

  // UI State
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [showResult, setShowResult] = useState(false);

  const buttonPrimary = useThemeColor({}, "buttonPrimary");
  const buttonDisabled = useThemeColor({}, "buttonDisabled");
  const buttonDisabledText = useThemeColor({}, "buttonDisabledText");
  const textColor = useThemeColor({}, "text");
  const backgroundColor = useThemeColor({}, "background");
  const cardBackgroundColor = useThemeColor({}, "cardBackground");
  const inputBackgroundColor = useThemeColor({}, "inputBackground");
  const borderColor = useThemeColor({}, "border");
  const secondaryTextColor = useThemeColor({}, "secondaryText");

  const isFormValid =
    amount.length > 0 && parseFloat(amount) > 0 && isValidIBAN(iban);

  useEffect(() => {
    if (success || error) {
      setShowConfirmation(false);
      setShowResult(true);
    }
  }, [success, error]);

  const handleAmountChange = (text: string) => {
    // Only allow numbers and one decimal point
    const filtered = text.replace(/[^0-9.]/g, "");
    const parts = filtered.split(".");
    if (parts.length > 2) return;
    setAmount(filtered);
  };

  const handleInitiatePress = () => {
    if (!isFormValid) return;
    setShowConfirmation(true);
  };

  const handleConfirmPayout = () => {
    const amountInCents = Math.round(parseFloat(amount) * 100);
    dispatch(
      createPayoutRequest({
        amount: amountInCents,
        currency,
        iban: iban.trim(),
      }),
    );
  };

  const handleCloseResult = () => {
    setShowResult(false);
    if (success) {
      setAmount("");
      setIban("");
    }
    dispatch(resetPayoutStatus());
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: backgroundColor }}>
      <ThemedView style={[styles.container, { backgroundColor }]}>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={{ flex: 1 }}
        >
          <ScrollView contentContainerStyle={styles.scrollContent}>
            <ThemedView style={styles.header}>
              <ThemedText style={styles.title}>
                {i18n.t("payout.title")}
              </ThemedText>
            </ThemedView>

            <View style={styles.form}>
              {/* Row: Amount & Currency */}
              <View style={styles.row}>
                <View style={styles.amountCol}>
                  <ThemedText style={[styles.label, { color: textColor }]}>
                    {i18n.t("payout.amountLabel")}
                  </ThemedText>
                  <View
                    style={[
                      styles.inputCard,
                      { backgroundColor: inputBackgroundColor, borderColor },
                    ]}
                  >
                    <TextInput
                      style={[styles.input, { color: textColor }]}
                      placeholder={i18n.t("payout.amountPlaceholder")}
                      placeholderTextColor="#999"
                      keyboardType="decimal-pad"
                      value={amount}
                      onChangeText={handleAmountChange}
                    />
                  </View>
                </View>
                <View style={styles.currencyCol}>
                  <ThemedText style={[styles.label, { color: textColor }]}>
                    {i18n.t("payout.currencyLabel")}
                  </ThemedText>
                  <CurrencySelector
                    value={currency}
                    onSelect={setCurrency}
                    style={[
                      styles.currencyCard,
                      { backgroundColor: cardBackgroundColor, borderColor },
                    ]}
                  />
                </View>
              </View>

              {/* IBAN Section */}
              <View style={styles.inputSection}>
                <ThemedText style={[styles.label, { color: textColor }]}>
                  {i18n.t("payout.ibanLabel")}
                </ThemedText>
                <View
                  style={[
                    styles.inputCard,
                    { backgroundColor: inputBackgroundColor, borderColor },
                  ]}
                >
                  <TextInput
                    style={[styles.input, { color: textColor, fontSize: 16 }]}
                    placeholder={i18n.t("payout.ibanPlaceholder")}
                    placeholderTextColor="#BBB"
                    autoCapitalize="characters"
                    value={iban}
                    onChangeText={setIban}
                    multiline={false}
                    numberOfLines={1}
                    maxLength={34}
                  />
                </View>
                <ThemedText
                  style={[styles.hint, { color: secondaryTextColor }]}
                >
                  {i18n.t("payout.ibanHint")}
                </ThemedText>
              </View>

              <TouchableOpacity
                style={[
                  styles.submitButton,
                  {
                    backgroundColor: isFormValid
                      ? buttonPrimary
                      : buttonDisabled,
                  },
                ]}
                onPress={handleInitiatePress}
                disabled={!isFormValid}
              >
                <ThemedText
                  style={[
                    styles.submitButtonText,
                    {
                      color: isFormValid ? "#FFF" : buttonDisabledText,
                    },
                  ]}
                >
                  {i18n.t("payout.continue")}
                </ThemedText>
              </TouchableOpacity>
            </View>
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
  container: {
    flex: 1,
  },
  scrollContent: {
    padding: 24,
    paddingTop: 40,
  },
  header: {
    marginBottom: 40,
    backgroundColor: "transparent",
  },
  title: {
    fontSize: 28,
    lineHeight: 34,
    fontWeight: "800",
  },
  form: {
    gap: 24,
  },
  row: {
    flexDirection: "row",
    gap: 16,
  },
  amountCol: {
    flex: 4,
  },
  currencyCol: {
    flex: 1,
  },
  label: {
    fontSize: 14,
    fontWeight: "700",
    marginBottom: 4,
    opacity: 0.8,
  },
  inputCard: {
    borderRadius: 8,
    borderWidth: 1,
    height: 60,
    paddingHorizontal: 16,
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  currencyCard: {
    borderRadius: 8,
    borderWidth: 1,
    height: 60,
    paddingHorizontal: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  input: {
    fontSize: 18,
    fontWeight: "500",
    width: "100%",
  },
  inputSection: {
    marginTop: 0,
  },
  ibanSection: {
    marginTop: 0,
  },
  hint: {
    fontSize: 13,
    marginTop: 6,
  },
  submitButton: {
    height: 60,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 40,
  },
  submitButtonDisabled: {
    backgroundColor: "#E5E5EA",
  },
  submitButtonText: {
    fontSize: 18,
    fontWeight: "700",
  },
  submitButtonTextDisabled: {
    color: "#AEAEB2",
  },
});
