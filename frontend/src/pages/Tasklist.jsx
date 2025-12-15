import { useEffect, useState } from "react";
import axios from "../../api/axios";
import { Link } from "react-router-dom";

export default function TaskList() {
  const [tasks, setTasks] = useState([]);
  const [search, setSearch] = useState("");

  const loadTasks = async () => {
    const res = await axios.get(`/tasks?keyword=${search}`);
    setTasks(res.data.tasks);
  };

  useEffect(() => {
    loadTasks();
  }, [search]);

  return (
    <>
      <h2>Tasks</h2>

      <input
        placeholder="Search by title or category"
        onChange={(e) => setSearch(e.target.value)}
      />

      <Link to="/tasks/add">Add Task</Link>

      <ul>
        {tasks.map(t => (
          <li key={t._id}>
            <Link to={`/tasks/${t._id}`}>{t.title}</Link> - {t.status}
          </li>
        ))}
      </ul>
    </>
  );
}
