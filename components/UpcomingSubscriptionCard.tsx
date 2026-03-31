import { formatCurrency } from "@/lib/utils";
import React from "react";
import { Image, Text, View } from "react-native";

const daysLeftLabel = (n: number): string => {
  if (n <= 0) return "Overdue";
  if (n === 1) return "Due today";
  return `${n} days left`;
};

const UpcomingSubscriptionCard = ({
  name,
  price,
  daysLeft,
  icon,
  currency,
}: UpcomingSubscriptionCardProps) => {
  return (
    <View className="upcoming-card">
      <View className="upcoming-row">
        <Image source={icon} className="upcoming-icon" />
        <View>
          <Text className="upcoming-price">
            {formatCurrency(price, currency)}
          </Text>
          <Text className="upcoming-meta" numberOfLines={1}>
            {daysLeftLabel(daysLeft)}
          </Text>
        </View>
      </View>
      <Text className="upcoming-name" numberOfLines={1}>
        {name}
      </Text>
    </View>
  );
};

export default UpcomingSubscriptionCard;
