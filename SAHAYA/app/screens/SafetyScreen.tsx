import React from "react";
import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";

export default function SafetyScreen() {
  const navigation = useNavigation<any>();

  return (
    <View className="flex-1 bg-white">
      <ScrollView className="flex-1 p-6">
        {/* Header */}
        <View className="mb-6">
          <Text className="text-3xl font-bold text-gray-900">Safety Tools</Text>
          <Text className="text-lg text-gray-600 mt-2">
            Features to help you stay protected
          </Text>
        </View>

        <View className="h-px bg-gray-200 my-4" />

        {/* Low Network SOS */}
        <FeatureCard
          title="Low-Network SOS"
          description="Send an SMS-based emergency alert when internet is weak"
          onPress={() => navigation.navigate("LowNetworkSOS")}
        />

        {/* Geo-Fencing */}
        <FeatureCard
          title="Geo-Fencing"
          description="Mark safe or risky areas and get entry/exit alerts"
          onPress={() => navigation.navigate("Geofence")}
        />

        {/* Safe Route */}
        <FeatureCard
          title="Safe Route"
          description="Find the safest route to your destination"
          onPress={() => navigation.navigate("SafeRoute")}
        />

        {/* Trusted Contacts */}
        <FeatureCard
          title="Trusted Contacts"
          description="Manage the people notified during emergencies"
          onPress={() => navigation.navigate("Contacts")}
        />

        {/* Auto CheckIn */}
        <FeatureCard
          title="Auto-CheckIn"
          description="Notifies contacts if you miss check-in"
          onPress={() => navigation.navigate("AutoCheckIn")}
        />

        {/* Location Viewer */}
        <FeatureCard
          title="Last Known Location"
          description="View the last location sent to the server"
          onPress={() => navigation.navigate("LocationViewer")}
        />
      </ScrollView>
    </View>
  );
}

function FeatureCard({
  title,
  description,
  onPress,
}: {
  title: string;
  description: string;
  onPress: () => void;
}) {
  return (
    <TouchableOpacity
      onPress={onPress}
      className="bg-white rounded-2xl border border-gray-200 p-4 mb-4 shadow-sm"
    >
      <Text className="text-xl font-semibold text-gray-900">{title}</Text>
      <Text className="text-gray-600 mt-2">{description}</Text>
    </TouchableOpacity>
  );
}
