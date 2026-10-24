'use client';

import { useState } from 'react';
import {
  X, Printer, Download, Building2, CheckCircle2, AlertTriangle,
  FileText, Shield, UserCheck, Calendar, Clock, Hash, Check
} from 'lucide-react';

interface ScrutinyReportExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  collegeName?: string;
  collegeCode?: string;
  applicationId?: string;
}

export default function ScrutinyReportExportModal({
  isOpen,
  onClose,
  collegeName = 'Apex Institute of Technology & Management',
  collegeCode = '1-102938475',
  applicationId = 'AICTE/AB/EoA/2026-27/1-102938475'
}: ScrutinyReportExportModalProps) {
  const [printDate] = useState(() => new Date().toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  }));

  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 2000,
        background: 'rgba(15, 23, 42, 0.8)',
        backdropFilter: 'blur(4px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px'
      }}
      onClick={onClose}
    >
      <div
        style={{
          background: '#ffffff',
          borderRadius: 8,
          width: '100%',
          maxWidth: 960,
          maxHeight: '94vh',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
          overflow: 'hidden'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header (Not printed) */}
        <div
          className="no-print"
          style={{
            background: '#0f2942',
            color: '#ffffff',
            padding: '12px 20px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderBottom: '3px solid #FF9933'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <FileText size={18} style={{ color: '#fde047' }} />
            <div>
              <div style={{ fontSize: '0.9rem', fontWeight: 800 }}>
                AICTE Official Scrutiny Evaluation Report (Print / PDF Export)
              </div>
              <div style={{ fontSize: '0.7rem', color: '#94a3b8' }}>
                Conforms to Approval Process Handbook (APH 2024–27) Bureau Scrutiny Standards
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <button
              type="button"
              onClick={handlePrint}
              className="btn btn-primary btn-sm"
              style={{ fontSize: '0.75rem', gap: 6, background: '#1e40af' }}
            >
              <Printer size={14} /> Print / Save as PDF
            </button>
            <button
              type="button"
              onClick={onClose}
              style={{
                background: 'transparent',
                border: 'none',
                color: '#cbd5e1',
                cursor: 'pointer',
                padding: 4
              }}
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Printable Report Document Body */}
        <div
          id="printable-scrutiny-report"
          style={{
            flex: 1,
            overflowY: 'auto',
            padding: '36px 40px',
            background: '#ffffff',
            color: '#0f172a',
            fontFamily: 'serif'
          }}
        >
          {/* Official Letterhead */}
          <div style={{ textAlign: 'center', borderBottom: '2px solid #0f2942', paddingBottom: 16, marginBottom: 20 }}>
            <div style={{ fontSize: '0.78rem', letterSpacing: '0.08em', color: '#475569', textTransform: 'uppercase', marginBottom: 2 }}>
              Government of India • Ministry of Education
            </div>
            <div style={{ fontSize: '1.25rem', fontWeight: 900, color: '#0f2942', letterSpacing: '0.02em', marginBottom: 2 }}>
              ALL INDIA COUNCIL FOR TECHNICAL EDUCATION
            </div>
            <div style={{ fontSize: '0.8rem', color: '#334155', marginBottom: 4 }}>
              (A Statutory Body Established Under the AICTE Act 52 of 1987)
            </div>
            <div style={{ fontSize: '0.72rem', color: '#64748b' }}>
              Nelson Mandela Marg, Vasant Kunj, New Delhi-110070 • Northern Regional Office (Kanpur)
            </div>
            <div style={{
              display: 'inline-block',
              background: '#f1f5f9',
              border: '1px solid #cbd5e1',
              borderRadius: 4,
              padding: '4px 14px',
              fontSize: '0.8rem',
              fontWeight: 800,
              color: '#0f2942',
              marginTop: 10
            }}>
              OFFICIAL BUREAU SCRUTINY &amp; COMPLIANCE EVALUATION REPORT (AY 2026–27)
            </div>
          </div>

          {/* Section 1: Application Dossier Metadata */}
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.8rem', marginBottom: 20 }}>
            <tbody>
              <tr style={{ background: '#f8fafc' }}>
                <td style={{ padding: '6px 10px', border: '1px solid #cbd5e1', width: '25%', fontWeight: 700 }}>Application No:</td>
                <td style={{ padding: '6px 10px', border: '1px solid #cbd5e1', width: '25%', fontFamily: 'monospace' }}>{applicationId}</td>
                <td style={{ padding: '6px 10px', border: '1px solid #cbd5e1', width: '25%', fontWeight: 700 }}>Scrutiny Date:</td>
                <td style={{ padding: '6px 10px', border: '1px solid #cbd5e1', width: '25%' }}>{printDate}</td>
              </tr>
              <tr>
                <td style={{ padding: '6px 10px', border: '1px solid #cbd5e1', fontWeight: 700 }}>Institution Name:</td>
                <td style={{ padding: '6px 10px', border: '1px solid #cbd5e1', fontWeight: 800 }} colSpan={3}>
                  {collegeName} (Permanent ID: {collegeCode})
                </td>
              </tr>
              <tr style={{ background: '#f8fafc' }}>
                <td style={{ padding: '6px 10px', border: '1px solid #cbd5e1', fontWeight: 700 }}>Campus Address:</td>
                <td style={{ padding: '6px 10px', border: '1px solid #cbd5e1' }} colSpan={3}>
                  Plot No. 402/1, Knowledge Park III, Greater Noida, Gautam Buddha Nagar, Uttar Pradesh - 201310
                </td>
              </tr>
              <tr>
                <td style={{ padding: '6px 10px', border: '1px solid #cbd5e1', fontWeight: 700 }}>Approval Category:</td>
                <td style={{ padding: '6px 10px', border: '1px solid #cbd5e1' }}>Extension of Approval (EoA)</td>
                <td style={{ padding: '6px 10px', border: '1px solid #cbd5e1', fontWeight: 700 }}>Sanctioned Intake:</td>
                <td style={{ padding: '6px 10px', border: '1px solid #cbd5e1' }}>720 Seats (UG Engineering)</td>
              </tr>
              <tr style={{ background: '#f8fafc' }}>
                <td style={{ padding: '6px 10px', border: '1px solid #cbd5e1', fontWeight: 700 }}>Affiliating University:</td>
                <td style={{ padding: '6px 10px', border: '1px solid #cbd5e1' }}>Dr. APJ Abdul Kalam Technical University (AKTU)</td>
                <td style={{ padding: '6px 10px', border: '1px solid #cbd5e1', fontWeight: 700 }}>Campus Land Area:</td>
                <td style={{ padding: '6px 10px', border: '1px solid #cbd5e1' }}>7.85 Acres (Continuous)</td>
              </tr>
            </tbody>
          </table>

          {/* Section 2: Document Intake & Extraction Summary */}
          <div style={{ fontSize: '0.85rem', fontWeight: 800, color: '#0f2942', borderBottom: '1px solid #0f2942', paddingBottom: 4, marginBottom: 8 }}>
            1. DOCUMENT INTAKE &amp; AUTOMATED STRUCTURED FIELD EXTRACTION
          </div>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.75rem', marginBottom: 20 }}>
            <thead>
              <tr style={{ background: '#f1f5f9' }}>
                <th style={{ padding: '6px 8px', border: '1px solid #cbd5e1', textAlign: 'left' }}>Statutory Document</th>
                <th style={{ padding: '6px 8px', border: '1px solid #cbd5e1', textAlign: 'left' }}>Category</th>
                <th style={{ padding: '6px 8px', border: '1px solid #cbd5e1', textAlign: 'left' }}>Issuing Authority</th>
                <th style={{ padding: '6px 8px', border: '1px solid #cbd5e1', textAlign: 'left' }}>Extracted Registration / Ref #</th>
                <th style={{ padding: '6px 8px', border: '1px solid #cbd5e1', textAlign: 'center' }}>Tier</th>
                <th style={{ padding: '6px 8px', border: '1px solid #cbd5e1', textAlign: 'center' }}>Intake Status</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td style={{ padding: '6px 8px', border: '1px solid #cbd5e1', fontWeight: 600 }}>Land_Title_Khasra_Deed_Registered.pdf</td>
                <td style={{ padding: '6px 8px', border: '1px solid #cbd5e1' }}>Land Title &amp; Possession</td>
                <td style={{ padding: '6px 8px', border: '1px solid #cbd5e1' }}>Sub-Registrar Greater Noida</td>
                <td style={{ padding: '6px 8px', border: '1px solid #cbd5e1', fontFamily: 'monospace' }}>Book-1/Vol-482/Deed-9821</td>
                <td style={{ padding: '6px 8px', border: '1px solid #cbd5e1', textAlign: 'center', fontWeight: 700 }}>Tier 2</td>
                <td style={{ padding: '6px 8px', border: '1px solid #cbd5e1', textAlign: 'center', color: '#15803d', fontWeight: 700 }}>✓ Verified</td>
              </tr>
              <tr>
                <td style={{ padding: '6px 8px', border: '1px solid #cbd5e1', fontWeight: 600 }}>Fire_Safety_NOC_StateDirectorate.pdf</td>
                <td style={{ padding: '6px 8px', border: '1px solid #cbd5e1' }}>Fire Safety Clearance</td>
                <td style={{ padding: '6px 8px', border: '1px solid #cbd5e1' }}>State Fire Services (UP)</td>
                <td style={{ padding: '6px 8px', border: '1px solid #cbd5e1', fontFamily: 'monospace' }}>UP/FS/GBN/2025/NOC-49210</td>
                <td style={{ padding: '6px 8px', border: '1px solid #cbd5e1', textAlign: 'center', fontWeight: 700 }}>Tier 2</td>
                <td style={{ padding: '6px 8px', border: '1px solid #cbd5e1', textAlign: 'center', color: '#b45309', fontWeight: 700 }}>⚠ Rectified (Receipt attached)</td>
              </tr>
              <tr>
                <td style={{ padding: '6px 8px', border: '1px solid #cbd5e1', fontWeight: 600 }}>AKTU_Affiliation_Extension_2025_26.pdf</td>
                <td style={{ padding: '6px 8px', border: '1px solid #cbd5e1' }}>University Affiliation</td>
                <td style={{ padding: '6px 8px', border: '1px solid #cbd5e1' }}>Registrar, AKTU Lucknow</td>
                <td style={{ padding: '6px 8px', border: '1px solid #cbd5e1', fontFamily: 'monospace' }}>AKTU/RO/AFF/2025-26/9821</td>
                <td style={{ padding: '6px 8px', border: '1px solid #cbd5e1', textAlign: 'center', fontWeight: 700 }}>Tier 1</td>
                <td style={{ padding: '6px 8px', border: '1px solid #cbd5e1', textAlign: 'center', color: '#15803d', fontWeight: 700 }}>✓ DSC Validated</td>
              </tr>
              <tr>
                <td style={{ padding: '6px 8px', border: '1px solid #cbd5e1', fontWeight: 600 }}>Faculty_Aadhaar_Form16_AuditedList.pdf</td>
                <td style={{ padding: '6px 8px', border: '1px solid #cbd5e1' }}>Faculty Cadre &amp; FSR</td>
                <td style={{ padding: '6px 8px', border: '1px solid #cbd5e1' }}>Statutory CA Auditor (UDIN)</td>
                <td style={{ padding: '6px 8px', border: '1px solid #cbd5e1', fontFamily: 'monospace' }}>UDIN: 24089123AAAA0912</td>
                <td style={{ padding: '6px 8px', border: '1px solid #cbd5e1', textAlign: 'center', fontWeight: 700 }}>Tier 3</td>
                <td style={{ padding: '6px 8px', border: '1px solid #cbd5e1', textAlign: 'center', color: '#15803d', fontWeight: 700 }}>✓ FSR 1:20 Satisfied</td>
              </tr>
              <tr style={{ background: '#fff1f2' }}>
                <td style={{ padding: '6px 8px', border: '1px solid #cbd5e1', fontWeight: 600 }}>Building_Safety_PWD_Certificate.pdf</td>
                <td style={{ padding: '6px 8px', border: '1px solid #cbd5e1' }}>Structural Safety</td>
                <td style={{ padding: '6px 8px', border: '1px solid #cbd5e1' }}>Executive Engineer, PWD</td>
                <td style={{ padding: '6px 8px', border: '1px solid #cbd5e1', fontFamily: 'monospace' }}>PWD/GBN/ENG/491</td>
                <td style={{ padding: '6px 8px', border: '1px solid #cbd5e1', textAlign: 'center', fontWeight: 700 }}>Tier 2</td>
                <td style={{ padding: '6px 8px', border: '1px solid #cbd5e1', textAlign: 'center', color: '#15803d', fontWeight: 700 }}>✓ Verified</td>
              </tr>
            </tbody>
          </table>

          {/* Section 3: Discrepancy Findings & Regulatory Rule Citations */}
          <div style={{ fontSize: '0.85rem', fontWeight: 800, color: '#0f2942', borderBottom: '1px solid #0f2942', paddingBottom: 4, marginBottom: 8 }}>
            2. AUDIT FINDINGS, DEFICIENCY NOTICES &amp; CORRECTION RESOLUTION
          </div>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.75rem', marginBottom: 20 }}>
            <thead>
              <tr style={{ background: '#f1f5f9' }}>
                <th style={{ padding: '6px 8px', border: '1px solid #cbd5e1', width: '20%', textAlign: 'left' }}>Finding / Deficiency</th>
                <th style={{ padding: '6px 8px', border: '1px solid #cbd5e1', width: '25%', textAlign: 'left' }}>Evidence &amp; Source Page</th>
                <th style={{ padding: '6px 8px', border: '1px solid #cbd5e1', width: '25%', textAlign: 'left' }}>Regulatory Rule Triggered</th>
                <th style={{ padding: '6px 8px', border: '1px solid #cbd5e1', width: '30%', textAlign: 'left' }}>Resolution &amp; Officer Audit Remarks</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td style={{ padding: '6px 8px', border: '1px solid #cbd5e1', fontWeight: 700, color: '#b45309' }}>
                  Fire Safety NOC Expiring (18 Days)
                </td>
                <td style={{ padding: '6px 8px', border: '1px solid #cbd5e1' }}>
                  State Fire Services NOC Date: 12-Nov-2025. Expiry: 11-Nov-2026 (18 days remaining as of 24-Oct-2026). Page 1, Dispatch Box.
                </td>
                <td style={{ padding: '6px 8px', border: '1px solid #cbd5e1' }}>
                  <strong>APH 2024-27 Reg. 3.4:</strong> Mandatory continuous statutory clearance throughout academic cycle.
                </td>
                <td style={{ padding: '6px 8px', border: '1px solid #cbd5e1', color: '#15803d' }}>
                  <strong>Resolved:</strong> College uploaded UP Fire Services renewal fee receipt (#UPFS/2026/RN-9821). Verified by Scrutiny Officer.
                </td>
              </tr>
              <tr>
                <td style={{ padding: '6px 8px', border: '1px solid #cbd5e1', fontWeight: 700, color: '#b45309' }}>
                  Faculty Cadre Distribution Shortfall
                </td>
                <td style={{ padding: '6px 8px', border: '1px solid #cbd5e1' }}>
                  Faculty Form-16 Audit Page 2: CS Department short 1 Professor for 1:2:6 ratio.
                </td>
                <td style={{ padding: '6px 8px', border: '1px solid #cbd5e1' }}>
                  <strong>APH 2024-27 Appendix 7:</strong> Cadre proportion compliance for UG Engineering programs.
                </td>
                <td style={{ padding: '6px 8px', border: '1px solid #cbd5e1', color: '#15803d' }}>
                  <strong>Resolved:</strong> Selection Committee recruitment notification &amp; scheduled interview undertaking accepted.
                </td>
              </tr>
              <tr>
                <td style={{ padding: '6px 8px', border: '1px solid #cbd5e1', fontWeight: 700, color: '#15803d' }}>
                  Registration Number Consistency
                </td>
                <td style={{ padding: '6px 8px', border: '1px solid #cbd5e1' }}>
                  Permanent ID (PID 1-102938475) matches across Land Deed, Affiliation Order, and Faculty List.
                </td>
                <td style={{ padding: '6px 8px', border: '1px solid #cbd5e1' }}>
                  <strong>APH 2024-27 Clause 4.2:</strong> Registration number and legal entity identity invariance.
                </td>
                <td style={{ padding: '6px 8px', border: '1px solid #cbd5e1', color: '#15803d' }}>
                  <strong>Compliant:</strong> Zero nomenclature variance detected.
                </td>
              </tr>
            </tbody>
          </table>

          {/* Section 4: Provenance Ladder Tier Breakdown */}
          <div style={{ fontSize: '0.85rem', fontWeight: 800, color: '#0f2942', borderBottom: '1px solid #0f2942', paddingBottom: 4, marginBottom: 8 }}>
            3. AICTE PROVENANCE LADDER AUDIT METRICS
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 10, fontSize: '0.75rem', marginBottom: 20 }}>
            <div style={{ border: '1px solid #cbd5e1', padding: '8px 10px', background: '#f8fafc', borderRadius: 4 }}>
              <div style={{ fontWeight: 700, color: '#1e40af' }}>Tier 1: Cryptographic</div>
              <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0f2942', margin: '3px 0' }}>1 Document</div>
              <div style={{ fontSize: '0.68rem', color: '#64748b' }}>AKTU Affiliation (X.509 DSC)</div>
            </div>
            <div style={{ border: '1px solid #cbd5e1', padding: '8px 10px', background: '#f8fafc', borderRadius: 4 }}>
              <div style={{ fontWeight: 700, color: '#15803d' }}>Tier 2: Source Gateways</div>
              <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0f2942', margin: '3px 0' }}>3 Documents</div>
              <div style={{ fontSize: '0.68rem', color: '#64748b' }}>UP Revenue, Fire Portal, PWD</div>
            </div>
            <div style={{ border: '1px solid #cbd5e1', padding: '8px 10px', background: '#f8fafc', borderRadius: 4 }}>
              <div style={{ fontWeight: 700, color: '#475569' }}>Tier 3: AICTE Archives</div>
              <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0f2942', margin: '3px 0' }}>1 Document</div>
              <div style={{ fontSize: '0.68rem', color: '#64748b' }}>Faculty CA UDIN Registry</div>
            </div>
            <div style={{ border: '1px solid #cbd5e1', padding: '8px 10px', background: '#f8fafc', borderRadius: 4 }}>
              <div style={{ fontWeight: 700, color: '#b45309' }}>Tier 4: Forensic Hints</div>
              <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0f2942', margin: '3px 0' }}>0 Open Flags</div>
              <div style={{ fontSize: '0.68rem', color: '#64748b' }}>All preliminary hints cleared</div>
            </div>
          </div>

          {/* Section 5: Committee Recommendation & Digital Signatures */}
          <div style={{ fontSize: '0.85rem', fontWeight: 800, color: '#0f2942', borderBottom: '1px solid #0f2942', paddingBottom: 4, marginBottom: 12 }}>
            4. FINAL COMMITTEE EVALUATION &amp; STATUTORY RECOMMENDATION
          </div>
          <div style={{ background: '#f8fafc', border: '1px solid #cbd5e1', padding: '12px 16px', borderRadius: 4, fontSize: '0.78rem', lineHeight: 1.6, marginBottom: 24 }}>
            <strong>FINAL RECOMMENDATION:</strong> The Scrutiny Committee has evaluated the application dossier for <strong>Apex Institute of Technology &amp; Management (PID: 1-102938475)</strong> in accordance with the regulations prescribed in the AICTE Approval Process Handbook (APH 2024–27). All preliminary deficiency notices have been satisfactorily resolved with authentic statutory replacement filings and institutional undertakings. The application is hereby:
            <div style={{ margin: '8px 0', fontSize: '0.85rem', fontWeight: 800, color: '#15803d' }}>
              ✓ RECOMMENDED FOR GRANT OF EXTENSION OF APPROVAL (EoA) FOR ACADEMIC YEAR 2026–27
            </div>
            Intake Sanctioned: 720 Seats in Undergraduate Engineering and Technology programs.
          </div>

          {/* Signatures */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 40, marginTop: 30, fontSize: '0.75rem' }}>
            <div style={{ borderTop: '1px solid #0f2942', paddingTop: 8 }}>
              <div style={{ fontWeight: 800 }}>DR. RAJESH KUMAR</div>
              <div>Senior Scrutiny Officer, Approval Bureau</div>
              <div>All India Council for Technical Education (AICTE)</div>
              <div style={{ color: '#64748b', fontSize: '0.7rem' }}>Digitally Authenticated: {printDate} • NIC Token #NIC-DEL-8921</div>
            </div>

            <div style={{ borderTop: '1px solid #0f2942', paddingTop: 8 }}>
              <div style={{ fontWeight: 800 }}>REGIONAL OFFICER</div>
              <div>Northern Regional Office (NRO, Kanpur)</div>
              <div>All India Council for Technical Education</div>
              <div style={{ color: '#64748b', fontSize: '0.7rem' }}>Endorsement Stamp: AICTE-NRO-KANPUR-2026</div>
            </div>
          </div>
        </div>

        {/* Modal Footer Controls */}
        <div
          className="no-print"
          style={{
            background: '#f8fafc',
            borderTop: '1px solid #e2e8f0',
            padding: '12px 20px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}
        >
          <div style={{ fontSize: '0.72rem', color: '#64748b' }}>
            Tip: Select &quot;Save as PDF&quot; in the browser print dialogue to save this official evaluation report.
          </div>

          <div style={{ display: 'flex', gap: 8 }}>
            <button
              type="button"
              className="btn btn-secondary btn-sm"
              onClick={onClose}
            >
              Close
            </button>
            <button
              type="button"
              className="btn btn-primary btn-sm"
              onClick={handlePrint}
              style={{ gap: 6 }}
            >
              <Printer size={14} /> Print / Export PDF
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
