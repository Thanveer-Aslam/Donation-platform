import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import API from "../api"; 


const Auth = () => {
    const [isLogin, setIsLogin] = useState(true);
    const [name, setName] = useState("")
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!email || !password || (!isLogin && !name)) {
          alert("Please fill all fields");
          return;
        } 

        try {
          setLoading(true);

          const endpoint = isLogin ? "/auth/login" : "/auth/register";

          const payload = isLogin
            ? { email, password }
            : { name, email, password };

          const res = await axios.post(endpoint, payload);

          // 🔐 Save token
          localStorage.setItem("token", res.data.token);

          alert(isLogin ? "Login successful 🎉" : "Signup successful 🎉");

          navigate("/creator/dashboard");
        } catch (error) {
          alert(error.response?.data?.message || "Auth failed");
        } finally {
          setLoading(false);
        }
    
    }

    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="bg-white p-6 rounded-xl w-96 shadow">
          <h2 className="text-xl font-semibold mb-4 text-center">
            {isLogin ? "Login" : "Create Account"}
          </h2>

          <form onSubmit={handleSubmit} className=" space-y-4">
            {/* signUp only */}
            {!isLogin && (
              <input
                type="text"
                placeholder="Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full border p-2 rounded"
              />
            )}

            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border p-2 rounded"
            />

            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border p-2 rounded"
            />

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-black text-white p-2 rounded"
            >
              {loading ? "Please wait..." : isLogin ? "Login" : "Sign Up"}
            </button>
          </form>
          {/* 🔁 TOGGLE */}
          <p className="text-sm text-center mt-4">
            {isLogin ? "Don’t have an account?" : "Already have an account?"}
            <button
              onClick={() => setIsLogin(!isLogin)}
              className="ml-1 text-blue-600 underline"
            >
              {isLogin ? "Sign up" : "Login"}
            </button>
          </p>
        </div>
      </div>
    );
}

export default Auth;