import React, { useState } from 'react';
import { api } from '../services/api';
import { KeyRound, Save, Lock, AlertCircle } from 'lucide-react';

export default function ChangePassword() {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage(null);

    if (newPassword.length < 8) {
      setMessage({ type: 'error', text: 'New password must be at least 8 characters long.' });
      return;
    }

    if (newPassword !== confirmPassword) {
      setMessage({ type: 'error', text: 'New password and confirmation do not match.' });
      return;
    }

    setLoading(true);

    try {
      const res = await api.changePassword({ currentPassword, newPassword });
      if (res && res.success) {
        setMessage({ type: 'success', text: 'Administrator password changed successfully!' });
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
      } else {
        setMessage({ type: 'error', text: res?.message || 'Failed to change password.' });
      }
    } catch (err) {
      setMessage({ type: 'error', text: 'Error changing password.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '540px' }}>
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Change Password</h1>
          <p className="admin-page-subtitle">Update administrator account credentials securely.</p>
        </div>
      </div>

      {message && (
        <div style={{
          backgroundColor: message.type === 'success' ? 'rgba(16, 185, 129, 0.15)' : 'rgba(239, 68, 68, 0.15)',
          border: `1px solid ${message.type === 'success' ? 'rgba(16, 185, 129, 0.3)' : 'rgba(239, 68, 68, 0.3)'}`,
          color: message.type === 'success' ? '#10B981' : '#EF4444',
          borderRadius: '8px',
          padding: '12px 16px',
          marginBottom: '20px',
          fontSize: '0.9rem'
        }}>
          {message.text}
        </div>
      )}

      <div className="admin-card">
        <form onSubmit={handleSubmit}>
          <div className="admin-form-group">
            <label className="admin-label">Current Password</label>
            <input
              type="password"
              className="admin-input"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              required
            />
          </div>

          <div className="admin-form-group">
            <label className="admin-label">New Password (Min 8 characters)</label>
            <input
              type="password"
              className="admin-input"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
            />
          </div>

          <div className="admin-form-group">
            <label className="admin-label">Confirm New Password</label>
            <input
              type="password"
              className="admin-input"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>

          <div style={{ marginTop: '24px' }}>
            <button type="submit" className="admin-btn admin-btn-primary" disabled={loading}>
              <KeyRound size={16} />
              <span>{loading ? 'Updating Password...' : 'Update Password'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
