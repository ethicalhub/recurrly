import "@/global.css";
import { ClerkProvider, useAuth } from "@clerk/expo";
import { tokenCache } from "@clerk/expo/token-cache";
import { useFonts } from "expo-font";
import { Redirect, SplashScreen, Stack, useSegments } from "expo-router";
import { useEffect } from "react";

SplashScreen.preventAutoHideAsync();

const publishableKey = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY!;

if (!publishableKey) {
  throw new Error(
    "Missing EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY — add it to your .env file",
  );
}

function RootNavigator() {
  const { isSignedIn, isLoaded } = useAuth();
  const segments = useSegments();

  if (!isLoaded) return null;

  const inAuth = segments[0] === "(auth)" || segments[0] === "onboarding";

  if (isSignedIn && inAuth) return <Redirect href="/(tabs)" />;
  if (!isSignedIn && !inAuth) return <Redirect href="/onboarding" />;

  return <Stack screenOptions={{ headerShown: false }} />;
}

export default function RootLayout() {
  const [fontLoaded] = useFonts({
    "sans-regular": require("@/assets/fonts/PlusJakartaSans-Regular.ttf"),
    "sans-medium": require("@/assets/fonts/PlusJakartaSans-Medium.ttf"),
    "sans-semibold": require("@/assets/fonts/PlusJakartaSans-SemiBold.ttf"),
    "sans-bold": require("@/assets/fonts/PlusJakartaSans-Bold.ttf"),
    "sans-extrabold": require("@/assets/fonts/PlusJakartaSans-ExtraBold.ttf"),
    "sans-light": require("@/assets/fonts/PlusJakartaSans-Light.ttf"),
  });

  useEffect(() => {
    if (fontLoaded) SplashScreen.hideAsync();
  }, [fontLoaded]);

  return (
    <ClerkProvider publishableKey={publishableKey} tokenCache={tokenCache}>
      {fontLoaded ? <RootNavigator /> : null}
    </ClerkProvider>
  );
}
