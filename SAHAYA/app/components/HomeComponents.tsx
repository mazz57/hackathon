import React, { useEffect, useRef } from "react";
import { View, Text, TouchableOpacity, Animated } from "react-native";

/* ============ Quick Action Cards ============ */
export function QuickActionCard({ icon, title, subtitle, color, delay }: any) {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;

  useEffect(() => {
    const timer = setTimeout(() => {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.spring(scaleAnim, {
          toValue: 1,
          friction: 4,
          tension: 40,
          useNativeDriver: true,
        }),
      ]).start();
    }, delay);

    return () => clearTimeout(timer);
  }, [delay]);

  return (
    <Animated.View
      style={{
        opacity: fadeAnim,
        transform: [{ scale: scaleAnim }],
      }}
      className="w-[48%] mb-4"
    >
      <TouchableOpacity
        className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 active:scale-95"
        activeOpacity={0.8}
      >
        <View
          className="w-12 h-12 rounded-xl items-center justify-center mb-3"
          style={{ backgroundColor: color + "20" }}
        >
          <Text className="text-xl">{icon}</Text>
        </View>
        <Text className="font-semibold text-gray-900 text-base">{title}</Text>
        <Text className="text-gray-500 text-xs mt-1">{subtitle}</Text>
      </TouchableOpacity>
    </Animated.View>
  );
}

/* ============ Safety Features ============ */
export function SafetyFeature({ icon, title, status, delay }: any) {
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const timer = setTimeout(() => {
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }).start();
    }, delay);

    return () => clearTimeout(timer);
  }, [delay]);

  return (
    <Animated.View
      style={{
        opacity: fadeAnim,
      }}
      className="w-[48%] mb-4"
    >
      <View className="flex-row items-center">
        <View className="w-10 h-10 bg-pink-100 rounded-xl items-center justify-center mr-3">
          <Text className="text-lg">{icon}</Text>
        </View>
        <View className="flex-1">
          <Text className="font-medium text-gray-900 text-sm">{title}</Text>
          <Text className="text-gray-500 text-xs">{status}</Text>
        </View>
      </View>
    </Animated.View>
  );
}

/* ============ Contact List Items ============ */
export function ContactItem({ name, relationship, status }: any) {
  const statusColor = status === "available" ? "bg-green-500" : "bg-yellow-500";

  return (
    <View className="flex-row items-center py-3 border-b border-gray-100 last:border-b-0">
      <View className="w-12 h-12 bg-pink-100 rounded-2xl items-center justify-center mr-3">
        <Text className="text-pink-600 font-semibold text-lg">
          {name.charAt(0)}
        </Text>
      </View>
      <View className="flex-1">
        <Text className="font-semibold text-gray-900">{name}</Text>
        <Text className="text-gray-500 text-sm">{relationship}</Text>
      </View>
      <View className="flex-row items-center">
        <View className={`w-2 h-2 rounded-full ${statusColor} mr-2`} />
        <Text className="text-gray-400 text-xs capitalize">{status}</Text>
      </View>
    </View>
  );
}

/* ============ Add Contact Button ============ */
export function AddContactButton() {
  return (
    <TouchableOpacity className="flex-row items-center justify-center py-3">
      <View className="w-10 h-10 bg-gray-100 rounded-full items-center justify-center mr-3">
        <Text className="text-gray-400 text-lg">+</Text>
      </View>
      <Text className="text-pink-500 font-medium">Add Emergency Contact</Text>
    </TouchableOpacity>
  );
}

/* ============ Status Cards ============ */
export function StatusCard({ title, value, status, icon }: any) {
  const statusColor =
    status === "active"
      ? "bg-green-500"
      : status === "warning"
        ? "bg-yellow-500"
        : "bg-red-500";

  return (
    <View className="w-[48%]">
      <View className="bg-white p-4 rounded-2xl shadow-sm">
        <View className="flex-row justify-between items-start mb-2">
          <Text className="text-2xl">{icon}</Text>
          <View className={`w-2 h-2 rounded-full ${statusColor}`} />
        </View>
        <Text className="text-gray-900 font-semibold text-sm">{title}</Text>
        <Text className="text-gray-600 text-xs mt-1">{value}</Text>
      </View>
    </View>
  );
}

// Default export to satisfy Expo Router
export default function HomeComponents() {
  return null;
}
