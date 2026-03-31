import { AuthHeader } from "@/components/AuthHeader";
import { colors } from "@/constants/theme";
import {
  sanitizeEmail,
  sanitizeOtpCode,
  validateSignInForm,
} from "@/lib/validation";
import { useSignIn } from "@clerk/expo";
import { clsx } from "clsx";
import { Link } from "expo-router";
import { styled } from "nativewind";
import { useRef, useState } from "react";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from "react-native";

import { SafeAreaView as RNSafeAreaView } from "react-native-safe-area-context";

const SafeAreaView = styled(RNSafeAreaView);
const PLACEHOLDER_COLOR = colors.mutedForeground;

export default function SignIn() {
  const { signIn, errors, fetchStatus } = useSignIn();

  const [emailAddress, setEmailAddress] = useState("");
  const [password, setPassword] = useState("");
  const [mfaCode, setMfaCode] = useState("");
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [networkError, setNetworkError] = useState("");

  const passwordRef = useRef<TextInput>(null);

  const handleSignIn = async () => {
    const email = sanitizeEmail(emailAddress);
    const errs = validateSignInForm({ email, password });
    if (Object.keys(errs).length > 0) {
      setFieldErrors(errs);
      return;
    }
    setFieldErrors({});
    setNetworkError("");
    try {
      const { error } = await signIn.password({
        emailAddress: email,
        password,
      });
      if (error) return;

      if (signIn.status === "complete") {
        await signIn.finalize();
      } else if (signIn.status === "needs_client_trust") {
        await signIn.mfa.sendEmailCode();
      }
    } catch {
      setNetworkError("Something went wrong. Please try again.");
    }
  };

  const handleVerifyMfa = async () => {
    setNetworkError("");
    try {
      await signIn.mfa.verifyEmailCode({ code: mfaCode });
      if (signIn.status === "complete") {
        await signIn.finalize();
      }
    } catch {
      setNetworkError("Verification failed. Please try again.");
    }
  };

  const handleResendMfa = async () => {
    setNetworkError("");
    try {
      await signIn.mfa.sendEmailCode();
    } catch {
      setNetworkError("Failed to resend code. Please try again.");
    }
  };

  // MFA verification view
  if (signIn?.status === "needs_client_trust") {
    return (
      <SafeAreaView className="flex-1 bg-background">
        <View className="auth-content">
          <AuthHeader />
          <Text className="auth-title">Verify your identity</Text>
          <Text className="auth-subtitle">
            Enter the code sent to your email address
          </Text>
          <View className="auth-card auth-form">
            {networkError ? (
              <Text className="auth-network-error">{networkError}</Text>
            ) : null}
            <View className="auth-field">
              <Text className="auth-label">Verification code</Text>
              <TextInput
                className={clsx(
                  "auth-input text-center",
                  errors.fields.code && "auth-input-error",
                )}
                value={mfaCode}
                onChangeText={(v) => setMfaCode(sanitizeOtpCode(v))}
                placeholder="000000"
                placeholderTextColor={PLACEHOLDER_COLOR}
                keyboardType="number-pad"
                maxLength={6}
                autoFocus
                returnKeyType="done"
                onSubmitEditing={handleVerifyMfa}
                accessibilityLabel="Verification code"
              />
              {errors.fields.code && (
                <Text className="auth-error">{errors.fields.code.message}</Text>
              )}
            </View>
            <Pressable
              className={clsx(
                "auth-button",
                (fetchStatus === "fetching" || !mfaCode) &&
                  "auth-button-disabled",
              )}
              onPress={handleVerifyMfa}
              disabled={fetchStatus === "fetching" || !mfaCode}
              accessibilityRole="button"
              accessibilityLabel="Verify"
            >
              {fetchStatus === "fetching" ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text className="auth-button-text">Verify</Text>
              )}
            </Pressable>
            <Pressable
              className="auth-link-row"
              onPress={handleResendMfa}
              disabled={fetchStatus === "fetching"}
              accessibilityRole="button"
            >
              <Text className="auth-link">Resend code</Text>
            </Pressable>
            <Pressable
              className="auth-link-row"
              onPress={() => signIn.reset()}
              accessibilityRole="button"
            >
              <Text className="auth-link">Start over</Text>
            </Pressable>
          </View>
        </View>
      </SafeAreaView>
    );
  }

  const isDisabled = !emailAddress || !password || fetchStatus === "fetching";

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

            <Text className="auth-title">Welcome back</Text>
            <Text className="auth-subtitle">
              Sign in to continue managing your subscriptions
            </Text>

            <View className="auth-card auth-form">
              {networkError ? (
                <Text className="auth-network-error">{networkError}</Text>
              ) : null}

              <View className="auth-field">
                <Text className="auth-label">Email</Text>
                <TextInput
                  className={clsx(
                    "auth-input",
                    (fieldErrors.email || errors.fields.identifier) &&
                      "auth-input-error",
                  )}
                  value={emailAddress}
                  onChangeText={(v) => {
                    setEmailAddress(v);
                    if (fieldErrors.email)
                      setFieldErrors((p) => ({ ...p, email: "" }));
                  }}
                  placeholder="Enter your email"
                  placeholderTextColor={PLACEHOLDER_COLOR}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoComplete="email"
                  textContentType="emailAddress"
                  returnKeyType="next"
                  onSubmitEditing={() => passwordRef.current?.focus()}
                  blurOnSubmit={false}
                  accessibilityLabel="Email address"
                />
                {(fieldErrors.email || errors.fields.identifier) && (
                  <Text className="auth-error">
                    {fieldErrors.email || errors.fields.identifier?.message}
                  </Text>
                )}
              </View>

              <View className="auth-field">
                <Text className="auth-label">Password</Text>
                <TextInput
                  ref={passwordRef}
                  className={clsx(
                    "auth-input",
                    (fieldErrors.password || errors.fields.password) &&
                      "auth-input-error",
                  )}
                  value={password}
                  onChangeText={(v) => {
                    setPassword(v);
                    if (fieldErrors.password)
                      setFieldErrors((p) => ({ ...p, password: "" }));
                  }}
                  placeholder="Enter your password"
                  placeholderTextColor={PLACEHOLDER_COLOR}
                  secureTextEntry
                  autoComplete="current-password"
                  textContentType="password"
                  returnKeyType="done"
                  onSubmitEditing={handleSignIn}
                  accessibilityLabel="Password"
                />
                {(fieldErrors.password || errors.fields.password) && (
                  <Text className="auth-error">
                    {fieldErrors.password || errors.fields.password?.message}
                  </Text>
                )}
              </View>

              <Pressable
                className={clsx(
                  "auth-button",
                  isDisabled && "auth-button-disabled",
                )}
                onPress={handleSignIn}
                disabled={isDisabled}
                accessibilityRole="button"
                accessibilityLabel="Sign in"
              >
                {fetchStatus === "fetching" ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text className="auth-button-text">Sign in</Text>
                )}
              </Pressable>
            </View>

            <View className="auth-link-row">
              <Text className="auth-link-copy">Don't have an account? </Text>
              <Link href="/(auth)/sign-up" asChild>
                <Pressable accessibilityRole="link">
                  <Text className="auth-link">Create an account</Text>
                </Pressable>
              </Link>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
