import React from 'react';
import { Building2, Rocket, Users, Wrench, CheckCircle2, ArrowRight } from 'lucide-react';

export default function SolutionsSection({ onOpenConsultation }) {
  const solutions = [
    {
      id: 'small-business',
      icon: Building2,
      clientType: 'Small Business IT Support',
      tagline: 'Reliable, cost-effective server and website management for growing local & international businesses.',
      commonProblems: [
        'Lack of in-house sysadmin or dedicated technical team.',
        'Fear of website downtime or security breaches during business hours.',
        'Slow server speeds and outdated website software.'
      ],
      approach: 'We serve as your fractional IT and Linux sysadmin team, maintaining server health, managing SSL security, and handling system errors.',
      deliverables: [
        '24/7 Uptime & Log Monitoring',
        'Daily Encrypted Data Backups',
        'Nginx & Server OS Maintenance',
        'Direct Priority Support'
      ]
    },
    {
      id: 'startups',
      icon: Rocket,
      clientType: 'Startup Infrastructure Setup',
      tagline: 'Scalable cloud infrastructure, deployment pipelines, and database architecture built right from day one.',
      commonProblems: [
        'High cloud hosting bills due to unoptimized cloud sizing.',
        'Manual deployment bottlenecks delaying product launches.',
        'Security vulnerabilities in early application builds.'
      ],
      approach: 'We design lean cloud server environments on AWS, DigitalOcean, or Hetzner with automated deployment pipelines and strict security groups.',
      deliverables: [
        'Cloud Server & Container Architecture',
        'Git-based CI/CD Automated Deployments',
        'SSL Certificate & Domain Routing',
        'Infrastructure Cost Optimization Audit'
      ]
    },
    {
      id: 'agencies',
      icon: Users,
      clientType: 'Agency Technical Support / White-Label Support',
      tagline: 'Dependable backend, Linux, and hosting execution for web design and marketing agencies.',
      commonProblems: [
        'Agencies losing design time to server setup and 502 web errors.',
        'Client websites breaking after server updates or domain transfers.',
        'Need for discreet technical execution without hiring full-time devs.'
      ],
      approach: 'We partner with agencies to handle all server hosting, SSL setup, Nginx configuration, and technical troubleshooting behind the scenes.',
      deliverables: [
        'White-Label Server Configuration',
        'Multi-Site Hosting Migration',
        'Emergency Client Outage Remediation',
        'Performance & Speed Optimization'
      ]
    },
    {
      id: 'freelance-one-time',
      icon: Wrench,
      clientType: 'Freelance & One-Time Troubleshooting',
      tagline: 'Targeted single-project fixes for emergency server errors, domain issues, and web deployment roadblocks.',
      commonProblems: [
        'Broken SSL certificates or HTTPS warnings.',
        '502 Bad Gateway / 504 Timeout errors on Nginx.',
        'Stuck database queries or server access issues.'
      ],
      approach: 'Fast, fixed-scope troubleshooting. We diagnose root causes through log inspection, implement permanent fixes, and document what was repaired.',
      deliverables: [
        'Root-Cause Log Diagnostics',
        'Immediate Bug & Error Fix',
        'Server Hardening & Prevention Audit',
        'Clear Post-Fix Summary Report'
      ]
    }
  ];

  return (
    <section className="section solutions-section" id="solutions" style={{ paddingTop: '90px', paddingBottom: '80px' }}>
      <div className="container">
        <div className="section-header text-center">
          <span className="eyebrow">SOLUTIONS BY CLIENT TYPE</span>
          <h2 className="section-title">Tailored IT & Web Services for Your Business Model</h2>
          <p className="section-subtitle">
            Whether you are a growing small business, a fast-moving startup, a web agency, or an individual client needing immediate technical assistance.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '32px', marginTop: '48px' }}>
          {solutions.map((sol) => {
            const IconComp = sol.icon;
            return (
              <div key={sol.id} className="card solution-card" style={{ background: '#0F172A', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '18px', padding: '32px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <div>
                  <div style={{ display: 'inline-flex', padding: '14px', borderRadius: '12px', background: 'rgba(56, 189, 248, 0.1)', color: '#38BDF8', marginBottom: '20px' }}>
                    <IconComp size={28} />
                  </div>

                  <h3 style={{ fontSize: '1.35rem', color: '#F8FAFC', fontWeight: '700', marginBottom: '10px' }}>
                    {sol.clientType}
                  </h3>

                  <p style={{ fontSize: '0.95rem', color: '#CBD5E1', lineHeight: '1.6', marginBottom: '24px' }}>
                    {sol.tagline}
                  </p>

                  <div style={{ marginBottom: '20px' }}>
                    <h4 style={{ fontSize: '0.85rem', color: '#F59E0B', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: '700', marginBottom: '10px' }}>
                      Common Problems We Solve
                    </h4>
                    <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      {sol.commonProblems.map((prob, i) => (
                        <li key={i} style={{ fontSize: '0.875rem', color: '#94A3B8', lineHeight: '1.5', position: 'relative', paddingLeft: '16px' }}>
                          <span style={{ position: 'absolute', left: 0, top: '6px', width: '6px', height: '6px', borderRadius: '50%', background: '#EF4444' }}></span>
                          {prob}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div style={{ marginBottom: '24px' }}>
                    <h4 style={{ fontSize: '0.85rem', color: '#38BDF8', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: '700', marginBottom: '10px' }}>
                      Serenova Tech Approach & Deliverables
                    </h4>
                    <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      {sol.deliverables.map((del, i) => (
                        <li key={i} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.875rem', color: '#CBD5E1' }}>
                          <CheckCircle2 size={16} style={{ color: '#10B981', flexShrink: 0 }} />
                          <span>{del}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <button
                  className="btn btn-primary"
                  style={{ width: '100%', justifyContent: 'center' }}
                  onClick={() => onOpenConsultation && onOpenConsultation(sol.clientType)}
                >
                  <span>Discuss {sol.clientType} Solution</span>
                  <ArrowRight size={16} />
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
