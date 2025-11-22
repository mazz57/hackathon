import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from "react-native";
import * as Location from "expo-location";
import { locationService } from "../../services/api";

export default function LocationShareButton() {
  const [loading, setLoading] = useState(false);

  const handleShareLocation = async () => {
    setLoading(true);
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        Alert.alert("Permission Denied", "Location permission is required.");
        return;
      }

      const loc = await Location.getCurrentPositionAsync({});

      await locationService.shareLocation({
        location: { lat: loc.coords.latitude, lon: loc.coords.longitude },
      });

      Alert.alert("Success", "Location shared with trusted contacts.");
    } catch (error: any) {
      console.error("Location Share Error:", error);
      Alert.alert("Error", "Failed to share location.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <TouchableOpacity
      className="bg-blue-50 p-4 rounded-2xl border border-blue-200 mb-3 flex-row items-center justify-between"
      onPress={handleShareLocation}
      disabled={loading}
    >
      <View>
        <Text className="text-lg font-semibold text-blue-700">
          Share Location
        </Text>
        <Text className="text-blue-500 text-xs mt-1">
          Send live location to contacts
        </Text>
      </View>
      {loading && <ActivityIndicator color="#3B82F6" />}
    </TouchableOpacity>
  );
}
