import { useState } from "react";
import { Link } from "react-router-dom";
import { loginUser } from "../services/authService";
import "../App.css";

function Login() {

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e) => {

    e.preventDefault();

    try {

      const response = await loginUser({
        email,
        password
      });

      alert(response.data);

    } catch (error) {

      if (error.response) {
        alert(error.response.data);
      } else {
        alert("Server Error");
      }

    }

  };

  return (
    <div className="container">

      <div className="card">

        <h2>Login</h2>

        <form onSubmit={handleLogin}>

          <div className="input-group">
            <label>Email</label>
            <input
              type="email"
              placeholder="Enter Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="input-group">
            <label>Password</label>
            <input
              type="password"
              placeholder="Enter Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="btn">
            Login
          </button>

        </form>

        <div className="links">

          <Link to="/forgot-password">
            Forgot Password?
          </Link>

          <Link to="/register">
            Create Account
          </Link>

        </div>

      </div>

    </div>
  );
}

export default Login;