import LOGO from "@/assets/icons/logo.png";
import { Image, Text, View } from "react-native";

export const AuthHeader = () => (
  <View className="auth-logo-wrap">
    <Image
      source={LOGO}
      className="auth-logo-icon"
      resizeMode="cover"
      accessibilityLabel="Recurly logo"
    />
    <View>
      <Text className="auth-wordmark">Recurly</Text>
      <Text className="auth-wordmark-sub">SMART BILLING</Text>
    </View>
  </View>
);
