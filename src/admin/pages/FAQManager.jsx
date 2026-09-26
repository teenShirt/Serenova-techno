import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { Plus, Edit, Trash2, Save, X, AlertTriangle, Eye, EyeOff } from 'lucide-react';

export default function FAQManager() {
  const [faqs, setFaqs] = useState([]);
  const [loading, setLoading] = useState(true);

  const [modalOpen, setModalOpen] = useState(false);
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);
  const [editingFaq, setEditingFaq] = useState(null);

  const [formData, setFormData] = useState({
    question: '',
    answer: '',
    display_order: 0,
    is_published: 1
  });

  const [message, setMessage] = useState(null);

  const loadFaqs = async () => {
    setLoading(true);
    const res = await api.getFaqs();
    if (res && res.success && res.faqs) {
      setFaqs(res.faqs);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadFaqs();
  }, []);

  const openAddModal = () => {
    setEditingFaq(null);
    setFormData({
      question: '',
      answer: '',
      display_order: faqs.length + 1,
      is_published: 1
    });
    setModalOpen(true);
  };

  const openEditModal = (faq) => {
    setEditingFaq(faq);
    setFormData({
      question: faq.question || '',
      answer: faq.answer || '',
      display_order: faq.display_order || 0,
      is_published: faq.is_published ? 1 : 0
    });
    setModalOpen(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    const payload = {
      question: formData.question,
      answer: formData.answer,
      display_order: parseInt(formData.display_order, 10) || 0,
      is_published: formData.is_published ? 1 : 0
    };

    let res;
    if (editingFaq) {
      res = await api.updateFaq(editingFaq.id, payload);
    } else {
      res = await api.createFaq(payload);
    }

    if (res && res.success) {
      setMessage({ type: 'success', text: editingFaq ? 'FAQ updated successfully!' : 'FAQ added successfully!' });
      setModalOpen(false);
      loadFaqs();
    } else {
      setMessage({ type: 'error', text: res?.message || 'Operation failed.' });
    }
  };

  const handleDelete = async (id) => {
    const res = await api.deleteFaq(id);
    if (res && res.success) {
      setMessage({ type: 'success', text: 'FAQ entry deleted.' });
      setDeleteConfirmId(null);
      loadFaqs();
    } else {
      setMessage({ type: 'error', text: res?.message || 'Failed to delete FAQ.' });
    }
  };

  return (
    <div>
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">FAQ Management</h1>
          <p className="admin-page-subtitle">Manage frequently asked questions and answers displayed on the public website.</p>
        </div>

        <button className="admin-btn admin-btn-primary" onClick={openAddModal}>
          <Plus size={18} />
          <span>Add FAQ Entry</span>
        </button>
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

      {/* FAQ Table */}
      <div className="admin-table-container">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Order</th>
              <th>Question</th>
              <th>Answer Preview</th>
              <th>Status</th>
              <th style={{ textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {faqs.map((faq) => (
              <tr key={faq.id}>
                <td style={{ fontWeight: '700', width: '60px' }}>{faq.display_order}</td>
                <td style={{ fontWeight: '600', color: '#FFFFFF', maxWidth: '280px' }}>{faq.question}</td>
                <td style={{ color: '#94A3B8', maxWidth: '360px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {faq.answer}
                </td>
                <td>
                  <span className={`badge-status ${faq.is_published ? 'badge-published' : 'badge-draft'}`}>
                    {faq.is_published ? 'Published' : 'Draft'}
                  </span>
                </td>
                <td style={{ textAlign: 'right' }}>
                  <div style={{ display: 'inline-flex', gap: '8px' }}>
                    <button className="admin-btn admin-btn-secondary admin-btn-sm" onClick={() => openEditModal(faq)}>
                      <Edit size={14} />
                      <span>Edit</span>
                    </button>
                    <button className="admin-btn admin-btn-danger admin-btn-sm" onClick={() => setDeleteConfirmId(faq.id)}>
                      <Trash2 size={14} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {modalOpen && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.75)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
          <div style={{ background: '#0F172A', border: '1px solid rgba(255,255,255,0.12)', borderRadius: '16px', width: '100%', maxWidth: '600px', padding: '28px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h3 style={{ fontSize: '1.25rem', color: '#FFFFFF', fontWeight: '700' }}>
                {editingFaq ? 'Edit FAQ Entry' : 'Add FAQ Entry'}
              </h3>
              <button onClick={() => setModalOpen(false)} style={{ background: 'none', border: 'none', color: '#94A3B8', cursor: 'pointer' }}>
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSave}>
              <div className="admin-form-group">
                <label className="admin-label">Question</label>
                <input
                  type="text"
                  className="admin-input"
                  value={formData.question}
                  onChange={(e) => setFormData({ ...formData, question: e.target.value })}
                  required
                />
              </div>

              <div className="admin-form-group">
                <label className="admin-label">Answer</label>
                <textarea
                  className="admin-textarea"
                  rows={4}
                  value={formData.answer}
                  onChange={(e) => setFormData({ ...formData, answer: e.target.value })}
                  required
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div className="admin-form-group">
                  <label className="admin-label">Display Order</label>
                  <input
                    type="number"
                    className="admin-input"
                    value={formData.display_order}
                    onChange={(e) => setFormData({ ...formData, display_order: e.target.value })}
                  />
                </div>

                <div className="admin-form-group">
                  <label className="admin-label">Status</label>
                  <select
                    className="admin-select"
                    value={formData.is_published}
                    onChange={(e) => setFormData({ ...formData, is_published: parseInt(e.target.value, 10) })}
                  >
                    <option value={1}>Published</option>
                    <option value={0}>Draft</option>
                  </select>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '24px' }}>
                <button type="button" className="admin-btn admin-btn-secondary" onClick={() => setModalOpen(false)}>
                  Cancel
                </button>
                <button type="submit" className="admin-btn admin-btn-primary">
                  <Save size={16} />
                  <span>Save FAQ Entry</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Modal */}
      {deleteConfirmId && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.8)', zIndex: 1100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
          <div style={{ background: '#0F172A', border: '1px solid rgba(239, 68, 68, 0.4)', borderRadius: '14px', width: '100%', maxWidth: '420px', padding: '24px', textAlign: 'center' }}>
            <AlertTriangle size={36} style={{ color: '#EF4444', marginBottom: '12px' }} />
            <h3 style={{ color: '#FFFFFF', fontSize: '1.2rem', marginBottom: '8px' }}>Confirm Deletion</h3>
            <p style={{ color: '#94A3B8', fontSize: '0.875rem', marginBottom: '20px' }}>Are you sure you want to delete this FAQ entry?</p>
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
              <button className="admin-btn admin-btn-secondary" onClick={() => setDeleteConfirmId(null)}>
                Cancel
              </button>
              <button className="admin-btn admin-btn-danger" onClick={() => handleDelete(deleteConfirmId)}>
                Delete FAQ
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
