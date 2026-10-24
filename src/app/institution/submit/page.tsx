'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Building2, Upload, FileCheck, CheckCircle2, AlertTriangle,
  ArrowRight, ArrowLeft, Shield, FileText, Send, Check,
  Sparkles, Download, HelpCircle, ExternalLink, BookOpen, Layers,
  Lock, AlertCircle, Eye, RefreshCw
} from 'lucide-react';
import LanguageSwitcher from '@/components/LanguageSwitcher';
import FileUploadDropzone from '@/components/FileUploadDropzone';
import DocumentViewerModal from '@/components/DocumentViewerModal';

// Existing active dossiers for Apex Institute (PID: 1-102938475)
const activeExistingApplications = [
  {
    id: 'AICTE/AB/2026-27/EOA-102938475',
    title: 'Extension of Approval (EoA) 2026-27 — Existing Technical Programs',
    categoryMatch: ['eoa', 'extension of approval'],
    academicYear: 'AY 2026-27',
    submittedDate: '12-Oct-2026',
    status: 'action_required',
    statusLabel: 'Active • Action Required (2 Directives Pending)',
    currentStage: 'Stage 3: Scrutiny Sub-Committee Evaluation'
  },
  {
    id: 'AICTE/AB/2026-27/NEW-882019482',
    title: 'Introduction of New Course: B.Tech in Artificial Intelligence & Machine Learning (60 Intake)',
    categoryMatch: ['new course', 'increase in intake'],
    academicYear: 'AY 2026-27',
    submittedDate: '18-Oct-2026',
    status: 'under_scrutiny',
    statusLabel: 'Active • Under Scrutiny Committee Review',
    currentStage: 'Stage 2: AI Pre-Scrutiny & Cadastral Verification'
  },
  {
    id: 'AICTE/AB/2026-27/SITE-20193817',
    title: 'Demarcation of Additional Technical Campus Land (2.85 Acres Adjacent Expansion)',
    categoryMatch: ['site', 'location'],
    academicYear: 'AY 2026-27',
    submittedDate: '22-Sep-2026',
    status: 'action_required',
    statusLabel: 'Active • Deficiency Notice Issued',
    currentStage: 'Stage 3: Cadastral & Spatial Inspection'
  }
];

export default function InstitutionSubmitPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  // Form State aligned with APH 2024-27
  const [category, setCategory] = useState('Chapter II: Extension of Approval (EoA) 2026-27');

  // Check whether an active application for this category is already in progress
  const conflictingActiveApp = useMemo(() => {
    const catLower = category.toLowerCase();
    return activeExistingApplications.find(app =>
      app.categoryMatch.some(keyword => catLower.includes(keyword))
    ) || null;
  }, [category]);
  const [program, setProgram] = useState('Engineering & Technology (Under Graduate / Post Graduate)');
  const [locationType, setLocationType] = useState<'Metro' | 'Urban' | 'Rural'>('Urban');
  const [intake, setIntake] = useState(720);
  const [landArea, setLandArea] = useState('7.85 Acres');
  const [facultyCount, setFacultyCount] = useState(38);

  // Statutory Documents (Annexures 1 & 2)
  const [landDoc, setLandDoc] = useState<{ name: string; url?: string; size?: string }>({
    name: 'Land_Title_Khasra_Deed_Registered.pdf',
    url: '/docs/Land_Title_Khasra_Deed_Registered.pdf',
    size: '4.2 MB'
  });

  const [pwdDoc, setPwdDoc] = useState<{ name: string; url?: string; size?: string }>({
    name: 'Apex_PWD_Structural_Stability_Cert.pdf',
    url: '/docs/Apex_PWD_Structural_Stability_Cert.pdf',
    size: '2.4 MB'
  });

  const [fireDoc, setFireDoc] = useState<{ name: string; url?: string; size?: string }>({
    name: 'Fire_Safety_NOC_EXPIRED.pdf',
    url: '/docs/Fire_Safety_NOC_EXPIRED.pdf',
    size: '2.5 MB'
  });

  // Pre-Scrutiny Optical Character Recognition (OCR) Date Detection
  const isFireDocExpired = useMemo(() => {
    const name = (fireDoc.name || '').toLowerCase();
    return name.includes('expired') || name.includes('lapsed') || name.includes('2024') || name.includes('exp');
  }, [fireDoc.name]);

  const isFireDocValid = useMemo(() => {
    const name = (fireDoc.name || '').toLowerCase();
    return name.includes('valid') || name.includes('renewal') || name.includes('rectified') || name.includes('2026') || name.includes('2027');
  }, [fireDoc.name]);

  const fireDocExtractedData = useMemo(() => {
    if (isFireDocExpired) {
      return {
        docNumber: 'UP/FS/GBN/2024/NOC-EXP-31048',
        issueDate: '15-May-2024',
        expiryDate: '14-May-2025',
        status: 'EXPIRED' as const,
        isLapsed: true,
        daysOverdue: 528,
        ruleCitation: 'AICTE APH 2024-27 Regulation 3.4 & Appendix 3',
        message: 'Certificate expired on 14-May-2025 (500+ days overdue). Lacks unbroken statutory coverage for AY 2026-27.',
        actionRequired: 'Submit valid Fire Safety NOC covering through 30-Jun-2027 or an official Renewal Fee Acknowledgment Receipt.'
      };
    }
    return {
      docNumber: 'UP/FS/GBN/2026/NOC-VAL-98421',
      issueDate: '24-Oct-2026',
      expiryDate: '30-Jun-2027',
      status: 'VALID' as const,
      isLapsed: false,
      daysOverdue: 0,
      ruleCitation: 'AICTE APH 2024-27 Regulation 3.4 & NBC 2016 Part 4',
      message: 'Certificate valid through 30-Jun-2027. Full statutory unbroken coverage for AY 2026-27 confirmed.',
      actionRequired: null
    };
  }, [isFireDocExpired]);

  const computedReadinessScore = isFireDocExpired ? 68 : 96;

  const [facultyDoc, setFacultyDoc] = useState<{ name: string; url?: string; size?: string }>({
    name: 'Faculty_Aadhaar_Form16_AuditedList.pdf',
    url: '/docs/Faculty_Aadhaar_Form16_AuditedList.pdf',
    size: '5.8 MB'
  });

  const [affidavitDoc, setAffidavitDoc] = useState<{ name: string; url?: string; size?: string }>({
    name: 'Statutory_Compliance_Affidavit.pdf',
    url: '/docs/Statutory_Compliance_Affidavit.pdf',
    size: '1.2 MB'
  });

  // Statutory Committees (Annexures 9-12)
  const [committees, setCommittees] = useState({
    icc: true,
    antiRagging: true,
    sgrc: true,
    scst: true
  });

  // Selected Affidavits (Affidavits 1-13)
  const [selectedAffidavits, setSelectedAffidavits] = useState<string[]>([
    'Affidavit-1 (Common Submission)',
    'Affidavit-2 (Land Title & Contiguity)',
    'Affidavit-4 (Fire Safety & Building Stability)',
    'Affidavit-5 (7th CPC Faculty Pay)'
  ]);

  const [viewingDoc, setViewingDoc] = useState<any>(null);

  // FSR & Cadre Computations
  const requiredFaculty = Math.ceil(intake / 20); // 1:20 norm
  const reqProfessors = Math.max(1, Math.round(requiredFaculty * (1 / 9)));
  const reqAssocProfessors = Math.max(2, Math.round(requiredFaculty * (2 / 9)));
  const reqAsstProfessors = requiredFaculty - reqProfessors - reqAssocProfessors;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setTimeout(() => {
      setSubmitting(false);
      setSubmitted(true);
    }, 1200);
  };

  const toggleAffidavit = (name: string) => {
    if (selectedAffidavits.includes(name)) {
      setSelectedAffidavits(selectedAffidavits.filter(a => a !== name));
    } else {
      setSelectedAffidavits([...selectedAffidavits, name]);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: '#f8fafc',
      color: '#0f172a',
      display: 'flex',
      flexDirection: 'column'
    }}>
      {/* Indian National Tricolor Header Accent */}
      <div style={{
        height: '4px',
        width: '100%',
        background: 'linear-gradient(90deg, #FF9933 0%, #FF9933 33.3%, #000080 33.3%, #000080 33.7%, #ffffff 33.7%, #ffffff 66.3%, #138808 66.3%, #138808 100%)'
      }} />

      {/* Top Navbar with Official Handbook Links */}
      <header style={{
        background: '#ffffff',
        borderBottom: '1px solid #e2e8f0',
        padding: '12px 32px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        boxShadow: '0 1px 2px rgba(0,0,0,0.02)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <Link href="/institution" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none' }}>
            <div style={{
              width: 36,
              height: 36,
              borderRadius: 6,
              background: '#0f2942',
              color: '#ffffff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 800
            }}>
              <Building2 size={20} />
            </div>
            <div>
              <div style={{ fontSize: '0.9rem', fontWeight: 700, color: '#0f2942' }}>
                Apex Institute of Technology &amp; Management
              </div>
              <div style={{ fontSize: '0.72rem', color: '#64748b' }}>
                PID: 1-102938475 • Statutory Approval Dossier (APH 2024–27)
              </div>
            </div>
          </Link>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <LanguageSwitcher compact />
          <Link href="/institution" className="btn btn-secondary btn-sm">
            <ArrowLeft size={14} /> Back to Workspace
          </Link>
        </div>
      </header>

      {/* Form Container */}
      <main style={{ flex: 1, padding: '28px 20px', maxWidth: 1000, margin: '0 auto', width: '100%' }}>
        {submitted ? (
          <div className="card" style={{ textAlign: 'center', padding: '48px 32px', background: '#ffffff', boxShadow: 'var(--shadow-md)' }}>
            <div style={{
              width: 64,
              height: 64,
              borderRadius: '50%',
              background: '#ecfdf5',
              color: '#047857',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 16px'
            }}>
              <CheckCircle2 size={36} />
            </div>
            <span className="badge badge-success" style={{ marginBottom: 12 }}>Submission Acknowledged • APH 2024-27</span>
            <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#0f2942', marginBottom: 8 }}>
              Application for Extension of Approval (EoA 2026-27) Lodged
            </h2>
            <p style={{ fontSize: '0.85rem', color: '#475569', maxWidth: 580, margin: '0 auto 24px', lineHeight: 1.6 }}>
              Your formal dossier has been encrypted and queued for statutory Scrutiny Committee evaluation under APH Chapter II, Clause 2.23.
              An immutable audit trail record with SHA-256 digital seals has been archived.
            </p>

            <div style={{
              background: '#f8fafc',
              border: '1px solid #e2e8f0',
              padding: '16px 20px',
              borderRadius: 6,
              maxWidth: 520,
              margin: '0 auto 28px',
              fontFamily: 'monospace',
              fontSize: '0.8rem',
              textAlign: 'left'
            }}>
              <div><strong>Application ID:</strong> AICTE/AB/EoA/2026-27/1-102938475</div>
              <div><strong>Filing Timestamp:</strong> {new Date().toLocaleString()}</div>
              <div><strong>Statutory Stream:</strong> {category}</div>
              <div><strong>Pre-Scrutiny Norms Score:</strong> 94% (Ready for Scrutiny Hearing)</div>
              <div><strong>Assigned Regional Office:</strong> Northern Regional Office (Kanpur, UP)</div>
              <div><strong>Regulatory Basis:</strong> Approval Process Handbook (APH 2024–27)</div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'center', gap: 12 }}>
              <Link href="/institution" className="btn btn-secondary">
                Return to Institution Workspace
              </Link>
              <button className="btn btn-primary" onClick={() => window.print()}>
                <Download size={15} /> Download Official Acknowledgment Memo (PDF)
              </button>
            </div>
          </div>
        ) : (
          <div>
            {/* Step Progress Bar Aligned with Handbook */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(5, 1fr)',
              gap: 8,
              marginBottom: 24
            }}>
              {[
                { num: 1, label: '1. Approval Stream', sub: 'Ch I / Ch II' },
                { num: 2, label: '2. Land & Safety', sub: 'Ch VI, Ann 3, 7' },
                { num: 3, label: '3. Faculty & Cadre', sub: '1:20 Norm, Ann 5' },
                { num: 4, label: '4. Affidavits & ICC', sub: 'Affidavits 1–13' },
                { num: 5, label: '5. Pre-Scrutiny Audit', sub: 'Clause 2.23.1' },
              ].map((step) => {
                const isActive = currentStep === step.num;
                const isDone = currentStep > step.num;
                return (
                  <div
                    key={step.num}
                    style={{
                      background: '#ffffff',
                      border: `1px solid ${isActive ? '#1e40af' : '#e2e8f0'}`,
                      borderRadius: 6,
                      padding: '8px 10px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 8,
                      boxShadow: isActive ? '0 1px 3px rgba(30,64,175,0.12)' : 'none'
                    }}
                  >
                    <div style={{
                      width: 22,
                      height: 22,
                      borderRadius: '50%',
                      background: isDone ? '#15803d' : isActive ? '#1e40af' : '#e2e8f0',
                      color: isDone || isActive ? '#ffffff' : '#64748b',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '0.72rem',
                      fontWeight: 700,
                      flexShrink: 0
                    }}>
                      {isDone ? '✓' : step.num}
                    </div>
                    <div style={{ minWidth: 0 }}>
                      <div style={{ fontSize: '0.72rem', fontWeight: isActive ? 700 : 600, color: isActive ? '#0f2942' : '#64748b', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {step.label}
                      </div>
                      <div style={{ fontSize: '0.62rem', color: '#94a3b8' }}>
                        {step.sub}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Step 1: Category & Intake (Handbook Chapters I & II) */}
            {currentStep === 1 && (
              <div className="card" style={{ background: '#ffffff', padding: 28 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
                  <div>
                    <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#0f2942', margin: 0 }}>
                      Step 1: Regulatory Approval Stream &amp; Approved Intake
                    </h3>
                    <p style={{ fontSize: '0.8rem', color: '#64748b', marginTop: 4 }}>
                      Select the application category under Approval Process Handbook (APH 2024–27 Chapters I &amp; II).
                    </p>
                  </div>
                  <span className="badge badge-info" style={{ fontSize: '0.7rem' }}>
                    AY 2026-27 Stream
                  </span>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                  <div>
                    <label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#334155', display: 'block', marginBottom: 6 }}>
                      Application Category (APH Chapters I &amp; II):
                    </label>
                    <select
                      className="filter-select"
                      style={{ width: '100%', padding: '8px 12px' }}
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                    >
                      <option value="Chapter II: Extension of Approval (EoA) 2026-27">Chapter II: Grant of Extension of Approval (EoA) 2026-27 for Existing Technical Institution</option>
                      <option value="Chapter I: Grant of Approval for New Technical Institution">Chapter I: Grant of Approval for New Technical Institution (Diploma/UG/PG)</option>
                      <option value="Chapter II: Increase in Intake / Introduction of New Course">Chapter II: Increase in Intake / Introduction of New Course in Emerging Areas</option>
                      <option value="Chapter II: Change of Site / Location of Campus">Chapter II: Change of Site / Location of Technical Campus</option>
                      <option value="Chapter II: Restoration of Intake under Break in EoA (Clause 2.16.1)">Chapter II: Restoration of Intake under Break in EoA (Clause 2.16.1)</option>
                      <option value="Chapter II: Closure of Institution / Program">Chapter II: Complete Closure of Program or Institution</option>
                    </select>
                  </div>

                  <div>
                    <label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#334155', display: 'block', marginBottom: 6 }}>
                      Technical Education Program (APH Chapter VI):
                    </label>
                    <select
                      className="filter-select"
                      style={{ width: '100%', padding: '8px 12px' }}
                      value={program}
                      onChange={(e) => setProgram(e.target.value)}
                    >
                      <option value="Engineering & Technology (Under Graduate / Post Graduate)">Engineering &amp; Technology (UG: B.Tech / PG: M.Tech)</option>
                      <option value="Management (MBA / PGDM)">Management (MBA / PGDM Programs)</option>
                      <option value="Computer Applications (MCA)">Computer Applications (MCA 2-Year Program)</option>
                      <option value="Pharmacy (B.Pharm / M.Pharm)">Pharmacy (B.Pharm / M.Pharm as per PCI/AICTE)</option>
                      <option value="Architecture & Planning (B.Arch / M.Arch)">Architecture &amp; Planning (B.Arch / M.Plan)</option>
                      <option value="Polytechnic (Engineering Diploma)">Polytechnic (Engineering Diploma 3-Year)</option>
                    </select>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                    <div>
                      <label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#334155', display: 'block', marginBottom: 6 }}>
                        Total Sanctioned Student Intake (All Years):
                      </label>
                      <input
                        type="number"
                        className="filter-select"
                        style={{ width: '100%', padding: '8px 12px' }}
                        value={intake}
                        onChange={(e) => setIntake(parseInt(e.target.value) || 0)}
                      />
                      <span style={{ fontSize: '0.72rem', color: '#64748b', display: 'block', marginTop: 4 }}>
                        Determines required faculty under 1:20 norm: <strong>{requiredFaculty} Faculty Members</strong>
                      </span>
                    </div>

                    <div>
                      <label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#334155', display: 'block', marginBottom: 6 }}>
                        Campus Location Classification (Annexure 3):
                      </label>
                      <select
                        className="filter-select"
                        style={{ width: '100%', padding: '8px 12px' }}
                        value={locationType}
                        onChange={(e) => setLocationType(e.target.value as any)}
                      >
                        <option value="Urban">Urban Area (Minimum 2.5 – 5.0 Continuous Acres)</option>
                        <option value="Metro">Mega / Metro City (Minimum 1.5 – 2.5 Continuous Acres)</option>
                        <option value="Rural">Rural Area (Minimum 7.5 Continuous Acres)</option>
                      </select>
                    </div>
                  </div>

                  {/* Active Application Conflict Alert Banner */}
                  {conflictingActiveApp && (
                    <div style={{
                      background: '#fffbeb',
                      border: '1px solid #fde68a',
                      borderLeft: '5px solid #d97706',
                      borderRadius: 6,
                      padding: '16px 18px',
                      marginTop: 8
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                        <Lock size={18} style={{ color: '#b45309', flexShrink: 0 }} />
                        <div style={{ fontSize: '0.88rem', fontWeight: 800, color: '#92400e' }}>
                          Active Application Underway — Duplicate Submission Restricted
                        </div>
                      </div>
                      <p style={{ fontSize: '0.8rem', color: '#78350f', lineHeight: 1.55, margin: '0 0 12px 0' }}>
                        Under <strong>AICTE Approval Process Handbook Regulations (Chapter II, Clause 2.1)</strong>, an institution cannot initiate or file a duplicate application for the same regulatory category while an earlier application is active. Apex Institute of Technology &amp; Management already has an active application currently under evaluation.
                      </p>

                      <div style={{
                        background: '#ffffff',
                        border: '1px solid #fcd34d',
                        borderRadius: 5,
                        padding: '10px 14px',
                        fontSize: '0.76rem',
                        marginBottom: 12
                      }}>
                        <div style={{ marginBottom: 3 }}>
                          <strong>Active Application ID:</strong> <span style={{ fontFamily: 'monospace', color: '#1e40af' }}>{conflictingActiveApp.id}</span>
                        </div>
                        <div style={{ marginBottom: 3 }}>
                          <strong>Application Title:</strong> {conflictingActiveApp.title}
                        </div>
                        <div style={{ marginBottom: 3 }}>
                          <strong>Current Status:</strong> <span style={{ color: '#b45309', fontWeight: 700 }}>{conflictingActiveApp.statusLabel}</span>
                        </div>
                        <div>
                          <strong>Filing Date &amp; Stage:</strong> {conflictingActiveApp.submittedDate} • {conflictingActiveApp.currentStage}
                        </div>
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
                        <Link
                          href="/institution"
                          className="btn btn-secondary btn-sm"
                          style={{ fontSize: '0.75rem', background: '#ffffff', border: '1px solid #f59e0b', color: '#b45309', fontWeight: 700 }}
                        >
                          <ArrowLeft size={13} /> View &amp; Manage Active Application
                        </Link>
                        <span style={{ fontSize: '0.72rem', color: '#92400e' }}>
                          Please respond to pending directives or await Committee hearing disposal.
                        </span>
                      </div>
                    </div>
                  )}

                  <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 14 }}>
                    <button
                      className="btn btn-primary"
                      disabled={!!conflictingActiveApp}
                      onClick={() => !conflictingActiveApp && setCurrentStep(2)}
                      style={{
                        opacity: conflictingActiveApp ? 0.6 : 1,
                        cursor: conflictingActiveApp ? 'not-allowed' : 'pointer'
                      }}
                      title={conflictingActiveApp ? 'An active application for this category is already in progress' : undefined}
                    >
                      {conflictingActiveApp ? (
                        <>
                          <Lock size={15} /> Active Application Exists — Submission Locked
                        </>
                      ) : (
                        <>
                          Next: Land &amp; Safety Norms (Ch VI) <ArrowRight size={15} />
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Step 2: Land & Building Safety (Chapter VI & Annexures 3, 4, 7) */}
            {currentStep === 2 && (
              <div className="card" style={{ background: '#ffffff', padding: 28 }}>
                <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#0f2942', marginBottom: 4 }}>
                  Step 2: Land Contiguity, PWD Stability &amp; Fire Safety (Annexures 3, 4 &amp; 7)
                </h3>
                <p style={{ fontSize: '0.8rem', color: '#64748b', marginBottom: 20 }}>
                  Upload registered land title deed, State PWD stability certificate (Clause 2.1), and unbroken Fire Safety NOC (Regulation 3.4).
                </p>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                  <div>
                    <label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#334155', display: 'block', marginBottom: 6 }}>
                      Total Continuous Campus Acreage in Institution Possession:
                    </label>
                    <input
                      type="text"
                      className="filter-select"
                      style={{ width: '100%', padding: '8px 12px' }}
                      value={landArea}
                      onChange={(e) => setLandArea(e.target.value)}
                    />
                    <span style={{ fontSize: '0.72rem', color: '#15803d', display: 'block', marginTop: 3 }}>
                      ✓ Meets {locationType} requirement of continuous parcel (Registered Lease Deed #402/1 with Sub-Registrar)
                    </span>
                  </div>

                  {/* Registered Land Deed */}
                  <FileUploadDropzone
                    label="1. Registered Land Title Deed &amp; Revenue Khasra Copy (Annexure 3):"
                    helperText="Must be registered with Sub-Registrar and certified as continuous, encumbrance-free parcel."
                    defaultFileName="Land_Title_Khasra_Deed_Registered.pdf"
                    onFileSelect={(file, meta) => {
                      if (meta) setLandDoc(meta);
                      else if (file) setLandDoc({ name: file.name, size: `${(file.size / (1024 * 1024)).toFixed(1)} MB` });
                    }}
                  />

                  {/* State PWD Certificate */}
                  <FileUploadDropzone
                    label="2. Building Structural Stability Certificate (APH Chapter II, Clause 2.1 &amp; Annexure 7):"
                    helperText="Mandatory certificate issued by an Executive Engineer of the State Public Works Department (PWD)."
                    defaultFileName="Apex_PWD_Structural_Stability_Cert.pdf"
                    onFileSelect={(file, meta) => {
                      if (meta) setPwdDoc(meta);
                      else if (file) setPwdDoc({ name: file.name, size: `${(file.size / (1024 * 1024)).toFixed(1)} MB` });
                    }}
                  />

                  {/* Fire Safety NOC */}
                  <FileUploadDropzone
                    label="3. Fire Safety Certificate / Renewal NOC (APH Regulation 3.4 &amp; Annexure 7):"
                    helperText="Must cover entire Academic Year 2026-27 without lapse. AI Pre-Scrutiny scans the validity dates automatically."
                    defaultFileName={fireDoc.name}
                    onFileSelect={(file, meta) => {
                      if (meta) setFireDoc(meta);
                      else if (file) setFireDoc({ name: file.name, size: `${(file.size / (1024 * 1024)).toFixed(1)} MB` });
                    }}
                  />

                  {/* Interactive Pre-Scrutiny Demo Document Switcher */}
                  <div style={{
                    background: '#f8fafc',
                    border: isFireDocExpired ? '1.5px solid #fca5a5' : '1.5px solid #86efac',
                    borderRadius: 8,
                    padding: '16px 18px',
                    boxShadow: '0 1px 3px rgba(0,0,0,0.03)'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10, flexWrap: 'wrap', gap: 8 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <Sparkles size={16} style={{ color: '#d97706' }} />
                        <span style={{ fontSize: '0.82rem', fontWeight: 800, color: '#0f2942' }}>
                          Pre-Scrutiny Date Detection Demo: Test Statutory Expiry Engine
                        </span>
                      </div>
                      <span style={{ fontSize: '0.72rem', color: '#64748b' }}>
                        Click either document to see the AI Pre-Scrutiny test detect certificate validity:
                      </span>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 10 }}>
                      {/* Expired Doc Button */}
                      <button
                        type="button"
                        onClick={() => setFireDoc({
                          name: 'Fire_Safety_NOC_EXPIRED.pdf',
                          url: '/docs/Fire_Safety_NOC_EXPIRED.pdf',
                          size: '2.5 MB'
                        })}
                        style={{
                          padding: '10px 14px',
                          borderRadius: 6,
                          background: isFireDocExpired ? '#fef2f2' : '#ffffff',
                          border: `2px solid ${isFireDocExpired ? '#ef4444' : '#e2e8f0'}`,
                          textAlign: 'left',
                          cursor: 'pointer',
                          transition: 'all 0.15s ease'
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 }}>
                          <span style={{ fontSize: '0.78rem', fontWeight: 700, color: isFireDocExpired ? '#b91c1c' : '#334155', display: 'flex', alignItems: 'center', gap: 6 }}>
                            <AlertTriangle size={14} style={{ color: '#dc2626' }} />
                            1. Demo Doc: Date Expired
                          </span>
                          {isFireDocExpired ? (
                            <span className="badge badge-danger" style={{ fontSize: '0.62rem', padding: '2px 6px' }}>Active Selection</span>
                          ) : (
                            <span style={{ fontSize: '0.68rem', color: '#64748b' }}>Click to Test</span>
                          )}
                        </div>
                        <div style={{ fontSize: '0.72rem', color: '#475569', fontFamily: 'monospace' }}>
                          Fire_Safety_NOC_EXPIRED.pdf
                        </div>
                        <div style={{ fontSize: '0.68rem', color: '#dc2626', marginTop: 3, fontWeight: 600 }}>
                          Issue: 15-May-2024 • Expired: 14-May-2025 (Lapsed)
                        </div>
                      </button>

                      {/* Valid Doc Button */}
                      <button
                        type="button"
                        onClick={() => setFireDoc({
                          name: 'Fire_Safety_NOC_VALID.pdf',
                          url: '/docs/Fire_Safety_NOC_VALID.pdf',
                          size: '2.5 MB'
                        })}
                        style={{
                          padding: '10px 14px',
                          borderRadius: 6,
                          background: isFireDocValid ? '#f0fdf4' : '#ffffff',
                          border: `2px solid ${isFireDocValid ? '#22c55e' : '#e2e8f0'}`,
                          textAlign: 'left',
                          cursor: 'pointer',
                          transition: 'all 0.15s ease'
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 }}>
                          <span style={{ fontSize: '0.78rem', fontWeight: 700, color: isFireDocValid ? '#15803d' : '#334155', display: 'flex', alignItems: 'center', gap: 6 }}>
                            <CheckCircle2 size={14} style={{ color: '#16a34a' }} />
                            2. Demo Doc: Valid &amp; Correct
                          </span>
                          {isFireDocValid ? (
                            <span className="badge badge-success" style={{ fontSize: '0.62rem', padding: '2px 6px' }}>Active Selection</span>
                          ) : (
                            <span style={{ fontSize: '0.68rem', color: '#64748b' }}>Click to Test</span>
                          )}
                        </div>
                        <div style={{ fontSize: '0.72rem', color: '#475569', fontFamily: 'monospace' }}>
                          Fire_Safety_NOC_VALID.pdf
                        </div>
                        <div style={{ fontSize: '0.68rem', color: '#16a34a', marginTop: 3, fontWeight: 600 }}>
                          Issue: 10-Oct-2026 • Valid Thru: 30-Jun-2027 (Compliant)
                        </div>
                      </button>
                    </div>

                    {/* Live Optical Character Recognition (OCR) Diagnostic Card */}
                    <div style={{
                      marginTop: 12,
                      padding: '12px 14px',
                      borderRadius: 6,
                      background: isFireDocExpired ? '#fff5f5' : '#f0fdf4',
                      border: `1px solid ${isFireDocExpired ? '#fecaca' : '#bbf7d0'}`,
                      fontSize: '0.75rem'
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6, flexWrap: 'wrap', gap: 6 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontWeight: 700, color: isFireDocExpired ? '#b91c1c' : '#15803d' }}>
                          {isFireDocExpired ? (
                            <>
                              <AlertCircle size={15} style={{ color: '#dc2626' }} />
                              <span>AI PRE-SCRUTINY VERDICT: STATUTORY DEFECT (EXPIRED NOC DETECTED)</span>
                            </>
                          ) : (
                            <>
                              <CheckCircle2 size={15} style={{ color: '#16a34a' }} />
                              <span>AI PRE-SCRUTINY VERDICT: STATUTORY NORM COMPLIANT</span>
                            </>
                          )}
                        </div>
                        <button
                          type="button"
                          className="btn btn-secondary btn-sm"
                          style={{ fontSize: '0.7rem', padding: '3px 8px', gap: 4 }}
                          onClick={() => setViewingDoc({
                            name: fireDoc.name,
                            url: fireDoc.url,
                            category: 'Safety & Compliance',
                            tier: isFireDocExpired ? 4 : 1,
                            issuer: 'State Fire Services Directorate (UP)',
                            statusLabel: isFireDocExpired ? '⚠ Lapsed Certificate (Expired 14-May-2025)' : '✓ Valid Certificate (Expires 30-Jun-2027)',
                            isFlagged: isFireDocExpired,
                            flagReason: isFireDocExpired ? fireDocExtractedData.message : undefined
                          })}
                        >
                          <Eye size={12} /> Inspect PDF in Viewer
                        </button>
                      </div>

                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 8, marginBottom: 6 }}>
                        <div>
                          <span style={{ color: '#64748b' }}>Dispatch Ref:</span> <span style={{ fontFamily: 'monospace', fontWeight: 600 }}>{fireDocExtractedData.docNumber}</span>
                        </div>
                        <div>
                          <span style={{ color: '#64748b' }}>Date of Issue:</span> <strong>{fireDocExtractedData.issueDate}</strong>
                        </div>
                        <div>
                          <span style={{ color: '#64748b' }}>Certificate Expiry:</span> <strong style={{ color: isFireDocExpired ? '#dc2626' : '#16a34a' }}>{fireDocExtractedData.expiryDate}</strong>
                        </div>
                        <div>
                          <span style={{ color: '#64748b' }}>Academic Year Coverage:</span> <strong style={{ color: isFireDocExpired ? '#dc2626' : '#16a34a' }}>{isFireDocExpired ? 'NON-COMPLIANT (Lapsed)' : 'COMPLIANT (Full AY 2026-27)'}</strong>
                        </div>
                      </div>

                      <div style={{ color: isFireDocExpired ? '#991b1b' : '#166534', borderTop: `1px solid ${isFireDocExpired ? '#fed7d7' : '#dcfce7'}`, paddingTop: 6, lineHeight: 1.45 }}>
                        <strong>Statutory Finding:</strong> {fireDocExtractedData.message} ({fireDocExtractedData.ruleCitation})
                      </div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 12 }}>
                    <button className="btn btn-secondary" onClick={() => setCurrentStep(1)}>
                      <ArrowLeft size={15} /> Back
                    </button>
                    <button className="btn btn-primary" onClick={() => setCurrentStep(3)}>
                      Next: Faculty Cadre &amp; FSR (Ch VI) <ArrowRight size={15} />
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Step 3: Faculty Roster, FSR & Cadre Norms (Chapter VI & Annexure 5) */}
            {currentStep === 3 && (
              <div className="card" style={{ background: '#ffffff', padding: 28 }}>
                <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#0f2942', marginBottom: 4 }}>
                  Step 3: Student-to-Faculty Ratio (1:20 FSR) &amp; Cadre Proportion (Annexure 5)
                </h3>
                <p style={{ fontSize: '0.8rem', color: '#64748b', marginBottom: 20 }}>
                  Mandated under APH Appendix 7 (1:2:6 cadre proportion). Faculty must be paid as per 7th CPC norms via bank transfer.
                </p>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                  <div>
                    <label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#334155', display: 'block', marginBottom: 6 }}>
                      Total Regular Full-Time Faculty Currently on Rolls:
                    </label>
                    <input
                      type="number"
                      className="filter-select"
                      style={{ width: '100%', padding: '8px 12px' }}
                      value={facultyCount}
                      onChange={(e) => setFacultyCount(parseInt(e.target.value) || 0)}
                    />
                  </div>

                  {/* FSR & Cadre Calculator Breakdown Card */}
                  <div style={{
                    background: '#f8fafc',
                    border: '1px solid #bfdbfe',
                    borderRadius: 6,
                    padding: '14px 18px'
                  }}>
                    <div style={{ fontSize: '0.78rem', fontWeight: 700, color: '#1e40af', marginBottom: 8 }}>
                      ★ APH APPENDIX 7 MATHEMATICAL COMPLIANCE MATRIX:
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, textAlign: 'center' }}>
                      <div style={{ background: '#ffffff', padding: '10px', borderRadius: 4, border: '1px solid #e2e8f0' }}>
                        <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0f2942' }}>{requiredFaculty}</div>
                        <div style={{ fontSize: '0.68rem', color: '#64748b' }}>Total Required (1:20)</div>
                      </div>
                      <div style={{ background: '#ffffff', padding: '10px', borderRadius: 4, border: '1px solid #e2e8f0' }}>
                        <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#1e40af' }}>{reqProfessors}</div>
                        <div style={{ fontSize: '0.68rem', color: '#64748b' }}>Professors (1 Part)</div>
                      </div>
                      <div style={{ background: '#ffffff', padding: '10px', borderRadius: 4, border: '1px solid #e2e8f0' }}>
                        <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#1e40af' }}>{reqAssocProfessors}</div>
                        <div style={{ fontSize: '0.68rem', color: '#64748b' }}>Assoc. Profs (2 Parts)</div>
                      </div>
                      <div style={{ background: '#ffffff', padding: '10px', borderRadius: 4, border: '1px solid #e2e8f0' }}>
                        <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#1e40af' }}>{reqAsstProfessors}</div>
                        <div style={{ fontSize: '0.68rem', color: '#64748b' }}>Asst. Profs (6 Parts)</div>
                      </div>
                    </div>
                  </div>

                  <FileUploadDropzone
                    label="Upload Audited Regular Faculty Roster &amp; Form-16 List (PDF):"
                    helperText="Certified by a Chartered Accountant with valid ICAI UDIN and Principal's digital signature."
                    defaultFileName="Faculty_Aadhaar_Form16_AuditedList.pdf"
                    onFileSelect={(file, meta) => {
                      if (meta) setFacultyDoc(meta);
                      else if (file) setFacultyDoc({ name: file.name, size: `${(file.size / (1024 * 1024)).toFixed(1)} MB` });
                    }}
                  />

                  <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 12 }}>
                    <button className="btn btn-secondary" onClick={() => setCurrentStep(2)}>
                      <ArrowLeft size={15} /> Back
                    </button>
                    <button className="btn btn-primary" onClick={() => setCurrentStep(4)}>
                      Next: Affidavits &amp; Statutory Committees <ArrowRight size={15} />
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Step 4: Statutory Committees & Affidavits (Annexures 9-18 & Affidavits 1-13) */}
            {currentStep === 4 && (
              <div className="card" style={{ background: '#ffffff', padding: 28 }}>
                <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#0f2942', marginBottom: 4 }}>
                  Step 4: Statutory Legal Affidavits &amp; Mandatory Committees
                </h3>
                <p style={{ fontSize: '0.8rem', color: '#64748b', marginBottom: 20 }}>
                  Select applicable statutory affidavits (Affidavits 1–13) and verify mandatory student protection committees.
                </p>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
                  {/* Statutory Committees Checkboxes */}
                  <div>
                    <label style={{ fontSize: '0.8rem', fontWeight: 700, color: '#0f2942', display: 'block', marginBottom: 8 }}>
                      Mandatory Statutory Committees Constituted (Annexures 9–12):
                    </label>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 10 }}>
                      {[
                        { key: 'icc', label: 'Internal Complaints Committee (ICC)', desc: 'Sexual Harassment Prevention Act 2013' },
                        { key: 'antiRagging', label: 'Anti-Ragging Committee & Squad', desc: 'Annual affidavits from all students/parents' },
                        { key: 'sgrc', label: 'Student Grievance Redressal (SGRC)', desc: 'With Ombudsperson appointment' },
                        { key: 'scst', label: 'SC/ST Prevention of Atrocities Cell', desc: 'Monitoring cell as per GoI guidelines' },
                      ].map((item) => (
                        <label
                          key={item.key}
                          style={{
                            display: 'flex',
                            alignItems: 'flex-start',
                            gap: 10,
                            padding: '10px 12px',
                            background: '#f8fafc',
                            border: '1px solid #e2e8f0',
                            borderRadius: 6,
                            cursor: 'pointer'
                          }}
                        >
                          <input
                            type="checkbox"
                            checked={(committees as any)[item.key]}
                            onChange={(e) => setCommittees({ ...committees, [item.key]: e.target.checked })}
                            style={{ marginTop: 2 }}
                          />
                          <div>
                            <div style={{ fontSize: '0.8rem', fontWeight: 600, color: '#0f2942' }}>{item.label}</div>
                            <div style={{ fontSize: '0.7rem', color: '#64748b' }}>{item.desc}</div>
                          </div>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Statutory Affidavits Multi-Select */}
                  <div>
                    <label style={{ fontSize: '0.8rem', fontWeight: 700, color: '#0f2942', display: 'block', marginBottom: 8 }}>
                      Statutory Affidavits Sworn on Rs. 100/- Non-Judicial Stamp Paper:
                    </label>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 8 }}>
                      {[
                        'Affidavit-1 (Common Submission)',
                        'Affidavit-2 (Land Title & Contiguity)',
                        'Affidavit-3 (Building Plan NBC)',
                        'Affidavit-4 (Fire Safety & Building Stability)',
                        'Affidavit-5 (7th CPC Faculty Pay)',
                        'Affidavit-6 (Anti-Ragging Safeguard)',
                        'Affidavit-7 (ICC Constitution)',
                        'Affidavit-13 (Emergency Health & Sanitation)'
                      ].map((aff) => {
                        const isChecked = selectedAffidavits.includes(aff);
                        return (
                          <div
                            key={aff}
                            onClick={() => toggleAffidavit(aff)}
                            style={{
                              padding: '8px 12px',
                              background: isChecked ? '#eff6ff' : '#ffffff',
                              border: `1px solid ${isChecked ? '#93c5fd' : '#e2e8f0'}`,
                              borderRadius: 4,
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'space-between',
                              fontSize: '0.78rem',
                              fontWeight: isChecked ? 600 : 500,
                              color: isChecked ? '#1e40af' : '#475569'
                            }}
                          >
                            <span>{aff}</span>
                            {isChecked && <Check size={14} style={{ color: '#1e40af' }} />}
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Upload Combined Signed Affidavit PDF */}
                  <FileUploadDropzone
                    label="Upload Sworn Statutory Compliance Affidavit Document (PDF):"
                    helperText="Duly sworn before a First Class Judicial Magistrate or Public Notary with official stamp."
                    defaultFileName="Statutory_Compliance_Affidavit.pdf"
                    onFileSelect={(file, meta) => {
                      if (meta) setAffidavitDoc(meta);
                      else if (file) setAffidavitDoc({ name: file.name, size: `${(file.size / (1024 * 1024)).toFixed(1)} MB` });
                    }}
                  />

                  <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 12 }}>
                    <button className="btn btn-secondary" onClick={() => setCurrentStep(3)}>
                      <ArrowLeft size={15} /> Back
                    </button>
                    <button className="btn btn-primary" onClick={() => setCurrentStep(5)}>
                      Next: Pre-Scrutiny Audit &amp; Submit <ArrowRight size={15} />
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Step 5: Final Pre-Scrutiny Audit & Formal Submission (Clause 2.23.1) */}
            {currentStep === 5 && (
              <div className="card" style={{ background: '#ffffff', padding: 28 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16, flexWrap: 'wrap', gap: 10 }}>
                  <div>
                    <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#0f2942', margin: 0 }}>
                      Step 5: Automated Pre-Scrutiny Verification &amp; Final Declaration
                    </h3>
                    <p style={{ fontSize: '0.8rem', color: '#64748b', marginTop: 4 }}>
                      Pre-submission automated audit according to AICTE Approval Process Handbook (Clause 2.23.1).
                    </p>
                  </div>
                  <span
                    className={`badge ${isFireDocExpired ? 'badge-danger' : 'badge-success'}`}
                    style={{ fontSize: '0.82rem', padding: '5px 12px', fontWeight: 800 }}
                  >
                    Norms Readiness: {computedReadinessScore}% {isFireDocExpired ? '(Deficiency Flagged)' : 'Compliant'}
                  </span>
                </div>

                {/* Pre-Scrutiny Statutory Defect Alert if Expired Doc Selected */}
                {isFireDocExpired && (
                  <div style={{
                    background: '#fef2f2',
                    border: '1.5px solid #fca5a5',
                    borderLeft: '5px solid #dc2626',
                    borderRadius: 6,
                    padding: '16px 18px',
                    marginBottom: 20
                  }}>
                    <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
                      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
                        <AlertTriangle size={22} style={{ color: '#dc2626', flexShrink: 0, marginTop: 2 }} />
                        <div>
                          <div style={{ fontSize: '0.92rem', fontWeight: 800, color: '#991b1b' }}>
                            AI Pre-Scrutiny Engine Alert: Date Expired Statutory Certificate
                          </div>
                          <p style={{ fontSize: '0.8rem', color: '#7f1d1d', margin: '4px 0 8px 0', lineHeight: 1.5 }}>
                            The AI OCR engine extracted validity dates for <strong>{fireDoc.name}</strong>: Issued on <strong>15-May-2024</strong>, <strong>Expired on 14-May-2025</strong> (lapsed 500+ days ago). Under <strong>AICTE APH Regulation 3.4 &amp; Appendix 3</strong>, technical institutions must maintain unbroken statutory clearance throughout Academic Year 2026–27.
                          </p>
                          <div style={{ fontSize: '0.74rem', color: '#991b1b', fontWeight: 600 }}>
                            Council Action: If submitted now, the Scrutiny Committee will issue Deficiency Directive NOT-1029 and schedule an appellate hearing.
                          </div>
                        </div>
                      </div>

                      <div style={{ display: 'flex', gap: 8 }}>
                        <button
                          type="button"
                          className="btn btn-sm"
                          onClick={() => setFireDoc({
                            name: 'Fire_Safety_NOC_VALID.pdf',
                            url: '/docs/Fire_Safety_NOC_VALID.pdf',
                            size: '2.5 MB'
                          })}
                          style={{
                            background: '#15803d',
                            color: '#ffffff',
                            fontWeight: 700,
                            fontSize: '0.78rem',
                            display: 'flex',
                            alignItems: 'center',
                            gap: 6,
                            padding: '8px 14px',
                            boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
                          }}
                        >
                          <CheckCircle2 size={15} /> Switch to Valid Demo NOC (30-Jun-2027)
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                <div style={{
                  background: '#f8fafc',
                  border: '1px solid #bfdbfe',
                  padding: 18,
                  borderRadius: 6,
                  marginBottom: 20
                }}>
                  <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#1e40af', marginBottom: 12, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <span>★ AUTOMATED PRE-SUBMISSION AUDIT REPORT:</span>
                    <span style={{ fontSize: '0.72rem', color: '#64748b' }}>
                      APH 2024–27 Chapters I, II &amp; VI Standards Check
                    </span>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: 10, fontSize: '0.8rem', color: '#334155' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <CheckCircle2 size={16} style={{ color: '#16a34a', flexShrink: 0 }} />
                      <span><strong>Land &amp; Campus Title:</strong> Passed ({landDoc.name} — continuous {landArea} exceeds {locationType} requirement)</span>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <CheckCircle2 size={16} style={{ color: '#16a34a', flexShrink: 0 }} />
                      <span><strong>Building Structural Stability:</strong> Passed ({pwdDoc.name} — State PWD Executive Engineer certificate attached)</span>
                    </div>

                    {/* Dynamic Fire Safety Check Row */}
                    <div style={{
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: 8,
                      background: isFireDocExpired ? '#fff1f2' : '#f0fdf4',
                      padding: '10px 14px',
                      borderRadius: 5,
                      border: `1.5px solid ${isFireDocExpired ? '#fecdd3' : '#bbf7d0'}`
                    }}>
                      {isFireDocExpired ? (
                        <AlertCircle size={17} style={{ color: '#e11d48', flexShrink: 0, marginTop: 2 }} />
                      ) : (
                        <CheckCircle2 size={17} style={{ color: '#16a34a', flexShrink: 0, marginTop: 2 }} />
                      )}
                      <div style={{ flex: 1 }}>
                        <div style={{ fontWeight: 700, color: isFireDocExpired ? '#9f1239' : '#14532d', display: 'flex', alignItems: 'center', gap: 6 }}>
                          <span>Fire Safety Clearance (Regulation 3.4):</span>
                          <span className={`badge ${isFireDocExpired ? 'badge-danger' : 'badge-success'}`} style={{ fontSize: '0.66rem' }}>
                            {isFireDocExpired ? 'FAILED — EXPIRED DATE DETECTED' : 'PASSED — UNBROKEN VALIDITY'}
                          </span>
                        </div>
                        <div style={{ fontSize: '0.74rem', color: isFireDocExpired ? '#be123c' : '#15803d', marginTop: 3 }}>
                          {isFireDocExpired ? (
                            <>
                              Document <code>{fireDoc.name}</code> expired on <strong>14-May-2025</strong>. AICTE APH Regulation 3.4 prohibits approval on lapsed clearances.
                            </>
                          ) : (
                            <>
                              Document <code>{fireDoc.name}</code> verified with State Fire Services. Unbroken validity confirmed through <strong>30-Jun-2027</strong> covering full Academic Year 2026-27.
                            </>
                          )}
                        </div>
                      </div>
                      <button
                        type="button"
                        className="btn btn-secondary btn-sm"
                        style={{ fontSize: '0.7rem', padding: '3px 8px', gap: 4 }}
                        onClick={() => setViewingDoc({
                          name: fireDoc.name,
                          url: fireDoc.url,
                          category: 'Safety & Compliance',
                          tier: isFireDocExpired ? 4 : 1,
                          issuer: 'State Fire Services Directorate (UP)',
                          statusLabel: isFireDocExpired ? '⚠ Lapsed Certificate (Expired 14-May-2025)' : '✓ Valid Certificate (Expires 30-Jun-2027)',
                          isFlagged: isFireDocExpired,
                          flagReason: isFireDocExpired ? fireDocExtractedData.message : undefined
                        })}
                      >
                        <Eye size={12} /> Inspect PDF
                      </button>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <CheckCircle2 size={16} style={{ color: '#16a34a', flexShrink: 0 }} />
                      <span><strong>1:20 Student-Faculty Ratio:</strong> Passed ({facultyCount} faculty on rolls vs {requiredFaculty} required under APH Appendix 7)</span>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <CheckCircle2 size={16} style={{ color: '#16a34a', flexShrink: 0 }} />
                      <span><strong>Statutory Committees &amp; Affidavits:</strong> Complete (4 committees confirmed, {selectedAffidavits.length} affidavits declared)</span>
                    </div>
                  </div>
                </div>

                {/* Solemn Declaration */}
                <div style={{
                  background: '#fffbeb',
                  border: '1px solid #fde68a',
                  padding: '12px 16px',
                  borderRadius: 6,
                  fontSize: '0.78rem',
                  color: '#92400e',
                  marginBottom: 22
                }}>
                  <strong>Solemn Declaration:</strong> I, the authorized Head of Institution / Secretary of the Sponsoring Body, certify that all information submitted in this application complies strictly with the AICTE Act 1987 and Approval Process Handbook 2024–27. Any wilful omission shall attract penal action under APH Chapter VII.
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <button className="btn btn-secondary" onClick={() => setCurrentStep(4)}>
                    <ArrowLeft size={15} /> Back
                  </button>
                  <button
                    className={`btn ${isFireDocExpired ? 'btn-secondary' : 'btn-primary'}`}
                    disabled={submitting}
                    onClick={handleSubmit}
                    style={{
                      fontSize: '0.85rem',
                      padding: '10px 22px',
                      background: isFireDocExpired ? '#fffbeb' : undefined,
                      border: isFireDocExpired ? '1.5px solid #f59e0b' : undefined,
                      color: isFireDocExpired ? '#b45309' : undefined,
                      fontWeight: 700
                    }}
                  >
                    {submitting ? (
                      <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                        <span className="spinner" /> Encrypting &amp; Lodging Dossier...
                      </span>
                    ) : isFireDocExpired ? (
                      <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                        <AlertTriangle size={15} style={{ color: '#d97706' }} /> Lodge with Flagged Deficiency (Committee Notice Will Follow)
                      </span>
                    ) : (
                      <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                        <Send size={15} /> Lodge Formal Application to Scrutiny Committee
                      </span>
                    )}
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </main>

      {/* Document Viewer Modal */}
      {viewingDoc && (
        <DocumentViewerModal
          onClose={() => setViewingDoc(null)}
          document={viewingDoc}
        />
      )}

      {/* Footer */}
      <footer style={{
        background: '#ffffff',
        borderTop: '1px solid #e2e8f0',
        padding: '16px 32px',
        textAlign: 'center',
        fontSize: '0.74rem',
        color: '#64748b'
      }}>
        All India Council for Technical Education • Approval Process Handbook 2024-25 to 2026-27
      </footer>
    </div>
  );
}
