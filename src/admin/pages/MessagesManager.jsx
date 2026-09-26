import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { Mail, MailOpen, Trash2, Eye, X, AlertTriangle, Calendar, Phone, Building } from 'lucide-react';

export default function MessagesManager() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);

  const [activeMessage, setActiveMessage] = useState(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);

  const loadMessages = async () => {
    setLoading(true);
    const res = await api.getMessages();
    if (res && res.success && res.messages) {
      setMessages(res.messages);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadMessages();
  }, []);

  const openMessageModal = async (msg) => {
    setActiveMessage(msg);
    if (!msg.is_read) {
      await api.markMessageRead(msg.id, true);
      setMessages(prev => prev.map(m => m.id === msg.id ? { ...m, is_read: 1 } : m));
    }
  };

  const handleDelete = async (id) => {
    const res = await api.deleteMessage(id);
    if (res && res.success) {
      if (activeMessage && activeMessage.id === id) {
        setActiveMessage(null);
      }
      setDeleteConfirmId(null);
      loadMessages();
    }
  };

  return (
    <div>
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Contact Form Messages Inbox</h1>
          <p className="admin-page-subtitle">Review, manage, and respond to incoming customer consultation inquiries.</p>
        </div>
      </div>

      <div className="admin-table-container">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Status</th>
              <th>Received Date</th>
              <th>Sender Name</th>
              <th>Email Address</th>
              <th>Subject</th>
              <th style={{ textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {messages.length === 0 ? (
              <tr>
                <td colSpan={6} style={{ textAlign: 'center', padding: '32px', color: '#94A3B8' }}>
                  No messages in your inbox yet. Form submissions will appear here automatically.
                </td>
              </tr>
            ) : (
              messages.map((msg) => (
                <tr key={msg.id} style={{ backgroundColor: msg.is_read ? 'transparent' : 'rgba(56, 189, 248, 0.04)' }}>
                  <td>
                    <span className={`badge-status ${msg.is_read ? 'badge-read' : 'badge-unread'}`}>
                      {msg.is_read ? <MailOpen size={12} /> : <Mail size={12} />}
                      {msg.is_read ? 'Read' : 'New'}
                    </span>
                  </td>
                  <td style={{ fontSize: '0.8rem', color: '#94A3B8' }}>
                    {new Date(msg.created_at).toLocaleDateString()} {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </td>
                  <td style={{ fontWeight: msg.is_read ? '500' : '700', color: '#FFFFFF' }}>
                    {msg.name}
                  </td>
                  <td>
                    <a href={`mailto:${msg.email}`} style={{ color: '#38BDF8', textDecoration: 'none' }}>
                      {msg.email}
                    </a>
                  </td>
                  <td style={{ color: '#CBD5E1', maxWidth: '240px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {msg.subject || 'General Consultation Inquiry'}
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    <div style={{ display: 'inline-flex', gap: '8px' }}>
                      <button className="admin-btn admin-btn-secondary admin-btn-sm" onClick={() => openMessageModal(msg)}>
                        <Eye size={14} />
                        <span>View</span>
                      </button>
                      <button className="admin-btn admin-btn-danger admin-btn-sm" onClick={() => setDeleteConfirmId(msg.id)}>
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Message View Modal */}
      {activeMessage && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.75)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
          <div style={{ background: '#0F172A', border: '1px solid rgba(255,255,255,0.12)', borderRadius: '16px', width: '100%', maxWidth: '650px', padding: '28px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', borderBottom: '1px solid rgba(255,255,255,0.08)', paddingBottom: '16px' }}>
              <div>
                <span className="eyebrow" style={{ marginBottom: '4px' }}>INQUIRY DETAILS</span>
                <h3 style={{ fontSize: '1.25rem', color: '#FFFFFF', fontWeight: '700' }}>
                  {activeMessage.subject || 'General Consultation Inquiry'}
                </h3>
              </div>
              <button onClick={() => setActiveMessage(null)} style={{ background: 'none', border: 'none', color: '#94A3B8', cursor: 'pointer' }}>
                <X size={20} />
              </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '20px', fontSize: '0.9rem', color: '#94A3B8' }}>
              <div>
                <strong style={{ color: '#FFFFFF' }}>From:</strong> {activeMessage.name}
              </div>
              <div>
                <strong style={{ color: '#FFFFFF' }}>Email:</strong> <a href={`mailto:${activeMessage.email}`} style={{ color: '#38BDF8' }}>{activeMessage.email}</a>
              </div>
              {activeMessage.phone && (
                <div>
                  <strong style={{ color: '#FFFFFF' }}>Phone:</strong> {activeMessage.phone}
                </div>
              )}
              {activeMessage.company && (
                <div>
                  <strong style={{ color: '#FFFFFF' }}>Company:</strong> {activeMessage.company}
                </div>
              )}
              <div>
                <strong style={{ color: '#FFFFFF' }}>Received:</strong> {new Date(activeMessage.created_at).toLocaleString()}
              </div>
            </div>

            <div style={{ background: '#070B14', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '8px', padding: '16px', color: '#F8FAFC', fontSize: '0.95rem', lineHeight: '1.6', marginBottom: '24px', whiteSpace: 'pre-wrap' }}>
              {activeMessage.message}
            </div>

            <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
              <button className="admin-btn admin-btn-danger" onClick={() => setDeleteConfirmId(activeMessage.id)}>
                <Trash2 size={16} />
                <span>Delete Message</span>
              </button>
              <button className="admin-btn admin-btn-secondary" onClick={() => setActiveMessage(null)}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Modal */}
      {deleteConfirmId && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.8)', zIndex: 1100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
          <div style={{ background: '#0F172A', border: '1px solid rgba(239, 68, 68, 0.4)', borderRadius: '14px', width: '100%', maxWidth: '420px', padding: '24px', textAlign: 'center' }}>
            <AlertTriangle size={36} style={{ color: '#EF4444', marginBottom: '12px' }} />
            <h3 style={{ color: '#FFFFFF', fontSize: '1.2rem', marginBottom: '8px' }}>Confirm Deletion</h3>
            <p style={{ color: '#94A3B8', fontSize: '0.875rem', marginBottom: '20px' }}>Are you sure you want to delete this message?</p>
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
              <button className="admin-btn admin-btn-secondary" onClick={() => setDeleteConfirmId(null)}>
                Cancel
              </button>
              <button className="admin-btn admin-btn-danger" onClick={() => handleDelete(deleteConfirmId)}>
                Delete Message
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
