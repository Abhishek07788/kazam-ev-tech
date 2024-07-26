import express from "express";
import Todo from "../schema/todo.schema";
const app = express.Router();

app.get("/fetchAllTasks", async (req, res) => {
  try {
    const todos = await Todo.find({});
    res.status(200).send(todos);
  } catch (e) {
    res.status(500).send(e);
  }
});

app.post("/add", async (req, res) => {
  try {
    const { title } = req.body;
    if (!title) {
      return res
        .status(200)
        .send({ status: false, message: "Title is required" });
    }
    const newTodo = new Todo({ title });
    await newTodo.save();
    const todos = await Todo.find({});
    res
      .status(200)
      .send({ status: true, message: "Task Added!", todos: todos });
  } catch (e) {
    res.status(500).send(e);
  }
});

export default app;
