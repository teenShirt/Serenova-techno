import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { Save, Check, AlertCircle } from 'lucide-react';

export default function SettingsManager() {
  const [settings, setSettings] = useState({
    name: 'Serenova Tech',
    tagline: 'Smart Technology. Better Solutions.',
    email: 'contact@serenovatech.com',
    phone: '+1 (800) 555-0199',
    whatsapp: '+1 (800) 555-0199',
    address: '100 Technology Plaza, Suite 400, Innovation District, CA 94105',
    businessHours: 'Monday - Friday: 8:00 AM - 6:00 PM (EST)',
    linkedin: 'https://linkedin.com/company/serenova-tech',
    twitter: 'https://twitter.com/serenovatech',
    github: 'https://github.com/serenova-tech',
    facebook: 'https://facebook.com/serenovatech',
    seoTitle: 'Serenova Tech | Smart Technology Solutions',
    metaDescription: 'We architect secure, reliable, and scalable IT solutions for modern enterprises.'
  });

  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState(null);

  useEffect(() => {
    async function loadSettings() {
      const res = await api.getSettings();
      if (res && res.success && res.settings && Object.keys(res.settings).length > 0) {
        setSettings(prev => ({ ...prev, ...res.settings }));
      }
    }
    loadSettings();
  }, []);

  const handleChange = (key, value) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage(null);

    const res = await api.updateSettings(settings);
    if (res && res.success) {
      setMessage({ type: 'success', text: 'Site settings updated successfully!' });
    } else {
      setMessage({ type: 'error', text: res?.message || 'Failed to save settings.' });
    }
    setSaving(false);
  };

  return (
    <div>
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Site Settings</h1>
          <p className="admin-page-subtitle">Manage company contact info, address, social media links, and SEO metadata.</p>
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

      <form onSubmit={handleSave}>
        {/* General Info */}
        <div className="admin-card">
          <h3 style={{ fontSize: '1.1rem', color: '#FFFFFF', marginBottom: '20px' }}>Company Information</h3>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div className="admin-form-group">
              <label className="admin-label">Company Name</label>
              <input
                type="text"
                className="admin-input"
                value={settings.name}
                onChange={(e) => handleChange('name', e.target.value)}
                required
              />
            </div>

            <div className="admin-form-group">
              <label className="admin-label">Company Tagline</label>
              <input
                type="text"
                className="admin-input"
                value={settings.tagline}
                onChange={(e) => handleChange('tagline', e.target.value)}
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px' }}>
            <div className="admin-form-group">
              <label className="admin-label">Business Email</label>
              <input
                type="email"
                className="admin-input"
                value={settings.email}
                onChange={(e) => handleChange('email', e.target.value)}
              />
            </div>

            <div className="admin-form-group">
              <label className="admin-label">Telephone Number</label>
              <input
                type="text"
                className="admin-input"
                value={settings.phone}
                onChange={(e) => handleChange('phone', e.target.value)}
              />
            </div>

            <div className="admin-form-group">
              <label className="admin-label">WhatsApp Support Number</label>
              <input
                type="text"
                className="admin-input"
                value={settings.whatsapp}
                onChange={(e) => handleChange('whatsapp', e.target.value)}
              />
            </div>
          </div>

          <div className="admin-form-group">
            <label className="admin-label">Physical Address</label>
            <input
              type="text"
              className="admin-input"
              value={settings.address}
              onChange={(e) => handleChange('address', e.target.value)}
            />
          </div>
        </div>

        {/* Social Media & SEO */}
        <div className="admin-card">
          <h3 style={{ fontSize: '1.1rem', color: '#FFFFFF', marginBottom: '20px' }}>Social Media & SEO Metadata</h3>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div className="admin-form-group">
              <label className="admin-label">LinkedIn URL</label>
              <input
                type="url"
                className="admin-input"
                value={settings.linkedin}
                onChange={(e) => handleChange('linkedin', e.target.value)}
              />
            </div>

            <div className="admin-form-group">
              <label className="admin-label">Twitter / X URL</label>
              <input
                type="url"
                className="admin-input"
                value={settings.twitter}
                onChange={(e) => handleChange('twitter', e.target.value)}
              />
            </div>

            <div className="admin-form-group">
              <label className="admin-label">GitHub URL</label>
              <input
                type="url"
                className="admin-input"
                value={settings.github}
                onChange={(e) => handleChange('github', e.target.value)}
              />
            </div>

            <div className="admin-form-group">
              <label className="admin-label">Facebook URL</label>
              <input
                type="url"
                className="admin-input"
                value={settings.facebook}
                onChange={(e) => handleChange('facebook', e.target.value)}
              />
            </div>
          </div>

          <div className="admin-form-group" style={{ marginTop: '12px' }}>
            <label className="admin-label">Default SEO Title</label>
            <input
              type="text"
              className="admin-input"
              value={settings.seoTitle}
              onChange={(e) => handleChange('seoTitle', e.target.value)}
            />
          </div>

          <div className="admin-form-group">
            <label className="admin-label">Meta Description</label>
            <textarea
              className="admin-textarea"
              rows={2}
              value={settings.metaDescription}
              onChange={(e) => handleChange('metaDescription', e.target.value)}
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '24px' }}>
            <button type="submit" className="admin-btn admin-btn-primary" disabled={saving}>
              <Save size={16} />
              <span>{saving ? 'Saving Settings...' : 'Save All Settings'}</span>
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
