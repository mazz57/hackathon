import React from "react";
import { View, Text } from "react-native";

export default function SafeRouteScreen() {
  return (
    <View className="flex-1 bg-white items-center justify-center p-6">
      <View className="w-20 h-20 bg-gray-100 rounded-full items-center justify-center mb-4">
        <Text className="text-4xl">🗺️</Text>
      </View>
      <Text className="text-2xl font-bold text-gray-900 mb-2">Safe Route</Text>
      <Text className="text-gray-500 text-center">
        This feature is coming soon. It will help you find the safest path to
        your destination based on crowd-sourced safety data.
      </Text>
    </View>
  );
}
