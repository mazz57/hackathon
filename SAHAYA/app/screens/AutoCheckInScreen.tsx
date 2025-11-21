import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  ScrollView,
} from "react-native";
import * as Location from "expo-location";
import { tripService } from "../services/api";

export default function AutoCheckInScreen() {
  const [tripId, setTripId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleStartTrip = async () => {
    setLoading(true);
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        Alert.alert(
          "Permission Denied",
          "Location required for trip tracking."
        );
        return;
      }

      const loc = await Location.getCurrentPositionAsync({});

      const response = await tripService.startTrip({
        startLocation: { lat: loc.coords.latitude, lon: loc.coords.longitude },
        destination: {
          lat: loc.coords.latitude + 0.01,
          lon: loc.coords.longitude + 0.01,
        }, // Mock destination
        estimatedDuration: 30, // minutes
      });

      setTripId(response.data._id);
      Alert.alert(
        "Trip Started",
        "Your contacts will be notified if you don't check in."
      );
    } catch (error: any) {
      console.error("Start Trip Error:", error);
      Alert.alert("Error", "Failed to start trip.");
    } finally {
      setLoading(false);
    }
  };

  const handleEndTrip = async () => {
    if (!tripId) return;
    setLoading(true);
    try {
      await tripService.endTrip({ tripId });
      setTripId(null);
      Alert.alert("Trip Ended", "You have arrived safely.");
    } catch (error) {
      Alert.alert("Error", "Failed to end trip.");
    } finally {
      setLoading(false);
    }
  };

  const handleAlert = async () => {
    if (!tripId) return;
    try {
      await tripService.sendAlert({ tripId, message: "I might be in danger." });
      Alert.alert("Alert Sent", "Emergency alert sent for this trip.");
    } catch (error) {
      Alert.alert("Error", "Failed to send alert.");
    }
  };

  return (
    <View className="flex-1 bg-white p-6">
      <Text className="text-3xl font-bold text-gray-900 mb-2">
        Auto Check-In
      </Text>
      <Text className="text-gray-600 mb-8">
        Start a monitored trip. If you don't end the trip in time, an alert will
        be sent.
      </Text>

      <View className="items-center justify-center flex-1">
        {!tripId ? (
          <TouchableOpacity
            className="w-64 h-64 bg-blue-500 rounded-full items-center justify-center shadow-lg shadow-blue-300"
            onPress={handleStartTrip}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator size="large" color="white" />
            ) : (
              <>
                <Text className="text-white text-3xl font-bold">START</Text>
                <Text className="text-blue-100 mt-2">TRIP</Text>
              </>
            )}
          </TouchableOpacity>
        ) : (
          <View className="w-full space-y-4">
            <View className="bg-green-50 p-6 rounded-2xl border border-green-200 mb-4 items-center">
              <Text className="text-green-800 text-xl font-bold">
                Trip Active
              </Text>
              <Text className="text-green-600">Tracking your safety...</Text>
            </View>

            <TouchableOpacity
              className="bg-gray-900 py-4 rounded-xl items-center"
              onPress={handleEndTrip}
              disabled={loading}
            >
              <Text className="text-white font-bold text-lg">
                End Trip (I'm Safe)
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              className="bg-red-500 py-4 rounded-xl items-center"
              onPress={handleAlert}
            >
              <Text className="text-white font-bold text-lg">SEND ALERT</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </View>
  );
}
