import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import React, { useEffect, useRef } from "react";
import { Animated, Dimensions, Text, View } from "react-native";
import ContactsScreen from "../screens/ContactsScreen";
import HomeScreen from "../screens/HomeScreen";
import ProfileScreen from "../screens/ProfileScreen";
import SafetyScreen from "../screens/SafetyScreen";
import SettingsScreen from "../screens/SettingsScreen";

const Tab = createBottomTabNavigator();

export default function BottomTabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused }) => {
          let iconName: string = "";
          let label: string = "";

          if (route.name === "Home") {
            iconName = "🏠";
            label = "Home";
          } else if (route.name === "Contacts") {
            iconName = "👥";
            label = "Contacts";
          } else if (route.name === "Safety") {
            iconName = "🛡️";
            label = "Safety";
          } else if (route.name === "Profile") {
            iconName = "👤";
            label = "Profile";
          } else if (route.name === "Settings") {
            iconName = "⚙️";
            label = "Settings";
          }

          return (
            <TabBarIcon focused={focused} iconName={iconName} label={label} />
          );
        },
        headerShown: false,
        tabBarStyle: {
          backgroundColor: "white",
          borderTopWidth: 1,
          borderTopColor: "#f3f4f6",
          height: 80,
          paddingBottom: 20,
          paddingTop: 10,
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          elevation: 0,
        },
        tabBarShowLabel: false,
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Contacts" component={ContactsScreen} />
      <Tab.Screen name="Safety" component={SafetyScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
      <Tab.Screen name="Settings" component={SettingsScreen} />
    </Tab.Navigator>
  );
}

type TabBarIconProps = {
  focused: boolean;
  iconName: string;
  label: string;
};

const TabBarIcon = ({ focused, iconName, label }: TabBarIconProps) => {
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (focused) {
      Animated.parallel([
        Animated.spring(scaleAnim, {
          toValue: 1.2,
          friction: 3,
          tension: 40,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.spring(scaleAnim, {
          toValue: 1,
          friction: 3,
          tension: 40,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [focused]);

  return (
    <View className="flex-1 items-center justify-center">
      <Animated.View
        style={{
          transform: [{ scale: scaleAnim }],
        }}
        className={`p-3 rounded-2xl ${focused ? "bg-pink-50" : ""}`}
      >
        <Text
          className={`text-lg ${focused ? "text-pink-600" : "text-gray-400"}`}
        >
          {iconName}
        </Text>
      </Animated.View>

      <Animated.Text
        style={{
          opacity: fadeAnim,
          transform: [
            {
              translateY: fadeAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [5, 0],
              }),
            },
          ],
        }}
        className={`text-xs font-semibold mt-1 ${focused ? "text-pink-600" : "text-gray-400"}`}
      >
        {label}
      </Animated.Text>
    </View>
  );
};
