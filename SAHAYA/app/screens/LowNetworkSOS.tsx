import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from "react-native";
import * as Location from "expo-location";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { sosService } from "../../services/api";

export default function LowNetworkSOS() {
  const [loading, setLoading] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    loadUser();
  }, []);

  const loadUser = async () => {
    const userStr = await AsyncStorage.getItem("user");
    if (userStr) {
      const user = JSON.parse(userStr);
      setUserId(user._id);
    }
  };

  const sendLowNetworkSOS = async () => {
    if (!userId) {
      Alert.alert("Error", "User not found. Please log in again.");
      return;
    }

    setLoading(true);
    try {
      // 1. Location Permission
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        Alert.alert(
          "Permission Denied",
          "Location access is required to send SOS."
        );
        setLoading(false);
        return;
      }

      // 2. Get current location
      const loc = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Low,
      });

      const lat = loc.coords.latitude;
      const lon = loc.coords.longitude;

      // 3. Payload for backend
      const payload = {
        userId,
        location: { lat, lon },
        triggerType: "LOW_NETWORK",
      };

      // 4. Call backend
      const response = await sosService.smsTrigger(payload);

      Alert.alert(
        "Low-Network SOS Sent",
        `SMS alerts delivered to ${response.data.results.length} contacts.`
      );
    } catch (error: any) {
      console.log("LOW NETWORK SOS ERROR:", error?.response?.data || error);
      Alert.alert(
        "SOS Failed",
        error?.response?.data?.message || "Could not send SMS fallback SOS."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <View className="flex-1 bg-white p-6 items-center justify-center">
      <Text className="text-3xl font-bold text-gray-900 mt-4">
        Low-Network SOS
      </Text>

      <Text className="text-lg text-gray-600 text-center mt-3 mb-10">
        If internet is weak or unavailable, press below to send
        <Text className="text-red-500 font-semibold"> SMS-based SOS alert</Text>
        .
      </Text>

      <TouchableOpacity
        className="bg-red-500 py-4 px-8 rounded-2xl shadow-lg w-full items-center"
        onPress={sendLowNetworkSOS}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text className="text-white text-xl font-bold">SEND SMS SOS</Text>
        )}
      </TouchableOpacity>
    </View>
  );
}
