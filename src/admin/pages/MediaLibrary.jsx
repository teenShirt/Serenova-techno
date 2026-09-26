import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { Upload, Image as ImageIcon, Trash2, Copy, Check, AlertTriangle, X } from 'lucide-react';

export default function MediaLibrary() {
  const [mediaList, setMediaList] = useState([]);
  const [loading, setLoading] = useState(true);

  const [uploading, setUploading] = useState(false);
  const [altText, setAltText] = useState('');
  const [copiedId, setCopiedId] = useState(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);
  const [message, setMessage] = useState(null);

  const loadMedia = async () => {
    setLoading(true);
    const res = await api.getMedia();
    if (res && res.success && res.media) {
      setMediaList(res.media);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadMedia();
  }, []);

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setMessage(null);
    setUploading(true);

    const formData = new FormData();
    formData.append('file', file);
    if (altText) {
      formData.append('alt_text', altText);
    }

    try {
      const res = await api.uploadMedia(formData);
      if (res && res.success) {
        setMessage({ type: 'success', text: 'File uploaded successfully!' });
        setAltText('');
        loadMedia();
      } else {
        setMessage({ type: 'error', text: res?.message || 'Upload failed.' });
      }
    } catch (err) {
      setMessage({ type: 'error', text: 'Server upload error.' });
    } finally {
      setUploading(false);
      e.target.value = '';
    }
  };

  const copyUrl = (path, id) => {
    navigator.clipboard.writeText(path);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleDelete = async (id) => {
    const res = await api.deleteMedia(id);
    if (res && res.success) {
      setMessage({ type: 'success', text: 'Media item deleted.' });
      setDeleteConfirmId(null);
      loadMedia();
    }
  };

  return (
    <div>
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Media Library</h1>
          <p className="admin-page-subtitle">Upload and manage website images (JPG, PNG, WebP, SVG).</p>
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

      {/* Upload Drop Area */}
      <div className="admin-card" style={{ textAlign: 'center', padding: '36px 24px', borderStyle: 'dashed' }}>
        <Upload size={32} style={{ color: '#38BDF8', marginBottom: '12px' }} />
        <h3 style={{ color: '#FFFFFF', fontSize: '1.1rem', marginBottom: '6px' }}>
          {uploading ? 'Uploading File...' : 'Upload New Media File'}
        </h3>
        <p style={{ color: '#94A3B8', fontSize: '0.85rem', marginBottom: '20px' }}>
          Allowed extensions: .jpg, .jpeg, .png, .webp, .svg (Max 5MB)
        </p>

        <div style={{ maxWidth: '320px', margin: '0 auto 16px auto' }}>
          <input
            type="text"
            className="admin-input"
            placeholder="Alt text / description (optional)"
            value={altText}
            onChange={(e) => setAltText(e.target.value)}
            style={{ marginBottom: '12px' }}
          />

          <label className="admin-btn admin-btn-primary" style={{ cursor: 'pointer', display: 'inline-flex' }}>
            <Upload size={16} />
            <span>Select Image File</span>
            <input
              type="file"
              accept=".jpg,.jpeg,.png,.webp,.svg"
              onChange={handleFileUpload}
              style={{ display: 'none' }}
              disabled={uploading}
            />
          </label>
        </div>
      </div>

      {/* Media Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '20px' }}>
        {mediaList.map((item) => (
          <div key={item.id} className="admin-card" style={{ padding: '12px', marginBottom: 0, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div style={{ height: '140px', borderRadius: '8px', overflow: 'hidden', background: '#070B14', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '12px', border: '1px solid rgba(255,255,255,0.06)' }}>
              <img src={item.file_path} alt={item.alt_text || item.original_name} style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }} />
            </div>

            <div>
              <div style={{ fontSize: '0.825rem', fontWeight: '600', color: '#FFFFFF', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', marginBottom: '2px' }}>
                {item.original_name}
              </div>
              <div style={{ fontSize: '0.725rem', color: '#64748B', marginBottom: '12px' }}>
                {(item.size_bytes / 1024).toFixed(1)} KB • {item.mime_type.split('/')[1]}
              </div>

              <div style={{ display: 'flex', gap: '6px' }}>
                <button
                  className="admin-btn admin-btn-secondary admin-btn-sm"
                  style={{ flexGrow: 1 }}
                  onClick={() => copyUrl(item.file_path, item.id)}
                >
                  {copiedId === item.id ? <Check size={12} style={{ color: '#10B981' }} /> : <Copy size={12} />}
                  <span>{copiedId === item.id ? 'Copied' : 'Copy URL'}</span>
                </button>

                <button
                  className="admin-btn admin-btn-danger admin-btn-sm"
                  onClick={() => setDeleteConfirmId(item.id)}
                >
                  <Trash2 size={12} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Delete Modal */}
      {deleteConfirmId && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.8)', zIndex: 1100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
          <div style={{ background: '#0F172A', border: '1px solid rgba(239, 68, 68, 0.4)', borderRadius: '14px', width: '100%', maxWidth: '420px', padding: '24px', textAlign: 'center' }}>
            <AlertTriangle size={36} style={{ color: '#EF4444', marginBottom: '12px' }} />
            <h3 style={{ color: '#FFFFFF', fontSize: '1.2rem', marginBottom: '8px' }}>Confirm Deletion</h3>
            <p style={{ color: '#94A3B8', fontSize: '0.875rem', marginBottom: '20px' }}>Are you sure you want to delete this media file?</p>
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
              <button className="admin-btn admin-btn-secondary" onClick={() => setDeleteConfirmId(null)}>
                Cancel
              </button>
              <button className="admin-btn admin-btn-danger" onClick={() => handleDelete(deleteConfirmId)}>
                Delete Media
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
