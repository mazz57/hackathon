import { Stack } from "expo-router";
import "../global.css";
import { useEffect } from "react";
import { startGeofenceWatcher } from "./utils/GeofenceWatcher";

export default function RootLayout() {
  useEffect(() => {
    // Initialize background tasks
    startGeofenceWatcher();
  }, []);

  return <Stack screenOptions={{ headerShown: false }} />;
}
