import React from "react";
import { useNavigate } from "react-router-dom";
import logo from "../assets/Logo.jpg";
import { BusIcon, LogoutIcon } from "./Icons";

const Sidebar = ({ toggleSidebar, activeItem = "Booking Details", onNavigate }) => {
    const navigate = useNavigate();

    const menuItems = [
        { name: "Booking Details", icon: <BusIcon /> }
    ];

    const handleMenuItemClick = (itemName, isMobile) => {
        if (onNavigate) {
            onNavigate(itemName);
        }
        if (isMobile && toggleSidebar) {
            toggleSidebar();
        }
    };

    const handleLogout = () => {
        // Navigate to Logout page
        navigate("/logout");
        if (toggleSidebar) toggleSidebar();
    };

    return (
        <div className="sidebar d-flex flex-column text-white p-3" style={{ minHeight: "100vh" }}>
            {/* Logo & Profile Section */}
            <div className="sidebar-profile text-center mb-4 pb-3 border-bottom border-light border-opacity-25">
                <img
                    src={logo}
                    alt="Admin Logo"
                    className="shadow-sm mb-2"
                    style={{
                        width: "64px",
                        height: "64px",
                        borderRadius: "50%",
                        backgroundColor: "#fff",
                        objectFit: "cover"
                    }}
                />
                <div className="fs-6 fw-bold mt-2">System Administrator</div>
                <div className="text-warning small d-flex justify-content-center align-items-center">
                    <span className="me-1">●</span> Active
                </div>
            </div>

            {/* Menu Items */}
            <div className="sidebar-menu flex-grow-1">
                {menuItems.map((item, index) => {
                    const isActive = activeItem === item.name;
                    return (
                        <button
                            key={index}
                            className={`menu-item d-flex align-items-center p-3 mb-2 w-100 rounded-3 border-0 text-white text-start ${isActive ? "bg-primary fw-bold" : "bg-transparent"}`}
                            onClick={() => handleMenuItemClick(item.name, window.innerWidth < 768)}
                        >
                            <span className="me-3 fs-5">{item.icon}</span>
                            <span className="fw-medium">{item.name}</span>
                        </button>
                    );
                })}

                {/* Logout Button just below Booking Details */}
                <div className="sidebar-logout mt-2">
                    <button
                        className="menu-item d-flex align-items-center p-3 w-100 rounded-3 border-0 text-white text-start bg-danger bg-opacity-75"
                        onClick={handleLogout}
                    >
                        <span className="me-3 fs-5"><LogoutIcon /></span>
                        <span className="fw-medium">Logout</span>
                    </button>
                </div>
            </div>

            {/* Footer */}
            <div className="mt-auto">
                <div className="text-center small text-muted pt-3 border-top border-light border-opacity-25">
                    <span>© 2025 Dashboard</span>
                </div>
            </div>
        </div>
    );
};

export default Sidebar;
