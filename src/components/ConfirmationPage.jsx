import React, { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { CheckCircle2, ShieldCheck, Mail, Phone, ArrowLeft, Calendar } from 'lucide-react';

export default function ConfirmationPage() {
  const { refNumber } = useParams();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  return (
    <div className="confirmation-page" style={{ paddingTop: '120px', paddingBottom: '100px' }}>
      <div className="container" style={{ maxWidth: '720px' }}>
        <div style={{ background: '#0F172A', border: '1px solid rgba(16, 185, 129, 0.3)', borderRadius: '24px', padding: '40px', textAlign: 'center', boxShadow: '0 20px 40px rgba(0,0,0,0.5)' }}>
          <div style={{ display: 'inline-flex', padding: '16px', borderRadius: '50%', background: 'rgba(16, 185, 129, 0.1)', color: '#10B981', marginBottom: '24px' }}>
            <CheckCircle2 size={48} />
          </div>

          <h1 style={{ fontSize: '1.8rem', color: '#F8FAFC', fontWeight: '800', marginBottom: '12px' }}>
            Consultation Request Received!
          </h1>

          <p style={{ fontSize: '1.05rem', color: '#94A3B8', lineHeight: '1.6', marginBottom: '28px' }}>
            Thank you for reaching out to Serenova Tech. Your technical enquiry has been logged and assigned a tracking reference number.
          </p>

          {/* Reference Box */}
          <div style={{ background: '#070B14', border: '1px border-dashed rgba(56, 189, 248, 0.4)', borderRadius: '12px', padding: '20px', marginBottom: '32px', display: 'inline-block', width: '100%' }}>
            <div style={{ fontSize: '0.8rem', color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: '700', marginBottom: '6px' }}>
              Enquiry Reference Code
            </div>
            <div style={{ fontSize: '1.6rem', color: '#38BDF8', fontWeight: '800', fontFamily: 'monospace', letterSpacing: '0.05em' }}>
              {refNumber || 'ST-202609-SUCCESS'}
            </div>
          </div>

          {/* Next Steps List */}
          <div style={{ textAlign: 'left', background: 'rgba(255, 255, 255, 0.02)', borderRadius: '14px', padding: '24px', marginBottom: '32px', border: '1px solid rgba(255, 255, 255, 0.06)' }}>
            <h3 style={{ fontSize: '1.05rem', color: '#F8FAFC', fontWeight: '700', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Calendar size={18} style={{ color: '#38BDF8' }} />
              <span>What Happens Next?</span>
            </h3>

            <ol style={{ paddingLeft: '20px', margin: 0, display: 'flex', flexDirection: 'column', gap: '12px', color: '#CBD5E1', fontSize: '0.925rem', lineHeight: '1.6' }}>
              <li><strong>Requirement Review:</strong> Our sysadmin and web team reviews your server or application requirements.</li>
              <li><strong>Technical Proposal:</strong> We prepare a clear scope, estimated timeline, and fixed quote.</li>
              <li><strong>Direct Contact:</strong> We will reach out via your preferred contact method within <strong>4 to 12 hours</strong>.</li>
            </ol>
          </div>

          {/* Action Links */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', justifyContent: 'center' }}>
            <Link to="/" className="btn btn-primary btn-lg">
              <ArrowLeft size={18} />
              <span>Return to Homepage</span>
            </Link>

            <a
              href={`mailto:contact@serenovatech.com?subject=Enquiry Reference: ${refNumber}`}
              className="btn btn-outline btn-lg"
              style={{ textDecoration: 'none' }}
            >
              <Mail size={18} />
              <span>Email Technical Team</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
