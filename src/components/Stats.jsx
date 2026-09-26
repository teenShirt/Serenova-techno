import React from 'react';
import { companyInfo } from '../data/companyInfo';
import { Info } from 'lucide-react';

export default function Stats() {
  return (
    <section id="stats" className="section" style={{ paddingTop: '2rem', paddingBottom: '2rem' }}>
      <div className="container">
        <div className="stats-grid">
          {companyInfo.stats.map((stat) => (
            <div key={stat.id} className="stat-card">
              <div className="stat-value">
                {stat.value}
              </div>
              <div className="stat-label">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
