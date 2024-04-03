import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

export default function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();

    try {
      const req = { email, password };

      const res = await axios.post(
        `${import.meta.env.VITE_BACKEND}/user/login`,
        req
      );

      const token = res.data.data.token;
      localStorage.removeItem("token");
      localStorage.setItem("token", token);
      return navigate("/chat");
    }
    catch (error) {
      console.log(error);
    }
  }

  return (
    <div className="bg-blue-50 h-screen flex items-center">
      <form className="w-64 mx-auto mb-12" onSubmit={handleSubmit}>
        <input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          type="text"
          placeholder="Email"
          className="block w-full rounded-sm p-2 mb-2 border"
        />
        <input
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          type="password"
          placeholder="password"
          className="block w-full rounded-sm p-2 mb-2 border"
        />
        <button className="bg-blue-500 text-white block w-full rounded-sm p-2">
          Login
        </button>
        <div className="text-center mt-2">
          <Link to="/signup">Dont have an account?</Link>
        </div>
      </form>
    </div>
  );
}
