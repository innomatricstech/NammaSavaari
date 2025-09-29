import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

/**
 * ChatDetail component displays a simulated chat conversation for a specific customer.
 */
const ChatDetail = () => {
    const { customerId } = useParams();
    const navigate = useNavigate();
    const messagesEndRef = useRef(null);

    // Mock chat data (unchanged)
    const [messages, setMessages] = useState([
        { id: 1, date: "2025-02-03", time: "12:55 AM", text: "hi", isUser: false },
        { id: 2, date: "2025-02-07", time: "05:37 PM", text: "hello", isUser: false },
        { id: 3, date: "2025-02-07", time: "05:37 PM", text: "hello", isUser: false },
        { id: 4, date: "2025-04-04", time: "06:07 PM", text: "hii", isUser: true },
        { id: 5, date: "2025-04-04", time: "06:10 PM", text: "hi", isUser: true },
        { id: 6, date: "2025-06-16", time: "06:11 PM", text: "hfdggg", isUser: false },
        { id: 7, date: "2025-06-16", time: "05:15 PM", text: "hiiiiii", isUser: false },
    ]);
    const [newMessage, setNewMessage] = useState('');

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const groupMessagesByDate = (msgs) => {
        const grouped = {};
        msgs.forEach(msg => {
            if (!grouped[msg.date]) {
                grouped[msg.date] = [];
            }
            grouped[msg.date].push(msg);
        });
        return grouped;
    };

    const groupedChat = groupMessagesByDate(messages);
    const sortedDates = Object.keys(groupedChat).sort(); 

    const handleSendMessage = () => {
        if (newMessage.trim()) {
            const now = new Date();
            setMessages(prevMessages => [
                ...prevMessages,
                {
                    id: prevMessages.length + 1,
                    date: now.toISOString().split('T')[0],
                    time: now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true }),
                    text: newMessage,
                    isUser: true,
                }
            ]);
            setNewMessage('');
        }
    };

    const customerName = `Customer ${customerId}`; 

    return (
        // 👈 Change vh-100 to h-100. This makes the component take 100% of its parent's height (main-content-area).
        <div className="chat-detail-container d-flex flex-column h-100 bg-light"> 
            {/* Top Header Bar */}
            <div className="chat-header d-flex align-items-center p-3 shadow-sm bg-white border-bottom flex-shrink-0">
                <button 
                    onClick={() => navigate(-1)} 
                    className="btn btn-link text-dark p-0 me-3"
                >
                    <i className="fas fa-arrow-left fa-lg"></i>
                </button>
                <h5 className="mb-0 text-dark fw-bold">Chat with {customerName}</h5>
            </div>

            {/* Chat Messages Area */}
            {/* Calculate the height dynamically based on the input field and header */}
            <div 
                className="chat-messages flex-grow-1 p-3 overflow-auto" 
                style={{ backgroundColor: '#f9f9f9', minHeight: 0 }} // minHeight: 0 is important for flex-grow-1 in some browsers
            >
                {sortedDates.map(date => {
                    const dateObj = new Date(date);
                    const dayOfWeek = dateObj.toLocaleDateString('en-US', { weekday: 'long' });

                    return (
                        <React.Fragment key={date}>
                            <div className="date-separator text-center my-4 text-muted small fw-bold">
                                {dayOfWeek} {date}
                            </div>
                            {groupedChat[date].map(msg => (
                                <div 
                                    key={msg.id} 
                                    className={`d-flex mb-2 ${msg.isUser ? 'justify-content-end' : 'justify-content-start'}`}
                                >
                                    <div 
                                        className={`chat-bubble p-2 rounded-3 shadow-sm ${msg.isUser ? 'bg-primary text-white' : 'bg-secondary-subtle text-dark'}`}
                                        style={{ maxWidth: '75%' }}
                                    >
                                        <p className="mb-0 small">{msg.text}</p>
                                        <div className="text-end" style={{ fontSize: '0.65rem', opacity: 0.8 }}>
                                            {msg.time}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </React.Fragment>
                    );
                })}
                <div ref={messagesEndRef} />
            </div>

            {/* Message Input Area */}
            <div className="chat-input p-3 bg-white border-top shadow-sm flex-shrink-0">
                <div className="input-group">
                    <input
                        type="text"
                        className="form-control rounded-pill pe-5"
                        placeholder="Send a message..."
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        onKeyPress={(e) => {
                            if (e.key === 'Enter') {
                                handleSendMessage();
                            }
                        }}
                    />
                    <button 
                        className="btn btn-primary rounded-circle ms-2 d-flex align-items-center justify-content-center" 
                        type="button"
                        onClick={handleSendMessage}
                        style={{ width: '40px', height: '40px', position: 'absolute', right: '10px', zIndex: 10, top: '50%', transform: 'translateY(-50%)' }}
                    >
                        <i className="fas fa-paper-plane"></i>
                    </button>
                </div>
            </div>
        </div>
    );
}; 

export default ChatDetail;