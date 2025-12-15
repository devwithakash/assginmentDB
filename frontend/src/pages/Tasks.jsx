import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import API from "../api/axios";

export default function Tasks() {
  const [tasks, setTasks] = useState([]);
  const [search, setSearch] = useState("");

  const loadTasks = async () => {
    try {
      const res = await API.get(`/tasks?keyword=${search}`);
      // ✅ FIX: backend array ya object dono handle
      setTasks(Array.isArray(res.data) ? res.data : res.data.tasks || []);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    loadTasks();
  }, [search]);

  const remove = async (id) => {
    try {
      await API.delete(`/tasks/${id}`);
      setTasks(tasks.filter((t) => t._id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">Tasks</h2>

      <input
        placeholder="Search by title or category"
        className="border p-2 mb-4 w-full"
        onChange={(e) => setSearch(e.target.value)}
      />

      <Link
        to="/tasks/add"
        className="text-blue-600 mb-4 inline-block"
      >
        + Add Task
      </Link>

      {tasks.length === 0 && (
        <p className="text-gray-500 mt-4">No tasks found</p>
      )}

      {tasks.map((task) => (
        <div key={task._id} className="border p-3 my-2">
          <h3 className="font-bold">{task.title}</h3>
          <p>Status: {task.status || "pending"}</p>
          <p>Category: {task.category}</p>

          <Link
            to={`/tasks/add?id=${task._id}`}
            className="mr-3 text-blue-600"
          >
            Edit
          </Link>

          <button
            onClick={() => remove(task._id)}
            className="text-red-600"
          >
            Delete
          </button>
        </div>
      ))}
    </div>
  );
}
