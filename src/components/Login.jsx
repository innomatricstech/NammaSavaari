// src/components/Login.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import "../firebase";
import brandLogo from "../assets/Namma Savaari.png";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import "./Login.css"; // Import CSS for styling

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("Nammasavaari@gmail.com");
  const [password, setPassword] = useState("Admin@123");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const auth = getAuth();

    try {
      await signInWithEmailAndPassword(auth, email, password);
      localStorage.setItem("authToken", "firebase-token");
      navigate("/dashboard");
    } catch (err) {
      console.error(err);
      setError("Invalid email or password");
    } finally {
      setLoading(false);
    }
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
        {/* --- Logo Section --- */}
        <div className="text-center mb-4 logo-container">
          <div className="logo-wrapper mb-2">
            <img
              src={brandLogo}
              alt="Namma Savaari Logo"
              className="brand-logo"
            />
          </div>
          <h2 className="fw-bold brand-title">Namma Savaari</h2>
          <p className="text-muted brand-subtitle">
            Welcome back! Please login to your account
          </p>
        </div>

        {error && <div className="alert alert-danger">{error}</div>}

        <form onSubmit={handleLogin}>
          <div className="mb-3">
            <label className="form-label fw-semibold">Email</label>
            <input
              type="email"
              className="form-control"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
            />
          </div>

          <div className="mb-4 position-relative">
            <label className="form-label fw-semibold">Password</label>
            <input
              type={showPassword ? "text" : "password"}
              className="form-control"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
            />
            <span
              style={{
                position: "absolute",
                right: "10px",
                top: "38px",
                cursor: "pointer",
              }}
              onClick={() => setShowPassword(!showPassword)}
            >
              <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
            </span>
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
          <small className="text-muted">© 2025 Namma Savaari</small>
        </div>
      </div>
    </div>
  );
};

export default Login;
