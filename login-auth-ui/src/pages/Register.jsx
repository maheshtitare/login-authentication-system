import { useState } from "react";
import { Link } from "react-router-dom";
import { registerUser } from "../services/authService";
import "../App.css";

function Register() {

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");

  const handleRegister = async (e) => {

    e.preventDefault();

    try {

      const response = await registerUser({
        fullName,
        email,
        phoneNumber,
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

        <h2>Register</h2>

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
            <input
              type="password"
              placeholder="Enter Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="btn">
            Register
          </button>

        </form>

        <div className="links">

          <Link to="/">
            Already have an account? Login
          </Link>

        </div>

      </div>

    </div>

  );
}

export default Register;