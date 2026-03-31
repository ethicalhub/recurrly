import { AuthHeader } from "@/components/AuthHeader";
import { colors } from "@/constants/theme";
import {
  sanitizeEmail,
  sanitizeName,
  validateSignUpForm,
} from "@/lib/validation";
import { useSignUp } from "@clerk/expo";
import { clsx } from "clsx";
import { type Href, Link, useRouter } from "expo-router";
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

export default function SignUp() {
  const { signUp, errors, fetchStatus } = useSignUp();
  const router = useRouter();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [emailAddress, setEmailAddress] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [networkError, setNetworkError] = useState("");

  const lastNameRef = useRef<TextInput>(null);
  const emailRef = useRef<TextInput>(null);
  const passwordRef = useRef<TextInput>(null);
  const confirmRef = useRef<TextInput>(null);

  const handleSignUp = async () => {
    const email = sanitizeEmail(emailAddress);
    const first = sanitizeName(firstName);
    const last = sanitizeName(lastName);
    const errs = validateSignUpForm({
      firstName: first,
      lastName: last,
      email,
      password,
      confirmPassword,
    });
    if (Object.keys(errs).length > 0) {
      setFieldErrors(errs);
      return;
    }
    setFieldErrors({});
    setNetworkError("");
    try {
      const { error } = await signUp.password({
        emailAddress: email,
        password,
        firstName: first,
        lastName: last,
      });
      if (error) return;

      await signUp.verifications.sendEmailCode();
      router.replace("/(auth)/verify" as Href);
    } catch {
      setNetworkError("Something went wrong. Please try again.");
    }
  };

  const isDisabled =
    !firstName ||
    !lastName ||
    !emailAddress ||
    !password ||
    !confirmPassword ||
    fetchStatus === "fetching";

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

            <Text className="auth-title">Create an account</Text>
            <Text className="auth-subtitle">
              Start managing your subscriptions
            </Text>

            <View className="auth-card auth-form">
              {networkError ? (
                <Text className="auth-network-error">{networkError}</Text>
              ) : null}

              {/* Name row */}
              <View className="flex-row gap-3">
                <View className="flex-1 gap-2">
                  <Text className="auth-label">First Name</Text>
                  <TextInput
                    className={clsx(
                      "auth-input",
                      fieldErrors.firstName && "auth-input-error",
                    )}
                    value={firstName}
                    onChangeText={(v) => {
                      setFirstName(v);
                      if (fieldErrors.firstName)
                        setFieldErrors((p) => ({ ...p, firstName: "" }));
                    }}
                    placeholder="First name"
                    placeholderTextColor={PLACEHOLDER_COLOR}
                    autoComplete="given-name"
                    textContentType="givenName"
                    autoCapitalize="words"
                    returnKeyType="next"
                    onSubmitEditing={() => lastNameRef.current?.focus()}
                    blurOnSubmit={false}
                    accessibilityLabel="First name"
                  />
                  {fieldErrors.firstName ? (
                    <Text className="auth-error">{fieldErrors.firstName}</Text>
                  ) : null}
                </View>
                <View className="flex-1 gap-2">
                  <Text className="auth-label">Last Name</Text>
                  <TextInput
                    ref={lastNameRef}
                    className={clsx(
                      "auth-input",
                      fieldErrors.lastName && "auth-input-error",
                    )}
                    value={lastName}
                    onChangeText={(v) => {
                      setLastName(v);
                      if (fieldErrors.lastName)
                        setFieldErrors((p) => ({ ...p, lastName: "" }));
                    }}
                    placeholder="Last name"
                    placeholderTextColor={PLACEHOLDER_COLOR}
                    autoComplete="family-name"
                    textContentType="familyName"
                    autoCapitalize="words"
                    returnKeyType="next"
                    onSubmitEditing={() => emailRef.current?.focus()}
                    blurOnSubmit={false}
                    accessibilityLabel="Last name"
                  />
                  {fieldErrors.lastName ? (
                    <Text className="auth-error">{fieldErrors.lastName}</Text>
                  ) : null}
                </View>
              </View>

              <View className="auth-field">
                <Text className="auth-label">Email</Text>
                <TextInput
                  ref={emailRef}
                  className={clsx(
                    "auth-input",
                    (fieldErrors.email || errors.fields.emailAddress) &&
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
                {(fieldErrors.email || errors.fields.emailAddress) && (
                  <Text className="auth-error">
                    {fieldErrors.email || errors.fields.emailAddress?.message}
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
                      setFieldErrors((p) => ({
                        ...p,
                        password: "",
                        confirmPassword: "",
                      }));
                  }}
                  placeholder="Enter your password"
                  placeholderTextColor={PLACEHOLDER_COLOR}
                  secureTextEntry
                  autoComplete="new-password"
                  textContentType="newPassword"
                  returnKeyType="next"
                  onSubmitEditing={() => confirmRef.current?.focus()}
                  blurOnSubmit={false}
                  accessibilityLabel="Password"
                />
                {(fieldErrors.password || errors.fields.password) && (
                  <Text className="auth-error">
                    {fieldErrors.password || errors.fields.password?.message}
                  </Text>
                )}
              </View>

              <View className="auth-field">
                <Text className="auth-label">Confirm Password</Text>
                <TextInput
                  ref={confirmRef}
                  className={clsx(
                    "auth-input",
                    fieldErrors.confirmPassword && "auth-input-error",
                  )}
                  value={confirmPassword}
                  onChangeText={(v) => {
                    setConfirmPassword(v);
                    if (fieldErrors.confirmPassword)
                      setFieldErrors((p) => ({ ...p, confirmPassword: "" }));
                  }}
                  placeholder="Confirm your password"
                  placeholderTextColor={PLACEHOLDER_COLOR}
                  secureTextEntry
                  autoComplete="new-password"
                  textContentType="none"
                  returnKeyType="done"
                  onSubmitEditing={handleSignUp}
                  accessibilityLabel="Confirm password"
                />
                {fieldErrors.confirmPassword ? (
                  <Text className="auth-error">
                    {fieldErrors.confirmPassword}
                  </Text>
                ) : null}
              </View>

              <Pressable
                className={clsx(
                  "auth-button",
                  isDisabled && "auth-button-disabled",
                )}
                onPress={handleSignUp}
                disabled={isDisabled}
                accessibilityRole="button"
                accessibilityLabel="Create account"
              >
                {fetchStatus === "fetching" ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text className="auth-button-text">Create account</Text>
                )}
              </Pressable>

              {/* Required for Clerk bot protection */}
              <View nativeID="clerk-captcha" />
            </View>

            <View className="auth-link-row">
              <Text className="auth-link-copy">Already have an account? </Text>
              <Link href="/(auth)/sign-in" asChild>
                <Pressable accessibilityRole="link">
                  <Text className="auth-link">Sign in</Text>
                </Pressable>
              </Link>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
