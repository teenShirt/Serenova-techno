import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { 
  Inbox, 
  Search, 
  Filter, 
  Download, 
  Eye, 
  Trash2, 
  X, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  MessageSquare, 
  User, 
  Mail, 
  Phone, 
  Building, 
  Globe, 
  Tag, 
  Calendar,
  Archive,
  Send
} from 'lucide-react';

export default function LeadsManager() {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({ page: 1, limit: 20, total: 0, totalPages: 1 });

  // Filters
  const [statusFilter, setStatusFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showArchived, setShowArchived] = useState(false);

  // Active Lead Detail Modal State
  const [activeLeadId, setActiveLeadId] = useState(null);
  const [activeLeadDetails, setActiveLeadDetails] = useState(null);
  const [detailsLoading, setDetailsLoading] = useState(false);
  const [newNoteText, setNewNoteText] = useState('');

  const statusList = [
    { key: 'all', label: 'All Leads' },
    { key: 'new', label: 'New' },
    { key: 'contacted', label: 'Contacted' },
    { key: 'qualified', label: 'Qualified' },
    { key: 'proposal_sent', label: 'Proposal Sent' },
    { key: 'won', label: 'Won' },
    { key: 'closed', label: 'Closed' },
    { key: 'spam', label: 'Spam' }
  ];

  const loadLeadsList = async (page = 1) => {
    setLoading(true);
    const params = {
      page,
      limit: 20,
      status: statusFilter,
      priority: priorityFilter,
      search: searchQuery,
      includeArchived: showArchived ? 'true' : 'false'
    };

    const res = await api.getLeads(params);
    if (res && res.success) {
      setLeads(res.leads || []);
      setPagination(res.pagination || { page: 1, limit: 20, total: 0, totalPages: 1 });
    }
    setLoading(false);
  };

  useEffect(() => {
    loadLeadsList(1);
  }, [statusFilter, priorityFilter, showArchived]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    loadLeadsList(1);
  };

  const openLeadDetail = async (id) => {
    setActiveLeadId(id);
    setDetailsLoading(true);
    const res = await api.getLeadById(id);
    if (res && res.success) {
      setActiveLeadDetails(res);
    }
    setDetailsLoading(false);
    // Refresh table list status
    loadLeadsList(pagination.page);
  };

  const handleStatusUpdate = async (newStatus) => {
    if (!activeLeadId) return;
    const res = await api.patchLead(activeLeadId, { status: newStatus });
    if (res && res.success) {
      openLeadDetail(activeLeadId);
    }
  };

  const handlePriorityUpdate = async (newPriority) => {
    if (!activeLeadId) return;
    const res = await api.patchLead(activeLeadId, { priority: newPriority });
    if (res && res.success) {
      openLeadDetail(activeLeadId);
    }
  };

  const handleFollowUpUpdate = async (fDate) => {
    if (!activeLeadId) return;
    const res = await api.patchLead(activeLeadId, { follow_up_date: fDate });
    if (res && res.success) {
      openLeadDetail(activeLeadId);
    }
  };

  const handleArchiveToggle = async (currentlyArchived) => {
    if (!activeLeadId) return;
    const res = await api.patchLead(activeLeadId, { is_archived: !currentlyArchived });
    if (res && res.success) {
      setActiveLeadId(null);
      loadLeadsList(pagination.page);
    }
  };

  const handleAddNote = async (e) => {
    e.preventDefault();
    if (!newNoteText.trim() || !activeLeadId) return;
    const res = await api.addLeadNote(activeLeadId, newNoteText);
    if (res && res.success) {
      setNewNoteText('');
      openLeadDetail(activeLeadId);
    }
  };

  const getStatusBadgeStyle = (status) => {
    switch (status) {
      case 'new': return { bg: 'rgba(56, 189, 248, 0.15)', color: '#38BDF8' };
      case 'contacted': return { bg: 'rgba(96, 165, 250, 0.15)', color: '#60A5FA' };
      case 'qualified': return { bg: 'rgba(167, 139, 250, 0.15)', color: '#A78BFA' };
      case 'proposal_sent': return { bg: 'rgba(245, 158, 11, 0.15)', color: '#F59E0B' };
      case 'won': return { bg: 'rgba(16, 185, 129, 0.15)', color: '#10B981' };
      case 'closed': return { bg: 'rgba(148, 163, 184, 0.15)', color: '#94A3B8' };
      case 'spam': return { bg: 'rgba(239, 68, 68, 0.15)', color: '#EF4444' };
      default: return { bg: 'rgba(255,255,255,0.06)', color: '#CBD5E1' };
    }
  };

  return (
    <div>
      {/* Page Header */}
      <div className="admin-page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 className="admin-page-title">Lead Management Pipeline</h1>
          <p className="admin-page-subtitle">Qualify incoming consultation inquiries, track follow-ups, and manage deal stages.</p>
        </div>

        <a
          href={api.getLeadsExportUrl()}
          className="admin-btn admin-btn-secondary"
          style={{ textDecoration: 'none' }}
        >
          <Download size={16} />
          <span>Export Leads CSV</span>
        </a>
      </div>

      {/* Filter Tabs & Search Bar */}
      <div className="admin-card" style={{ padding: '16px 20px', marginBottom: '24px' }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', justifyContent: 'space-between', alignItems: 'center' }}>
          {/* Status Tabs */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
            {statusList.map((st) => (
              <button
                key={st.key}
                onClick={() => setStatusFilter(st.key)}
                className={`admin-btn ${statusFilter === st.key ? 'admin-btn-primary' : 'admin-btn-secondary'} admin-btn-sm`}
              >
                {st.label}
              </button>
            ))}
          </div>

          {/* Search Input */}
          <form onSubmit={handleSearchSubmit} style={{ display: 'flex', gap: '8px' }}>
            <input
              type="text"
              placeholder="Search reference, name, email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{ padding: '8px 12px', background: '#070B14', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '6px', color: '#F8FAFC', fontSize: '0.85rem' }}
            />
            <button type="submit" className="admin-btn admin-btn-secondary admin-btn-sm">
              <Search size={14} />
            </button>
          </form>
        </div>
      </div>

      {/* Leads Table */}
      <div className="admin-table-container">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Ref Number</th>
              <th>Status</th>
              <th>Lead Name & Email</th>
              <th>Service Required</th>
              <th>Client Type</th>
              <th>Priority</th>
              <th>Received</th>
              <th style={{ textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={8} style={{ textAlign: 'center', padding: '32px', color: '#94A3B8' }}>
                  Loading lead records...
                </td>
              </tr>
            ) : leads.length === 0 ? (
              <tr>
                <td colSpan={8} style={{ textAlign: 'center', padding: '32px', color: '#94A3B8' }}>
                  No lead records found matching your filters.
                </td>
              </tr>
            ) : (
              leads.map((lead) => {
                const badge = getStatusBadgeStyle(lead.status);
                return (
                  <tr key={lead.id} style={{ backgroundColor: lead.is_read ? 'transparent' : 'rgba(56, 189, 248, 0.04)' }}>
                    <td style={{ fontFamily: 'monospace', fontSize: '0.85rem', color: '#38BDF8', fontWeight: '600' }}>
                      {lead.reference_number || `ST-REF-${lead.id}`}
                    </td>
                    <td>
                      <span style={{ fontSize: '0.75rem', background: badge.bg, color: badge.color, padding: '4px 10px', borderRadius: '9999px', fontWeight: '700', textTransform: 'uppercase' }}>
                        {lead.status || 'new'}
                      </span>
                    </td>
                    <td>
                      <div style={{ fontWeight: '600', color: '#F8FAFC' }}>{lead.name}</div>
                      <div style={{ fontSize: '0.8rem', color: '#94A3B8' }}>{lead.email}</div>
                    </td>
                    <td style={{ fontSize: '0.85rem', color: '#CBD5E1' }}>
                      {lead.required_service || 'General Consultation'}
                    </td>
                    <td style={{ fontSize: '0.85rem', color: '#94A3B8' }}>
                      {lead.client_type || 'Small Business'}
                    </td>
                    <td>
                      <span style={{ fontSize: '0.75rem', color: lead.priority === 'urgent' ? '#EF4444' : '#CBD5E1', fontWeight: '600' }}>
                        {(lead.priority || 'medium').toUpperCase()}
                      </span>
                    </td>
                    <td style={{ fontSize: '0.8rem', color: '#94A3B8' }}>
                      {new Date(lead.created_at).toLocaleDateString()}
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <button
                        className="admin-btn admin-btn-secondary admin-btn-sm"
                        onClick={() => openLeadDetail(lead.id)}
                      >
                        <Eye size={14} />
                        <span>Manage Lead</span>
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {pagination.totalPages > 1 && (
        <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', marginTop: '20px' }}>
          {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map((p) => (
            <button
              key={p}
              onClick={() => loadLeadsList(p)}
              className={`admin-btn ${pagination.page === p ? 'admin-btn-primary' : 'admin-btn-secondary'} admin-btn-sm`}
            >
              {p}
            </button>
          ))}
        </div>
      )}

      {/* Lead Detail & Activity Modal */}
      {activeLeadId && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.8)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
          <div style={{ background: '#0F172A', border: '1px solid rgba(255,255,255,0.12)', borderRadius: '18px', width: '100%', maxWidth: '850px', maxHeight: '90vh', overflowY: 'auto', padding: '32px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', borderBottom: '1px solid rgba(255,255,255,0.08)', paddingBottom: '16px' }}>
              <div>
                <span style={{ fontFamily: 'monospace', color: '#38BDF8', fontSize: '0.85rem', fontWeight: '700' }}>
                  {activeLeadDetails?.lead?.reference_number}
                </span>
                <h2 style={{ fontSize: '1.4rem', color: '#F8FAFC', fontWeight: '800', marginTop: '4px' }}>
                  {activeLeadDetails?.lead?.name} ({activeLeadDetails?.lead?.company || 'Individual Client'})
                </h2>
              </div>
              <button onClick={() => setActiveLeadId(null)} style={{ background: 'none', border: 'none', color: '#94A3B8', cursor: 'pointer' }}>
                <X size={24} />
              </button>
            </div>

            {detailsLoading ? (
              <p style={{ color: '#94A3B8', textAlign: 'center', padding: '40px' }}>Loading lead history...</p>
            ) : (
              <div>
                {/* Status & Priority Controls */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', background: '#070B14', padding: '16px', borderRadius: '12px', marginBottom: '24px' }}>
                  <div>
                    <label style={{ fontSize: '0.75rem', color: '#94A3B8', textTransform: 'uppercase', display: 'block', marginBottom: '6px' }}>
                      Lead Stage Status
                    </label>
                    <select
                      value={activeLeadDetails?.lead?.status || 'new'}
                      onChange={(e) => handleStatusUpdate(e.target.value)}
                      style={{ width: '100%', padding: '8px', background: '#0F172A', border: '1px solid rgba(255,255,255,0.1)', color: '#F8FAFC', borderRadius: '6px', fontSize: '0.85rem' }}
                    >
                      <option value="new">New</option>
                      <option value="contacted">Contacted</option>
                      <option value="qualified">Qualified</option>
                      <option value="proposal_sent">Proposal Sent</option>
                      <option value="won">Won (Deal Closed)</option>
                      <option value="closed">Closed (Lost/Unqualified)</option>
                      <option value="spam">Spam</option>
                    </select>
                  </div>

                  <div>
                    <label style={{ fontSize: '0.75rem', color: '#94A3B8', textTransform: 'uppercase', display: 'block', marginBottom: '6px' }}>
                      Priority Level
                    </label>
                    <select
                      value={activeLeadDetails?.lead?.priority || 'medium'}
                      onChange={(e) => handlePriorityUpdate(e.target.value)}
                      style={{ width: '100%', padding: '8px', background: '#0F172A', border: '1px solid rgba(255,255,255,0.1)', color: '#F8FAFC', borderRadius: '6px', fontSize: '0.85rem' }}
                    >
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                      <option value="urgent">Urgent</option>
                    </select>
                  </div>

                  <div>
                    <label style={{ fontSize: '0.75rem', color: '#94A3B8', textTransform: 'uppercase', display: 'block', marginBottom: '6px' }}>
                      Follow-up Date
                    </label>
                    <input
                      type="date"
                      value={activeLeadDetails?.lead?.follow_up_date || ''}
                      onChange={(e) => handleFollowUpUpdate(e.target.value)}
                      style={{ width: '100%', padding: '8px', background: '#0F172A', border: '1px solid rgba(255,255,255,0.1)', color: '#F8FAFC', borderRadius: '6px', fontSize: '0.85rem' }}
                    />
                  </div>
                </div>

                {/* Lead Contact Info & Requirement Box */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '24px', fontSize: '0.9rem', color: '#CBD5E1' }}>
                  <div>
                    <div><strong>Email:</strong> <a href={`mailto:${activeLeadDetails?.lead?.email}`} style={{ color: '#38BDF8' }}>{activeLeadDetails?.lead?.email}</a></div>
                    <div><strong>Phone/WhatsApp:</strong> {activeLeadDetails?.lead?.phone || 'Not provided'}</div>
                    <div><strong>Country:</strong> {activeLeadDetails?.lead?.country || 'Not specified'}</div>
                  </div>
                  <div>
                    <div><strong>Service Required:</strong> {activeLeadDetails?.lead?.required_service}</div>
                    <div><strong>Client Type:</strong> {activeLeadDetails?.lead?.client_type}</div>
                    <div><strong>Urgency:</strong> {activeLeadDetails?.lead?.urgency}</div>
                  </div>
                </div>

                {/* Project Summary */}
                <div style={{ background: '#070B14', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '10px', padding: '16px', color: '#F8FAFC', fontSize: '0.95rem', lineHeight: '1.6', marginBottom: '28px', whiteSpace: 'pre-wrap' }}>
                  <strong style={{ color: '#38BDF8', display: 'block', marginBottom: '6px' }}>Project Summary / Client Requirement:</strong>
                  {activeLeadDetails?.lead?.message}
                </div>

                {/* Internal Notes Section */}
                <div style={{ marginBottom: '28px' }}>
                  <h3 style={{ fontSize: '1.1rem', color: '#F8FAFC', fontWeight: '700', marginBottom: '12px' }}>
                    Internal Admin Notes
                  </h3>

                  <form onSubmit={handleAddNote} style={{ display: 'flex', gap: '10px', marginBottom: '16px' }}>
                    <input
                      type="text"
                      placeholder="Add private note (e.g. Sent proposal via email, waiting for call...)"
                      value={newNoteText}
                      onChange={(e) => setNewNoteText(e.target.value)}
                      style={{ flex: 1, padding: '10px 14px', background: '#070B14', border: '1px solid rgba(255,255,255,0.12)', borderRadius: '8px', color: '#F8FAFC', fontSize: '0.9rem' }}
                    />
                    <button type="submit" className="admin-btn admin-btn-primary admin-btn-sm">
                      <Send size={14} />
                      <span>Add Note</span>
                    </button>
                  </form>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {(activeLeadDetails?.notes || []).length === 0 ? (
                      <p style={{ fontSize: '0.85rem', color: '#94A3B8' }}>No internal notes added yet.</p>
                    ) : (
                      activeLeadDetails.notes.map((n) => (
                        <div key={n.id} style={{ background: '#070B14', borderLeft: '3px solid #38BDF8', padding: '10px 14px', borderRadius: '0 8px 8px 0', fontSize: '0.875rem' }}>
                          <div style={{ color: '#F8FAFC', marginBottom: '2px' }}>{n.note}</div>
                          <div style={{ fontSize: '0.75rem', color: '#64748B' }}>By {n.admin_name || 'Admin'} on {new Date(n.created_at).toLocaleString()}</div>
                        </div>
                      ))
                    )}
                  </div>
                </div>

                {/* Activity Audit Timeline */}
                <div style={{ marginBottom: '28px' }}>
                  <h3 style={{ fontSize: '1.1rem', color: '#F8FAFC', fontWeight: '700', marginBottom: '12px' }}>
                    Activity History
                  </h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    {(activeLeadDetails?.activity || []).map((act) => (
                      <div key={act.id} style={{ fontSize: '0.8rem', color: '#94A3B8', display: 'flex', justifyContent: 'space-between' }}>
                        <span>Action: {act.action} ({act.old_value || ''} ➔ {act.new_value || ''})</span>
                        <span>{new Date(act.created_at).toLocaleString()}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: '16px' }}>
                  <button
                    className="admin-btn admin-btn-danger admin-btn-sm"
                    onClick={() => handleArchiveToggle(activeLeadDetails?.lead?.is_archived)}
                  >
                    <Archive size={14} />
                    <span>{activeLeadDetails?.lead?.is_archived ? 'Unarchive Lead' : 'Archive Lead'}</span>
                  </button>

                  <button className="admin-btn admin-btn-secondary" onClick={() => setActiveLeadId(null)}>
                    Close
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
