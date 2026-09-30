import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../admin/services/api';
import { companyInfo } from '../data/companyInfo';
import { Send, CheckCircle2, ShieldCheck, Mail, Phone, MessageSquare, AlertCircle } from 'lucide-react';

export default function ContactSection({ showToast, initialService = '' }) {
  const navigate = useNavigate();
  const [loadTime] = useState(Date.now());
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    country: '',
    clientType: 'Small Business',
    requiredService: initialService || 'Linux Server Support',
    budgetRange: 'Flexible / Quote Required',
    urgency: 'Standard (Within 1-2 Weeks)',
    preferredContactMethod: 'Email',
    projectSummary: '',
    consent: true,
    website_url_hp: '' // Honeypot field
  });

  useEffect(() => {
    if (initialService) {
      setFormData(prev => ({ ...prev, requiredService: initialService }));
    }
  }, [initialService]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!formData.name || !formData.email || !formData.projectSummary) {
      setError('Please fill in your name, email, and project summary.');
      return;
    }

    if (!formData.consent) {
      setError('You must consent to responding to your enquiry.');
      return;
    }

    setLoading(true);
    try {
      const payload = {
        ...formData,
        form_load_time: loadTime
      };

      const res = await api.postPublicContact(payload);
      if (res && res.success) {
        if (showToast) showToast('Enquiry submitted successfully!');
        const refNum = res.referenceNumber || 'ST-202609-SUCCESS';
        navigate(`/confirmation/${refNum}`);
      } else {
        setError(res.message || 'Failed to submit enquiry. Please try again.');
      }
    } catch (err) {
      setError('Network error. Please check your internet connection.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="contact" className="section contact-section" style={{ paddingTop: '80px', paddingBottom: '90px' }}>
      <div className="container">
        <div className="section-header text-center">
          <span className="eyebrow">GET IN TOUCH</span>
          <h2 className="section-title">Request a Qualified Technical Consultation</h2>
          <p className="section-subtitle">
            Tell us about your server, website, or infrastructure needs. We will review your requirements and provide a clear technical proposal.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '40px', marginTop: '40px' }}>
          {/* Form Side */}
          <div style={{ background: '#0F172A', border: '1px solid rgba(255, 255, 255, 0.1)', borderRadius: '20px', padding: '36px' }}>
            {error && (
              <div style={{ background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.3)', color: '#EF4444', padding: '12px 16px', borderRadius: '10px', marginBottom: '24px', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <AlertCircle size={18} />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {/* Hidden Honeypot Field */}
              <input
                type="text"
                name="website_url_hp"
                value={formData.website_url_hp}
                onChange={handleChange}
                style={{ display: 'none' }}
                tabIndex="-1"
                autoComplete="off"
              />

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', color: '#CBD5E1', marginBottom: '6px', fontWeight: '600' }}>
                    Full Name <span style={{ color: '#EF4444' }}>*</span>
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="e.g. Alex Perera"
                    required
                    style={{ width: '100%', padding: '12px 14px', background: '#070B14', border: '1px solid rgba(255,255,255,0.12)', borderRadius: '8px', color: '#F8FAFC', fontSize: '0.95rem' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', color: '#CBD5E1', marginBottom: '6px', fontWeight: '600' }}>
                    Work Email <span style={{ color: '#EF4444' }}>*</span>
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="alex@company.com"
                    required
                    style={{ width: '100%', padding: '12px 14px', background: '#070B14', border: '1px solid rgba(255,255,255,0.12)', borderRadius: '8px', color: '#F8FAFC', fontSize: '0.95rem' }}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', color: '#CBD5E1', marginBottom: '6px', fontWeight: '600' }}>
                    Phone / WhatsApp (Optional)
                  </label>
                  <input
                    type="text"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="+94 77 123 4567"
                    style={{ width: '100%', padding: '12px 14px', background: '#070B14', border: '1px solid rgba(255,255,255,0.12)', borderRadius: '8px', color: '#F8FAFC', fontSize: '0.95rem' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', color: '#CBD5E1', marginBottom: '6px', fontWeight: '600' }}>
                    Company / Organization (Optional)
                  </label>
                  <input
                    type="text"
                    name="company"
                    value={formData.company}
                    onChange={handleChange}
                    placeholder="Company Name"
                    style={{ width: '100%', padding: '12px 14px', background: '#070B14', border: '1px solid rgba(255,255,255,0.12)', borderRadius: '8px', color: '#F8FAFC', fontSize: '0.95rem' }}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', color: '#CBD5E1', marginBottom: '6px', fontWeight: '600' }}>
                    Country
                  </label>
                  <input
                    type="text"
                    name="country"
                    value={formData.country}
                    onChange={handleChange}
                    placeholder="e.g. Sri Lanka, United Kingdom, USA"
                    style={{ width: '100%', padding: '12px 14px', background: '#070B14', border: '1px solid rgba(255,255,255,0.12)', borderRadius: '8px', color: '#F8FAFC', fontSize: '0.95rem' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', color: '#CBD5E1', marginBottom: '6px', fontWeight: '600' }}>
                    Client Type
                  </label>
                  <select
                    name="clientType"
                    value={formData.clientType}
                    onChange={handleChange}
                    style={{ width: '100%', padding: '12px 14px', background: '#070B14', border: '1px solid rgba(255,255,255,0.12)', borderRadius: '8px', color: '#F8FAFC', fontSize: '0.95rem' }}
                  >
                    <option value="Small Business">Small Business</option>
                    <option value="Startup">Startup</option>
                    <option value="Web Agency">Web / Marketing Agency</option>
                    <option value="Freelance / Individual">Freelance / Individual</option>
                  </select>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', color: '#CBD5E1', marginBottom: '6px', fontWeight: '600' }}>
                    Required Service
                  </label>
                  <select
                    name="requiredService"
                    value={formData.requiredService}
                    onChange={handleChange}
                    style={{ width: '100%', padding: '12px 14px', background: '#070B14', border: '1px solid rgba(255,255,255,0.12)', borderRadius: '8px', color: '#F8FAFC', fontSize: '0.95rem' }}
                  >
                    <option value="Linux Server Support">Linux Server Support & Administration</option>
                    <option value="Nginx & Web Hosting Support">Nginx & Web Hosting Support</option>
                    <option value="Website Development">Custom Website Design & Development</option>
                    <option value="Website Deployment & Maintenance">Website Deployment & Maintenance</option>
                    <option value="Cloud Server Setup & Management">Cloud Server Setup & Management</option>
                    <option value="Windows Server & Infrastructure">Windows Server & Infrastructure</option>
                    <option value="Network Setup & Troubleshooting">Network Setup & Troubleshooting</option>
                    <option value="IT Infrastructure Consulting">IT Infrastructure & Security Consulting</option>
                    <option value="General Consultation">General Technical Inquiry</option>
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', color: '#CBD5E1', marginBottom: '6px', fontWeight: '600' }}>
                    Desired Timeline / Urgency
                  </label>
                  <select
                    name="urgency"
                    value={formData.urgency}
                    onChange={handleChange}
                    style={{ width: '100%', padding: '12px 14px', background: '#070B14', border: '1px solid rgba(255,255,255,0.12)', borderRadius: '8px', color: '#F8FAFC', fontSize: '0.95rem' }}
                  >
                    <option value="Immediate / Emergency">Immediate / Emergency Outage</option>
                    <option value="Standard (Within 1-2 Weeks)">Standard (Within 1-2 Weeks)</option>
                    <option value="Planning Phase">Planning Phase / Upcoming Project</option>
                  </select>
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', color: '#CBD5E1', marginBottom: '6px', fontWeight: '600' }}>
                  Project Summary / Technical Details <span style={{ color: '#EF4444' }}>*</span>
                </label>
                <textarea
                  name="projectSummary"
                  rows={4}
                  value={formData.projectSummary}
                  onChange={handleChange}
                  placeholder="Describe your server environment, current problems, website goals, or technical questions..."
                  required
                  style={{ width: '100%', padding: '12px 14px', background: '#070B14', border: '1px solid rgba(255,255,255,0.12)', borderRadius: '8px', color: '#F8FAFC', fontSize: '0.95rem', resize: 'vertical' }}
                />
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <input
                  type="checkbox"
                  id="consent-checkbox"
                  name="consent"
                  checked={formData.consent}
                  onChange={handleChange}
                  style={{ accentColor: '#38BDF8', width: '18px', height: '18px' }}
                />
                <label htmlFor="consent-checkbox" style={{ fontSize: '0.85rem', color: '#CBD5E1' }}>
                  I consent to Serenova Tech processing my information to respond to this technical inquiry.
                </label>
              </div>

              <button
                type="submit"
                className="btn btn-primary btn-lg"
                disabled={loading}
                style={{ justifyContent: 'center', marginTop: '8px' }}
              >
                <Send size={18} />
                <span>{loading ? 'Submitting Request...' : 'Submit Consultation Request'}</span>
              </button>
            </form>
          </div>

          {/* Quick Contact & Info Side */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <div style={{ background: '#0F172A', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '20px', padding: '32px' }}>
              <h3 style={{ fontSize: '1.2rem', color: '#F8FAFC', fontWeight: '700', marginBottom: '16px' }}>
                Direct Contact Channels
              </h3>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '0.95rem', color: '#CBD5E1' }}>
                  <div style={{ padding: '10px', background: 'rgba(56, 189, 248, 0.1)', color: '#38BDF8', borderRadius: '10px' }}>
                    <Mail size={20} />
                  </div>
                  <div>
                    <div style={{ fontSize: '0.75rem', color: '#94A3B8' }}>Email Enquiries</div>
                    <a href={`mailto:${companyInfo.email}`} style={{ color: '#38BDF8', textDecoration: 'none', fontWeight: '600' }}>
                      {companyInfo.email}
                    </a>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '0.95rem', color: '#CBD5E1' }}>
                  <div style={{ padding: '10px', background: 'rgba(16, 185, 129, 0.1)', color: '#10B981', borderRadius: '10px' }}>
                    <Phone size={20} />
                  </div>
                  <div>
                    <div style={{ fontSize: '0.75rem', color: '#94A3B8' }}>Phone / WhatsApp</div>
                    <a href={`tel:${companyInfo.phone}`} target="_blank" rel="noopener noreferrer" style={{ color: '#10B981', textDecoration: 'none', fontWeight: '600' }}>
                      {companyInfo.phone}
                    </a>
                  </div>
                </div>
              </div>
            </div>

            <div style={{ background: '#0F172A', border: '1px solid rgba(56, 189, 248, 0.2)', borderRadius: '20px', padding: '32px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#38BDF8', fontWeight: '700', fontSize: '1.05rem', marginBottom: '12px' }}>
                <ShieldCheck size={22} />
                <span>Enquiry & Data Privacy Commitment</span>
              </div>
              <p style={{ fontSize: '0.875rem', color: '#94A3B8', lineHeight: '1.6', margin: 0 }}>
                Your enquiry details and contact information are used exclusively to assess your technical requirements and respond to your request. We never share or sell client information.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
