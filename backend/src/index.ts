import dotenv from "dotenv";
dotenv.config();
import express from "express";
import { dbConnection } from "./config/database";
import taskRoutes from "./routes/todo.routes";
import { Server } from "socket.io";
import { createServer } from "http";
import cors from "cors";
import { getTasksFromRedis, setTasksInRedis } from "./config/redisClient";
import { moveTasksToMongoDB } from "./routes/todo.routes";

const app = express();
const PORT = process.env.PORT || 8080;

// Middleware
app.use(cors());
app.use(express.json());
app.use("/fetchAllTasks", taskRoutes);

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

  socket.on("add", async (note) => {
    const tasks = await getTasksFromRedis();
    console.log("tasks: ", tasks);
    tasks.push(note);
    await setTasksInRedis(tasks);
    io.emit("get-note", note);
    await moveTasksToMongoDB();
  });

  socket.on("disconnect", () => {
    console.log("User disconnected!");
  });
});

// Start Server
httpServer.listen(PORT, async () => {
  try {
    await dbConnection();
    console.log(`Server started on http://localhost:${PORT}`);
  } catch (err) {
    console.error("Error connecting to MongoDB:", err);
  }
});
