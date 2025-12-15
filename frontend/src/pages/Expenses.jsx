import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import API from "../api/axios";

export default function Expenses() {
  const [expenses, setExpenses] = useState([]);
  const [search, setSearch] = useState("");

  const loadExpenses = async () => {
    try {
      const res = await API.get(`/expenses?keyword=${search}`);
      // ✅ FIX: backend array ya object dono handle
      setExpenses(Array.isArray(res.data) ? res.data : res.data.expenses || []);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    loadExpenses();
  }, [search]);

  const remove = async (id) => {
    try {
      await API.delete(`/expenses/${id}`);
      setExpenses(expenses.filter((e) => e._id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">Expenses</h2>

      <input
        placeholder="Search by title or category"
        className="border p-2 mb-4 w-full"
        onChange={(e) => setSearch(e.target.value)}
      />

      <Link
        to="/expenses/add"
        className="text-blue-600 mb-4 inline-block"
      >
        + Add Expense
      </Link>

      {expenses.length === 0 && (
        <p className="text-gray-500 mt-4">No expenses found</p>
      )}

      {expenses.map((exp) => (
        <div key={exp._id} className="border p-3 my-2">
          <h3 className="font-bold">
            {exp.title} - ₹{exp.amount}
          </h3>
          <p>Category: {exp.category}</p>
          <p>Payment Method: {exp.paymentMethod}</p>

          <Link
            to={`/expenses/add?id=${exp._id}`}
            className="mr-3 text-blue-600"
          >
            Edit
          </Link>

          <button
            onClick={() => remove(exp._id)}
            className="text-red-600"
          >
            Delete
          </button>
        </div>
      ))}
    </div>
  );
}
