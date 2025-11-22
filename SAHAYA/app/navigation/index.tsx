import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import BottomTabNavigator from "./BottomTabNavigator";
import LoginScreen from "../screens/LoginScreen";
import SignUpScreen from "../screens/SignUpScreen";
import LowNetworkSOS from "../screens/LowNetworkSOS";
import GeofenceScreen from "../screens/GeofenceScreen";
import AutoCheckInScreen from "../screens/AutoCheckInScreen";
import SafeRouteScreen from "../screens/SafeRouteScreen";
import LocationViewerScreen from "../screens/LocationViewerScreen";
import PricingScreen from "../screens/PricingScreen";

const Stack = createNativeStackNavigator();

export default function RootNavigator() {
  return (
    <Stack.Navigator
      initialRouteName="Login"
      screenOptions={{ headerShown: false }}
    >
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="SignUp" component={SignUpScreen} />
      <Stack.Screen name="Main" component={BottomTabNavigator} />
      <Stack.Screen name="LowNetworkSOS" component={LowNetworkSOS} />
      <Stack.Screen name="Geofence" component={GeofenceScreen} />
      <Stack.Screen name="AutoCheckIn" component={AutoCheckInScreen} />
      <Stack.Screen name="SafeRoute" component={SafeRouteScreen} />
      <Stack.Screen name="LocationViewer" component={LocationViewerScreen} />
      <Stack.Screen name="Pricing" component={PricingScreen} />
    </Stack.Navigator>
  );
}
