import { useClerk, useUser } from "@clerk/expo";
import { styled } from "nativewind";
import { useState } from "react";
import { ActivityIndicator, Pressable, Text, View } from "react-native";
import { SafeAreaView as RNSafeAreaView } from "react-native-safe-area-context";

const SafeAreaView = styled(RNSafeAreaView);

const Settings = () => {
  const { signOut } = useClerk();
  const { user } = useUser();
  const [isLoading, setIsLoading] = useState(false);
  const [networkError, setNetworkError] = useState("");

  const handleSignOut = async () => {
    setIsLoading(true);
    setNetworkError("");
    try {
      await signOut();
      // tabs guard in (tabs)/_layout.tsx handles the redirect automatically
    } catch {
      setNetworkError("Failed to sign out. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const fullName = [user?.firstName, user?.lastName].filter(Boolean).join(" ");
  const email = user?.emailAddresses[0]?.emailAddress;
  const initial = (user?.firstName?.[0] ?? email?.[0] ?? "?").toUpperCase();

  return (
    <SafeAreaView className="flex-1 bg-background">
      <Text className="settings-heading">Settings</Text>

      {/* Account card */}
      <View className="settings-card px-6">
        <Text className="settings-card-label">ACCOUNT</Text>
        <View className="settings-card-row">
          <View className="settings-avatar">
            <Text className="settings-avatar-text">{initial}</Text>
          </View>
          <View className="flex-1 gap-0.5">
            {fullName ? (
              <Text className="settings-user-name">{fullName}</Text>
            ) : null}
            {email ? (
              <Text className="settings-user-email">{email}</Text>
            ) : null}
          </View>
        </View>
      </View>

      {/* Sign out button */}
      <Pressable
        className={
          isLoading
            ? "settings-sign-out-btn opacity-60"
            : "settings-sign-out-btn"
        }
        onPress={handleSignOut}
        disabled={isLoading}
        accessibilityRole="button"
        accessibilityLabel="Sign out"
      >
        {isLoading ? (
          <ActivityIndicator color="#dc2626" />
        ) : (
          <Text className="settings-sign-out-text">Sign out</Text>
        )}
      </Pressable>
      {networkError ? (
        <Text className="settings-error">{networkError}</Text>
      ) : null}
    </SafeAreaView>
  );
};

export default Settings;
