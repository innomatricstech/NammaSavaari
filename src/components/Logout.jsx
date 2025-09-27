// pages/Logout.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Logout = () => {
    const navigate = useNavigate();
    const [status, setStatus] = useState("confirm"); // confirm | logging | success

    const handleConfirmLogout = () => {
        localStorage.removeItem("authToken");
        sessionStorage.clear();
        setStatus("logging");

        setTimeout(() => {
            setStatus("success");
            setTimeout(() => navigate("/login"), 1500);
        }, 1000);
    };

    const handleCancel = () => navigate("/dashboard");

    return (
        <div className="d-flex flex-column justify-content-center align-items-center vh-100 bg-light text-center">
            {status === "confirm" && (
                <div className="card shadow p-5 border-0 rounded-4">
                    <h2 className="mb-3 text-danger">Confirm Logout</h2>
                    <p className="text-muted">Are you sure you want to log out?</p>
                    <div className="d-flex justify-content-center mt-3 gap-3">
                        <button className="btn btn-danger" onClick={handleConfirmLogout}>Yes, Logout</button>
                        <button className="btn btn-secondary" onClick={handleCancel}>Cancel</button>
                    </div>
                </div>
            )}

            {status === "logging" && (
                <div className="card shadow p-5 border-0 rounded-4">
                    <h2 className="mb-3 text-danger">Logging Out...</h2>
                    <p className="text-muted">Please wait while we safely log you out.</p>
                    <div className="spinner-border text-danger mt-3" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </div>
                </div>
            )}

            {status === "success" && (
                <div className="card shadow p-5 border-0 rounded-4">
                    <h2 className="mb-3 text-success">Successfully Logged Out!</h2>
                    <p className="text-muted">Redirecting to login page...</p>
                    <div className="spinner-border text-success mt-3" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Logout;
