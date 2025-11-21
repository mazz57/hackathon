import React from "react";
import { View, Text, ScrollView } from "react-native";
import SOSButton from "../components/SOSButton";
import LocationShareButton from "../components/LocationShareButton";
import { QuickActionCard, StatusCard } from "../components/HomeComponents";

export default function HomeScreen() {
  return (
    <View className="flex-1 bg-white">
      <ScrollView className="flex-1 p-6">
        {/* Header */}
        <View className="items-center mb-8">
          <Text className="text-3xl font-bold text-pink-600">
            Emergency SOS
          </Text>
          <Text className="text-lg text-pink-400 mt-2">Press & Hold</Text>
        </View>

        {/* SOS Button Component */}
        <SOSButton />

        {/* Quick Actions */}
        <View className="mb-8">
          <Text className="text-xl font-semibold text-pink-600 mb-4">
            Quick Actions
          </Text>

          <LocationShareButton />

          <View className="flex-row flex-wrap justify-between">
            <QuickActionCard
              icon="📞"
              title="Fake Call"
              subtitle="Simulate call"
              color="#3B82F6"
              delay={100}
            />
            <QuickActionCard
              icon="📢"
              title="Loud Alarm"
              subtitle="Siren"
              color="#EF4444"
              delay={200}
            />
            <QuickActionCard
              icon="🛡️"
              title="Safety Status"
              subtitle="Check status"
              color="#10B981"
              delay={300}
            />
          </View>
        </View>

        {/* Status Card */}
        <View className="flex-row justify-between">
          <StatusCard
            icon="🛡️"
            title="System Status"
            value="Protected"
            status="active"
          />
          <StatusCard
            icon="📡"
            title="GPS Signal"
            value="Strong"
            status="active"
          />
        </View>
      </ScrollView>
    </View>
  );
}
