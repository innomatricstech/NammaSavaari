import React, { useState } from 'react';
import "./faqs.css";
import { db } from '../../firebase';
import { collection, addDoc, serverTimestamp, getDocs } from 'firebase/firestore';

// ✅ Reusable Modal Utility
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
  modal.onclick = (e) => { if (e.target === modal) closeModal(); };
};

// ✅ Firestore path mapping
const getFirestorePath = (topicTitle) => {
  switch (topicTitle) {
    case "Ticket Bookings": return "ticket_booking_faqs";
    case "Reschedule / Cancel Tickets": return "ticket_resche_cancl_faqs";
    case "Handle Bus Cancellations": return "bus_cancl_faqs";
    case "Manage Offers": return "offers_faqs";
    case "Process Payments & Refunds": return "payment_and_refund_faqs";
    case "Manage Wallet Transactions": return "wallet_faqs";
    case "Manage Refund Guarantee Program": return "refund_guarantee_faqs";
    case "Other Admin Queries": return "other_queries_faqs";
    case "Admin Trip Rewards": return "trip_rewards_faqs";
    default: return topicTitle.toLowerCase().replace(/ /g, "_") + "_faqs";
  }
};

// ✅ Topic Card
const TopicCard = ({ title, iconClass, onClick }) => (
  <div className="TopicCard" onClick={() => onClick(title)}>
    <div className="IconWrapper">
      <i className={iconClass}></i>
    </div>
    <p className="CardTitle">{title}</p>
  </div>
);

// ✅ FAQ Topics Grid
const FAQTopicList = ({ setPage, setSelectedTopic }) => {
  const topics = [
    { title: 'Ticket Bookings', iconClass: 'fa-solid fa-ticket-simple' },
    { title: 'Reschedule / Cancel Tickets', iconClass: 'fa-solid fa-calendar-check' },
    { title: 'Handle Bus Cancellations', iconClass: 'fa fa-times-circle' },
    { title: 'Manage Offers', iconClass: 'fa fa-tag' },
    { title: 'Process Payments & Refunds', iconClass: 'fa fa-dollar-sign' },
    { title: 'Manage Wallet Transactions', iconClass: 'fa fa-wallet' },
    { title: 'Manage Refund Guarantee Program', iconClass: 'fa fa-shield-alt' },
    { title: 'Other Admin Queries', iconClass: 'fa fa-question-circle' },
    { title: 'Admin Trip Rewards', iconClass: 'fa fa-gift' },
  ];

  const handleCardClick = (title) => {
    setSelectedTopic(title);
    setPage('form');
  };

  return (
    <main className="MainContent list-view-content">
      <h2 className="SectionTitle gradient-text">How can we help you?</h2>
      <div className="GridContainer">
        {topics.map((topic, idx) => (
          <TopicCard
            key={idx}
            title={topic.title}
            iconClass={topic.iconClass}
            onClick={handleCardClick}
          />
        ))}
      </div>
    </main>
  );
};

// ✅ Form Button
const FormButton = ({ onClick, children, iconClass, variant = 'primary' }) => (
  <button onClick={onClick} className={`FormButton ${variant}`}>
    {iconClass && <i className={`${iconClass}`} style={{ marginRight: '0.5rem' }}></i>}
    {children}
  </button>
);

// ✅ FAQ Submission Form
const FAQSubmissionForm = ({ topicTitle, handleBack }) => {
  const [formData, setFormData] = useState({ question: '', answer: '', videoLink: '' });
  const [faqsList, setFaqsList] = useState([]);
  const [showFaqs, setShowFaqs] = useState(false);
  const [expandedId, setExpandedId] = useState(null);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSave = async () => {
    if (!formData.question || !formData.answer) {
      showModal("Please fill in both Question and Answer fields.", "Validation Error");
      return;
    }

    try {
      await addDoc(collection(db, "admin", getFirestorePath(topicTitle), "faqs"), {
        question: formData.question,
        answer: formData.answer,
        videoLink: formData.videoLink || "",
        createdAt: serverTimestamp(),
      });
      showModal("FAQ saved successfully!", "Success");
      setFormData({ question: '', answer: '', videoLink: '' });
      setShowFaqs(false);
    } catch (error) {
      console.error("Error saving FAQ:", error);
      showModal("Error saving FAQ. Try again.", "Error");
    }
  };

  const handleView = async () => {
    try {
      const snapshot = await getDocs(collection(db, "admin", getFirestorePath(topicTitle), "faqs"));
      const faqs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setFaqsList(faqs);
      setShowFaqs(true);
    } catch (error) {
      console.error("Error fetching FAQs:", error);
      showModal("Error fetching FAQs.", "Error");
    }
  };

  const toggleFAQ = (id) => {
    setExpandedId(expandedId === id ? null : id);
  };

  return (
    <main className="MainContent form-view-content">
      <div className="FormHeader">
  <h1 className="FormTitle gradient-text">Create {topicTitle} FAQ</h1>
  <button className="BackArrow" onClick={handleBack}>
    <span></span>
  </button>
</div>


      <div className="FormCard glass-card">
        <label className="FormLabel" htmlFor="question">Question</label>
        <input
          id="question"
          name="question"
          type="text"
          className="FormInput"
          placeholder="Enter question"
          value={formData.question}
          onChange={handleChange}
        />

        <label className="FormLabel" htmlFor="answer">Answer / Solution</label>
        <textarea
          id="answer"
          name="answer"
          className="FormTextarea"
          placeholder="Provide detailed answer"
          value={formData.answer}
          onChange={handleChange}
        />

        <label className="FormLabel" htmlFor="videoLink">YouTube Link (Optional)</label>
        <input
          id="videoLink"
          name="videoLink"
          type="url"
          className="FormInput"
          placeholder="https://youtube.com/..."
          value={formData.videoLink}
          onChange={handleChange}
        />

        <div className="FormActions">
          <FormButton onClick={handleView} iconClass="fa fa-list" variant="secondary">
            View All FAQs
          </FormButton>
          <FormButton onClick={handleSave} iconClass="fa fa-save" variant="primary">
            Save FAQ
          </FormButton>
        </div>
      </div>

      {showFaqs && (
        <div className="FAQContainer">
          <h3 className="FAQHeading gradient-text">
            <i className="fa fa-question-circle"></i> {topicTitle} FAQs
          </h3>
          <div className="FAQList">
            {faqsList.length === 0 ? (
              <p className="NoFAQ">No FAQs found yet.</p>
            ) : (
              faqsList.map((faq) => (
                <div key={faq.id} className={`FAQCard ${expandedId === faq.id ? "expanded" : ""}`} onClick={() => toggleFAQ(faq.id)}>
                  <div className="FAQQuestion">
                    <i className={`fa ${expandedId === faq.id ? "fa-chevron-down" : "fa-chevron-right"}`}></i>
                    <span>{faq.question}</span>
                  </div>
                  <div className={`FAQAnswerWrapper ${expandedId === faq.id ? "show" : ""}`}>
                    <div className="FAQAnswer">
                      <p>{faq.answer}</p>
                      {faq.videoLink && (
                        <a
                          href={faq.videoLink}
                          target="_blank"
                          rel="noreferrer"
                          className="FAQVideoLink"
                        >
                          <i className="fa fa-play-circle"></i> Watch Video
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </main>
  );
};

// ✅ Main App Component
const App = () => {
  const [currentPage, setCurrentPage] = useState('list');
  const [selectedTopic, setSelectedTopic] = useState('Ticket Bookings');

  return (
    <div className="AppContainer">
      {currentPage === 'list'
        ? <FAQTopicList setPage={setCurrentPage} setSelectedTopic={setSelectedTopic} />
        : <FAQSubmissionForm topicTitle={selectedTopic} handleBack={() => setCurrentPage('list')} />}
    </div>
  );
};

export default App;
