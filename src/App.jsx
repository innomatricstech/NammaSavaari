import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useNavigate,
  useLocation,
} from "react-router-dom";

import Sidebar from "./components/Sidebar";
import TopHeader from "./components/TopHeader";
import BusManagementTable from "./components/BusDetails/BusManagementTabel";
import ChatScreen from "./components/Chat/Chat";
import ChatDetail from "./components/Chat/ChatDetails";
import Logout from "./components/Logout";
import Login from "./components/Login";
import PredefinedMessagesScreen from "./components/PreDefineMgs/PreDefineMessage";
// import NewBusBookingPredefinedMessages from "./components/NewBusPreDefineMgs/NewBusPreDefineMessage";

import "./App.css";

// --- Component Mapping for Sidebar Navigation ---
const MenuItemToRoute = {
  "Booking Details": "/dashboard/bus-management",
  Chat: "/dashboard/chat",
  "Predefined Messages": "/dashboard/predefined-messages",
  "New Bus Booking Predefined Messages": "/dashboard/newbus-predefined-messages",
  FAQS: "/dashboard/faqs",
  Offers: "/dashboard/offers",
  "Offers Predefined Messages": "/dashboard/offers-predefined-messages",
  "Upload Youtube Videos": "/dashboard/upload-youtube-videos",
  "Short Video Upload": "/dashboard/short-video-upload",
  Wallet: "/dashboard/wallet",
  "Wallet History": "/dashboard/wallet-history",
  Commission: "/dashboard/commission",
};

// Reverse mapping for highlighting active menu
const RouteToMenuItem = Object.fromEntries(
  Object.entries(MenuItemToRoute).map(([key, value]) => [value, key])
);

// --- Protected Route ---
const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem("authToken");
  return token ? children : <Navigate to="/login" />;
};

const App = () => (
  <Router>
    <AppContent />
  </Router>
);

const AppContent = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // --- Sidebar State ---
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [isSidebarOpen, setIsSidebarOpen] = useState(window.innerWidth >= 768);

  const toggleSidebar = () => setIsSidebarOpen((prev) => !prev);

  // --- Track Window Resize ---
  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
      if (window.innerWidth >= 768) setIsSidebarOpen(true);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // --- Active Menu Highlight ---
  const currentRoute = location.pathname;
  const [activeItem, setActiveItem] = useState(
    RouteToMenuItem[currentRoute] || "Booking Details"
  );

  useEffect(() => {
    let item = RouteToMenuItem[currentRoute];
    if (!item && currentRoute.startsWith("/dashboard/chat/")) {
      item = "Chat";
    }
    setActiveItem(item || "Booking Details");
  }, [currentRoute]);

  // --- Navigation Handler ---
  const handleNavigation = (itemName) => {
    const route = MenuItemToRoute[itemName];
    if (route) {
      navigate(route);
      setActiveItem(itemName);
    }
  };

  const ExternalStyles = () => (
    <>
      <link
        href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css"
        rel="stylesheet"
      />
      <link
        href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css"
        rel="stylesheet"
      />
      <link
        href="https://fonts.googleapis.com/css2?family=Inter:wght@100..900&display=swap"
        rel="stylesheet"
      />
    </>
  );

  // --- Dashboard Layout ---
  const DashboardLayout = ({ children }) => (
    <div
      className={`main-app-container ${
        isSidebarOpen && windowWidth < 768 ? "sidebar-open" : ""
      }`}
    >
      <TopHeader toggleSidebar={toggleSidebar} />
      <div className="dashboard-layout">
        <Sidebar
          toggleSidebar={toggleSidebar}
          activeItem={activeItem}
          onNavigate={handleNavigation}
        />
        <div className="main-content-area">{children}</div>
      </div>
      {isSidebarOpen && windowWidth < 768 && (
        <div className="overlay" onClick={toggleSidebar}></div>
      )}
    </div>
  );

  return (
    <>
      <ExternalStyles />
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/logout" element={<Logout />} />

        {/* Dashboard Routes */}
        <Route
          path="/dashboard/bus-management"
          element={
            <ProtectedRoute>
              <DashboardLayout>
                <BusManagementTable />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/dashboard/chat"
          element={
            <ProtectedRoute>
              <DashboardLayout>
                <ChatScreen />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/chat/:customerId"
          element={
            <ProtectedRoute>
              <DashboardLayout>
                <ChatDetail />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/dashboard/predefined-messages"
          element={
            <ProtectedRoute>
              <DashboardLayout>
                <PredefinedMessagesScreen />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />

        {/* <Route
          path="/dashboard/newbus-predefined-messages"
          element={
            <ProtectedRoute>
              <DashboardLayout>
                <NewBusBookingPredefinedMessages />
              </DashboardLayout>
            </ProtectedRoute>
          }
        /> */}

        {/* Default Redirects */}
        <Route path="/" element={<Navigate to="/login" />} />
        <Route
          path="/dashboard"
          element={<Navigate to="/dashboard/bus-management" />}
        />
        <Route
          path="*"
          element={
            localStorage.getItem("authToken") ? (
              <Navigate to="/dashboard/bus-management" />
            ) : (
              <Navigate to="/login" />
            )
          }
        />
      </Routes>
    </>
  );
};

export default App;
