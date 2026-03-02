const jwt = require("jsonwebtoken");
const User = require("../models/User");
const Message = require("../models/Message");

const setupSocket = (io) => {
  io.use(async (socket, next) => {
    try {
      const token = socket.handshake.auth.token;
      if (!token) return next(new Error("Authentication error"));
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(decoded.id);
      if (!user) return next(new Error("User not found"));
      socket.userId = user._id.toString();
      socket.user = user;
      next();
    } catch (error) { next(new Error("Authentication error")); }
  });

  io.on("connection", async (socket) => {
    console.log(`User connected: ${socket.user.fullName} (${socket.userId})`);
    await User.findByIdAndUpdate(socket.userId, { isOnline: true, socketId: socket.id });
    const user = await User.findById(socket.userId).populate("friends");
    if (user && user.friends) {
      user.friends.forEach((friend) => {
        if (friend.socketId) { io.to(friend.socketId).emit("user-online", { userId: socket.userId, isOnline: true }); }
      });
    }
    socket.join(socket.userId);

    socket.on("send-message", async (data) => {
      try {
        const { receiverId, content, messageType, replyTo } = data;
        const message = await Message.create({ sender: socket.userId, receiver: receiverId, content, messageType: messageType || "text", replyTo: replyTo || null });
        const populated = await message.populate([{ path: "sender", select: "fullName avatar" }, { path: "receiver", select: "fullName avatar" }, { path: "replyTo", select: "content sender" }]);
        const receiverUser = await User.findById(receiverId);
        if (receiverUser && receiverUser.socketId) { io.to(receiverUser.socketId).emit("new-message", populated); }
        socket.emit("message-sent", populated);
      } catch (error) { socket.emit("message-error", { message: error.message }); }
    });

    socket.on("typing-start", async (data) => {
      const { receiverId } = data;
      const receiverUser = await User.findById(receiverId);
      if (receiverUser && receiverUser.socketId) { io.to(receiverUser.socketId).emit("user-typing", { userId: socket.userId, fullName: socket.user.fullName }); }
    });

    socket.on("typing-stop", async (data) => {
      const { receiverId } = data;
      const receiverUser = await User.findById(receiverId);
      if (receiverUser && receiverUser.socketId) { io.to(receiverUser.socketId).emit("user-stopped-typing", { userId: socket.userId }); }
    });

    socket.on("mark-read", async (data) => {
      const { senderId } = data;
      await Message.updateMany({ sender: senderId, receiver: socket.userId, isRead: false }, { isRead: true, readAt: new Date() });
      const io = req.app.get("io");
      const senderUser = await User.findById(senderId);
      if (senderUser && senderUser.socketId) { io.to(senderUser.socketId).emit("messages-read", { readBy: socket.userId }); }
    });

    socket.on("react-message", async (data) => {
      const { messageId, emoji } = data;
      const message = await Message.findById(messageId);
      if (message) {
        message.reactions = message.reactions.filter((r) => r.user.toString() !== socket.userId);
        if (emoji) { message.reactions.push({ user: socket.userId, emoji }); }
        await message.save();
        const otherUserId = message.sender.toString() === socket.userId ? message.receiver : message.sender;
        const otherUser = await User.findById(otherUserId);
        if (otherUser && otherUser.socketId) { io.to(otherUser.socketId).emit("message-reaction", { messageId: message._id, reactions: message.reactions }); }
      }
    });

    socket.on("disconnect", async () => {
      console.log(`User disconnected: ${socket.user.fullName}`);
      await User.findByIdAndUpdate(socket.userId, { isOnline: false, lastSeen: new Date(), socketId: "" });
      if (user && user.friends) {
        user.friends.forEach((friend) => {
          if (friend.socketId) { io.to(friend.socketId).emit("user-online", { userId: socket.userId, isOnline: false, lastSeen: new Date() }); }
        });
      }
    });
  });
};

module.exports = setupSocket;