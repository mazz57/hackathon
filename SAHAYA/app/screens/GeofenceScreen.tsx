import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  ScrollView,
  RefreshControl,
  TextInput,
} from "react-native";
import * as Location from "expo-location";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { geofenceService } from "../../services/api";
import { startGeofenceWatcher } from "../../utils/GeofenceWatcher";

export default function GeofenceScreen() {
  const [geofences, setGeofences] = useState<any[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [fenceName, setFenceName] = useState("");
  const [loading, setLoading] = useState(false);
  const [radius, setRadius] = useState("100");

  useEffect(() => {
    loadUserAndGeofences();
    // Start background watcher when screen loads (or ensure it's running)
    startGeofenceWatcher();
  }, []);

  const loadUserAndGeofences = async () => {
    try {
      const userStr = await AsyncStorage.getItem("user");
      if (userStr) {
        const user = JSON.parse(userStr);
        setUserId(user._id);
        fetchGeofences(user._id);
      }
    } catch (error) {
      console.error("Error loading user:", error);
    }
  };

  const fetchGeofences = async (id: string) => {
    try {
      const response = await geofenceService.getGeofences(id);
      setGeofences(response.data);
    } catch (error) {
      console.error("Error fetching geofences:", error);
    }
  };

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    if (userId) {
      fetchGeofences(userId).finally(() => setRefreshing(false));
    } else {
      setRefreshing(false);
    }
  }, [userId]);

  const createGeofence = async () => {
    if (!fenceName) {
      Alert.alert(
        "Error",
        "Please enter a name for this location (e.g., Home)"
      );
      return;
    }

    setLoading(true);
    try {
      // 1. Permission
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        Alert.alert("Permission Denied", "Location access is required.");
        setLoading(false);
        return;
      }

      // 2. Get Location
      const loc = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });

      // 3. Create Polygon (Simple square for now around the point)
      // In a real app, you might want a circular radius logic handled by backend
      // or generate a polygon based on radius.
      // For this implementation, we'll send the center point and let backend handle or store as is.
      // Assuming backend expects a 'polygon' array of points.
      // We will create a small box around the user for the "polygon" if backend requires it,
      // OR if backend supports radius, we send that.
      // Based on previous context, backend takes 'polygon'.
      // Let's create a simple 4-point polygon approx 'radius' meters around.

      const lat = loc.coords.latitude;
      const lon = loc.coords.longitude;
      const r = parseInt(radius) / 111320; // approx degrees

      const polygon = [
        { lat: lat - r, lon: lon - r },
        { lat: lat + r, lon: lon - r },
        { lat: lat + r, lon: lon + r },
        { lat: lat - r, lon: lon + r },
        { lat: lat - r, lon: lon - r }, // Close loop
      ];

      const payload = {
        userId,
        name: fenceName,
        polygon,
        // If backend supports saving center/radius, add it here too
        center: { lat, lon },
        radius: parseInt(radius),
      };

      await geofenceService.createGeofence(payload);

      Alert.alert("Success", "Geofence created successfully!");
      setFenceName("");
      if (userId) fetchGeofences(userId);
    } catch (error: any) {
      console.error("Create Geofence Error:", error);
      Alert.alert(
        "Error",
        error.response?.data?.message || "Failed to create geofence."
      );
    } finally {
      setLoading(false);
    }
  };

  const deleteGeofence = async (id: string) => {
    Alert.alert(
      "Delete Geofence",
      "Are you sure you want to delete this safe zone?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              // Assuming api has a delete endpoint. If not, we need to add it.
              // Checking api.ts... it doesn't have deleteGeofence.
              // We will assume it exists or add it.
              // Wait, the prompt asked to add delete button (DELETE /geofence/:id).
              // I need to update api.ts first or use a direct call if not there.
              // I will update api.ts in the next step.
              await geofenceService.deleteGeofence(id);
              if (userId) fetchGeofences(userId);
            } catch (error) {
              console.error("Delete error:", error);
              Alert.alert("Error", "Failed to delete geofence.");
            }
          },
        },
      ]
    );
  };

  return (
    <View className="flex-1 bg-white">
      <ScrollView
        className="flex-1 p-6"
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <View className="mb-6">
          <Text className="text-3xl font-bold text-gray-900">Safe Zones</Text>
          <Text className="text-gray-500 mt-1">
            Get notified when you enter or leave these areas.
          </Text>
        </View>

        {/* Create Section */}
        <View className="bg-pink-50 p-5 rounded-2xl border border-pink-100 mb-8">
          <Text className="text-lg font-semibold text-pink-700 mb-4">
            Add Current Location
          </Text>

          <Text className="text-gray-700 text-sm font-medium mb-2 ml-1">
            Name (e.g., Home, Office)
          </Text>
          <TextInput
            className="bg-white p-3 rounded-xl border border-pink-200 mb-4"
            placeholder="Enter location name"
            value={fenceName}
            onChangeText={setFenceName}
          />

          <Text className="text-gray-700 text-sm font-medium mb-2 ml-1">
            Radius (meters)
          </Text>
          <TextInput
            className="bg-white p-3 rounded-xl border border-pink-200 mb-4"
            placeholder="100"
            keyboardType="numeric"
            value={radius}
            onChangeText={setRadius}
          />

          <TouchableOpacity
            className="bg-pink-500 py-3 rounded-xl items-center shadow-sm"
            onPress={createGeofence}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="white" />
            ) : (
              <Text className="text-white font-bold text-lg">
                Save Safe Zone
              </Text>
            )}
          </TouchableOpacity>
        </View>

        {/* List Section */}
        <Text className="text-xl font-bold text-gray-900 mb-4">
          Your Places
        </Text>

        {geofences.length === 0 ? (
          <View className="items-center py-10">
            <Text className="text-gray-400">No safe zones created yet.</Text>
          </View>
        ) : (
          <View className="pb-10">
            {geofences.map((fence) => (
              <View
                key={fence._id}
                className="bg-white border border-gray-100 rounded-2xl p-4 mb-3 shadow-sm flex-row justify-between items-center"
              >
                <View>
                  <Text className="text-lg font-semibold text-gray-800">
                    {fence.name}
                  </Text>
                  <Text className="text-gray-500 text-xs mt-1">
                    Created: {new Date(fence.createdAt).toLocaleDateString()}
                  </Text>
                </View>
                <TouchableOpacity
                  onPress={() => deleteGeofence(fence._id)}
                  className="bg-gray-50 p-2 rounded-lg"
                >
                  <Text className="text-red-500 font-medium text-xs">
                    Delete
                  </Text>
                </TouchableOpacity>
              </View>
            ))}
          </View>
        )}
      </ScrollView>
    </View>
  );
}
