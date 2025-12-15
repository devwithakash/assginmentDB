import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import API from "../api/axios";   // ✅ CORRECT


export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleRegister = async () => {
    try {
      await API.post("/auth/register", { name, email, password });
      alert("Registration successful");
      navigate("/login");
    } catch (err) {
      alert("Registration failed");
    }
  };

  return (
    <div className="flex justify-center items-center h-screen">
      <div className="p-6 border rounded w-96">
        <h2 className="text-xl font-bold mb-4">Register</h2>
        <input className="w-full p-2 border mb-2" placeholder="Name" onChange={e => setName(e.target.value)} />
        <input className="w-full p-2 border mb-2" placeholder="Email" onChange={e => setEmail(e.target.value)} />
        <input className="w-full p-2 border mb-2" type="password" placeholder="Password" onChange={e => setPassword(e.target.value)} />
        <button onClick={handleRegister} className="w-full bg-green-600 text-white p-2 mb-2">Register</button>
        <Link to="/login" className="text-blue-600">Login</Link>
      </div>
    </div>
  );
}
