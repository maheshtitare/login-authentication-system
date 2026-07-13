import { useState, useRef } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { verifyOtp } from "../services/authService";
import "../App.css";

function VerifyOtp() {

  const navigate = useNavigate();
  const location = useLocation();

  const username = location.state?.username || "";

  const [digits, setDigits] = useState(["", "", "", "", "", ""]);
  const [message, setMessage] = useState(null);
  const [loading, setLoading] = useState(false);

  const inputsRef = useRef([]);

  const handleChange = (index, value) => {

    if (!/^[0-9]?$/.test(value)) return;

    const next = [...digits];
    next[index] = value;
    setDigits(next);

    if (value && index < 5) {
      inputsRef.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index, e) => {

    if (e.key === "Backspace" && !digits[index] && index > 0) {
      inputsRef.current[index - 1]?.focus();
    }

  };

  const handlePaste = (e) => {

    e.preventDefault();

    const pasted = e.clipboardData
      .getData("text")
      .replace(/\D/g, "")
      .slice(0, 6);

    if (!pasted) return;

    const next = ["", "", "", "", "", ""];

    for (let i = 0; i < pasted.length; i++) {
      next[i] = pasted[i];
    }

    setDigits(next);

    inputsRef.current[Math.min(pasted.length, 5)]?.focus();

  };

  const handleVerifyOtp = async (e) => {

    e.preventDefault();

    setMessage(null);

    const otp = digits.join("");

    if (otp.length !== 6) {
      setMessage({
        type: "error",
        text: "Please enter the full 6-digit OTP"
      });
      return;
    }

    setLoading(true);

    try {

      const response = await verifyOtp({
        username,
        otp
      });

      if (response.data === "OTP Verified Successfully") {

        setMessage({
          type: "success",
          text: "OTP Verified Successfully. Redirecting..."
        });

        setTimeout(() => {

          navigate("/reset-password", {
            state: {
              username
            }
          });

        }, 900);

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

          <h2>Verify OTP</h2>

          <p className="subtitle">
            Enter the 6-digit OTP sent to your registered email.
          </p>

          {message && (
            <div className={`message ${message.type}`}>
              {message.text}
            </div>
          )}

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

              <label>Enter OTP</label>

              <div
                className="otp-boxes"
                onPaste={handlePaste}
              >

                {digits.map((digit, index) => (

                  <input
                    key={index}
                    ref={(el) => (inputsRef.current[index] = el)}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={(e) =>
                      handleChange(index, e.target.value)
                    }
                    onKeyDown={(e) =>
                      handleKeyDown(index, e)
                    }
                  />

                ))}

              </div>

            </div>

            <button
              type="submit"
              className="btn"
              disabled={loading}
            >
              {loading ? "Verifying..." : "Verify OTP"}
            </button>

          </form>

          <div className="links">

            <Link to="/forgot-password">
              Didn't get it? Resend OTP
            </Link>

            <Link to="/">
              Back to Login
            </Link>

          </div>

        </div>

      </div>

    </div>

  );

}

export default VerifyOtp;