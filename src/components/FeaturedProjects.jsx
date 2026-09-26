import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { projectsData } from '../data/projectsData';
import { api } from '../admin/services/api';
import { ArrowRight, Building, Calendar } from 'lucide-react';

export default function FeaturedProjects({ onOpenConsultation }) {
  const [projects, setProjects] = useState(projectsData);

  useEffect(() => {
    async function loadPublicProjects() {
      try {
        const res = await api.getPublicProjects();
        if (res && res.success && res.projects && res.projects.length > 0) {
          setProjects(res.projects);
        }
      } catch (e) {
        console.warn('Public projects fetch fallback:', e.message);
      }
    }
    loadPublicProjects();
  }, []);

  return (
    <section id="projects" className="section projects-section" style={{ paddingTop: '80px', paddingBottom: '80px' }}>
      <div className="container">
        {/* Section Header */}
        <div className="section-header text-center">
          <span className="eyebrow">CASE STUDIES & RECENT WORK</span>
          <h2 className="section-title">Verified Technical Implementations</h2>
          <p className="section-subtitle">
            Real IT infrastructure, server migration, and web engineering outcomes achieved for our clients.
          </p>
        </div>

        {/* Case Studies Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '28px', marginTop: '40px' }}>
          {projects.map((proj) => {
            const slug = proj.slug || proj.id;
            const clientType = proj.clientType || proj.client_type || 'Commercial Client';

            return (
              <div key={proj.id || slug} className="card project-card" style={{ background: '#0F172A', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '16px', padding: '28px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '14px' }}>
                    <span style={{ fontSize: '0.75rem', background: 'rgba(56, 189, 248, 0.1)', color: '#38BDF8', padding: '4px 10px', borderRadius: '9999px', fontWeight: '600' }}>
                      {proj.category || 'IT Solution'}
                    </span>
                    {clientType && (
                      <span style={{ fontSize: '0.75rem', background: 'rgba(255, 255, 255, 0.05)', color: '#94A3B8', padding: '4px 10px', borderRadius: '9999px' }}>
                        {clientType}
                      </span>
                    )}
                  </div>

                  <h3 style={{ fontSize: '1.2rem', color: '#F8FAFC', fontWeight: '700', marginBottom: '12px', lineHeight: '1.3' }}>
                    {proj.title}
                  </h3>

                  <p style={{ fontSize: '0.9rem', color: '#94A3B8', lineHeight: '1.6', marginBottom: '20px' }}>
                    {proj.summary || proj.description}
                  </p>
                </div>

                <div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '20px' }}>
                    {(proj.techStack || proj.tech_stack || []).slice(0, 4).map((tech, i) => (
                      <span key={i} style={{ fontSize: '0.75rem', background: 'rgba(255,255,255,0.06)', color: '#CBD5E1', padding: '4px 8px', borderRadius: '6px' }}>
                        {tech}
                      </span>
                    ))}
                  </div>

                  <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                    <Link
                      to={`/projects/${slug}`}
                      className="btn btn-outline btn-sm"
                      style={{ flex: 1, textAlign: 'center', textDecoration: 'none' }}
                    >
                      <span>Read Case Study</span>
                      <ArrowRight size={14} />
                    </Link>

                    <button
                      className="btn btn-primary btn-sm"
                      onClick={() => onOpenConsultation && onOpenConsultation(`Discuss project similar to ${proj.title}`)}
                    >
                      <span>Discuss Project</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
