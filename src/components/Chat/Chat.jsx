import React, { useMemo } from 'react';
import { useNavigate } from 'react-router-dom'; // 👈 Import useNavigate

/**
 * ChatScreen component displays a list of customer messages.
 * This component is designed to be integrated into a larger dashboard structure.
 * @returns {JSX.Element} The Chat screen UI.
 */
const ChatScreen = () => {
    // 1. Initialize useNavigate
    const navigate = useNavigate();

    // Mock data based on the provided image, including names, emails, and time stamps.
    const mockCustomers = useMemo(() => [
        // Added a unique ID (which is crucial for routing)
        { id: 101, name: "Paramesh CS", email: "parameshcs2023@gmail.com", lastMessage: "huu", time: "11:45 AM" },
        { id: 102, name: "SACHIN MANE", email: "sachinsmane2020@gmail.com", lastMessage: "to resolve the issue", time: "10:10 AM" },
        { id: 103, name: "Vishnu", email: "vishnu@@gmail.com", lastMessage: "Hello", time: "9:35 AM" },
        { id: 104, name: "Prakash Gouda", email: "prakashgouda604@gmail.com", lastMessage: "Hello Thank you for choosing Namma Savaari what can i help for you", time: "Yesterday" },
        { id: 105, name: "a lokesh", email: "lokesh.aglineni@gmail.com", lastMessage: "puu", time: "2 days ago" },
        { id: 106, name: "Paramesh Parmi", email: "parmeshparmi46@gmail.com", lastMessage: "if", time: "3 days ago" },
    ], []);

    // 2. Navigation Handler for clicking a customer item
    const handleCustomerClick = (customerId) => {
        // Navigates to a specific chat route, e.g., /dashboard/chat/101
        navigate(`/dashboard/chat/${customerId}`);
    };

    return (
        <div className="container-fluid p-4">
            {/* The header mimics the red bar seen in the original image */}
            <h4 className="pb-2 border-bottom border-danger mb-4 fw-bold text-danger" style={{ 
                borderBottomWidth: '4px !important', 
                paddingBottom: '1rem !important',
                color: '#dc3545' // Strong red color
            }}>
                Admin Chat
            </h4>

            <div className="card shadow-lg rounded-3 border-0">
                <div className="card-header bg-white p-3 border-bottom">
                    <h5 className="mb-0 text-dark fw-bold">Messages from Customers</h5>
                </div>
                {/* List Group Container with fixed height and scrolling */}
                <div className="list-group list-group-flush" style={{ maxHeight: 'calc(100vh - 250px)', overflowY: 'auto' }}>
                    {mockCustomers.map((customer, index) => (
                        <button // Changed <a> to <button> for better semantics and accessibility
                            key={customer.id} 
                            // Removed href="#" and replaced with onClick handler
                            className="list-group-item list-group-item-action py-3 px-4 d-flex justify-content-between align-items-start border-bottom text-start"
                            onClick={() => handleCustomerClick(customer.id)} // 👈 Call navigation handler
                        >
                            <div className="flex-grow-1">
                                {/* Name - bold and uppercase */}
                                <h6 className="mb-0 text-dark fw-bold text-uppercase" style={{fontSize: '0.9rem'}}>{customer.name}</h6> 
                                {/* Email - red/muted text for contrast */}
                                <p className="mb-0 small text-danger" style={{fontSize: '0.8rem', opacity: 0.8}}>{customer.email}</p>
                                {/* Last message preview */}
                                <p className="mb-0 text-truncate mt-1" style={{ maxWidth: '90%' }}>
                                    <span className="text-secondary small">{customer.lastMessage}</span>
                                </p>
                            </div>
                            {/* Time/Date on the right */}
                            <small className="text-muted ms-2 mt-1">{customer.time}</small>
                        </button>
                    ))}
                    {mockCustomers.length === 0 && (
                             <div className="text-center p-5 text-muted">No new customer messages.</div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ChatScreen;