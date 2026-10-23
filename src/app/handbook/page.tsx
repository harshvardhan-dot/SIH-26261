'use client';

import Link from 'next/link';
import {
  BookOpen, ArrowLeft, Download, ExternalLink, ShieldCheck,
  CheckCircle2, FileText, Building2, Users, Layers, AlertCircle
} from 'lucide-react';

const handbookChapters = [
  {
    chapter: 'Chapter I',
    title: 'Grant of Approval for Technical Institutions',
    norms: [
      'Establishment of new technical institutions offering Diploma, Under Graduate, Post Graduate programs.',
      'Eligibility criteria for Registered Society, Public Trust, or Section 8 Company.',
      'Mandatory pre-requisites: registered title deed for contiguous land parcel, State Govt NOC, and University Affiliation.'
    ]
  },
  {
    chapter: 'Chapter II',
    title: 'Extension of Approval (EoA) & Intake Variations',
    norms: [
      'Annual Extension of Approval (EoA) for existing accredited and non-accredited technical institutions.',
      'Increase in intake, additional programs, reduction in intake, and closure of programs or institutions.',
      'Mandatory annual disclosure of faculty Form 16, audited balance sheets, and valid Fire Safety Certificates.'
    ]
  },
  {
    chapter: 'Chapter III',
    title: 'Faculty Norms, Cadre Ratios & Student-Teacher Ratios (FSR)',
    norms: [
      'Engineering & Technology (UG): 1:20 ratio; Post Graduate (M.Tech): 1:15 ratio.',
      'Management (MBA/PGDM): 1:20 ratio; Pharmacy (B.Pharm): 1:15 ratio; Architecture: 1:10 ratio.',
      'Cadre Ratio requirement: 1 Professor : 2 Associate Professors : 6 Assistant Professors for UG engineering departments.'
    ]
  },
  {
    chapter: 'Chapter IV',
    title: 'Land, Built-up Area & Infrastructure Requirements',
    norms: [
      'Land Requirement: Mega/Metro (1.5–2.5 Acres), Urban (2.5–4.0 Acres), Rural (7.5 Acres continuous parcel).',
      'Instructional carpet area: Classrooms, tutorial rooms, laboratories, workshop, and computer centres as per intake.',
      'Administrative & Amenities carpet area: Principal office, staff rooms, library, student common rooms, and cafeteria.'
    ]
  },
  {
    chapter: 'Chapter V',
    title: 'Mandatory Statutory Committees & Grievance Redressal',
    norms: [
      'Internal Complaints Committee (ICC) as per Sexual Harassment of Women at Workplace Act, 2013.',
      'Anti-Ragging Committee and Squad with uploaded undertaking affidavits by all students and parents.',
      'SC/ST Prevention of Atrocities Committee and Student Grievance Redressal Committee (SGRC).'
    ]
  }
];

export default function HandbookPage() {
  return (
    <div style={{
      minHeight: '100vh',
      background: '#f8fafc',
      color: '#0f172a',
      fontFamily: 'var(--font-family)',
      display: 'flex',
      flexDirection: 'column'
    }}>
      {/* Indian National Tricolor Stripe */}
      <div style={{
        height: '4px',
        width: '100%',
        background: 'linear-gradient(90deg, #FF9933 0%, #FF9933 33.3%, #ffffff 33.3%, #ffffff 66.6%, #138808 66.6%, #138808 100%)'
      }} />

      {/* Official Top Bar */}
      <header style={{
        background: '#ffffff',
        borderBottom: '1px solid #e2e8f0',
        padding: '16px 32px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        boxShadow: '0 1px 3px rgba(0,0,0,0.03)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <Link
            href="/"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
              padding: '6px 12px',
              borderRadius: 5,
              background: '#f1f5f9',
              border: '1px solid #cbd5e1',
              color: '#0f2942',
              fontSize: '0.8rem',
              fontWeight: 600,
              textDecoration: 'none'
            }}
          >
            <ArrowLeft size={14} /> Back to Portal
          </Link>
          <div style={{ borderLeft: '1px solid #e2e8f0', height: 28, margin: '0 4px' }} />
          <div>
            <div style={{ fontSize: '0.98rem', fontWeight: 800, color: '#0f2942' }}>
              AICTE Approval Process Handbook (APH)
            </div>
            <div style={{ fontSize: '0.74rem', color: '#64748b' }}>
              Statutory Regulations & Norms for Academic Years 2024-25, 2025-26, and 2026-27
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <a
            href="https://www.aicte-india.org/bulletins/approval-process-handbook-2024-2027"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
              padding: '7px 14px',
              borderRadius: 5,
              background: '#ffffff',
              border: '1px solid #cbd5e1',
              color: '#0f2942',
              fontSize: '0.78rem',
              fontWeight: 600,
              textDecoration: 'none'
            }}
          >
            <span>AICTE Bulletin Mirror</span>
            <ExternalLink size={13} />
          </a>
          <a
            href="https://aicte.gov.in"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
              padding: '7px 16px',
              borderRadius: 5,
              background: '#0f2942',
              color: '#ffffff',
              fontSize: '0.78rem',
              fontWeight: 600,
              textDecoration: 'none'
            }}
          >
            <Download size={13} />
            <span>Official Portal (aicte.gov.in)</span>
          </a>
        </div>
      </header>

      {/* Main Content Area */}
      <main style={{
        flex: 1,
        maxWidth: 1040,
        margin: '0 auto',
        padding: '36px 24px',
        width: '100%'
      }}>
        {/* Document Header Card */}
        <div style={{
          background: '#ffffff',
          borderRadius: 8,
          border: '1px solid #e2e8f0',
          padding: '28px',
          boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
          marginBottom: 28
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 12 }}>
            <div style={{
              width: 44,
              height: 44,
              borderRadius: 8,
              background: '#eff6ff',
              color: '#1e40af',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <BookOpen size={24} />
            </div>
            <div>
              <div style={{
                display: 'inline-block',
                background: '#ecfdf5',
                color: '#166534',
                fontSize: '0.7rem',
                fontWeight: 700,
                padding: '2px 8px',
                borderRadius: 4,
                marginBottom: 4,
                border: '1px solid #bbf7d0'
              }}>
                OFFICIAL STATUTORY DOCUMENT • AICTE NOTIFICATION
              </div>
              <h1 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#0f2942', lineHeight: 1.25 }}>
                Approval Process Handbook (APH 2024–27)
              </h1>
            </div>
          </div>

          <p style={{ fontSize: '0.86rem', color: '#475569', lineHeight: 1.6, marginBottom: 16 }}>
            In exercise of the powers conferred under sub-section (1) of Section 23 read with Section 10 and Section 11 of the All India Council for Technical Education Act, 1987 (52 of 1987), AICTE issues this Approval Process Handbook for regulating grant of approvals and extensions to Technical Education Institutions across India.
          </p>

          <div style={{
            display: 'flex',
            gap: 20,
            flexWrap: 'wrap',
            padding: '12px 16px',
            background: '#f8fafc',
            borderRadius: 6,
            border: '1px solid #e2e8f0',
            fontSize: '0.76rem',
            color: '#64748b'
          }}>
            <div><strong>Notification Ref:</strong> F. No. AICTE/AB/APH/2024-27</div>
            <div><strong>Effective Period:</strong> AY 2024-25 to AY 2026-27</div>
            <div><strong>Issuing Authority:</strong> AICTE, Ministry of Education, GoI</div>
            <div><strong>Applicability:</strong> All Engineering, Management, Pharmacy & Polytechnic Institutes</div>
          </div>
        </div>

        {/* Chapters Grid */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 18, marginBottom: 32 }}>
          <h2 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#0f172a' }}>
            Statutory Norms & Requirements by Chapter
          </h2>

          {handbookChapters.map((ch, idx) => (
            <div
              key={idx}
              style={{
                background: '#ffffff',
                border: '1px solid #e2e8f0',
                borderRadius: 8,
                padding: '20px 24px',
                boxShadow: '0 1px 2px rgba(0,0,0,0.03)'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
                <span style={{
                  fontSize: '0.72rem',
                  fontWeight: 800,
                  color: '#1e40af',
                  background: '#eff6ff',
                  padding: '3px 8px',
                  borderRadius: 4,
                  border: '1px solid #bfdbfe'
                }}>
                  {ch.chapter}
                </span>
                <h3 style={{ fontSize: '0.98rem', fontWeight: 700, color: '#0f172a' }}>
                  {ch.title}
                </h3>
              </div>

              <ul style={{ listStyle: 'none', paddingLeft: 0, display: 'flex', flexDirection: 'column', gap: 8 }}>
                {ch.norms.map((norm, nIdx) => (
                  <li key={nIdx} style={{ display: 'flex', alignItems: 'flex-start', gap: 10, fontSize: '0.82rem', color: '#475569', lineHeight: 1.5 }}>
                    <CheckCircle2 size={15} style={{ color: '#16a34a', flexShrink: 0, marginTop: 2 }} />
                    <span>{norm}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Verification System Notice */}
        <div style={{
          background: '#eff6ff',
          border: '1px solid #bfdbfe',
          borderRadius: 8,
          padding: '16px 20px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 16,
          flexWrap: 'wrap'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <ShieldCheck size={24} style={{ color: '#1e40af', flexShrink: 0 }} />
            <div>
              <div style={{ fontSize: '0.86rem', fontWeight: 700, color: '#1e40af' }}>
                Automated APH Rule Compliance Engine
              </div>
              <div style={{ fontSize: '0.76rem', color: '#475569' }}>
                Our platform automatically encodes and scrutinizes all above rules inside the regulatory compliance validator.
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', gap: 10 }}>
            <Link
              href="/institution/submit"
              style={{
                padding: '8px 16px',
                borderRadius: 5,
                background: '#1e40af',
                color: '#ffffff',
                fontSize: '0.78rem',
                fontWeight: 600,
                textDecoration: 'none'
              }}
            >
              Test Pre-Submission Scrutiny
            </Link>
            <Link
              href="/compliance"
              style={{
                padding: '8px 14px',
                borderRadius: 5,
                background: '#ffffff',
                border: '1px solid #bfdbfe',
                color: '#1e40af',
                fontSize: '0.78rem',
                fontWeight: 600,
                textDecoration: 'none'
              }}
            >
              Interactive FSR Calculator
            </Link>
          </div>
        </div>
      </main>

      {/* Official Footer */}
      <footer style={{
        background: '#ffffff',
        borderTop: '1px solid #e2e8f0',
        padding: '20px 32px',
        textAlign: 'center',
        fontSize: '0.74rem',
        color: '#64748b'
      }}>
        All India Council for Technical Education • Nelson Mandela Marg, Vasant Kunj, New Delhi-110070
      </footer>
    </div>
  );
}
