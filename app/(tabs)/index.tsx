import "@/global.css";
import { Link } from "expo-router";
import { Text } from "react-native";
import { SafeAreaView as RNSafeAreaView } from "react-native-safe-area-context";
import {styled} from "nativewind";

const SafeAreaView = styled(RNSafeAreaView)
export default function App() {
  return (
    <SafeAreaView className="flex-1 items-center justify-center bg-background">
      <Text className="text-xl font-bold text-primary">
        Welcome to Nativewind!
      </Text>
      <Link
        href="/onboarding"
        className="mt-4 bg-primary text-white p-4 rounded-2xl text-lg"
      >
        Go to Onboarding
      </Link>
      <Link
        href="/(auth)/sign-in"
        className="mt-4 bg-primary text-white p-4 rounded-2xl text-lg"
      >
        Sign In
      </Link>
      <Link
        href="/(auth)/sign-up"
        className="mt-4 bg-primary text-white p-4 rounded-2xl text-lg"
      >
        Sign Up
      </Link>
    </SafeAreaView>
  );
}
