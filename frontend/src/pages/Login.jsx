import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import API from "../api/api";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const res = await API.post("/auth/login", { email, password });
      
      localStorage.setItem("accessToken", res.data.accessToken);
      localStorage.setItem("refreshToken", res.data.refreshToken);
      
      navigate("/dashboard");
    } catch (err) {
      alert("Login failed: " + (err.response?.data?.msg || "Something went wrong"));
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <div className="p-8 border rounded shadow-lg bg-white w-96">
        <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>
        
        <input 
          className="w-full p-2 border mb-4 rounded" 
          placeholder="Email" 
          onChange={e => setEmail(e.target.value)} 
        />
        
        <input 
          className="w-full p-2 border mb-6 rounded" 
          type="password" 
          placeholder="Password" 
          onChange={e => setPassword(e.target.value)} 
        />
        
        <button 
          onClick={handleLogin} 
          className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700 transition"
        >
          Login
        </button>
        
        <div className="mt-4 text-center">
          <Link to="/register" className="text-blue-600 hover:underline">
            Don't have an account? Register
          </Link>
        </div>
      </div>
    </div>
  );
}