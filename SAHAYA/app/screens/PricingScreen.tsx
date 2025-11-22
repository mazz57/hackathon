import React from "react";
import { View, Text, ScrollView, TouchableOpacity, Alert } from "react-native";
import { useNavigation } from "@react-navigation/native";

const PLANS = [
  {
    id: "basic",
    name: "Basic Protection",
    price: "$4.99",
    period: "/month",
    features: [
      "Emergency SOS",
      "Location Sharing",
      "Basic Geofencing",
      "2 Emergency Contacts",
    ],
    color: "bg-blue-500",
    recommended: false,
  },
  {
    id: "premium",
    name: "Premium Safety",
    price: "$9.99",
    period: "/month",
    features: [
      "All Basic Features",
      "Advanced Geofencing",
      "Unlimited Contacts",
      "Fake Call & Alarm",
      "24/7 Support Priority",
    ],
    color: "bg-pink-600",
    recommended: true,
  },
  {
    id: "pro",
    name: "Family Pro",
    price: "$19.99",
    period: "/month",
    features: [
      "All Premium Features",
      "Family Tracking (up to 5)",
      "Driving Safety Reports",
      "Crash Detection",
      "Offline Maps",
    ],
    color: "bg-purple-600",
    recommended: false,
  },
];

export default function PricingScreen() {
  const navigation = useNavigation();

  const handleSubscribe = (planName: string) => {
    Alert.alert(
      "Subscribe",
      `You selected the ${planName} plan. This is a dummy action.`,
      [{ text: "OK" }]
    );
  };

  return (
    <View className="flex-1 bg-gray-50">
      <ScrollView className="flex-1 p-6">
        {/* Header */}
        <View className="items-center mb-8 mt-4">
          <Text className="text-3xl font-bold text-gray-900">
            Choose Your Plan
          </Text>
          <Text className="text-gray-500 mt-2 text-center">
            Select the best protection for you and your loved ones
          </Text>
        </View>

        {/* Plans */}
        <View className="gap-6 mb-8">
          {PLANS.map((plan) => (
            <View
              key={plan.id}
              className={`bg-white rounded-2xl p-6 shadow-sm border-2 ${
                plan.recommended ? "border-pink-500" : "border-transparent"
              }`}
            >
              {plan.recommended && (
                <View className="absolute -top-4 left-0 right-0 items-center">
                  <View className="bg-pink-500 px-4 py-1 rounded-full">
                    <Text className="text-white text-xs font-bold uppercase">
                      Most Popular
                    </Text>
                  </View>
                </View>
              )}

              <View className="items-center mb-6">
                <Text className="text-xl font-bold text-gray-900">
                  {plan.name}
                </Text>
                <View className="flex-row items-baseline mt-2">
                  <Text className="text-3xl font-bold text-gray-900">
                    {plan.price}
                  </Text>
                  <Text className="text-gray-500 ml-1">{plan.period}</Text>
                </View>
              </View>

              <View className="mb-6 space-y-3">
                {plan.features.map((feature, index) => (
                  <View key={index} className="flex-row items-center">
                    <Text className="text-green-500 mr-2">✓</Text>
                    <Text className="text-gray-600">{feature}</Text>
                  </View>
                ))}
              </View>

              <TouchableOpacity
                onPress={() => handleSubscribe(plan.name)}
                className={`py-4 rounded-xl items-center ${plan.color}`}
              >
                <Text className="text-white font-bold text-lg">
                  Subscribe Now
                </Text>
              </TouchableOpacity>
            </View>
          ))}
        </View>

        <TouchableOpacity
          onPress={() => navigation.goBack()}
          className="items-center py-4 mb-8"
        >
          <Text className="text-gray-500 font-semibold">Maybe Later</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}
