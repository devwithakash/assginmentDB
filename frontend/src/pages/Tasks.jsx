import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import API from "../api/api";
import Pagination from "../components/Pagination";

export default function Tasks() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);

  // Pagination & Sorting State
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalTasks, setTotalTasks] = useState(0);
  const [sortBy, setSortBy] = useState("dueDate"); // 'dueDate' or 'priority'
  const [order, setOrder] = useState("asc");       // 'asc' or 'desc'

  // Filter State
  const [filters, setFilters] = useState({
    keyword: "",
    status: "",
    priority: "",
  });

  // Load Data
  const loadTasks = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page,
        limit: 10,
        sortBy,
        order,
        ...filters
      });

      // Remove empty filters
      for (const [key, value] of params.entries()) {
        if (!value) params.delete(key);
      }

      const res = await API.get(`/tasks?${params.toString()}`);
      
      setTasks(res.data.tasks);
      setTotalPages(res.data.totalPages);
      setTotalTasks(res.data.total);
    } catch (err) {
      console.error("Failed to load tasks", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTasks();
  }, [page, filters, sortBy, order]);

  // Handle Input Changes
  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
    setPage(1); 
  };

  const handleSortChange = (e) => {
    const value = e.target.value;
    if (value === "priority_desc") {
      setSortBy("priority");
      setOrder("desc"); // High to Low
    } else if (value === "priority_asc") {
      setSortBy("priority");
      setOrder("asc"); // Low to High
    } else if (value === "date_asc") {
      setSortBy("dueDate");
      setOrder("asc"); // Earliest first
    } else if (value === "date_desc") {
      setSortBy("dueDate");
      setOrder("desc"); // Latest first
    }
    setPage(1);
  };

  const remove = async (id) => {
    if(!window.confirm("Delete this task?")) return;
    try {
      await API.delete(`/tasks/${id}`);
      loadTasks();
    } catch (err) {
      console.error(err);
    }
  };

  const getPriorityColor = (p) => {
    if (p === "high") return "text-red-600 font-bold";
    if (p === "medium") return "text-yellow-600 font-bold";
    return "text-green-600 font-bold";
  };

  return (
    <div className="p-6 min-h-screen bg-gray-50">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">My Tasks</h2>
        <Link to="/tasks/add" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition">
          + Add Task
        </Link>
      </div>

      {/* 🔍 FILTERS & SORTING */}
      <div className="bg-white p-4 rounded shadow mb-6 grid grid-cols-1 md:grid-cols-4 gap-4">
        
        {/* Search */}
        <input
          name="keyword"
          placeholder="Search tasks..."
          className="border p-2 rounded"
          value={filters.keyword}
          onChange={handleFilterChange}
        />

        {/* Status Filter */}
        <select name="status" className="border p-2 rounded" onChange={handleFilterChange}>
          <option value="">All Statuses</option>
          <option value="pending">Pending</option>
          <option value="in-progress">In Progress</option>
          <option value="completed">Completed</option>
        </select>

        {/* Priority Filter */}
        <select name="priority" className="border p-2 rounded" onChange={handleFilterChange}>
          <option value="">All Priorities</option>
          <option value="high">High</option>
          <option value="medium">Medium</option>
          <option value="low">Low</option>
        </select>

        {/* SORTING Dropdown */}
        <select className="border p-2 rounded bg-gray-100" onChange={handleSortChange}>
          <option value="date_asc">Due Date: Earliest First</option>
          <option value="date_desc">Due Date: Latest First</option>
          <option value="priority_desc">Priority: High to Low</option>
          <option value="priority_asc">Priority: Low to High</option>
        </select>
      </div>

      {/* 📋 TASK LIST */}
      {loading ? (
        <p className="text-center text-gray-500">Loading...</p>
      ) : tasks.length === 0 ? (
        <p className="text-center text-gray-500 mt-10">No tasks found.</p>
      ) : (
        <div className="grid gap-4">
          {tasks.map((task) => (
            <div key={task._id} className="bg-white p-4 rounded shadow flex justify-between items-center hover:shadow-md transition">
              <div>
                <h3 className="font-bold text-lg text-gray-800">
                  {task.title} <span className="text-xs text-gray-400 font-normal">({task.category})</span>
                </h3>
                <p className="text-sm text-gray-500">
                  Due: {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : "No Date"}
                </p>
                <p className="text-xs text-gray-400 mt-1">
                   Status: <span className="uppercase">{task.status}</span>
                </p>
              </div>
              
              <div className="text-right">
                <p className={`uppercase ${getPriorityColor(task.priority)}`}>
                  {task.priority}
                </p>
                <div className="mt-2 text-sm space-x-3">
                  <Link to={`/tasks/add?id=${task._id}`} className="text-blue-500 hover:underline">Edit</Link>
                  <button onClick={() => remove(task._id)} className="text-red-500 hover:underline">Delete</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      
      {totalTasks > 10 && (
        <Pagination page={page} totalPages={totalPages} setPage={setPage} />
      )}
    </div>
  );
}