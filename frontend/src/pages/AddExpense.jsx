import { useState, useEffect, useContext } from "react";
import API from "../api/api";
import { useNavigate, useSearchParams } from "react-router-dom";
import { DashboardRefreshContext } from "./Dashboard";

export default function AddExpense() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const id = searchParams.get("id"); // Get ID from URL
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

  const [loading, setLoading] = useState(false);

  // 1. Fetch data if in Edit Mode
  useEffect(() => {
    if (id) {
      const fetchExpense = async () => {
        try {
          const { data } = await API.get(`/expenses/${id}`);
          // Format date for input field (YYYY-MM-DD)
          if (data.date) data.date = data.date.slice(0, 10);
          setExpense(data);
        } catch (err) {
          console.error("Failed to load expense", err);
          alert("Could not load expense details.");
        }
      };
      fetchExpense();
    }
  }, [id]);

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Prepare payload
    const payload = {
      ...expense,
      categoryOther: expense.category === "Other" ? expense.categoryOther : undefined,
      paymentMethodOther: expense.paymentMethod === "Other" ? expense.paymentMethodOther : undefined,
    };

    try {
      if (id) {
        // UPDATE existing
        await API.put(`/expenses/${id}`, payload);
      } else {
        // CREATE new
        await API.post("/expenses", payload);
      }
      refresh(); 
      navigate("/expenses");
    } catch (error) {
      console.error("Error saving expense:", error);
      alert("Failed to save expense.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={submit} className="p-6 space-y-4 max-w-lg mx-auto bg-white rounded shadow mt-6">
      <h2 className="text-2xl font-bold mb-4 text-gray-800">
        {id ? "Edit Expense" : "Add Expense"}
      </h2>

      <div>
        <label className="block text-sm font-medium text-gray-700">Title</label>
        <input
          required
          placeholder="e.g. Grocery"
          className="border p-2 w-full rounded mt-1"
          value={expense.title}
          onChange={(e) => setExpense({ ...expense, title: e.target.value })}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Amount</label>
        <input
          required
          type="number"
          placeholder="0"
          className="border p-2 w-full rounded mt-1"
          value={expense.amount}
          onChange={(e) => setExpense({ ...expense, amount: Number(e.target.value) })}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Type</label>
          <select
            className="border p-2 w-full rounded mt-1"
            value={expense.type}
            onChange={(e) => setExpense({ ...expense, type: e.target.value })}
          >
            {types.map((t) => (
              <option key={t} value={t}>{t.charAt(0).toUpperCase() + t.slice(1)}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Date</label>
          <input
            required
            type="date"
            className="border p-2 w-full rounded mt-1"
            value={expense.date}
            onChange={(e) => setExpense({ ...expense, date: e.target.value })}
          />
        </div>
      </div>

      {/* CATEGORY SECTION */}
      <div>
        <label className="block text-sm font-medium text-gray-700">Category</label>
        <select
          required
          className="border p-2 w-full rounded mt-1"
          value={expense.category}
          onChange={(e) => setExpense({ ...expense, category: e.target.value })}
        >
          <option value="">Select Category</option>
          {categories.map((c) => <option key={c} value={c}>{c}</option>)}
        </select>
      </div>

      {expense.category === "Other" && (
        <input
          required
          placeholder="Specify category name"
          className="border p-2 w-full rounded mt-1 bg-gray-50"
          value={expense.categoryOther}
          onChange={(e) => setExpense({ ...expense, categoryOther: e.target.value })}
        />
      )}

      {/* PAYMENT METHOD SECTION */}
      <div>
        <label className="block text-sm font-medium text-gray-700">Payment Method</label>
        <select
          required
          className="border p-2 w-full rounded mt-1"
          value={expense.paymentMethod}
          onChange={(e) => setExpense({ ...expense, paymentMethod: e.target.value })}
        >
          <option value="">Select Method</option>
          {paymentMethods.map((p) => <option key={p} value={p}>{p}</option>)}
        </select>
      </div>

      {expense.paymentMethod === "Other" && (
        <input
          required
          placeholder="Specify payment method"
          className="border p-2 w-full rounded mt-1 bg-gray-50"
          value={expense.paymentMethodOther}
          onChange={(e) => setExpense({ ...expense, paymentMethodOther: e.target.value })}
        />
      )}

      <button 
        disabled={loading}
        className="bg-blue-600 text-white px-4 py-2 w-full rounded hover:bg-blue-700 transition disabled:opacity-50" 
        type="submit"
      >
        {loading ? "Saving..." : (id ? "Update Expense" : "Add Expense")}
      </button>
    </form>
  );
}