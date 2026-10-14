/**
 * Utility functions for date calculations, comparisons, and formatting.
 */

export const getTodayString = () => {
  const d = new Date();
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

export const isTaskOverdue = (task) => {
  if (!task.dueDate || task.status === 'Completed') return false;
  const today = getTodayString();
  return task.dueDate < today;
};

export const isTaskDueToday = (task) => {
  if (!task.dueDate) return false;
  return task.dueDate === getTodayString();
};

export const isTaskUpcoming = (task) => {
  if (!task.dueDate || task.status === 'Completed') return false;
  const today = getTodayString();
  return task.dueDate > today;
};

export const formatDisplayDate = (dateString) => {
  if (!dateString) return 'No due date';
  
  const today = getTodayString();
  const d = new Date(dateString + 'T00:00:00');
  
  // Calculate day difference
  const todayDate = new Date(today + 'T00:00:00');
  const diffTime = d.getTime() - todayDate.getTime();
  const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return 'Today';
  if (diffDays === 1) return 'Tomorrow';
  if (diffDays === -1) return 'Yesterday';
  if (diffDays > 1 && diffDays <= 7) return `In ${diffDays} days`;
  if (diffDays < -1) return `${Math.abs(diffDays)}d overdue`;

  return d.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: d.getFullYear() !== new Date().getFullYear() ? 'numeric' : undefined,
  });
};

export const getDueBadgeClass = (task) => {
  if (task.status === 'Completed') return 'badge-completed';
  if (!task.dueDate) return 'badge-neutral';
  if (isTaskOverdue(task)) return 'badge-overdue';
  if (isTaskDueToday(task)) return 'badge-today';
  return 'badge-upcoming';
};
