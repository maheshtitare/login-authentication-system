import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { resetPassword } from "../services/authService";
import "../App.css";

function ResetPassword() {

  const navigate = useNavigate();
  const location = useLocation();

  const username = location.state?.username || "";

  const [newPassword, setNewPassword] = useState("");

  const handleResetPassword = async (e) => {

    e.preventDefault();

    try {

      const response = await resetPassword({
        username,
        newPassword
      });

      alert(response.data);

      navigate("/");

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

        <h2>Reset Password</h2>

        <form onSubmit={handleResetPassword}>

          <div className="input-group">

            <label>Email / Phone Number</label>

            <input
              type="text"
              value={username}
              readOnly
            />

          </div>

          <div className="input-group">

            <label>New Password</label>

            <input
              type="password"
              placeholder="Enter New Password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
            />

          </div>

          <button type="submit" className="btn">
            Reset Password
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

export default ResetPassword;