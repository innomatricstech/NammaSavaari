// App.jsx

import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import TopHeader from './components/TopHeader';
import BusManagementTable from './components/BusManagementTabel';


// Import the separate CSS file
import './App.css'; 

// Utility to safely retrieve global constants (kept for completeness)
const getGlobal = (name, defaultValue) => typeof window !== 'undefined' && typeof window[name] !== 'undefined' ? window[name] : defaultValue;
const __app_id = getGlobal('__app_id', 'default-app-id');
const __firebase_config = getGlobal('__firebase_config', '{}');
const __initial_auth_token = getGlobal('__initial_auth_token', undefined);

// NOTE: Using a placeholder for the logo.
const logo = "https://placehold.co/50x50/1A237E/FFFFFF?text=A"; 

const App = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(window.innerWidth >= 768);
    const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth >= 768) {
                setIsSidebarOpen(true);
            }
        };
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    // External Styles (for Bootstrap, Font Awesome, and Font)
    const ExternalStyles = () => (
        <>
            {/* Load Bootstrap and Font Awesome for styling and icons */}
            <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet" />
            <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css" rel="stylesheet" />
            {/* Link to Inter font for better typography */}
            <link href="https://fonts.googleapis.com/css2?family=Inter:wght@100..900&display=swap" rel="stylesheet" />
        </>
    );

    return (
        <div className={`main-app-container ${isSidebarOpen && window.innerWidth < 768 ? 'sidebar-open' : ''}`}>
            {/* Apply external styles */}
            <ExternalStyles />
            
            <TopHeader toggleSidebar={toggleSidebar} />
            
            <div className="dashboard-layout">
                {/* Sidebar Component */}
                <Sidebar toggleSidebar={toggleSidebar} />
                
                {/* Main Content Area */}
                <div className="main-content-area">
                    <BusManagementTable />
                </div>
                
            </div>

            {/* Mobile Overlay (closes sidebar when clicking outside) */}
            {isSidebarOpen && window.innerWidth < 768 && <div className="overlay" onClick={toggleSidebar}></div>}
            
            <footer className="app-footer">
                Bus Finance Dashboard &copy; {new Date().getFullYear()}
            </footer>
        </div>
    );
};

export default App;