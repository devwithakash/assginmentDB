import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../api/axios";

export default function TaskDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [task, setTask] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    API.get(`/tasks/${id}`)
      .then(res => setTask(res.data))
      .finally(() => setLoading(false));
  }, [id]);

  const deleteTask = async () => {
    if (!window.confirm("Delete this task?")) return;
    await API.delete(`/tasks/${id}`);
    navigate("/tasks");
  };

  if (loading) return <p className="p-6">Loading...</p>;
  if (!task) return <p className="p-6">Task not found</p>;

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-2">{task.title}</h2>

      <p><b>Description:</b> {task.description}</p>
      <p><b>Status:</b> {task.status}</p>
      <p><b>Priority:</b> {task.priority}</p>
      <p><b>Category:</b> {task.category}</p>
      <p><b>Due Date:</b> {task.dueDate?.slice(0, 10)}</p>

      <div className="mt-4">
        <button
          onClick={() => navigate(`/tasks/add?id=${task._id}`)}
          className="bg-blue-600 text-white px-4 py-2 mr-2"
        >
          Edit
        </button>

        <button
          onClick={deleteTask}
          className="bg-red-600 text-white px-4 py-2"
        >
          Delete
        </button>
      </div>
    </div>
  );
}
