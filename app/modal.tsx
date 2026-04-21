import React, { useMemo } from "react";
import {
  StyleSheet,
  ActivityIndicator,
  View,
  useColorScheme,
  TouchableOpacity,
  SectionList,
} from "react-native";
import { useRouter } from "expo-router";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { Colors } from "../constants/theme";
import i18n from "../constants/i18n";
import { CurrencyText } from "@/components/currency-text";
import moment from "moment";
import { DATE_FORMAT } from "../constants/date";
import { capitalize } from "../utils/format";
import { useMerchantData } from "../hooks/use-merchant-data";
import { Ionicons } from "@expo/vector-icons";

export default function ModalScreen() {
  const { activity, fetchMoreActivity } = useMerchantData();
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? "light"];
  const router = useRouter();

  const groupedActivity = useMemo(() => {
    const groups: { [key: string]: any[] } = {};
    
    activity.items.forEach((item: any) => {
      const date = moment(item.date);
      let title = "";
      
      if (date.isSame(moment(), 'day')) {
        title = "Today";
      } else if (date.isSame(moment().subtract(1, 'days'), 'day')) {
        title = "Yesterday";
      } else {
        title = date.format("MMMM YYYY");
      }
      
      if (!groups[title]) {
        groups[title] = [];
      }
      groups[title].push(item);
    });

    return Object.keys(groups).map(title => ({
      title,
      data: groups[title]
    }));
  }, [activity.items]);

  const renderItem = ({ item }: { item: any }) => (
    <ThemedView style={styles.activityItem}>
      <ThemedView
        style={[
          styles.activityIconContainer,
          { backgroundColor: theme.buttonDisabled },
        ]}
      >
        <Ionicons
          name={item.amount < 0 ? "arrow-up-outline" : "arrow-down-outline"}
          size={16}
          color={item.amount < 0 ? theme.negative : theme.positive}
        />
      </ThemedView>
      <ThemedView style={styles.activityMain}>
        <ThemedText style={[styles.activityDescription, { color: theme.text }]}>
          {item.description}
        </ThemedText>
        <ThemedText
          style={[styles.activityDate, { color: theme.secondaryText }]}
        >
          {moment(item.date).format("DD MMM YYYY, HH:mm")} •{" "}
          {capitalize(item.status)}
        </ThemedText>
      </ThemedView>
      <ThemedView style={styles.activityRight}>
        <CurrencyText
          amount={item.amount}
          currency={item.currency}
          style={[
            styles.activityAmount,
            { color: item.amount < 0 ? theme.negative : theme.positive },
          ]}
        />
      </ThemedView>
    </ThemedView>
  );

  const renderSectionHeader = ({ section: { title } }: { section: { title: string } }) => (
    <ThemedView style={[styles.sectionHeader, { backgroundColor: theme.background }]}>
      <ThemedText style={[styles.sectionTitle, { color: theme.secondaryText }]}>{title}</ThemedText>
    </ThemedView>
  );

  return (
    <ThemedView style={styles.container}>
      <ThemedView style={styles.header}>
        <ThemedText style={styles.headerTitle}>
          {i18n.t("modal.title")}
        </ThemedText>
        <TouchableOpacity onPress={() => router.back()} style={[styles.closeButton, { backgroundColor: theme.buttonDisabled }]}>
          <Ionicons name="close" size={24} color={theme.text} />
        </TouchableOpacity>
      </ThemedView>

      <SectionList
        sections={groupedActivity}
        renderItem={renderItem}
        renderSectionHeader={renderSectionHeader}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        onEndReached={fetchMoreActivity}
        onEndReachedThreshold={0.5}
        stickySectionHeadersEnabled={true}
        showsVerticalScrollIndicator={false}
        ItemSeparatorComponent={() => <ThemedView style={[styles.separator, { backgroundColor: theme.border }]} />}
        ListFooterComponent={
          activity.loading ? (
            <ThemedView style={styles.loaderContainer}>
              <ActivityIndicator size="small" color={theme.text} />
            </ThemedView>
          ) : <ThemedView style={{ height: 40 }} />
        }
      />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 24,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: 24,
    paddingBottom: 32,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "800",
    lineHeight: 32,
    letterSpacing: -0.5,
  },
  closeButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  listContent: {
    paddingBottom: 40,
  },
  sectionHeader: {
    paddingVertical: 12,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  activityItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 20,
  },
  activityIconContainer: {
    width: 32,
    height: 32,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  activityMain: {
    flex: 1,
    gap: 4,
  },
  activityDescription: {
    fontSize: 15,
    fontWeight: "600",
  },
  activityDate: {
    fontSize: 13,
  },
  activityRight: {
    alignItems: "flex-end",
  },
  activityAmount: {
    fontSize: 15,
    fontWeight: "700",
  },
  separator: {
    height: 1,
  },
  loaderContainer: {
    paddingVertical: 32,
    alignItems: "center",
  },
});

