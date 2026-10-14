import React, { useEffect } from 'react';
import { AlertTriangle, X, Trash2 } from 'lucide-react';

export default function DeleteConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  taskTitle,
}) {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="modal-overlay"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="confirm-delete-title"
    >
      <div className="modal-container confirm-delete-modal">
        <div className="modal-header">
          <div className="delete-warning-icon">
            <AlertTriangle size={24} className="text-rose" />
          </div>
          <button
            type="button"
            className="modal-close-btn"
            onClick={onClose}
            aria-label="Close dialog"
          >
            <X size={18} />
          </button>
        </div>

        <div className="modal-body">
          <h2 id="confirm-delete-title" className="confirm-modal-title">
            Delete Task?
          </h2>
          <p className="confirm-modal-desc">
            Are you sure you want to delete{' '}
            <strong className="text-emphasis">"{taskTitle}"</strong>? This
            action cannot be undone.
          </p>
        </div>

        <div className="modal-footer">
          <button type="button" className="btn-secondary" onClick={onClose}>
            Cancel
          </button>
          <button
            type="button"
            className="btn-danger"
            onClick={onConfirm}
            autoFocus
          >
            <Trash2 size={16} /> Delete Task
          </button>
        </div>
      </div>
    </div>
  );
}
