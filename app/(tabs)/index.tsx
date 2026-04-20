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
import { useThemeColor } from "@/hooks/use-theme-color";
import { useMerchantData } from "../../hooks/use-merchant-data";
import { Colors } from "../../constants/theme";
import i18n from "../../constants/i18n";

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
        <ActivityIndicator size="large" />
      </ThemedView>
    );
  }

  if (error && !balance) {
    return (
      <ThemedView style={styles.centered}>
        <ThemedText>{error}</ThemedText>
        <TouchableOpacity onPress={fetchMerchantData}>
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
      <ThemedView style={styles.section}>
        <ThemedText style={styles.sectionTitle}>
          {i18n.t("home.balance")}
        </ThemedText>
        {balance && (
          <View style={styles.balanceContainer}>
            <View style={styles.balanceItem}>
              <ThemedText style={styles.balanceLabel}>
                {i18n.t("home.available")}
              </ThemedText>
              <CurrencyText
                amount={balance.available_balance}
                currency={balance.currency}
                style={styles.balanceAmount}
              />
            </View>
            <View style={styles.balanceItem}>
              <ThemedText style={styles.balanceLabel}>
                {i18n.t("home.pending")}
              </ThemedText>
              <CurrencyText
                amount={balance.pending_balance}
                currency={balance.currency}
                style={styles.balanceAmount}
              />
            </View>
          </View>
        )}
      </ThemedView>
    );
  };

  const renderRecentActivity = () => {
    return (
      <ThemedView style={styles.section}>
        <ThemedText style={styles.sectionTitle}>
          {i18n.t("home.recentActivity")}
        </ThemedText>
        {recentActivity.map((item) => (
          <View
            key={item.id}
            style={[styles.activityItem, { borderBottomColor: theme.border }]}
          >
            <ThemedText style={styles.activityDescription}>
              {item.description}
            </ThemedText>
            <CurrencyText
              amount={item.amount}
              currency={item.currency}
              style={[
                styles.activityAmount,
                { color: item.amount < 0 ? theme.negative : theme.positive },
              ]}
            />
          </View>
        ))}
        <ThemedButton
          variant="secondary"
          style={styles.showMoreButton}
          onPress={() => router.push("/modal")}
        >
          <ThemedText style={styles.showMoreText}>
            {i18n.t("home.showMore")}
          </ThemedText>
        </ThemedButton>
      </ThemedView>
    );
  };
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ThemedView style={styles.container}>
        {renderHeader()}
        {renderBalance()}
        {renderRecentActivity()}
      </ThemedView>
    </SafeAreaView>
  );
}

const styles = RNStyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
  },
  header: {
    paddingTop: 30,
    paddingBottom: 20,
  },
  headerTitle: {
    fontSize: 28,
    lineHeight: 34,
    fontWeight: "800",
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 16,
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  balanceContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  balanceItem: {
    flex: 1,
  },
  balanceLabel: {
    fontSize: 13,
    marginBottom: 4,
    opacity: 0.6,
  },
  balanceAmount: {
    fontSize: 22,
    fontWeight: "700",
  },
  activityItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 16,
    borderBottomWidth: 1,
  },
  activityDescription: {
    flex: 1,
    fontSize: 14,
  },
  activityAmount: {
    fontSize: 16,
    fontWeight: "600",
  },
  showMoreButton: {
    marginTop: 24,
    borderRadius: 12,
    height: 50,
    justifyContent: "center",
    alignItems: "center",
  },
  showMoreText: {
    color: "#007AFF",
    fontSize: 16,
    fontWeight: "600",
  },
  retryText: {
    marginTop: 12,
    color: "#007AFF",
    fontSize: 16,
  },
});
