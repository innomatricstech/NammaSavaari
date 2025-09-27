// Sidebar.jsx (Without Logout option)

import React from "react";
import logo from "../assets/Logo.jpg";
import { BusIcon } from "./Icons"; 
// Note: Removed import for LogoutIcon as it's no longer used

// Updated the Sidebar to only accept 'onNavigate' for a single active item/view
const Sidebar = ({ toggleSidebar, activeItem = "Booking Details", onNavigate }) => {
    
    const navigate = onNavigate || (() => console.warn("onNavigate prop is missing in Sidebar."));
    
    // Menu items now contains only "Booking Details"
    const menuItems = [
        { name: "Booking Details", icon: <BusIcon /> },
        // { name: "Logout", icon: <LogoutIcon /> } <-- REMOVED
    ];

    const handleMenuItemClick = (itemName, isMobile) => {
        // 1. Notify the parent component (Dashboard/App) about the navigation
        navigate(itemName);
        
        // 2. Close the sidebar on mobile devices if the function is provided
        if (isMobile && toggleSidebar) {
            toggleSidebar();
        }
    };

    return (
        <div className="sidebar bg-dark text-white vh-100 d-flex flex-column p-3">
            {/* Profile Section */}
            <div className="sidebar-profile d-flex flex-column align-items-start mb-4 border-bottom border-light border-opacity-25">
                <img 
                    src={logo} 
                    alt="Admin" 
                    className="profile-img shadow-lg mb-3" 
                    style={{ width: '60px', height: '60px', borderRadius: '50%', backgroundColor: 'white' }}
                />
                <div className="profile-info">
                    <div className="name fs-6 fw-bold">System Administrator</div>
                    <div className="online-status text-warning d-flex align-items-center small">
                        <span className="me-1">●</span> Active
                    </div>
                </div>
            </div>

            {/* Menu Items (Only Booking Details) */}
            <div className="sidebar-menu flex-grow-1">
                {menuItems.map((item, index) => {
                    // Since there is only one item, it will always be active here.
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
            </div>
            
            {/* You might want to add a footer or version info here later */}
        </div>
    );
};

export default Sidebar;