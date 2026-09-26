import React from 'react';
import { Server, Globe, ShieldCheck, Cloud, Monitor, Network, Activity } from 'lucide-react';

export default function TrustCapabilities() {
  const capabilities = [
    {
      icon: Server,
      title: 'Linux & Ubuntu Administration',
      desc: 'Ubuntu, Debian, and RHEL server provisioning, SSH access security, sudo policies, and ongoing OS patch management.'
    },
    {
      icon: Globe,
      title: 'Nginx Configuration & Debugging',
      desc: 'Virtual host configuration, reverse proxy routing for Node/Python/Go apps, and FastCGI process pool tuning.'
    },
    {
      icon: ShieldCheck,
      title: 'Website Deployment & SSL Setup',
      desc: 'Zero-downtime deployment pipelines, Let’s Encrypt auto-renewing certificates, HSTS, and HTTP to HTTPS redirection.'
    },
    {
      icon: Cloud,
      title: 'Cloud & Virtual Server Management',
      desc: 'AWS EC2, DigitalOcean Droplets, Hetzner, Linode VPS setup, cloud firewall security groups, and storage volumes.'
    },
    {
      icon: Monitor,
      title: 'Windows Server & Infrastructure Support',
      desc: 'Windows Server administration, IIS web server setup, Active Directory user access control, and PowerShell automation.'
    },
    {
      icon: Network,
      title: 'Network Configuration & VPN Access',
      desc: 'WireGuard and OpenVPN remote access tunnels, TCP/IP subnets, router firewalls, and local network diagnostics.'
    },
    {
      icon: Activity,
      title: 'Monitoring, Backup & Hardening',
      desc: 'Automated daily database backups, log file inspection, uptime monitoring, UFW firewall hardening, and emergency recovery.'
    }
  ];

  return (
    <section className="section bg-card" id="capabilities">
      <div className="container">
        <div className="section-header text-center">
          <span className="eyebrow">OUR TECHNICAL CAPABILITIES</span>
          <h2 className="section-title">Verified Technical Competence & Practice Areas</h2>
          <p className="section-subtitle">
            We focus on practical, hands-on infrastructure and web engineering — delivering clear deliverables without exaggerated claims or hype.
          </p>
        </div>

        <div className="capabilities-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px', marginTop: '40px' }}>
          {capabilities.map((cap, index) => {
            const IconComp = cap.icon;
            return (
              <div key={index} className="card capability-card" style={{ padding: '24px', background: '#0F172A', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '14px', transition: 'transform 0.2s ease, border-color 0.2s ease' }}>
                <div style={{ display: 'inline-flex', padding: '12px', borderRadius: '10px', background: 'rgba(56, 189, 248, 0.1)', color: '#38BDF8', marginBottom: '16px' }}>
                  <IconComp size={24} />
                </div>
                <h3 style={{ fontSize: '1.15rem', color: '#F8FAFC', fontWeight: '700', marginBottom: '10px' }}>{cap.title}</h3>
                <p style={{ fontSize: '0.9rem', color: '#94A3B8', lineHeight: '1.6' }}>{cap.desc}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
