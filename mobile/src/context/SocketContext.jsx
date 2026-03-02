import React, { createContext, useContext, useEffect, useState, useRef } from "react";
import { io } from "socket.io-client";
import { useAuth } from "./AuthContext";

const SocketContext = createContext();
export const useSocket = () => useContext(SocketContext);
const SOCKET_URL = "http://192.168.1.100:5000";

export const SocketProvider = ({ children }) => {
  const { token, isAuthenticated } = useAuth();
  const [socket, setSocket] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState({});
  const [typingUsers, setTypingUsers] = useState({});
  const socketRef = useRef(null);

  useEffect(() => {
    if (isAuthenticated && token) {
      const newSocket = io(SOCKET_URL, { auth: { token }, transports: ["websocket"], reconnection: true, reconnectionDelay: 1000, reconnectionAttempts: 10 });
      newSocket.on("connect", () => { console.log("Socket connected:", newSocket.id); });
      newSocket.on("user-online", ({ userId, isOnline, lastSeen }) => { setOnlineUsers((prev) => ({ ...prev, [userId]: { isOnline, lastSeen } })); });
      newSocket.on("user-typing", ({ userId, fullName }) => { setTypingUsers((prev) => ({ ...prev, [userId]: fullName })); });
      newSocket.on("user-stopped-typing", ({ userId }) => { setTypingUsers((prev) => { const updated = { ...prev }; delete updated[userId]; return updated; }); });
      newSocket.on("connect_error", (err) => { console.log("Socket connection error:", err.message); });
      socketRef.current = newSocket; setSocket(newSocket);
      return () => { newSocket.disconnect(); };
    }
  }, [isAuthenticated, token]);

  const sendMessage = (data) => { if (socketRef.current) socketRef.current.emit("send-message", data); };
  const startTyping = (receiverId) => { if (socketRef.current) socketRef.current.emit("typing-start", { receiverId }); };
  const stopTyping = (receiverId) => { if (socketRef.current) socketRef.current.emit("typing-stop", { receiverId }); };
  const markMessagesRead = (senderId) => { if (socketRef.current) socketRef.current.emit("mark-read", { senderId }); };
  const reactToMessage = (messageId, emoji) => { if (socketRef.current) socketRef.current.emit("react-message", { messageId, emoji }); };

  return (
    <SocketContext.Provider value={{ socket, onlineUsers, typingUsers, sendMessage, startTyping, stopTyping, markMessagesRead, reactToMessage }}>
      {children}
    </SocketContext.Provider>
  );
};