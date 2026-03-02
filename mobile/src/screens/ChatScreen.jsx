import React, { useState, useEffect, useRef, useCallback } from "react";
import { View, Text, TextInput, TouchableOpacity, SafeAreaView, FlatList, KeyboardAvoidingView, Platform } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useAuth } from "../context/AuthContext";
import { useSocket } from "../context/SocketContext";
import { messageAPI } from "../utils/api";
import MessageBubble from "../components/MessageBubble";
import TypingIndicator from "../components/TypingIndicator";
import { formatLastSeen, getInitials } from "../utils/helpers";

const ChatScreen = ({ route, navigation }) => {
  const { userId, user: chatUser } = route.params;
  const { user: currentUser } = useAuth();
  const { socket, onlineUsers, typingUsers, sendMessage, startTyping, stopTyping, markMessagesRead } = useSocket();
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState("");
  const [replyTo, setReplyTo] = useState(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const flatListRef = useRef(null);
  const typingTimeout = useRef(null);
  const isOnline = onlineUsers[userId]?.isOnline;
  const isTyping = typingUsers[userId];

  const loadMessages = useCallback(async (pageNum = 1) => {
    try {
      const response = await messageAPI.getMessages(userId, pageNum);
      const { messages: newMessages, pagination } = response.data;
      if (pageNum === 1) setMessages(newMessages);
      else setMessages((prev) => [...newMessages, ...prev]);
      setHasMore(pageNum < pagination.pages);
      setPage(pageNum);
    } catch (error) { console.error("Error loading messages:", error); }
  }, [userId]);

  useEffect(() => { loadMessages(); markMessagesRead(userId); }, [loadMessages, userId]);

  useEffect(() => {
    if (socket) {
      const handleNewMessage = (message) => {
        if (message.sender._id === userId || message.sender === userId) {
          setMessages((prev) => [...prev, message]);
          markMessagesRead(userId);
        }
      };
      const handleMessageSent = (message) => { setMessages((prev) => [...prev, message]); };
      const handleMessageReaction = ({ messageId, reactions }) => { setMessages((prev) => prev.map((m) => (m._id === messageId ? { ...m, reactions } : m))); };
      const handleMessageDeleted = ({ messageId }) => { setMessages((prev) => prev.map((m) => (m._id === messageId ? { ...m, isDeleted: true, content: "This message was deleted" } : m))); };
      const handleMessagesRead = () => { setMessages((prev) => prev.map((m) => ({ ...m, isRead: true }))); };
      socket.on("new-message", handleNewMessage);
      socket.on("message-sent", handleMessageSent);
      socket.on("message-reaction", handleMessageReaction);
      socket.on("message-deleted", handleMessageDeleted);
      socket.on("messages-read", handleMessagesRead);
      return () => { socket.off("new-message", handleNewMessage); socket.off("message-sent", handleMessageSent); socket.off("message-reaction", handleMessageReaction); socket.off("message-deleted", handleMessageDeleted); socket.off("messages-read", handleMessagesRead); };
    }
  }, [socket, userId]);

  const handleSend = () => {
    if (!inputText.trim()) return;
    sendMessage({ receiverId: userId, content: inputText.trim(), messageType: "text", replyTo: replyTo?._id || null });
    setInputText(""); setReplyTo(null); stopTyping(userId);
  };

  const handleTyping = (text) => {
    setInputText(text);
    startTyping(userId);
    if (typingTimeout.current) clearTimeout(typingTimeout.current);
    typingTimeout.current = setTimeout(() => { stopTyping(userId); }, 2000);
  };

  const handleReaction = async (messageId, emoji) => { try { await messageAPI.reactToMessage(messageId, emoji); } catch (error) { console.error("Error reacting:", error); } };
  const handleDelete = async (messageId) => { try { await messageAPI.deleteMessage(messageId); } catch (error) { console.error("Error deleting:", error); } };
  const loadMore = () => { if (hasMore) loadMessages(page + 1); };

  const getStatusText = () => {
    if (isTyping) return "typing...";
    if (isOnline) return "Online";
    return "Last seen " + formatLastSeen(onlineUsers[userId]?.lastSeen || chatUser?.lastSeen);
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#ECE5DD" }}>
      <View style={{ flexDirection: "row", alignItems: "center", paddingHorizontal: 16, paddingVertical: 12, backgroundColor: "#fff", borderBottomWidth: 1, borderBottomColor: "#f3f4f6" }}>
        <TouchableOpacity style={{ marginRight: 12 }} onPress={() => navigation.goBack()}><Ionicons name="arrow-back" size={24} color="#1A1A2E" /></TouchableOpacity>
        <View style={{ width: 40, height: 40, backgroundColor: "#6C63FF", borderRadius: 20, alignItems: "center", justifyContent: "center" }}><Text style={{ color: "#fff", fontWeight: "bold" }}>{getInitials(chatUser?.fullName)}</Text>{isOnline && <View style={{ position: "absolute", bottom: 0, right: 0, width: 12, height: 12, backgroundColor: "#22c55e", borderRadius: 6, borderWidth: 2, borderColor: "#fff" }} />}</View>
        <View style={{ flex: 1, marginLeft: 12 }}><Text style={{ color: "#1A1A2E", fontWeight: "bold", fontSize: 16 }}>{chatUser?.fullName}</Text><Text style={{ fontSize: 12, color: isTyping ? "#6C63FF" : isOnline ? "#22c55e" : "#8E8E93" }}>{getStatusText()}</Text></View>
        <TouchableOpacity style={{ marginHorizontal: 8 }}><Ionicons name="call-outline" size={22} color="#6C63FF" /></TouchableOpacity>
        <TouchableOpacity><Ionicons name="videocam-outline" size={22} color="#6C63FF" /></TouchableOpacity>
      </View>
      <FlatList ref={flatListRef} data={messages} keyExtractor={(item) => item._id} renderItem={({ item }) => (<MessageBubble message={item} isOwn={item.sender?._id === currentUser?._id || item.sender === currentUser?._id} onReply={() => setReplyTo(item)} onReact={(emoji) => handleReaction(item._id, emoji)} onDelete={() => handleDelete(item._id)} />)} onEndReached={loadMore} onEndReachedThreshold={0.3} onContentSizeChange={() => { if (messages.length > 0) flatListRef.current?.scrollToEnd({ animated: false }); }} ListHeaderComponent={isTyping ? <TypingIndicator name={chatUser?.fullName} /> : null} contentContainerStyle={{ padding: 16, paddingBottom: 8 }} showsVerticalScrollIndicator={false} />
      {replyTo && (<View style={{ flexDirection: "row", alignItems: "center", backgroundColor: "#fff", paddingHorizontal: 16, paddingVertical: 8, borderTopWidth: 1, borderTopColor: "#e5e7eb" }}><View style={{ flex: 1, borderLeftWidth: 4, borderLeftColor: "#6C63FF", paddingLeft: 12 }}><Text style={{ color: "#6C63FF", fontSize: 12, fontWeight: "600" }}>Replying to</Text><Text style={{ color: "#1A1A2E", fontSize: 14 }} numberOfLines={1}>{replyTo.content}</Text></View><TouchableOpacity onPress={() => setReplyTo(null)}><Ionicons name="close" size={20} color="#8E8E93" /></TouchableOpacity></View>)}
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : undefined}>
        <View style={{ flexDirection: "row", alignItems: "flex-end", paddingHorizontal: 16, paddingVertical: 12, backgroundColor: "#fff", borderTopWidth: 1, borderTopColor: "#f3f4f6" }}>
          <TouchableOpacity style={{ marginRight: 8, marginBottom: 4 }}><Ionicons name="happy-outline" size={24} color="#8E8E93" /></TouchableOpacity>
          <View style={{ flex: 1, backgroundColor: "#f3f4f6", borderRadius: 16, paddingHorizontal: 16, paddingVertical: 8, marginRight: 8 }}><TextInput style={{ color: "#1A1A2E", fontSize: 16, maxHeight: 96 }} placeholder="Type a message..." placeholderTextColor="#8E8E93" value={inputText} onChangeText={handleTyping} multiline /></View>
          {inputText.trim() ? (<TouchableOpacity style={{ width: 40, height: 40, backgroundColor: "#6C63FF", borderRadius: 20, alignItems: "center", justifyContent: "center", marginBottom: 4 }} onPress={handleSend}><Ionicons name="send" size={18} color="#fff" /></TouchableOpacity>) : (<TouchableOpacity style={{ width: 40, height: 40, backgroundColor: "#f3f4f6", borderRadius: 20, alignItems: "center", justifyContent: "center", marginBottom: 4 }}><Ionicons name="mic-outline" size={22} color="#8E8E93" /></TouchableOpacity>)}
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default ChatScreen;
