import React from 'react';
import {
  Calendar,
  AlertTriangle,
  Check,
  Edit2,
  Trash2,
  Eye,
  Clock,
  Tag,
} from 'lucide-react';
import {
  formatDisplayDate,
  isTaskOverdue,
  isTaskDueToday,
} from '../utils/dateUtils';

export default function TaskCard({
  task,
  onToggleComplete,
  onEdit,
  onDelete,
  onViewDetails,
  categories,
}) {
  const isCompleted = task.status === 'Completed';
  const isOverdue = isTaskOverdue(task);
  const isDueToday = isTaskDueToday(task);

  // Find category meta
  const categoryMeta = categories?.find((c) => c.name === task.category);
  const categoryColor = categoryMeta ? categoryMeta.color : '#2d6a68';

  const getPriorityBadge = (priority) => {
    switch (priority) {
      case 'High':
        return <span className="priority-badge priority-high">High</span>;
      case 'Medium':
        return <span className="priority-badge priority-medium">Med</span>;
      case 'Low':
        return <span className="priority-badge priority-low">Low</span>;
      default:
        return null;
    }
  };

  return (
    <div
      className={`task-card ${isCompleted ? 'is-completed' : ''} ${
        isOverdue ? 'is-overdue' : ''
      }`}
    >
      <div className="task-card-left">
        {/* Accessible Custom Checkbox */}
        <button
          type="button"
          className={`task-checkbox ${isCompleted ? 'checked' : ''}`}
          onClick={() => onToggleComplete(task.id)}
          aria-label={
            isCompleted
              ? `Mark "${task.title}" as incomplete`
              : `Mark "${task.title}" as complete`
          }
        >
          {isCompleted && <Check size={14} className="check-icon" />}
        </button>
      </div>

      <div className="task-card-main" onClick={() => onViewDetails(task)}>
        <div className="task-header-row">
          <div className="task-badges-row">
            {/* Priority */}
            {getPriorityBadge(task.priority)}

            {/* Category */}
            {task.category && (
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
                {task.category}
              </span>
            )}

            {/* Overdue alert indicator */}
            {isOverdue && (
              <span className="overdue-warning-pill">
                <AlertTriangle size={12} />
                <span>Overdue</span>
              </span>
            )}
          </div>
        </div>

        {/* Task Title */}
        <h3 className={`task-title ${isCompleted ? 'completed-text' : ''}`}>
          {task.title}
        </h3>

        {/* Description snippet */}
        {task.description && (
          <p className="task-description-snippet">{task.description}</p>
        )}

        {/* Footer Meta (Due Date & Time) */}
        <div className="task-meta-footer">
          {task.dueDate ? (
            <div
              className={`task-due-info ${
                isOverdue
                  ? 'text-rose font-medium'
                  : isDueToday
                  ? 'text-indigo font-medium'
                  : 'text-muted'
              }`}
            >
              <Calendar size={13} />
              <span>{formatDisplayDate(task.dueDate)}</span>
            </div>
          ) : (
            <div className="task-due-info text-muted">
              <Clock size={13} />
              <span>No due date</span>
            </div>
          )}

          {isCompleted && task.completedAt && (
            <span className="completed-stamp">
              Completed {new Date(task.completedAt).toLocaleDateString()}
            </span>
          )}
        </div>
      </div>

      {/* Action buttons */}
      <div className="task-card-actions">
        <button
          type="button"
          className="action-icon-btn view-btn"
          onClick={() => onViewDetails(task)}
          title="View task details"
          aria-label={`View details for ${task.title}`}
        >
          <Eye size={16} />
        </button>

        <button
          type="button"
          className="action-icon-btn edit-btn"
          onClick={() => onEdit(task)}
          title="Edit task"
          aria-label={`Edit task ${task.title}`}
        >
          <Edit2 size={16} />
        </button>

        <button
          type="button"
          className="action-icon-btn delete-btn"
          onClick={() => onDelete(task)}
          title="Delete task"
          aria-label={`Delete task ${task.title}`}
        >
          <Trash2 size={16} />
        </button>
      </div>
    </div>
  );
}
