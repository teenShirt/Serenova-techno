import React from 'react';
import { Network, ShieldCheck, Cpu, Headphones } from 'lucide-react';

export default function WhatWeDo() {
  const outcomes = [
    {
      id: 1,
      title: "Build Reliable IT Infrastructure",
      description: "Eliminate downtime risks with resilient, high-speed network topologies and redundant enterprise servers.",
      icon: Network
    },
    {
      id: 2,
      title: "Improve Security & System Performance",
      description: "Safeguard customer data with zero-trust defense while accelerating throughput and database responsiveness.",
      icon: ShieldCheck
    },
    {
      id: 3,
      title: "Automate Repetitive Technical Work",
      description: "Free up engineering hours by setting up self-healing server scripts and automated CI/CD release pipelines.",
      icon: Cpu
    },
    {
      id: 4,
      title: "Provide Dependable Technical Support",
      description: "Get immediate help whenever technical issues occur with guaranteed SLA response times and 24/7 helpdesk.",
      icon: Headphones
    }
  ];

  return (
    <section id="what-we-do" className="section">
      <div className="container">
        <div className="section-header">
          <span className="eyebrow">WHAT WE DO</span>
          <h2 className="section-title">Measurable Results for Growing Businesses</h2>
          <p className="section-subtitle">
            We focus on business outcomes: zero downtime, bulletproof security, and seamless operational growth.
          </p>
        </div>

        <div className="what-we-do-grid">
          {/* Left Column: Outcomes List */}
          <div className="outcomes-list">
            {outcomes.map((item) => {
              const IconComp = item.icon;
              return (
                <div key={item.id} className="outcome-block">
                  <div className="outcome-icon">
                    <IconComp size={22} />
                  </div>
                  <div>
                    <h3 style={{ fontSize: '1.15rem', color: '#F8FAFC', marginBottom: '4px' }}>
                      {item.title}
                    </h3>
                    <p style={{ fontSize: '0.9rem', color: '#94A3B8', lineHeight: '1.5' }}>
                      {item.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Right Column: High-tech Visual */}
          <div className="about-image-wrap">
            <img 
              src="/assets/what-we-do-infra.jpg" 
              alt="Serenova Tech Enterprise Network Infrastructure Visualization" 
              loading="lazy"
              width="600"
              height="450"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
