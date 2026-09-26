import React from 'react';
import { X, CheckCircle, ArrowRight } from 'lucide-react';

export default function ServiceModal({ service, onClose, onOpenConsultation }) {
  if (!service) return null;

  return (
    <div className="modal-overlay" onClick={onClose} role="dialog" aria-modal="true" aria-labelledby="service-modal-title">
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose} aria-label="Close modal">
          <X size={20} />
        </button>

        <span className="eyebrow">SERVICE DETAILS</span>
        <h3 id="service-modal-title" style={{ fontSize: '1.75rem', marginBottom: '1rem', color: '#FFFFFF' }}>
          {service.title}
        </h3>

        <p style={{ color: '#94A3B8', fontSize: '1rem', lineHeight: '1.6', marginBottom: '1.5rem' }}>
          {service.fullDesc}
        </p>

        <h4 style={{ color: '#F8FAFC', marginBottom: '0.75rem', fontSize: '1.1rem' }}>Key Capabilities & Deliverables:</h4>
        <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '1.5rem' }}>
          {service.features.map((feature, idx) => (
            <li key={idx} style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#CBD5E1', fontSize: '0.95rem' }}>
              <CheckCircle size={18} style={{ color: '#38BDF8', flexShrink: 0 }} />
              <span>{feature}</span>
            </li>
          ))}
        </ul>

        {service.techStack && service.techStack.length > 0 && (
          <div style={{ marginBottom: '2rem' }}>
            <h4 style={{ color: '#F8FAFC', marginBottom: '0.5rem', fontSize: '0.95rem' }}>Technologies Used:</h4>
            <div className="tech-pills">
              {service.techStack.map((tech, i) => (
                <span key={i} className="tech-pill" style={{ background: 'rgba(56,189,248,0.12)', color: '#38BDF8', borderColor: 'rgba(56,189,248,0.3)' }}>
                  {tech}
                </span>
              ))}
            </div>
          </div>
        )}

        <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
          <button className="btn btn-secondary" onClick={onClose}>
            Close
          </button>
          <button 
            className="btn btn-primary"
            onClick={() => {
              onClose();
              onOpenConsultation();
            }}
          >
            <span>Request Quotation</span>
            <ArrowRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
