import { useState, useContext } from "react";
import API from "../api/api";
import { useNavigate } from "react-router-dom";
import { DashboardRefreshContext } from "./Dashboard";

export default function AddExpense() {
  const navigate = useNavigate();
  const { refresh } = useContext(DashboardRefreshContext);

  const categories = ["Food", "Bills", "Travel", "Shopping", "Other"];
  const paymentMethods = ["Cash", "Card", "UPI", "Bank Transfer", "Other"];
  const types = ["income", "expense"];

  const [expense, setExpense] = useState({
    title: "",
    amount: 0,
    category: "",
    categoryOther: "",
    paymentMethod: "",
    paymentMethodOther: "",
    type: "expense",
    date: new Date().toISOString().slice(0, 10),
  });

  const submit = async (e) => {
    e.preventDefault();
    // If "Other" selected, use other input value
    const payload = {
      ...expense,
      categoryOther: expense.category === "Other" ? expense.categoryOther : undefined,
      paymentMethodOther: expense.paymentMethod === "Other" ? expense.paymentMethodOther : undefined,
    };
    await API.post("/expenses", payload);
    refresh(); // Refresh dashboard
    navigate("/expenses");
  };

  return (
    <form onSubmit={submit} className="p-6 space-y-2">
      <h2 className="text-xl font-bold mb-4">Add Expense</h2>

      <input
        placeholder="Title"
        className="border p-2 w-full"
        value={expense.title}
        onChange={(e) => setExpense({ ...expense, title: e.target.value })}
      />

      <input
        type="number"
        placeholder="Amount"
        className="border p-2 w-full"
        value={expense.amount}
        onChange={(e) => setExpense({ ...expense, amount: Number(e.target.value) })}
      />

      <select
        className="border p-2 w-full"
        value={expense.type}
        onChange={(e) => setExpense({ ...expense, type: e.target.value })}
      >
        {types.map((t) => (
          <option key={t} value={t}>
            {t.charAt(0).toUpperCase() + t.slice(1)}
          </option>
        ))}
      </select>

      <select
        className="border p-2 w-full"
        value={expense.category}
        onChange={(e) => setExpense({ ...expense, category: e.target.value })}
      >
        <option value="">Select Category</option>
        {categories.map((c) => (
          <option key={c} value={c}>
            {c}
          </option>
        ))}
      </select>

      {expense.category === "Other" && (
        <input
          placeholder="Specify category"
          className="border p-2 w-full"
          value={expense.categoryOther}
          onChange={(e) => setExpense({ ...expense, categoryOther: e.target.value })}
        />
      )}

      <select
        className="border p-2 w-full"
        value={expense.paymentMethod}
        onChange={(e) => setExpense({ ...expense, paymentMethod: e.target.value })}
      >
        <option value="">Select Payment Method</option>
        {paymentMethods.map((p) => (
          <option key={p} value={p}>
            {p}
          </option>
        ))}
      </select>

      {expense.paymentMethod === "Other" && (
        <input
          placeholder="Specify payment method"
          className="border p-2 w-full"
          value={expense.paymentMethodOther}
          onChange={(e) => setExpense({ ...expense, paymentMethodOther: e.target.value })}
        />
      )}

      <input
        type="date"
        className="border p-2 w-full"
        value={expense.date}
        onChange={(e) => setExpense({ ...expense, date: e.target.value })}
      />

      <button className="bg-blue-600 text-white px-4 py-2 w-full" type="submit">
        Add Expense
      </button>
    </form>
  );
}
