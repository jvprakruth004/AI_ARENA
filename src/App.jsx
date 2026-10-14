import React, { useState, useEffect, useMemo, useCallback } from 'react';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import DashboardStats from './components/DashboardStats';
import FilterBar from './components/FilterBar';
import TaskList from './components/TaskList';
import TaskModal from './components/TaskModal';
import TaskDetailModal from './components/TaskDetailModal';
import DeleteConfirmModal from './components/DeleteConfirmModal';
import CategoryModal from './components/CategoryModal';
import Toast from './components/Toast';

import { INITIAL_TASKS, DEFAULT_CATEGORIES } from './data/initialData';
import {
  isTaskOverdue,
  isTaskDueToday,
  isTaskUpcoming,
} from './utils/dateUtils';

const STORAGE_KEYS = {
  TASKS: 'taskflow_tasks_v1',
  CATEGORIES: 'taskflow_categories_v1',
  THEME: 'taskflow_theme',
  BG_MODE: 'taskflow_bg_mode',
};

export default function App() {
  // Theme state
  const [theme, setTheme] = useState(() => {
    try {
      const savedTheme = localStorage.getItem(STORAGE_KEYS.THEME);
      if (savedTheme) return savedTheme;
    } catch (e) {
      console.warn('Could not read theme from localStorage', e);
    }
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches
      ? 'dark'
      : 'light';
  });

  // Apply theme to document
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    try {
      localStorage.setItem(STORAGE_KEYS.THEME, theme);
    } catch (e) {
      console.warn('Could not save theme to localStorage', e);
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  // Background styling state ('deep' for Deep Olive #3A5311 Canvas, 'ambient' for Olive & Cream ambient gradient)
  const [bgMode, setBgMode] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.BG_MODE);
      if (saved) return saved;
    } catch (e) {
      console.warn('Could not read bg mode from localStorage', e);
    }
    return 'deep'; // Default to deep olive #3A5311 canvas
  });

  useEffect(() => {
    document.documentElement.setAttribute('data-bg', bgMode === 'deep' ? 'deep-olive' : 'ambient');
    try {
      localStorage.setItem(STORAGE_KEYS.BG_MODE, bgMode);
    } catch (e) {
      console.warn('Could not save bg mode to localStorage', e);
    }
  }, [bgMode]);

  const toggleBgMode = () => {
    setBgMode((prev) => (prev === 'deep' ? 'ambient' : 'deep'));
  };

  // Categories state
  const [categories, setCategories] = useState(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.CATEGORIES);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {
      console.warn('Failed to parse categories from localStorage', e);
    }
    return DEFAULT_CATEGORIES;
  });

  // Save categories on change
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(categories));
    } catch (e) {
      console.warn('Failed to save categories to localStorage', e);
    }
  }, [categories]);

  // Tasks state
  const [tasks, setTasks] = useState(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.TASKS);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch (e) {
      console.warn('Failed to parse tasks from localStorage', e);
    }
    return INITIAL_TASKS;
  });

  // Save tasks on change
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.TASKS, JSON.stringify(tasks));
    } catch (e) {
      console.warn('Failed to save tasks to localStorage', e);
    }
  }, [tasks]);

  // Navigation and Filter state
  const [activeView, setActiveView] = useState('all'); // 'all' | 'today' | 'upcoming' | 'completed'
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all'); // 'all' | 'pending' | 'completed' | 'high-priority'
  const [priorityFilter, setPriorityFilter] = useState('all'); // 'all' | 'High' | 'Medium' | 'Low'
  const [sortBy, setSortBy] = useState('due-asc'); // 'due-asc' | 'due-desc' | 'priority-desc' | 'priority-asc' | 'created-desc' | 'title-asc'

  // Modal states
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [detailTask, setDetailTask] = useState(null);
  const [deletingTask, setDeletingTask] = useState(null);
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Toasts
  const [toasts, setToasts] = useState([]);
  const addToast = useCallback((message, type = 'info') => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`;
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3500);
  }, []);

  const dismissToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  // Keyboard shortcut: Press 'n' to add task (if not typing in input/textarea)
  useEffect(() => {
    const handleKeyDown = (e) => {
      const activeTag = document.activeElement?.tagName.toLowerCase();
      if (activeTag === 'input' || activeTag === 'textarea' || activeTag === 'select') {
        return;
      }
      if (e.key === 'n' || e.key === 'N') {
        e.preventDefault();
        setEditingTask(null);
        setIsTaskModalOpen(true);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Task Operations
  const handleCreateOrUpdateTask = (taskData) => {
    if (editingTask) {
      // Update existing
      setTasks((prev) =>
        prev.map((t) => (t.id === editingTask.id ? { ...t, ...taskData } : t))
      );
      addToast(`Task "${taskData.title}" updated successfully!`, 'success');
    } else {
      // Add new task
      const newTask = {
        id: `task-${Date.now()}`,
        ...taskData,
        createdAt: new Date().toISOString(),
      };
      setTasks((prev) => [newTask, ...prev]);
      addToast(`Task "${taskData.title}" created!`, 'success');
    }
    setIsTaskModalOpen(false);
    setEditingTask(null);
  };

  const handleToggleComplete = (taskId) => {
    setTasks((prev) =>
      prev.map((t) => {
        if (t.id === taskId) {
          const isNowCompleted = t.status !== 'Completed';
          const updated = {
            ...t,
            status: isNowCompleted ? 'Completed' : 'Pending',
            completedAt: isNowCompleted ? new Date().toISOString() : null,
          };
          if (isNowCompleted) {
            addToast(`Completed: "${t.title}" 🎉`, 'success');
          } else {
            addToast(`Reopened: "${t.title}"`, 'info');
          }
          return updated;
        }
        return t;
      })
    );

    // If detail modal is open for this task, update detailTask view
    if (detailTask && detailTask.id === taskId) {
      setDetailTask((prev) => ({
        ...prev,
        status: prev.status === 'Completed' ? 'Pending' : 'Completed',
        completedAt:
          prev.status === 'Completed' ? null : new Date().toISOString(),
      }));
    }
  };

  const handleDeleteTask = (task) => {
    setDeletingTask(task);
  };

  const confirmDeleteTask = () => {
    if (deletingTask) {
      setTasks((prev) => prev.filter((t) => t.id !== deletingTask.id));
      addToast(`Deleted "${deletingTask.title}"`, 'warning');
      setDeletingTask(null);
      if (detailTask && detailTask.id === deletingTask.id) {
        setDetailTask(null);
      }
    }
  };

  const handleEditTask = (task) => {
    setEditingTask(task);
    setIsTaskModalOpen(true);
  };

  const handleAddCategory = (newCat) => {
    setCategories((prev) => [...prev, newCat]);
    addToast(`Category "${newCat.name}" added!`, 'success');
  };

  const handleClearFilters = () => {
    setSearchQuery('');
    setStatusFilter('all');
    setPriorityFilter('all');
    setSelectedCategory(null);
    setSortBy('due-asc');
  };

  // Real-time statistics calculations
  const stats = useMemo(() => {
    const totalCount = tasks.length;
    const completedCount = tasks.filter((t) => t.status === 'Completed').length;
    const pendingCount = tasks.filter((t) => t.status === 'Pending').length;
    const overdueCount = tasks.filter((t) => isTaskOverdue(t)).length;
    const completionRate =
      totalCount === 0 ? 0 : Math.round((completedCount / totalCount) * 100);

    const todayCount = tasks.filter((t) => isTaskDueToday(t) && t.status !== 'Completed').length;
    const upcomingCount = tasks.filter((t) => isTaskUpcoming(t)).length;

    // Counts by category
    const byCategory = {};
    tasks.forEach((t) => {
      if (t.category) {
        byCategory[t.category] = (byCategory[t.category] || 0) + 1;
      }
    });

    return {
      totalCount,
      completedCount,
      pendingCount,
      overdueCount,
      completionRate,
      counts: {
        all: totalCount,
        today: todayCount,
        upcoming: upcomingCount,
        completed: completedCount,
        pending: pendingCount,
        byCategory,
      },
    };
  }, [tasks]);

  // Filter and Sort Pipeline
  const filteredAndSortedTasks = useMemo(() => {
    let result = [...tasks];

    // 1. View filter
    if (activeView === 'today') {
      result = result.filter((t) => isTaskDueToday(t));
    } else if (activeView === 'upcoming') {
      result = result.filter((t) => isTaskUpcoming(t));
    } else if (activeView === 'completed') {
      result = result.filter((t) => t.status === 'Completed');
    }

    // 2. Category filter (from sidebar or dropdown)
    if (selectedCategory) {
      result = result.filter((t) => t.category === selectedCategory);
    }

    // 3. Status filter tab
    if (statusFilter === 'pending') {
      result = result.filter((t) => t.status === 'Pending');
    } else if (statusFilter === 'completed') {
      result = result.filter((t) => t.status === 'Completed');
    } else if (statusFilter === 'high-priority') {
      result = result.filter((t) => t.priority === 'High');
    }

    // 4. Priority dropdown filter
    if (priorityFilter !== 'all') {
      result = result.filter((t) => t.priority === priorityFilter);
    }

    // 5. Search query (title and description)
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      result = result.filter(
        (t) =>
          t.title.toLowerCase().includes(query) ||
          (t.description && t.description.toLowerCase().includes(query))
      );
    }

    // 6. Sorting
    const priorityWeight = { High: 3, Medium: 2, Low: 1 };

    result.sort((a, b) => {
      switch (sortBy) {
        case 'due-asc': {
          // Tasks without due date placed at the end
          if (!a.dueDate) return 1;
          if (!b.dueDate) return -1;
          return a.dueDate.localeCompare(b.dueDate);
        }
        case 'due-desc': {
          if (!a.dueDate) return 1;
          if (!b.dueDate) return -1;
          return b.dueDate.localeCompare(a.dueDate);
        }
        case 'priority-desc': {
          return (priorityWeight[b.priority] || 0) - (priorityWeight[a.priority] || 0);
        }
        case 'priority-asc': {
          return (priorityWeight[a.priority] || 0) - (priorityWeight[b.priority] || 0);
        }
        case 'created-desc': {
          return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
        }
        case 'title-asc': {
          return a.title.localeCompare(b.title);
        }
        default:
          return 0;
      }
    });

    return result;
  }, [
    tasks,
    activeView,
    selectedCategory,
    statusFilter,
    priorityFilter,
    searchQuery,
    sortBy,
  ]);

  const isFiltered =
    Boolean(searchQuery.trim()) ||
    statusFilter !== 'all' ||
    priorityFilter !== 'all' ||
    Boolean(selectedCategory);

  return (
    <div className="app-layout">
      <Header
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onOpenTaskModal={() => {
          setEditingTask(null);
          setIsTaskModalOpen(true);
        }}
        theme={theme}
        onToggleTheme={toggleTheme}
        bgMode={bgMode}
        onToggleBgMode={toggleBgMode}
        isMobileMenuOpen={isMobileMenuOpen}
        onToggleMobileMenu={() => setIsMobileMenuOpen((prev) => !prev)}
        totalTasks={stats.totalCount}
      />

      <div className="app-body">
        <Sidebar
          activeView={activeView}
          onSelectView={setActiveView}
          selectedCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
          categories={categories}
          onOpenCategoryModal={() => setIsCategoryModalOpen(true)}
          taskCounts={stats.counts}
          isMobileMenuOpen={isMobileMenuOpen}
          onCloseMobileMenu={() => setIsMobileMenuOpen(false)}
          completionRate={stats.completionRate}
        />

        <main className="main-content" id="main-content">
          <div className="content-container">
            {/* View Heading & Subtitle */}
            <div className="view-header">
              <div className="view-title-group">
                <h1 className="view-title">
                  {selectedCategory
                    ? `Category: ${selectedCategory}`
                    : activeView === 'today'
                    ? "Today's Tasks"
                    : activeView === 'upcoming'
                    ? 'Upcoming Tasks'
                    : activeView === 'completed'
                    ? 'Completed Archive'
                    : 'All Tasks'}
                </h1>
                <p className="view-subtitle">
                  {selectedCategory
                    ? `Showing all tasks organized under "${selectedCategory}"`
                    : activeView === 'today'
                    ? 'Focus on tasks scheduled for completion today'
                    : activeView === 'upcoming'
                    ? 'Preview your scheduled deliverables and deadlines'
                    : activeView === 'completed'
                    ? 'Review tasks successfully completed'
                    : 'Manage, prioritize, and track all your tasks'}
                </p>
              </div>

              <div className="view-header-actions">
                <button
                  type="button"
                  className="btn-primary"
                  onClick={() => {
                    setEditingTask(null);
                    setIsTaskModalOpen(true);
                  }}
                >
                  + Add Task
                </button>
              </div>
            </div>

            {/* Dashboard summary stats cards */}
            <DashboardStats
              totalCount={stats.totalCount}
              pendingCount={stats.pendingCount}
              completedCount={stats.completedCount}
              overdueCount={stats.overdueCount}
              completionRate={stats.completionRate}
            />

            {/* Filters, Search & Sorting bar */}
            <FilterBar
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              statusFilter={statusFilter}
              onStatusFilterChange={setStatusFilter}
              priorityFilter={priorityFilter}
              onPriorityFilterChange={setPriorityFilter}
              categoryFilter={selectedCategory}
              onCategoryFilterChange={setSelectedCategory}
              sortBy={sortBy}
              onSortChange={setSortBy}
              categories={categories}
              onClearFilters={handleClearFilters}
              isFiltered={isFiltered}
              totalResults={filteredAndSortedTasks.length}
            />

            {/* Tasks list */}
            <TaskList
              tasks={filteredAndSortedTasks}
              activeView={activeView}
              searchQuery={searchQuery}
              isFiltered={isFiltered}
              onClearFilters={handleClearFilters}
              onOpenTaskModal={() => {
                setEditingTask(null);
                setIsTaskModalOpen(true);
              }}
              onToggleComplete={handleToggleComplete}
              onEdit={handleEditTask}
              onDelete={handleDeleteTask}
              onViewDetails={setDetailTask}
              categories={categories}
            />
          </div>
        </main>
      </div>

      {/* Modals & Dialogs */}
      <TaskModal
        isOpen={isTaskModalOpen}
        onClose={() => {
          setIsTaskModalOpen(false);
          setEditingTask(null);
        }}
        onSubmit={handleCreateOrUpdateTask}
        editingTask={editingTask}
        categories={categories}
        onOpenNewCategory={() => setIsCategoryModalOpen(true)}
      />

      <TaskDetailModal
        isOpen={Boolean(detailTask)}
        onClose={() => setDetailTask(null)}
        task={detailTask}
        onEdit={handleEditTask}
        onDelete={handleDeleteTask}
        onToggleComplete={handleToggleComplete}
        categories={categories}
      />

      <DeleteConfirmModal
        isOpen={Boolean(deletingTask)}
        onClose={() => setDeletingTask(null)}
        onConfirm={confirmDeleteTask}
        taskTitle={deletingTask?.title || ''}
      />

      <CategoryModal
        isOpen={isCategoryModalOpen}
        onClose={() => setIsCategoryModalOpen(false)}
        onAddCategory={handleAddCategory}
        existingCategories={categories}
      />

      {/* Global Toast Notifications */}
      <Toast toasts={toasts} onDismiss={dismissToast} />
    </div>
  );
}
