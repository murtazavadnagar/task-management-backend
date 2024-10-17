const http = require("http");
const dotenv = require("dotenv");
const socketio = require("socket.io");

const connectDB = require("./config/db");
const app = require("./app"); // Import the Express app

// Load environment variables from .env file
dotenv.config({ path: `.env.${process.env.NODE_ENV}` });

// Database connection
connectDB();

// Create HTTP server
const server = http.createServer(app);

// // Initialize socket.io
// const io = socketio(server);

// io.on("connection", (socket) => {
//   console.info("New WebSocket Connection");

//   // Join a workspace room
//   // socket.on("joinRoom", ({ workspaceId, userId }) => {
//   socket.on("joinRoom", ({ workspaceId }) => {
//     socket.join(workspaceId);
//     socket.emit("message", "Welcome to the workspace chat");
//   });

//   socket.on("chatMessage", (msg) => {
//     const workspaceId = msg.workspaceId;
//     io.to(workspaceId).emit("message", msg.txt); // Broadcast message to workspace
//   });

//   // Disconnect event
//   socket.on("disconnect", () => {
//     console.info("User disconnected");
//   });
// });

// Logging memory usage
const logMemoryUsage = () => {
  const memoryUsage = process.memoryUsage();
  for (const key in memoryUsage) {
    console.info(
      `Memory usage ${key}: ${Math.round(memoryUsage[key] / (1024 * 1024))} MB`
    );
  }
};

// Call the function periodically to monitor memory
// setInterval(logMemoryUsage, 60000); // Every 1 minutes

//Port configuration
const PORT = process.env.PORT || 5000;

// Start the server
server.listen(PORT, () => {
  console.info(`Server running on port ${PORT}...`);
});

// Handling unhandled promise rejections
process.on("unhandledRejection", (err) => {
  console.error("Unhandled Rejection! Shutting down...", err);
  server.close(() => {
    process.exit(1);
  });
});

// Handling uncaught execptions
process.on("uncaughtException", (err) => {
  console.error("Uncaught Exception! Shutting down...", err);
  server.close(() => {
    process.exit(1);
  });
});
