import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { servicesData } from '../data/servicesData';
import { api } from '../admin/services/api';
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
  ArrowRight,
  MessageSquare,
  CheckCircle2
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

export default function Services({ onOpenConsultation }) {
  const [services, setServices] = useState(servicesData);
  const navigate = useNavigate();

  useEffect(() => {
    async function loadPublicServices() {
      try {
        const res = await api.getPublicServices();
        if (res && res.success && res.services && res.services.length > 0) {
          setServices(res.services);
        }
      } catch (e) {
        console.warn('Public services fetch fallback:', e.message);
      }
    }
    loadPublicServices();
  }, []);

  return (
    <section id="services" className="section services-section">
      <div className="container">
        {/* Section Header */}
        <div className="section-header text-center">
          <span className="eyebrow">OUR CORE SERVICES</span>
          <h2 className="section-title">Practical Technical Services Built for Reliability</h2>
          <p className="section-subtitle">
            From Linux server maintenance and Nginx troubleshooting to custom web application development and cloud setup.
          </p>
        </div>

        {/* Services Grid */}
        <div className="services-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px', marginTop: '40px' }}>
          {services.map((service) => {
            const IconComponent = iconMap[service.icon_name || service.iconName] || Server;
            const slug = service.slug || service.id;
            const startingPrice = service.starting_price || service.startingPrice;
            const problemSolved = service.problem_solved || service.problemSolved;

            return (
              <div key={service.id || slug} className="service-card" style={{ background: '#0F172A', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '16px', padding: '28px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                    <div className="service-icon-box" style={{ padding: '12px', background: 'rgba(56, 189, 248, 0.1)', color: '#38BDF8', borderRadius: '12px' }}>
                      <IconComponent size={26} />
                    </div>
                    {startingPrice && (
                      <span style={{ fontSize: '0.8rem', background: 'rgba(16, 185, 129, 0.1)', color: '#10B981', padding: '4px 10px', borderRadius: '9999px', fontWeight: '600' }}>
                        {startingPrice}
                      </span>
                    )}
                  </div>

                  <h3 className="service-title" style={{ fontSize: '1.25rem', color: '#F8FAFC', fontWeight: '700', marginBottom: '10px' }}>
                    {service.title}
                  </h3>

                  <p className="service-desc" style={{ fontSize: '0.925rem', color: '#94A3B8', lineHeight: '1.6', marginBottom: '16px' }}>
                    {service.short_desc || service.shortDesc}
                  </p>

                  {problemSolved && (
                    <div style={{ background: 'rgba(255, 255, 255, 0.03)', borderLeft: '3px solid #38BDF8', padding: '10px 12px', borderRadius: '0 8px 8px 0', fontSize: '0.85rem', color: '#CBD5E1', marginBottom: '20px' }}>
                      <strong style={{ color: '#F8FAFC' }}>Solves:</strong> {problemSolved}
                    </div>
                  )}
                </div>

                <div>
                  <div className="tech-pills" style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '20px' }}>
                    {(service.techStack || service.tech_stack || []).slice(0, 4).map((tech, i) => (
                      <span key={i} className="tech-pill" style={{ fontSize: '0.75rem', background: 'rgba(255,255,255,0.06)', color: '#94A3B8', padding: '4px 8px', borderRadius: '6px' }}>
                        {tech}
                      </span>
                    ))}
                  </div>

                  <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                    <Link
                      to={`/services/${slug}`}
                      className="btn btn-outline btn-sm"
                      style={{ flex: 1, textAlign: 'center', textDecoration: 'none' }}
                    >
                      <span>View Details</span>
                      <ArrowRight size={14} />
                    </Link>

                    <button
                      className="btn btn-primary btn-sm"
                      onClick={onOpenConsultation}
                      aria-label={`Request quote for ${service.title}`}
                    >
                      <span>Request Quote</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Section Bottom CTA Banner */}
        <div className="services-cta-banner" style={{ marginTop: '48px', padding: '32px', background: 'linear-gradient(135deg, #0F172A 0%, #1E293B 100%)', border: '1px solid rgba(56, 189, 248, 0.2)', borderRadius: '16px', display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '20px' }}>
          <div>
            <h3 style={{ fontSize: '1.25rem', color: '#FFFFFF', fontWeight: '700', marginBottom: '6px' }}>Need a customized infrastructure or web project?</h3>
            <p style={{ fontSize: '0.925rem', color: '#94A3B8', margin: 0 }}>We provide custom technical proposals based on your exact server environment.</p>
          </div>
          <div style={{ display: 'flex', gap: '12px' }}>
            <button 
              className="btn btn-primary"
              onClick={onOpenConsultation}
            >
              <MessageSquare size={16} />
              <span>Request a Consultation</span>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
