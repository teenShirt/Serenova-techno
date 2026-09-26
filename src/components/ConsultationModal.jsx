import React, { useState, useEffect } from 'react';
import { api } from '../admin/services/api';
import { X, Send, CheckCircle2, AlertCircle } from 'lucide-react';

export default function ConsultationModal({ isOpen, onClose, showToast, initialService = '' }) {
  const [loadTime] = useState(Date.now());
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    service: initialService || 'Linux Server Support',
    notes: '',
    website_url_hp: ''
  });
  const [loading, setLoading] = useState(false);
  const [submittedRef, setSubmittedRef] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (initialService) {
      setFormData(prev => ({ ...prev, service: initialService }));
    }
  }, [initialService]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    if (!formData.name || !formData.email) {
      setError('Please provide your name and work email address.');
      return;
    }

    setLoading(true);
    try {
      const payload = {
        name: formData.name,
        email: formData.email,
        phone: formData.phone || null,
        requiredService: formData.service,
        projectSummary: formData.notes || `Consultation request for ${formData.service}`,
        consent: true,
        website_url_hp: formData.website_url_hp,
        form_load_time: loadTime
      };

      const res = await api.postPublicContact(payload);
      if (res && res.success) {
        setSubmittedRef(res.referenceNumber || 'ST-202609-SUCCESS');
        if (showToast) {
          showToast('Consultation request submitted successfully!', 'success');
        }
      } else {
        setError(res.message || 'Submission failed. Please try again.');
      }
    } catch (err) {
      setError('Unable to submit request. Please check network connection.');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setSubmittedRef(null);
    setError(null);
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={handleClose} role="dialog" aria-modal="true" aria-labelledby="consultation-modal-title">
      <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '580px', background: '#0F172A', border: '1px solid rgba(255,255,255,0.12)', borderRadius: '20px', padding: '32px' }}>
        <button className="modal-close" onClick={handleClose} aria-label="Close modal" style={{ background: 'none', border: 'none', color: '#94A3B8', cursor: 'pointer', float: 'right' }}>
          <X size={20} />
        </button>

        <span className="eyebrow" style={{ color: '#38BDF8' }}>FREE TECHNICAL CONSULTATION</span>
        <h3 id="consultation-modal-title" style={{ fontSize: '1.5rem', color: '#F8FAFC', marginBottom: '8px', fontWeight: '800' }}>
          Schedule an Expert IT Consultation
        </h3>
        <p style={{ color: '#94A3B8', fontSize: '0.9rem', marginBottom: '24px' }}>
          Discuss your Linux server, Nginx, cloud, or web development needs directly with our technical team.
        </p>

        {submittedRef ? (
          <div style={{ textAlign: 'center', padding: '24px 0' }}>
            <div style={{ display: 'inline-flex', padding: '16px', borderRadius: '50%', background: 'rgba(16, 185, 129, 0.1)', color: '#10B981', marginBottom: '16px' }}>
              <CheckCircle2 size={42} />
            </div>
            <h4 style={{ color: '#F8FAFC', fontSize: '1.25rem', marginBottom: '8px', fontWeight: '700' }}>Request Logged!</h4>
            <p style={{ color: '#94A3B8', fontSize: '0.9rem', marginBottom: '16px' }}>
              Your consultation tracking reference code is:
            </p>
            <div style={{ background: '#070B14', color: '#38BDF8', fontFamily: 'monospace', fontWeight: '800', fontSize: '1.25rem', padding: '12px', borderRadius: '8px', marginBottom: '24px', display: 'inline-block' }}>
              {submittedRef}
            </div>
            <div>
              <button className="btn btn-primary" onClick={handleClose}>
                Close Window
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            {error && (
              <div style={{ background: 'rgba(239,68,68,0.1)', color: '#EF4444', border: '1px solid rgba(239,68,68,0.3)', padding: '10px 14px', borderRadius: '8px', marginBottom: '16px', fontSize: '0.85rem' }}>
                {error}
              </div>
            )}

            <input
              type="text"
              name="website_url_hp"
              value={formData.website_url_hp}
              onChange={(e) => setFormData({ ...formData, website_url_hp: e.target.value })}
              style={{ display: 'none' }}
              tabIndex="-1"
              autoComplete="off"
            />

            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div className="form-group">
                <label className="form-label" htmlFor="modal-name" style={{ display: 'block', color: '#CBD5E1', fontSize: '0.85rem', marginBottom: '4px', fontWeight: '600' }}>Your Full Name *</label>
                <input
                  id="modal-name"
                  type="text"
                  required
                  className="form-input"
                  placeholder="e.g. Alex Perera"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  style={{ width: '100%', padding: '10px 12px', background: '#070B14', border: '1px solid rgba(255,255,255,0.12)', borderRadius: '8px', color: '#F8FAFC' }}
                />
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="modal-email" style={{ display: 'block', color: '#CBD5E1', fontSize: '0.85rem', marginBottom: '4px', fontWeight: '600' }}>Work Email Address *</label>
                <input
                  id="modal-email"
                  type="email"
                  required
                  className="form-input"
                  placeholder="alex@company.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  style={{ width: '100%', padding: '10px 12px', background: '#070B14', border: '1px solid rgba(255,255,255,0.12)', borderRadius: '8px', color: '#F8FAFC' }}
                />
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="modal-phone" style={{ display: 'block', color: '#CBD5E1', fontSize: '0.85rem', marginBottom: '4px', fontWeight: '600' }}>Phone / WhatsApp (Optional)</label>
                <input
                  id="modal-phone"
                  type="tel"
                  className="form-input"
                  placeholder="+94 77 123 4567"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  style={{ width: '100%', padding: '10px 12px', background: '#070B14', border: '1px solid rgba(255,255,255,0.12)', borderRadius: '8px', color: '#F8FAFC' }}
                />
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="modal-service" style={{ display: 'block', color: '#CBD5E1', fontSize: '0.85rem', marginBottom: '4px', fontWeight: '600' }}>Primary Service Interest</label>
                <select
                  id="modal-service"
                  className="form-select"
                  value={formData.service}
                  onChange={(e) => setFormData({ ...formData, service: e.target.value })}
                  style={{ width: '100%', padding: '10px 12px', background: '#070B14', border: '1px solid rgba(255,255,255,0.12)', borderRadius: '8px', color: '#F8FAFC' }}
                >
                  <option value="Linux Server Support">Linux Server Support & Administration</option>
                  <option value="Nginx & Web Hosting Support">Nginx & Web Hosting Support</option>
                  <option value="Website Development">Custom Website Design & Development</option>
                  <option value="Website Deployment & Maintenance">Website Deployment & Maintenance</option>
                  <option value="Cloud Server Setup & Management">Cloud Server Setup & Management</option>
                  <option value="Windows Server & Infrastructure">Windows Server & Infrastructure</option>
                  <option value="Network Setup & Troubleshooting">Network Setup & Troubleshooting</option>
                  <option value="IT Infrastructure Consulting">IT Infrastructure & Security Consulting</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="modal-notes" style={{ display: 'block', color: '#CBD5E1', fontSize: '0.85rem', marginBottom: '4px', fontWeight: '600' }}>Brief Project Scope / Summary</label>
                <textarea
                  id="modal-notes"
                  rows="3"
                  className="form-textarea"
                  placeholder="Describe your current setup, goals, or timeline..."
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  style={{ width: '100%', padding: '10px 12px', background: '#070B14', border: '1px solid rgba(255,255,255,0.12)', borderRadius: '8px', color: '#F8FAFC', resize: 'vertical' }}
                ></textarea>
              </div>
            </div>

            <div style={{ marginTop: '24px', display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
              <button type="button" className="btn btn-secondary" onClick={handleClose}>
                Cancel
              </button>
              <button type="submit" className="btn btn-primary" disabled={loading}>
                {loading ? 'Submitting...' : 'Request Free Consultation'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
