import React from 'react';
import { ArrowRight, Mail } from 'lucide-react';

export default function CTASection({ onOpenConsultation }) {
  const scrollToContact = () => {
    const el = document.getElementById('contact');
    if (el) {
      const headerOffset = 80;
      const elementPosition = el.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
      window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
    }
  };

  return (
    <section className="section" style={{ paddingTop: '2rem', paddingBottom: '3rem' }}>
      <div className="container">
        <div className="cta-banner">
          <h2>Ready to Improve Your Technology?</h2>
          <p>
            Schedule a consultation with our senior engineers today and discover how custom IT infrastructure can transform your business.
          </p>

          <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <button className="btn btn-primary" onClick={onOpenConsultation}>
              <span>Start Your Project</span>
              <ArrowRight size={18} />
            </button>

            <button className="btn btn-secondary" onClick={scrollToContact}>
              <Mail size={18} />
              <span>Contact Our Team</span>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
