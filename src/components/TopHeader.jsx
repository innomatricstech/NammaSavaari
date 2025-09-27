import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { BarsIcon, LogoutIcon } from "./Icons";

const TopHeader = ({ toggleSidebar }) => {
    const navigate = useNavigate();
    const [showConfirm, setShowConfirm] = useState(false);

    const handleLogoutClick = () => {
        setShowConfirm(true); // Show the confirmation popup
    };

    const confirmLogout = () => {
        localStorage.removeItem("authToken");
        navigate("/login");
    };

    const cancelLogout = () => {
        setShowConfirm(false);
    };

    return (
        <>
            <header
                className="app-header text-white p-3 shadow-lg"
                style={{
                    zIndex: 1040,
                    background: "linear-gradient(180deg, red 0%, #00008B 150%)",
                }}
            >
                <div className="container-fluid d-flex justify-content-between align-items-center">
                    {/* Sidebar toggle button for mobile */}
                    <button
                        className="btn btn-sm btn-outline-light d-md-none me-3 rounded-circle p-2"
                        onClick={toggleSidebar}
                        aria-label="Toggle sidebar"
                    >
                        <BarsIcon />
                    </button>

                    {/* Header title */}
                    <h3 className="mb-0 fs-5 fw-light">Bus Booking Admin Panel</h3>

                    {/* User info / Logout */}
                    <div className="d-flex align-items-center gap-3">
                        <span className="d-none d-sm-inline">Welcome, Admin</span>
                        <button
                            className="btn btn-sm btn-danger d-flex align-items-center gap-1 rounded-pill"
                            onClick={handleLogoutClick}
                        >
                            <LogoutIcon />
                            <span className="d-none d-md-inline">Logout</span>
                        </button>
                    </div>
                </div>
            </header>

            {/* In-page confirmation popup */}
            {showConfirm && (
                <div
                    className="position-fixed top-0 start-0 w-100 h-100 d-flex justify-content-center align-items-center"
                    style={{
                        backgroundColor: "rgba(0,0,0,0.5)",
                        zIndex: 2000,
                    }}
                >
                    <div
                        className="bg-white p-4 rounded shadow-lg"
                        style={{ minWidth: "300px" }}
                    >
                        <h5 className="mb-3">Confirm Logout</h5>
                        <p>Are you sure you want to logout?</p>
                        <div className="d-flex justify-content-end gap-2 mt-3">
                            <button
                                className="btn btn-secondary"
                                onClick={cancelLogout}
                            >
                                Cancel
                            </button>
                            <button
                                className="btn btn-danger"
                                onClick={confirmLogout}
                            >
                                Logout
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default TopHeader;
