import React from 'react';
import TaskCard from './TaskCard';
import { Plus, CheckCircle, Search, Calendar, Inbox } from 'lucide-react';

export default function TaskList({
  tasks,
  activeView,
  searchQuery,
  isFiltered,
  onClearFilters,
  onOpenTaskModal,
  onToggleComplete,
  onEdit,
  onDelete,
  onViewDetails,
  categories,
}) {
  if (tasks.length === 0) {
    let emptyIcon = <Inbox size={48} className="text-muted" />;
    let emptyTitle = 'No tasks found';
    let emptyDescription = 'You do not have any tasks in this view.';
    let actionButton = (
      <button
        type="button"
        className="btn-primary"
        onClick={() => onOpenTaskModal()}
      >
        <Plus size={16} />
        <span>Create a Task</span>
      </button>
    );

    if (searchQuery || isFiltered) {
      emptyIcon = <Search size={48} className="text-muted" />;
      emptyTitle = 'No matching tasks';
      emptyDescription = 'No tasks match your current search and filter criteria.';
      actionButton = (
        <button
          type="button"
          className="btn-secondary"
          onClick={onClearFilters}
        >
          <span>Reset Filters</span>
        </button>
      );
    } else if (activeView === 'today') {
      emptyIcon = <Calendar size={48} className="text-indigo" />;
      emptyTitle = 'No tasks due today!';
      emptyDescription = 'You have no deadlines today. Enjoy your day or plan ahead.';
    } else if (activeView === 'upcoming') {
      emptyIcon = <Calendar size={48} className="text-muted" />;
      emptyTitle = 'No upcoming tasks';
      emptyDescription = 'There are no future tasks scheduled. Schedule one now!';
    } else if (activeView === 'completed') {
      emptyIcon = <CheckCircle size={48} className="text-emerald" />;
      emptyTitle = 'No completed tasks yet';
      emptyDescription = 'Mark your pending tasks as done to see them archived here.';
    }

    return (
      <div className="task-list-empty-state">
        <div className="empty-icon-box">{emptyIcon}</div>
        <h3 className="empty-state-title">{emptyTitle}</h3>
        <p className="empty-state-text">{emptyDescription}</p>
        <div className="empty-state-actions">{actionButton}</div>
      </div>
    );
  }

  return (
    <div className="task-list" role="list" aria-label="Task list">
      {tasks.map((task) => (
        <TaskCard
          key={task.id}
          task={task}
          onToggleComplete={onToggleComplete}
          onEdit={onEdit}
          onDelete={onDelete}
          onViewDetails={onViewDetails}
          categories={categories}
        />
      ))}
    </div>
  );
}
