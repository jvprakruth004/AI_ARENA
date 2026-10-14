import React from 'react';
import {
  Inbox,
  Calendar,
  Clock,
  CheckCircle2,
  FolderPlus,
  Briefcase,
  User,
  BookOpen,
  Activity,
  Folder,
  Tag,
  Sparkles,
} from 'lucide-react';

export default function Sidebar({
  activeView,
  onSelectView,
  selectedCategory,
  onSelectCategory,
  categories,
  onOpenCategoryModal,
  taskCounts,
  isMobileMenuOpen,
  onCloseMobileMenu,
  completionRate,
}) {
  const getCategoryIcon = (iconName, color) => {
    const props = { size: 16, style: { color } };
    switch (iconName) {
      case 'Briefcase':
        return <Briefcase {...props} />;
      case 'User':
        return <User {...props} />;
      case 'BookOpen':
        return <BookOpen {...props} />;
      case 'Activity':
        return <Activity {...props} />;
      default:
        return <Folder {...props} />;
    }
  };

  const navItems = [
    {
      id: 'all',
      label: 'All Tasks',
      icon: <Inbox size={18} />,
      count: taskCounts.all,
    },
    {
      id: 'today',
      label: 'Today',
      icon: <Calendar size={18} />,
      count: taskCounts.today,
      badgeVariant: taskCounts.today > 0 ? 'badge-primary' : '',
    },
    {
      id: 'upcoming',
      label: 'Upcoming',
      icon: <Clock size={18} />,
      count: taskCounts.upcoming,
    },
    {
      id: 'completed',
      label: 'Completed',
      icon: <CheckCircle2 size={18} />,
      count: taskCounts.completed,
    },
  ];

  return (
    <>
      {/* Mobile backdrop */}
      {isMobileMenuOpen && (
        <div
          className="sidebar-backdrop"
          onClick={onCloseMobileMenu}
          aria-hidden="true"
        />
      )}

      <aside className={`app-sidebar ${isMobileMenuOpen ? 'sidebar-open' : ''}`}>
        <div className="sidebar-section">
          <span className="sidebar-section-title">Views</span>
          <nav className="sidebar-nav" aria-label="Task Views">
            {navItems.map((item) => {
              const isActive = activeView === item.id && !selectedCategory;
              return (
                <button
                  key={item.id}
                  type="button"
                  className={`sidebar-nav-item ${isActive ? 'active' : ''}`}
                  onClick={() => {
                    onSelectView(item.id);
                    onSelectCategory(null);
                    onCloseMobileMenu();
                  }}
                  aria-current={isActive ? 'page' : undefined}
                >
                  <span className="nav-icon">{item.icon}</span>
                  <span className="nav-label">{item.label}</span>
                  <span className={`nav-count ${item.badgeVariant || ''}`}>
                    {item.count}
                  </span>
                </button>
              );
            })}
          </nav>
        </div>

        <div className="sidebar-section">
          <div className="sidebar-section-header">
            <span className="sidebar-section-title">Categories</span>
            <button
              type="button"
              className="add-category-btn"
              onClick={onOpenCategoryModal}
              title="Add custom category"
              aria-label="Add custom category"
            >
              <FolderPlus size={16} />
            </button>
          </div>

          <div className="category-list" role="list">
            <button
              type="button"
              className={`category-item ${selectedCategory === null && activeView === 'category-all' ? 'active' : ''}`}
              onClick={() => {
                onSelectCategory(null);
                onCloseMobileMenu();
              }}
            >
              <span className="category-bullet" style={{ backgroundColor: '#94a3b8' }} />
              <span className="category-name">All Categories</span>
            </button>

            {categories.map((cat) => {
              const count = taskCounts.byCategory[cat.name] || 0;
              const isSelected = selectedCategory === cat.name;
              return (
                <button
                  key={cat.id}
                  type="button"
                  className={`category-item ${isSelected ? 'active' : ''}`}
                  onClick={() => {
                    onSelectCategory(cat.name);
                    onCloseMobileMenu();
                  }}
                >
                  <span className="category-icon-wrapper">
                    {getCategoryIcon(cat.icon, cat.color)}
                  </span>
                  <span className="category-name">{cat.name}</span>
                  <span className="category-count">{count}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Sidebar productivity mini card */}
        <div className="sidebar-footer">
          <div className="productivity-card">
            <div className="productivity-header">
              <span className="productivity-title">
                <Sparkles size={14} className="text-amber" /> Daily Goal
              </span>
              <span className="productivity-percent">{completionRate}%</span>
            </div>
            <div className="progress-bar-bg">
              <div
                className="progress-bar-fill"
                style={{ width: `${completionRate}%` }}
              />
            </div>
            <p className="productivity-hint">
              {completionRate === 100
                ? 'All caught up! Fantastic job!'
                : `${taskCounts.pending} remaining tasks`}
            </p>
          </div>
        </div>
      </aside>
    </>
  );
}
