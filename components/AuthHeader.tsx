import LOGO from "@/assets/icons/logo.png";
import { authStyles } from "@/constants/authStyles";
import { Image, Text, View } from "react-native";

export const AuthHeader = () => (
  <View style={authStyles.logoRow}>
    <Image source={LOGO} style={authStyles.logoIcon} resizeMode="cover" />
    <View>
      <Text style={authStyles.logoName}>Recurly</Text>
      <Text style={authStyles.logoSub}>SMART BILLING</Text>
    </View>
  </View>
);
