import React from 'react';
import { CheckCircle2, Clock, AlertTriangle, Layers, TrendingUp } from 'lucide-react';

export default function DashboardStats({
  totalCount,
  pendingCount,
  completedCount,
  overdueCount,
  completionRate,
}) {
  const getMotivationalMessage = () => {
    if (totalCount === 0) return 'No tasks yet. Create your first task to get started!';
    if (completionRate === 100) return ' Outstanding! You have completed all your tasks!';
    if (completionRate >= 75) return ' Almost there! Final stretch to reach 100%.';
    if (completionRate >= 50) return ' Great momentum! More than halfway through.';
    if (completionRate > 0) return ' Off to a good start! Keep knocking them down.';
    return ' Ready to conquer your day? Start checking off tasks!';
  };

  return (
    <div className="dashboard-stats-wrapper">
      <div className="stats-grid">
        {/* Total Tasks */}
        <div className="stat-card stat-total">
          <div className="stat-card-header">
            <span className="stat-card-label">Total Tasks</span>
            <div className="stat-icon-pill icon-pill-indigo">
              <Layers size={20} />
            </div>
          </div>
          <div className="stat-card-body">
            <span className="stat-value">{totalCount}</span>
            <span className="stat-subtext">Across all categories</span>
          </div>
        </div>

        {/* Pending Tasks */}
        <div className="stat-card stat-pending">
          <div className="stat-card-header">
            <span className="stat-card-label">Pending</span>
            <div className="stat-icon-pill icon-pill-amber">
              <Clock size={20} />
            </div>
          </div>
          <div className="stat-card-body">
            <span className="stat-value">{pendingCount}</span>
            <span className="stat-subtext">To be completed</span>
          </div>
        </div>

        {/* Completed Tasks */}
        <div className="stat-card stat-completed">
          <div className="stat-card-header">
            <span className="stat-card-label">Completed</span>
            <div className="stat-icon-pill icon-pill-emerald">
              <CheckCircle2 size={20} />
            </div>
          </div>
          <div className="stat-card-body">
            <span className="stat-value">{completedCount}</span>
            <span className="stat-subtext">Finished tasks</span>
          </div>
        </div>

        {/* Overdue Tasks */}
        <div className={`stat-card stat-overdue ${overdueCount > 0 ? 'has-overdue' : ''}`}>
          <div className="stat-card-header">
            <span className="stat-card-label">Overdue</span>
            <div className="stat-icon-pill icon-pill-rose">
              <AlertTriangle size={20} />
            </div>
          </div>
          <div className="stat-card-body">
            <span className="stat-value">{overdueCount}</span>
            <span className="stat-subtext">
              {overdueCount > 0 ? 'Requires attention!' : 'All caught up'}
            </span>
          </div>
        </div>
      </div>

      {/* Progress banner */}
      <div className="completion-banner">
        <div className="banner-top">
          <div className="banner-title-group">
            <TrendingUp size={18} className="text-indigo" />
            <span className="banner-title">Completion Rate</span>
            <span className="banner-subinfo">
              ({completedCount} of {totalCount} tasks completed)
            </span>
          </div>
          <span className="banner-percent-pill">{completionRate}%</span>
        </div>

        <div className="banner-progress-track" role="progressbar" aria-valuenow={completionRate} aria-valuemin="0" aria-valuemax="100">
          <div
            className="banner-progress-fill"
            style={{ width: `${completionRate}%` }}
          />
        </div>

        <p className="banner-motivation">{getMotivationalMessage()}</p>
      </div>
    </div>
  );
}
