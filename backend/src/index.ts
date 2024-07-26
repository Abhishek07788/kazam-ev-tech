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

const httpServer = createServer(app);

export const io = new Server(httpServer, {
  cors: {
    origin: "*",
  },
});

app.use(express.json());
app.use("/api", taskRoutes);

app.use("/", (req, res) => {
  res.status(200).json("Hello from Server!");
});

io.on("connection", (socket) => {
  console.log("A user Connected", socket.id);

  socket.on("add-note", (note) => {
    socket.emit("get-note", note);
  });
  socket.on("disconnect", () => {
    console.log("User Disconnected!");
  });
});

httpServer.listen(PORT, async () => {
  await dbConnection();
  console.log(`Server started on http://localhost:${PORT}`);
});
