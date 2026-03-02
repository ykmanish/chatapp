import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, SafeAreaView, Alert, ScrollView, ActivityIndicator } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useAuth } from "../context/AuthContext";
import { getInitials } from "../utils/helpers";

const ProfileScreen = () => {
  const { user, updateUser, logout } = useAuth();
  const [fullName, setFullName] = useState(user?.fullName || "");
  const [about, setAbout] = useState(user?.about || "");
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleUpdate = async () => {
    if (!fullName.trim()) { Alert.alert("Error", "Name cannot be empty"); return; }
    setIsLoading(true);
    const result = await updateUser({ fullName: fullName.trim(), about: about.trim() });
    setIsLoading(false);
    if (result.success) { setIsEditing(false); Alert.alert("Success", "Profile updated!"); }
    else Alert.alert("Error", result.message);
  };

  const handleLogout = () => {
    Alert.alert("Logout", "Are you sure you want to logout?", [{ text: "Cancel", style: "cancel" }, { text: "Logout", style: "destructive", onPress: logout }]);
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#f9fafb" }}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={{ backgroundColor: "#6C63FF", paddingTop: 48, paddingBottom: 64, alignItems: "center", borderBottomLeftRadius: 24, borderBottomRightRadius: 24 }}>
          <View style={{ width: 96, height: 96, backgroundColor: "rgba(255,255,255,0.2)", borderRadius: 48, alignItems: "center", justifyContent: "center", marginBottom: 16 }}><Text style={{ color: "#fff", fontSize: 30, fontWeight: "bold" }}>{getInitials(user?.fullName)}</Text></View>
          <Text style={{ color: "#fff", fontSize: 20, fontWeight: "bold" }}>{user?.fullName}</Text>
          <Text style={{ color: "rgba(255,255,255,0.7)", fontSize: 14, marginTop: 4 }}>{user?.email}</Text>
        </View>
        <View style={{ paddingHorizontal: 24, marginTop: -32 }}>
          <View style={{ backgroundColor: "#fff", borderRadius: 16, padding: 24, marginBottom: 16, shadowColor: "#000", shadowOpacity: 0.05, shadowRadius: 8, elevation: 2 }}>
            <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 24 }}><Text style={{ color: "#1A1A2E", fontWeight: "bold", fontSize: 18 }}>Personal Info</Text><TouchableOpacity onPress={() => isEditing ? handleUpdate() : setIsEditing(true)}>{isLoading ? <ActivityIndicator color="#6C63FF" /> : <Text style={{ color: "#6C63FF", fontWeight: "600" }}>{isEditing ? "Save" : "Edit"}</Text>}</TouchableOpacity></View>
            <View style={{ marginBottom: 16 }}><Text style={{ color: "#8E8E93", fontSize: 14, marginBottom: 4 }}>Full Name</Text>{isEditing ? <TextInput style={{ color: "#1A1A2E", fontSize: 16, borderBottomWidth: 1, borderBottomColor: "#e5e7eb", paddingBottom: 8 }} value={fullName} onChangeText={setFullName} /> : <Text style={{ color: "#1A1A2E", fontSize: 16 }}>{user?.fullName}</Text>}</View>
            <View style={{ marginBottom: 16 }}><Text style={{ color: "#8E8E93", fontSize: 14, marginBottom: 4 }}>Email</Text><Text style={{ color: "#1A1A2E", fontSize: 16 }}>{user?.email}</Text></View>
            <View><Text style={{ color: "#8E8E93", fontSize: 14, marginBottom: 4 }}>About</Text>{isEditing ? <TextInput style={{ color: "#1A1A2E", fontSize: 16, borderBottomWidth: 1, borderBottomColor: "#e5e7eb", paddingBottom: 8 }} value={about} onChangeText={setAbout} multiline /> : <Text style={{ color: "#1A1A2E", fontSize: 16 }}>{user?.about}</Text>}</View>
          </View>
          <View style={{ backgroundColor: "#fff", borderRadius: 16, padding: 16, marginBottom: 16, shadowColor: "#000", shadowOpacity: 0.05, shadowRadius: 8, elevation: 2 }}>
            <TouchableOpacity style={{ flexDirection: "row", alignItems: "center", paddingVertical: 12 }}><View style={{ width: 40, height: 40, backgroundColor: "rgba(108,99,255,0.1)", borderRadius: 20, alignItems: "center", justifyContent: "center" }}><Ionicons name="notifications-outline" size={20} color="#6C63FF" /></View><Text style={{ flex: 1, marginLeft: 16, color: "#1A1A2E", fontSize: 16 }}>Notifications</Text><Ionicons name="chevron-forward" size={20} color="#8E8E93" /></TouchableOpacity>
            <TouchableOpacity style={{ flexDirection: "row", alignItems: "center", paddingVertical: 12 }}><View style={{ width: 40, height: 40, backgroundColor: "rgba(108,99,255,0.1)", borderRadius: 20, alignItems: "center", justifyContent: "center" }}><Ionicons name="lock-closed-outline" size={20} color="#6C63FF" /></View><Text style={{ flex: 1, marginLeft: 16, color: "#1A1A2E", fontSize: 16 }}>Privacy</Text><Ionicons name="chevron-forward" size={20} color="#8E8E93" /></TouchableOpacity>
            <TouchableOpacity style={{ flexDirection: "row", alignItems: "center", paddingVertical: 12 }}><View style={{ width: 40, height: 40, backgroundColor: "rgba(108,99,255,0.1)", borderRadius: 20, alignItems: "center", justifyContent: "center" }}><Ionicons name="help-circle-outline" size={20} color="#6C63FF" /></View><Text style={{ flex: 1, marginLeft: 16, color: "#1A1A2E", fontSize: 16 }}>Help</Text><Ionicons name="chevron-forward" size={20} color="#8E8E93" /></TouchableOpacity>
          </View>
          <TouchableOpacity style={{ backgroundColor: "#fef2f2", borderRadius: 16, padding: 16, marginBottom: 40, flexDirection: "row", alignItems: "center", justifyContent: "center" }} onPress={handleLogout}><Ionicons name="log-out-outline" size={20} color="#F44336" /><Text style={{ color: "#F44336", fontWeight: "600", fontSize: 16, marginLeft: 8 }}>Logout</Text></TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default ProfileScreen;
