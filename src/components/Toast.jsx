import React from 'react';
import { CheckCircle2, AlertCircle, X } from 'lucide-react';

export default function Toast({ toast, onClose }) {
  if (!toast) return null;

  return (
    <div className="toast-container">
      <div className={`toast ${toast.type || 'success'}`} role="alert">
        {toast.type === 'error' ? (
          <AlertCircle size={20} className="text-error" style={{ color: '#EF4444' }} />
        ) : (
          <CheckCircle2 size={20} className="text-success" style={{ color: '#10B981' }} />
        )}
        <span style={{ fontSize: '0.9rem', color: '#F8FAFC' }}>{toast.message}</span>
        <button
          onClick={onClose}
          aria-label="Close notification"
          style={{ marginLeft: 'auto', color: '#94A3B8', cursor: 'pointer' }}
        >
          <X size={16} />
        </button>
      </div>
    </div>
  );
}
