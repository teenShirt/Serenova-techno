import React from 'react';
import { X, ShieldCheck } from 'lucide-react';
import { companyInfo } from '../data/companyInfo';

export default function PolicyModal({ type, onClose }) {
  if (!type) return null;

  const contentMap = {
    privacy: {
      title: "Privacy Policy",
      body: (
        <>
          <p style={{ marginBottom: '1rem' }}>
            At <strong>{companyInfo.name}</strong>, we take the confidentiality and privacy of your data seriously. This Privacy Policy outlines how we collect, handle, and safeguard customer information.
          </p>
          <h4 style={{ color: '#F8FAFC', margin: '1rem 0 0.5rem 0' }}>Data Collection & Usage</h4>
          <p style={{ marginBottom: '1rem' }}>
            We only collect personal information (such as your name, email address, phone number, and project details) that you voluntarily submit through our contact forms or consultation requests. We use this information strictly to provide IT services and support.
          </p>
          <h4 style={{ color: '#F8FAFC', margin: '1rem 0 0.5rem 0' }}>Data Protection & Security</h4>
          <p style={{ marginBottom: '1rem' }}>
            We implement enterprise-grade encryption and access controls to prevent unauthorized access, disclosure, or modification of your data. We do not sell or lease your personal information to third parties.
          </p>
        </>
      )
    },
    terms: {
      title: "Terms & Conditions",
      body: (
        <>
          <p style={{ marginBottom: '1rem' }}>
            Welcome to <strong>{companyInfo.name}</strong>. By accessing our website or engaging our technology services, you agree to comply with the following Terms and Conditions.
          </p>
          <h4 style={{ color: '#F8FAFC', margin: '1rem 0 0.5rem 0' }}>Service Delivery & SLAs</h4>
          <p style={{ marginBottom: '1rem' }}>
            All technical deliverables, server setup milestones, and support SLAs are governed by the executed Master Services Agreement (MSA) signed between {companyInfo.name} and the client.
          </p>
          <h4 style={{ color: '#F8FAFC', margin: '1rem 0 0.5rem 0' }}>Intellectual Property</h4>
          <p style={{ marginBottom: '1rem' }}>
            All custom source code, documentation, and network architecture built specifically for a client upon full payment belong exclusively to the client.
          </p>
        </>
      )
    },
    cookie: {
      title: "Cookie Policy",
      body: (
        <>
          <p style={{ marginBottom: '1rem' }}>
            <strong>{companyInfo.name}</strong> uses essential functional cookies to optimize site performance, remember user navigation preferences, and ensure seamless interaction with our website.
          </p>
          <h4 style={{ color: '#F8FAFC', margin: '1rem 0 0.5rem 0' }}>Essential Cookies</h4>
          <p style={{ marginBottom: '1rem' }}>
            These cookies are necessary for website security, session persistence, and accessibility features. You may disable cookies in your browser settings, though certain site interactions may be affected.
          </p>
        </>
      )
    }
  };

  const policy = contentMap[type] || contentMap.privacy;

  return (
    <div className="modal-overlay" onClick={onClose} role="dialog" aria-modal="true">
      <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '600px' }}>
        <button className="modal-close" onClick={onClose} aria-label="Close modal">
          <X size={20} />
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '0.5rem' }}>
          <ShieldCheck size={20} style={{ color: '#38BDF8' }} />
          <span className="eyebrow" style={{ marginBottom: 0 }}>LEGAL NOTICE</span>
        </div>

        <h3 style={{ fontSize: '1.6rem', color: '#FFFFFF', marginBottom: '1rem' }}>
          {policy.title}
        </h3>

        <div style={{ color: '#94A3B8', fontSize: '0.95rem', lineHeight: '1.6' }}>
          {policy.body}
        </div>

        <div style={{ marginTop: '2rem', textAlign: 'right' }}>
          <button className="btn btn-primary" onClick={onClose}>
            I Understand
          </button>
        </div>
      </div>
    </div>
  );
}
