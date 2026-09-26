import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { api } from '../admin/services/api';
import { projectsData } from '../data/projectsData';
import { 
  ArrowLeft, 
  ChevronRight, 
  CheckCircle2, 
  Calendar, 
  Building, 
  Tag, 
  MessageSquare,
  AlertCircle
} from 'lucide-react';

export default function ProjectDetail({ onOpenConsultation }) {
  const { slug } = useParams();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadProject() {
      setLoading(true);
      try {
        const res = await api.getPublicProjectBySlug(slug);
        if (res && res.success && res.project) {
          setProject(res.project);
        } else {
          const match = projectsData.find(p => p.slug === slug || String(p.id) === slug);
          setProject(match || projectsData[0]);
        }
      } catch (e) {
        const match = projectsData.find(p => p.slug === slug || String(p.id) === slug);
        setProject(match || projectsData[0]);
      } finally {
        setLoading(false);
      }
    }

    loadProject();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [slug]);

  if (loading) {
    return (
      <div className="container" style={{ padding: '120px 20px', textAlign: 'center', color: '#94A3B8' }}>
        <p>Loading case study...</p>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="container" style={{ padding: '120px 20px', textAlign: 'center' }}>
        <h2 style={{ color: '#F8FAFC', marginBottom: '16px' }}>Case Study Not Found</h2>
        <p style={{ color: '#94A3B8', marginBottom: '24px' }}>The requested case study could not be loaded.</p>
        <Link to="/projects" className="btn btn-primary">
          <ArrowLeft size={16} />
          <span>Back to Case Studies</span>
        </Link>
      </div>
    );
  }

  const techStack = project.techStack || project.tech_stack || [];
  const gallery = project.gallery || [];
  const challenge = project.challenge || project.problem || 'Technical infrastructure complexity requiring optimization.';
  const solution = project.solution || project.summary;
  const result = project.result || 'Achieved zero downtime, improved server response times, and enhanced security hardening.';
  const clientType = project.clientType || project.client_type || 'Commercial Client';

  return (
    <div className="project-detail-page" style={{ paddingTop: '100px', paddingBottom: '80px' }}>
      <div className="container">
        {/* Breadcrumb Navigation */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.875rem', color: '#94A3B8', marginBottom: '32px' }}>
          <Link to="/" style={{ color: '#94A3B8', textDecoration: 'none' }}>Home</Link>
          <ChevronRight size={14} />
          <Link to="/projects" style={{ color: '#94A3B8', textDecoration: 'none' }}>Case Studies</Link>
          <ChevronRight size={14} />
          <span style={{ color: '#38BDF8', fontWeight: '600' }}>{project.title}</span>
        </div>

        {/* Case Study Header Banner */}
        <div style={{ background: '#0F172A', border: '1px solid rgba(255, 255, 255, 0.1)', borderRadius: '20px', padding: '36px', marginBottom: '40px' }}>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', marginBottom: '16px' }}>
            <span style={{ fontSize: '0.8rem', background: 'rgba(56, 189, 248, 0.1)', color: '#38BDF8', border: '1px solid rgba(56, 189, 248, 0.2)', padding: '4px 12px', borderRadius: '9999px', fontWeight: '600' }}>
              {project.category || 'IT Solution'}
            </span>
            {clientType && (
              <span style={{ fontSize: '0.8rem', background: 'rgba(255, 255, 255, 0.06)', color: '#CBD5E1', padding: '4px 12px', borderRadius: '9999px' }}>
                <Building size={12} style={{ display: 'inline', marginRight: '4px' }} />
                {clientType}
              </span>
            )}
            {(project.completionDate || project.completion_date) && (
              <span style={{ fontSize: '0.8rem', background: 'rgba(255, 255, 255, 0.06)', color: '#CBD5E1', padding: '4px 12px', borderRadius: '9999px' }}>
                <Calendar size={12} style={{ display: 'inline', marginRight: '4px' }} />
                {project.completionDate || project.completion_date}
              </span>
            )}
          </div>

          <h1 style={{ fontSize: 'clamp(1.8rem, 4vw, 2.6rem)', color: '#F8FAFC', fontWeight: '800', lineHeight: '1.25', marginBottom: '20px' }}>
            {project.title}
          </h1>

          <p style={{ fontSize: '1.1rem', color: '#94A3B8', lineHeight: '1.65', maxWidth: '800px', marginBottom: '28px' }}>
            {project.summary || project.description}
          </p>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', alignItems: 'center' }}>
            <button
              className="btn btn-primary btn-lg"
              onClick={() => onOpenConsultation && onOpenConsultation(`Case Study: ${project.title}`)}
            >
              <MessageSquare size={18} />
              <span>Discuss a Similar Project</span>
            </button>
          </div>
        </div>

        {/* Challenge, Solution, Result Stack */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '28px', marginBottom: '48px' }}>
          {/* Challenge */}
          <div style={{ background: '#0F172A', border: '1px solid rgba(239, 68, 68, 0.25)', borderRadius: '16px', padding: '28px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#EF4444', fontWeight: '700', fontSize: '1.15rem', marginBottom: '14px' }}>
              <AlertCircle size={22} />
              <span>The Technical Challenge</span>
            </div>
            <p style={{ fontSize: '0.95rem', color: '#CBD5E1', lineHeight: '1.65', margin: 0 }}>
              {challenge}
            </p>
          </div>

          {/* Solution */}
          <div style={{ background: '#0F172A', border: '1px solid rgba(56, 189, 248, 0.25)', borderRadius: '16px', padding: '28px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#38BDF8', fontWeight: '700', fontSize: '1.15rem', marginBottom: '14px' }}>
              <CheckCircle2 size={22} />
              <span>The Serenova Solution</span>
            </div>
            <p style={{ fontSize: '0.95rem', color: '#CBD5E1', lineHeight: '1.65', margin: 0 }}>
              {solution}
            </p>
          </div>

          {/* Result */}
          <div style={{ background: '#0F172A', border: '1px solid rgba(16, 185, 129, 0.25)', borderRadius: '16px', padding: '28px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#10B981', fontWeight: '700', fontSize: '1.15rem', marginBottom: '14px' }}>
              <CheckCircle2 size={22} />
              <span>Measurable Outcome</span>
            </div>
            <p style={{ fontSize: '0.95rem', color: '#CBD5E1', lineHeight: '1.65', margin: 0 }}>
              {result}
            </p>
          </div>
        </div>

        {/* Tech Stack Used */}
        {techStack.length > 0 && (
          <div style={{ background: '#0F172A', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '16px', padding: '28px', marginBottom: '40px' }}>
            <h3 style={{ fontSize: '1.1rem', color: '#F8FAFC', fontWeight: '700', marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Tag size={18} style={{ color: '#38BDF8' }} />
              <span>Technologies & Tools Implemented</span>
            </h3>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
              {techStack.map((tech, idx) => (
                <span key={idx} style={{ fontSize: '0.875rem', background: 'rgba(56, 189, 248, 0.1)', color: '#38BDF8', border: '1px solid rgba(56, 189, 248, 0.2)', padding: '6px 14px', borderRadius: '8px', fontWeight: '500' }}>
                  {tech}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
