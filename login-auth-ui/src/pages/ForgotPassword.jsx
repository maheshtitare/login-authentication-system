import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { forgotPassword } from "../services/authService";
import "../App.css";

function ForgotPassword() {

  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [message, setMessage] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleForgotPassword = async (e) => {

    e.preventDefault();

    setMessage(null);
    setLoading(true);

    try {

      const response = await forgotPassword({
        username
      });

      setMessage({
        type: "success",
        text: response.data
      });

      setTimeout(() => {

        navigate("/verify-otp", {
          state: {
            username
          }
        });

      }, 900);

    } catch (error) {

      if (error.response) {

        setMessage({
          type: "error",
          text: error.response.data
        });

      } else {

        setMessage({
          type: "error",
          text: "Server Error"
        });

      }

    } finally {

      setLoading(false);

    }

  };

  return (

    <div className="container">

      <div className="auth-wrapper">

        <div className="auth-form">

          <h2>Forgot Password</h2>

          <p className="subtitle">
            We'll send an OTP to your registered email.
          </p>

          {message && (
            <div className={`message ${message.type}`}>
              {message.text}
            </div>
          )}

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

            <button
              type="submit"
              className="btn"
              disabled={loading}
            >
              {loading ? "Sending OTP..." : "Send OTP"}
            </button>

          </form>

          <div className="links">
            <Link to="/">Back to Login</Link>
          </div>

        </div>

      </div>

    </div>

  );

}

export default ForgotPassword;