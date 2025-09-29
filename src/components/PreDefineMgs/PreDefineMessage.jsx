import React, { useState } from 'react';
import './PreDefineMessage.css'; // Make sure this path is correct

const PredefinedMessagesScreen = () => {
    const [question, setQuestion] = useState('');
    const [answer, setAnswer] = useState('');
    const [messages, setMessages] = useState([
        {
            id: 1,
            question: "No buses found",
            answer: "You will see a 'No services found' message if no buses are available for the selected source, destination, and date. Try changing the date or selecting nearby cities.",
        },
        {
            id: 2,
            question: "How to cancel a ticket?",
            answer: "Go to 'My Bookings', select your ticket, and click 'Cancel'. Cancellation policies may apply.",
        },
    ]);

    const handleSaveMessage = (e) => {
        e.preventDefault();
        if (question.trim() && answer.trim()) {
            const newMessage = { id: Date.now(), question: question.trim(), answer: answer.trim() };
            setMessages([newMessage, ...messages]);
            setQuestion('');
            setAnswer('');
        }
    };

    const handleEdit = (id) => {
        const msg = messages.find(m => m.id === id);
        if (msg) {
            setQuestion(msg.question);
            setAnswer(msg.answer);
            setMessages(messages.filter(m => m.id !== id));
        }
    };

    const handleDelete = (id) => {
        if (window.confirm("Are you sure you want to delete this message?")) {
            setMessages(messages.filter(m => m.id !== id));
        }
    };

    return (
        <div className="predefined-container">
            <h1 className="page-title">Predefined Messages</h1>

            <div className="card form-card">
                <h2>Create Quick Response</h2>
                <form onSubmit={handleSaveMessage}>
                    <label>Question / Trigger</label>
                    <textarea 
                        value={question} 
                        onChange={e => setQuestion(e.target.value)}
                        placeholder="Enter question trigger..."
                        required
                    />
                    <label>Answer / Response</label>
                    <textarea 
                        value={answer} 
                        onChange={e => setAnswer(e.target.value)}
                        placeholder="Enter response..."
                        required
                    />
                    <button type="submit">Save Response</button>
                </form>
            </div>

            <h2 className="section-title">Current Messages ({messages.length})</h2>
            <div className="messages-grid">
                {messages.map(msg => (
                    <div key={msg.id} className="card message-card">
                        <div className="question-block">
                            <strong>Trigger:</strong>
                            <p>{msg.question}</p>
                        </div>
                        <div className="answer-block">
                            <strong>Response:</strong>
                            <p>{msg.answer}</p>
                        </div>
                        <div className="actions">
                            <button className="edit" onClick={() => handleEdit(msg.id)}>Edit</button>
                            <button className="delete" onClick={() => handleDelete(msg.id)}>Delete</button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default PredefinedMessagesScreen;
