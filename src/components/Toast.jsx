import React from 'react';
import { CheckCircle2, AlertCircle, Info, X, AlertTriangle } from 'lucide-react';

export default function Toast({ toasts, onDismiss }) {
  if (!toasts || toasts.length === 0) return null;

  const getIcon = (type) => {
    switch (type) {
      case 'success':
        return <CheckCircle2 className="toast-icon text-emerald" size={18} />;
      case 'error':
        return <AlertCircle className="toast-icon text-rose" size={18} />;
      case 'warning':
        return <AlertTriangle className="toast-icon text-amber" size={18} />;
      default:
        return <Info className="toast-icon text-indigo" size={18} />;
    }
  };

  return (
    <div className="toast-container" role="region" aria-label="Notifications" aria-live="polite">
      {toasts.map((toast) => (
        <div key={toast.id} className={`toast-card toast-${toast.type || 'info'}`}>
          <div className="toast-content">
            {getIcon(toast.type)}
            <span className="toast-message">{toast.message}</span>
          </div>
          <button
            type="button"
            className="toast-close-btn"
            onClick={() => onDismiss(toast.id)}
            aria-label="Close notification"
          >
            <X size={14} />
          </button>
        </div>
      ))}
    </div>
  );
}
