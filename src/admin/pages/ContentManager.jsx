import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { Save, Check, AlertCircle, RefreshCw } from 'lucide-react';

export default function ContentManager() {
  const [activeTab, setActiveTab] = useState('hero');
  const [content, setContent] = useState({
    hero: {
      eyebrow: 'SMART TECHNOLOGY SOLUTIONS',
      title: 'Technology That Moves Your Business Forward',
      subtitle: 'We architect secure, reliable, and scalable IT solutions for modern enterprises. From cloud migration and cybersecurity to automated systems, we empower your digital growth.',
      primaryBtnText: 'Explore Our Services',
      secondaryBtnText: 'Talk to an Expert'
    },
    cta: {
      title: 'Ready to Transform Your IT Infrastructure?',
      subtitle: 'Partner with SerenovaTech for secure, reliable, and scalable technology solutions tailored to your enterprise goals.'
    }
  });

  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState(null);

  useEffect(() => {
    async function loadContent() {
      const res = await api.getContent();
      if (res && res.success && res.content) {
        setContent(prev => ({
          ...prev,
          ...res.content
        }));
      }
    }
    loadContent();
  }, []);

  const handleChange = (section, field, value) => {
    setContent(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }));
  };

  const handleSaveSection = async (sectionKey) => {
    setSaving(true);
    setMessage(null);
    try {
      const sectionData = content[sectionKey] || {};
      const res = await api.updateContentSection(sectionKey, sectionData);
      if (res && res.success) {
        setMessage({ type: 'success', text: `Section '${sectionKey}' saved successfully!` });
      } else {
        setMessage({ type: 'error', text: res?.message || 'Failed to save section content.' });
      }
    } catch (err) {
      setMessage({ type: 'error', text: 'Error saving content to backend.' });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Homepage Content Management</h1>
          <p className="admin-page-subtitle">Edit text, headings, badges, and call-to-action sections of the public website.</p>
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

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '24px', borderBottom: '1px solid rgba(255, 255, 255, 0.08)', paddingBottom: '12px' }}>
        {['hero', 'cta'].map(tab => (
          <button
            key={tab}
            className={`admin-btn ${activeTab === tab ? 'admin-btn-primary' : 'admin-btn-secondary'}`}
            onClick={() => { setActiveTab(tab); setMessage(null); }}
          >
            {tab === 'hero' ? 'Hero Section' : 'CTA Banner'}
          </button>
        ))}
      </div>

      {/* Hero Tab */}
      {activeTab === 'hero' && (
        <div className="admin-card">
          <h3 style={{ fontSize: '1.1rem', color: '#FFFFFF', marginBottom: '20px' }}>Hero Header Settings</h3>

          <div className="admin-form-group">
            <label className="admin-label">Eyebrow Badge Text</label>
            <input
              type="text"
              className="admin-input"
              value={content.hero?.eyebrow || ''}
              onChange={(e) => handleChange('hero', 'eyebrow', e.target.value)}
            />
          </div>

          <div className="admin-form-group">
            <label className="admin-label">Main Heading</label>
            <input
              type="text"
              className="admin-input"
              value={content.hero?.title || ''}
              onChange={(e) => handleChange('hero', 'title', e.target.value)}
            />
          </div>

          <div className="admin-form-group">
            <label className="admin-label">Hero Description Subtitle</label>
            <textarea
              className="admin-textarea"
              rows={3}
              value={content.hero?.subtitle || ''}
              onChange={(e) => handleChange('hero', 'subtitle', e.target.value)}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div className="admin-form-group">
              <label className="admin-label">Primary Button Label</label>
              <input
                type="text"
                className="admin-input"
                value={content.hero?.primaryBtnText || ''}
                onChange={(e) => handleChange('hero', 'primaryBtnText', e.target.value)}
              />
            </div>

            <div className="admin-form-group">
              <label className="admin-label">Secondary Button Label</label>
              <input
                type="text"
                className="admin-input"
                value={content.hero?.secondaryBtnText || ''}
                onChange={(e) => handleChange('hero', 'secondaryBtnText', e.target.value)}
              />
            </div>
          </div>

          <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'flex-end' }}>
            <button className="admin-btn admin-btn-primary" onClick={() => handleSaveSection('hero')} disabled={saving}>
              <Save size={16} />
              <span>{saving ? 'Saving...' : 'Save Hero Changes'}</span>
            </button>
          </div>
        </div>
      )}

      {/* CTA Tab */}
      {activeTab === 'cta' && (
        <div className="admin-card">
          <h3 style={{ fontSize: '1.1rem', color: '#FFFFFF', marginBottom: '20px' }}>Call-To-Action Banner</h3>

          <div className="admin-form-group">
            <label className="admin-label">CTA Banner Heading</label>
            <input
              type="text"
              className="admin-input"
              value={content.cta?.title || ''}
              onChange={(e) => handleChange('cta', 'title', e.target.value)}
            />
          </div>

          <div className="admin-form-group">
            <label className="admin-label">CTA Banner Subtitle</label>
            <textarea
              className="admin-textarea"
              rows={3}
              value={content.cta?.subtitle || ''}
              onChange={(e) => handleChange('cta', 'subtitle', e.target.value)}
            />
          </div>

          <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'flex-end' }}>
            <button className="admin-btn admin-btn-primary" onClick={() => handleSaveSection('cta')} disabled={saving}>
              <Save size={16} />
              <span>{saving ? 'Saving...' : 'Save CTA Changes'}</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
