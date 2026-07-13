import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { resetPassword } from "../services/authService";
import "../App.css";

function ResetPassword() {

  const navigate = useNavigate();
  const location = useLocation();

  const username = location.state?.username || "";

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [message, setMessage] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleResetPassword = async (e) => {

    e.preventDefault();

    setMessage(null);

    if (newPassword !== confirmPassword) {
      setMessage({ type: "error", text: "Passwords do not match" });
      return;
    }

    setLoading(true);

    try {

      const response = await resetPassword({
        username,
        newPassword,
        confirmPassword
      });

      const text = response.data;

      if (text === "Password Reset Successfully") {
        setMessage({ type: "success", text: text + ". Redirecting to Login..." });
        setTimeout(() => navigate("/"), 1200);
      } else {
        setMessage({ type: "error", text });
      }

    } catch (error) {

      if (error.response) {
        setMessage({ type: "error", text: error.response.data });
      } else {
        setMessage({ type: "error", text: "Server Error" });
      }

    } finally {
      setLoading(false);
    }

  };

  return (

    <div className="container">

      <div className="auth-wrapper">

        <div className="auth-brand">
          <div className="brand-logo">🔐 Mahesh Auth</div>
          <div className="brand-content">
            <h1>Set a new password</h1>
            <p>
              Choose a strong password with at least 6 characters, using both
              letters and numbers.
            </p>
            <ul className="brand-features">
              <li>BCrypt hashed on the server</li>
              <li>OTP session cleared after reset</li>
              <li>Immediate login with new password</li>
            </ul>
          </div>
          <div style={{ fontSize: 12, opacity: 0.7, position: "relative", zIndex: 1 }}>
            © {new Date().getFullYear()} Mahesh Titare
          </div>
        </div>

        <div className="auth-form">

          <h2>Reset Password</h2>
          <p className="subtitle">Create a new password for your account</p>

          {message && (
            <div className={`message ${message.type}`}>{message.text}</div>
          )}

          <form onSubmit={handleResetPassword}>

            <div className="input-group">
              <label>Email / Phone Number</label>
              <input type="text" value={username} readOnly />
            </div>

            <div className="input-group">
              <label>New Password</label>
              <div className="password-field">
                <input
                  type={showNew ? "text" : "password"}
                  placeholder="Min 6 chars, letters + numbers"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowNew(!showNew)}
                >
                  {showNew ? "🙈" : "👁️"}
                </button>
              </div>
            </div>

            <div className="input-group">
              <label>Confirm New Password</label>
              <div className="password-field">
                <input
                  type={showConfirm ? "text" : "password"}
                  placeholder="Re-enter New Password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowConfirm(!showConfirm)}
                >
                  {showConfirm ? "🙈" : "👁️"}
                </button>
              </div>
            </div>

            <button type="submit" className="btn" disabled={loading}>
              {loading ? "Resetting..." : "Reset Password"}
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

export default ResetPassword;
