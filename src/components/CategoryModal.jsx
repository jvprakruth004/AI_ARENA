import React, { useState, useEffect } from 'react';
import { X, FolderPlus, AlertCircle, Check } from 'lucide-react';

const COLOR_PRESETS = [
  '#6366f1', // Indigo
  '#ec4899', // Pink
  '#8b5cf6', // Violet
  '#10b981', // Emerald
  '#f59e0b', // Amber
  '#ef4444', // Rose
  '#06b6d4', // Cyan
  '#3b82f6', // Blue
  '#64748b', // Slate
];

export default function CategoryModal({
  isOpen,
  onClose,
  onAddCategory,
  existingCategories,
}) {
  const [name, setName] = useState('');
  const [selectedColor, setSelectedColor] = useState(COLOR_PRESETS[0]);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isOpen) {
      setName('');
      setSelectedColor(COLOR_PRESETS[0]);
      setError('');
    }
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    const trimmed = name.trim();
    if (!trimmed) {
      setError('Category name is required.');
      return;
    }

    if (
      existingCategories.some(
        (c) => c.name.toLowerCase() === trimmed.toLowerCase()
      )
    ) {
      setError('A category with this name already exists.');
      return;
    }

    onAddCategory({
      id: `cat-${Date.now()}`,
      name: trimmed,
      color: selectedColor,
      icon: 'Folder',
    });
    onClose();
  };

  return (
    <div
      className="modal-overlay"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="category-modal-title"
    >
      <div className="modal-container category-modal">
        <div className="modal-header">
          <div className="modal-title-with-icon">
            <FolderPlus size={20} className="text-indigo" />
            <h2 id="category-modal-title" className="modal-heading">
              New Category
            </h2>
          </div>
          <button
            type="button"
            className="modal-close-btn"
            onClick={onClose}
            aria-label="Close modal"
          >
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="modal-form">
          {error && (
            <div className="form-error-alert" role="alert">
              <AlertCircle size={16} />
              <span>{error}</span>
            </div>
          )}

          <div className="form-group">
            <label htmlFor="cat-name-input" className="form-label">
              Category Name <span className="text-rose">*</span>
            </label>
            <input
              id="cat-name-input"
              type="text"
              className="form-input"
              placeholder="e.g. Design, Finance, Client"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                if (error) setError('');
              }}
              autoFocus
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Color Tag</label>
            <div className="color-presets-picker">
              {COLOR_PRESETS.map((color) => {
                const isSelected = selectedColor === color;
                return (
                  <button
                    key={color}
                    type="button"
                    className={`color-circle-btn ${isSelected ? 'selected' : ''}`}
                    style={{ backgroundColor: color }}
                    onClick={() => setSelectedColor(color)}
                    aria-label={`Select color ${color}`}
                  >
                    {isSelected && <Check size={14} className="color-check-icon" />}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="modal-footer">
            <button type="button" className="btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn-primary">
              Create Category
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
