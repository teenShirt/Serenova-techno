import React from 'react';
import { Link } from 'react-router-dom';
import { companyInfo } from '../data/companyInfo';
import { 
  ArrowUp, 
  Mail, 
  Phone, 
  MapPin, 
  Clock 
} from 'lucide-react';
import { LinkedInIcon, TwitterIcon, GithubIcon, FacebookIcon } from './SocialIcons';

export default function Footer({ onOpenPolicy }) {
  const currentYear = new Date().getFullYear();

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">
          {/* Column 1: Brand */}
          <div className="footer-col">
            <Link 
              to="/" 
              className="logo-brand" 
              onClick={scrollToTop}
              style={{ marginBottom: '1.25rem', display: 'inline-flex' }}
            >
              <img 
                src="/assets/Serenova logo.png" 
                alt={`${companyInfo.name} Logo`} 
                className="logo-img" 
              />
            </Link>

            <p style={{ color: '#94A3B8', fontSize: '0.9rem', lineHeight: '1.6', marginBottom: '1.5rem' }}>
              Reliable Linux server support, Nginx web hosting, cloud management, and modern web application development for growing businesses.
            </p>

            <div style={{ display: 'flex', gap: '10px' }}>
              <a href={companyInfo.socials.linkedin} target="_blank" rel="noreferrer" className="service-icon-box" style={{ width: '36px', height: '36px', marginBottom: 0 }} aria-label="LinkedIn">
                <LinkedInIcon size={16} />
              </a>
              <a href={companyInfo.socials.twitter} target="_blank" rel="noreferrer" className="service-icon-box" style={{ width: '36px', height: '36px', marginBottom: 0 }} aria-label="Twitter">
                <TwitterIcon size={16} />
              </a>
              <a href={companyInfo.socials.github} target="_blank" rel="noreferrer" className="service-icon-box" style={{ width: '36px', height: '36px', marginBottom: 0 }} aria-label="GitHub">
                <GithubIcon size={16} />
              </a>
              <a href={companyInfo.socials.facebook} target="_blank" rel="noreferrer" className="service-icon-box" style={{ width: '36px', height: '36px', marginBottom: 0 }} aria-label="Facebook">
                <FacebookIcon size={16} />
              </a>
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div className="footer-col">
            <h4>Quick Links</h4>
            <ul className="footer-links">
              <li><Link to="/" onClick={scrollToTop}>Home</Link></li>
              <li><Link to="/services">Services</Link></li>
              <li><Link to="/solutions">Solutions</Link></li>
              <li><Link to="/projects">Case Studies</Link></li>
              <li><Link to="/about">About Us</Link></li>
              <li><Link to="/how-we-work">How We Work</Link></li>
              <li><Link to="/faq">FAQ</Link></li>
              <li><Link to="/contact">Contact & Consult</Link></li>
            </ul>
          </div>

          {/* Column 3: Services */}
          <div className="footer-col">
            <h4>Core Offerings</h4>
            <ul className="footer-links">
              <li><Link to="/services/linux-server-support">Linux Server Administration</Link></li>
              <li><Link to="/services/nginx-web-hosting-support">Nginx & Web Hosting</Link></li>
              <li><Link to="/services/website-development">Custom Web Development</Link></li>
              <li><Link to="/services/website-deployment-maintenance">Deployment & Maintenance</Link></li>
              <li><Link to="/services/cloud-server-management">Cloud VPS Management</Link></li>
              <li><Link to="/services/it-infrastructure-consulting">IT Infrastructure Consulting</Link></li>
            </ul>
          </div>

          {/* Column 4: Contact Info */}
          <div className="footer-col">
            <h4>Contact Details</h4>
            <ul className="footer-links" style={{ gap: '12px' }}>
              <li style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#94A3B8', fontSize: '0.85rem' }}>
                <Mail size={16} style={{ color: '#38BDF8', flexShrink: 0 }} />
                <a href={`mailto:${companyInfo.email}`} style={{ color: '#94A3B8', textDecoration: 'none', transition: 'color 0.2s' }}>
                  {companyInfo.email}
                </a>
              </li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#94A3B8', fontSize: '0.85rem' }}>
                <Phone size={16} style={{ color: '#38BDF8', flexShrink: 0 }} />
                <a href={`tel:${companyInfo.phone}`} style={{ color: '#94A3B8', textDecoration: 'none', transition: 'color 0.2s' }}>
                  {companyInfo.phone}
                </a>
              </li>
              <li style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', color: '#94A3B8', fontSize: '0.85rem' }}>
                <MapPin size={16} style={{ color: '#38BDF8', flexShrink: 0, marginTop: '2px' }} />
                <span>{companyInfo.address}</span>
              </li>
              <li style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', color: '#94A3B8', fontSize: '0.85rem' }}>
                <Clock size={16} style={{ color: '#38BDF8', flexShrink: 0, marginTop: '2px' }} />
                <span>{companyInfo.businessHours}</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Footer */}
        <div className="footer-bottom">
          <div>
            © {currentYear} Serenova Tech. All rights reserved. Reliable IT Infrastructure & Web Engineering.
          </div>

          <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
            <button 
              onClick={() => onOpenPolicy('privacy')}
              style={{ color: '#94A3B8', fontSize: '0.85rem' }}
            >
              Privacy Policy
            </button>
            <button 
              onClick={() => onOpenPolicy('terms')}
              style={{ color: '#94A3B8', fontSize: '0.85rem' }}
            >
              Terms & Conditions
            </button>
            <button 
              onClick={() => onOpenPolicy('cookie')}
              style={{ color: '#94A3B8', fontSize: '0.85rem' }}
            >
              Cookie Policy
            </button>

            <button
              className="back-to-top"
              onClick={scrollToTop}
              aria-label="Back to top"
            >
              <span>Back to Top</span>
              <ArrowUp size={16} />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
