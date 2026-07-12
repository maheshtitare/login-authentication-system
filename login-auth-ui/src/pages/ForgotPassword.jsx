import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { forgotPassword } from "../services/authService";
import "../App.css";

function ForgotPassword() {

  const [username, setUsername] = useState("");

  const navigate = useNavigate();

  const handleForgotPassword = async (e) => {

    e.preventDefault();

    try {

      const response = await forgotPassword({
        username
      });

      alert(response.data);

      navigate("/verify-otp", {
        state: {
          username
        }
      });

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

        <h2>Forgot Password</h2>

        <form onSubmit={handleForgotPassword}>

          <div className="input-group">

            <label>Email / Phone Number</label>

            <input
              type="text"
              placeholder="Enter Email or Phone Number"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />

          </div>

          <button type="submit" className="btn">
            Send OTP
          </button>

        </form>

        <div className="links">

          <Link to="/">
            Back to Login
          </Link>

        </div>

      </div>

    </div>

  );

}

export default ForgotPassword;