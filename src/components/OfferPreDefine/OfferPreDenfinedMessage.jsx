import React, { useState } from 'react';
import './OfferPreDefinedMessage.css';

const Header = () => (
    <div className="header">
        <div className="header-left">
         
            <h3 className="header-title">Offers Predefined Messages</h3>
        </div>
     
    </div>
);

const SearchBar = ({ searchTerm, onSearchChange }) => (
    <div className="search-bar">
        <svg xmlns="http://www.w3.org/2000/svg" className="search-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <input
            type="text"
            placeholder="Search offer messages..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
        />
    </div>
);

const OfferForm = ({ onSubmit, newOffer, setNewOffer, isEditing, onCancelEdit }) => {
    const handleSubmit = (e) => { e.preventDefault(); onSubmit(); };
    return (
        <div className="offer-form">
            <h2>{isEditing ? 'Edit Offer Message' : 'Add New Offer Message'}</h2>
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    placeholder="Customer Question"
                    value={newOffer.question}
                    onChange={(e) => setNewOffer({ ...newOffer, question: e.target.value })}
                    required
                />
                <textarea
                    placeholder="Offer Details (Response)"
                    value={newOffer.details}
                    onChange={(e) => setNewOffer({ ...newOffer, details: e.target.value })}
                    required
                />
                <div className="form-buttons">
                    <button type="submit" className="btn-primary">
                        {isEditing ? 'UPDATE OFFER' : 'SAVE OFFER'}
                    </button>
                    {isEditing && <button type="button" onClick={onCancelEdit} className="btn-secondary">CANCEL</button>}
                </div>
            </form>
        </div>
    );
};

const OfferItem = ({ offer, onEdit, onDelete }) => (
    <div className="offer-item">
        <div className="offer-question">{offer.question}</div>
        <div className="offer-details">{offer.details}</div>
        <div className="offer-actions">
            <button className="btn-edit" onClick={() => onEdit(offer)}>Edit</button>
            <button className="btn-delete" onClick={() => onDelete(offer.id)}>Delete</button>
        </div>
    </div>
);

export default function OfferPreDefinedMessage() {
    const [offers, setOffers] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [newOffer, setNewOffer] = useState({ id: null, question: '', details: '' });
    const [isEditing, setIsEditing] = useState(false);

    const handleSaveOffer = () => {
        if (!newOffer.question.trim() || !newOffer.details.trim()) return;
        if (isEditing) {
            setOffers(offers.map(o => o.id === newOffer.id ? newOffer : o));
        } else {
            setOffers([...offers, { ...newOffer, id: Date.now() }]);
        }
        setNewOffer({ id: null, question: '', details: '' });
        setIsEditing(false);
    };

    const handleEditOffer = (offer) => {
        setNewOffer(offer);
        setIsEditing(true);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleDeleteOffer = (id) => {
        if (!window.confirm("Delete this offer?")) return;
        setOffers(offers.filter(o => o.id !== id));
    };

    const handleCancelEdit = () => { setNewOffer({ id: null, question: '', details: '' }); setIsEditing(false); };

    const filteredOffers = offers.filter(o => o.question.toLowerCase().includes(searchTerm.toLowerCase()) || o.details.toLowerCase().includes(searchTerm.toLowerCase()));

    return (
        <div className="app-container">
            <Header />
            <SearchBar searchTerm={searchTerm} onSearchChange={setSearchTerm} />
            <OfferForm onSubmit={handleSaveOffer} newOffer={newOffer} setNewOffer={setNewOffer} isEditing={isEditing} onCancelEdit={handleCancelEdit} />
            <div className="offers-list">
                {filteredOffers.length > 0 ? filteredOffers.map(offer => (
                    <OfferItem key={offer.id} offer={offer} onEdit={handleEditOffer} onDelete={handleDeleteOffer} />
                )) : <div className="no-offers">No predefined offers found.</div>}
            </div>
        </div>
    );
}
