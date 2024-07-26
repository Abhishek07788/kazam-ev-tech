import express from "express";
import { flushTasksFromRedis, getTasksFromRedis } from "../config/redisClient";
import Todo from "../schema/todo.schema";

const app = express.Router();

// Fetch all tasks
app.get("/", async (req, res) => {
  try {
    const redisTodo = await getTasksFromRedis();
    if (redisTodo.length < 1) {
      const todo = await Todo.find({});
      res.status(200).send(todo);
    } else {
      res.status(200).send(redisTodo);
    }
  } catch (e) {
    res.status(500).send(e);
  }
});

// Function to move tasks from Redis to MongoDB
export const moveTasksToMongoDB = async () => {
  const tasks = await getTasksFromRedis();
  try {
    if (tasks.length > 50) {
      const formattedTasks = tasks.map((task: any) => ({
        title: task.title,
      }));
      await Todo.insertMany(formattedTasks);
      await flushTasksFromRedis();
      console.log("Tasks moved to MongoDB and deleted from Redis.");
    }
  } catch (err) {
    console.error("Error moving tasks to MongoDB:", err);
  }
};

export default app;
