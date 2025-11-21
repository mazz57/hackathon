import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ActivityIndicator,
  Linking,
  TouchableOpacity,
} from "react-native";
import { locationService } from "../services/api";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function LocationViewerScreen() {
  const [location, setLocation] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadLocation();
  }, []);

  const loadLocation = async () => {
    try {
      const userStr = await AsyncStorage.getItem("user");
      if (userStr) {
        const user = JSON.parse(userStr);
        const response = await locationService.getLatestLocation(user._id);
        setLocation(response.data);
      }
    } catch (error) {
      console.error("Error loading location:", error);
    } finally {
      setLoading(false);
    }
  };

  const openMaps = () => {
    if (location) {
      const url = `https://www.google.com/maps/search/?api=1&query=${location.lat},${location.lon}`;
      Linking.openURL(url);
    }
  };

  if (loading) {
    return (
      <View className="flex-1 items-center justify-center bg-white">
        <ActivityIndicator size="large" color="#EC4899" />
      </View>
    );
  }

  return (
    <View className="flex-1 bg-white p-6 items-center justify-center">
      <Text className="text-2xl font-bold text-gray-900 mb-6">
        Last Known Location
      </Text>

      {location ? (
        <View className="w-full bg-gray-50 p-6 rounded-2xl border border-gray-200 items-center">
          <Text className="text-4xl mb-4">📍</Text>
          <Text className="text-gray-600 font-medium mb-1">
            Latitude: {location.lat}
          </Text>
          <Text className="text-gray-600 font-medium mb-4">
            Longitude: {location.lon}
          </Text>
          <Text className="text-gray-400 text-xs mb-6">
            Last Updated:{" "}
            {new Date(location.updatedAt || Date.now()).toLocaleString()}
          </Text>

          <TouchableOpacity
            className="bg-blue-500 py-3 px-8 rounded-xl"
            onPress={openMaps}
          >
            <Text className="text-white font-bold">Open in Google Maps</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <Text className="text-gray-500">No location data available.</Text>
      )}
    </View>
  );
}
