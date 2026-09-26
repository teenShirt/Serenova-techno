import React from 'react';
import { Shield, Server, CheckCircle2, Globe, HeartHandshake, ArrowRight } from 'lucide-react';

export default function AboutUs({ onOpenConsultation }) {
  return (
    <section id="about" className="section about-section" style={{ paddingTop: '80px', paddingBottom: '80px' }}>
      <div className="container">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '48px', alignItems: 'center' }}>
          <div>
            <span className="eyebrow">ABOUT SERENOVA TECH</span>
            <h2 className="section-title" style={{ fontSize: 'clamp(1.8rem, 4vw, 2.5rem)', color: '#F8FAFC', fontWeight: '800', lineHeight: '1.25', marginBottom: '20px' }}>
              Practical Technical Services for Sri Lankan & International Businesses
            </h2>

            <p style={{ fontSize: '1.025rem', color: '#94A3B8', lineHeight: '1.7', marginBottom: '16px' }}>
              Serenova Tech is a dedicated IT consulting and web technology practice. We focus on providing hands-on Linux administration, Nginx web hosting configuration, cloud server management, and custom website development.
            </p>

            <p style={{ fontSize: '0.95rem', color: '#94A3B8', lineHeight: '1.7', marginBottom: '28px' }}>
              We work directly with small business owners, startups, web agencies, and freelance clients across Sri Lanka and internationally — replacing complex technical jargon with clear communication and dependable execution.
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '32px' }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                <CheckCircle2 size={18} style={{ color: '#10B981', flexShrink: 0, marginTop: '3px' }} />
                <span style={{ fontSize: '0.9rem', color: '#CBD5E1' }}>Real Sysadmin & Web Expertise</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                <CheckCircle2 size={18} style={{ color: '#10B981', flexShrink: 0, marginTop: '3px' }} />
                <span style={{ fontSize: '0.9rem', color: '#CBD5E1' }}>No Inflated Marketing Claims</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                <CheckCircle2 size={18} style={{ color: '#10B981', flexShrink: 0, marginTop: '3px' }} />
                <span style={{ fontSize: '0.9rem', color: '#CBD5E1' }}>Secure Access & Hardening</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                <CheckCircle2 size={18} style={{ color: '#10B981', flexShrink: 0, marginTop: '3px' }} />
                <span style={{ fontSize: '0.9rem', color: '#CBD5E1' }}>Direct Remote & Local Support</span>
              </div>
            </div>

            <button
              className="btn btn-primary"
              onClick={onOpenConsultation}
              aria-label="Request a Consultation with Serenova Tech"
            >
              <span>Work With Us</span>
              <ArrowRight size={16} />
            </button>
          </div>

          {/* Side Graphic / Pillar Box */}
          <div style={{ background: '#0F172A', border: '1px solid rgba(255, 255, 255, 0.1)', borderRadius: '20px', padding: '32px' }}>
            <h3 style={{ fontSize: '1.25rem', color: '#FFFFFF', fontWeight: '700', marginBottom: '24px' }}>
              Core Operational Principles
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
                <div style={{ padding: '10px', background: 'rgba(56, 189, 248, 0.1)', color: '#38BDF8', borderRadius: '10px' }}>
                  <Shield size={20} />
                </div>
                <div>
                  <h4 style={{ fontSize: '1rem', color: '#F8FAFC', fontWeight: '600', marginBottom: '4px' }}>Security & Integrity First</h4>
                  <p style={{ fontSize: '0.85rem', color: '#94A3B8', margin: 0, lineHeight: '1.5' }}>All SSH access keys, database passwords, and client credentials are handled with strict privacy protocols.</p>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
                <div style={{ padding: '10px', background: 'rgba(16, 185, 129, 0.1)', color: '#10B981', borderRadius: '10px' }}>
                  <Globe size={20} />
                </div>
                <div>
                  <h4 style={{ fontSize: '1rem', color: '#F8FAFC', fontWeight: '600', marginBottom: '4px' }}>Remote & Local Reach</h4>
                  <p style={{ fontSize: '0.85rem', color: '#94A3B8', margin: 0, lineHeight: '1.5' }}>Providing hands-on support in Sri Lanka and seamless remote server administration globally.</p>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
                <div style={{ padding: '10px', background: 'rgba(96, 165, 250, 0.1)', color: '#60A5FA', borderRadius: '10px' }}>
                  <HeartHandshake size={20} />
                </div>
                <div>
                  <h4 style={{ fontSize: '1rem', color: '#F8FAFC', fontWeight: '600', marginBottom: '4px' }}>Clear Scope & Fair Pricing</h4>
                  <p style={{ fontSize: '0.85rem', color: '#94A3B8', margin: 0, lineHeight: '1.5' }}>Transparent cost quotes based on real project requirements without surprise fees.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
