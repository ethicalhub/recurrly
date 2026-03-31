import { AuthHeader } from "@/components/AuthHeader";
import { colors } from "@/constants/theme";
import { useSignUp } from "@clerk/expo";
import { clsx } from "clsx";
import { useRouter } from "expo-router";
import { styled } from "nativewind";
import { useState } from "react";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

import { SafeAreaView as RNSafeAreaView } from "react-native-safe-area-context";

const SafeAreaView = styled(RNSafeAreaView);

export default function Verify() {
  const { signUp } = useSignUp();
  const router = useRouter();

  const [code, setCode] = useState("");
  const [networkError, setNetworkError] = useState("");
  const [isResending, setIsResending] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);

  const handleVerify = async () => {
    if (!signUp) return;
    setNetworkError("");
    setIsVerifying(true);
    try {
      const { error } = await signUp!.verifications.verifyEmailCode({ code });
      if (error) {
        setNetworkError("Verification failed. Check the code and try again.");
        return;
      }
      if (signUp!.status === "complete") {
        const { error: finalizeError } = await signUp!.finalize();
        if (finalizeError) {
          setNetworkError("Failed to complete sign-up. Please try again.");
        } else {
          router.replace("/(tabs)");
        }
      } else {
        setNetworkError("Verification incomplete. Please try again.");
      }
    } catch {
      setNetworkError("Verification failed. Check the code and try again.");
    } finally {
      setIsVerifying(false);
    }
  };

  const handleResend = async () => {
    if (!signUp || isResending || isVerifying) return;
    setCode("");
    setNetworkError("");
    setIsResending(true);
    try {
      const { error } = await signUp!.verifications.sendEmailCode();
      if (error) {
        setNetworkError("Failed to resend code. Please try again.");
      }
    } catch {
      setNetworkError("Failed to resend code. Please try again.");
    } finally {
      setIsResending(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-background">
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1"
      >
        <ScrollView
          contentContainerStyle={{ flexGrow: 1 }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View className="auth-content">
            <AuthHeader />

            <Text className="auth-title">Check your email</Text>
            <Text className="auth-subtitle">
              Enter the 6-digit code sent to{"\n"}
              <Text className="font-sans-semibold text-primary">
                {signUp?.emailAddress ?? "your email"}
              </Text>
            </Text>

            <View className="auth-card auth-form">
              {networkError ? (
                <Text className="auth-network-error">{networkError}</Text>
              ) : null}

              <View className="auth-field">
                <Text className="auth-label">Verification code</Text>
                <TextInput
                  style={styles.input}
                  value={code}
                  onChangeText={(v) => setCode(v)}
                  placeholder="000000"
                  placeholderTextColor={colors.mutedForeground}
                  keyboardType="number-pad"
                  maxLength={6}
                  returnKeyType="done"
                  onSubmitEditing={handleVerify}
                  accessibilityLabel="Verification code"
                />
              </View>

              <Pressable
                className={clsx(
                  "auth-button",
                  (isVerifying || code.length < 6) && "auth-button-disabled",
                )}
                onPress={handleVerify}
                disabled={isVerifying || code.length < 6}
                accessibilityRole="button"
                accessibilityLabel="Verify email"
              >
                {isVerifying ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text className="auth-button-text">Verify</Text>
                )}
              </Pressable>

              <Pressable
                className="auth-link-row"
                onPress={handleResend}
                disabled={isResending || isVerifying}
                accessibilityRole="button"
              >
                {isResending ? (
                  <ActivityIndicator color="#ea7a53" />
                ) : (
                  <Text className="auth-link">
                    {"Didn't receive a code? Resend"}
                  </Text>
                )}
              </Pressable>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  input: {
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.background,
    paddingHorizontal: 16,
    paddingVertical: 16,
    fontSize: 16,
    color: colors.foreground,
    textAlign: "center",
  },
});
