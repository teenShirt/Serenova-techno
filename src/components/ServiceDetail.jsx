import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { api } from '../admin/services/api';
import { servicesData } from '../data/servicesData';
import { 
  Server, 
  Globe, 
  ShieldCheck, 
  Network, 
  Rocket, 
  Activity, 
  Cloud,
  Monitor,
  Code2,
  ArrowLeft,
  CheckCircle2,
  HelpCircle,
  MessageSquare,
  ChevronRight
} from 'lucide-react';

const iconMap = {
  Server,
  Globe,
  ShieldCheck,
  Network,
  Rocket,
  Activity,
  Cloud,
  Monitor,
  Code2
};

export default function ServiceDetail({ onOpenConsultation }) {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [service, setService] = useState(null);
  const [loading, setLoading] = useState(true);
  const [allServices, setAllServices] = useState(servicesData);

  useEffect(() => {
    async function loadService() {
      setLoading(true);
      try {
        const res = await api.getPublicServiceBySlug(slug);
        if (res && res.success && res.service) {
          setService(res.service);
        } else {
          const match = servicesData.find(s => s.slug === slug || s.id === slug);
          setService(match || servicesData[0]);
        }
      } catch (e) {
        const match = servicesData.find(s => s.slug === slug || s.id === slug);
        setService(match || servicesData[0]);
      } finally {
        setLoading(false);
      }
    }

    async function loadAllServices() {
      try {
        const res = await api.getPublicServices();
        if (res && res.success && res.services && res.services.length > 0) {
          setAllServices(res.services);
        }
      } catch (e) {
        setAllServices(servicesData);
      }
    }

    loadService();
    loadAllServices();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [slug]);

  if (loading) {
    return (
      <div className="container" style={{ padding: '120px 20px', textAlign: 'center', color: '#94A3B8' }}>
        <p>Loading service details...</p>
      </div>
    );
  }

  if (!service) {
    return (
      <div className="container" style={{ padding: '120px 20px', textAlign: 'center' }}>
        <h2 style={{ color: '#F8FAFC', marginBottom: '16px' }}>Service Not Found</h2>
        <p style={{ color: '#94A3B8', marginBottom: '24px' }}>The service offering you requested could not be located.</p>
        <Link to="/services" className="btn btn-primary">
          <ArrowLeft size={16} />
          <span>Back to All Services</span>
        </Link>
      </div>
    );
  }

  const IconComponent = iconMap[service.icon_name || service.iconName] || Server;
  const deliverables = service.deliverables || service.features || [];
  const techStack = service.techStack || service.tech_stack || [];
  const problemSolved = service.problem_solved || service.problemSolved;
  const idealCustomer = service.ideal_customer || service.idealCustomer;
  const startingPrice = service.starting_price || service.startingPrice;

  const relatedServices = allServices.filter(s => (s.slug || s.id) !== (service.slug || service.id)).slice(0, 3);

  return (
    <div className="service-detail-page" style={{ paddingTop: '100px', paddingBottom: '80px' }}>
      <div className="container">
        {/* Breadcrumb Navigation */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.875rem', color: '#94A3B8', marginBottom: '32px' }}>
          <Link to="/" style={{ color: '#94A3B8', textDecoration: 'none' }}>Home</Link>
          <ChevronRight size={14} />
          <Link to="/services" style={{ color: '#94A3B8', textDecoration: 'none' }}>Services</Link>
          <ChevronRight size={14} />
          <span style={{ color: '#38BDF8', fontWeight: '600' }}>{service.title}</span>
        </div>

        {/* Hero Banner for Service */}
        <div style={{ background: '#0F172A', border: '1px solid rgba(255, 255, 255, 0.1)', borderRadius: '20px', padding: '36px', marginBottom: '40px' }}>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '24px', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ maxWidth: '720px' }}>
              <span className="eyebrow" style={{ color: '#38BDF8' }}>{service.category || 'TECHNICAL SERVICE'}</span>
              <h1 style={{ fontSize: 'clamp(1.8rem, 4vw, 2.8rem)', color: '#F8FAFC', fontWeight: '800', lineHeight: '1.2', marginTop: '8px', marginBottom: '16px' }}>
                {service.title}
              </h1>
              <p style={{ fontSize: '1.1rem', color: '#CBD5E1', lineHeight: '1.65' }}>
                {service.short_desc || service.shortDesc}
              </p>
            </div>

            <div style={{ background: '#070B14', border: '1px solid rgba(56, 189, 248, 0.2)', borderRadius: '16px', padding: '24px', minWidth: '260px', textAlign: 'center' }}>
              {startingPrice && (
                <div style={{ fontSize: '0.9rem', color: '#94A3B8', marginBottom: '6px' }}>
                  Pricing Option
                  <div style={{ fontSize: '1.4rem', color: '#10B981', fontWeight: '800', marginTop: '4px' }}>
                    {startingPrice}
                  </div>
                </div>
              )}
              <button
                className="btn btn-primary"
                style={{ width: '100%', marginTop: '16px', justifyContent: 'center' }}
                onClick={() => onOpenConsultation && onOpenConsultation(service.title)}
              >
                <MessageSquare size={16} />
                <span>Request a Consultation</span>
              </button>
            </div>
          </div>
        </div>

        {/* Detail Grid Content */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '32px', marginBottom: '60px' }}>
          {/* Main Description & Deliverables */}
          <div style={{ background: '#0F172A', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '16px', padding: '32px' }}>
            <h2 style={{ fontSize: '1.35rem', color: '#FFFFFF', fontWeight: '700', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <IconComponent size={22} style={{ color: '#38BDF8' }} />
              <span>Service Scope & Included Deliverables</span>
            </h2>

            <p style={{ fontSize: '0.975rem', color: '#CBD5E1', lineHeight: '1.7', marginBottom: '28px', whiteSpace: 'pre-line' }}>
              {service.full_desc || service.fullDesc || service.short_desc}
            </p>

            <h3 style={{ fontSize: '1.1rem', color: '#FFFFFF', fontWeight: '700', marginBottom: '16px' }}>Key Deliverables</h3>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {deliverables.map((item, idx) => (
                <li key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', fontSize: '0.95rem', color: '#94A3B8' }}>
                  <CheckCircle2 size={18} style={{ color: '#10B981', flexShrink: 0, marginTop: '2px' }} />
                  <span>{typeof item === 'string' ? item : item.title || item.name}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Problem Solved & Target Client */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            {problemSolved && (
              <div style={{ background: '#0F172A', border: '1px solid rgba(239, 68, 68, 0.2)', borderRadius: '16px', padding: '24px' }}>
                <h3 style={{ fontSize: '1.1rem', color: '#F8FAFC', fontWeight: '700', marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <HelpCircle size={18} style={{ color: '#F59E0B' }} />
                  <span>What Problem This Solves</span>
                </h3>
                <p style={{ fontSize: '0.925rem', color: '#94A3B8', lineHeight: '1.6', margin: 0 }}>
                  {problemSolved}
                </p>
              </div>
            )}

            {idealCustomer && (
              <div style={{ background: '#0F172A', border: '1px solid rgba(56, 189, 248, 0.2)', borderRadius: '16px', padding: '24px' }}>
                <h3 style={{ fontSize: '1.1rem', color: '#F8FAFC', fontWeight: '700', marginBottom: '10px' }}>
                  Ideal Customer Profile
                </h3>
                <p style={{ fontSize: '0.925rem', color: '#94A3B8', lineHeight: '1.6', margin: 0 }}>
                  {idealCustomer}
                </p>
              </div>
            )}

            {techStack.length > 0 && (
              <div style={{ background: '#0F172A', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '16px', padding: '24px' }}>
                <h3 style={{ fontSize: '1.1rem', color: '#F8FAFC', fontWeight: '700', marginBottom: '12px' }}>
                  Technologies & Tools
                </h3>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                  {techStack.map((tech, i) => (
                    <span key={i} style={{ fontSize: '0.8rem', background: 'rgba(56, 189, 248, 0.1)', color: '#38BDF8', border: '1px solid rgba(56, 189, 248, 0.2)', padding: '4px 10px', borderRadius: '6px' }}>
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Related Services */}
        {relatedServices.length > 0 && (
          <div>
            <h3 style={{ fontSize: '1.35rem', color: '#FFFFFF', fontWeight: '700', marginBottom: '20px' }}>Related Services</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
              {relatedServices.map((rel) => (
                <Link
                  key={rel.id || rel.slug}
                  to={`/services/${rel.slug || rel.id}`}
                  style={{ textDecoration: 'none', background: '#0F172A', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '14px', padding: '20px', display: 'block', transition: 'border-color 0.2s ease' }}
                >
                  <h4 style={{ color: '#F8FAFC', fontSize: '1.05rem', fontWeight: '700', marginBottom: '8px' }}>{rel.title}</h4>
                  <p style={{ color: '#94A3B8', fontSize: '0.85rem', lineHeight: '1.5', margin: 0 }}>{rel.short_desc || rel.shortDesc}</p>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
