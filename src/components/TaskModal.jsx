import React, { useState, useEffect, useRef } from 'react';
import { X, Calendar, AlertCircle, Check, Tag } from 'lucide-react';
import { getTodayString } from '../utils/dateUtils';

export default function TaskModal({
  isOpen,
  onClose,
  onSubmit,
  editingTask,
  categories,
  onOpenNewCategory,
}) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState('Medium');
  const [category, setCategory] = useState('Work');
  const [dueDate, setDueDate] = useState('');
  const [status, setStatus] = useState('Pending');
  const [error, setError] = useState('');

  const titleInputRef = useRef(null);

  // Populate data when modal opens or editingTask changes
  useEffect(() => {
    if (isOpen) {
      if (editingTask) {
        setTitle(editingTask.title || '');
        setDescription(editingTask.description || '');
        setPriority(editingTask.priority || 'Medium');
        setCategory(editingTask.category || (categories[0]?.name || 'General'));
        setDueDate(editingTask.dueDate || '');
        setStatus(editingTask.status || 'Pending');
      } else {
        // Reset form for new task
        setTitle('');
        setDescription('');
        setPriority('Medium');
        setCategory(categories[0]?.name || 'Work');
        setDueDate('');
        setStatus('Pending');
      }
      setError('');
      // Focus title input on open
      setTimeout(() => {
        titleInputRef.current?.focus();
      }, 50);
    }
  }, [isOpen, editingTask, categories]);

  // Handle ESC key to close
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) {
      setError('Task title is required.');
      titleInputRef.current?.focus();
      return;
    }

    const taskPayload = {
      title: title.trim(),
      description: description.trim(),
      priority,
      category,
      dueDate: dueDate || null,
      status,
      completedAt:
        status === 'Completed'
          ? editingTask?.completedAt || new Date().toISOString()
          : null,
    };

    onSubmit(taskPayload);
  };

  return (
    <div
      className="modal-overlay"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <div className="modal-container task-modal">
        <div className="modal-header">
          <h2 id="modal-title" className="modal-heading">
            {editingTask ? 'Edit Task' : 'Create New Task'}
          </h2>
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

          {/* Title */}
          <div className="form-group">
            <label htmlFor="task-title" className="form-label">
              Task Title <span className="text-rose">*</span>
            </label>
            <input
              id="task-title"
              ref={titleInputRef}
              type="text"
              className={`form-input ${error ? 'input-error' : ''}`}
              placeholder="e.g. Prepare client project presentation"
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
                if (error) setError('');
              }}
              required
            />
          </div>

          {/* Description */}
          <div className="form-group">
            <label htmlFor="task-desc" className="form-label">
              Description <span className="label-optional">(Optional)</span>
            </label>
            <textarea
              id="task-desc"
              className="form-textarea"
              rows={3}
              placeholder="Add extra context, checklist notes, or links..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          {/* Priority Selection */}
          <div className="form-group">
            <label className="form-label">Priority</label>
            <div className="priority-button-group" role="radiogroup" aria-label="Priority level">
              {['Low', 'Medium', 'High'].map((p) => {
                const isSelected = priority === p;
                return (
                  <button
                    key={p}
                    type="button"
                    role="radio"
                    aria-checked={isSelected}
                    className={`priority-select-btn priority-btn-${p.toLowerCase()} ${
                      isSelected ? 'selected' : ''
                    }`}
                    onClick={() => setPriority(p)}
                  >
                    {isSelected && <Check size={14} className="priority-check" />}
                    <span>{p}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Row: Category & Due Date */}
          <div className="form-row">
            {/* Category */}
            <div className="form-group flex-1">
              <div className="label-with-action">
                <label htmlFor="task-cat" className="form-label">Category</label>
                <button
                  type="button"
                  className="link-btn-small"
                  onClick={onOpenNewCategory}
                >
                  + New
                </button>
              </div>
              <select
                id="task-cat"
                className="form-select"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              >
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.name}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Due Date */}
            <div className="form-group flex-1">
              <label htmlFor="task-due" className="form-label">
                Due Date <span className="label-optional">(Optional)</span>
              </label>
              <div className="date-input-wrapper">
                <input
                  id="task-due"
                  type="date"
                  className="form-input"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* Status (Only when editing or explicit choice) */}
          <div className="form-group">
            <label className="form-label">Initial Status</label>
            <div className="status-radio-group">
              <label className="radio-label">
                <input
                  type="radio"
                  name="status"
                  value="Pending"
                  checked={status === 'Pending'}
                  onChange={() => setStatus('Pending')}
                />
                <span>Pending</span>
              </label>
              <label className="radio-label">
                <input
                  type="radio"
                  name="status"
                  value="Completed"
                  checked={status === 'Completed'}
                  onChange={() => setStatus('Completed')}
                />
                <span>Completed</span>
              </label>
            </div>
          </div>

          {/* Form Actions */}
          <div className="modal-footer">
            <button
              type="button"
              className="btn-secondary"
              onClick={onClose}
            >
              Cancel
            </button>
            <button type="submit" className="btn-primary">
              {editingTask ? 'Save Changes' : 'Add Task'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
