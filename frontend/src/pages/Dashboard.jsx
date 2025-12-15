// import { useEffect, useState, createContext, useContext } from "react";
// import API from "../api/axios";
// import { Pie, Bar } from "react-chartjs-2";
// import {
//   Chart as ChartJS,
//   ArcElement,
//   Tooltip,
//   Legend,
//   CategoryScale,
//   LinearScale,
//   BarElement,
// } from "chart.js";

// ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement);

// // Context to trigger refresh from other components
// export const DashboardRefreshContext = createContext({
//   refresh: () => {},
// });

// export default function Dashboard() {
//   const [totals, setTotals] = useState({
//     totalIncome: 0,
//     totalExpense: 0,
//     netBalance: 0,
//   });
//   const [expenseCat, setExpenseCat] = useState([]);
//   const [taskStatus, setTaskStatus] = useState([]);
//   const [recentExpenses, setRecentExpenses] = useState([]);
//   const [recentTasks, setRecentTasks] = useState([]);
//   const [updateFlag, setUpdateFlag] = useState(false); // refresh trigger

//   // Function to trigger refresh
//   const refreshDashboard = () => setUpdateFlag(prev => !prev);

//   const loadDashboard = async () => {
//     try {
//       // Totals
//       const totalsRes = await API.get("/expenses/summary/totals");
//       setTotals(totalsRes.data);

//       // Category summary
//       const categoryRes = await API.get("/expenses/summary/category");
//       setExpenseCat(Array.isArray(categoryRes.data) ? categoryRes.data : []);

//       // Task status summary
//       const statusRes = await API.get("/tasks/summary/status");
//       const statusArray = Array.isArray(statusRes.data)
//         ? statusRes.data
//         : Object.keys(statusRes.data || {}).map((key) => ({
//             _id: key,
//             count: statusRes.data[key],
//           }));
//       setTaskStatus(statusArray);

//       // Recent expenses
//       const recentExpRes = await API.get("/expenses/recent");
//       setRecentExpenses(Array.isArray(recentExpRes.data) ? recentExpRes.data : []);

//       // Recent tasks
//       const recentTasksRes = await API.get("/tasks/recent");
//       setRecentTasks(Array.isArray(recentTasksRes.data) ? recentTasksRes.data : []);
//     } catch (err) {
//       console.error("Dashboard load error:", err);
//     }
//   };

//   // Reload dashboard whenever updateFlag changes
//   useEffect(() => {
//     loadDashboard();
//   }, [updateFlag]);

//   return (
//     <DashboardRefreshContext.Provider value={{ refresh: refreshDashboard }}>
//       <div className="p-6">
//         <h1 className="text-2xl font-bold mb-6">Dashboard</h1>

//         {/* SUMMARY CARDS */}
//         <div className="grid grid-cols-3 gap-4 mb-6">
//           <div className="border p-4 rounded">Income ₹{totals.totalIncome}</div>
//           <div className="border p-4 rounded">Expense ₹{totals.totalExpense}</div>
//           <div className="border p-4 rounded">Balance ₹{totals.netBalance}</div>
//         </div>

//         {/* CHARTS */}
//         <div className="grid grid-cols-2 gap-6 mb-6">
//           <Pie
//             data={{
//               labels: expenseCat.map((e) => e._id),
//               datasets: [
//                 {
//                   label: "Expenses",
//                   data: expenseCat.map((e) => e.total),
//                   backgroundColor: ["#f87171", "#34d399", "#60a5fa", "#facc15", "#a78bfa"],
//                 },
//               ],
//             }}
//           />

//           <Bar
//             data={{
//               labels: taskStatus.map((t) => t._id),
//               datasets: [
//                 {
//                   label: "Tasks",
//                   data: taskStatus.map((t) => t.count),
//                   backgroundColor: ["#3b82f6", "#fbbf24", "#34d399"],
//                 },
//               ],
//             }}
//           />
//         </div>

//         {/* RECENT DATA */}
//         <div className="grid grid-cols-2 gap-6">
//           <div>
//             <h3 className="font-bold mb-2">Recent Expenses</h3>
//             {recentExpenses.length === 0 ? (
//               <p>No recent expenses</p>
//             ) : (
//               recentExpenses.map((e) => (
//                 <p key={e._id}>
//                   {e.title} – ₹{e.amount} ({e.category})
//                 </p>
//               ))
//             )}
//           </div>

//           <div>
//             <h3 className="font-bold mb-2">Recent Tasks</h3>
//             {recentTasks.length === 0 ? (
//               <p>No recent tasks</p>
//             ) : (
//               recentTasks.map((t) => (
//                 <p key={t._id}>
//                   {t.title} – {t.status} ({t.priority})
//                 </p>
//               ))
//             )}
//           </div>
//         </div>
//       </div>
//     </DashboardRefreshContext.Provider>
//   );
// }


import { useEffect, useState, createContext } from "react";
import API from "../api/axios";
import { Pie, Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
} from "chart.js";

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement
);

export const DashboardRefreshContext = createContext({
  refresh: () => {},
});

export default function Dashboard() {
  const [totals, setTotals] = useState({
    totalIncome: 0,
    totalExpense: 0,
    netBalance: 0,
  });
  const [expenseCat, setExpenseCat] = useState([]);
  const [taskStatus, setTaskStatus] = useState([]);
  const [recentExpenses, setRecentExpenses] = useState([]);
  const [recentTasks, setRecentTasks] = useState([]);
  const [updateFlag, setUpdateFlag] = useState(false);

  const refreshDashboard = () => setUpdateFlag((prev) => !prev);

  const loadDashboard = async () => {
    try {
      const totalsRes = await API.get("/expenses/summary/totals");
      setTotals(totalsRes.data);

      const categoryRes = await API.get("/expenses/summary/category");
      setExpenseCat(categoryRes.data || []);

      const statusRes = await API.get("/tasks/summary/status");
      setTaskStatus(
        Array.isArray(statusRes.data)
          ? statusRes.data
          : Object.keys(statusRes.data || {}).map((key) => ({
              _id: key,
              count: statusRes.data[key],
            }))
      );

      const recentExpRes = await API.get("/expenses/recent");
      setRecentExpenses(recentExpRes.data || []);

      const recentTasksRes = await API.get("/tasks/recent");
      setRecentTasks(recentTasksRes.data || []);
    } catch (err) {
      console.error("Dashboard error:", err);
    }
  };

  useEffect(() => {
    loadDashboard();
  }, [updateFlag]);

  return (
    <DashboardRefreshContext.Provider value={{ refresh: refreshDashboard }}>
      <div className="min-h-screen bg-gray-100 p-6">
        {/* HEADING */}
        <h1 className="text-3xl font-bold mb-6 text-gray-800">
          Dashboard Overview
        </h1>

        {/* SUMMARY CARDS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-white p-5 rounded shadow">
            <p className="text-gray-500">Total Income</p>
            <h2 className="text-xl font-bold text-green-600">
              ₹{totals.totalIncome}
            </h2>
          </div>

          <div className="bg-white p-5 rounded shadow">
            <p className="text-gray-500">Total Expense</p>
            <h2 className="text-xl font-bold text-red-500">
              ₹{totals.totalExpense}
            </h2>
          </div>

          <div className="bg-white p-5 rounded shadow">
            <p className="text-gray-500">Net Balance</p>
            <h2 className="text-xl font-bold text-blue-600">
              ₹{totals.netBalance}
            </h2>
          </div>
        </div>

        {/* CHARTS */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-white p-4 rounded shadow">
            <h3 className="font-semibold mb-3">
              Expenses by Category
            </h3>
            <Pie
              data={{
                labels: expenseCat.map((e) => e._id),
                datasets: [
                  {
                    data: expenseCat.map((e) => e.total),
                    backgroundColor: [
                      "#f87171",
                      "#34d399",
                      "#60a5fa",
                      "#facc15",
                      "#a78bfa",
                    ],
                  },
                ],
              }}
            />
          </div>

          <div className="bg-white p-4 rounded shadow">
            <h3 className="font-semibold mb-3">
              Tasks by Status
            </h3>
            <Bar
              data={{
                labels: taskStatus.map((t) => t._id),
                datasets: [
                  {
                    data: taskStatus.map((t) => t.count),
                    backgroundColor: [
                      "#60a5fa",
                      "#fbbf24",
                      "#34d399",
                    ],
                  },
                ],
              }}
            />
          </div>
        </div>

        {/* RECENT ACTIVITY */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white p-4 rounded shadow">
            <h3 className="font-semibold mb-3">
              Recent Expenses
            </h3>
            {recentExpenses.length === 0 ? (
              <p className="text-gray-500">No recent expenses</p>
            ) : (
              recentExpenses.map((e) => (
                <p
                  key={e._id}
                  className="text-sm border-b py-1"
                >
                  {e.title} – ₹{e.amount} ({e.category})
                </p>
              ))
            )}
          </div>

          <div className="bg-white p-4 rounded shadow">
            <h3 className="font-semibold mb-3">
              Recent Tasks
            </h3>
            {recentTasks.length === 0 ? (
              <p className="text-gray-500">No recent tasks</p>
            ) : (
              recentTasks.map((t) => (
                <p
                  key={t._id}
                  className="text-sm border-b py-1"
                >
                  {t.title} – {t.status} ({t.priority})
                </p>
              ))
            )}
          </div>
        </div>
      </div>
    </DashboardRefreshContext.Provider>
  );
}
