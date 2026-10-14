import React from 'react';
import { CheckSquare, Plus, Sun, Moon, Search, Menu, X } from 'lucide-react';

export default function Header({
  searchQuery,
  onSearchChange,
  onOpenTaskModal,
  theme,
  onToggleTheme,
  isMobileMenuOpen,
  onToggleMobileMenu,
  totalTasks,
}) {
  return (
    <header className="app-header">
      <div className="header-left">
        <button
          type="button"
          className="mobile-menu-toggle"
          onClick={onToggleMobileMenu}
          aria-label={isMobileMenuOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={isMobileMenuOpen}
        >
          {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>

        <div className="brand-logo">
          <div className="logo-icon-wrapper">
            <CheckSquare className="logo-icon" size={22} />
          </div>
          <div className="brand-text">
            <span className="brand-name">TaskFlow</span>
            <span className="brand-badge">PRO</span>
          </div>
        </div>
      </div>

      <div className="header-center">
        <div className="header-search-wrapper">
          <Search size={16} className="header-search-icon" />
          <input
            type="text"
            className="header-search-input"
            placeholder="Search tasks (title or description)..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            aria-label="Search tasks"
          />
          {searchQuery && (
            <button
              type="button"
              className="search-clear-btn"
              onClick={() => onSearchChange('')}
              aria-label="Clear search"
            >
              <X size={14} />
            </button>
          )}
        </div>
      </div>

      <div className="header-right">
        <button
          type="button"
          className="theme-toggle-btn"
          onClick={onToggleTheme}
          aria-label={theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme'}
          title={theme === 'dark' ? 'Light mode' : 'Dark mode'}
        >
          {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
        </button>

        <button
          type="button"
          className="btn-primary add-task-btn"
          onClick={() => onOpenTaskModal()}
          aria-label="Create new task"
        >
          <Plus size={18} />
          <span>New Task</span>
        </button>
      </div>
    </header>
  );
}
