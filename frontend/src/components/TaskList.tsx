import React, { useEffect, useState } from "react";
import TaskItem from "./TaskItem";
import { addTask, getTask, Socket } from "../api/api";

interface Task {
  _id: string;
  title: string;
}

const TaskList: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [note, setNote] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    Socket.on("get-note", (res) => {
      setTasks((prev) => [...prev, res]);
    });
    return () => {
      Socket.off("get-note");
    };
  }, []);

  useEffect(() => {
    setLoading(true);
    getTask()
      .then((res) => {
        setTasks(res);
        setLoading(false);
      })
      .catch((e) => {
        console.error(e);
        setLoading(false);
      });
  }, []);

  const handleAdd = () => {
    if (!note) {
      setError("Input is required!");
      return;
    }
    let id = new Date().toISOString();
    const newTask = { _id: id, title: note };
    Socket.emit("add-note", newTask);
    addTask(note)
      .then((res) => {
        if (res.status) {
          setNote("");
        }
      })
      .catch((e) => {
        console.error(e);
      });
  };

  return (
    <div className="note-app">
      <div className="header">
        <div className="icon">📝</div>
        <div className="title">Note App</div>
      </div>
      <div className="input-container">
        <input
          required
          value={note}
          onChange={(e) => {
            setNote(e.target.value);
            setError("");
          }}
          type="text"
          placeholder="New Note..."
        />
        <div className="AddBtn" onClick={handleAdd}>
          <span>+</span>
          <span>Add</span>
        </div>
      </div>
      {error && <p className="error">{error}</p>}
      <div className="notes-section">
        <h3>Notes</h3>
        <div className="list-items">
          {loading ? (
            <h4>Loading...</h4>
          ) : (
            <>
              {tasks.map((task) => (
                <TaskItem key={task._id} content={task.title} />
              ))}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default TaskList;
