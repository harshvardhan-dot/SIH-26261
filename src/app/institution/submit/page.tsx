'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Building2, Upload, FileCheck, CheckCircle2, AlertTriangle,
  ArrowRight, ArrowLeft, Shield, FileText, Send, Check,
  Sparkles, Download, HelpCircle
} from 'lucide-react';
import LanguageSwitcher from '@/components/LanguageSwitcher';
import FileUploadDropzone from '@/components/FileUploadDropzone';
import DocumentViewerModal from '@/components/DocumentViewerModal';

export default function InstitutionSubmitPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  // Form State
  const [category, setCategory] = useState('Extension of Approval (EoA)');
  const [intake, setIntake] = useState(720);
  const [landArea, setLandArea] = useState('7.85 Acres');
  const [facultyCount, setFacultyCount] = useState(38);
  const [landDoc, setLandDoc] = useState<{ name: string; url?: string; size?: string }>({
    name: 'Land_Title_Khasra_Deed_Registered.pdf',
    url: '/docs/Land_Title_Khasra_Deed_Registered.pdf',
    size: '4.2 MB'
  });
  const [facultyDoc, setFacultyDoc] = useState<{ name: string; url?: string; size?: string }>({
    name: 'Faculty_Aadhaar_Form16_AuditedList.pdf',
    url: '/docs/Faculty_Aadhaar_Form16_AuditedList.pdf',
    size: '5.8 MB'
  });
  const [viewingDoc, setViewingDoc] = useState<any>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setTimeout(() => {
      setSubmitting(false);
      setSubmitted(true);
    }, 1200);
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

      {/* Top Navbar */}
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
              <div style={{ fontSize: '0.9rem', fontWeight: 700, color: '#0f172a' }}>
                Apex Institute of Technology & Management
              </div>
              <div style={{ fontSize: '0.72rem', color: '#64748b' }}>
                PID: 1-102938475 • Submission Portal
              </div>
            </div>
          </Link>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <LanguageSwitcher compact />
          <Link href="/institution" className="btn btn-secondary btn-sm">
            <ArrowLeft size={14} /> Back to Dashboard
          </Link>
        </div>
      </header>

      {/* Form Container */}
      <main style={{ flex: 1, padding: '32px 20px', maxWidth: 960, margin: '0 auto', width: '100%' }}>
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
            <span className="badge badge-success" style={{ marginBottom: 12 }}>Submission Acknowledged</span>
            <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#0f2942', marginBottom: 8 }}>
              Application for Extension of Approval (EoA) 2026-27 Submitted
            </h2>
            <p style={{ fontSize: '0.85rem', color: '#475569', maxWidth: 540, margin: '0 auto 24px', lineHeight: 1.6 }}>
              Your application dossier has been queued for official AICTE Scrutiny Committee evaluation.
              An automated audit trail entry with digital submission timestamp has been generated.
            </p>

            <div style={{
              background: '#f8fafc',
              border: '1px solid #e2e8f0',
              padding: '16px 20px',
              borderRadius: 6,
              maxWidth: 460,
              margin: '0 auto 28px',
              fontFamily: 'monospace',
              fontSize: '0.8rem',
              textAlign: 'left'
            }}>
              <div><strong>Application No:</strong> AICTE/AB/EoA/2026-27/1-102938475</div>
              <div><strong>Filing Timestamp:</strong> {new Date().toLocaleString()}</div>
              <div><strong>Pre-Scrutiny Score:</strong> 82% (Passed threshold)</div>
              <div><strong>Assigned Bureau:</strong> Northern Regional Office (Kanpur)</div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'center', gap: 12 }}>
              <Link href="/institution" className="btn btn-secondary">
                Return to Workspace
              </Link>
              <button className="btn btn-primary" onClick={() => window.print()}>
                <Download size={15} /> Download Submission Acknowledgment
              </button>
            </div>
          </div>
        ) : (
          <div>
            {/* Step Progress Bar */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(4, 1fr)',
              gap: 8,
              marginBottom: 28
            }}>
              {[
                { num: 1, label: 'Approval Category' },
                { num: 2, label: 'Land & Infrastructure' },
                { num: 3, label: 'Faculty & Cadre' },
                { num: 4, label: 'Review & Pre-Scrutiny' },
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
                      padding: '10px 12px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 8,
                      boxShadow: isActive ? '0 1px 3px rgba(30,64,175,0.1)' : 'none'
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
                    <span style={{ fontSize: '0.75rem', fontWeight: isActive ? 700 : 500, color: isActive ? '#0f2942' : '#64748b' }}>
                      {step.label}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Step 1: Category & Intake */}
            {currentStep === 1 && (
              <div className="card" style={{ background: '#ffffff', padding: 28 }}>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0f2942', marginBottom: 4 }}>
                  Step 1: Select Approval Category & Approved Intake
                </h3>
                <p style={{ fontSize: '0.8rem', color: '#64748b', marginBottom: 20 }}>
                  Choose the regulatory approval stream under Approval Process Handbook (APH 2024-27).
                </p>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                  <div>
                    <label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#334155', display: 'block', marginBottom: 6 }}>
                      Application Approval Category:
                    </label>
                    <select
                      className="filter-select"
                      style={{ width: '100%' }}
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                    >
                      <option value="Extension of Approval (EoA)">Extension of Approval (EoA) 2026-27</option>
                      <option value="Increase in Intake / New Course">Increase in Intake / Introduction of New Course</option>
                      <option value="Change of Site / Location">Change of Site / Location of Technical Campus</option>
                      <option value="Closure of Institution / Program">Closure of Program or Institution</option>
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
                        style={{ width: '100%' }}
                        value={intake}
                        onChange={(e) => setIntake(parseInt(e.target.value) || 0)}
                      />
                    </div>
                    <div>
                      <label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#334155', display: 'block', marginBottom: 6 }}>
                        Academic Year:
                      </label>
                      <input
                        type="text"
                        disabled
                        value="2026-2027 (Extension of Approval)"
                        className="filter-select"
                        style={{ width: '100%', background: '#f8fafc', color: '#64748b' }}
                      />
                    </div>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 12 }}>
                    <button className="btn btn-primary" onClick={() => setCurrentStep(2)}>
                      Next: Land & Infrastructure <ArrowRight size={15} />
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Step 2: Land & Infrastructure */}
            {currentStep === 2 && (
              <div className="card" style={{ background: '#ffffff', padding: 28 }}>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0f2942', marginBottom: 4 }}>
                  Step 2: Land Title & Campus Infrastructure Upload
                </h3>
                <p style={{ fontSize: '0.8rem', color: '#64748b', marginBottom: 20 }}>
                  Upload registered land deed, revenue khasra copy, and building stability certificate.
                </p>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                  <div>
                    <label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#334155', display: 'block', marginBottom: 6 }}>
                      Total Continuous Campus Acreage:
                    </label>
                    <input
                      type="text"
                      className="filter-select"
                      style={{ width: '100%' }}
                      value={landArea}
                      onChange={(e) => setLandArea(e.target.value)}
                    />
                    <span style={{ fontSize: '0.72rem', color: '#15803d', display: 'block', marginTop: 3 }}>
                      ✓ Meets urban engineering requirement of minimum 5.0 acres
                    </span>
                  </div>

                  <FileUploadDropzone
                    label="Upload Registered Land Title Deed & Khasra Record (PDF):"
                    helperText="Upload official lease deed or registered ownership document with sub-registrar endorsement."
                    defaultFileName="Land_Title_Khasra_Deed_Registered.pdf"
                    onFileSelect={(file, meta) => {
                      if (meta) {
                        setLandDoc(meta);
                      } else if (file) {
                        setLandDoc({ name: file.name, size: `${(file.size / (1024 * 1024)).toFixed(1)} MB` });
                      }
                    }}
                  />
                  {landDoc.url && (
                    <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: -6 }}>
                      <button
                        type="button"
                        onClick={() => setViewingDoc({
                          name: landDoc.name,
                          url: landDoc.url,
                          tier: 1,
                          category: 'Land Title & Possession',
                          statusLabel: 'Valid & Verified',
                          size: landDoc.size || '4.2 MB',
                          issuer: 'Sub-Registrar Greater Noida, Gautam Buddha Nagar',
                          authorityMatch: 'IGRS UP e-Stamping Gateway (Confirmed Deed #402/1)'
                        })}
                        className="btn btn-secondary btn-sm"
                        style={{ fontSize: '0.75rem', gap: 6 }}
                      >
                        <FileText size={13} /> View Attached Document ({landDoc.name})
                      </button>
                    </div>
                  )}

                  <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 12 }}>
                    <button className="btn btn-secondary" onClick={() => setCurrentStep(1)}>
                      <ArrowLeft size={15} /> Back
                    </button>
                    <button className="btn btn-primary" onClick={() => setCurrentStep(3)}>
                      Next: Faculty & Cadre Roster <ArrowRight size={15} />
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Step 3: Faculty & Cadre Roster */}
            {currentStep === 3 && (
              <div className="card" style={{ background: '#ffffff', padding: 28 }}>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0f2942', marginBottom: 4 }}>
                  Step 3: Regular Faculty Roster & Form-16 Audit List
                </h3>
                <p style={{ fontSize: '0.8rem', color: '#64748b', marginBottom: 20 }}>
                  Upload full-time regular faculty records with Aadhaar/PAN linkage to verify FSR norms.
                </p>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                  <div>
                    <label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#334155', display: 'block', marginBottom: 6 }}>
                      Total Regular Faculty Currently on Rolls:
                    </label>
                    <input
                      type="number"
                      className="filter-select"
                      style={{ width: '100%' }}
                      value={facultyCount}
                      onChange={(e) => setFacultyCount(parseInt(e.target.value) || 0)}
                    />
                    <span style={{ fontSize: '0.72rem', color: '#64748b', display: 'block', marginTop: 3 }}>
                      Required for 720 students under 1:20 norm: <strong>36 Faculty Members</strong> (Compliant: 38 Available)
                    </span>
                  </div>

                  <FileUploadDropzone
                    label="Upload Regular Faculty Roster & Form-16 List (PDF):"
                    helperText="Must be signed by Principal & certified by a Chartered Accountant with valid UDIN."
                    defaultFileName="Faculty_Aadhaar_Form16_AuditedList.pdf"
                    onFileSelect={(file, meta) => {
                      if (meta) {
                        setFacultyDoc(meta);
                      } else if (file) {
                        setFacultyDoc({ name: file.name, size: `${(file.size / (1024 * 1024)).toFixed(1)} MB` });
                      }
                    }}
                  />
                  {facultyDoc.url && (
                    <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: -6 }}>
                      <button
                        type="button"
                        onClick={() => setViewingDoc({
                          name: facultyDoc.name,
                          url: facultyDoc.url,
                          tier: 1,
                          category: 'Faculty Cadre & Form-16 Audit',
                          statusLabel: 'Audited & Validated',
                          size: facultyDoc.size || '5.8 MB',
                          issuer: 'Statutory CA Auditor (UDIN: 24089123AAAA0912)',
                          authorityMatch: 'ITD e-Filing Form-16 Verification (38 PANs matched)'
                        })}
                        className="btn btn-secondary btn-sm"
                        style={{ fontSize: '0.75rem', gap: 6 }}
                      >
                        <FileText size={13} /> View Attached Document ({facultyDoc.name})
                      </button>
                    </div>
                  )}

                  <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 12 }}>
                    <button className="btn btn-secondary" onClick={() => setCurrentStep(2)}>
                      <ArrowLeft size={15} /> Back
                    </button>
                    <button className="btn btn-primary" onClick={() => setCurrentStep(4)}>
                      Next: Review & Pre-Scrutiny <ArrowRight size={15} />
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Step 4: Final Review & Pre-Scrutiny Readiness */}
            {currentStep === 4 && (
              <div className="card" style={{ background: '#ffffff', padding: 28 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
                  <div>
                    <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0f2942' }}>
                      Step 4: AI Pre-Submission Scrutiny Report & Final Declaration
                    </h3>
                    <p style={{ fontSize: '0.8rem', color: '#64748b' }}>
                      Confirm your documents and review automated AICTE readiness before formal submission.
                    </p>
                  </div>
                  <span className="badge badge-success" style={{ fontSize: '0.75rem' }}>
                    Readiness: 82% Approved
                  </span>
                </div>

                <div style={{
                  background: '#f8fafc',
                  border: '1px solid #e2e8f0',
                  padding: 16,
                  borderRadius: 6,
                  marginBottom: 20
                }}>
                  <div style={{ fontSize: '0.78rem', fontWeight: 700, color: '#1e40af', marginBottom: 6 }}>
                    ★ PRE-SUBMISSION AI AUDIT SUMMARY:
                  </div>
                  <ul style={{ fontSize: '0.78rem', color: '#334155', paddingLeft: 18, lineHeight: 1.6 }}>
                    <li>Land Title Deed: <strong>Passed</strong> ({landDoc.name} — 100% legal name and survey plot consistency)</li>
                    <li>Fire Safety NOC: <strong>Warning</strong> (Expires in 18 days — Renewal undertaking attached)</li>
                    <li>Affiliating University NOC: <strong>Passed</strong> (AKTU 2025-26 approval validated)</li>
                    <li>Faculty-Student Ratio: <strong>Passed</strong> ({facultyDoc.name} — 38 faculty available vs 36 required)</li>
                  </ul>
                </div>

                <div style={{
                  padding: '12px 14px',
                  background: '#eff6ff',
                  border: '1px solid #bfdbfe',
                  borderRadius: 6,
                  fontSize: '0.75rem',
                  color: '#1e40af',
                  marginBottom: 20
                }}>
                  <strong>Principal Undertaking:</strong> I hereby certify that the particulars furnished above are true and correct as per official institutional records and conform to AICTE Approval Process Handbook (APH 2024-27).
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <button className="btn btn-secondary" onClick={() => setCurrentStep(3)}>
                    <ArrowLeft size={15} /> Back
                  </button>
                  <button
                    className="btn btn-primary"
                    onClick={handleSubmit}
                    disabled={submitting}
                    style={{ padding: '10px 24px' }}
                  >
                    <Send size={15} />
                    {submitting ? 'Submitting Application...' : 'Sign & Submit Application to AICTE'}
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </main>

      {/* Real Document Viewer Modal */}
      <DocumentViewerModal
        document={viewingDoc}
        onClose={() => setViewingDoc(null)}
      />
    </div>
  );
}
