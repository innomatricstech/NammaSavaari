import React, { useState } from 'react';
import "./NewBusPredefined.css"

// --- SVG ICON DEFINITIONS (Kept for completeness) ---
const PlusIcon = (props) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path fill="currentColor" d="M256 80c0-17.7-14.3-32-32-32s-32 14.3-32 32V224H48c-17.7 0-32 14.3-32 32s14.3 32 32 32H192V432c0 17.7 14.3 32 32 32s32-14.3 32-32V288H400c17.7 0 32-14.3 32-32s-14.3-32-32-32H256V80z"/></svg>
);
const SearchIcon = (props) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path fill="currentColor" d="M416 208c0 45.9-14.9 88.3-40 122.7L502.6 457.4c12.5 12.5 12.5 32.8 0 45.3s-32.8 12.5-45.3 0L330.7 376c-34.4 25.2-76.8 40-122.7 40C93.1 416 0 322.9 0 208S93.1 0 208 0S416 93.1 416 208zM208 352a144 144 0 1 0 0-288 144 144 0 1 0 0 288z"/></svg>
);
const EditIcon = (props) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path fill="currentColor" d="M471.6 21.3c-21.9-21.9-57.3-21.9-79.2 0L319 94.8 417.2 193l54.8-54.8c21.9-21.9 21.9-57.3 0-79.2L471.6 21.3zm-101.4 17.7L250.3 182.9 14.1 419.1c-19.5 19.5-19.5 51.2 0 70.7c19.5 19.5 51.2 19.5 70.7 0L416 231.8V224c0-17.7 14.3-32 32-32s32 14.3 32 32v7.8c0 14.2-3.7 27.9-10.3 40.1L405.6 376l-20.7 20.7c-9.2 9.2-22.9 11.9-34.9 8.2c-12.7-4.1-23.7-15.1-27.8-27.8c-3.7-12-1-25.7 8.2-34.9L349.8 338l54.8-54.8c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L240 292.5V192c0-17.7-14.3-32-32-32s-32 14.3-32 32v100.5L98.5 332.8c-12.5 12.5-32.8 12.5-45.3 0s-12.5-32.8 0-45.3L153.8 190.1 262.3 81.7 340.8 160l-54.8 54.8c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L416 240l20.7-20.7c9.2-9.2 11.9-22.9 8.2-34.9z"/></svg>
);
const TrashIcon = (props) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path fill="currentColor" d="M135.2 17.7L144.3 32H296c.7 0 1.4 0 2.1-.1l9.1-14.8c9-14.8 26-19.9 41-11.1L445 28.9c10.4 5.9 11.7 20.3 2.9 29.4L393 118.8l-15.3 15.3c-2.4 2.4-4 5.4-4.8 8.6L368 152c0 26.5-21.5 48-48 48s-48-21.5-48-48l-8-32c-2.4-9.6-1.5-19.8 2.6-28.7l11.4-25c7.3-15.9 1.6-35.3-13.4-44.2c-15-8.9-34.5-3.2-44.2 13.4L133.5 163.7c-9.3 20.3-6.9 44.5 6.4 62.7L240 384V432c0 17.7 14.3 32 32 32s32-14.3 32-32V416c0-17.7-14.3-32-32-32H176c-17.7 0-32 14.3-32 32v16c0 17.7 14.3 32 32 32s32-14.3 32-32V464h32v8c0 30.9 25.1 56 56 56s56-25.1 56-56V432c0-26.5-21.5-48-48-48l16-64c.8-3.2 2.4-6.2 4.8-8.6l15.3-15.3L461.1 192.5c8.8-9.1 7.5-23.5-2.9-29.4L376.1 113c-15-8.9-32.1-3.8-41.1 11.1l-9.1 14.8c-.7 0-1.4.1-2.1.1H153.2L135.2 17.7z"/></svg>
);
const TimesIcon = (props) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512"><path fill="currentColor" d="M342.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192 210.7 87.7 106.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L146.7 256 42.4 360.3c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192 301.3 296.3 405.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L237.3 256 342.6 150.6z"/></svg>
);
const ChatTextIcon = (props) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path fill="currentColor" d="M123.6 201.2L156.4 225C167.3 233.1 180.2 237.7 193.3 237.9L242.4 240H269.6L318.7 237.9C331.8 237.7 344.7 233.1 355.6 225L388.4 201.2C394.3 197 400 192.4 405.2 187.3C410.4 182.3 415.1 176.9 419.2 171.1L444 135.9C455.5 120.9 459.7 102.3 459.7 82.5c0-12.5-1.1-24.8-3.1-36.8c-1.9-12-5.3-23.4-10.2-33.8c-4.9-10.4-11.4-19.8-19.2-27.9C421.9 22.8 412.3 16.3 401.9 11.4C390.8 6.5 379.4 3.1 367.4 1.2C355.4-1.1 343.1 0 330.6 0H181.4C168.9 0 156.6-1.1 144.6 1.2C132.6 3.1 121.2 6.5 110.1 11.4C99.7 16.3 90.1 22.8 81.9 30.9C73.8 39 67.3 48.4 62.4 58.8C57.5 69.2 54.1 80.6 52.2 92.6C50.3 104.6 51.5 116.9 51.5 129.4c0 19.8 4.2 38.4 15.7 53.4L86.8 214.9c5.1 5.1 10.7 9.8 16.7 14.1l32.8 23.8zM459.7 82.5c0 10-2.4 19.8-6.9 28.5L428.1 150c-3.1 4.7-6.8 9-11 12.8L384 192c-6.2 5.6-13.3 9.9-21.1 12.8L320 224c-12.7 3.8-26.1 3.8-38.9 0L240 208c-6.6-2-12.9-4.7-18.7-7.9L184 180c-7.9-3.7-15.1-8.2-21.7-13.5L128 128c-4.7-3.6-9.1-7.7-13.1-12.3L80 77.3C75.5 68.6 73.1 58.8 73.1 48.8c0-10.4 1.1-20.5 3.1-30.2c1.9-9.7 5.2-18.8 9.9-27.1c4.7-8.3 10.7-15.5 17.9-21.5c7.2-6 15.4-10.6 24.3-13.8c8.9-3.2 18.2-4.9 27.7-4.9H370.4c9.5 0 18.8 1.7 27.7 4.9c8.9 3.2 17.1 7.8 24.3 13.8c7.2 6 13.2 13.2 17.9 21.5c4.7 8.3 7.9 17.4 9.9 27.1c2 9.7 3.1 19.8 3.1 30.2zM256 224c35.3 0 64-28.7 64-64V96c0-35.3-28.7-64-64-64S192 60.7 192 96v64c0 35.3 28.7 64 64 64zm0 256c-48.4 0-93.7-18.9-127.3-52.5C95.2 393.7 76.3 348.4 76.3 300H108c0 38.3 15.6 74.8 43.6 102.8C179.6 427.2 216.1 442.8 254.4 442.8c38.3 0 74.8-15.6 102.8-43.6c28-28 43.6-64.5 43.6-102.8H435.7C435.7 348.4 416.8 393.7 383.1 427.3C349.5 460.9 304.2 480 256 480z"/></svg>
);

// --- Sample data ---
const initialMessages = [
    {
        id: 1,
        title: 'Luggage policy',
        content: 'Each passenger is allowed to carry one bag of up to 10 KG and one personal item such as a laptop bag, handbag, or briefcase of up to 5 KG. Passengers should not carry any goods like weapons, inflammable, firearms, ammunition, drugs, liquor or any other other articles that are prohibited under law.',
    },
    {
        id: 2,
        title: 'Child fare policy',
        content: 'Children above the age of 5 years need to purchase a full-fare ticket. Children under 5 may travel for free but will not be allocated a separate seat.',
    },
];

// --- Custom Modal Component (Kept as is) ---
const CustomModal = ({ modal, onConfirm, onClose }) => {
    if (!modal.visible) return null;
    const isConfirm = modal.type === 'confirm';
    return (
        <div className="custom-modal-backdrop">
            <div className="custom-modal-content">
                <div className="modal-header-section">
                    <h5 className="modal-title">{modal.title}</h5>
                    <button className="close-button" onClick={onClose}><TimesIcon className="icon-xs" /></button>
                </div>
                <div className="modal-body-section">
                    <p>{modal.message}</p>
                </div>
                <div className="modal-footer-section">
                    {isConfirm && (
                        <button className="modal-button modal-cancel" onClick={onClose}>
                            Cancel
                        </button>
                    )}
                    <button className="modal-button modal-confirm" onClick={onConfirm}>
                        {isConfirm ? 'Confirm' : 'OK'}
                    </button>
                </div>
            </div>
        </div>
    );
};

// --- Reusable Component for the Predefined Message Cards (Kept as is) ---
const PredefinedMessageCard = ({ message, onEdit, onDeleteConfirm }) => {
    const handleEdit = () => {
        // Now passing the full message object for editing
        onEdit(message);
    };

    const handleDeleteClick = () => {
        onDeleteConfirm(message.id, message.title);
    };

    return (
        <div className="predefined-card-container">
            <div className="card-indicator"></div> 
            
            <div className="card-content-wrapper">
                <div className="card-header">
                    <ChatTextIcon className="card-icon" />
                    <h4 className="card-title">{message.title}</h4>
                </div>

                <div className="card-content">
                    <p className="card-text">{message.content.substring(0, 150)}{message.content.length > 150 ? '...' : ''}</p> 
                </div>
            </div>

            <div className="card-actions">
                <button 
                    className="action-button edit-button"
                    onClick={handleEdit}
                >
                    <EditIcon className="icon-sm" />
                    Edit
                </button>
                <button 
                    className="action-button delete-button"
                    onClick={handleDeleteClick}
                >
                    <TrashIcon className="icon-sm" />
                    Delete
                </button>
            </div>
        </div>
    );
};

// --- Main Screen Component ---
const NewBusPreDefinedMessage = () => {
    // ⭐ NEW STATE for Editing
    const [editingMessage, setEditingMessage] = useState(null); 

    // Used for the form fields
    const [customerQuestion, setCustomerQuestion] = useState('');
    const [adminResponse, setAdminResponse] = useState('');

    const [messages, setMessages] = useState(initialMessages);
    const [searchTerm, setSearchTerm] = useState('');
    const [modal, setModal] = useState({ visible: false, title: '', message: '', type: null, action: null, targetId: null, targetData: null });

    const closeModal = () => {
        setModal({ visible: false, title: '', message: '', type: null, action: null, targetId: null, targetData: null });
    };

    const handleAction = () => {
        if (modal.action === 'delete' && modal.targetId !== null) {
            setMessages(prevMessages => prevMessages.filter(msg => msg.id !== modal.targetId));
            closeModal();
        } else {
            closeModal();
        }
    };

    // --- Save/Add New Message Function ---
    const handleSaveMessage = () => {
        if (!customerQuestion.trim() || !adminResponse.trim()) {
            setModal({
                visible: true,
                title: "Input Required",
                message: "Please ensure both fields are filled.",
                type: 'alert',
                action: null
            });
            return;
        }

        const newMessage = {
            id: Date.now(),
            title: customerQuestion.substring(0, 50) + (customerQuestion.length > 50 ? '...' : ''),
            content: adminResponse,
        };

        setMessages([newMessage, ...messages]);
        setCustomerQuestion('');
        setAdminResponse('');
        setModal({
            visible: true,
            title: "Success!",
            message: "New predefined message was saved successfully.",
            type: 'alert',
            action: null
        });
    };
    
    // --- New Update Message Function ---
    const handleUpdateMessage = () => {
        if (!customerQuestion.trim() || !adminResponse.trim()) {
            setModal({
                visible: true,
                title: "Input Required",
                message: "Please ensure both fields are filled for the update.",
                type: 'alert',
                action: null
            });
            return;
        }

        setMessages(prevMessages => prevMessages.map(msg =>
            msg.id === editingMessage.id
                ? { 
                    ...msg, 
                    title: customerQuestion.substring(0, 50) + (customerQuestion.length > 50 ? '...' : ''),
                    content: adminResponse 
                }
                : msg
        ));

        // Reset the form and editing state
        setEditingMessage(null);
        setCustomerQuestion('');
        setAdminResponse('');
        setModal({
            visible: true,
            title: "Success!",
            message: `Message "${customerQuestion}" updated successfully.`,
            type: 'alert',
            action: null
        });
    };

    // --- Function to set the form into Edit mode ---
    const handleEditRequest = (messageData) => {
        setEditingMessage(messageData);
        setCustomerQuestion(messageData.title);
        setAdminResponse(messageData.content);
        // Scroll to the top/form area if necessary to make the form visible
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };
    
    // --- Function to cancel Edit mode ---
    const handleCancelEdit = () => {
        setEditingMessage(null);
        setCustomerQuestion('');
        setAdminResponse('');
    };
    

    const handleDeleteConfirmation = (id, title) => {
        setModal({
            visible: true,
            title: "Confirm Deletion",
            message: `Are you sure you want to permanently delete the message: "${title}"?`,
            type: 'confirm',
            action: 'delete',
            targetId: id
        });
    };

    const filteredMessages = messages.filter(msg =>
        msg.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        msg.content.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="predefined-mgs-screen">
            
            {/* The main content structure */}
            <div className="screen-content-area">
                
                {/* --- New Blue Application Title/Name --- */}
                <h1 className="app-main-title">
                    New Bus Predefined Messages Manager
                </h1>
                {/* -------------------------------------- */}

                {/* --- Search Bar --- */}
                <div className="search-container">
                    <SearchIcon className="search-icon" />
                    <input
                        type="text"
                        placeholder="Search messages by title or content..."
                        className="search-input"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>

                {/* --- Add/Edit Message Section --- */}
                <div className="add-message-section">
                    <div className="section-title-bar">
                        {editingMessage ? (
                            <EditIcon className="plus-icon" />
                        ) : (
                            <PlusIcon className="plus-icon" />
                        )}
                        <h3 className="section-heading">
                            {editingMessage ? `Edit Message: ${editingMessage.title}` : 'Create New Message'}
                        </h3>
                    </div>

                    <textarea
                        className="text-input customer-question"
                        placeholder="Customer Question (e.g., What is your luggage policy?)"
                        rows="3"
                        value={customerQuestion}
                        onChange={(e) => setCustomerQuestion(e.target.value)}
                    />
                    <textarea
                        className="text-input admin-response"
                        placeholder="Admin Response (The detailed message to send to the customer)"
                        rows="5"
                        value={adminResponse}
                        onChange={(e) => setAdminResponse(e.target.value)}
                    />

                    <div className="form-action-buttons">
                        {editingMessage ? (
                            <>
                                <button 
                                    className="save-button"
                                    onClick={handleUpdateMessage}
                                >
                                    UPDATE MESSAGE
                                </button>
                             
                            </>
                        ) : (
                            <button 
                                className="save-button"
                                onClick={handleSaveMessage}
                            >
                                SAVE NEW MESSAGE
                            </button>
                        )}
                    </div>
                </div>
                
                {/* --- Predefined Messages List --- */}
                <div className="predefined-list-section">
                    <div className="predefined-list-header">
                        <h3 className="predefined-heading">Predefined Messages</h3>
                        <span className="message-count-tag">
                            {filteredMessages.length} total
                        </span>
                    </div>

                    <div className="message-cards-list">
                        {filteredMessages.length > 0 ? (
                            filteredMessages.map(message => (
                                <PredefinedMessageCard 
                                    key={message.id} 
                                    message={message} 
                                    onEdit={handleEditRequest}
                                    onDeleteConfirm={handleDeleteConfirmation}
                                />
                            ))
                        ) : (
                            <p className="no-results">No messages found matching your search. Try adding a new message!</p>
                        )}
                    </div>
                </div>
            </div>

            {/* Custom Modal */}
            <CustomModal 
                modal={modal}
                onConfirm={handleAction}
                onClose={closeModal}
            />
        </div>
    );
};

export default NewBusPreDefinedMessage;