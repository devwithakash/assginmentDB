import { useEffect, useState } from "react";
import API from "../api/axios";

export default function Admin() {
  const [users, setUsers] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    const loadAdminData = async () => {
      const usersRes = await API.get("/admin/users");
      const expensesRes = await API.get("/admin/expenses");
      const tasksRes = await API.get("/admin/tasks");

      setUsers(usersRes.data);
      setExpenses(expensesRes.data);
      setTasks(tasksRes.data);
    };

    loadAdminData();
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Admin Dashboard</h1>

      {/* USERS */}
      <h2 className="text-xl font-semibold mb-2">Users</h2>
      <ul className="mb-6 list-disc pl-6">
        {users.map((u) => (
          <li key={u._id}>
            {u.name} — {u.email} — <b>{u.role}</b>
          </li>
        ))}
      </ul>

      {/* EXPENSES */}
      <h2 className="text-xl font-semibold mb-2">All Expenses</h2>
      <table className="w-full border mb-6">
        <thead className="bg-gray-200">
          <tr>
            <th>User</th>
            <th>Title</th>
            <th>Amount</th>
            <th>Type</th>
            <th>Category</th>
          </tr>
        </thead>
        <tbody>
          {expenses.map((e) => (
            <tr key={e._id} className="border-t">
              <td>{e.user?.name}</td>
              <td>{e.title}</td>
              <td>{e.amount}</td>
              <td>{e.type}</td>
              <td>{e.category}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* TASKS */}
      <h2 className="text-xl font-semibold mb-2">All Tasks</h2>
      <table className="w-full border">
        <thead className="bg-gray-200">
          <tr>
            <th>User</th>
            <th>Title</th>
            <th>Status</th>
            <th>Priority</th>
          </tr>
        </thead>
        <tbody>
          {tasks.map((t) => (
            <tr key={t._id} className="border-t">
              <td>{t.user?.name}</td>
              <td>{t.title}</td>
              <td>{t.status}</td>
              <td>{t.priority}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
