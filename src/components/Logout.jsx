// components/LogoutPage.jsx

import React, { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { LogOut, CheckCircle, RotateCw } from 'lucide-react';

const LogoutPage = () => {
    const [isLoggingOut, setIsLoggingOut] = useState(true);

    useEffect(() => {
        // --- 1. SIMULATE LOGOUT PROCESS (e.g., clearing local storage) ---
        
        // In a real application, this is where you would:
        // localStorage.removeItem('authToken'); 
        // dispatch({ type: 'LOGOUT' }); 
        
        console.log('User session data cleared.');

        // Simulate a delay for the cleanup process (e.g., a server call)
        const timer = setTimeout(() => {
            setIsLoggingOut(false);
            
            // In a real app, this is where you'd redirect:
            // navigate('/login'); 
            
        }, 1500); // 1.5 second delay

        // Cleanup the timer if the component unmounts
        return () => clearTimeout(timer);
    }, []);

    const handleRedirect = () => {
        // Since we don't have routing, we simulate the redirection.
        alert("Redirecting to the Login or Home page...");
        // In a real app: window.location.href = '/login';
    };

    return (
        <div className="d-flex align-items-center justify-content-center vh-100 bg-light">
            <div className="card shadow-lg p-4 p-md-5 text-center" style={{ maxWidth: '400px' }}>
                <div className="card-body">
                    
                    {isLoggingOut ? (
                        <>
                            <RotateCw size={48} className="text-warning mb-4 rotate-animation" />
                            <h2 className="card-title fw-bold text-warning">Logging Out...</h2>
                            <p className="card-text text-muted">Securing your session and clearing data.</p>
                            
                            {/* Simple CSS animation definition for demonstration */}
                            <style>{`
                                .rotate-animation {
                                    animation: spin 1.5s linear infinite;
                                }
                                @keyframes spin {
                                    0% { transform: rotate(0deg); }
                                    100% { transform: rotate(360deg); }
                                }
                            `}</style>
                        </>
                    ) : (
                        <>
                            <CheckCircle size={48} className="text-success mb-4" />
                            <h2 className="card-title fw-bold text-success">Logged Out Successfully!</h2>
                            <p className="card-text text-muted">You have been successfully signed out of your account.</p>
                            <button 
                                className="btn btn-primary mt-4 w-100"
                                onClick={handleRedirect}
                            >
                                <LogOut size={20} className="me-2" />
                                Go to Login Page
                            </button>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default LogoutPage;