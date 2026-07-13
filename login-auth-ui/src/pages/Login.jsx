import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { loginUser } from "../services/authService";
import "../App.css";

function Login() {

    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [message, setMessage] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleLogin = async (e) => {

        e.preventDefault();

        setMessage(null);
        setLoading(true);

        try {

            const response = await loginUser({
                email,
                password
            });

            const token = response.data;

            localStorage.setItem("token", token);
            localStorage.setItem("email", email);

            setMessage({
                type: "success",
                text: "Login Successful. Redirecting..."
            });

            setTimeout(() => {
                navigate("/dashboard");
            }, 800);

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

                    <h2>Login</h2>

                    <p className="subtitle">
                        Sign in to your account
                    </p>

                    {message && (
                        <div className={`message ${message.type}`}>
                            {message.text}
                        </div>
                    )}

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

                        <button
                            type="submit"
                            className="btn"
                            disabled={loading}
                        >
                            {loading ? "Signing in..." : "Login"}
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

        </div>

    );

}

export default Login;