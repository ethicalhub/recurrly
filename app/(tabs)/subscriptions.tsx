import SubscriptionCard from "@/components/SubscriptionCard";
import "@/global.css";
import { useSubscriptionsStore } from "@/store/useSubscriptionsStore";
import { styled } from "nativewind";
import { useMemo, useState } from "react";
import {
  FlatList,
  KeyboardAvoidingView,
  Platform,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView as RNSafeAreaView } from "react-native-safe-area-context";

const SafeAreaView = styled(RNSafeAreaView);

const Separator = () => <View className="h-4" />;

const EmptyState = () => (
  <Text className="home-empty-state">No subscriptions found.</Text>
);

const Subscriptions = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const { subscriptions } = useSubscriptionsStore();

  const filtered = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return subscriptions;
    return subscriptions.filter(
      (s) =>
        s.name.toLowerCase().includes(q) ||
        s.plan?.toLowerCase().includes(q) ||
        s.category?.toLowerCase().includes(q),
    );
  }, [searchQuery, subscriptions]);

  return (
    <SafeAreaView className="flex-1 bg-background">
      <KeyboardAvoidingView
        className="flex-1"
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <View className="flex-1 px-5">
          <Text className="subs-screen-title pt-5">My Subscriptions</Text>
          <View className="subs-search-wrap">
            <TextInput
              className="subs-search"
              placeholder="Search subscriptions…"
              placeholderTextColor="rgba(0,0,0,0.35)"
              value={searchQuery}
              onChangeText={setSearchQuery}
              autoCorrect={false}
              autoCapitalize="none"
              returnKeyType="search"
            />
          </View>
          <FlatList
            data={filtered}
            keyExtractor={(item) => item.id}
            extraData={expandedId}
            showsVerticalScrollIndicator={false}
            contentContainerClassName="pb-30"
            keyboardShouldPersistTaps="handled"
            renderItem={({ item }) => (
              <SubscriptionCard
                {...item}
                expanded={expandedId === item.id}
                onPress={() =>
                  setExpandedId((cur) => (cur === item.id ? null : item.id))
                }
              />
            )}
            ItemSeparatorComponent={Separator}
            ListEmptyComponent={EmptyState}
          />
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default Subscriptions;
