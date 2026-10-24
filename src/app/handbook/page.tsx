'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  BookOpen, ArrowLeft, Download, ExternalLink, ShieldCheck,
  CheckCircle2, FileText, Building2, Users, Layers, AlertCircle,
  Clock, Shield, Award, Scale, HelpCircle, Check
} from 'lucide-react';

const officialHandbookPdfUrl = 'https://cdnbbsr.s3waas.gov.in/s35938b4d054136e5d59ada6ec9c295d7a/uploads/2025/03/2025031399.pdf';

const handbookChapters = [
  {
    chapter: 'Chapter I',
    badge: 'New Institutions',
    title: 'Grant of Approval for New Technical Institutions',
    norms: [
      'Establishment of new technical institutions offering Diploma, Under Graduate, Post Graduate programs in Engineering, Technology, Management, Architecture, Pharmacy, and Applied Arts.',
      'Eligibility for Registered Society, Public Trust, or Section 8 Company with continuous legal existence.',
      'Mandatory pre-requisites: registered title deed for contiguous land parcel, State Govt NOC, and Affiliating University NOC.',
      'Submission of Detailed Project Report (DPR), financial security deposit, and architectural layout plans as per APH norms.'
    ]
  },
  {
    chapter: 'Chapter II',
    badge: 'Existing Institutions (EoA)',
    title: 'Grant of Extension of Approval (EoA) for Existing Institutions & Intake Variations',
    norms: [
      'Annual Extension of Approval (EoA) for accredited and non-accredited existing technical institutions.',
      'Processing of Increase in Intake, Introduction of New Courses / Emerging Areas, Reduction in Intake, and Closure.',
      'Restoration of Intake under Break in EoA (Clause 2.16.1) upon resolution of past regulatory discrepancies.',
      'Evaluation procedure (Clause 2.23): Automated Pre-Scrutiny -> Scrutiny Committee -> Re-Scrutiny -> Expert Visit Committee (EVC) -> Standing Hearing Committee (SHC) -> Standing Appellate Committee (SAC).'
    ]
  },
  {
    chapter: 'Chapter III',
    badge: 'Global Partnerships',
    title: 'Collaboration & Twinning Programmes between Indian and Foreign Institutions',
    norms: [
      'Twinning agreements between AICTE-approved Indian institutions and top global foreign universities (Top 500 QS/THE rankings).',
      'Dual Degree & Joint Degree programs under UGC/AICTE Foreign University Collaboration Regulations.',
      'Mandatory physical and instructional infrastructure equivalence with credits transfer verification.'
    ]
  },
  {
    chapter: 'Chapter IV',
    badge: 'Universities',
    title: 'Grant of Approval for Universities (Central, State, Deemed & Private)',
    norms: [
      'Statutory compliance for Central, State, Private, and Deemed-to-be Universities offering technical programs.',
      'Mandatory annual disclosure of student intake, faculty roster, instructional carpet area, and laboratory equipment.',
      'AICTE approval integration with UGC recognition and National Academic Depository (NAD/DigiLocker).'
    ]
  },
  {
    chapter: 'Chapter V',
    badge: 'ODL & Online',
    title: 'Approval for Open and Distance Learning (ODL) and Online Learning (OL)',
    norms: [
      'Offering of Management (MBA/PGDM), MCA, and Travel & Tourism programs in online / distance mode.',
      'Mandatory accreditation threshold (NAAC score >= 3.26 or NIRF Top 100 ranking).',
      'Compliance with digital examination safeguards, proctored testing, and self-learning materials (SLM).'
    ]
  },
  {
    chapter: 'Chapter VI',
    badge: 'Core Standards & FSR',
    title: 'Standard Norms and Requirements (Land, Built-up Area, FSR & Cadre)',
    norms: [
      'Land Requirement: Mega/Metro (1.5–2.5 Acres), Urban (2.5–5.0 Acres), Rural (7.5 Acres continuous parcel).',
      'Instructional carpet area: Classrooms, tutorial rooms, laboratories, workshops, and computer centres scaled to intake.',
      'Faculty Cadre Norms (Appendix 7): 1 Professor : 2 Associate Professors : 6 Assistant Professors for UG engineering.',
      'Student-to-Faculty Ratio (FSR): 1:20 norm for UG Engineering; 1:15 for M.Tech/MBA; 1:10 for Architecture.',
      'Safety Clearances: Continuous Fire Safety NOC (Regulation 3.4) and State PWD Structural Stability Certificate (Clause 2.1).'
    ]
  },
  {
    chapter: 'Chapter VII',
    badge: 'Penal Framework',
    title: 'Penal Action on Violation of Norms and Deficiencies',
    norms: [
      'Penal consequences for excess admissions, unapproved courses, faculty roster misrepresentation, or safety lapses.',
      'Graduated regulatory action: Deficiency Notice -> Hearing before SHC -> Reduction in Approved Intake -> "No Admission" status -> Complete Withdrawal of Approval.',
      'Forfeiture of Security Deposit / Bank Guarantee upon established statutory violations.'
    ]
  },
  {
    chapter: 'Chapter VIII',
    badge: 'Compliance Guidelines',
    title: 'Essential DOS and DON\'TS for Technical Institutions',
    norms: [
      'DO maintain continuous validity of Fire Safety NOC and Structural Stability without any single-day lapse.',
      'DO disburse faculty salaries through nationalized bank accounts strictly complying with AICTE 7th CPC pay scales.',
      'DON\'T admit students exceeding approved intake or without valid affiliating university affiliation order.',
      'DON\'T share land parcels, buildings, or core faculty across multiple institutions without Council bifurcation approval.'
    ]
  }
];

const handbookAnnexures = [
  { id: 'Annexure-1', title: 'Documents Required for Grant of Approval for New Technical Institutions', focus: 'Trust deeds, registered land title, PWD certificate, DPR, University NOC' },
  { id: 'Annexure-2', title: 'Documents Required for Extension of Approval (EoA) for Existing Institutions', focus: 'Audited balance sheets, Form-16 CA certificate, continuous Fire NOC, faculty roster' },
  { id: 'Annexure-3', title: 'Norms for Land Requirement and Contiguity Verification', focus: 'Mega/Metro (1.5–2.5 ac), Urban (2.5–5 ac), Rural (7.5 ac) continuous parcel standards' },
  { id: 'Annexure-4', title: 'Norms for Built-up Area & Instructional Space Requirements', focus: 'Classrooms, tutorial rooms, labs, workshops, drawing halls, administrative area formulas' },
  { id: 'Annexure-5', title: 'Norms for Faculty Cadre Ratios, FSR & Pay Scales', focus: '1:20 FSR, 1:2:6 Cadre proportion (Prof:Assoc:Asst), 7th CPC salary compliance' },
  { id: 'Annexure-6', title: 'Essential and Desirable Laboratories and Equipment', focus: 'Specialized lab setups, workshop machinery, safety gear, software licenses' },
  { id: 'Annexure-7', title: 'Fire Safety, Structural Stability & Barrier-Free Access (PWD)', focus: 'State Fire Directorate clearance, PWD Executive Engineer stability, Divyangjan ramps/lifts' },
  { id: 'Annexure-8', title: 'Format of No Objection Certificates (NOCs) from State Govt & University', focus: 'Standardized NOC formats for new courses, intake hikes, site changes, closures' },
  { id: 'Annexure-9', title: 'Establishment of Anti-Ragging Committee and Squad', focus: 'UGC/AICTE Anti-Ragging regulations, annual affidavit collection from students/parents' },
  { id: 'Annexure-10', title: 'Internal Complaints Committee (ICC) & Gender Sensitization', focus: 'Compliance with Sexual Harassment of Women at Workplace (Prevention) Act, 2013' },
  { id: 'Annexure-11', title: 'Student Grievance Redressal Committee (SGRC) & Ombudsperson', focus: 'Appointment of retired judge / senior academician Ombudsperson for dispute hearing' },
  { id: 'Annexure-12', title: 'SC/ST Prevention of Atrocities Committee', focus: 'Safeguards and monitoring cell for students and employees from marginalized groups' },
  { id: 'Annexure-13', title: 'Establishment of Innovation Cell & Entrepreneurship Hub', focus: 'Institution Innovation Council (IIC) setup as per Ministry of Education guidelines' },
  { id: 'Annexure-14', title: 'Computer Centre, Digital Library & Bandwidth Norms', focus: 'Minimum terminal count, 1 Gbps internet lease line, DELNET/IEEE digital library access' },
  { id: 'Annexure-15', title: 'Procedure for Scrutiny and Re-Scrutiny Committees', focus: 'Evaluation matrix, deficiency memo generation, online document re-submission windows' },
  { id: 'Annexure-16', title: 'Expert Visit Committee (EVC) & Virtual Inspection Guidelines', focus: 'Physical campus inspection, video recording, geo-tagged photo verification protocols' },
  { id: 'Annexure-17', title: 'Standing Hearing Committee (SHC) & Standing Appellate Committee (SAC)', focus: 'Quasi-judicial hearing procedures for compliance appeals and deficiency rectifications' },
  { id: 'Annexure-18', title: 'Regional Office Jurisdictions & Council Communication Directory', focus: 'Contact points for Northern, Western, Southern, Eastern, Central & Regional offices' }
];

const handbookAffidavits = [
  { id: 'Affidavit-1', name: 'Common Application Submission Affidavit', stamp: 'Rs. 100/- Non-Judicial Stamp', purpose: 'Solemn declaration affirming correctness of all uploaded documents and data.' },
  { id: 'Affidavit-2', name: 'Land Title & Contiguous Area Undertaking', stamp: 'Rs. 100/- Non-Judicial Stamp', purpose: 'Declaration that campus land is continuous, encumbrance-free, and registered in institution\'s name.' },
  { id: 'Affidavit-3', name: 'Building Plan Approval & Architect Certificate', stamp: 'Rs. 100/- Non-Judicial Stamp', purpose: 'Architect endorsement that building plan satisfies National Building Code (NBC) norms.' },
  { id: 'Affidavit-4', name: 'Fire Safety & Structural Stability Certificate Undertaking', stamp: 'Rs. 100/- Non-Judicial Stamp', purpose: 'Undertaking that Fire NOC and PWD stability certificates remain unexpired during academic year.' },
  { id: 'Affidavit-5', name: 'Faculty Cadre, Qualifications & 7th CPC Pay Scale Compliance', stamp: 'Rs. 100/- Non-Judicial Stamp', purpose: 'Affidavit confirming faculty selection, Aadhaar linkage, and payment through nationalized bank.' },
  { id: 'Affidavit-6', name: 'Anti-Ragging and Student Safety Declaration', stamp: 'Rs. 100/- Non-Judicial Stamp', purpose: 'Zero-tolerance policy adherence and constitution of functional squad.' },
  { id: 'Affidavit-7', name: 'Internal Complaints Committee (ICC) Constitution', stamp: 'Rs. 100/- Non-Judicial Stamp', purpose: 'Affidavit verifying compliance with Sexual Harassment Prevention Act.' },
  { id: 'Affidavit-8', name: 'Break in EoA & Restoration of Past Intake', stamp: 'Rs. 100/- Non-Judicial Stamp', purpose: 'Institutional affidavit specifying rectification of historical non-compliances.' },
  { id: 'Affidavit-9', name: 'Change of Site / Location of Technical Campus', stamp: 'Rs. 100/- Non-Judicial Stamp', purpose: 'Declaration of safe relocation without disruption to ongoing student cohorts.' },
  { id: 'Affidavit-10', name: 'Closure of Institution or Program', stamp: 'Rs. 100/- Non-Judicial Stamp', purpose: 'Undertaking for transfer and safeguarding academic records of existing students.' },
  { id: 'Affidavit-11', name: 'Twinning & Foreign Collaboration Agreement', stamp: 'Rs. 100/- Non-Judicial Stamp', purpose: 'Legal agreement between Indian institution and accredited foreign university.' },
  { id: 'Affidavit-12', name: 'Open and Distance Learning (ODL) Safeguards', stamp: 'Rs. 100/- Non-Judicial Stamp', purpose: 'Declaration of digital proctoring, LMS infrastructure, and faculty readiness.' },
  { id: 'Affidavit-13', name: 'Emergency Health, Water & Environmental Sanitation', stamp: 'Rs. 100/- Non-Judicial Stamp', purpose: 'Potable water, sewage treatment plant (STP), and campus health center availability.' }
];

export default function HandbookPage() {
  const [activeTab, setActiveTab] = useState<'chapters' | 'annexures' | 'affidavits' | 'workflow'>('chapters');

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
        padding: '14px 32px',
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
            <ArrowLeft size={14} /> Back to Front Portal
          </Link>
          <div style={{ borderLeft: '1px solid #e2e8f0', height: 28, margin: '0 4px' }} />
          <div>
            <div style={{ fontSize: '0.98rem', fontWeight: 800, color: '#0f2942' }}>
              AICTE Approval Process Handbook (APH 2024–27)
            </div>
            <div style={{ fontSize: '0.74rem', color: '#64748b' }}>
              Official Regulatory Standard • AICTE Act 1987 Section 23
            </div>
          </div>
        </div>

        {/* Action Buttons: Direct Government PDF Download */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <a
            href={officialHandbookPdfUrl}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
              padding: '7px 16px',
              borderRadius: 5,
              background: '#1e40af',
              color: '#ffffff',
              fontSize: '0.8rem',
              fontWeight: 700,
              textDecoration: 'none',
              boxShadow: '0 2px 6px rgba(30,64,175,0.2)'
            }}
            title="Download the full official AICTE Approval Process Handbook PDF (4.15 MB)"
          >
            <Download size={14} />
            <span>Official Handbook PDF (4.15 MB)</span>
            <ExternalLink size={12} style={{ opacity: 0.8 }} />
          </a>

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
        </div>
      </header>

      {/* Main Content Area */}
      <main style={{
        flex: 1,
        maxWidth: 1120,
        margin: '0 auto',
        padding: '32px 24px',
        width: '100%'
      }}>
        {/* Document Header Hero Card */}
        <div style={{
          background: 'linear-gradient(135deg, #ffffff 0%, #f0f7ff 100%)',
          borderRadius: 8,
          border: '1px solid #bfdbfe',
          borderLeft: '5px solid #1e40af',
          padding: '28px',
          boxShadow: '0 2px 8px rgba(30,64,175,0.06)',
          marginBottom: 28
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 16 }}>
            <div style={{ maxWidth: 740 }}>
              <div style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 6,
                background: '#ecfdf5',
                color: '#166534',
                fontSize: '0.7rem',
                fontWeight: 700,
                padding: '2px 8px',
                borderRadius: 4,
                marginBottom: 8,
                border: '1px solid #bbf7d0'
              }}>
                <ShieldCheck size={12} /> OFFICIAL LEGAL DOCUMENT • MINISTRY OF EDUCATION, GOVT OF INDIA
              </div>
              <h1 style={{ fontSize: '1.45rem', fontWeight: 800, color: '#0f2942', lineHeight: 1.25, marginBottom: 8 }}>
                AICTE Approval Process Handbook (2024-25 to 2026-27)
              </h1>
              <p style={{ fontSize: '0.86rem', color: '#475569', lineHeight: 1.6, marginBottom: 16 }}>
                Published by the All India Council for Technical Education, Nelson Mandela Marg, New Delhi-110070.
                In exercise of powers conferred under sub-section (1) of Section 23 read with Section 10 and Section 11 of the AICTE Act, 1987.
                Governs approval processes, Extension of Approval (EoA), land requirements, faculty norms (1:20 FSR, 1:2:6 cadre proportion), and scrutiny committees.
              </p>
            </div>

            {/* Direct Official PDF Action Box */}
            <div style={{
              background: '#ffffff',
              border: '1px solid #bfdbfe',
              borderRadius: 6,
              padding: '16px 18px',
              minWidth: 260,
              boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
              textAlign: 'center'
            }}>
              <div style={{ fontSize: '0.74rem', color: '#64748b', marginBottom: 6 }}>
                Official Government PDF Source
              </div>
              <div style={{ fontSize: '0.9rem', fontWeight: 800, color: '#1e40af', marginBottom: 10 }}>
                4.15 MB • Complete Text
              </div>
              <a
                href={officialHandbookPdfUrl}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 8,
                  padding: '9px 16px',
                  borderRadius: 5,
                  background: '#1e40af',
                  color: '#ffffff',
                  fontSize: '0.82rem',
                  fontWeight: 700,
                  textDecoration: 'none'
                }}
              >
                <Download size={14} /> Open Official PDF
              </a>
              <div style={{ fontSize: '0.68rem', color: '#94a3b8', marginTop: 6 }}>
                cdnbbsr.s3waas.gov.in official mirror
              </div>
            </div>
          </div>

          <div style={{
            display: 'flex',
            gap: 16,
            flexWrap: 'wrap',
            padding: '12px 16px',
            background: '#ffffff',
            borderRadius: 6,
            border: '1px solid #e2e8f0',
            fontSize: '0.76rem',
            color: '#64748b',
            marginTop: 16
          }}>
            <div><strong>Notification Ref:</strong> F. No. AICTE/AB/APH/2024-27</div>
            <div><strong>Effective Period:</strong> AY 2024-25, 2025-26 &amp; 2026-27</div>
            <div><strong>Issuing Authority:</strong> Member Secretary, AICTE, New Delhi</div>
            <div><strong>Applicability:</strong> Engineering, Management, Pharmacy, Architecture &amp; Polytechnics</div>
          </div>
        </div>

        {/* Interactive Navigation Tabs */}
        <div style={{
          display: 'flex',
          gap: 8,
          borderBottom: '2px solid #e2e8f0',
          marginBottom: 24,
          overflowX: 'auto'
        }}>
          {[
            { id: 'chapters', label: 'Chapters I – VIII (Norms)', count: '8 Chapters' },
            { id: 'annexures', label: 'Annexures & Checklists', count: '18 Annexures' },
            { id: 'affidavits', label: 'Statutory Affidavits', count: '13 Formats' },
            { id: 'workflow', label: 'Approval Process Workflow', count: '5 Stages' },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              style={{
                padding: '10px 18px',
                border: 'none',
                background: 'transparent',
                borderBottom: activeTab === tab.id ? '3px solid #1e40af' : '3px solid transparent',
                marginBottom: -2,
                cursor: 'pointer',
                fontWeight: activeTab === tab.id ? 800 : 600,
                color: activeTab === tab.id ? '#1e40af' : '#64748b',
                fontSize: '0.84rem',
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                whiteSpace: 'nowrap'
              }}
            >
              <span>{tab.label}</span>
              <span style={{
                fontSize: '0.68rem',
                background: activeTab === tab.id ? '#eff6ff' : '#f1f5f9',
                color: activeTab === tab.id ? '#1e40af' : '#64748b',
                padding: '1px 6px',
                borderRadius: 10,
                border: '1px solid #e2e8f0'
              }}>
                {tab.count}
              </span>
            </button>
          ))}
        </div>

        {/* TAB 1: Chapters Overview */}
        {activeTab === 'chapters' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
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
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10, flexWrap: 'wrap', gap: 8 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
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
                    <h2 style={{ fontSize: '1rem', fontWeight: 700, color: '#0f172a', margin: 0 }}>
                      {ch.title}
                    </h2>
                  </div>
                  <span style={{
                    fontSize: '0.68rem',
                    fontWeight: 700,
                    color: '#0f2942',
                    background: '#f1f5f9',
                    padding: '2px 8px',
                    borderRadius: 4
                  }}>
                    {ch.badge}
                  </span>
                </div>

                <ul style={{ listStyle: 'none', paddingLeft: 0, display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {ch.norms.map((norm, nIdx) => (
                    <li key={nIdx} style={{ display: 'flex', alignItems: 'flex-start', gap: 10, fontSize: '0.82rem', color: '#475569', lineHeight: 1.55 }}>
                      <CheckCircle2 size={15} style={{ color: '#16a34a', flexShrink: 0, marginTop: 2 }} />
                      <span>{norm}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        )}

        {/* TAB 2: Annexures & Mandatory Checklists */}
        {activeTab === 'annexures' && (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: 14
          }}>
            {handbookAnnexures.map((annex) => (
              <div
                key={annex.id}
                style={{
                  background: '#ffffff',
                  border: '1px solid #e2e8f0',
                  borderRadius: 6,
                  padding: '16px 18px',
                  boxShadow: '0 1px 2px rgba(0,0,0,0.02)',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between'
                }}
              >
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                    <span style={{
                      fontSize: '0.7rem',
                      fontWeight: 800,
                      color: '#1e40af',
                      background: '#eff6ff',
                      padding: '2px 6px',
                      borderRadius: 4
                    }}>
                      {annex.id}
                    </span>
                    <span style={{ fontSize: '0.68rem', color: '#64748b' }}>Statutory Checklist</span>
                  </div>
                  <h3 style={{ fontSize: '0.86rem', fontWeight: 700, color: '#0f2942', marginBottom: 8, lineHeight: 1.35 }}>
                    {annex.title}
                  </h3>
                  <p style={{ fontSize: '0.78rem', color: '#64748b', lineHeight: 1.5 }}>
                    <strong>Regulatory Scope:</strong> {annex.focus}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* TAB 3: Statutory Legal Affidavits */}
        {activeTab === 'affidavits' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <div style={{
              background: '#fffbeb',
              border: '1px solid #fde68a',
              borderRadius: 6,
              padding: '12px 16px',
              fontSize: '0.78rem',
              color: '#92400e',
              marginBottom: 8
            }}>
              <strong>Statutory Requirement (APH Chapter II &amp; Annexures):</strong> All Affidavits must be executed by the authorized Chairman / Secretary of the sponsoring Society/Trust or Principal on Non-Judicial Stamp Paper, duly sworn before a First Class Judicial Magistrate or Public Notary with official seal and registration number.
            </div>

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
              gap: 12
            }}>
              {handbookAffidavits.map((aff) => (
                <div
                  key={aff.id}
                  style={{
                    background: '#ffffff',
                    border: '1px solid #e2e8f0',
                    borderRadius: 6,
                    padding: '14px 16px',
                    boxShadow: '0 1px 2px rgba(0,0,0,0.02)'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                    <span style={{
                      fontSize: '0.72rem',
                      fontWeight: 800,
                      color: '#047857',
                      background: '#ecfdf5',
                      padding: '2px 7px',
                      borderRadius: 4
                    }}>
                      {aff.id}
                    </span>
                    <span style={{ fontSize: '0.68rem', color: '#64748b' }}>{aff.stamp}</span>
                  </div>
                  <h3 style={{ fontSize: '0.86rem', fontWeight: 700, color: '#0f2942', marginBottom: 6 }}>
                    {aff.name}
                  </h3>
                  <p style={{ fontSize: '0.76rem', color: '#475569', lineHeight: 1.45 }}>
                    {aff.purpose}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 4: Approval Process Workflow (Clause 2.23) */}
        {activeTab === 'workflow' && (
          <div style={{
            background: '#ffffff',
            border: '1px solid #e2e8f0',
            borderRadius: 8,
            padding: '24px 28px',
            boxShadow: '0 1px 3px rgba(0,0,0,0.03)'
          }}>
            <h2 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#0f2942', marginBottom: 6 }}>
              Statutory Scrutiny &amp; Approval Process Workflow (APH Clause 2.23)
            </h2>
            <p style={{ fontSize: '0.82rem', color: '#64748b', marginBottom: 20 }}>
              The multi-tier transparent evaluation mechanism codified under AICTE Regulations for all technical education applications.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {[
                {
                  step: 'Stage 1',
                  title: 'Online Application & Self-Disclosure (Chapters I & II)',
                  desc: 'Institution submits digital dossier on the AICTE portal with Annexure-1 / Annexure-2 documents, Land Deeds, PWD stability certificates, CA-certified Form-16 roster, and Affidavits 1–13.'
                },
                {
                  step: 'Stage 2',
                  title: 'Scrutiny / Re-Scrutiny Committee Evaluation (Clause 2.23.1)',
                  desc: 'Scrutiny Committee composed of senior professors and technical experts examines document completeness, land title contiguity, and faculty cadre compliance. Issues automated deficiency report if any discrepancy is found.'
                },
                {
                  step: 'Stage 3',
                  title: 'Expert Visit Committee (EVC) / Virtual Inspection (Clause 2.23.2)',
                  desc: 'For new institutions, intake variations, or site changes, an Expert Visit Committee inspects physical instructional carpet area, laboratories, safety gear, computing facilities, and barrier-free access.'
                },
                {
                  step: 'Stage 4',
                  title: 'Standing Hearing Committee (SHC) & Standing Appellate Committee (SAC) (Clause 2.23.4)',
                  desc: 'Quasi-judicial appellate body headed by retired High Court Judge / senior academician. Hears institutional appeals and examines supplementary rectification proofs.'
                },
                {
                  step: 'Stage 5',
                  title: 'Grant of Extension of Approval (EoA) / Approval Letter (EC Decision)',
                  desc: 'Final approval issued by the Executive Committee (EC) of AICTE. Publicly notified and synced in real time across the institution workspace and National Approval Registry.'
                }
              ].map((s, idx) => (
                <div
                  key={idx}
                  style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: 14,
                    padding: '12px 16px',
                    background: '#f8fafc',
                    borderRadius: 6,
                    border: '1px solid #e2e8f0'
                  }}
                >
                  <span style={{
                    fontSize: '0.75rem',
                    fontWeight: 800,
                    color: '#ffffff',
                    background: '#1e40af',
                    padding: '3px 8px',
                    borderRadius: 4,
                    flexShrink: 0
                  }}>
                    {s.step}
                  </span>
                  <div>
                    <h3 style={{ fontSize: '0.9rem', fontWeight: 700, color: '#0f2942', margin: '0 0 4px 0' }}>
                      {s.title}
                    </h3>
                    <p style={{ fontSize: '0.8rem', color: '#475569', margin: 0, lineHeight: 1.5 }}>
                      {s.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Bottom Call to Action */}
        <div style={{
          marginTop: 28,
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
                AICTE Regulatory Compliance &amp; Scrutiny Portal
              </div>
              <div style={{ fontSize: '0.76rem', color: '#475569' }}>
                Automated multi-tier validation aligned with APH 2024–27 rules.
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
              Submit Application (EoA Form)
            </Link>
            <a
              href={officialHandbookPdfUrl}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                padding: '8px 14px',
                borderRadius: 5,
                background: '#ffffff',
                border: '1px solid #bfdbfe',
                color: '#1e40af',
                fontSize: '0.78rem',
                fontWeight: 600,
                textDecoration: 'none',
                display: 'flex',
                alignItems: 'center',
                gap: 5
              }}
            >
              <Download size={13} />
              <span>Download PDF</span>
            </a>
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
