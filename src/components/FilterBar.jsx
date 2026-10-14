import React from 'react';
import { Search, Filter, ArrowUpDown, X, SlidersHorizontal } from 'lucide-react';

export default function FilterBar({
  searchQuery,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
  priorityFilter,
  onPriorityFilterChange,
  categoryFilter,
  onCategoryFilterChange,
  sortBy,
  onSortChange,
  categories,
  onClearFilters,
  isFiltered,
  totalResults,
}) {
  return (
    <div className="filter-bar">
      <div className="filter-bar-main">
        {/* Status Filter Tabs */}
        <div className="status-tabs" role="tablist" aria-label="Task Status Filter">
          <button
            type="button"
            role="tab"
            aria-selected={statusFilter === 'all'}
            className={`status-tab ${statusFilter === 'all' ? 'active' : ''}`}
            onClick={() => onStatusFilterChange('all')}
          >
            All Tasks
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={statusFilter === 'pending'}
            className={`status-tab ${statusFilter === 'pending' ? 'active' : ''}`}
            onClick={() => onStatusFilterChange('pending')}
          >
            Pending
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={statusFilter === 'completed'}
            className={`status-tab ${statusFilter === 'completed' ? 'active' : ''}`}
            onClick={() => onStatusFilterChange('completed')}
          >
            Completed
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={statusFilter === 'high-priority'}
            className={`status-tab ${statusFilter === 'high-priority' ? 'active' : ''}`}
            onClick={() => onStatusFilterChange('high-priority')}
          >
            🔥 High Priority
          </button>
        </div>

        {/* Search input for main dashboard */}
        <div className="dashboard-search-box">
          <Search size={16} className="search-icon" />
          <input
            type="text"
            className="search-input"
            placeholder="Search by title or description..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            aria-label="Filter tasks by search"
          />
          {searchQuery && (
            <button
              type="button"
              className="search-clear-small"
              onClick={() => onSearchChange('')}
              aria-label="Clear search query"
            >
              <X size={14} />
            </button>
          )}
        </div>
      </div>

      {/* Dropdown Filters row */}
      <div className="filter-controls-row">
        <div className="dropdown-group">
          {/* Priority dropdown */}
          <div className="select-wrapper">
            <Filter size={14} className="select-icon" />
            <select
              value={priorityFilter}
              onChange={(e) => onPriorityFilterChange(e.target.value)}
              className="filter-select"
              aria-label="Filter by priority"
            >
              <option value="all">All Priorities</option>
              <option value="High">High Priority</option>
              <option value="Medium">Medium Priority</option>
              <option value="Low">Low Priority</option>
            </select>
          </div>

          {/* Category dropdown */}
          <div className="select-wrapper">
            <SlidersHorizontal size={14} className="select-icon" />
            <select
              value={categoryFilter || 'all'}
              onChange={(e) =>
                onCategoryFilterChange(e.target.value === 'all' ? null : e.target.value)
              }
              className="filter-select"
              aria-label="Filter by category"
            >
              <option value="all">All Categories</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.name}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          {/* Sort dropdown */}
          <div className="select-wrapper">
            <ArrowUpDown size={14} className="select-icon" />
            <select
              value={sortBy}
              onChange={(e) => onSortChange(e.target.value)}
              className="filter-select"
              aria-label="Sort tasks by"
            >
              <option value="due-asc">Due Date (Soonest first)</option>
              <option value="due-desc">Due Date (Latest first)</option>
              <option value="priority-desc">Priority (High to Low)</option>
              <option value="priority-asc">Priority (Low to High)</option>
              <option value="created-desc">Recently Created</option>
              <option value="title-asc">Title (A - Z)</option>
            </select>
          </div>
        </div>

        {/* Clear Filters Action */}
        <div className="filter-actions-right">
          <span className="results-count">
            {totalResults} {totalResults === 1 ? 'task' : 'tasks'} found
          </span>
          {isFiltered && (
            <button
              type="button"
              className="btn-clear-filters"
              onClick={onClearFilters}
              aria-label="Reset all filters and search"
            >
              <X size={14} />
              <span>Clear filters</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
