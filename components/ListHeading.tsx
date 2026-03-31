import React from "react";
import { Pressable, Text, View } from "react-native";

const ListHeading = ({ title, onPress }: ListHeadingProps) => {
  return (
    <View className="list-head">
      <Text className="list-title">{title}</Text>
      {onPress ? (
        <Pressable
          className="list-action"
          onPress={onPress}
          accessibilityRole="button"
          accessibilityLabel={`See all ${title}`}
        >
          <Text className="list-action-text">See All</Text>
        </Pressable>
      ) : null}
    </View>
  );
};

export default ListHeading;
