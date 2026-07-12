import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { verifyOtp } from "../services/authService";
import "../App.css";

function VerifyOtp() {

  const navigate = useNavigate();
  const location = useLocation();

  const username = location.state?.username || "";

  const [otp, setOtp] = useState("");

  const handleVerifyOtp = async (e) => {

    e.preventDefault();

    try {

      const response = await verifyOtp({
        username,
        otp
      });

      alert(response.data);

      navigate("/reset-password", {
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

        <h2>Verify OTP</h2>

        <form onSubmit={handleVerifyOtp}>

          <div className="input-group">

            <label>Email / Phone Number</label>

            <input
              type="text"
              value={username}
              readOnly
            />

          </div>

          <div className="input-group">

            <label>OTP</label>

            <input
              type="text"
              placeholder="Enter OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              required
            />

          </div>

          <button type="submit" className="btn">
            Verify OTP
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

export default VerifyOtp;