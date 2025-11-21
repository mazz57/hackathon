import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  Animated,
} from "react-native";
import * as Location from "expo-location";
import { sosService } from "../services/api";

export default function SOSButton() {
  const [loading, setLoading] = useState(false);

  const handleSOS = async () => {
    setLoading(true);
    try {
      // 1. Location Permission
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        Alert.alert(
          "Permission Denied",
          "Location access is required to send SOS."
        );
        setLoading(false);
        return;
      }

      // 2. Get Location
      const loc = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });

      // 3. Trigger SOS
      const response = await sosService.triggerSOS({
        location: { lat: loc.coords.latitude, lon: loc.coords.longitude },
        triggerType: "APP_BUTTON",
      });

      Alert.alert(
        "SOS Sent",
        `Emergency contacts notified. (${response.data.smsSent} SMS sent)`
      );
    } catch (error: any) {
      console.error("SOS Error:", error);
      Alert.alert(
        "SOS Failed",
        error.response?.data?.message || "Failed to send SOS."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <TouchableOpacity
      className="items-center mb-8"
      onPress={handleSOS}
      disabled={loading}
      activeOpacity={0.8}
    >
      <View
        className={`w-48 h-48 rounded-full items-center justify-center shadow-lg ${loading ? "bg-pink-400" : "bg-pink-500"} shadow-pink-300`}
      >
        {loading ? (
          <ActivityIndicator size="large" color="#ffffff" />
        ) : (
          <>
            <Text className="text-white text-4xl font-bold">SOS</Text>
            <Text className="text-pink-100 text-sm mt-1 font-medium">
              PRESS & HOLD
            </Text>
          </>
        )}
      </View>
      {/* Pulse Effect Ring (Visual only for now) */}
      <View className="absolute w-56 h-56 rounded-full border-4 border-pink-200 -z-10 top-[-16px]" />
    </TouchableOpacity>
  );
}
