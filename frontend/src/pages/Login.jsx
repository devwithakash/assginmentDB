import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import API from "../api/axios";   // ✅ CORRECT


export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const res = await API.post("/auth/login", { email, password });
      localStorage.setItem("token", res.data.token);
      navigate("/dashboard");
    } catch (err) {
      alert("Login failed");
    }
  };

  return (
    <div className="flex justify-center items-center h-screen">
      <div className="p-6 border rounded w-96">
        <h2 className="text-xl font-bold mb-4">Login</h2>
        <input className="w-full p-2 border mb-2" placeholder="Email" onChange={e => setEmail(e.target.value)} />
        <input className="w-full p-2 border mb-2" type="password" placeholder="Password" onChange={e => setPassword(e.target.value)} />
        <button onClick={handleLogin} className="w-full bg-blue-600 text-white p-2 mb-2">Login</button>
        <Link to="/register" className="text-blue-600">Register</Link>
      </div>
    </div>
  );
}
