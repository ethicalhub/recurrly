import { useClerk, useUser } from "@clerk/expo";
import { useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

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

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.heading}>Settings</Text>

      {/* Account card */}
      <View style={styles.card}>
        <Text style={styles.cardLabel}>ACCOUNT</Text>
        <View style={styles.cardRow}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>
              {(user?.firstName?.[0] ?? "?").toUpperCase()}
            </Text>
          </View>
          <View style={styles.userInfo}>
            {fullName ? <Text style={styles.userName}>{fullName}</Text> : null}
            {email ? <Text style={styles.userEmail}>{email}</Text> : null}
          </View>
        </View>
      </View>

      {/* Sign out button */}
      <Pressable
        style={({ pressed }) => [
          styles.signOutButton,
          isLoading && styles.signOutButtonDisabled,
          pressed && styles.signOutButtonPressed,
        ]}
        onPress={handleSignOut}
        disabled={isLoading}
      >
        {isLoading ? (
          <ActivityIndicator color="#dc2626" />
        ) : (
          <Text style={styles.signOutText}>Sign out</Text>
        )}
      </Pressable>
      {networkError ? (
        <Text style={styles.networkError}>{networkError}</Text>
      ) : null}
    </SafeAreaView>
  );
};

export default Settings;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff9e3",
    paddingHorizontal: 24,
    paddingTop: 24,
  },
  heading: {
    fontFamily: "sans-bold",
    fontSize: 26,
    color: "#081126",
    marginBottom: 24,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  cardLabel: {
    fontFamily: "sans-semibold",
    fontSize: 11,
    color: "rgba(0,0,0,0.4)",
    letterSpacing: 1.2,
    marginBottom: 14,
  },
  cardRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
  },
  avatar: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: "#ea7a53",
    alignItems: "center",
    justifyContent: "center",
  },
  avatarText: {
    fontFamily: "sans-bold",
    fontSize: 18,
    color: "#fff",
  },
  userInfo: {
    flex: 1,
    gap: 2,
  },
  userName: {
    fontFamily: "sans-semibold",
    fontSize: 16,
    color: "#081126",
  },
  userEmail: {
    fontFamily: "sans-regular",
    fontSize: 13,
    color: "rgba(0,0,0,0.5)",
  },
  signOutButton: {
    borderWidth: 1.5,
    borderColor: "#dc2626",
    borderRadius: 12,
    paddingVertical: 15,
    alignItems: "center",
    backgroundColor: "rgba(220,38,38,0.05)",
  },
  signOutButtonDisabled: {
    opacity: 0.6,
  },
  signOutButtonPressed: {
    opacity: 0.7,
  },
  signOutText: {
    fontFamily: "sans-semibold",
    fontSize: 15,
    color: "#dc2626",
  },
  networkError: {
    fontFamily: "sans-regular",
    fontSize: 13,
    color: "#dc2626",
    textAlign: "center",
    marginTop: 12,
  },
});
