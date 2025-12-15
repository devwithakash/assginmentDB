import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Expenses from "./pages/Expenses";
import AddExpense from "./pages/AddExpense";
import ExpenseDetail from "./pages/ExpenseDetail";
import Tasks from "./pages/Tasks";
import AddTask from "./pages/AddTask";
import TaskDetail from "./pages/TaskDetail";
import Admin from "./pages/Admin";
import PrivateRoute from "./components/PrivateRoute";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Protected Routes */}
        <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
        <Route path="/expenses" element={<PrivateRoute><Expenses /></PrivateRoute>} />
        <Route path="/expenses/add" element={<PrivateRoute><AddExpense /></PrivateRoute>} />
        <Route path="/expenses/:id" element={<PrivateRoute><ExpenseDetail /></PrivateRoute>} />
        <Route path="/tasks" element={<PrivateRoute><Tasks /></PrivateRoute>} />
        <Route path="/tasks/add" element={<PrivateRoute><AddTask /></PrivateRoute>} />
        <Route path="/tasks/:id" element={<PrivateRoute><TaskDetail /></PrivateRoute>} />

        {/* Admin Route */}
        <Route path="/admin" element={<PrivateRoute adminOnly={true}><Admin /></PrivateRoute>} />

        {/* Default */}
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </Router>
  );
}

export default App;
