// CustomModal.jsx

import React, { useEffect } from 'react';
import { X } from 'lucide-react';

const CustomModal = ({ isOpen, onClose, title, children, size = 'lg', footerButtons }) => {
  if (!isOpen) return null;

  // Handles closing the modal on ESC key press
  useEffect(() => {
    const handleEscape = (event) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };
    document.addEventListener('keydown', handleEscape);
    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [onClose]);

  // Handle click outside the modal content to close it (backdrop click)
  const handleBackdropClick = (e) => {
    if (e.target.id === 'custom-modal-backdrop') {
      onClose();
    }
  };

  return (
    <div
      id="custom-modal-backdrop"
      className="modal fade show d-block"
      tabIndex="-1"
      style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
      onClick={handleBackdropClick}
      aria-modal="true"
      role="dialog"
    >
      <div className={`modal-dialog modal-dialog-centered modal-${size}`}>
        <div className="modal-content shadow-lg rounded-4">
          
          {/* Modal Header */}
          <div className="modal-header bg-primary text-white border-0 rounded-top-4">
            <h5 className="modal-title fw-bold">{title}</h5>
            <button type="button" className="btn-close btn-close-white" aria-label="Close" onClick={onClose}>
              {/* <X size={20} /> */}
            </button>
          </div>
          
          {/* Modal Body */}
          <div className="modal-body p-4">
            {children}
          </div>
          
          {/* Modal Footer */}
          {footerButtons && (
            <div className="modal-footer d-flex justify-content-end gap-2 p-3">
              {footerButtons}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CustomModal;