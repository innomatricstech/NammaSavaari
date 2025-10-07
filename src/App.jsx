import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useNavigate,
  useLocation,
} from "react-router-dom";

// --- Components ---
import Sidebar from "./components/Sidebar";
import TopHeader from "./components/TopHeader";
import BusManagementTable from "./components/BusDetails/BusManagementTabel";
import BusBookingDetails from "./components/BusDetails/BookingDetailsView"
// import ChatScreen from "./components/Chat/Chat";
// import ChatDetail from "./components/Chat/ChatDetails";
import Logout from "./components/Logout";
import Login from "./components/Login";
// import PredefinedMessagesScreen from "./components/PreDefineMgs/PreDefineMessage";
// import NewBusPreDefinedMessage from "./components/NewBusPreDefineMgs/NewBusPreDefineMessage";
import FAQS from "./components/FAQ/faqs";
import Offers from "./components/Offers/Offers";
// import OffersPredefinedMessages from "./components/OfferPreDefine/OfferPreDenfinedMessage";
// import AdminUploadingYouTubeVideos from "./components/AdminVideo/AdminVideo";
import AdminUploadingShortVideos from "./components/ShortVideo/ShortVideo";
// import Wallet from "./components/Wallet/Wallet";
// import WalletHistoryPage from "./components/Wallet/WalletHistory";
import CommissionSettingsPage from "./components/Commission/Commission";
import HelpLine from "./Helpline";

import "./App.css";

// --- Component Mapping for Sidebar Navigation ---
const MenuItemToRoute = {
  "Booking Details": "/dashboard/bus-management",
  "View Details":"/dashboard/booking-details", 
  // Chat: "/dashboard/chat",
  // // "Predefined Messages": "/dashboard/predefined-messages",
  // "New Bus Booking Predefined Messages": "/dashboard/newbus-predefined-messages",
  FAQS : "/dashboard/faqs",
  Offers : "/dashboard/Offers",
  // "Offers Predefined Messages" : "/dashboard/offersPreDefined",
  // "Upload Youtube Videos":"/dashboard/adminvideo-upload",
  "Short Video Upload":"/dashboard/shortvideo-upload",
  // "Wallet":"/dashboard/wallet",
  // "Wallet History":"/dashboard/wallethistory",
  "Commission":"/dashboard/commission",
  "Helpline":"/dashboard/helpline"
};

// Reverse mapping for highlighting active menu
const RouteToMenuItem = Object.fromEntries(
  Object.entries(MenuItemToRoute).map(([key, value]) => [value, key])
);

// --- Protected Route Wrapper ---
const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem("authToken");
  return token ? children : <Navigate to="/login" replace />;
};

// --- Main App ---
const App = () => (
  <Router>
    <AppContent />
  </Router>
);

const AppContent = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [isSidebarOpen, setIsSidebarOpen] = useState(window.innerWidth >= 768);

  const toggleSidebar = () => setIsSidebarOpen((prev) => !prev);

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
      if (window.innerWidth >= 768) {
        setIsSidebarOpen(true);
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const currentRoute = location.pathname;
  const [activeItem, setActiveItem] = useState(
    RouteToMenuItem[currentRoute] || "Booking Details"
  );

  useEffect(() => {
    const normalizedRoute = currentRoute.endsWith('/')
      ? currentRoute.slice(0, -1)
      : currentRoute.split('?')[0];

    let item = RouteToMenuItem[normalizedRoute];
    
    // Logic for parameterized routes (Chat Detail, Booking Detail)
    if (!item && currentRoute.startsWith("/dashboard/chat/")) {
      item = "Chat";
    }
    // ADDED: Logic to set active item when on a specific booking detail view
    if (!item && currentRoute.startsWith("/dashboard/booking-details/")) {
        item = "Booking Details"; // Or whatever parent item you want highlighted
    }

    setActiveItem(item || "Booking Details");
  }, [currentRoute]);

  const handleNavigation = (itemName) => {
    const route = MenuItemToRoute[itemName];
    if (route) {
      navigate(route);
      setActiveItem(itemName);
    }
    if (windowWidth < 768) {
      setIsSidebarOpen(false);
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
        {/* --- Public Routes --- */}
        <Route path="/login" element={<Login />} />
        <Route path="/logout" element={<Logout />} />

        {/* --- Dashboard Routes --- */}
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
  path="/dashboard/booking-details" 
  element={
    <ProtectedRoute>
      <DashboardLayout>
        <BusBookingDetails />
      </DashboardLayout>
    </ProtectedRoute>
  } 
/>

     
{/* 
        <Route
          path="/dashboard/chat"
          element={
            <ProtectedRoute>
              <DashboardLayout>
                <ChatScreen />
              </DashboardLayout>
            </ProtectedRoute>
          }
        /> */}
        {/* <Route
          path="/dashboard/chat/:customerId"
          element={
            <ProtectedRoute>
              <DashboardLayout>
                <ChatDetail />
              </DashboardLayout>
            </ProtectedRoute>
          }
        /> */}
        {/* <Route
          path="/dashboard/predefined-messages"
          element={
            <ProtectedRoute>
              <DashboardLayout>
                <PredefinedMessagesScreen />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/newbus-predefined-messages"
          element={
            <ProtectedRoute>
              <DashboardLayout>
                <NewBusPreDefinedMessage />
              </DashboardLayout>
            </ProtectedRoute>
          }
        /> */}
          <Route
          path="/dashboard/faqs"
          element={
            <ProtectedRoute>
              <DashboardLayout>
                <FAQS />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />
          <Route
          path="/dashboard/Offers"
          element={
            <ProtectedRoute>
              <DashboardLayout>
                <Offers />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />
          {/* <Route
          path="/dashboard/offersPreDefined"
          element={
            <ProtectedRoute>
              <DashboardLayout>
                <OffersPredefinedMessages/>
              </DashboardLayout>
            </ProtectedRoute>
          }
        /> */}
            {/* <Route
          path="/dashboard/adminvideo-upload"
          element={
            <ProtectedRoute>
              <DashboardLayout>
                <AdminUploadingYouTubeVideos/>
              </DashboardLayout>
            </ProtectedRoute>
          }
        /> */}
          <Route
          path="/dashboard/shortvideo-upload"
          element={
            <ProtectedRoute>
              <DashboardLayout>
                <AdminUploadingShortVideos/>
              </DashboardLayout>
            </ProtectedRoute>
          }
        />
          {/* <Route
          path="/dashboard/wallet"
          element={
            <ProtectedRoute>
              <DashboardLayout>
                <Wallet/>
              </DashboardLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/wallethistory"
          element={
            <ProtectedRoute>
              <DashboardLayout>
                <WalletHistoryPage/>
              </DashboardLayout>
            </ProtectedRoute>
          }
        /> */}
          <Route
          path="/dashboard/commission"
          element={
            <ProtectedRoute>
              <DashboardLayout>
                <CommissionSettingsPage/>
              </DashboardLayout>
            </ProtectedRoute>
          }
        />
         <Route
          path="/dashboard/helpline"
          element={
            <ProtectedRoute>
              <DashboardLayout>
                <HelpLine/>
              </DashboardLayout>
            </ProtectedRoute>
          }
        />

        {/* --- Redirects --- */}
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route
          path="/dashboard"
          element={<Navigate to="/dashboard/bus-management" replace />}
        />
        <Route
          path="*"
          element={
            localStorage.getItem("authToken") ? (
              <Navigate to="/dashboard/bus-management" replace />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />
      </Routes>
    </>
  );
};

export default App;