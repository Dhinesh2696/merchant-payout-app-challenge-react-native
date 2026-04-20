import {
  StyleSheet,
  FlatList,
  ActivityIndicator,
  View,
  useColorScheme,
  TouchableOpacity,
} from "react-native";
import { useRouter } from "expo-router";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { Colors } from "../constants/theme";
import i18n from "../constants/i18n";
import { CurrencyText } from "@/components/currency-text";
import moment from "moment";
import { DATE_FORMAT } from "../constants/date";
import { formatCurrency, capitalize } from "../utils/format";
import { useMerchantData } from "../hooks/use-merchant-data";

export default function ModalScreen() {
  const { activity, fetchMoreActivity } = useMerchantData();
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? "light"];
  const router = useRouter();

  const renderItem = ({ item }: { item: any }) => (
    <View style={[styles.activityItem, { borderBottomColor: theme.border }]}>
      <View style={styles.activityMain}>
        <ThemedText style={styles.activityType}>
          {capitalize(item.type)}
        </ThemedText>
        <ThemedText style={styles.activityDescription}>
          {item.description}
        </ThemedText>
        <ThemedText style={styles.activityDate}>
          {moment(item.date).format(DATE_FORMAT)}
        </ThemedText>
      </View>
      <View style={styles.activityRight}>
        <CurrencyText
          amount={item.amount}
          currency={item.currency}
          style={[
            styles.activityAmount,
            { color: item.amount < 0 ? theme.negative : theme.positive },
          ]}
        />
        <ThemedText style={styles.activityStatus}>
          {capitalize(item.status)}
        </ThemedText>
      </View>
    </View>
  );

  return (
    <ThemedView style={styles.container}>
      <View style={[styles.header, { borderBottomColor: theme.border }]}>
        <ThemedText type="title" style={styles.headerTitle}>
          {i18n.t("modal.title")}
        </ThemedText>
        <TouchableOpacity onPress={() => router.back()}>
          <ThemedText style={styles.doneButton}>
            {i18n.t("common.done")}
          </ThemedText>
        </TouchableOpacity>
      </View>

      <FlatList
        data={activity.items}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        onEndReached={fetchMoreActivity}
        onEndReachedThreshold={0.5}
        showsVerticalScrollIndicator={false}
        ListFooterComponent={
          activity.loading ? (
            <View style={styles.loaderContainer}>
              <ActivityIndicator size="small" color="#8E8E93" />
              <ThemedText style={styles.loaderText}>
                {i18n.t("modal.loading")}
              </ThemedText>
            </View>
          ) : null
        }
      />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 24,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  headerTitle: {
    fontSize: 28,
    lineHeight: 34,
  },
  doneButton: {
    color: "#007AFF",
    fontSize: 17,
    fontWeight: "600",
  },
  listContent: {
    paddingBottom: 40,
  },
  activityItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 20,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  activityMain: {
    flex: 1,
    gap: 4,
  },
  activityType: {
    fontSize: 16,
    fontWeight: "700",
  },
  activityDescription: {
    fontSize: 14,
    opacity: 0.8,
  },
  activityDate: {
    fontSize: 12,
    opacity: 0.5,
  },
  activityRight: {
    alignItems: "flex-end",
    justifyContent: "flex-start",
    gap: 4,
  },
  activityAmount: {
    fontSize: 16,
    fontWeight: "600",
  },
  activityStatus: {
    fontSize: 12,
    opacity: 0.5,
  },
  loaderContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 20,
    gap: 8,
  },
  loaderText: {
    fontSize: 14,
    opacity: 0.6,
  },
});
