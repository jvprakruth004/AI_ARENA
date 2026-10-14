import React, { useEffect } from 'react';
import {
  X,
  Calendar,
  Clock,
  AlertTriangle,
  CheckCircle2,
  Edit2,
  Trash2,
  Check,
} from 'lucide-react';
import { formatDisplayDate, isTaskOverdue } from '../utils/dateUtils';

export default function TaskDetailModal({
  isOpen,
  onClose,
  task,
  onEdit,
  onDelete,
  onToggleComplete,
  categories,
}) {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen || !task) return null;

  const isCompleted = task.status === 'Completed';
  const isOverdue = isTaskOverdue(task);
  const cat = categories?.find((c) => c.name === task.category);
  const categoryColor = cat ? cat.color : '#2d6a68';

  return (
    <div
      className="modal-overlay"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="detail-modal-title"
    >
      <div className="modal-container task-detail-modal">
        <div className="modal-header">
          <div className="detail-status-badges">
            <span
              className={`status-pill ${
                isCompleted ? 'status-pill-completed' : 'status-pill-pending'
              }`}
            >
              {isCompleted ? 'Completed' : 'In Progress'}
            </span>
            <span className={`priority-badge priority-${task.priority.toLowerCase()}`}>
              {task.priority} Priority
            </span>
          </div>
          <button
            type="button"
            className="modal-close-btn"
            onClick={onClose}
            aria-label="Close details"
          >
            <X size={18} />
          </button>
        </div>

        <div className="modal-body">
          <h2 id="detail-modal-title" className="detail-task-title">
            {task.title}
          </h2>

          <div className="detail-meta-grid">
            <div className="detail-meta-item">
              <span className="meta-label">Category</span>
              <div className="meta-value">
                <span
                  className="category-pill"
                  style={{
                    backgroundColor: `${categoryColor}18`,
                    color: categoryColor,
                    borderColor: `${categoryColor}30`,
                  }}
                >
                  <span
                    className="category-dot"
                    style={{ backgroundColor: categoryColor }}
                  />
                  {task.category || 'Uncategorized'}
                </span>
              </div>
            </div>

            <div className="detail-meta-item">
              <span className="meta-label">Due Date</span>
              <div className="meta-value">
                {task.dueDate ? (
                  <span
                    className={`date-display ${
                      isOverdue ? 'text-rose font-medium' : ''
                    }`}
                  >
                    <Calendar size={14} />
                    <span>{formatDisplayDate(task.dueDate)} ({task.dueDate})</span>
                    {isOverdue && (
                      <span className="overdue-inline-tag">
                        <AlertTriangle size={12} /> Overdue
                      </span>
                    )}
                  </span>
                ) : (
                  <span className="text-muted">No deadline set</span>
                )}
              </div>
            </div>

            <div className="detail-meta-item">
              <span className="meta-label">Created At</span>
              <div className="meta-value text-muted">
                {task.createdAt
                  ? new Date(task.createdAt).toLocaleString(undefined, {
                      dateStyle: 'medium',
                      timeStyle: 'short',
                    })
                  : 'N/A'}
              </div>
            </div>

            {isCompleted && task.completedAt && (
              <div className="detail-meta-item">
                <span className="meta-label">Completed At</span>
                <div className="meta-value text-emerald font-medium">
                  {new Date(task.completedAt).toLocaleString(undefined, {
                    dateStyle: 'medium',
                    timeStyle: 'short',
                  })}
                </div>
              </div>
            )}
          </div>

          <div className="detail-description-section">
            <h4 className="description-heading">Description & Notes</h4>
            {task.description ? (
              <div className="description-content">{task.description}</div>
            ) : (
              <p className="no-description-text">No description provided for this task.</p>
            )}
          </div>
        </div>

        <div className="modal-footer detail-modal-footer">
          <div className="detail-actions-left">
            <button
              type="button"
              className={`btn-outline ${isCompleted ? 'btn-reopen' : 'btn-complete'}`}
              onClick={() => {
                onToggleComplete(task.id);
                onClose();
              }}
            >
              {isCompleted ? (
                <>
                  <Clock size={16} /> Reopen Task
                </>
              ) : (
                <>
                  <Check size={16} /> Mark as Complete
                </>
              )}
            </button>
          </div>

          <div className="detail-actions-right">
            <button
              type="button"
              className="btn-danger-outline"
              onClick={() => {
                onDelete(task);
                onClose();
              }}
            >
              <Trash2 size={16} /> Delete
            </button>
            <button
              type="button"
              className="btn-primary"
              onClick={() => {
                onEdit(task);
                onClose();
              }}
            >
              <Edit2 size={16} /> Edit
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
