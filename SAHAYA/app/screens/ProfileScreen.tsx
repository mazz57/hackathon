import React, { useState, useEffect } from "react";
import { View, Text, ScrollView, TouchableOpacity, Alert } from "react-native";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function ProfileScreen() {
  const navigation = useNavigation<any>();
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    loadUser();
  }, []);

  const loadUser = async () => {
    try {
      const userStr = await AsyncStorage.getItem("user");
      if (userStr) {
        setUser(JSON.parse(userStr));
      }
    } catch (error) {
      console.error("Error loading user:", error);
    }
  };

  const handleLogout = async () => {
    Alert.alert("Logout", "Are you sure you want to logout?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Logout",
        style: "destructive",
        onPress: async () => {
          await AsyncStorage.clear();
          navigation.reset({
            index: 0,
            routes: [{ name: "Login" }],
          });
        },
      },
    ]);
  };

  return (
    <View className="flex-1 bg-white">
      <ScrollView className="flex-1 p-6">
        {/* Profile Header */}
        <View className="items-center mb-8">
          <View className="w-20 h-20 bg-pink-500 rounded-full items-center justify-center mb-4">
            <Text className="text-white text-2xl font-bold">
              {user?.name ? user.name.charAt(0).toUpperCase() : "U"}
            </Text>
          </View>
          <Text className="text-2xl font-bold text-gray-900">
            {user?.name || "User"}
          </Text>
          <Text className="text-gray-600 mt-1">
            {user?.phone || "No phone number"}
          </Text>
          <View className="bg-yellow-100 px-3 py-1 rounded-full mt-2">
            <Text className="text-yellow-800 font-semibold">Protected</Text>
          </View>
        </View>

        {/* Menu Items */}
        <View className="mb-6">
          <Text className="text-lg font-semibold text-gray-900 mb-4">
            Account
          </Text>
          <View className="space-y-2">
            <TouchableOpacity className="bg-gray-50 p-4 rounded-2xl border border-gray-200 mb-2">
              <Text className="text-gray-900 font-medium">
                Personal Information
              </Text>
            </TouchableOpacity>
            <TouchableOpacity className="bg-gray-50 p-4 rounded-2xl border border-gray-200 mb-2">
              <Text className="text-gray-900 font-medium">
                Privacy & Security
              </Text>
            </TouchableOpacity>
            <TouchableOpacity className="bg-gray-50 p-4 rounded-2xl border border-gray-200 mb-2">
              <Text className="text-gray-900 font-medium">
                Emergency Settings
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Logout Button */}
        <TouchableOpacity
          className="bg-red-50 p-4 rounded-2xl border border-red-100 mb-6 items-center"
          onPress={handleLogout}
        >
          <Text className="text-red-600 font-bold">Logout</Text>
        </TouchableOpacity>

        {/* App Version */}
        <View className="items-center mt-4">
          <Text className="text-gray-500">Sahaya v1.0.0</Text>
        </View>
      </ScrollView>
    </View>
  );
}
