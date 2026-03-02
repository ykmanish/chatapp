const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema(
  {
    sender: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    receiver: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    content: { type: String, default: "" },
    messageType: { type: String, enum: ["text", "image", "voice", "file"], default: "text" },
    fileUrl: { type: String, default: "" },
    isRead: { type: Boolean, default: false },
    readAt: { type: Date },
    reactions: [{ user: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, emoji: { type: String } }],
    replyTo: { type: mongoose.Schema.Types.ObjectId, ref: "Message", default: null },
    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true }
);

messageSchema.index({ sender: 1, receiver: 1, createdAt: -1 });
messageSchema.index({ receiver: 1, isRead: 1 });
messageSchema.index({ createdAt: -1 });

module.exports = mongoose.model("Message", messageSchema);