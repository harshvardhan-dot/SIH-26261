'use client';

import { useState } from 'react';
import {
  X, GitCompare, FileText, CheckCircle2, AlertTriangle, AlertCircle,
  ArrowRight, ShieldCheck, Database, UserCheck, Sparkles, ExternalLink,
  Calendar, Building2, Hash, Clock, Check, RefreshCw, Eye
} from 'lucide-react';
import ProvenanceBadge from '@/components/ProvenanceBadge';
import DocumentViewerModal, { ViewableDocument } from '@/components/DocumentViewerModal';

interface CrossDocumentComparisonModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CrossDocumentComparisonModal({
  isOpen,
  onClose
}: CrossDocumentComparisonModalProps) {
  const [simulationMode, setSimulationMode] = useState<'normal' | 'mismatch'>('mismatch');
  const [selectedDocB, setSelectedDocB] = useState<string>('land_deed');
  const [activeTab, setActiveTab] = useState<'comparison' | 'governance_tiers'>('comparison');
  const [viewingDoc, setViewingDoc] = useState<ViewableDocument | null>(null);

  if (!isOpen) return null;

  // Extracted Document A (Approval Letter) data
  const docA = {
    title: 'AICTE Extension of Approval (EoA) 2025-26',
    filename: 'AICTE_EoA_Approval_Letter_2025_26.pdf',
    url: '/docs/AICTE_EoA_Approval_Letter_2025_26.pdf',
    extracted: {
      institutionName: 'Apex Institute of Technology & Management',
      nameSource: 'Page 1, Addressee Box (Chars 210-252)',
      approvalDate: '30-Apr-2025',
      dateSource: 'Page 1, Header Dispatch (Chars 145-168)',
      validityPeriod: 'Academic Year 2025-26 (Valid till 30-Jun-2026)',
      referenceNumber: 'F.No. Northern/1-102938475/2025/EOA',
      refSource: 'Page 1, Top Left Dispatch Line',
      pid: '1-102938475',
      intake: '540 Approved Seats (UG Engineering)',
      issuer: 'All India Council for Technical Education (HQ New Delhi)'
    }
  };

  // Document B Data based on selection and simulation mode
  const getDocBData = () => {
    if (simulationMode === 'mismatch') {
      return {
        title: 'Altered Audit Sample (Deliberate Mismatch & Lapsed Validity)',
        filename: 'Sample_Approval_Letter_Mismatch.pdf',
        url: '/docs/Sample_Approval_Letter_Mismatch.pdf',
        extracted: {
          institutionName: 'Apex College of Engineering & Advanced Research',
          nameSource: 'Page 1, Preamble (Chars 220-272)',
          approvalDate: '12-May-2023 [EXPIRED]',
          dateSource: 'Page 1, Header Block (Chars 160-184)',
          validityPeriod: 'Academic Year 2023-24 (Lapsed 30-Jun-2024)',
          referenceNumber: 'F.No. Northern/1-994821044/2023/EOA',
          refSource: 'Page 1, Reference Field',
          pid: '1-994821044 [MISMATCHED]',
          intake: '480 Seats',
          issuer: 'AICTE Regional Archive'
        }
      };
    }

    if (selectedDocB === 'land_deed') {
      return {
        title: 'Registered Perpetual Lease Deed (Khasra 402/1)',
        filename: 'Land_Title_Khasra_Deed_Registered.pdf',
        url: '/docs/Land_Title_Khasra_Deed_Registered.pdf',
        extracted: {
          institutionName: 'Apex Institute of Technology & Management',
          nameSource: 'Page 1, Lessee Covenant (Chars 310-352)',
          approvalDate: '14-Sep-2020',
          dateSource: 'Page 1, Sub-Registrar Seal',
          validityPeriod: '90-Year Perpetual Lease (Valid till 2110)',
          referenceNumber: 'Book-1/Vol-482/Deed-9821/2020',
          refSource: 'Page 1, Top Right Stamp Ledger',
          pid: '1-102938475 (Endorsed)',
          intake: 'Continuous Campus: 7.85 Acres',
          issuer: 'Sub-Registrar, Greater Noida, Gautam Buddha Nagar'
        }
      };
    }

    return {
      title: 'AKTU University Affiliation Continuance Letter',
      filename: 'AKTU_Affiliation_Extension_2025_26.pdf',
      url: '/docs/AKTU_Affiliation_Extension_2025_26.pdf',
      extracted: {
        institutionName: 'Apex Institute of Technology & Management',
        nameSource: 'Page 1, Subject Box (Chars 180-222)',
        approvalDate: '15-May-2025',
        dateSource: 'Page 1, Registrar Dispatch',
        validityPeriod: 'Academic Year 2025-26 (Valid till 30-Jun-2026)',
        referenceNumber: 'AKTU/RO/AFF/2025-26/9821',
        refSource: 'Page 1, Dispatch Line',
        pid: '1-102938475 (AKTU College Code: 094)',
        intake: '540 Affiliated Seats',
        issuer: 'Dr. APJ Abdul Kalam Technical University, Lucknow'
      }
    };
  };

  const docB = getDocBData();

  // Discrepancy analysis computation
  const isNameMatch = docA.extracted.institutionName.toLowerCase() === docB.extracted.institutionName.toLowerCase();
  const isDateCompliant = !docB.extracted.approvalDate.includes('EXPIRED') && !docB.extracted.validityPeriod.includes('Lapsed');
  const isPidMatch = docA.extracted.pid === docB.extracted.pid || (!docB.extracted.pid.includes('MISMATCHED') && docB.extracted.pid.includes('1-102938475'));

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 1000,
        background: 'rgba(15, 23, 42, 0.75)',
        backdropFilter: 'blur(4px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20
      }}
      onClick={onClose}
    >
      <div
        style={{
          background: '#ffffff',
          borderRadius: 10,
          width: '100%',
          maxWidth: 1100,
          maxHeight: '92vh',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
          overflow: 'hidden'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div
          style={{
            background: '#0f2942',
            color: '#ffffff',
            padding: '16px 24px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderBottom: '3px solid #FF9933'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div
              style={{
                width: 38,
                height: 38,
                borderRadius: 6,
                background: 'rgba(255,255,255,0.1)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#fde047'
              }}
            >
              <GitCompare size={22} />
            </div>
            <div>
              <div style={{ fontSize: '1.05rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: 8 }}>
                AICTE Cross-Document Discrepancy & Provenance Analyzer
                <span
                  style={{
                    background: '#1e40af',
                    color: '#93c5fd',
                    fontSize: '0.68rem',
                    fontWeight: 700,
                    padding: '2px 8px',
                    borderRadius: 4
                  }}
                >
                  APH 2024-27 ENGINE
                </span>
              </div>
              <div style={{ fontSize: '0.74rem', color: '#94a3b8' }}>
                Multi-source OCR entity extraction, cross-referencing, automated rule matching & governance tier attribution
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <button
              onClick={onClose}
              style={{
                background: 'transparent',
                border: 'none',
                color: '#cbd5e1',
                cursor: 'pointer',
                padding: 6,
                borderRadius: 4
              }}
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Tab Bar & Simulation Mode Switcher */}
        <div
          style={{
            background: '#f8fafc',
            borderBottom: '1px solid #e2e8f0',
            padding: '10px 24px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: 12
          }}
        >
          {/* Navigation Tabs */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <button
              onClick={() => setActiveTab('comparison')}
              style={{
                padding: '6px 14px',
                borderRadius: 5,
                fontSize: '0.8rem',
                fontWeight: 700,
                border: 'none',
                cursor: 'pointer',
                background: activeTab === 'comparison' ? '#0f2942' : 'transparent',
                color: activeTab === 'comparison' ? '#ffffff' : '#64748b'
              }}
            >
              Field Extraction & Cross-Check (Steps 1–5)
            </button>
            <button
              onClick={() => setActiveTab('governance_tiers')}
              style={{
                padding: '6px 14px',
                borderRadius: 5,
                fontSize: '0.8rem',
                fontWeight: 700,
                border: 'none',
                cursor: 'pointer',
                background: activeTab === 'governance_tiers' ? '#0f2942' : 'transparent',
                color: activeTab === 'governance_tiers' ? '#ffffff' : '#64748b'
              }}
            >
              Automation vs Human Review Breakdown (Step 6)
            </button>
          </div>

          {/* Step 4: Deliberately Introduce Mismatch Toggle */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              background: simulationMode === 'mismatch' ? '#fef2f2' : '#f0fdf4',
              border: `1px solid ${simulationMode === 'mismatch' ? '#fca5a5' : '#86efac'}`,
              padding: '4px 12px',
              borderRadius: 6
            }}
          >
            <span style={{ fontSize: '0.74rem', fontWeight: 700, color: simulationMode === 'mismatch' ? '#991b1b' : '#166534' }}>
              Step 4: Mismatch Simulation:
            </span>
            <div style={{ display: 'flex', gap: 4 }}>
              <button
                type="button"
                onClick={() => setSimulationMode('normal')}
                style={{
                  padding: '3px 9px',
                  borderRadius: 4,
                  fontSize: '0.72rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  border: 'none',
                  background: simulationMode === 'normal' ? '#166534' : 'transparent',
                  color: simulationMode === 'normal' ? '#ffffff' : '#475569'
                }}
              >
                Compliant Match
              </button>
              <button
                type="button"
                onClick={() => setSimulationMode('mismatch')}
                style={{
                  padding: '3px 9px',
                  borderRadius: 4,
                  fontSize: '0.72rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  border: 'none',
                  background: simulationMode === 'mismatch' ? '#b91c1c' : 'transparent',
                  color: simulationMode === 'mismatch' ? '#ffffff' : '#475569'
                }}
              >
                Introduce Mismatch & Expired Date
              </button>
            </div>
          </div>
        </div>

        {/* Modal Body */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '20px 24px' }}>
          {activeTab === 'comparison' && (
            <div>
              {/* Document Pair Overview */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: 16,
                  marginBottom: 20
                }}
              >
                {/* Document A Card */}
                <div
                  style={{
                    border: '1px solid #cbd5e1',
                    borderRadius: 8,
                    background: '#f8fafc',
                    padding: 14
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
                    <div>
                      <span className="badge badge-info" style={{ fontSize: '0.68rem', marginBottom: 4 }}>
                        Document A • Sample Approval Letter (Source)
                      </span>
                      <h4 style={{ fontSize: '0.9rem', fontWeight: 800, color: '#0f2942', margin: '2px 0' }}>
                        {docA.title}
                      </h4>
                      <div style={{ fontSize: '0.74rem', color: '#64748b' }}>
                        File: <code>{docA.filename}</code> • AICTE Central Repository
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => setViewingDoc({
                        name: docA.filename,
                        url: docA.url,
                        tier: 1,
                        category: 'Approval Order (EoA)',
                        issuer: docA.extracted.issuer
                      })}
                      className="btn btn-secondary btn-sm"
                      style={{ fontSize: '0.72rem', padding: '4px 8px', gap: 4 }}
                    >
                      <Eye size={12} /> View PDF
                    </button>
                  </div>
                  <div style={{ fontSize: '0.72rem', color: '#059669', fontWeight: 600 }}>
                    ✓ Digital Signature Confirmed (NIC Gateway SHA-256)
                  </div>
                </div>

                {/* Document B Card */}
                <div
                  style={{
                    border: `1px solid ${simulationMode === 'mismatch' ? '#f87171' : '#cbd5e1'}`,
                    borderRadius: 8,
                    background: simulationMode === 'mismatch' ? '#fff5f5' : '#f8fafc',
                    padding: 14
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
                    <div>
                      <span
                        className={simulationMode === 'mismatch' ? 'badge badge-danger' : 'badge badge-info'}
                        style={{ fontSize: '0.68rem', marginBottom: 4 }}
                      >
                        Document B • {simulationMode === 'mismatch' ? 'Altered Audit Sample (Deliberate Mismatch)' : 'Cross-Reference Document'}
                      </span>
                      <h4 style={{ fontSize: '0.9rem', fontWeight: 800, color: simulationMode === 'mismatch' ? '#991b1b' : '#0f2942', margin: '2px 0' }}>
                        {docB.title}
                      </h4>
                      <div style={{ fontSize: '0.74rem', color: '#64748b' }}>
                        File: <code>{docB.filename}</code>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => setViewingDoc({
                        name: docB.filename,
                        url: docB.url,
                        tier: simulationMode === 'mismatch' ? 4 : 2,
                        category: 'Cross-Check Target',
                        issuer: docB.extracted.issuer
                      })}
                      className="btn btn-secondary btn-sm"
                      style={{ fontSize: '0.72rem', padding: '4px 8px', gap: 4 }}
                    >
                      <Eye size={12} /> View PDF
                    </button>
                  </div>
                  <div style={{ fontSize: '0.72rem', color: simulationMode === 'mismatch' ? '#b91c1c' : '#059669', fontWeight: 600 }}>
                    {simulationMode === 'mismatch'
                      ? '⚠️ Deliberate nomenclature mismatch & expired validity active'
                      : '✓ Cryptographically verified with Issuing Authority'}
                  </div>
                </div>
              </div>

              {/* Extraction & Comparison Matrix (Steps 2, 3 & 5) */}
              <div style={{ marginBottom: 20 }}>
                <div style={{ fontSize: '0.85rem', fontWeight: 800, color: '#0f2942', marginBottom: 10, display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span>Entity Extraction & Field-Level Cross-Verification</span>
                  <span style={{ fontSize: '0.7rem', color: '#64748b', fontWeight: 500 }}>
                    (AI OCR Regex & NER with Bounding Box Page Tracking)
                  </span>
                </div>

                <div
                  style={{
                    border: '1px solid #e2e8f0',
                    borderRadius: 8,
                    overflow: 'hidden'
                  }}
                >
                  <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.78rem' }}>
                    <thead>
                      <tr style={{ background: '#f1f5f9', borderBottom: '1px solid #cbd5e1' }}>
                        <th style={{ padding: '10px 14px', textAlign: 'left', width: '22%' }}>Entity Field</th>
                        <th style={{ padding: '10px 14px', textAlign: 'left', width: '30%' }}>Document A (Approval Letter)</th>
                        <th style={{ padding: '10px 14px', textAlign: 'left', width: '30%' }}>Document B (Comparison Target)</th>
                        <th style={{ padding: '10px 14px', textAlign: 'left', width: '18%' }}>Audit Outcome</th>
                      </tr>
                    </thead>
                    <tbody>
                      {/* Field 1: Institution Name */}
                      <tr style={{ borderBottom: '1px solid #f1f5f9', background: isNameMatch ? '#ffffff' : '#fff1f2' }}>
                        <td style={{ padding: '12px 14px', verticalAlign: 'top' }}>
                          <div style={{ fontWeight: 700, color: '#0f172a' }}>1. Institution Name</div>
                          <div style={{ fontSize: '0.68rem', color: '#64748b' }}>Continuous Nomenclature</div>
                        </td>
                        <td style={{ padding: '12px 14px', verticalAlign: 'top' }}>
                          <div style={{ fontWeight: 700, color: '#0f2942' }}>{docA.extracted.institutionName}</div>
                          <div style={{ fontSize: '0.68rem', color: '#475569', marginTop: 2 }}>
                            📍 Source: {docA.extracted.nameSource}
                          </div>
                        </td>
                        <td style={{ padding: '12px 14px', verticalAlign: 'top' }}>
                          <div style={{ fontWeight: 700, color: isNameMatch ? '#0f2942' : '#b91c1c' }}>
                            {docB.extracted.institutionName}
                          </div>
                          <div style={{ fontSize: '0.68rem', color: '#475569', marginTop: 2 }}>
                            📍 Source: {docB.extracted.nameSource}
                          </div>
                        </td>
                        <td style={{ padding: '12px 14px', verticalAlign: 'top' }}>
                          {isNameMatch ? (
                            <span className="badge badge-success" style={{ fontSize: '0.7rem' }}>
                              ✓ 100% Lexical Match
                            </span>
                          ) : (
                            <div>
                              <span className="badge badge-danger" style={{ fontSize: '0.7rem' }}>
                                ❌ DISCREPANCY
                              </span>
                              <div style={{ fontSize: '0.68rem', color: '#b91c1c', marginTop: 4, fontWeight: 600 }}>
                                Sim Score: 64% (Mismatch)
                              </div>
                            </div>
                          )}
                        </td>
                      </tr>

                      {/* Field 2: Approval / Issuance Date & Validity */}
                      <tr style={{ borderBottom: '1px solid #f1f5f9', background: isDateCompliant ? '#ffffff' : '#fff1f2' }}>
                        <td style={{ padding: '12px 14px', verticalAlign: 'top' }}>
                          <div style={{ fontWeight: 700, color: '#0f172a' }}>2. Approval Date & Validity</div>
                          <div style={{ fontSize: '0.68rem', color: '#64748b' }}>Statutory Window</div>
                        </td>
                        <td style={{ padding: '12px 14px', verticalAlign: 'top' }}>
                          <div style={{ fontWeight: 700, color: '#0f2942' }}>{docA.extracted.approvalDate}</div>
                          <div style={{ fontSize: '0.72rem', color: '#059669', fontWeight: 600 }}>
                            {docA.extracted.validityPeriod}
                          </div>
                          <div style={{ fontSize: '0.68rem', color: '#475569', marginTop: 2 }}>
                            📍 Source: {docA.extracted.dateSource}
                          </div>
                        </td>
                        <td style={{ padding: '12px 14px', verticalAlign: 'top' }}>
                          <div style={{ fontWeight: 700, color: isDateCompliant ? '#0f2942' : '#b91c1c' }}>
                            {docB.extracted.approvalDate}
                          </div>
                          <div style={{ fontSize: '0.72rem', color: isDateCompliant ? '#059669' : '#b91c1c', fontWeight: 600 }}>
                            {docB.extracted.validityPeriod}
                          </div>
                          <div style={{ fontSize: '0.68rem', color: '#475569', marginTop: 2 }}>
                            📍 Source: {docB.extracted.dateSource}
                          </div>
                        </td>
                        <td style={{ padding: '12px 14px', verticalAlign: 'top' }}>
                          {isDateCompliant ? (
                            <span className="badge badge-success" style={{ fontSize: '0.7rem' }}>
                              ✓ Current AY Valid
                            </span>
                          ) : (
                            <div>
                              <span className="badge badge-danger" style={{ fontSize: '0.7rem' }}>
                                ❌ EXPIRED
                              </span>
                              <div style={{ fontSize: '0.68rem', color: '#b91c1c', marginTop: 4, fontWeight: 600 }}>
                                Lapsed by 480+ days
                              </div>
                            </div>
                          )}
                        </td>
                      </tr>

                      {/* Field 3: Reference Number & Permanent ID */}
                      <tr style={{ background: isPidMatch ? '#ffffff' : '#fff1f2' }}>
                        <td style={{ padding: '12px 14px', verticalAlign: 'top' }}>
                          <div style={{ fontWeight: 700, color: '#0f172a' }}>3. Reference No & PID</div>
                          <div style={{ fontSize: '0.68rem', color: '#64748b' }}>Institutional Binding</div>
                        </td>
                        <td style={{ padding: '12px 14px', verticalAlign: 'top' }}>
                          <div style={{ fontWeight: 700, color: '#0f2942', fontFamily: 'monospace' }}>
                            {docA.extracted.referenceNumber}
                          </div>
                          <div style={{ fontSize: '0.72rem', color: '#1e40af' }}>PID: {docA.extracted.pid}</div>
                          <div style={{ fontSize: '0.68rem', color: '#475569', marginTop: 2 }}>
                            📍 Source: {docA.extracted.refSource}
                          </div>
                        </td>
                        <td style={{ padding: '12px 14px', verticalAlign: 'top' }}>
                          <div style={{ fontWeight: 700, color: isPidMatch ? '#0f2942' : '#b91c1c', fontFamily: 'monospace' }}>
                            {docB.extracted.referenceNumber}
                          </div>
                          <div style={{ fontSize: '0.72rem', color: isPidMatch ? '#1e40af' : '#b91c1c', fontWeight: 600 }}>
                            PID: {docB.extracted.pid}
                          </div>
                          <div style={{ fontSize: '0.68rem', color: '#475569', marginTop: 2 }}>
                            📍 Source: {docB.extracted.refSource}
                          </div>
                        </td>
                        <td style={{ padding: '12px 14px', verticalAlign: 'top' }}>
                          {isPidMatch ? (
                            <span className="badge badge-success" style={{ fontSize: '0.7rem' }}>
                              ✓ PID Validated
                            </span>
                          ) : (
                            <div>
                              <span className="badge badge-danger" style={{ fontSize: '0.7rem' }}>
                                ❌ PID CONFLICT
                              </span>
                              <div style={{ fontSize: '0.68rem', color: '#b91c1c', marginTop: 4, fontWeight: 600 }}>
                                1-102938475 vs 1-994821044
                              </div>
                            </div>
                          )}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Step 5: Detected Discrepancies & Triggered APH Rules Panel */}
              {!isNameMatch || !isDateCompliant || !isPidMatch ? (
                <div
                  style={{
                    background: '#fef2f2',
                    border: '1px solid #fecaca',
                    borderRadius: 8,
                    padding: 16,
                    marginBottom: 16
                  }}
                >
                  <div style={{ fontSize: '0.85rem', fontWeight: 800, color: '#991b1b', marginBottom: 10, display: 'flex', alignItems: 'center', gap: 8 }}>
                    <AlertTriangle size={18} />
                    <span>Step 5: Detected Discrepancies & Triggered Regulatory Rules (APH 2024-27)</span>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                    {/* Discrepancy 1 */}
                    {!isNameMatch && (
                      <div
                        style={{
                          background: '#ffffff',
                          border: '1px solid #fee2e2',
                          borderRadius: 6,
                          padding: 12
                        }}
                      >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                          <div>
                            <span className="badge badge-danger" style={{ fontSize: '0.68rem', marginBottom: 4 }}>
                              VIOLATION DETECTED • HIGH SEVERITY
                            </span>
                            <div style={{ fontSize: '0.82rem', fontWeight: 700, color: '#991b1b' }}>
                              Institutional Nomenclature Discrepancy: &quot;Apex Institute of Technology & Management&quot; vs &quot;Apex College of Engineering & Advanced Research&quot;
                            </div>
                          </div>
                          <span style={{ fontSize: '0.7rem', color: '#64748b', fontWeight: 600 }}>
                            Rule: APH-2024 Cl. 4.2.1
                          </span>
                        </div>
                        <div style={{ fontSize: '0.75rem', color: '#475569', marginTop: 6, lineHeight: 1.5 }}>
                          <strong>Triggered Regulatory Rule:</strong> AICTE Approval Process Handbook (APH 2024–27), Chapter IV, Clause 4.2.1 (&quot;Continuous Institutional Identity, Land Title & Unbroken Nomenclature&quot;). Any variation requires prior Council gazette permission.
                        </div>
                        <div style={{ fontSize: '0.72rem', color: '#7f1d1d', marginTop: 4, background: '#fff1f2', padding: '4px 8px', borderRadius: 4 }}>
                          <strong>Source Page Attribution:</strong> Document A Page 1 (Addressee line 4) vs Document B Page 1 (Preamble line 2). Levenshtein distance 0.36 violates tolerance threshold (0.05).
                        </div>
                      </div>
                    )}

                    {/* Discrepancy 2 */}
                    {!isDateCompliant && (
                      <div
                        style={{
                          background: '#ffffff',
                          border: '1px solid #fee2e2',
                          borderRadius: 6,
                          padding: 12
                        }}
                      >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                          <div>
                            <span className="badge badge-danger" style={{ fontSize: '0.68rem', marginBottom: 4 }}>
                              EXPIRED STATUTORY PERIOD • CRITICAL DEFICIENCY
                            </span>
                            <div style={{ fontSize: '0.82rem', fontWeight: 700, color: '#991b1b' }}>
                              Lapsed Approval Validity: Document date is 12-May-2023 (Expired 30-June-2024, overdue by 480+ days)
                            </div>
                          </div>
                          <span style={{ fontSize: '0.7rem', color: '#64748b', fontWeight: 600 }}>
                            Rule: APH-2024 Reg. 3.4
                          </span>
                        </div>
                        <div style={{ fontSize: '0.75rem', color: '#475569', marginTop: 6, lineHeight: 1.5 }}>
                          <strong>Triggered Regulatory Rule:</strong> AICTE APH 2024–27, Chapter II, Regulation 3.4 &amp; Appendix 3 (&quot;Mandatory Validity Window for Ongoing Academic Year Extension&quot;). An expired approval cannot serve as statutory foundation for intake continuation.
                        </div>
                        <div style={{ fontSize: '0.72rem', color: '#7f1d1d', marginTop: 4, background: '#fff1f2', padding: '4px 8px', borderRadius: 4 }}>
                          <strong>Source Page Attribution:</strong> Document A Page 1 (Issuance: 30-Apr-2025, Valid 2025-26) vs Document B Page 1 (Issuance: 12-May-2023, Lapsed 30-June-2024).
                        </div>
                      </div>
                    )}

                    {/* Discrepancy 3 */}
                    {!isPidMatch && (
                      <div
                        style={{
                          background: '#ffffff',
                          border: '1px solid #fee2e2',
                          borderRadius: 6,
                          padding: 12
                        }}
                      >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                          <div>
                            <span className="badge badge-danger" style={{ fontSize: '0.68rem', marginBottom: 4 }}>
                              PERMANENT ID CONFLICT • SUSPECTED DOSSIER MIXUP
                            </span>
                            <div style={{ fontSize: '0.82rem', fontWeight: 700, color: '#991b1b' }}>
                              AICTE Permanent ID (PID) Mismatch: PID 1-102938475 vs PID 1-994821044
                            </div>
                          </div>
                          <span style={{ fontSize: '0.7rem', color: '#64748b', fontWeight: 600 }}>
                            Rule: APH-2024 App. 1
                          </span>
                        </div>
                        <div style={{ fontSize: '0.75rem', color: '#475569', marginTop: 6, lineHeight: 1.5 }}>
                          <strong>Triggered Regulatory Rule:</strong> AICTE APH 2024–27, Appendix 1 (&quot;Permanent Institute Identification Binding&quot;). Every institutional asset, land title, and affiliation must be strictly keyed to the unique PID.
                        </div>
                        <div style={{ fontSize: '0.72rem', color: '#7f1d1d', marginTop: 4, background: '#fff1f2', padding: '4px 8px', borderRadius: 4 }}>
                          <strong>Source Page Attribution:</strong> Document A Page 1 Top Left Header (F.No. Northern/1-102938475) vs Document B Page 1 Reference Field (1-994821044).
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div
                  style={{
                    background: '#ecfdf5',
                    border: '1px solid #a7f3d0',
                    borderRadius: 8,
                    padding: 16,
                    color: '#065f46',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 12
                  }}
                >
                  <CheckCircle2 size={24} style={{ color: '#059669', flexShrink: 0 }} />
                  <div>
                    <div style={{ fontWeight: 800, fontSize: '0.85rem' }}>
                      All Cross-Document Consistency Checks Passed
                    </div>
                    <div style={{ fontSize: '0.75rem', color: '#047857' }}>
                      Institution nomenclature (&quot;Apex Institute of Technology &amp; Management&quot;), valid dates (AY 2025-26), and PID (1-102938475) are identical across both statutory documents.
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Tab 2: Automation vs External API vs Human Review Matrix (Step 6) */}
          {activeTab === 'governance_tiers' && (
            <div>
              <div style={{ marginBottom: 16 }}>
                <h3 style={{ fontSize: '1rem', fontWeight: 800, color: '#0f2942', margin: '0 0 4px' }}>
                  Step 6: AICTE Verification Governance &amp; Automation Architecture
                </h3>
                <p style={{ fontSize: '0.78rem', color: '#64748b', margin: 0 }}>
                  Transparent classification of which checks run autonomously by algorithms vs which require external API federation vs human committee discretion.
                </p>
              </div>

              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(3, 1fr)',
                  gap: 16,
                  marginBottom: 20
                }}
              >
                {/* Column 1: Fully Automated */}
                <div
                  style={{
                    background: '#f8fafc',
                    border: '1px solid #cbd5e1',
                    borderRadius: 8,
                    padding: 16,
                    display: 'flex',
                    flexDirection: 'column'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
                    <div
                      style={{
                        width: 28,
                        height: 28,
                        borderRadius: 6,
                        background: '#ecfdf5',
                        color: '#059669',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}
                    >
                      <Sparkles size={16} />
                    </div>
                    <div>
                      <div style={{ fontSize: '0.82rem', fontWeight: 800, color: '#0f2942' }}>
                        1. Fully Automated Checks
                      </div>
                      <div style={{ fontSize: '0.68rem', color: '#059669', fontWeight: 600 }}>
                        Autonomous • Zero Human Touch (Sub-second)
                      </div>
                    </div>
                  </div>

                  <ul style={{ fontSize: '0.74rem', color: '#334155', paddingLeft: 16, lineHeight: 1.6, flex: 1 }}>
                    <li><strong>SHA-256 Checksum:</strong> Instant cryptographic hash comparison against original upload record.</li>
                    <li><strong>OCR &amp; NER Field Extraction:</strong> Optical character recognition extracts name, PID, dates, and courses.</li>
                    <li><strong>Fuzzy String Matching:</strong> Levenshtein and Jaro-Winkler distance to flag nomenclature variants.</li>
                    <li><strong>Date Window Arithmetic:</strong> Evaluates if <code>current_date &gt; expiry_date</code> or if within 30-day renewal grace window.</li>
                    <li><strong>APH Mathematical Norms:</strong> Faculty-Student Ratio (1:20), built-up carpet area formulas, land acreage continuity.</li>
                  </ul>

                  <div style={{ background: '#ecfdf5', padding: '8px 10px', borderRadius: 6, fontSize: '0.68rem', color: '#065f46', marginTop: 12 }}>
                    <strong>Confidence:</strong> 99.9% Deterministic Execution
                  </div>
                </div>

                {/* Column 2: External Gateway Verification */}
                <div
                  style={{
                    background: '#f8fafc',
                    border: '1px solid #cbd5e1',
                    borderRadius: 8,
                    padding: 16,
                    display: 'flex',
                    flexDirection: 'column'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
                    <div
                      style={{
                        width: 28,
                        height: 28,
                        borderRadius: 6,
                        background: '#eff6ff',
                        color: '#1d4ed8',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}
                    >
                      <Database size={16} />
                    </div>
                    <div>
                      <div style={{ fontSize: '0.82rem', fontWeight: 800, color: '#0f2942' }}>
                        2. External API Gateways
                      </div>
                      <div style={{ fontSize: '0.68rem', color: '#1d4ed8', fontWeight: 600 }}>
                        Tier 2 Source Lookup • Federated Govt DBs
                      </div>
                    </div>
                  </div>

                  <ul style={{ fontSize: '0.74rem', color: '#334155', paddingLeft: 16, lineHeight: 1.6, flex: 1 }}>
                    <li><strong>DigiLocker National API:</strong> Queries original digital repository to confirm issuer private key certificate.</li>
                    <li><strong>State Land Revenue (e-Bhoomi):</strong> Cross-checks Khasra Plot No. 402/1 against provincial land mutation registers.</li>
                    <li><strong>State Fire Services Portal:</strong> Validates Dispatch No. UP/FS/GBN/2025/NOC against live fire department records.</li>
                    <li><strong>University Examination Grid:</strong> Queries Dr. APJ Abdul Kalam Technical University (AKTU) affiliation API.</li>
                    <li><strong>Income Tax e-Filing (Form 16):</strong> Confirms CA UDIN and faculty TDS deductions directly with ITD.</li>
                  </ul>

                  <div style={{ background: '#eff6ff', padding: '8px 10px', borderRadius: 6, fontSize: '0.68rem', color: '#1e40af', marginTop: 12 }}>
                    <strong>Confidence:</strong> Authoritative Issuer Direct Confirmation
                  </div>
                </div>

                {/* Column 3: Human / Committee Review */}
                <div
                  style={{
                    background: '#f8fafc',
                    border: '1px solid #cbd5e1',
                    borderRadius: 8,
                    padding: 16,
                    display: 'flex',
                    flexDirection: 'column'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
                    <div
                      style={{
                        width: 28,
                        height: 28,
                        borderRadius: 6,
                        background: '#fff7ed',
                        color: '#c2410c',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}
                    >
                      <UserCheck size={16} />
                    </div>
                    <div>
                      <div style={{ fontSize: '0.82rem', fontWeight: 800, color: '#0f2942' }}>
                        3. Committee &amp; Human Review
                      </div>
                      <div style={{ fontSize: '0.68rem', color: '#c2410c', fontWeight: 600 }}>
                        Tier 4 Forensic • Discretionary Judgment
                      </div>
                    </div>
                  </div>

                  <ul style={{ fontSize: '0.74rem', color: '#334155', paddingLeft: 16, lineHeight: 1.6, flex: 1 }}>
                    <li><strong>Forensic Tampering Appraisal:</strong> High-resolution inspection of font kerning anomalies, spliced seals, or metadata timestamps.</li>
                    <li><strong>Discretionary Grace Periods:</strong> Assessing whether to accept a renewal fee acknowledgment receipt in lieu of a final NOC.</li>
                    <li><strong>Physical Campus Verification:</strong> Evaluating Expert Visiting Committee (EVC) geo-tagged photos and lab equipment video logs.</li>
                    <li><strong>Formal Show-Cause Hearings:</strong> Standing Appellate Committee (SAC) hearings when an institution disputes an automated flag.</li>
                    <li><strong>Affidavit &amp; Undertaking Verification:</strong> Reviewing Principal notarized declarations regarding ongoing faculty hiring.</li>
                  </ul>

                  <div style={{ background: '#fff7ed', padding: '8px 10px', borderRadius: 6, fontSize: '0.68rem', color: '#9a3412', marginTop: 12 }}>
                    <strong>Confidence:</strong> Judicial &amp; Statutory Discretion
                  </div>
                </div>
              </div>

              {/* Provenance Ladder Reference Banner */}
              <div
                style={{
                  background: '#f1f5f9',
                  border: '1px solid #cbd5e1',
                  borderRadius: 6,
                  padding: 12,
                  fontSize: '0.74rem',
                  color: '#334155',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 10
                }}
              >
                <ShieldCheck size={20} style={{ color: '#0f2942', flexShrink: 0 }} />
                <div>
                  <strong>Why AICTE Separates Automation from Human Discretion:</strong> AICTE Approval Process regulations explicitly state that automated AI flags are preliminary indicators to assist scrutiny officers. Tier 1 (Cryptographic) and Tier 2 (Source-confirmed) establish unforgeable trust, whereas Tier 4 (Forensics) serves as an investigative hint for committee officers rather than an automatic rejection.
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div
          style={{
            background: '#ffffff',
            borderTop: '1px solid #e2e8f0',
            padding: '12px 24px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}
        >
          <div style={{ fontSize: '0.74rem', color: '#64748b' }}>
            Reference: AICTE Approval Process Handbook (APH 2024–27) • National Educational Technology Forum (NETF)
          </div>

          <div style={{ display: 'flex', gap: 10 }}>
            <button
              type="button"
              className="btn btn-secondary btn-sm"
              onClick={onClose}
            >
              Close Analyzer
            </button>
          </div>
        </div>
      </div>

      {/* Embedded Document Viewer Modal */}
      <DocumentViewerModal
        document={viewingDoc}
        onClose={() => setViewingDoc(null)}
      />
    </div>
  );
}
