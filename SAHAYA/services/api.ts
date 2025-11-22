import axios from "axios";
import { Platform } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

const LOCAL_IP = "192.168.40.87";

// Auto-detect correct base URL
const getBaseUrl = () => {
  if (Platform.OS === "android") {
    return "http://10.0.2.2:5000/api";
  }
  return `http://${LOCAL_IP}:5000/api`;
};

const API_URL = getBaseUrl();

const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Attach token
api.interceptors.request.use(
  async (config) => {
    const token = await AsyncStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// SERVICES

export const authService = {
  login: (data: any) => api.post("/auth/login", data),
  register: (data: any) => api.post("/auth/register", data),
};

export const sosService = {
  triggerSOS: (data: any) => api.post("/sos/trigger", data),
  smsTrigger: (data: any) => api.post("/sos/sms-trigger", data),
};

export const contactService = {
  addContact: (data: any) => api.post("/contacts/add", data),
  getContacts: (userId: string) => api.get(`/contacts/${userId}`),
  deleteContact: (id: string) => api.delete(`/contacts/${id}`),
};

export const locationService = {
  shareLocation: (data: any) => api.post("/location/share", data),
  getLatestLocation: (userId: string) => api.get(`/location/${userId}/latest`),
};

export const geofenceService = {
  createGeofence: (data: any) => api.post("/geofence/create", data),
  getGeofences: (userId: string) => api.get(`/geofence/${userId}`),
  checkGeofence: (data: any) => api.post("/geofence/check", data),
  deleteGeofence: (id: string) => api.delete(`/geofence/${id}`),
};

export const tripService = {
  startTrip: (data: any) => api.post("/trips/start", data),
  endTrip: (data: any) => api.post("/trips/end", data),
  sendAlert: (data: any) => api.post("/trips/alert", data),

  updateLocation: (data: {
    tripId: string;
    latitude: number;
    longitude: number;
  }) => api.post("/trips/location", data),
};

export default api;
