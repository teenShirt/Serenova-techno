import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Menu, X, ArrowRight } from 'lucide-react';
import { companyInfo } from '../data/companyInfo';

export default function Header({ onOpenConsultation }) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    { label: 'Home', path: '/', sectionId: 'hero' },
    { label: 'Services', path: '/services', sectionId: 'services' },
    { label: 'Solutions', path: '/solutions', sectionId: 'solutions' },
    { label: 'Projects', path: '/projects', sectionId: 'projects' },
    { label: 'About', path: '/about', sectionId: 'about' },
    { label: 'How We Work', path: '/how-we-work', sectionId: 'how-we-work' },
    { label: 'FAQ', path: '/faq', sectionId: 'faq' },
    { label: 'Contact', path: '/contact', sectionId: 'contact' }
  ];

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 40);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && mobileMenuOpen) {
        setMobileMenuOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [mobileMenuOpen]);

  // Lock body scroll when mobile menu open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileMenuOpen]);

  const handleNavClick = (item) => {
    setMobileMenuOpen(false);

    if (location.pathname === '/') {
      const element = document.getElementById(item.sectionId);
      if (element) {
        const headerOffset = 76;
        const elementPosition = element.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
        window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
        return;
      }
    }

    navigate(item.path);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header className={`header ${scrolled ? 'header-scrolled' : ''}`}>
      <div className="header-inner">
        {/* Brand Logo */}
        <Link 
          to="/" 
          className="logo-brand" 
          onClick={() => { setMobileMenuOpen(false); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
          aria-label={`${companyInfo.name} Homepage`}
        >
          <img 
            src="/assets/Serenova logo.png" 
            alt={`${companyInfo.name} Logo`} 
            className="logo-img" 
          />
        </Link>

        {/* Desktop Navigation */}
        <nav className="nav-desktop nav-links" aria-label="Main Navigation">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path || (location.pathname === '/' && item.path === '/');
            return (
              <button
                key={item.label}
                className={`nav-link ${isActive ? 'active' : ''}`}
                onClick={() => handleNavClick(item)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', font: 'inherit' }}
              >
                {item.label}
              </button>
            );
          })}
        </nav>

        {/* Action CTA & Mobile Toggle */}
        <div className="header-right">
          <button 
            className="btn btn-primary header-cta-btn"
            onClick={onOpenConsultation}
            aria-label="Get a Free Consultation"
          >
            <span>Get a Free Consultation</span>
            <ArrowRight size={16} />
          </button>

          {/* Mobile Hamburger Button */}
          <button
            className="mobile-menu-btn"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-expanded={mobileMenuOpen}
            aria-controls="mobile-navigation-drawer"
            aria-label={mobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
          >
            {mobileMenuOpen ? <X size={26} /> : <Menu size={26} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      <div 
        id="mobile-navigation-drawer"
        className={`mobile-drawer ${mobileMenuOpen ? 'open' : ''}`}
        aria-hidden={!mobileMenuOpen}
      >
        <div className="mobile-drawer-links" role="menu">
          {navItems.map((item) => (
            <button
              key={item.label}
              role="menuitem"
              className="nav-link"
              onClick={() => handleNavClick(item)}
              style={{ background: 'none', border: 'none', cursor: 'pointer', font: 'inherit', textAlign: 'left', width: '100%' }}
            >
              {item.label}
            </button>
          ))}
        </div>
        <div className="mobile-drawer-cta">
          <button 
            className="btn btn-primary mobile-cta-btn"
            onClick={() => {
              setMobileMenuOpen(false);
              onOpenConsultation();
            }}
            aria-label="Get a Free Consultation"
          >
            <span>Get a Free Consultation</span>
            <ArrowRight size={16} />
          </button>
        </div>
      </div>
    </header>
  );
}
