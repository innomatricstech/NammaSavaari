// App.jsx
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import TopHeader from './components/TopHeader';
import BusManagementTable from './components/BusManagementTabel';
import Logout from './components/Logout';
import Login from './components/Login';
import './App.css'; 

// Utility to safely retrieve global constants
const getGlobal = (name, defaultValue) => typeof window !== 'undefined' && typeof window[name] !== 'undefined' ? window[name] : defaultValue;

const App = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(window.innerWidth >= 768);
    const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth >= 768) setIsSidebarOpen(true);
        };
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    // External Styles
    const ExternalStyles = () => (
        <>
            <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet" />
            <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css" rel="stylesheet" />
            <link href="https://fonts.googleapis.com/css2?family=Inter:wght@100..900&display=swap" rel="stylesheet" />
        </>
    );

    // Protected Route Component
    const ProtectedRoute = ({ children }) => {
        const token = localStorage.getItem("authToken");
        return token ? children : <Navigate to="/login" />;
    };

    return (
        <Router>
            <ExternalStyles />
            <Routes>
                {/* Login Page */}
                <Route path="/login" element={<Login />} />

                {/* Logout Page */}
                <Route path="/logout" element={<Logout />} />

                {/* Protected Dashboard */}
                <Route path="/dashboard" element={
                    <ProtectedRoute>
                        <div className={`main-app-container ${isSidebarOpen && window.innerWidth < 768 ? 'sidebar-open' : ''}`}>
                            <TopHeader toggleSidebar={toggleSidebar} />
                            <div className="dashboard-layout">
                                <Sidebar toggleSidebar={toggleSidebar} />
                                <div className="main-content-area">
                                    <BusManagementTable />
                                </div>
                            </div>
                            {isSidebarOpen && window.innerWidth < 768 && <div className="overlay" onClick={toggleSidebar}></div>}
                            <footer className="app-footer">
                                Bus Finance Dashboard &copy; {new Date().getFullYear()}
                            </footer>
                        </div>
                    </ProtectedRoute>
                } />

                {/* Default Redirect */}
                <Route path="/" element={<Navigate to="/login" />} />
                <Route path="*" element={<Navigate to="/login" />} />
            </Routes>
        </Router>
    );
};

export default App;
