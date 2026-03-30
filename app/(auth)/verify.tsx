import { AuthHeader } from "@/components/AuthHeader";
import { authStyles } from "@/constants/authStyles";
import { sanitizeOtpCode } from "@/lib/validation";
import { useSignUp } from "@clerk/expo";
import { type Href, useRouter } from "expo-router";
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
import { SafeAreaView } from "react-native-safe-area-context";

export default function Verify() {
  const { signUp, errors, fetchStatus } = useSignUp();
  const router = useRouter();

  const [code, setCode] = useState("");
  const [networkError, setNetworkError] = useState("");
  const [isResending, setIsResending] = useState(false);

  const handleVerify = async () => {
    setNetworkError("");
    try {
      await signUp.verifications.verifyEmailCode({ code });
      if (signUp.status === "complete") {
        await signUp.finalize({
          navigate: ({ decorateUrl }) => {
            router.replace(decorateUrl("/") as Href);
          },
        });
      }
    } catch {
      setNetworkError("Verification failed. Check the code and try again.");
    }
  };

  const handleResend = async () => {
    if (isResending || fetchStatus === "fetching") return;
    setCode("");
    setNetworkError("");
    setIsResending(true);
    try {
      await signUp.verifications.sendEmailCode();
    } catch {
      setNetworkError("Failed to resend code. Please try again.");
    } finally {
      setIsResending(false);
    }
  };

  return (
    <SafeAreaView style={authStyles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={authStyles.keyboardAvoid}
      >
        <ScrollView
          contentContainerStyle={authStyles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          <View style={authStyles.inner}>
            <AuthHeader />

            <Text style={authStyles.title}>Check your email</Text>
            <Text style={authStyles.subtitle}>
              Enter the 6-digit code sent to{"\n"}
              <Text style={localStyles.emailHighlight}>
                {signUp.emailAddress ?? "your email"}
              </Text>
            </Text>

            <View style={authStyles.form}>
              {networkError ? (
                <Text style={authStyles.networkError}>{networkError}</Text>
              ) : null}

              <Text style={authStyles.label}>Verification code</Text>
              <TextInput
                style={[authStyles.input, authStyles.codeInput]}
                value={code}
                onChangeText={(v) => setCode(sanitizeOtpCode(v))}
                placeholder="000000"
                placeholderTextColor="rgba(0,0,0,0.25)"
                keyboardType="number-pad"
                maxLength={6}
                autoFocus
                returnKeyType="done"
                onSubmitEditing={handleVerify}
              />
              {errors.fields.code && (
                <Text style={authStyles.errorText}>
                  {errors.fields.code.message}
                </Text>
              )}

              <Pressable
                style={({ pressed }) => [
                  authStyles.button,
                  (fetchStatus === "fetching" || code.length < 6) &&
                    authStyles.buttonDisabled,
                  pressed && authStyles.buttonPressed,
                ]}
                onPress={handleVerify}
                disabled={fetchStatus === "fetching" || code.length < 6}
              >
                {fetchStatus === "fetching" ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text style={authStyles.buttonText}>Verify</Text>
                )}
              </Pressable>

              <Pressable
                onPress={handleResend}
                disabled={isResending || fetchStatus === "fetching"}
                style={authStyles.resendRow}
              >
                {isResending ? (
                  <ActivityIndicator color="#ea7a53" />
                ) : (
                  <Text style={authStyles.resendText}>
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

const localStyles = StyleSheet.create({
  emailHighlight: {
    fontFamily: "sans-semibold",
    color: "#081126",
  },
});
