import React from "react";
import { useNavigate } from "react-router-dom";
import Logo from "../assets/Logo.jpg";

const Sidebar = ({ toggleSidebar, activeItem = "Booking Details", onNavigate }) => {
  const navigate = useNavigate();

  const menuItems = [
    { name: "Booking Details", icon: <i className="fas fa-bus"></i> },
    { name: "Chat", icon: <i className="fas fa-comment-dots"></i> },
    { name: "Predefined Messages", icon: <i className="fas fa-bullhorn"></i> },
    { name: "New Bus Booking Predefined Messages", icon: <i className="fas fa-mobile-alt"></i> }, 
    { name: "FAQS", icon: <i className="fas fa-question-circle"></i> },
    { name: "Offers", icon: <i className="fas fa-tag"></i> },
    { name: "Offers Predefined Messages", icon: <i className="fas fa-star"></i> },
    { name: "Upload Youtube Videos", icon: <i className="fab fa-youtube"></i> },
    { name: "Short Video Upload", icon: <i className="fas fa-video"></i> },
    { name: "Wallet", icon: <i className="fas fa-wallet"></i> },
    { name: "Wallet History", icon: <i className="fas fa-history"></i> },
    { name: "Commission", icon: <i className="fas fa-wallet"></i> },
  ];

  const handleMenuItemClick = (itemName) => {
    if (onNavigate) onNavigate(itemName);
    if (window.innerWidth < 768 && toggleSidebar) toggleSidebar();
  };

  const handleLogout = () => {
    navigate("/login");
    if (toggleSidebar) toggleSidebar();
  };

  return (
    <div className="sidebar d-flex flex-column text-white">
      {/* Profile */}
      <div className="sidebar-profile text-center p-3 mt-3 border-bottom border-secondary">
        <img
          src={Logo}
          alt="Logo"
          className="rounded-circle mb-2"
          style={{ width: "64px", height: "64px", objectFit: "cover" }}
        />
        <div className="fw-bold">Innomatrics</div>
        <div className="small opacity-75">Innotech@gmail.com</div>
        <div className="text-warning small mt-1 d-flex justify-content-center align-items-center">
          <span className="me-1">●</span> Active
        </div>
      </div>

      {/* Menu */}
      <div className="sidebar-menu flex-grow-1">
        {menuItems.map((item, index) => {
          const isActive = activeItem === item.name;
          return (
            <button
              key={index}
              className={`menu-item d-flex align-items-center mb-2 w-100 rounded-3 border-0 text-white text-start ${
                isActive ? "active-menu-item" : "bg-transparent"
              }`}
              onClick={() => handleMenuItemClick(item.name)}
            >
              <span className="me-3 fs-5">{item.icon}</span>
              <span className="fw-medium">{item.name}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default Sidebar;