import { useEffect, useState } from "react";
import API from "../api/api";
import Pagination from "../components/Pagination";

export default function Admin() {
  const [stats, setStats] = useState({ users: 0, expenses: 0, tasks: 0 });
  const [activeTab, setActiveTab] = useState("users");
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [keyword, setKeyword] = useState(""); // <--- New State

  // 1. Load Stats
  useEffect(() => {
    API.get("/admin/dashboard")
      .then((res) => setStats(res.data))
      .catch((err) => console.error("Admin stats error:", err));
  }, []);

  // 2. Load Data (now depends on keyword)
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        // Pass keyword to API
        const res = await API.get(`/admin/${activeTab}?page=${page}&limit=10&keyword=${keyword}`);
        setData(res.data[activeTab]);
        setTotalPages(res.data.totalPages);
      } catch (err) {
        console.error("Load data error:", err);
      } finally {
        setLoading(false);
      }
    };

    // Debounce search (optional but good practice) or just load on effect
    const timeout = setTimeout(() => {
      loadData();
    }, 500);

    return () => clearTimeout(timeout);
  }, [activeTab, page, keyword]); // Reload when these change

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setPage(1);
    setKeyword(""); // Clear search when switching tabs
    setData([]);
  };

  return (
    <div className="p-6 min-h-screen bg-gray-50">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Admin Portal</h1>

      {/* STATS CARDS (No changes here) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded shadow border-l-4 border-blue-500">
          <h3 className="text-gray-500 text-sm font-semibold">TOTAL USERS</h3>
          <p className="text-3xl font-bold text-gray-800">{stats.users}</p>
        </div>
        <div className="bg-white p-6 rounded shadow border-l-4 border-green-500">
          <h3 className="text-gray-500 text-sm font-semibold">TOTAL EXPENSES</h3>
          <p className="text-3xl font-bold text-gray-800">{stats.expenses}</p>
        </div>
        <div className="bg-white p-6 rounded shadow border-l-4 border-yellow-500">
          <h3 className="text-gray-500 text-sm font-semibold">TOTAL TASKS</h3>
          <p className="text-3xl font-bold text-gray-800">{stats.tasks}</p>
        </div>
      </div>

      {/* TABS + SEARCH BAR */}
      <div className="flex flex-col md:flex-row justify-between items-center border-b mb-6 gap-4">
        <div className="flex space-x-4">
          {["users", "expenses", "tasks"].map((tab) => (
            <button
              key={tab}
              onClick={() => handleTabChange(tab)}
              className={`pb-2 px-4 capitalize font-medium transition ${
                activeTab === tab
                  ? "border-b-2 border-blue-600 text-blue-600"
                  : "text-gray-500 hover:text-blue-500"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* SEARCH INPUT */}
        <input 
          placeholder={`Search ${activeTab}...`}
          className="border p-2 rounded w-full md:w-64 mb-2 md:mb-0"
          value={keyword}
          onChange={(e) => {
            setKeyword(e.target.value);
            setPage(1); // Reset to page 1 on search
          }}
        />
      </div>

      {/* DATA LIST (Rest of the component remains the same) */}
      <div className="bg-white rounded shadow overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-gray-500">Loading data...</div>
        ) : (
          <table className="w-full text-left border-collapse">
            <thead className="bg-gray-100 border-b">
              <tr>
                {activeTab === "users" && (
                  <>
                    <th className="p-4">Name</th>
                    <th className="p-4">Email</th>
                    <th className="p-4">Role</th>
                  </>
                )}
                {activeTab === "expenses" && (
                  <>
                    <th className="p-4">User</th>
                    <th className="p-4">Title</th>
                    <th className="p-4">Amount</th>
                    <th className="p-4">Date</th>
                  </>
                )}
                {activeTab === "tasks" && (
                  <>
                    <th className="p-4">User</th>
                    <th className="p-4">Title</th>
                    <th className="p-4">Status</th>
                    <th className="p-4">Priority</th>
                  </>
                )}
              </tr>
            </thead>
            <tbody>
              {data.length === 0 ? (
                <tr><td colSpan="4" className="p-6 text-center text-gray-500">No records found</td></tr>
              ) : (
                data.map((item) => (
                  <tr key={item._id} className="border-b hover:bg-gray-50">
                    {activeTab === "users" && (
                      <>
                        <td className="p-4 font-medium">{item.name}</td>
                        <td className="p-4">{item.email}</td>
                        <td className="p-4">
                          <span className={`px-2 py-1 rounded text-xs ${item.role === 'admin' ? 'bg-purple-100 text-purple-700' : 'bg-gray-100 text-gray-700'}`}>
                            {item.role}
                          </span>
                        </td>
                      </>
                    )}
                    {activeTab === "expenses" && (
                      <>
                        <td className="p-4 text-gray-600">{item.user?.name || "Unknown"}</td>
                        <td className="p-4 font-medium">{item.title}</td>
                        <td className="p-4 text-red-600 font-bold">₹{item.amount}</td>
                        <td className="p-4 text-sm text-gray-500">{new Date(item.date).toLocaleDateString()}</td>
                      </>
                    )}
                    {activeTab === "tasks" && (
                      <>
                        <td className="p-4 text-gray-600">{item.user?.name || "Unknown"}</td>
                        <td className="p-4 font-medium">{item.title}</td>
                        <td className="p-4"><span className="uppercase text-xs font-bold bg-blue-50 text-blue-600 px-2 py-1 rounded">{item.status}</span></td>
                        <td className="p-4 text-sm">{item.priority}</td>
                      </>
                    )}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        )}
      </div>

      {totalPages > 1 && (
        <Pagination page={page} totalPages={totalPages} setPage={setPage} />
      )}
    </div>
  );
}