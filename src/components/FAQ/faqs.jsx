import React from 'react';
import "./faqs.css"

// --- Consolidated Icon Definitions (Inline SVGs) ---
const icons = {
    // List Icons
    TicketIcon: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path fill="currentColor" d="M128 0C92.7 0 64 28.7 64 64V320c0 35.3 28.7 64 64 64H384c35.3 0 64-28.7 64-64V64c0-35.3-28.7-64-64-64H128zM384 480c17.7 0 32-14.3 32-32s-14.3-32-32-32H128c-17.7 0-32 14.3-32 32s14.3 32 32 32H384z"/></svg>`,
    RefreshCcwIcon: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path fill="currentColor" d="M463.5 224H472c13.3 0 24-10.7 24-24V72c0-9.7-5.8-18.5-14.8-22.2s-19.3-1.7-26.2 5.2L413.4 96.6c-87.6-86.5-228.7-86.2-316.5 0C73.2 122 55.6 150 44.8 179.3c-5.9 15.6-20.5 25.7-36.9 24.8S0 192.9 0 176c0-26.7 13.5-51.5 35.1-68.5c46.7-35.4 110.1-51.3 177-46.7c80.9 5.4 156 36.5 210.8 91.3L463.5 224zm-22.3 255.4c1.1 1.2 2.4 2.1 3.7 2.9l4.5 2.7c15.8 9.3 35 7.8 48.1-4.2c12.1-11.4 15.1-29 8.6-43.2L419.8 352H408c-13.3 0-24 10.7-24 24v120c0 13.3 10.7 24 24 24h12c14.7 0 26.8-10.2 29.8-24.3l6-27.1c.3-1.4 .6-2.9 .7-4.4c.5-5 .5-10.1 .5-15.3c0-48.7-19.3-95.2-53.1-129.5l-44.1-44.6c-13.3-13.3-34.9-13.3-48.2 0s-13.3 34.9 0 48.2l44.1 44.6c34.9 35.4 81.5 54.4 129.5 54.4c21.2 0 41.5-4.5 59.5-12.7l41.6-18.8z"/></svg>`,
    XCircleIcon: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path fill="currentColor" d="M256 0C114.6 0 0 114.6 0 256S114.6 512 256 512 512 397.4 512 256 397.4 0 256 0zm-101.9 336c-6.2 6.2-16.4 6.2-22.6 0s-6.2-16.4 0-22.6L233.4 256 153.1 175.7c-6.2-6.2-6.2-16.4 0-22.6s16.4-6.2 22.6 0L256 233.4 336.3 153.1c6.2-6.2 16.4-6.2 22.6 0s6.2 16.4 0 22.6L278.6 256l80.3 80.3c6.2 6.2 6.2 16.4 0 22.6s-16.4 6.2-22.6 0L256 278.6l-80.3 80.3z"/></svg>`,
    TagIcon: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path fill="currentColor" d="M471.2 56.6L437 22.4c-9.9-9.9-26-9.9-35.9 0L121.2 291.3c-7.9 7.9-12.7 18.6-14.3 30.1c-1.6 11.5 2.1 23.3 10.1 31.3l119.5 119.5c8 8 19.8 11.7 31.3 10.1c11.5-1.6 22.2-6.4 30.1-14.3L471.2 92.6c9.9-9.9 9.9-26 0-35.9zM384 192c0-17.7-14.3-32-32-32H224c-17.7 0-32 14.3-32 32s14.3 32 32 32H352c17.7 0 32-14.3 32-32z"/></svg>`,
    DollarSignIcon: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path fill="currentColor" d="M304 32c-35.4 0-67.6 16.7-88 43.1V224H128c-17.7 0-32 14.3-32 32s14.3 32 32 32h88v152.9c20.4 26.5 52.6 43.1 88 43.1s67.6-16.7 88-43.1V288h-40v32c0 17.7-14.3 32-32 32s-32-14.3-32-32V160c0-17.7 14.3-32 32-32s32 14.3 32 32v32h40V75.1C371.6 48.7 339.4 32 304 32z"/></svg>`,
    WalletIcon: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path fill="currentColor" d="M256 80c0-17.7-14.3-32-32-32H16c-17.7 0-32 14.3-32 32V432c0 35.3 28.7 64 64 64H448c35.3 0 64-28.7 64-64V128c0-17.7-14.3-32-32-32H384c-3.1 0-6.2 .4-9.2 1.2l-128 32c-23.7 5.9-46.1 21.2-61.9 42.6c-20.3 27.6-30.8 62.4-30.8 98V416H48V96c0-8.8 7.2-16 16-16H224c17.7 0 32 14.3 32 32s-14.3 32-32 32H64V416h160V224c0-34.7 10.5-69.5 30.8-97c15.8-21.3 38.2-36.6 61.9-42.6l128-32c3-1 6-1.2 9.2-1.2H480c8.8 0 16 7.2 16 16V432c0 8.8-7.2 16-16 16H64c-8.8 0-16-7.2-16-16V416z"/></svg>`,
    ShieldIcon: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path fill="currentColor" d="M64 480C64 497.7 78.3 512 96 512H416c17.7 0 32-14.3 32-32V296.8c0-5.8-1.5-11.6-4.5-16.7L313.2 5.4c-9.3-15.5-26.6-24.6-44.5-24.6s-35.2 9.1-44.5 24.6L68.5 280.1c-3.1 5.1-4.5 10.9-4.5 16.7V480z"/></svg>`,
    HelpCircleIcon: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path fill="currentColor" d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM216 336h24v16c0 13.3 10.7 24 24 24s24-10.7 24-24V320c0-35.3-28.7-64-64-64H208V128h80V96H216c-35.3 0-64 28.7-64 64V256c-35.3 0-64 28.7-64 64v32h24v16c0 13.3 10.7 24 24 24s24-10.7 24-24v-16zm40-192a32 32 0 1 1 0 64 32 32 0 1 1 0-64z"/></svg>`,
    GiftIcon: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path fill="currentColor" d="M105.7 221.7c7.9-22.3 29.1-37.7 53.6-37.7h21.4c8-23.7 23.3-43.8 42.6-59.5C230.1 113.8 242.9 105 256 105s25.9 8.8 38.7 19.5c19.3 15.7 34.6 35.8 42.6 59.5h21.4c24.5 0 45.7 15.4 53.6 37.7c2.3 6.6 3.6 13.6 3.9 20.8V352h-24V288H128v64H104V242.5c.3-7.2 1.6-14.2 3.9-20.8zM24 352H80v64H24c-13.3 0-24 10.7-24 24v40c0 13.3 10.7 24 24 24H488c13.3 0 24-10.7 24-24V432c0-13.3-10.7-24-24-24H432V352H384v64H128V352H24z"/></svg>`,
    BarsIcon: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path fill="currentColor" d="M0 96C0 78.3 14.3 64 32 64H416c17.7 0 32 14.3 32 32s-14.3 32-32 32H32C14.3 128 0 113.7 0 96zM0 256c0-17.7 14.3-32 32-32H416c17.7 0 32 14.3 32 32s-14.3 32-32 32H32c-17.7 0-32-14.3-32-32zM448 416c0 17.7-14.3 32-32 32H32c-17.7 0-32-14.3-32-32s14.3-32 32-32H416c17.7 0 32 14.3 32 32z"/></svg>`,
    CogIcon: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path fill="currentColor" d="M495.9 166.6c3.2 8.7 .5 18.4-6.4 24.5l-65.5 56.4c3.9 19.8 3.9 40.7 0 60.5l65.5 56.4c6.9 6.1 9.6 15.8 6.4 24.5c-3.1 8.7-11.7 15.4-21.7 17.2L352 401.7c-16.1 27-37.1 49-61.1 66.8l-10.4 7.6c-7.9 5.8-17.5 8.9-27.1 8.9s-19.2-3.1-27.1-8.9l-10.4-7.6c-24-17.8-45-39.8-61.1-66.8L37.8 418.3c-10-1.7-18.6-8.5-21.7-17.2s-3.2-15.8 3.6-21.5L99.7 289.8c-3.9-19.8-3.9-40.7 0-60.5L34.2 172.9c-6.9-6.1-9.6-15.8-6.4-24.5c3.1-8.7 11.7-15.4 21.7-17.2L160 110.3c16.1-27 37.1-49 61.1-66.8l10.4-7.6c7.9-5.8 17.5-8.9 27.1-8.9s19.2 3.1 27.1 8.9l10.4 7.6c24 17.8 45 39.8 61.1 66.8L474.2 138.7c10 1.7 18.6 8.5 21.7 17.2s3.2 15.8-3.6 21.5L412.3 229.2c3.9 19.8 3.9 40.7 0 60.5l65.5 56.4c6.9 6.1 9.6 15.8 6.4 24.5l-2.6 7.2zM256 384a128 128 0 1 0 0-256 128 128 0 1 0 0 256zm0-192a64 64 0 1 1 0 128 64 64 0 1 1 0-128z"/></svg>`,

    // Form Icons
   ArrowLeftIcon: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path fill="currentColor" d="M9.4 233.4c-12.5 12.5-12.5 32.8 0 45.3l160 160c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L109.2 288H416c17.7 0 32-14.3 32-32s-14.3-32-32-32H109.2l105.4-105.4c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0l-160 160z"/></svg>`,
   //// UploadImageIcon: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path fill="currentColor" d="M448 80c8.8 0 16 7.2 16 16V416c0 8.8-7.2 16-16 16H64c-8.8 0-16-7.2-16-16V96c0-8.8 7.2-16 16-16H448zM64 32C28.7 32 0 60.7 0 96V416c0 35.3 28.7 64 64 64H448c35.3 0 64-28.7 64-64V96c0-35.3-28.7-64-64-64H64zM262.6 153.9c-5.7-8.7-16.1-8.7-21.8 0l-144 224c-14.2 21.3 1.9 49.9 26.9 49.9h288c25.1 0 41.1-28.6 26.9-49.9l-144-224zm50.6 112c33.1 0 60-26.9 60-60s-26.9-60-60-60s-60 26.9-60 60s26.9 60 60 60z"/></svg>`,
   // SaveIcon: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path fill="currentColor" d="M416 0C402.7 0 384 14.3 384 32V256c0 17.7 14.3 32 32 32s32-14.3 32-32V32c0-17.7-14.3-32-32-32zM0 96C0 78.3 14.3 64 32 64H288c17.7 0 32 14.3 32 32v224c0 17.7-14.3 32-32 32H32c-17.7 0-32-14.3-32-32V96zm64 64c0-17.7 14.3-32 32-32H256c17.7 0 32 14.3 32 32s-14.3 32-32 32H96c-17.7 0-32-14.3-32-32zM384 384c-17.7 0-32 14.3-32 32v64c0 17.7 14.3 32 32 32s32-14.3 32-32V416c0-17.7-14.3-32-32-32z"/></svg>`,
    //ListIcon: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path fill="currentColor" d="M64 144a48 48 0 1 0 0-96 48 48 0 1 0 0 96zm256 0h128c17.7 0 32-14.3 32-32s-14.3-32-32-32H320c-17.7 0-32 14.3-32 32s14.3 32 32 32zM64 432a48 48 0 1 0 0-96 48 48 0 1 0 0 96zm256 0h128c17.7 0 32-14.3 32-32s-14.3-32-32-32H320c-17.7 0-32 14.3-32 32s14.3 32 32 32zM64 288a48 48 0 1 0 0-96 48 48 0 1 0 0 96zm256 0h128c17.7 0 32-14.3 32-32s-14.3-32-32-32H320c-17.7 0-32 14.3-32 32s14.3 32 32 32z"/></svg>`
};

// --- Custom Modal Utility ---
const showModal = (message, title = "Notification") => {
    const modal = document.createElement('div');
    modal.className = 'ModalContainer';
    modal.innerHTML = `
        <div class="ModalContent">
            <h3 class="ModalTitle">${title}</h3>
            <p>${message}</p>
            <button class="ModalButton">Close</button>
        </div>
    `;
    document.body.appendChild(modal);
    
    const closeModal = () => document.body.removeChild(modal);

    modal.querySelector('.ModalButton').onclick = closeModal;
    modal.onclick = (e) => { 
        if (e.target === modal) {
             closeModal();
        }
    };
};


// --- Topic Card Component (List View) ---
const TopicCard = ({ title, iconSvg, onClick }) => {
    return (
        <a
            href="#"
            className="TopicCard"
            onClick={(e) => {
                e.preventDefault();
                onClick(title);
            }}
        >
            <div
                className="IconWrapper"
                dangerouslySetInnerHTML={{ __html: iconSvg }}
            />
            <p className="CardTitle">{title}</p>
        </a>
    );
};

// --- FAQ Topic List Component (Page 1) ---
const FAQTopicList = ({ setPage, setSelectedTopic }) => {
    const topics = [
        { title: 'Ticket Bookings', icon: icons.TicketIcon },
        { title: 'Reschedule / Cancel Tickets', icon: icons.RefreshCcwIcon },
        { title: 'Handle Bus Cancellations', icon: icons.XCircleIcon },
        { title: 'Manage Offers', icon: icons.TagIcon },
        { title: 'Process Payments & Refunds', icon: icons.DollarSignIcon },
        { title: 'Manage Wallet Transactions', icon: icons.WalletIcon },
        { title: 'Manage Refund Guarantee Program', icon: icons.ShieldIcon },
        { title: 'Other Admin Queries', icon: icons.HelpCircleIcon },
        { title: 'Admin Trip Rewards', icon: icons.GiftIcon },
    ];

    const handleCardClick = (title) => {
        setSelectedTopic(title);
        setPage('form');
    };

    const handleMenuClick = () => {
        showModal("The side navigation menu would open here, providing links to dashboards and other admin sections.", "Menu Panel");
    };

    const handleSettingsClick = () => {
        showModal("The settings modal would open here to adjust application preferences.", "Settings");
    };


    return (
        <>
            <main className="MainContent list-view-content">
                <h2 className="SectionTitle">How can we help you?</h2>
                
                <div className="GridContainer">
                    {topics.map((topic, index) => (
                        <TopicCard 
                            key={index} 
                            title={topic.title} 
                            iconSvg={topic.icon} 
                            onClick={handleCardClick}
                        />
                    ))}
                </div>
            </main>
        </>
    );
};

// --- Form Button Component (for Form View) ---
const FormButton = ({ onClick, children, iconSvg, variant = 'primary' }) => {
    return (
        <button
            onClick={onClick}
            className={`FormButton ${variant}`}
        >
            {iconSvg && (
                <span 
                    style={{ width: '1.2rem', height: '1.2rem', marginRight: '0.5rem' }}
                    dangerouslySetInnerHTML={{ __html: iconSvg }} 
                />
            )}
            {children}
        </button>
    );
};

// --- FAQ Submission Form Component (Page 2) ---
const FAQSubmissionForm = ({ topicTitle, handleBack }) => {
    const [formData, setFormData] = React.useState({
        question: '',
        answer: '',
        videoLink: ''
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSave = () => {
        console.log('Saving FAQ:', formData);
        showModal(`Successfully created FAQ for: ${topicTitle}. Question: "${formData.question.substring(0, 30)}..."`, "FAQ Saved");
        setFormData({ question: '', answer: '', videoLink: '' }); // Clear form
    };

    const handleUpload = () => {
        showModal("The image upload feature would integrate with a cloud storage service here.", "Upload Images");
    };
    
    const handleView = () => {
        showModal(`Navigating to the list view for all ${topicTitle} FAQs.`, "View FAQs");
    };

    return (
        <>
            {/* Main Content Area */}
            <main className="MainContent form-view-content">
                
                {/* Custom Title and Back Button Area */}
                <div className="FormHeader">
                    <button 
                        className="HeaderButton back-button" 
                        aria-label="Back to Topics" 
                        onClick={handleBack}
                        dangerouslySetInnerHTML={{ __html: icons.ArrowLeftIcon }}
                    />
                    <h1 className="FormTitle">Create {topicTitle} FAQ</h1>
                </div>
                
                <div className="FormCard">
                    {/* Question Input */}
                    <label className="FormLabel" htmlFor="question">Question</label>
                    <input
                        id="question"
                        type="text"
                        name="question"
                        className="FormInput"
                        placeholder="Enter the customer's question"
                        value={formData.question}
                        onChange={handleChange}
                    />
                    
                    {/* Answer Textarea */}
                    <label className="FormLabel" htmlFor="answer">Answer / Solution</label>
                    <textarea
                        id="answer"
                        name="answer"
                        className="FormTextarea"
                        placeholder="Provide a detailed answer or solution"
                        value={formData.answer}
                        onChange={handleChange}
                    />
                    
                    {/* Youtube Link Input */}
                    <label className="FormLabel" htmlFor="videoLink">YouTube Link (Optional)</label>
                    <input
                        id="videoLink"
                        type="url"
                        name="videoLink"
                        className="FormInput"
                        placeholder="e.g., https://youtube.com/watch?v=..."
                        value={formData.videoLink}
                        onChange={handleChange}
                    />
                    
                    {/* Action Buttons */}
                    <div className="FormActions">
                        <FormButton 
                            onClick={handleUpload}
                            iconSvg={icons.UploadImageIcon}
                            variant="secondary"
                        >
                            Upload Images
                        </FormButton>

                        <FormButton 
                            onClick={handleView}
                            iconSvg={icons.ListIcon}
                            variant="tertiary"
                        >
                            View All FAQs
                        </FormButton>

                        <FormButton 
                            onClick={handleSave}
                            iconSvg={icons.SaveIcon}
                            variant="primary"
                        >
                            Save FAQ
                        </FormButton>
                    </div>
                </div>
            </main>
        </>
    );
};


// --- Main App Component (Router) ---
const App = () => {
    // State to handle navigation: 'list' is the default page, 'form' is the target page.
    const [currentPage, setCurrentPage] = React.useState('list'); 
    // State to hold the title of the topic clicked
    const [selectedTopic, setSelectedTopic] = React.useState('Ticket Bookings'); 

    const renderPage = () => {
        if (currentPage === 'list') {
            return <FAQTopicList 
                        setPage={setCurrentPage} 
                        setSelectedTopic={setSelectedTopic}
                    />;
        } else if (currentPage === 'form') {
            return <FAQSubmissionForm 
                        topicTitle={selectedTopic}
                        handleBack={() => setCurrentPage('list')} 
                    />;
        }

        return <p style={{ textAlign: 'center', marginTop: '100px' }}>Page not found.</p>;
    };

    return (
        <div className="AppContainer">
            {renderPage()}
        </div>
    );
};

export default App;