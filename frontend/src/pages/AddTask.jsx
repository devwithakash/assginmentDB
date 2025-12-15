import { useState, useContext } from "react";
import API from "../api/axios";
import { useNavigate } from "react-router-dom";
import { DashboardRefreshContext } from "./Dashboard";

export default function AddTask() {
  const navigate = useNavigate();
  const { refresh } = useContext(DashboardRefreshContext);

  const priorities = ["low", "medium", "high"];
  const statuses = ["pending", "completed"];

  const [task, setTask] = useState({
    title: "",
    description: "",
    priority: "low",
    status: "pending",
    dueDate: new Date().toISOString().slice(0, 10),
  });

  const submit = async (e) => {
    e.preventDefault();
    await API.post("/tasks", task);
    refresh(); // Refresh dashboard
    navigate("/tasks");
  };

  return (
    <form onSubmit={submit} className="p-6 space-y-2">
      <h2 className="text-xl font-bold mb-4">Add Task</h2>

      <input
        placeholder="Title"
        className="border p-2 w-full"
        value={task.title}
        onChange={(e) => setTask({ ...task, title: e.target.value })}
      />

      <textarea
        placeholder="Description"
        className="border p-2 w-full"
        value={task.description}
        onChange={(e) => setTask({ ...task, description: e.target.value })}
      />

      <select
        className="border p-2 w-full"
        value={task.priority}
        onChange={(e) => setTask({ ...task, priority: e.target.value })}
      >
        {priorities.map((p) => (
          <option key={p} value={p}>
            {p.charAt(0).toUpperCase() + p.slice(1)}
          </option>
        ))}
      </select>

      <select
        className="border p-2 w-full"
        value={task.status}
        onChange={(e) => setTask({ ...task, status: e.target.value })}
      >
        {statuses.map((s) => (
          <option key={s} value={s}>
            {s.charAt(0).toUpperCase() + s.slice(1)}
          </option>
        ))}
      </select>

      <input
        type="date"
        className="border p-2 w-full"
        value={task.dueDate}
        onChange={(e) => setTask({ ...task, dueDate: e.target.value })}
      />

      <button className="bg-blue-600 text-white px-4 py-2 w-full" type="submit">
        Add Task
      </button>
    </form>
  );
}
