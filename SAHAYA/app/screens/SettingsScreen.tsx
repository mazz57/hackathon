import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';

export default function SettingsScreen() {
  const settingsItems = [
    'Personal Information',
    'Privacy & Security',
    'Preferences',
    'Notifications',
    'Location Services',
    'Emergency Settings',
    'Support',
    'App Settings',
    'Help & Support',
    'Log Out'
  ];

  return (
    <View className="flex-1 bg-white">
      <ScrollView className="flex-1 p-6">
        <View className="space-y-2">
          {settingsItems.map((item, index) => (
            <TouchableOpacity 
              key={index}
              className="bg-gray-50 p-4 rounded-2xl border border-gray-200"
            >
              <Text className="text-gray-900 font-medium">{item}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* App Version */}
        <View className="items-center mt-8">
          <Text className="text-gray-500">SafeGuard v2.4.1</Text>
        </View>
      </ScrollView>
    </View>
  );
}