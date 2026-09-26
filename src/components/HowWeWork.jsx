import React from 'react';
import { Search, FileText, Code, ShieldCheck } from 'lucide-react';

export default function HowWeWork() {
  const steps = [
    {
      num: "01",
      title: "Discovery & Requirement Review",
      desc: "We analyze your business goals, inspect your existing server or web setup, and clarify project requirements.",
      icon: Search
    },
    {
      num: "02",
      title: "Technical Assessment & Proposal",
      desc: "We deliver a transparent technical proposal outlining exact scope, timeline, deliverables, and cost without hidden fees.",
      icon: FileText
    },
    {
      num: "03",
      title: "Implementation & Progress Updates",
      desc: "We build, configure, or migrate your systems securely with regular communication and minimal operational disruption.",
      icon: Code
    },
    {
      num: "04",
      title: "Testing, Handover & Continued Support",
      desc: "We perform security checks, verify system stability, hand over access details, and provide ongoing technical maintenance.",
      icon: ShieldCheck
    }
  ];

  return (
    <section id="how-we-work" className="section" style={{ background: '#0F172A', borderTop: '1px solid rgba(255,255,255,0.05)', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
      <div className="container">
        <div className="section-header text-center">
          <span className="eyebrow">OUR PROCESS</span>
          <h2 className="section-title">Clear, Transparent 4-Step Working Process</h2>
          <p className="section-subtitle">
            From initial enquiry to post-deployment care, we keep technical communication simple and execution reliable.
          </p>
        </div>

        <div className="timeline-container" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '24px', marginTop: '40px' }}>
          {steps.map((step) => {
            const IconComp = step.icon;
            return (
              <div key={step.num} className="timeline-step" style={{ background: '#070B14', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '14px', padding: '24px' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
                  <span className="step-num" style={{ fontSize: '1.25rem', fontWeight: '800', color: '#38BDF8', background: 'rgba(56, 189, 248, 0.1)', padding: '4px 10px', borderRadius: '8px' }}>
                    {step.num}
                  </span>
                  <div style={{ color: '#38BDF8', opacity: 0.9 }}>
                    <IconComp size={24} />
                  </div>
                </div>

                <h3 className="step-title" style={{ fontSize: '1.1rem', color: '#F8FAFC', fontWeight: '700', marginBottom: '10px', lineHeight: '1.3' }}>
                  {step.title}
                </h3>

                <p style={{ fontSize: '0.875rem', color: '#94A3B8', lineHeight: '1.6', margin: 0 }}>
                  {step.desc}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
