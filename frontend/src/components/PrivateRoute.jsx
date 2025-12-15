import { Navigate } from "react-router-dom";

export default function PrivateRoute({ children, adminOnly = false }) {
  // ✅ FIX: Check for 'accessToken'
  const token = localStorage.getItem("accessToken");
  
  if (!token) {
    return <Navigate to="/login" />;
  }

  if (adminOnly) {
    try {
      // Decode the JWT to check the role
      const user = JSON.parse(atob(token.split(".")[1]));
      if (user.role !== "admin") {
        return <Navigate to="/dashboard" />;
      }
    } catch (e) {
      // If token is invalid, force login
      return <Navigate to="/login" />;
    }
  }

  return children;
}