import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { registerUser } from "../services/authService";
import "../App.css";

function Register() {

  const navigate = useNavigate();

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [message, setMessage] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleRegister = async (e) => {

    e.preventDefault();

    setMessage(null);

    if (password !== confirmPassword) {
      setMessage({
        type: "error",
        text: "Passwords do not match"
      });
      return;
    }

    setLoading(true);

    try {

      const response = await registerUser({
        fullName,
        email,
        phoneNumber,
        password,
        confirmPassword
      });

      if (response.data === "User Registered Successfully") {

        setMessage({
          type: "success",
          text: "User Registered Successfully. Redirecting..."
        });

        setTimeout(() => {
          navigate("/");
        }, 1200);

      } else {

        setMessage({
          type: "error",
          text: response.data
        });

      }

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

          <h2>Register</h2>

          <p className="subtitle">
            Fill in the details to create your account.
          </p>

          {message && (
            <div className={`message ${message.type}`}>
              {message.text}
            </div>
          )}

          <form onSubmit={handleRegister}>

            <div className="input-group">

              <label>Full Name</label>

              <input
                type="text"
                placeholder="Enter Full Name"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
              />

            </div>

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

              <label>Phone Number</label>

              <input
                type="text"
                placeholder="Enter Phone Number"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                required
              />

            </div>

            <div className="input-group">

              <label>Password</label>

              <div className="password-field">

                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />

                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>

              </div>

            </div>

            <div className="input-group">

              <label>Confirm Password</label>

              <div className="password-field">

                <input
                  type={showConfirm ? "text" : "password"}
                  placeholder="Confirm Password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />

                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowConfirm(!showConfirm)}
                >
                  {showConfirm ? <FaEyeSlash /> : <FaEye />}
                </button>

              </div>

            </div>

            <button
              type="submit"
              className="btn"
              disabled={loading}
            >
              {loading ? "Creating Account..." : "Register"}
            </button>

          </form>

          <div className="links">

            <Link to="/">
              Already have an account? Login
            </Link>

          </div>

        </div>

      </div>

    </div>

  );

}

export default Register;