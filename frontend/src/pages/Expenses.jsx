import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import API from "../api/api";
import Pagination from "../components/Pagination";

export default function Expenses() {
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(false);
  
  // Pagination State
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalExpenses, setTotalExpenses] = useState(0);

  // Filter State
  const [filters, setFilters] = useState({
    keyword: "",
    category: "",
    type: "",
    paymentMethod: "",
    startDate: "",
    endDate: "",
    minAmount: "",
    maxAmount: ""
  });

  // Load Data
  const loadExpenses = async () => {
    setLoading(true);
    try {
      // Build Query String
      const params = new URLSearchParams({
        page,
        limit: 10,
        ...filters // Spread all filters into query params
      });

      // Remove empty filters
      for (const [key, value] of params.entries()) {
        if (!value) params.delete(key);
      }

      const res = await API.get(`/expenses?${params.toString()}`);
      
      setExpenses(res.data.expenses);
      setTotalPages(res.data.totalPages);
      setTotalExpenses(res.data.total);
    } catch (err) {
      console.error("Failed to load expenses", err);
    } finally {
      setLoading(false);
    }
  };

  // Trigger load on Page or Filter change
  useEffect(() => {
    loadExpenses();
  }, [page, filters]); // Reload when these change

  // Handle Input Change
  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
    setPage(1); // Reset to page 1 on filter change
  };

  const remove = async (id) => {
    if(!window.confirm("Are you sure?")) return;
    try {
      await API.delete(`/expenses/${id}`);
      loadExpenses(); // Reload list
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="p-6 min-h-screen bg-gray-50">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">My Expenses</h2>
        <Link to="/expenses/add" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition">
          + Add Expense
        </Link>
      </div>

      {/* 🔍 FILTERS SECTION */}
      <div className="bg-white p-4 rounded shadow mb-6 grid grid-cols-1 md:grid-cols-4 gap-4">
        
        {/* Search */}
        <input
          name="keyword"
          placeholder="Search title/desc..."
          className="border p-2 rounded"
          value={filters.keyword}
          onChange={handleFilterChange}
        />

        {/* Category */}
        <select name="category" className="border p-2 rounded" onChange={handleFilterChange}>
          <option value="">All Categories</option>
          <option value="Food">Food</option>
          <option value="Bills">Bills</option>
          <option value="Travel">Travel</option>
          <option value="Shopping">Shopping</option>
          <option value="Other">Other</option>
        </select>

        {/* Type */}
        <select name="type" className="border p-2 rounded" onChange={handleFilterChange}>
          <option value="">All Types</option>
          <option value="expense">Expense</option>
          <option value="income">Income</option>
        </select>

        {/* Payment Method */}
        <select name="paymentMethod" className="border p-2 rounded" onChange={handleFilterChange}>
          <option value="">All Payment Methods</option>
          <option value="Cash">Cash</option>
          <option value="Card">Card</option>
          <option value="UPI">UPI</option>
        </select>

        {/* Date Range */}
        <input type="date" name="startDate" className="border p-2 rounded" onChange={handleFilterChange} />
        <input type="date" name="endDate" className="border p-2 rounded" onChange={handleFilterChange} />

        {/* Amount Range */}
        <input type="number" name="minAmount" placeholder="Min Amount" className="border p-2 rounded" onChange={handleFilterChange} />
        <input type="number" name="maxAmount" placeholder="Max Amount" className="border p-2 rounded" onChange={handleFilterChange} />
      </div>

      {/* 📋 LIST SECTION */}
      {loading ? (
        <p className="text-center text-gray-500">Loading...</p>
      ) : expenses.length === 0 ? (
        <p className="text-center text-gray-500 mt-10">No expenses found matching filters.</p>
      ) : (
        <div className="grid gap-4">
          {expenses.map((exp) => (
            <div key={exp._id} className="bg-white p-4 rounded shadow flex justify-between items-center hover:shadow-md transition">
              <div>
                <h3 className="font-bold text-lg text-gray-800">{exp.title}</h3>
                <p className="text-sm text-gray-500">
                  {new Date(exp.date).toLocaleDateString()} • {exp.category} • {exp.paymentMethod}
                </p>
                {exp.description && <p className="text-xs text-gray-400 mt-1">{exp.description}</p>}
              </div>
              
              <div className="text-right">
                <p className={`text-xl font-bold ${exp.type === 'income' ? 'text-green-600' : 'text-red-600'}`}>
                  {exp.type === 'income' ? '+' : '-'}₹{exp.amount}
                </p>
                <div className="mt-2 text-sm space-x-3">
                  <Link to={`/expenses/add?id=${exp._id}`} className="text-blue-500 hover:underline">Edit</Link>
                  <button onClick={() => remove(exp._id)} className="text-red-500 hover:underline">Delete</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 📄 PAGINATION */}
      {totalExpenses > 10 && (
        <Pagination page={page} totalPages={totalPages} setPage={setPage} />
      )}
    </div>
  );
}