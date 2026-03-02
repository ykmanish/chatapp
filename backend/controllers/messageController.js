const Message = require("../models/Message");
const User = require("../models/User");

const getMessages = async (req, res) => {
  try {
    const { userId } = req.params;
    const currentUserId = req.user._id;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 50;
    const skip = (page - 1) * limit;
    const messages = await Message.find({ $or: [{ sender: currentUserId, receiver: userId }, { sender: userId, receiver: currentUserId }], isDeleted: false }).populate("sender", "fullName avatar").populate("receiver", "fullName avatar").populate("replyTo", "content sender").sort({ createdAt: -1 }).skip(skip).limit(limit);
    const total = await Message.countDocuments({ $or: [{ sender: currentUserId, receiver: userId }, { sender: userId, receiver: currentUserId }], isDeleted: false });
    res.json({ messages: messages.reverse(), pagination: { page, limit, total, pages: Math.ceil(total / limit) } });
  } catch (error) { res.status(500).json({ message: error.message }); }
};

const sendMessage = async (req, res) => {
  try {
    const { receiverId, content, messageType, replyTo } = req.body;
    const message = await Message.create({ sender: req.user._id, receiver: receiverId, content, messageType: messageType || "text", replyTo: replyTo || null });
    const populated = await message.populate([{ path: "sender", select: "fullName avatar" }, { path: "receiver", select: "fullName avatar" }, { path: "replyTo", select: "content sender" }]);
    const io = req.app.get("io");
    const receiverUser = await User.findById(receiverId);
    if (receiverUser && receiverUser.socketId) { io.to(receiverUser.socketId).emit("new-message", populated); }
    res.status(201).json(populated);
  } catch (error) { res.status(500).json({ message: error.message }); }
};

const markAsRead = async (req, res) => {
  try {
    const { userId } = req.params;
    const currentUserId = req.user._id;
    await Message.updateMany({ sender: userId, receiver: currentUserId, isRead: false }, { isRead: true, readAt: new Date() });
    const io = req.app.get("io");
    const senderUser = await User.findById(userId);
    if (senderUser && senderUser.socketId) { io.to(senderUser.socketId).emit("messages-read", { readBy: currentUserId }); }
    res.json({ message: "Messages marked as read" });
  } catch (error) { res.status(500).json({ message: error.message }); }
};

const reactToMessage = async (req, res) => {
  try {
    const { emoji } = req.body;
    const message = await Message.findById(req.params.messageId);
    if (!message) return res.status(404).json({ message: "Message not found" });
    message.reactions = message.reactions.filter((r) => r.user.toString() !== req.user._id.toString());
    if (emoji) { message.reactions.push({ user: req.user._id, emoji }); }
    await message.save();
    const populated = await message.populate("reactions.user", "fullName avatar");
    const io = req.app.get("io");
    const otherUserId = message.sender.toString() === req.user._id.toString() ? message.receiver : message.sender;
    const otherUser = await User.findById(otherUserId);
    if (otherUser && otherUser.socketId) { io.to(otherUser.socketId).emit("message-reaction", { messageId: message._id, reactions: populated.reactions }); }
    res.json(populated);
  } catch (error) { res.status(500).json({ message: error.message }); }
};

const deleteMessage = async (req, res) => {
  try {
    const message = await Message.findById(req.params.messageId);
    if (!message) return res.status(404).json({ message: "Message not found" });
    if (message.sender.toString() !== req.user._id.toString()) return res.status(403).json({ message: "Not authorized" });
    message.isDeleted = true;
    message.content = "This message was deleted";
    await message.save();
    const io = req.app.get("io");
    const receiverUser = await User.findById(message.receiver);
    if (receiverUser && receiverUser.socketId) { io.to(receiverUser.socketId).emit("message-deleted", { messageId: message._id }); }
    res.json({ message: "Message deleted" });
  } catch (error) { res.status(500).json({ message: error.message }); }
};

module.exports = { getMessages, sendMessage, markAsRead, reactToMessage, deleteMessage };