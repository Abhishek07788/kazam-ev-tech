import React, { useEffect, useState } from "react";
import TaskItem from "./TaskItem";
import { addTask, getTask } from "../api/api";

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
    getTask()
      .then((res) => {
        setTasks(res);
      })
      .catch((e) => {
        console.log(e);
        setLoading(false);
      });
  }, []);

  const handleAdd = () => {
    if (!note) {
      setError("Input is required!");
      return;
    }
    setLoading(true);
    addTask(note)
      .then((res) => {
        setLoading(false);
        setTasks(res.todos);
        if (res.status) {
          setNote("");
        }
      })
      .catch((e) => {
        console.log(e);
        setLoading(false);
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
          {loading ? (
            "loading.."
          ) : (
            <div>
              <span>+</span>
              <span>Add</span>
            </div>
          )}
        </div>
      </div>
      {error && <p className="error">{error}</p>}
      <div className="notes-section">
        <h3>Notes</h3>
        <div className="list-items">
          {tasks.map((task) => (
            <TaskItem key={task._id} content={task.title} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default TaskList;
