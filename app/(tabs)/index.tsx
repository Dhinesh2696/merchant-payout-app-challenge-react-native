import React, { useEffect } from "react";
import {
  StyleSheet as RNStyleSheet,
  View,
  TouchableOpacity,
  ActivityIndicator,
  useColorScheme,
} from "react-native";
import { useRouter } from "expo-router";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { ThemedButton } from "@/components/themed-button";
import { SafeAreaView } from "react-native-safe-area-context";
import { CurrencyText } from "@/components/currency-text";
import { useMerchantData } from "../../hooks/use-merchant-data";
import { Colors } from "../../constants/theme";
import i18n from "../../constants/i18n";
import { Ionicons } from "@expo/vector-icons";

export default function HomeScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? "light"];
  const { balance, recentActivity, loading, error, fetchMerchantData } =
    useMerchantData();

  useEffect(() => {
    fetchMerchantData();
  }, [fetchMerchantData]);

  if (loading && !balance) {
    return (
      <ThemedView style={styles.centered}>
        <ActivityIndicator size="small" color={theme.text} />
      </ThemedView>
    );
  }

  if (error && !balance) {
    return (
      <ThemedView style={styles.centered}>
        <ThemedText style={[styles.errorText, { color: theme.negative }]}>{error}</ThemedText>
        <TouchableOpacity
          onPress={fetchMerchantData}
          style={styles.retryButton}
        >
          <ThemedText style={styles.retryText}>
            {i18n.t("home.retry")}
          </ThemedText>
        </TouchableOpacity>
      </ThemedView>
    );
  }

  const renderHeader = () => {
    return (
      <ThemedView style={styles.header}>
        <ThemedText style={styles.headerTitle}>
          {i18n.t("home.title")}
        </ThemedText>
      </ThemedView>
    );
  };

  const renderBalance = () => {
    return (
      <ThemedView style={styles.balanceSection}>
        <ThemedView style={styles.balanceItem}>
          <ThemedText style={[styles.balanceLabel, { color: theme.secondaryText }]}>
            {i18n.t("home.available")}
          </ThemedText>
          <CurrencyText
            amount={balance?.available_balance ?? 0}
            currency={balance?.currency ?? "GBP"}
            style={[styles.availableAmount, { color: theme.text }]}
          />
        </ThemedView>

        <ThemedView
          style={[styles.divider, { backgroundColor: theme.border }]}
        />

        <ThemedView style={styles.balanceItemSmall}>
          <ThemedText style={[styles.balanceLabelSmall, { color: theme.secondaryText }]}>
            {i18n.t("home.pending")}
          </ThemedText>
          <CurrencyText
            amount={balance?.pending_balance ?? 0}
            currency={balance?.currency ?? "GBP"}
            style={[styles.pendingAmount, { color: theme.secondaryText }]}
          />
        </ThemedView>
      </ThemedView>
    );
  };

  const renderRecentActivity = () => {
    return (
      <ThemedView style={styles.activitySection}>
        <ThemedView style={styles.sectionHeader}>
          <ThemedText style={[styles.sectionTitle, { color: theme.text }]}>
            {i18n.t("home.recentActivity")}
          </ThemedText>
          <TouchableOpacity
            onPress={() => router.push("/modal")}
            style={[styles.showMoreButton, { borderColor: theme.tint }]}
          >
            <ThemedText style={[styles.showMoreText, { color: theme.tint }]}>
              {i18n.t("home.showMore")}
            </ThemedText>
          </TouchableOpacity>
        </ThemedView>

        {recentActivity.map((item, index) => (
          <ThemedView
            key={item.id}
            style={[
              styles.activityItem,
              index !== recentActivity.length - 1 && {
                borderBottomColor: theme.border,
                borderBottomWidth: 1,
              },
            ]}
          >
            <ThemedView style={[styles.activityIconContainer, { backgroundColor: theme.buttonDisabled }]}>
              <Ionicons
                name={
                  item.amount < 0 ? "arrow-up-outline" : "arrow-down-outline"
                }
                size={18}
                color={item.amount < 0 ? theme.negative : theme.positive}
              />
            </ThemedView>
            <ThemedView style={styles.activityDetails}>
              <ThemedText style={[styles.activityDescription, { color: theme.text }]}>
                {item.description}
              </ThemedText>
              <ThemedText style={[styles.activitySubtext, { color: theme.secondaryText }]}>
                {item.type}
              </ThemedText>
            </ThemedView>
            <CurrencyText
              amount={item.amount}
              currency={item.currency}
              style={[
                styles.activityAmount,
                { color: item.amount < 0 ? theme.negative : theme.positive },
              ]}
            />
          </ThemedView>
        ))}
      </ThemedView>
    );
  };

  return (
    <SafeAreaView
      style={[styles.safeArea, { backgroundColor: theme.background }]}
    >
      <ThemedView style={styles.container}>
        {renderHeader()}
        {renderBalance()}
        {renderRecentActivity()}
      </ThemedView>
    </SafeAreaView>
  );
}

const styles = RNStyleSheet.create({
  safeArea: {
    flex: 1,
  },
  container: {
    flex: 1,
    paddingHorizontal: 24,
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  header: {
    paddingTop: 20,
    paddingBottom: 40,
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: "800",
    lineHeight: 40,
    letterSpacing: -1,
  },
  balanceSection: {
    marginBottom: 48,
  },
  balanceItem: {
    marginBottom: 12,
  },
  balanceLabel: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 4,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  availableAmount: {
    fontSize: 48,
    fontWeight: "700",
    lineHeight: 56,
    letterSpacing: -2,
  },
  divider: {
    height: 1,
    width: "100%",
    marginVertical: 20,
  },
  balanceItemSmall: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  balanceLabelSmall: {
    fontSize: 16,
  },
  pendingAmount: {
    fontSize: 18,
    fontWeight: "600",
  },
  activitySection: {
    flex: 1,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
  },
  showMoreButton: {
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 4,
  },
  showMoreText: {
    fontSize: 14,
    fontWeight: "700",
  },
  activityItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 16,
  },
  activityIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  activityDetails: {
    flex: 1,
  },
  activityDescription: {
    fontSize: 15,
    fontWeight: "600",
  },
  activitySubtext: {
    fontSize: 13,
    marginTop: 2,
    textTransform: "capitalize",
  },
  activityAmount: {
    fontSize: 15,
    fontWeight: "700",
  },
  payoutButton: {
    marginTop: "auto",
    marginBottom: 30,
    borderRadius: 0,
    height: 56,
  },
  payoutButtonText: {
    fontSize: 16,
    fontWeight: "700",
  },
  retryButton: {
    marginTop: 16,
    padding: 12,
  },
  retryText: {
    fontWeight: "600",
    textDecorationLine: "underline",
  },
  errorText: {
    textAlign: "center",
  },
});

