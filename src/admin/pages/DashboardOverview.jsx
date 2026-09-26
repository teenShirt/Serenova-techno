import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../services/api';
import { 
  Server, 
  FolderKanban, 
  HelpCircle, 
  Users, 
  CheckCircle2, 
  Clock, 
  Award,
  FileText,
  ArrowRight,
  TrendingUp,
  Inbox
} from 'lucide-react';

export default function DashboardOverview() {
  const [metrics, setMetrics] = useState({
    servicesCount: 0,
    projectsCount: 0,
    faqsCount: 0,
    mediaCount: 0,
    newLeads: 0,
    qualifiedLeads: 0,
    pendingFollowups: 0,
    proposalsSent: 0,
    wonLeads: 0,
    closedLeads: 0,
    serviceBreakdown: [],
    recentLeads: []
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadMetrics() {
      try {
        const res = await api.getDashboardMetrics();
        if (res && res.success && res.metrics) {
          setMetrics(res.metrics);
        }
      } catch (err) {
        console.warn('Dashboard metrics fetch error:', err);
      } finally {
        setLoading(false);
      }
    }
    loadMetrics();
  }, []);

  const totalLeads = metrics.newLeads + metrics.qualifiedLeads + metrics.proposalsSent + metrics.wonLeads + metrics.closedLeads;
  const winRate = totalLeads > 0 ? Math.round((metrics.wonLeads / totalLeads) * 100) : 0;

  return (
    <div>
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Client-Acquisition & CMS Dashboard</h1>
          <p className="admin-page-subtitle">Welcome back! Monitor incoming lead enquiries, pipeline conversion rates, and website content.</p>
        </div>
      </div>

      {/* Primary Pipeline Metric Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))', gap: '16px', marginBottom: '32px' }}>
        <div className="admin-card" style={{ marginBottom: 0, background: 'linear-gradient(135deg, #0F172A 0%, rgba(56, 189, 248, 0.1) 100%)', borderColor: 'rgba(56, 189, 248, 0.3)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
            <span style={{ fontSize: '0.8rem', color: '#94A3B8', fontWeight: '600' }}>New Enquiries</span>
            <Inbox size={18} style={{ color: '#38BDF8' }} />
          </div>
          <div style={{ fontSize: '1.8rem', fontWeight: '800', color: '#FFFFFF' }}>{metrics.newLeads}</div>
        </div>

        <div className="admin-card" style={{ marginBottom: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
            <span style={{ fontSize: '0.8rem', color: '#94A3B8', fontWeight: '600' }}>Qualified Leads</span>
            <Users size={18} style={{ color: '#A78BFA' }} />
          </div>
          <div style={{ fontSize: '1.8rem', fontWeight: '800', color: '#FFFFFF' }}>{metrics.qualifiedLeads}</div>
        </div>

        <div className="admin-card" style={{ marginBottom: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
            <span style={{ fontSize: '0.8rem', color: '#94A3B8', fontWeight: '600' }}>Pending Follow-ups</span>
            <Clock size={18} style={{ color: metrics.pendingFollowups > 0 ? '#F59E0B' : '#10B981' }} />
          </div>
          <div style={{ fontSize: '1.8rem', fontWeight: '800', color: metrics.pendingFollowups > 0 ? '#F59E0B' : '#FFFFFF' }}>
            {metrics.pendingFollowups}
          </div>
        </div>

        <div className="admin-card" style={{ marginBottom: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
            <span style={{ fontSize: '0.8rem', color: '#94A3B8', fontWeight: '600' }}>Won Clients</span>
            <Award size={18} style={{ color: '#10B981' }} />
          </div>
          <div style={{ fontSize: '1.8rem', fontWeight: '800', color: '#10B981' }}>{metrics.wonLeads}</div>
        </div>

        <div className="admin-card" style={{ marginBottom: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
            <span style={{ fontSize: '0.8rem', color: '#94A3B8', fontWeight: '600' }}>Conversion Win Rate</span>
            <TrendingUp size={18} style={{ color: '#38BDF8' }} />
          </div>
          <div style={{ fontSize: '1.8rem', fontWeight: '800', color: '#FFFFFF' }}>{winRate}%</div>
        </div>
      </div>

      {/* Breakdown Charts & Recent Enquiries */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px', marginBottom: '36px' }}>
        {/* Enquiries by Service Breakdown (Pure CSS Bar Chart) */}
        <div className="admin-card" style={{ marginBottom: 0 }}>
          <h2 style={{ fontSize: '1.1rem', fontWeight: '700', color: '#FFFFFF', marginBottom: '16px' }}>
            Enquiries by Service Offering
          </h2>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {metrics.serviceBreakdown.length === 0 ? (
              <p style={{ color: '#94A3B8', fontSize: '0.85rem' }}>No lead service metrics logged yet.</p>
            ) : (
              metrics.serviceBreakdown.map((item, idx) => {
                const maxCount = Math.max(...metrics.serviceBreakdown.map(s => s.lead_count), 1);
                const percent = Math.round((item.lead_count / maxCount) * 100);

                return (
                  <div key={idx}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.825rem', color: '#CBD5E1', marginBottom: '4px' }}>
                      <span>{item.service_name}</span>
                      <strong style={{ color: '#38BDF8' }}>{item.lead_count}</strong>
                    </div>
                    <div style={{ background: '#070B14', borderRadius: '4px', height: '8px', overflow: 'hidden' }}>
                      <div
                        style={{
                          width: `${percent}%`,
                          height: '100%',
                          background: 'linear-gradient(90deg, #0EA5E9 0%, #10B981 100%)',
                          borderRadius: '4px',
                          transition: 'width 0.3s ease'
                        }}
                      />
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Recent Enquiries Table Snippet */}
        <div className="admin-card" style={{ marginBottom: 0 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <h2 style={{ fontSize: '1.1rem', fontWeight: '700', color: '#FFFFFF', margin: 0 }}>
              Recent Client Enquiries
            </h2>
            <Link to="/admin/leads" style={{ fontSize: '0.85rem', color: '#38BDF8', textDecoration: 'none' }}>
              View Pipeline ➔
            </Link>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {metrics.recentLeads.length === 0 ? (
              <p style={{ color: '#94A3B8', fontSize: '0.85rem' }}>No recent enquiries received.</p>
            ) : (
              metrics.recentLeads.map((lead) => (
                <div key={lead.id} style={{ background: '#070B14', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '8px', padding: '10px 14px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <div style={{ fontSize: '0.9rem', color: '#F8FAFC', fontWeight: '600' }}>{lead.name}</div>
                    <div style={{ fontSize: '0.775rem', color: '#94A3B8' }}>{lead.required_service || 'Consultation'} • {lead.email}</div>
                  </div>
                  <span style={{ fontSize: '0.7rem', background: 'rgba(56, 189, 248, 0.15)', color: '#38BDF8', padding: '3px 8px', borderRadius: '9999px', fontWeight: '700' }}>
                    {(lead.status || 'new').toUpperCase()}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Quick Actions Grid */}
      <h2 style={{ fontSize: '1.1rem', fontWeight: '700', color: '#FFFFFF', marginBottom: '16px' }}>CMS Quick Management Hub</h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '16px' }}>
        <Link to="/admin/leads" className="admin-card" style={{ textDecoration: 'none', display: 'flex', alignItems: 'flex-start', gap: '14px', marginBottom: 0 }}>
          <div style={{ padding: '10px', borderRadius: '8px', background: 'rgba(56, 189, 248, 0.1)', color: '#38BDF8' }}>
            <Inbox size={20} />
          </div>
          <div>
            <h3 style={{ fontSize: '1rem', color: '#FFFFFF', marginBottom: '2px' }}>Lead Management Pipeline</h3>
            <p style={{ fontSize: '0.8rem', color: '#94A3B8', margin: 0 }}>Qualify leads, update deal stages, and add internal notes.</p>
          </div>
        </Link>

        <Link to="/admin/services" className="admin-card" style={{ textDecoration: 'none', display: 'flex', alignItems: 'flex-start', gap: '14px', marginBottom: 0 }}>
          <div style={{ padding: '10px', borderRadius: '8px', background: 'rgba(96, 165, 250, 0.15)', color: '#60A5FA' }}>
            <Server size={20} />
          </div>
          <div>
            <h3 style={{ fontSize: '1rem', color: '#FFFFFF', marginBottom: '2px' }}>Services Manager</h3>
            <p style={{ fontSize: '0.8rem', color: '#94A3B8', margin: 0 }}>Add and edit service scope, problem solved, and deliverables.</p>
          </div>
        </Link>

        <Link to="/admin/projects" className="admin-card" style={{ textDecoration: 'none', display: 'flex', alignItems: 'flex-start', gap: '14px', marginBottom: 0 }}>
          <div style={{ padding: '10px', borderRadius: '8px', background: 'rgba(16, 185, 129, 0.15)', color: '#10B981' }}>
            <FolderKanban size={20} />
          </div>
          <div>
            <h3 style={{ fontSize: '1rem', color: '#FFFFFF', marginBottom: '2px' }}>Case Studies Manager</h3>
            <p style={{ fontSize: '0.8rem', color: '#94A3B8', margin: 0 }}>Publish technical case studies with challenges and solutions.</p>
          </div>
        </Link>
      </div>
    </div>
  );
}
