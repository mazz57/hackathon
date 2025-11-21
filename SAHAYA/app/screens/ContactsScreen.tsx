import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  ActivityIndicator,
} from "react-native";
import { contactService } from "../services/api";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function ContactsScreen() {
  const [contacts, setContacts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);

  // Form state for adding contact
  const [newName, setNewName] = useState("");
  const [newPhone, setNewPhone] = useState("");
  const [adding, setAdding] = useState(false);

  useEffect(() => {
    loadUserAndContacts();
  }, []);

  const loadUserAndContacts = async () => {
    try {
      const userStr = await AsyncStorage.getItem("user");
      if (userStr) {
        const user = JSON.parse(userStr);
        setUserId(user._id);
        fetchContacts(user._id);
      } else {
        setLoading(false);
      }
    } catch (error) {
      console.error("Error loading user:", error);
      setLoading(false);
    }
  };

  const fetchContacts = async (id: string) => {
    try {
      const response = await contactService.getContacts(id);
      setContacts(response.data);
    } catch (error) {
      console.error("Error fetching contacts:", error);
      Alert.alert("Error", "Failed to load contacts");
    } finally {
      setLoading(false);
    }
  };

  const handleAddContact = async () => {
    if (!newName || !newPhone) {
      Alert.alert("Error", "Please enter both name and phone number");
      return;
    }

    setAdding(true);
    try {
      await contactService.addContact({
        name: newName,
        phone: newPhone,
        relationship: "Emergency Contact",
      });

      setNewName("");
      setNewPhone("");
      Alert.alert("Success", "Contact added successfully");
      if (userId) fetchContacts(userId);
    } catch (error: any) {
      console.error("Error adding contact:", error);
      Alert.alert(
        "Error",
        error.response?.data?.message || "Failed to add contact"
      );
    } finally {
      setAdding(false);
    }
  };

  const handleDeleteContact = async (id: string) => {
    Alert.alert(
      "Delete Contact",
      "Are you sure you want to delete this contact?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              await contactService.deleteContact(id);
              if (userId) fetchContacts(userId);
            } catch (error) {
              console.error("Error deleting contact:", error);
              Alert.alert("Error", "Failed to delete contact");
            }
          },
        },
      ]
    );
  };

  return (
    <View className="flex-1 bg-white">
      <ScrollView className="flex-1 p-6">
        {/* Header */}
        <View className="mb-6">
          <Text className="text-3xl font-bold text-gray-900">
            Emergency Contacts
          </Text>
          <Text className="text-lg text-gray-600 mt-2">
            {contacts.length} contacts active
          </Text>
          <Text className="text-gray-500 mt-1">
            These contacts will be notified when you trigger an emergency alert
          </Text>
        </View>

        {/* Add Contact Form */}
        <View className="bg-pink-50 p-4 rounded-2xl border border-pink-100 mb-6">
          <Text className="text-lg font-semibold text-pink-700 mb-3">
            Add New Contact
          </Text>
          <TextInput
            className="bg-white p-3 rounded-xl border border-pink-200 mb-3"
            placeholder="Contact Name"
            value={newName}
            onChangeText={setNewName}
          />
          <TextInput
            className="bg-white p-3 rounded-xl border border-pink-200 mb-3"
            placeholder="Phone Number"
            keyboardType="phone-pad"
            value={newPhone}
            onChangeText={setNewPhone}
          />
          <TouchableOpacity
            className="bg-pink-500 py-3 rounded-xl items-center"
            onPress={handleAddContact}
            disabled={adding}
          >
            {adding ? (
              <ActivityIndicator color="white" />
            ) : (
              <Text className="text-white font-bold">Add Contact</Text>
            )}
          </TouchableOpacity>
        </View>

        <View className="h-px bg-gray-200 my-4" />

        {/* Contacts List */}
        {loading ? (
          <ActivityIndicator size="large" color="#EC4899" />
        ) : (
          <View className="space-y-4 pb-10">
            {contacts.map((contact) => (
              <ContactCard
                key={contact._id}
                contact={contact}
                onDelete={() => handleDeleteContact(contact._id)}
              />
            ))}
            {contacts.length === 0 && (
              <Text className="text-center text-gray-500 mt-4">
                No contacts added yet.
              </Text>
            )}
          </View>
        )}
      </ScrollView>
    </View>
  );
}

function ContactCard({
  contact,
  onDelete,
}: {
  contact: any;
  onDelete: () => void;
}) {
  return (
    <View className="bg-white rounded-2xl border border-gray-200 p-4 mb-4 shadow-sm">
      <View className="flex-row justify-between items-start">
        <View>
          <Text className="text-xl font-semibold text-gray-900">
            {contact.name}
          </Text>
          <Text className="text-gray-600 mt-1">
            {contact.relationship || "Emergency Contact"}
          </Text>
          <Text className="text-gray-800 mt-2 font-medium">
            {contact.phone}
          </Text>
        </View>
        <TouchableOpacity onPress={onDelete} className="p-2">
          <Text className="text-red-500 font-bold">Delete</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
