import images from "@/constants/images";
import { useRouter } from "expo-router";
import { styled } from "nativewind";
import React from "react";
import { Image, Pressable, Text, View } from "react-native";
import { SafeAreaView as RNSafeAreaView } from "react-native-safe-area-context";

const SafeAreaView = styled(RNSafeAreaView);

export default function Onboarding() {
  const router = useRouter();

  const handleGetStarted = () => {
    router.replace("/(auth)/sign-in");
  };

  return (
    <SafeAreaView className="onboarding-container">
      <Image
        source={images.splashPattern}
        resizeMode="contain"
        className="flex-1 w-full"
        accessibilityLabel="Recurly splash pattern"
      />
      <View className="onboarding-footer">
        <Text className="onboarding-title">Gain Financial Clarity</Text>
        <Text className="onboarding-subtitle">
          Track, analyze and cancel with ease
        </Text>
        <Pressable
          className="onboarding-button"
          onPress={handleGetStarted}
          accessibilityRole="button"
          accessibilityLabel="Get Started"
        >
          <Text className="onboarding-button-text">Get Started</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}
