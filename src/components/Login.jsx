// pages/Login.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import brandLogo from "../assets/Logo.jpg"; // Make sure to have your logo

const Login = () => {
    const navigate = useNavigate();
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleLogin = (e) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        setTimeout(() => {
            setLoading(false);
            if (username === "Innomatrics" && password === "Innomatrics@123") {
                localStorage.setItem("authToken", "mock-token");
                navigate("/dashboard");
            } else {
                setError("Invalid username or password");
            }
        }, 1000);
    };

    return (
        <div
            className="d-flex justify-content-center align-items-center vh-100"
            style={{
                background: "linear-gradient(135deg, #1A237E, #C62828)",
            }}
        >
            <div
                className="card shadow p-5 rounded-4"
                style={{
                    width: "400px",
                    background: "white",
                    borderRadius: "20px",
                    boxShadow: "0 8px 20px rgba(0,0,0,0.3)",
                }}
            >
                <div className="text-center mb-4">
                    <img
                        src={brandLogo}
                        alt="Innomatrics Logo"
                        style={{ width: "80px", marginBottom: "10px" }}
                    />
                    <h2 className="fw-bold" style={{ color: "#1A237E" }}>
                        Namma Savaari
                    </h2>
                    <p className="text-muted">Welcome back! Please login to your account</p>
                </div>

                {error && <div className="alert alert-danger">{error}</div>}

                <form onSubmit={handleLogin}>
                    <div className="mb-3">
                        <label className="form-label fw-semibold">Username</label>
                        <input
                            type="text"
                            className="form-control"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            placeholder="Enter your username"
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <label className="form-label fw-semibold">Password</label>
                        <input
                            type="password"
                            className="form-control"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Enter your password"
                            required
                        />
                    </div>
                    <button
                        type="submit"
                        className="btn btn-primary w-100 fw-bold"
                        style={{
                            background: "linear-gradient(to right, #1A237E, #C62828)",
                            border: "none",
                        }}
                        disabled={loading}
                    >
                        {loading ? "Logging in..." : "Login"}
                    </button>
                </form>

                <div className="mt-3 text-center">
                    <small className="text-muted">
                        © 2025 Namma Savaari
                    </small>
                </div>
            </div>
        </div>
    );
};

export default Login;
