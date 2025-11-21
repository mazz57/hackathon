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
  Alert,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { authService } from "../services/api";
import AsyncStorage from "@react-native-async-storage/async-storage";

const { width, height } = Dimensions.get("window");

export default function SignUpScreen() {
  const navigation = useNavigation<any>();

  type FormData = {
    fullName: string;
    phone: string;
    password: string;
    confirmPassword: string;
  };

  const [formData, setFormData] = useState<FormData>({
    fullName: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);

  // Animation values
  const fadeAnim = useState(new Animated.Value(0))[0];
  const slideUpAnim = useState(new Animated.Value(30))[0];
  const logoScale = useState(new Animated.Value(0.8))[0];
  const buttonScale = useState(new Animated.Value(1))[0];

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
    ]).start();
  }, []);

  const handleSignUp = async () => {
    const { fullName, phone, password, confirmPassword } = formData;

    if (!fullName || !phone || !password || !confirmPassword) {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert("Error", "Passwords do not match");
      return;
    }

    setLoading(true);
    try {
      const response = await authService.register({
        name: fullName,
        phone,
        password,
      });

      if (response.data && response.data.token) {
        await AsyncStorage.setItem("token", response.data.token);
        await AsyncStorage.setItem("user", JSON.stringify(response.data));
        Alert.alert("Success", "Account created successfully!", [
          { text: "OK", onPress: () => navigation.navigate("Main") },
        ]);
      } else {
        Alert.alert("Error", "Registration failed. Please try again.");
      }
    } catch (error: any) {
      console.error(error);
      Alert.alert(
        "Registration Failed",
        error.response?.data?.message || "Something went wrong"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: keyof FormData, value: string): void => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

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
          <Animated.View
            className="items-center mb-8"
            style={{
              opacity: fadeAnim,
              transform: [{ translateY: slideUpAnim }, { scale: logoScale }],
            }}
          >
            <Text className="text-4xl font-bold text-pink-500 mb-4 text-center">
              Create Account
            </Text>
            <Text className="text-lg text-gray-600 text-center">
              Join Sahaya to protect yourself and your loved ones
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
              <Text className="text-gray-700 text-sm font-medium mb-2 ml-1">
                Full Name
              </Text>
              <TextInput
                className="w-full bg-white border-2 border-pink-100 rounded-2xl px-6 py-4 text-lg shadow-sm"
                placeholder="Enter your full name"
                value={formData.fullName}
                onChangeText={(value) => handleInputChange("fullName", value)}
                placeholderTextColor="#9CA3AF"
              />
            </View>

            <View className="mb-4">
              <Text className="text-gray-700 text-sm font-medium mb-2 ml-1">
                Phone Number
              </Text>
              <TextInput
                className="w-full bg-white border-2 border-pink-100 rounded-2xl px-6 py-4 text-lg shadow-sm"
                placeholder="Enter your phone number"
                keyboardType="phone-pad"
                value={formData.phone}
                onChangeText={(value) => handleInputChange("phone", value)}
                placeholderTextColor="#9CA3AF"
              />
            </View>

            <View className="mb-4">
              <Text className="text-gray-700 text-sm font-medium mb-2 ml-1">
                Password
              </Text>
              <TextInput
                className="w-full bg-white border-2 border-pink-100 rounded-2xl px-6 py-4 text-lg shadow-sm"
                placeholder="Create a password"
                value={formData.password}
                onChangeText={(value) => handleInputChange("password", value)}
                secureTextEntry
                placeholderTextColor="#9CA3AF"
              />
            </View>

            <View className="mb-8">
              <Text className="text-gray-700 text-sm font-medium mb-2 ml-1">
                Confirm Password
              </Text>
              <TextInput
                className="w-full bg-white border-2 border-pink-100 rounded-2xl px-6 py-4 text-lg shadow-sm"
                placeholder="Confirm your password"
                value={formData.confirmPassword}
                onChangeText={(value) =>
                  handleInputChange("confirmPassword", value)
                }
                secureTextEntry
                placeholderTextColor="#9CA3AF"
              />
            </View>

            <TouchableOpacity
              className="w-full bg-pink-500 rounded-2xl py-5 shadow-lg shadow-pink-300 mb-6"
              onPress={handleSignUp}
              disabled={loading}
            >
              <Text className="text-white text-center font-bold text-xl">
                {loading ? "Creating Account..." : "Sign Up"}
              </Text>
            </TouchableOpacity>

            <View className="flex-row justify-center items-center">
              <Text className="text-gray-500 text-lg">
                Already have an account?{" "}
              </Text>
              <TouchableOpacity onPress={() => navigation.navigate("Login")}>
                <Text className="text-pink-600 font-bold text-lg">Login</Text>
              </TouchableOpacity>
            </View>
          </Animated.View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
