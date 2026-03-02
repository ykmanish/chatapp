import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { formatTime, getInitials, truncateText } from "../utils/helpers";

const ChatListItem = ({ chat, isOnline, onPress, onLongPress }) => {
  const { user, lastMessage, unreadCount } = chat;
  if (!user) return null;

  return (
    <TouchableOpacity
      style={{ flexDirection: "row", alignItems: "center", backgroundColor: "#fff", borderRadius: 16, padding: 16, marginBottom: 8 }}
      onPress={onPress}
      onLongPress={onLongPress}
      activeOpacity={0.7}
    >
      <View style={{ width: 52, height: 52, backgroundColor: "rgba(108,99,255,0.15)", borderRadius: 26, alignItems: "center", justifyContent: "center" }}>
        <Text style={{ color: "#6C63FF", fontWeight: "bold", fontSize: 18 }}>{getInitials(user.fullName)}</Text>
        {isOnline && <View style={{ position: "absolute", bottom: 0, right: 0, width: 14, height: 14, backgroundColor: "#22c55e", borderRadius: 7, borderWidth: 2, borderColor: "#fff" }} />}
      </View>
      <View style={{ flex: 1, marginLeft: 14 }}>
        <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
          <Text style={{ color: "#1A1A2E", fontWeight: "bold", fontSize: 16 }}>{user.fullName}</Text>
          {lastMessage && <Text style={{ color: "#8E8E93", fontSize: 12 }}>{formatTime(lastMessage.createdAt)}</Text>}
        </View>
        <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginTop: 4 }}>
          <View style={{ flexDirection: "row", alignItems: "center", flex: 1 }}>
            {lastMessage?.isRead && <Ionicons name="checkmark-done" size={16} color="#6C63FF" style={{ marginRight: 4 }} />}
            <Text style={{ color: "#8E8E93", fontSize: 14 }} numberOfLines={1}>{truncateText(lastMessage?.content || "Start a conversation", 35)}</Text>
          </View>
          {unreadCount > 0 && <View style={{ backgroundColor: "#6C63FF", borderRadius: 12, minWidth: 24, height: 24, alignItems: "center", justifyContent: "center", paddingHorizontal: 8 }}><Text style={{ color: "#fff", fontSize: 12, fontWeight: "bold" }}>{unreadCount}</Text></View>}
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default ChatListItem;
