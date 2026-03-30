import { AuthHeader } from "@/components/AuthHeader";
import { authStyles } from "@/constants/authStyles";
import {
  sanitizeEmail,
  sanitizeOtpCode,
  validateSignInForm,
} from "@/lib/validation";
import { useSignIn } from "@clerk/expo";
import { type Href, Link, useRouter } from "expo-router";
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
import { SafeAreaView } from "react-native-safe-area-context";

export default function SignIn() {
  const { signIn, errors, fetchStatus } = useSignIn();
  const router = useRouter();

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
        await signIn.finalize({
          navigate: ({ decorateUrl }) => {
            router.replace(decorateUrl("/") as Href);
          },
        });
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
        await signIn.finalize({
          navigate: ({ decorateUrl }) => {
            router.replace(decorateUrl("/") as Href);
          },
        });
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
  if (signIn.status === "needs_client_trust") {
    return (
      <SafeAreaView style={authStyles.container}>
        <View style={authStyles.inner}>
          <AuthHeader />
          <Text style={authStyles.title}>Verify your identity</Text>
          <Text style={authStyles.subtitle}>
            Enter the code sent to your email address
          </Text>
          <View style={authStyles.form}>
            {networkError ? (
              <Text style={authStyles.networkError}>{networkError}</Text>
            ) : null}
            <Text style={authStyles.label}>Verification code</Text>
            <TextInput
              style={[authStyles.input, authStyles.codeInput]}
              value={mfaCode}
              onChangeText={(v) => setMfaCode(sanitizeOtpCode(v))}
              placeholder="000000"
              placeholderTextColor="rgba(0,0,0,0.25)"
              keyboardType="number-pad"
              maxLength={6}
              autoFocus
              returnKeyType="done"
              onSubmitEditing={handleVerifyMfa}
            />
            {errors.fields.code && (
              <Text style={authStyles.errorText}>
                {errors.fields.code.message}
              </Text>
            )}
            <Pressable
              style={({ pressed }) => [
                authStyles.button,
                (fetchStatus === "fetching" || !mfaCode) &&
                  authStyles.buttonDisabled,
                pressed && authStyles.buttonPressed,
              ]}
              onPress={handleVerifyMfa}
              disabled={fetchStatus === "fetching" || !mfaCode}
            >
              {fetchStatus === "fetching" ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={authStyles.buttonText}>Verify</Text>
              )}
            </Pressable>
            <Pressable
              onPress={handleResendMfa}
              disabled={fetchStatus === "fetching"}
              style={authStyles.resendRow}
            >
              <Text style={authStyles.resendText}>Resend code</Text>
            </Pressable>
            <Pressable
              onPress={() => signIn.reset()}
              style={authStyles.resendRow}
            >
              <Text style={authStyles.resendText}>Start over</Text>
            </Pressable>
          </View>
        </View>
      </SafeAreaView>
    );
  }

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

            <Text style={authStyles.title}>Welcome back</Text>
            <Text style={authStyles.subtitle}>
              Sign in to continue managing your subscriptions
            </Text>

            <View style={authStyles.form}>
              {networkError ? (
                <Text style={authStyles.networkError}>{networkError}</Text>
              ) : null}

              <Text style={authStyles.label}>Email</Text>
              <TextInput
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
              {fieldErrors.email || errors.fields.identifier ? (
                <Text style={authStyles.errorText}>
                  {fieldErrors.email || errors.fields.identifier?.message}
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
                    setFieldErrors((p) => ({ ...p, password: "" }));
                }}
                placeholder="Enter your password"
                placeholderTextColor="rgba(0,0,0,0.35)"
                secureTextEntry
                autoComplete="current-password"
                textContentType="password"
                returnKeyType="done"
                onSubmitEditing={handleSignIn}
              />
              {fieldErrors.password || errors.fields.password ? (
                <Text style={authStyles.errorText}>
                  {fieldErrors.password || errors.fields.password?.message}
                </Text>
              ) : null}

              <Pressable
                style={({ pressed }) => [
                  authStyles.button,
                  (!emailAddress || !password || fetchStatus === "fetching") &&
                    authStyles.buttonDisabled,
                  pressed && authStyles.buttonPressed,
                ]}
                onPress={handleSignIn}
                disabled={
                  !emailAddress || !password || fetchStatus === "fetching"
                }
              >
                {fetchStatus === "fetching" ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text style={authStyles.buttonText}>Sign in</Text>
                )}
              </Pressable>
            </View>

            <View style={authStyles.footer}>
              <Text style={authStyles.footerText}>New to Recurly? </Text>
              <Link href="/(auth)/sign-up" asChild>
                <Pressable>
                  <Text style={authStyles.footerLink}>Create an account</Text>
                </Pressable>
              </Link>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
