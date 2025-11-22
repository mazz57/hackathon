import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  StyleSheet,
} from "react-native";
import * as Location from "expo-location";
import { tripService } from "../../services/api";
import LeafletMap from "../components/LeafletMap";

// Helper to calculate distance (Haversine formula)
const calculateDistance = (
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
) => {
  const R = 6371; // Radius of the earth in km
  const dLat = deg2rad(lat2 - lat1);
  const dLon = deg2rad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(lat1)) *
      Math.cos(deg2rad(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const d = R * c; // Distance in km
  return d;
};

const deg2rad = (deg: number) => {
  return deg * (Math.PI / 180);
};

export default function SafeRouteScreen() {
  const [loading, setLoading] = useState(false);
  const [tripId, setTripId] = useState<string | null>(null);
  const [isDeviated, setIsDeviated] = useState(false);
  const [distance, setDistance] = useState("0.00");
  const [duration, setDuration] = useState("0");
  const [step, setStep] = useState<"setup" | "tracking">("setup");

  const tripIdRef = useRef<string | null>(null);
  const startTime = useRef<number>(0);
  const locationSubscription = useRef<Location.LocationSubscription | null>(
    null
  );

  const [pointA, setPointA] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);
  const [pointB, setPointB] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);

  const [currentLocation, setCurrentLocation] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);

  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        Alert.alert("Permission Denied", "Location permission is required.");
        return;
      }
      const loc = await Location.getCurrentPositionAsync({});
      setCurrentLocation({
        latitude: loc.coords.latitude,
        longitude: loc.coords.longitude,
      });
    })();

    // Cleanup on unmount
    return () => {
      if (locationSubscription.current) {
        locationSubscription.current.remove();
      }
    };
  }, []);

  const getCurrentLocation = async () => {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Permission Denied", "Location permission is required.");
      return null;
    }
    const loc = await Location.getCurrentPositionAsync({});
    return loc.coords;
  };

  const handleSetPointA = async () => {
    const coords = await getCurrentLocation();
    if (coords) {
      setPointA({ latitude: coords.latitude, longitude: coords.longitude });
      Alert.alert("Point A Set", "Current location set as Start.");
    }
  };

  const handleSetPointB = async () => {
    const coords = await getCurrentLocation();
    if (coords) {
      // Mocking a destination 1km away for testing
      setPointB({
        latitude: coords.latitude + 0.01,
        longitude: coords.longitude + 0.01,
      });
      Alert.alert("Point B Set", "Destination set (mocked 1km away).");
    }
  };

  const generateRoutePoints = () => {
    if (!pointA || !pointB) return [];
    return [
      { lat: pointA.latitude, lon: pointA.longitude },
      { lat: pointB.latitude, lon: pointB.longitude },
    ];
  };

  const startTracking = async () => {
    if (!pointA || !pointB) {
      Alert.alert(
        "Missing Points",
        "Please set both Point A (Start) and Point B (Destination)"
      );
      return;
    }
    setLoading(true);
    try {
      const routePoints = generateRoutePoints();
      const response = await tripService.startTrip({
        startLocation: { lat: pointA.latitude, lon: pointA.longitude },
        destination: "Destination",
        estimatedDuration: 30,
        routePath: routePoints,
      });

      const id = response.data._id || response.data.id;
      setTripId(id);
      tripIdRef.current = id;
      setStep("tracking");
      startTime.current = Date.now();

      locationSubscription.current = await Location.watchPositionAsync(
        {
          accuracy: Location.Accuracy.High,
          timeInterval: 3000,
          distanceInterval: 10,
        },
        async (location) => {
          try {
            const { latitude, longitude } = location.coords;
            setCurrentLocation({ latitude, longitude });

            const currentTripId = tripIdRef.current;
            if (!currentTripId) {
              return;
            }

            const updateRes = await tripService.updateLocation({
              tripId: currentTripId,
              latitude,
              longitude,
            });

            if (updateRes.data.isDeviated && !isDeviated) {
              setIsDeviated(true);
              Alert.alert(
                "⚠️ ROUTE DEVIATION",
                "You have left your safe route!\nEmergency contacts notified.",
                [{ text: "OK" }]
              );
            } else if (!updateRes.data.isDeviated && isDeviated) {
              setIsDeviated(false);
            }

            const dist = calculateDistance(
              pointA.latitude,
              pointA.longitude,
              latitude,
              longitude
            );
            setDistance(dist.toFixed(2));
            setDuration(
              Math.floor((Date.now() - startTime.current) / 60000).toString()
            );
          } catch (error) {
            console.error("Location update error:", error);
          }
        }
      );
    } catch (error: any) {
      Alert.alert("Error", error.message || "Failed to start tracking");
      setStep("setup");
    } finally {
      setLoading(false);
    }
  };

  const stopTracking = async () => {
    if (locationSubscription.current) {
      locationSubscription.current.remove();
      locationSubscription.current = null;
    }
    if (tripId) {
      try {
        await tripService.endTrip({ tripId });
        Alert.alert("Trip Ended", "You have arrived safely.");
      } catch (error) {
        console.error(error);
      }
    }
    setTripId(null);
    tripIdRef.current = null;
    setStep("setup");
    setIsDeviated(false);
    setDistance("0.00");
    setDuration("0");
  };

  // Prepare markers for the map
  const markers = [];
  if (pointA) {
    markers.push({
      latitude: pointA.latitude,
      longitude: pointA.longitude,
      title: "Start",
      color: "green",
    });
  }
  if (pointB) {
    markers.push({
      latitude: pointB.latitude,
      longitude: pointB.longitude,
      title: "Destination",
      color: "red",
    });
  }

  // Prepare polyline
  const polyline = pointA && pointB ? [pointA, pointB] : [];

  return (
    <View style={styles.container}>
      <LeafletMap
        markers={markers}
        polyline={polyline}
        polylineColor={isDeviated ? "red" : "#4A90E2"}
        center={currentLocation || undefined}
        showUserLocation={true}
      />

      <View style={styles.overlay}>
        <View className="bg-white p-4 rounded-t-3xl shadow-lg">
          <Text className="text-2xl font-bold text-gray-900 mb-4 text-center">
            Safe Route
          </Text>

          {step === "setup" ? (
            <View className="space-y-4">
              <View className="flex-row justify-between space-x-2">
                <TouchableOpacity
                  onPress={handleSetPointA}
                  className={`flex-1 p-3 rounded-xl border ${
                    pointA ? "border-green-500 bg-green-50" : "border-gray-200"
                  }`}
                >
                  <Text className="font-semibold text-center text-sm">
                    {pointA ? "Start Set ✓" : "Set Start"}
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={handleSetPointB}
                  className={`flex-1 p-3 rounded-xl border ${
                    pointB ? "border-green-500 bg-green-50" : "border-gray-200"
                  }`}
                >
                  <Text className="font-semibold text-center text-sm">
                    {pointB ? "Dest Set ✓" : "Set Dest"}
                  </Text>
                </TouchableOpacity>
              </View>

              <TouchableOpacity
                onPress={startTracking}
                disabled={loading || !pointA || !pointB}
                className={`py-3 rounded-xl ${
                  loading || !pointA || !pointB ? "bg-gray-300" : "bg-pink-500"
                }`}
              >
                {loading ? (
                  <ActivityIndicator color="white" />
                ) : (
                  <Text className="text-white font-bold text-center text-lg">
                    Start Trip
                  </Text>
                )}
              </TouchableOpacity>
            </View>
          ) : (
            <View>
              <View
                className={`p-3 rounded-xl mb-4 ${
                  isDeviated
                    ? "bg-red-100 border border-red-300"
                    : "bg-green-100 border border-green-300"
                }`}
              >
                <Text
                  className={`text-center font-bold ${
                    isDeviated ? "text-red-700" : "text-green-700"
                  }`}
                >
                  {isDeviated ? "OFF ROUTE!" : "ON ROUTE"}
                </Text>
              </View>

              <View className="flex-row justify-between mb-4 px-4">
                <View className="items-center">
                  <Text className="text-xl font-bold">{distance} km</Text>
                  <Text className="text-gray-500 text-xs">Distance</Text>
                </View>
                <View className="items-center">
                  <Text className="text-xl font-bold">{duration} min</Text>
                  <Text className="text-gray-500 text-xs">Duration</Text>
                </View>
              </View>

              <TouchableOpacity
                onPress={stopTracking}
                className="bg-gray-900 py-3 rounded-xl"
              >
                <Text className="text-white font-bold text-center text-lg">
                  End Trip
                </Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  overlay: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
  },
});
