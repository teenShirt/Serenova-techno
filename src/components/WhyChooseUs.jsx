import React from 'react';
import { advantagesData } from '../data/advantagesData';
import { 
  TrendingUp, 
  ShieldCheck, 
  MessageSquare, 
  Clock, 
  Sliders, 
  Cpu 
} from 'lucide-react';

const iconMap = {
  TrendingUp,
  ShieldCheck,
  MessageSquare,
  Clock,
  Sliders,
  Cpu
};

export default function WhyChooseUs() {
  return (
    <section id="why-choose-us" className="section" style={{ background: 'rgba(15, 23, 42, 0.4)' }}>
      <div className="container">
        <div className="section-header">
          <span className="eyebrow">WHY CHOOSE US</span>
          <h2 className="section-title">Built on Engineering Integrity & Trust</h2>
          <p className="section-subtitle">
            Why leading technology teams choose Serenova Tech as their trusted infrastructure partner.
          </p>
        </div>

        <div className="advantages-grid">
          {advantagesData.map((item) => {
            const IconComp = iconMap[item.iconName] || ShieldCheck;
            return (
              <div key={item.id} className="advantage-card">
                <div className="advantage-icon">
                  <IconComp size={32} />
                </div>
                <h3 style={{ fontSize: '1.2rem', marginBottom: '0.5rem', color: '#F8FAFC' }}>
                  {item.title}
                </h3>
                <p style={{ fontSize: '0.9rem', color: '#94A3B8', lineHeight: '1.6' }}>
                  {item.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
