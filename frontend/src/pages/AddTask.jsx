import { useState, useEffect, useContext } from "react";
import API from "../api/api";
import { useNavigate, useSearchParams } from "react-router-dom";
import { DashboardRefreshContext } from "./Dashboard";

export default function AddTask() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const id = searchParams.get("id"); // Get ID from URL
  const { refresh } = useContext(DashboardRefreshContext);

  const priorities = ["low", "medium", "high"];
  const statuses = ["pending", "in-progress", "completed"];
  const categories = ["Work", "Personal", "Other"]; // Added Categories

  const [task, setTask] = useState({
    title: "",
    description: "",
    priority: "low",
    status: "pending",
    category: "Work", // Default category
    dueDate: new Date().toISOString().slice(0, 10),
  });

  const [loading, setLoading] = useState(false);

  // 1. Fetch data if Edit Mode
  useEffect(() => {
    if (id) {
      const fetchTask = async () => {
        try {
          const { data } = await API.get(`/tasks/${id}`);
          // Format date
          if (data.dueDate) data.dueDate = data.dueDate.slice(0, 10);
          setTask(data);
        } catch (err) {
          console.error("Failed to load task", err);
        }
      };
      fetchTask();
    }
  }, [id]);

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (id) {
        // Update
        await API.put(`/tasks/${id}`, task);
      } else {
        // Create
        await API.post("/tasks", task);
      }
      refresh();
      navigate("/tasks");
    } catch (error) {
      console.error("Error saving task", error);
      alert("Failed to save task");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={submit} className="p-6 space-y-4 max-w-lg mx-auto bg-white rounded shadow mt-6">
      <h2 className="text-2xl font-bold mb-4 text-gray-800">
        {id ? "Edit Task" : "Add Task"}
      </h2>

      <div>
        <label className="block text-sm font-medium text-gray-700">Title</label>
        <input
          required
          placeholder="Task Title"
          className="border p-2 w-full rounded mt-1"
          value={task.title}
          onChange={(e) => setTask({ ...task, title: e.target.value })}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Description</label>
        <textarea
          placeholder="Task Description"
          className="border p-2 w-full rounded mt-1"
          rows="3"
          value={task.description}
          onChange={(e) => setTask({ ...task, description: e.target.value })}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Priority</label>
          <select
            className="border p-2 w-full rounded mt-1"
            value={task.priority}
            onChange={(e) => setTask({ ...task, priority: e.target.value })}
          >
            {priorities.map((p) => (
              <option key={p} value={p}>{p.charAt(0).toUpperCase() + p.slice(1)}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Category</label>
          <select
            className="border p-2 w-full rounded mt-1"
            value={task.category}
            onChange={(e) => setTask({ ...task, category: e.target.value })}
          >
            {categories.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Status</label>
          <select
            className="border p-2 w-full rounded mt-1"
            value={task.status}
            onChange={(e) => setTask({ ...task, status: e.target.value })}
          >
            {statuses.map((s) => (
              <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Due Date</label>
          <input
            type="date"
            className="border p-2 w-full rounded mt-1"
            value={task.dueDate}
            onChange={(e) => setTask({ ...task, dueDate: e.target.value })}
          />
        </div>
      </div>

      <button 
        disabled={loading}
        className="bg-blue-600 text-white px-4 py-2 w-full rounded hover:bg-blue-700 transition disabled:opacity-50" 
        type="submit"
      >
        {loading ? "Saving..." : (id ? "Update Task" : "Add Task")}
      </button>
    </form>
  );
}