import { Link, useNavigate, useLocation } from "react-router-dom";

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Check if user is Admin to show/hide Admin link
  const accessToken = localStorage.getItem("accessToken");
  let isAdmin = false;
  if (accessToken) {
    try {
      const user = JSON.parse(atob(accessToken.split(".")[1]));
      isAdmin = user.role === "admin";
    } catch (e) { /* ignore */ }
  }

  const handleLogout = () => {
    // Clear all auth data
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    navigate("/login");
  };

  // Helper to style active links
  const isActive = (path) => 
    location.pathname === path 
      ? "text-blue-600 font-bold border-b-2 border-blue-600" 
      : "text-gray-600 hover:text-blue-500 transition";

  return (
    <nav className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          
          {/* Logo / Brand */}
          <div className="flex items-center">
            <h1 className="text-xl font-bold text-gray-800 tracking-tight">
              Productivity<span className="text-blue-600">Manager</span>
            </h1>
          </div>

          {/* Navigation Links */}
          <div className="flex items-center space-x-8">
            <Link to="/dashboard" className={isActive("/dashboard")}>Dashboard</Link>
            <Link to="/expenses" className={isActive("/expenses")}>Expenses</Link>
            <Link to="/tasks" className={isActive("/tasks")}>Tasks</Link>
            
            {/* Conditional Admin Link */}
            {isAdmin && (
              <Link to="/admin" className={`text-red-600 ${isActive("/admin")}`}>
                Admin Panel
              </Link>
            )}
          </div>

          {/* Logout Button */}
          <div className="flex items-center">
            <button 
              onClick={handleLogout} 
              className="bg-red-50 text-red-600 px-4 py-2 rounded hover:bg-red-100 transition text-sm font-medium"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}