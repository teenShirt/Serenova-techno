import React, { useState, useEffect } from 'react';
import { api } from '../admin/services/api';
import { ChevronDown, HelpCircle } from 'lucide-react';

const fallbackFaqs = [
  {
    id: 1,
    question: "Do you support international clients outside Sri Lanka?",
    answer: "Yes. We work remotely with clients worldwide using secure SSH, remote management tools, and encrypted messaging. We accommodate different time zones for system maintenance windows."
  },
  {
    id: 2,
    question: "How do you securely handle server credentials and root access?",
    answer: "We mandate SSH key authentication instead of password logins whenever possible. Access details are transmitted via encrypted channels and stored in secure credential vaults during the project."
  },
  {
    id: 3,
    question: "What web servers and operating systems do you support?",
    answer: "Our primary expertise is in Linux distributions (Ubuntu, Debian, AlmaLinux, CentOS) with Nginx or Apache web servers, as well as Windows Server IIS environments."
  },
  {
    id: 4,
    question: "How are project prices and maintenance fees structured?",
    answer: "We offer both fixed-price quotes for defined projects (e.g. server setup, website development) and monthly retainer plans for continuous server maintenance and uptime monitoring."
  },
  {
    id: 5,
    question: "What is your typical response time for urgent technical issues?",
    answer: "For ongoing maintenance clients, emergency server outage tickets are acknowledged and addressed within 1-2 hours. Standard enquiries receive responses within 4-12 hours."
  },
  {
    id: 6,
    question: "Can you help deploy Node.js, Next.js, or custom web apps?",
    answer: "Yes. We set up PM2 process managers, Docker containers, reverse proxies, environment variables, and Git-based automated deployment scripts tailored for Node and Next.js applications."
  }
];

export default function FAQ() {
  const [faqs, setFaqs] = useState(fallbackFaqs);
  const [openIndex, setOpenIndex] = useState(0);

  useEffect(() => {
    async function loadFaqs() {
      try {
        const res = await api.getPublicFaqs();
        if (res && res.success && res.faqs && res.faqs.length > 0) {
          setFaqs(res.faqs);
        }
      } catch (e) {
        console.warn('FAQ fetch fallback:', e.message);
      }
    }
    loadFaqs();
  }, []);

  const toggleFaq = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section id="faq" className="section faq-section" style={{ paddingTop: '80px', paddingBottom: '80px' }}>
      <div className="container" style={{ maxWidth: '800px' }}>
        <div className="section-header text-center">
          <span className="eyebrow">FREQUENTLY ASKED QUESTIONS</span>
          <h2 className="section-title">Common Questions & Transparent Answers</h2>
          <p className="section-subtitle">
            Everything you need to know about our remote support, access security, technologies, and project process.
          </p>
        </div>

        <div className="faq-list" style={{ marginTop: '40px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index;
            return (
              <div
                key={faq.id || index}
                style={{
                  background: '#0F172A',
                  border: `1px solid ${isOpen ? 'rgba(56, 189, 248, 0.4)' : 'rgba(255, 255, 255, 0.08)'}`,
                  borderRadius: '14px',
                  overflow: 'hidden',
                  transition: 'border-color 0.2s ease'
                }}
              >
                <button
                  onClick={() => toggleFaq(index)}
                  style={{
                    width: '100%',
                    padding: '20px 24px',
                    background: 'none',
                    border: 'none',
                    color: '#F8FAFC',
                    fontSize: '1.05rem',
                    fontWeight: '600',
                    textAlign: 'left',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '16px'
                  }}
                  aria-expanded={isOpen}
                >
                  <span style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <HelpCircle size={18} style={{ color: isOpen ? '#38BDF8' : '#94A3B8', flexShrink: 0 }} />
                    {faq.question}
                  </span>
                  <ChevronDown
                    size={18}
                    style={{
                      transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                      transition: 'transform 0.2s ease',
                      color: isOpen ? '#38BDF8' : '#94A3B8',
                      flexShrink: 0
                    }}
                  />
                </button>

                {isOpen && (
                  <div style={{ padding: '0 24px 20px 54px', color: '#94A3B8', fontSize: '0.95rem', lineHeight: '1.65' }}>
                    {faq.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
