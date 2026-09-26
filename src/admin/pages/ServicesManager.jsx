import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { Plus, Edit, Trash2, Eye, EyeOff, Save, X, AlertTriangle } from 'lucide-react';

export default function ServicesManager() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

  const [modalOpen, setModalOpen] = useState(false);
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);
  const [editingService, setEditingService] = useState(null);

  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    category: 'General Service',
    short_desc: '',
    full_desc: '',
    problem_solved: '',
    deliverablesStr: '',
    ideal_customer: '',
    starting_price: '',
    icon_name: 'Server',
    techStackStr: '',
    display_order: 0,
    is_published: 1
  });

  const [message, setMessage] = useState(null);

  const loadServices = async () => {
    setLoading(true);
    const res = await api.getServices();
    if (res && res.success && res.services) {
      setServices(res.services);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadServices();
  }, []);

  const openAddModal = () => {
    setEditingService(null);
    setFormData({
      title: '',
      slug: '',
      category: 'Linux Server Support',
      short_desc: '',
      full_desc: '',
      problem_solved: '',
      deliverablesStr: '',
      ideal_customer: '',
      starting_price: '',
      icon_name: 'Server',
      techStackStr: 'Linux, Ubuntu, SSH, Bash',
      display_order: services.length + 1,
      is_published: 1
    });
    setModalOpen(true);
  };

  const openEditModal = (service) => {
    setEditingService(service);
    const deliv = service.deliverables || service.features || [];
    setFormData({
      title: service.title || '',
      slug: service.slug || '',
      category: service.category || 'General Service',
      short_desc: service.short_desc || '',
      full_desc: service.full_desc || '',
      problem_solved: service.problem_solved || '',
      deliverablesStr: Array.isArray(deliv) ? deliv.join('\n') : '',
      ideal_customer: service.ideal_customer || '',
      starting_price: service.starting_price || '',
      icon_name: service.icon_name || 'Server',
      techStackStr: Array.isArray(service.techStack) ? service.techStack.join(', ') : '',
      display_order: service.display_order || 0,
      is_published: service.is_published ? 1 : 0
    });
    setModalOpen(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    const techStack = formData.techStackStr.split(',').map(s => s.trim()).filter(Boolean);
    const deliverables = formData.deliverablesStr.split('\n').map(s => s.trim()).filter(Boolean);

    const payload = {
      title: formData.title,
      slug: formData.slug,
      category: formData.category,
      short_desc: formData.short_desc,
      full_desc: formData.full_desc,
      problem_solved: formData.problem_solved,
      deliverables,
      features: deliverables,
      ideal_customer: formData.ideal_customer,
      starting_price: formData.starting_price,
      icon_name: formData.icon_name,
      techStack,
      display_order: parseInt(formData.display_order, 10) || 0,
      is_published: formData.is_published ? 1 : 0
    };

    let res;
    if (editingService) {
      res = await api.updateService(editingService.id, payload);
    } else {
      res = await api.createService(payload);
    }

    if (res && res.success) {
      setMessage({ type: 'success', text: editingService ? 'Service updated successfully!' : 'Service created successfully!' });
      setModalOpen(false);
      loadServices();
    } else {
      setMessage({ type: 'error', text: res?.message || 'Operation failed.' });
    }
  };

  const handleDelete = async (id) => {
    const res = await api.deleteService(id);
    if (res && res.success) {
      setMessage({ type: 'success', text: 'Service deleted.' });
      setDeleteConfirmId(null);
      loadServices();
    } else {
      setMessage({ type: 'error', text: res?.message || 'Failed to delete service.' });
    }
  };

  const togglePublish = async (service) => {
    const updated = {
      ...service,
      is_published: service.is_published ? 0 : 1
    };
    await api.updateService(service.id, updated);
    loadServices();
  };

  return (
    <div>
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Services Management</h1>
          <p className="admin-page-subtitle">Manage technical services, starting prices, deliverables, and slug URLs.</p>
        </div>

        <button className="admin-btn admin-btn-primary" onClick={openAddModal}>
          <Plus size={18} />
          <span>Add New Service</span>
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

      {/* Services Table */}
      <div className="admin-table-container">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Order</th>
              <th>Service Title & Slug</th>
              <th>Category</th>
              <th>Starting Price</th>
              <th>Status</th>
              <th style={{ textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {services.map((service) => (
              <tr key={service.id}>
                <td style={{ fontWeight: '700', width: '60px' }}>{service.display_order}</td>
                <td>
                  <div style={{ fontWeight: '600', color: '#FFFFFF' }}>{service.title}</div>
                  <div style={{ fontSize: '0.775rem', color: '#38BDF8', fontFamily: 'monospace' }}>
                    /services/{service.slug || service.id}
                  </div>
                </td>
                <td>{service.category}</td>
                <td style={{ color: '#10B981', fontWeight: '600', fontSize: '0.85rem' }}>
                  {service.starting_price || service.startingPrice || 'Custom Quote'}
                </td>
                <td>
                  <button 
                    onClick={() => togglePublish(service)}
                    className={`badge-status ${service.is_published ? 'badge-published' : 'badge-draft'}`}
                    style={{ cursor: 'pointer', border: 'none' }}
                  >
                    {service.is_published ? <Eye size={12} /> : <EyeOff size={12} />}
                    {service.is_published ? 'Published' : 'Draft'}
                  </button>
                </td>
                <td style={{ textAlign: 'right' }}>
                  <div style={{ display: 'inline-flex', gap: '8px' }}>
                    <button className="admin-btn admin-btn-secondary admin-btn-sm" onClick={() => openEditModal(service)}>
                      <Edit size={14} />
                      <span>Edit</span>
                    </button>
                    <button className="admin-btn admin-btn-danger admin-btn-sm" onClick={() => setDeleteConfirmId(service.id)}>
                      <Trash2 size={14} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add / Edit Modal */}
      {modalOpen && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.8)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
          <div style={{ background: '#0F172A', border: '1px solid rgba(255,255,255,0.12)', borderRadius: '16px', width: '100%', maxWidth: '700px', padding: '28px', maxHeight: '90vh', overflowY: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h3 style={{ fontSize: '1.25rem', color: '#FFFFFF', fontWeight: '700' }}>
                {editingService ? 'Edit Service Offering' : 'Add New Service Offering'}
              </h3>
              <button onClick={() => setModalOpen(false)} style={{ background: 'none', border: 'none', color: '#94A3B8', cursor: 'pointer' }}>
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSave}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div className="admin-form-group">
                  <label className="admin-label">Service Title</label>
                  <input
                    type="text"
                    className="admin-input"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    required
                  />
                </div>

                <div className="admin-form-group">
                  <label className="admin-label">URL Slug (e.g. linux-server-support)</label>
                  <input
                    type="text"
                    className="admin-input"
                    value={formData.slug}
                    onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                    placeholder="Auto-generated if left empty"
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px' }}>
                <div className="admin-form-group">
                  <label className="admin-label">Category</label>
                  <input
                    type="text"
                    className="admin-input"
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  />
                </div>

                <div className="admin-form-group">
                  <label className="admin-label">Starting Price</label>
                  <input
                    type="text"
                    className="admin-input"
                    value={formData.starting_price}
                    onChange={(e) => setFormData({ ...formData, starting_price: e.target.value })}
                    placeholder="Starting from $150"
                  />
                </div>

                <div className="admin-form-group">
                  <label className="admin-label">Icon Name</label>
                  <select
                    className="admin-select"
                    value={formData.icon_name}
                    onChange={(e) => setFormData({ ...formData, icon_name: e.target.value })}
                  >
                    <option value="Server">Server</option>
                    <option value="Globe">Globe</option>
                    <option value="ShieldCheck">ShieldCheck</option>
                    <option value="Network">Network</option>
                    <option value="Rocket">Rocket</option>
                    <option value="Activity">Activity</option>
                    <option value="Cloud">Cloud</option>
                    <option value="Monitor">Monitor</option>
                    <option value="Code2">Code2</option>
                  </select>
                </div>
              </div>

              <div className="admin-form-group">
                <label className="admin-label">Short Description</label>
                <textarea
                  className="admin-textarea"
                  rows={2}
                  value={formData.short_desc}
                  onChange={(e) => setFormData({ ...formData, short_desc: e.target.value })}
                  required
                />
              </div>

              <div className="admin-form-group">
                <label className="admin-label">What Problem This Solves</label>
                <textarea
                  className="admin-textarea"
                  rows={2}
                  value={formData.problem_solved}
                  onChange={(e) => setFormData({ ...formData, problem_solved: e.target.value })}
                  placeholder="e.g. Prevents 502 gateway errors and unpatched server vulnerabilities"
                />
              </div>

              <div className="admin-form-group">
                <label className="admin-label">Full Service Scope / Description</label>
                <textarea
                  className="admin-textarea"
                  rows={3}
                  value={formData.full_desc}
                  onChange={(e) => setFormData({ ...formData, full_desc: e.target.value })}
                />
              </div>

              <div className="admin-form-group">
                <label className="admin-label">Included Deliverables (one per line)</label>
                <textarea
                  className="admin-textarea"
                  rows={3}
                  value={formData.deliverablesStr}
                  onChange={(e) => setFormData({ ...formData, deliverablesStr: e.target.value })}
                  placeholder="Linux OS Hardening&#10;SSL Certificate Setup&#10;Automated Backups"
                />
              </div>

              <div className="admin-form-group">
                <label className="admin-label">Ideal Customer Profile</label>
                <input
                  type="text"
                  className="admin-input"
                  value={formData.ideal_customer}
                  onChange={(e) => setFormData({ ...formData, ideal_customer: e.target.value })}
                  placeholder="e.g. Small businesses needing 24/7 server stability"
                />
              </div>

              <div className="admin-form-group">
                <label className="admin-label">Tech Stack Tags (comma separated)</label>
                <input
                  type="text"
                  className="admin-input"
                  value={formData.techStackStr}
                  onChange={(e) => setFormData({ ...formData, techStackStr: e.target.value })}
                  placeholder="Ubuntu, Nginx, Certbot, Docker"
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
                    <option value={0}>Draft / Hidden</option>
                  </select>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '24px' }}>
                <button type="button" className="admin-btn admin-btn-secondary" onClick={() => setModalOpen(false)}>
                  Cancel
                </button>
                <button type="submit" className="admin-btn admin-btn-primary">
                  <Save size={16} />
                  <span>Save Service Offering</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirmId && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.8)', zIndex: 1100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
          <div style={{ background: '#0F172A', border: '1px solid rgba(239, 68, 68, 0.4)', borderRadius: '14px', width: '100%', maxWidth: '420px', padding: '24px', textAlign: 'center' }}>
            <AlertTriangle size={36} style={{ color: '#EF4444', marginBottom: '12px' }} />
            <h3 style={{ color: '#FFFFFF', fontSize: '1.2rem', marginBottom: '8px' }}>Confirm Deletion</h3>
            <p style={{ color: '#94A3B8', fontSize: '0.875rem', marginBottom: '20px' }}>Are you sure you want to delete this service offering?</p>
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
              <button className="admin-btn admin-btn-secondary" onClick={() => setDeleteConfirmId(null)}>
                Cancel
              </button>
              <button className="admin-btn admin-btn-danger" onClick={() => handleDelete(deleteConfirmId)}>
                Delete Service
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
