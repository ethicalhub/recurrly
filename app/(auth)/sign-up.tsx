import { AuthHeader } from "@/components/AuthHeader";
import { authStyles } from "@/constants/authStyles";
import {
  sanitizeEmail,
  sanitizeName,
  validateSignUpForm,
} from "@/lib/validation";
import { useSignUp } from "@clerk/expo";
import { type Href, Link, useRouter } from "expo-router";
import { useRef, useState } from "react";
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

            <Text style={authStyles.title}>Create an account</Text>
            <Text style={authStyles.subtitle}>
              Start managing your subscriptions
            </Text>

            <View style={authStyles.form}>
              {networkError ? (
                <Text style={authStyles.networkError}>{networkError}</Text>
              ) : null}

              {/* Name row */}
              <View style={localStyles.nameRow}>
                <View style={localStyles.nameField}>
                  <Text style={authStyles.label}>First Name</Text>
                  <TextInput
                    style={[
                      authStyles.input,
                      fieldErrors.firstName ? authStyles.inputError : null,
                    ]}
                    value={firstName}
                    onChangeText={(v) => {
                      setFirstName(v);
                      if (fieldErrors.firstName)
                        setFieldErrors((p) => ({ ...p, firstName: "" }));
                    }}
                    placeholder="First name"
                    placeholderTextColor="rgba(0,0,0,0.35)"
                    autoComplete="given-name"
                    textContentType="givenName"
                    autoCapitalize="words"
                    returnKeyType="next"
                    onSubmitEditing={() => lastNameRef.current?.focus()}
                    blurOnSubmit={false}
                  />
                  {fieldErrors.firstName ? (
                    <Text style={authStyles.errorText}>
                      {fieldErrors.firstName}
                    </Text>
                  ) : null}
                </View>
                <View style={localStyles.nameField}>
                  <Text style={authStyles.label}>Last Name</Text>
                  <TextInput
                    ref={lastNameRef}
                    style={[
                      authStyles.input,
                      fieldErrors.lastName ? authStyles.inputError : null,
                    ]}
                    value={lastName}
                    onChangeText={(v) => {
                      setLastName(v);
                      if (fieldErrors.lastName)
                        setFieldErrors((p) => ({ ...p, lastName: "" }));
                    }}
                    placeholder="Last name"
                    placeholderTextColor="rgba(0,0,0,0.35)"
                    autoComplete="family-name"
                    textContentType="familyName"
                    autoCapitalize="words"
                    returnKeyType="next"
                    onSubmitEditing={() => emailRef.current?.focus()}
                    blurOnSubmit={false}
                  />
                  {fieldErrors.lastName ? (
                    <Text style={authStyles.errorText}>
                      {fieldErrors.lastName}
                    </Text>
                  ) : null}
                </View>
              </View>

              <Text style={[authStyles.label, authStyles.labelSpacing]}>
                Email
              </Text>
              <TextInput
                ref={emailRef}
                style={[
                  authStyles.input,
                  fieldErrors.email ? authStyles.inputError : null,
                ]}
                value={emailAddress}
                onChangeText={(v) => {
                  setEmailAddress(v);
                  if (fieldErrors.email)
                    setFieldErrors((p) => ({ ...p, email: "" }));
                }}
                placeholder="Enter your email"
                placeholderTextColor="rgba(0,0,0,0.35)"
                keyboardType="email-address"
                autoCapitalize="none"
                autoComplete="email"
                textContentType="emailAddress"
                returnKeyType="next"
                onSubmitEditing={() => passwordRef.current?.focus()}
                blurOnSubmit={false}
              />
              {fieldErrors.email || errors.fields.emailAddress ? (
                <Text style={authStyles.errorText}>
                  {fieldErrors.email || errors.fields.emailAddress?.message}
                </Text>
              ) : null}

              <Text style={[authStyles.label, authStyles.labelSpacing]}>
                Password
              </Text>
              <TextInput
                ref={passwordRef}
                style={[
                  authStyles.input,
                  fieldErrors.password ? authStyles.inputError : null,
                ]}
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
                placeholderTextColor="rgba(0,0,0,0.35)"
                secureTextEntry
                autoComplete="new-password"
                textContentType="newPassword"
                returnKeyType="next"
                onSubmitEditing={() => confirmRef.current?.focus()}
                blurOnSubmit={false}
              />
              {fieldErrors.password || errors.fields.password ? (
                <Text style={authStyles.errorText}>
                  {fieldErrors.password || errors.fields.password?.message}
                </Text>
              ) : null}

              <Text style={[authStyles.label, authStyles.labelSpacing]}>
                Confirm Password
              </Text>
              <TextInput
                ref={confirmRef}
                style={[
                  authStyles.input,
                  fieldErrors.confirmPassword ? authStyles.inputError : null,
                ]}
                value={confirmPassword}
                onChangeText={(v) => {
                  setConfirmPassword(v);
                  if (fieldErrors.confirmPassword)
                    setFieldErrors((p) => ({ ...p, confirmPassword: "" }));
                }}
                placeholder="Confirm your password"
                placeholderTextColor="rgba(0,0,0,0.35)"
                secureTextEntry
                autoComplete="new-password"
                textContentType="none"
                returnKeyType="done"
                onSubmitEditing={handleSignUp}
              />
              {fieldErrors.confirmPassword ? (
                <Text style={authStyles.errorText}>
                  {fieldErrors.confirmPassword}
                </Text>
              ) : null}

              <Pressable
                style={({ pressed }) => [
                  authStyles.button,
                  isDisabled && authStyles.buttonDisabled,
                  pressed && authStyles.buttonPressed,
                ]}
                onPress={handleSignUp}
                disabled={isDisabled}
              >
                {fetchStatus === "fetching" ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text style={authStyles.buttonText}>Create account</Text>
                )}
              </Pressable>

              {/* Required for Clerk bot protection */}
              <View nativeID="clerk-captcha" />
            </View>

            <View style={authStyles.footer}>
              <Text style={authStyles.footerText}>
                Already have an account?{" "}
              </Text>
              <Link href="/(auth)/sign-in" asChild>
                <Pressable>
                  <Text style={authStyles.footerLink}>Sign in</Text>
                </Pressable>
              </Link>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const localStyles = StyleSheet.create({
  nameRow: {
    flexDirection: "row",
    gap: 12,
  },
  nameField: {
    flex: 1,
  },
});
