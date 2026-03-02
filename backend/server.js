require("dotenv").config();
const express = require("express");
const http = require("http");
const cors = require("cors");
const { Server } = require("socket.io");
const connectDB = require("./config/db");
const setupSocket = require("./socket/socketHandler");
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const friendRoutes = require("./routes/friendRoutes");
const messageRoutes = require("./routes/messageRoutes");

const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: process.env.CLIENT_URL || "*", methods: ["GET", "POST"] }, pingTimeout: 60000 });
app.set("io", io);
app.use(cors());
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/friends", friendRoutes);
app.use("/api/messages", messageRoutes);
app.get("/api/health", (req, res) => { res.json({ status: "OK", message: "ChatApp API is running" }); });
setupSocket(io);

const startServer = async () => {
  try {
    await connectDB();
    const PORT = process.env.PORT || 5000;
    server.listen(PORT, () => { console.log(`🚀 Server running on port ${PORT}`); console.log(`📡 Socket.IO ready`); console.log(`🌐 Health check: http://localhost:${PORT}/api/health`); });
  } catch (error) { console.error("❌ Failed to start server:", error.message); process.exit(1); }
};

startServer();