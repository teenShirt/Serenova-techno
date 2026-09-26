import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { Plus, Edit, Trash2, Eye, EyeOff, Save, X, AlertTriangle, Star } from 'lucide-react';

export default function ProjectsManager() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  const [modalOpen, setModalOpen] = useState(false);
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);
  const [editingProject, setEditingProject] = useState(null);

  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    category: 'IT Solution',
    service_category: 'Nginx and Web Hosting Support',
    client_type: 'International Small Business',
    description: '',
    challenge: '',
    solution: '',
    result: '',
    client_name: '',
    project_url: '',
    image_url: '',
    techStackStr: '',
    completion_date: '',
    is_featured: 0,
    is_published: 1,
    display_order: 0
  });

  const [message, setMessage] = useState(null);

  const loadProjects = async () => {
    setLoading(true);
    const res = await api.getProjects();
    if (res && res.success && res.projects) {
      setProjects(res.projects);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadProjects();
  }, []);

  const openAddModal = () => {
    setEditingProject(null);
    setFormData({
      title: '',
      slug: '',
      category: 'Nginx & Web Hosting',
      service_category: 'Nginx and Web Hosting Support',
      client_type: 'International Small Business',
      description: '',
      challenge: '',
      solution: '',
      result: '',
      client_name: '',
      project_url: '',
      image_url: '',
      techStackStr: 'Nginx, Ubuntu, Certbot',
      completion_date: 'May 2026',
      is_featured: 0,
      is_published: 1,
      display_order: projects.length + 1
    });
    setModalOpen(true);
  };

  const openEditModal = (project) => {
    setEditingProject(project);
    setFormData({
      title: project.title || '',
      slug: project.slug || '',
      category: project.category || 'IT Solution',
      service_category: project.service_category || 'Nginx and Web Hosting Support',
      client_type: project.client_type || project.clientType || '',
      description: project.description || project.summary || '',
      challenge: project.challenge || '',
      solution: project.solution || '',
      result: project.result || '',
      client_name: project.client_name || '',
      project_url: project.project_url || '',
      image_url: project.image_url || '',
      techStackStr: Array.isArray(project.techStack) ? project.techStack.join(', ') : '',
      completion_date: project.completion_date || project.completionDate || '',
      is_featured: project.is_featured ? 1 : 0,
      is_published: project.is_published ? 1 : 0,
      display_order: project.display_order || 0
    });
    setModalOpen(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    const techStack = formData.techStackStr.split(',').map(s => s.trim()).filter(Boolean);

    const payload = {
      title: formData.title,
      slug: formData.slug,
      category: formData.category,
      service_category: formData.service_category,
      client_type: formData.client_type,
      description: formData.description,
      challenge: formData.challenge,
      solution: formData.solution,
      result: formData.result,
      client_name: formData.client_name || null,
      project_url: formData.project_url || null,
      image_url: formData.image_url || null,
      techStack,
      completion_date: formData.completion_date || null,
      is_featured: formData.is_featured ? 1 : 0,
      is_published: formData.is_published ? 1 : 0,
      display_order: parseInt(formData.display_order, 10) || 0
    };

    let res;
    if (editingProject) {
      res = await api.updateProject(editingProject.id, payload);
    } else {
      res = await api.createProject(payload);
    }

    if (res && res.success) {
      setMessage({ type: 'success', text: editingProject ? 'Case study updated successfully!' : 'Case study created successfully!' });
      setModalOpen(false);
      loadProjects();
    } else {
      setMessage({ type: 'error', text: res?.message || 'Operation failed.' });
    }
  };

  const handleDelete = async (id) => {
    const res = await api.deleteProject(id);
    if (res && res.success) {
      setMessage({ type: 'success', text: 'Case study deleted.' });
      setDeleteConfirmId(null);
      loadProjects();
    } else {
      setMessage({ type: 'error', text: res?.message || 'Failed to delete case study.' });
    }
  };

  return (
    <div>
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Case Studies & Projects Manager</h1>
          <p className="admin-page-subtitle">Manage technical case studies, challenges, solutions, results, and slugs.</p>
        </div>

        <button className="admin-btn admin-btn-primary" onClick={openAddModal}>
          <Plus size={18} />
          <span>Add Case Study</span>
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

      {/* Projects Table */}
      <div className="admin-table-container">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Order</th>
              <th>Case Study Title & Slug</th>
              <th>Client Type</th>
              <th>Tech Stack</th>
              <th>Status</th>
              <th style={{ textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {projects.map((project) => (
              <tr key={project.id}>
                <td style={{ fontWeight: '700' }}>{project.display_order}</td>
                <td>
                  <div style={{ fontWeight: '600', color: '#FFFFFF', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    {project.is_featured ? <Star size={14} style={{ color: '#F59E0B' }} title="Featured" /> : null}
                    <span>{project.title}</span>
                  </div>
                  <div style={{ fontSize: '0.775rem', color: '#38BDF8', fontFamily: 'monospace' }}>
                    /projects/{project.slug || project.id}
                  </div>
                </td>
                <td>{project.client_type || project.clientType || 'Commercial'}</td>
                <td>
                  <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
                    {Array.isArray(project.techStack) && project.techStack.map((tech, i) => (
                      <span key={i} style={{ fontSize: '0.7rem', padding: '2px 6px', background: 'rgba(56,189,248,0.1)', color: '#38BDF8', borderRadius: '4px' }}>
                        {tech}
                      </span>
                    ))}
                  </div>
                </td>
                <td>
                  <span className={`badge-status ${project.is_published ? 'badge-published' : 'badge-draft'}`}>
                    {project.is_published ? 'Published' : 'Draft'}
                  </span>
                </td>
                <td style={{ textAlign: 'right' }}>
                  <div style={{ display: 'inline-flex', gap: '8px' }}>
                    <button className="admin-btn admin-btn-secondary admin-btn-sm" onClick={() => openEditModal(project)}>
                      <Edit size={14} />
                      <span>Edit</span>
                    </button>
                    <button className="admin-btn admin-btn-danger admin-btn-sm" onClick={() => setDeleteConfirmId(project.id)}>
                      <Trash2 size={14} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add/Edit Modal */}
      {modalOpen && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.8)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
          <div style={{ background: '#0F172A', border: '1px solid rgba(255,255,255,0.12)', borderRadius: '16px', width: '100%', maxWidth: '700px', padding: '28px', maxHeight: '90vh', overflowY: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h3 style={{ fontSize: '1.25rem', color: '#FFFFFF', fontWeight: '700' }}>
                {editingProject ? 'Edit Case Study' : 'Add Case Study'}
              </h3>
              <button onClick={() => setModalOpen(false)} style={{ background: 'none', border: 'none', color: '#94A3B8', cursor: 'pointer' }}>
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSave}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div className="admin-form-group">
                  <label className="admin-label">Case Study Title</label>
                  <input
                    type="text"
                    className="admin-input"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    required
                  />
                </div>

                <div className="admin-form-group">
                  <label className="admin-label">URL Slug</label>
                  <input
                    type="text"
                    className="admin-input"
                    value={formData.slug}
                    onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                    placeholder="e.g. e-commerce-nginx-optimization"
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div className="admin-form-group">
                  <label className="admin-label">Client Type</label>
                  <input
                    type="text"
                    className="admin-input"
                    value={formData.client_type}
                    onChange={(e) => setFormData({ ...formData, client_type: e.target.value })}
                    placeholder="e.g. International E-Commerce Business"
                  />
                </div>

                <div className="admin-form-group">
                  <label className="admin-label">Completion Date</label>
                  <input
                    type="text"
                    className="admin-input"
                    value={formData.completion_date}
                    onChange={(e) => setFormData({ ...formData, completion_date: e.target.value })}
                    placeholder="e.g. May 2026"
                  />
                </div>
              </div>

              <div className="admin-form-group">
                <label className="admin-label">Summary / Description</label>
                <textarea
                  className="admin-textarea"
                  rows={2}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  required
                />
              </div>

              <div className="admin-form-group">
                <label className="admin-label">Technical Challenge</label>
                <textarea
                  className="admin-textarea"
                  rows={2}
                  value={formData.challenge}
                  onChange={(e) => setFormData({ ...formData, challenge: e.target.value })}
                  placeholder="What was broken or limiting the client?"
                />
              </div>

              <div className="admin-form-group">
                <label className="admin-label">The Serenova Solution</label>
                <textarea
                  className="admin-textarea"
                  rows={2}
                  value={formData.solution}
                  onChange={(e) => setFormData({ ...formData, solution: e.target.value })}
                  placeholder="What architecture or fix did you implement?"
                />
              </div>

              <div className="admin-form-group">
                <label className="admin-label">Measurable Result</label>
                <textarea
                  className="admin-textarea"
                  rows={2}
                  value={formData.result}
                  onChange={(e) => setFormData({ ...formData, result: e.target.value })}
                  placeholder="e.g. Reduced page load times by 40% with zero downtime"
                />
              </div>

              <div className="admin-form-group">
                <label className="admin-label">Technologies Implemented (comma separated)</label>
                <input
                  type="text"
                  className="admin-input"
                  value={formData.techStackStr}
                  onChange={(e) => setFormData({ ...formData, techStackStr: e.target.value })}
                  placeholder="Nginx, Ubuntu, Docker, FastCGI"
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px' }}>
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
                  <label className="admin-label">Featured</label>
                  <select
                    className="admin-select"
                    value={formData.is_featured}
                    onChange={(e) => setFormData({ ...formData, is_featured: parseInt(e.target.value, 10) })}
                  >
                    <option value={0}>No</option>
                    <option value={1}>Yes (Featured)</option>
                  </select>
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
                  <span>Save Case Study</span>
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
            <p style={{ color: '#94A3B8', fontSize: '0.875rem', marginBottom: '20px' }}>Are you sure you want to delete this case study?</p>
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
              <button className="admin-btn admin-btn-secondary" onClick={() => setDeleteConfirmId(null)}>
                Cancel
              </button>
              <button className="admin-btn admin-btn-danger" onClick={() => handleDelete(deleteConfirmId)}>
                Delete Case Study
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
