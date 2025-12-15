import { Navigate } from "react-router-dom";

export default function PrivateRoute({ children, adminOnly = false }) {
  const token = localStorage.getItem("token");
  if (!token) return <Navigate to="/login" />;

  if (adminOnly) {
    const user = JSON.parse(atob(token.split(".")[1]));
    if (user.role !== "admin") return <Navigate to="/dashboard" />;
  }

  return children;
}
