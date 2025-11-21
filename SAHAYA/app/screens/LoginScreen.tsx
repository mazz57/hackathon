import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Animated,
  Easing,
  Dimensions,
  Image,
  Alert,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { authService } from "../services/api";
import AsyncStorage from "@react-native-async-storage/async-storage";

const { width, height } = Dimensions.get("window");

export default function LoginScreen() {
  const navigation = useNavigation<any>();
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  // Animation values
  const fadeAnim = useState(new Animated.Value(0))[0];
  const slideUpAnim = useState(new Animated.Value(30))[0];
  const logoScale = useState(new Animated.Value(0.8))[0];
  const buttonScale = useState(new Animated.Value(1))[0];
  const imageScale = useState(new Animated.Value(0.5))[0];
  const imageRotate = useState(new Animated.Value(0))[0];

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(slideUpAnim, {
        toValue: 0,
        duration: 600,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.spring(logoScale, {
        toValue: 1,
        friction: 4,
        tension: 40,
        useNativeDriver: true,
      }),
      Animated.spring(imageScale, {
        toValue: 1,
        friction: 5,
        tension: 40,
        useNativeDriver: true,
      }),
      Animated.timing(imageRotate, {
        toValue: 1,
        duration: 1000,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const handleLogin = async () => {
    if (!phone || !password) {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }

    setLoading(true);
    try {
      const response = await authService.login({ phone, password });

      if (response.data && response.data.token) {
        await AsyncStorage.setItem("token", response.data.token);
        await AsyncStorage.setItem("user", JSON.stringify(response.data));
        navigation.navigate("Main");
      } else {
        Alert.alert("Error", "Login failed. Please try again.");
      }
    } catch (error: any) {
      console.error(error);
      Alert.alert(
        "Login Failed",
        error.response?.data?.message || "Something went wrong"
      );
    } finally {
      setLoading(false);
    }
  };

  const rotateInterpolate = imageRotate.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "360deg"],
  });

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      className="flex-1 bg-white"
    >
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        className="flex-1"
        showsVerticalScrollIndicator={false}
      >
        <View className="flex-1 justify-center p-8 bg-gradient-to-b from-white to-pink-50">
          <View className="justify-center items-center">
            <Animated.View
              className="items-center mb-4"
              style={{
                opacity: fadeAnim,
                transform: [
                  { scale: imageScale },
                  { rotate: rotateInterpolate },
                ],
              }}
            >
              <View className="w-32 h-32 rounded-3xl items-center justify-center">
                {/* Placeholder for Logo */}
                <View className="w-24 h-24 bg-pink-500 rounded-full items-center justify-center">
                  <Text className="text-white text-4xl font-bold">S</Text>
                </View>
              </View>
            </Animated.View>
          </View>

          <Animated.View
            className="items-center mb-2"
            style={{
              opacity: fadeAnim,
              transform: [{ translateY: slideUpAnim }],
            }}
          >
            <Text className="text-4xl font-black text-pink-500 text-center mb-1">
              SAHAYA
            </Text>
            <Text className="text-lg text-gray-500 text-center font-medium">
              Safety & Protection
            </Text>
          </Animated.View>

          <Animated.View
            className="items-center mb-8"
            style={{
              opacity: fadeAnim,
              transform: [{ translateY: slideUpAnim }],
            }}
          >
            <Text className="text-lg text-gray-600 text-center">
              Welcome back! Sign in to continue
            </Text>
          </Animated.View>

          <Animated.View
            className="mb-4"
            style={{
              opacity: fadeAnim,
              transform: [{ translateY: slideUpAnim }],
            }}
          >
            <View className="mb-4">
              <Text className="text-gray-700 text-sm font-semibold mb-3 ml-1">
                Phone Number
              </Text>
              <TextInput
                className="w-full bg-white border-2 border-pink-100 rounded-2xl px-6 py-5 text-lg shadow-sm focus:border-pink-300"
                placeholder="Enter your phone number"
                value={phone}
                onChangeText={setPhone}
                keyboardType="phone-pad"
                placeholderTextColor="#9CA3AF"
              />
            </View>

            <View className="mb-6">
              <Text className="text-gray-700 text-sm font-semibold mb-3 ml-1">
                Password
              </Text>
              <TextInput
                className="w-full bg-white border-2 border-pink-100 rounded-2xl px-6 py-5 text-lg shadow-sm focus:border-pink-300"
                placeholder="Enter your password"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                placeholderTextColor="#9CA3AF"
              />
            </View>

            <TouchableOpacity
              className="w-full bg-pink-500 rounded-2xl py-5 shadow-lg shadow-pink-300 mb-6 active:bg-pink-600"
              onPress={handleLogin}
              disabled={loading}
            >
              <Text className="text-white text-center font-bold text-xl">
                {loading ? "Logging in..." : "Login"}
              </Text>
            </TouchableOpacity>

            <View className="flex-row justify-center items-center">
              <Text className="text-gray-500 text-lg">
                Don't have an account?{" "}
              </Text>
              <TouchableOpacity onPress={() => navigation.navigate("SignUp")}>
                <Text className="text-pink-600 font-bold text-lg">Sign Up</Text>
              </TouchableOpacity>
            </View>
          </Animated.View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
