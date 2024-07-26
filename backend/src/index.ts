import dotenv from "dotenv";
dotenv.config();
import express from "express";
import { dbConnection } from "./config/database";
import taskRoutes from "./routes/todo.routes";
import { Server } from "socket.io";
import { createServer } from "http";
import cors from "cors";

const app = express();
const PORT = process.env.PORT || 8080;

app.use(cors());
app.use(express.json());
app.use("/api", taskRoutes);

// Default Route
app.use("/", (req, res) => {
  res.status(200).json("Hello from Server!");
});

// Create HTTP Server
const httpServer = createServer(app);

// Socket.IO Configuration
export const io = new Server(httpServer, {
  cors: {
    origin: "*",
  },
});

// Socket.IO Connection
io.on("connection", (socket) => {
  console.log("A user connected:", socket.id);

  socket.on("add-note", (note) => {
    io.emit("get-note", note);
  });

  socket.on("disconnect", () => {
    console.log("User disconnected!");
  });
});

httpServer.listen(PORT, async () => {
  await dbConnection();
  console.log(`Server started on http://localhost:${PORT}`);
});
