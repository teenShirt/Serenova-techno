import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Server, ShieldCheck, Cpu, Terminal, ArrowRight } from 'lucide-react';

export default function Hero({ onOpenConsultation }) {
  const navigate = useNavigate();

  return (
    <section className="hero-section" id="hero">
      <div className="container hero-container">
        <div className="hero-content">
          <div className="hero-badge" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '6px 14px', background: 'rgba(56, 189, 248, 0.1)', border: '1px solid rgba(56, 189, 248, 0.3)', borderRadius: '9999px', fontSize: '0.85rem', color: '#38BDF8', fontWeight: '600', marginBottom: '24px' }}>
            <Terminal size={15} />
            <span>Practical IT Infrastructure & Technical Services</span>
          </div>

          <h1 className="hero-title" style={{ fontSize: 'clamp(2.2rem, 5vw, 3.8rem)', fontWeight: '800', lineHeight: '1.15', color: '#F8FAFC', marginBottom: '20px', letterSpacing: '-0.02em' }}>
            Reliable IT infrastructure, cloud support, and modern websites for growing businesses.
          </h1>

          <p className="hero-subtitle" style={{ fontSize: '1.125rem', color: '#94A3B8', lineHeight: '1.65', maxWidth: '640px', marginBottom: '36px' }}>
            Serenova Tech helps small businesses, Sri Lankan companies, agencies, and startups build, host, secure, troubleshoot, and maintain their digital systems with real hands-on technical expertise.
          </p>

          <div className="hero-actions" style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', alignItems: 'center' }}>
            <button
              className="btn btn-primary btn-lg"
              onClick={onOpenConsultation}
              aria-label="Request a Free Consultation"
            >
              <span>Request a Free Consultation</span>
              <ArrowRight size={18} />
            </button>

            <button
              className="btn btn-secondary btn-lg"
              onClick={() => {
                const el = document.getElementById('services');
                if (el) {
                  el.scrollIntoView({ behavior: 'smooth' });
                } else {
                  navigate('/services');
                }
              }}
              aria-label="Explore Our Services"
            >
              <span>Explore Our Services</span>
            </button>
          </div>

          {/* Quick Capability Markers */}
          <div className="hero-trust-chips" style={{ display: 'flex', flexWrap: 'wrap', gap: '20px', marginTop: '40px', paddingTop: '24px', borderTop: '1px solid rgba(255, 255, 255, 0.08)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.875rem', color: '#CBD5E1' }}>
              <Server size={16} style={{ color: '#38BDF8' }} />
              <span>Linux & Nginx Support</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.875rem', color: '#CBD5E1' }}>
              <ShieldCheck size={16} style={{ color: '#10B981' }} />
              <span>SSL & System Hardening</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.875rem', color: '#CBD5E1' }}>
              <Cpu size={16} style={{ color: '#60A5FA' }} />
              <span>Cloud & Server Setup</span>
            </div>
          </div>
        </div>

        {/* Hero Visual Infrastructure Graphic */}
        <div className="hero-visual" style={{ position: 'relative' }}>
          <div style={{ background: '#0F172A', border: '1px solid rgba(255, 255, 255, 0.12)', borderRadius: '16px', padding: '24px', boxShadow: '0 20px 40px rgba(0,0,0,0.5)', fontFamily: 'monospace', fontSize: '0.85rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingBottom: '12px', borderBottom: '1px solid rgba(255, 255, 255, 0.08)', marginBottom: '16px' }}>
              <div style={{ display: 'flex', gap: '8px' }}>
                <span style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#EF4444' }}></span>
                <span style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#F59E0B' }}></span>
                <span style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#10B981' }}></span>
              </div>
              <span style={{ color: '#64748B', fontSize: '0.75rem' }}>system-status@serenovatech</span>
            </div>

            <div style={{ color: '#10B981', marginBottom: '8px' }}>$ systemctl status nginx serenova-web</div>
            <div style={{ color: '#94A3B8', marginBottom: '12px' }}>● nginx.service - High Performance Web Server & Reverse Proxy</div>
            <div style={{ color: '#94A3B8', marginBottom: '12px' }}>   Loaded: loaded (/etc/systemd/system/nginx.service; enabled)</div>
            <div style={{ color: '#38BDF8', marginBottom: '12px' }}>   Active: active (running) since 2026-09-15 00:00:00 UTC</div>
            <div style={{ color: '#E2E8F0', padding: '10px 14px', background: '#070B14', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.06)' }}>
              <div style={{ color: '#F59E0B' }}>[OK] SSL Certificates Valid (Auto-renew Certbot)</div>
              <div style={{ color: '#10B981' }}>[OK] Firewall Rules (UFW Ports 80, 443, 22 Active)</div>
              <div style={{ color: '#60A5FA' }}>[OK] PM2 Web Cluster: 0 Downtime Deployment Ready</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
