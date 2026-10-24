'use client';

import { useState } from 'react';
import {
  X, Download, ExternalLink, ShieldCheck, FileText, CheckCircle2,
  AlertTriangle, Globe, Calendar, Clock, Hash, Lock, Check
} from 'lucide-react';
import ProvenanceBadge from '@/components/ProvenanceBadge';
import { ProvenanceTier } from '@/lib/provenance';

export interface ViewableDocument {
  id?: string;
  name: string;
  url?: string;
  category?: string;
  tier?: ProvenanceTier;
  issuer?: string;
  size?: string;
  uploadedAt?: string;
  statusLabel?: string;
  sha256?: string;
  authorityMatch?: string;
  isFlagged?: boolean;
  flagReason?: string;
}

interface DocumentViewerModalProps {
  document: ViewableDocument | null;
  onClose: () => void;
}

// Map document names to our real generated demo docs in /docs
export function getDemoDocUrl(docName: string): string {
  const lower = docName.toLowerCase();
  if (lower.includes('fire')) {
    if (lower.includes('expired')) {
      return '/docs/Fire_Safety_NOC_EXPIRED.pdf';
    }
    if (lower.includes('valid')) {
      return '/docs/Fire_Safety_NOC_VALID.pdf';
    }
    if (lower.includes('rectif') || lower.includes('renew')) {
      return '/docs/Rectified_Fire_Safety_NOC_Renewal.pdf';
    }
    return '/docs/Fire_Safety_NOC_StateDirectorate.pdf';
  }
  if (lower.includes('faculty') || lower.includes('salary') || lower.includes('form16') || lower.includes('form 16')) {
    return '/docs/Faculty_Aadhaar_Form16_AuditedList.pdf';
  }
  if (lower.includes('land') || lower.includes('khasra') || lower.includes('deed')) {
    return '/docs/Land_Title_Khasra_Deed_Registered.pdf';
  }
  if (lower.includes('affiliation') || lower.includes('aktu')) {
    return '/docs/AKTU_Affiliation_Extension_2025_26.pdf';
  }
  if (lower.includes('building') || lower.includes('pwd')) {
    return '/docs/Building_Safety_PWD_Certificate.pdf';
  }
  if (lower.includes('approval') || lower.includes('eoa')) {
    if (lower.includes('mismatch')) {
      return '/docs/Sample_Approval_Letter_Mismatch.pdf';
    }
    return '/docs/AICTE_EoA_Approval_Letter_2025_26.pdf';
  }
  return '/docs/Fire_Safety_NOC_StateDirectorate.pdf';
}

export default function DocumentViewerModal({ document, onClose }: DocumentViewerModalProps) {
  const [activeTab, setActiveTab] = useState<'preview' | 'provenance'>('preview');

  if (!document) return null;

  const pdfUrl = document.url || getDemoDocUrl(document.name);

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(15, 23, 42, 0.75)',
      backdropFilter: 'blur(5px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 2000,
      padding: 20
    }}>
      <div style={{
        background: '#ffffff',
        borderRadius: 10,
        maxWidth: 1080,
        width: '100%',
        maxHeight: '94vh',
        display: 'flex',
        flexDirection: 'column',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
        overflow: 'hidden',
        border: '1px solid #cbd5e1'
      }}>
        {/* Header */}
        <div style={{
          padding: '16px 24px',
          borderBottom: '1px solid #e2e8f0',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          background: '#0f2942',
          color: '#ffffff'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{
              width: 36,
              height: 36,
              borderRadius: 6,
              background: 'rgba(255,255,255,0.12)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <FileText size={20} style={{ color: '#60a5fa' }} />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <h3 style={{ fontSize: '1.05rem', fontWeight: 800, margin: 0, color: '#ffffff' }}>
                  {document.name}
                </h3>
                {document.tier && <ProvenanceBadge tier={document.tier} />}
              </div>
              <div style={{ fontSize: '0.72rem', color: '#94a3b8', marginTop: 2 }}>
                Issuing Authority: {document.issuer || 'Statutory Department'} • File Size: {document.size || '3.2 MB'}
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <a
              href={pdfUrl}
              download={document.name.endsWith('.pdf') ? document.name : `${document.name}.pdf`}
              className="btn btn-secondary btn-sm"
              style={{
                background: 'rgba(255,255,255,0.12)',
                color: '#ffffff',
                border: '1px solid rgba(255,255,255,0.2)',
                fontSize: '0.75rem',
                textDecoration: 'none',
                display: 'inline-flex',
                alignItems: 'center',
                gap: 5
              }}
            >
              <Download size={13} /> Download PDF
            </a>
            <a
              href={pdfUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-secondary btn-sm"
              style={{
                background: 'rgba(255,255,255,0.12)',
                color: '#ffffff',
                border: '1px solid rgba(255,255,255,0.2)',
                fontSize: '0.75rem',
                textDecoration: 'none',
                display: 'inline-flex',
                alignItems: 'center',
                gap: 5
              }}
            >
              <ExternalLink size={13} /> Fullscreen
            </a>
            <button
              onClick={onClose}
              style={{
                background: 'transparent',
                border: 'none',
                color: '#94a3b8',
                cursor: 'pointer',
                padding: 6,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: 4
              }}
              title="Close Viewer"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Tab Switcher */}
        <div style={{
          display: 'flex',
          background: '#f8fafc',
          borderBottom: '1px solid #e2e8f0',
          padding: '0 24px'
        }}>
          <button
            onClick={() => setActiveTab('preview')}
            style={{
              padding: '10px 18px',
              border: 'none',
              background: 'transparent',
              fontSize: '0.8rem',
              fontWeight: 700,
              cursor: 'pointer',
              color: activeTab === 'preview' ? '#1e40af' : '#64748b',
              borderBottom: activeTab === 'preview' ? '2px solid #1e40af' : '2px solid transparent'
            }}
          >
            Official Document Preview
          </button>
          <button
            onClick={() => setActiveTab('provenance')}
            style={{
              padding: '10px 18px',
              border: 'none',
              background: 'transparent',
              fontSize: '0.8rem',
              fontWeight: 700,
              cursor: 'pointer',
              color: activeTab === 'provenance' ? '#1e40af' : '#64748b',
              borderBottom: activeTab === 'provenance' ? '2px solid #1e40af' : '2px solid transparent'
            }}
          >
            Digital Provenance & Forensic Audit Trail
          </button>
        </div>

        {/* Modal Body */}
        <div style={{ flex: 1, overflowY: 'auto', background: '#f1f5f9' }}>
          {activeTab === 'preview' ? (
            <div style={{ height: '70vh', width: '100%', display: 'flex', flexDirection: 'column' }}>
              <iframe
                src={`${pdfUrl}#toolbar=0`}
                title={document.name}
                style={{
                  width: '100%',
                  height: '100%',
                  border: 'none',
                  background: '#ffffff'
                }}
              />
            </div>
          ) : (
            <div style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 16 }}>
              {/* Provenance Details Card */}
              <div style={{ background: '#ffffff', borderRadius: 8, padding: 20, border: '1px solid #e2e8f0' }}>
                <h4 style={{ fontSize: '0.95rem', fontWeight: 800, color: '#0f2942', marginBottom: 12 }}>
                  Statutory Provenance Verification
                </h4>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 14 }}>
                  <div style={{ background: '#f8fafc', padding: 12, borderRadius: 6, border: '1px solid #e2e8f0' }}>
                    <div style={{ fontSize: '0.72rem', color: '#64748b', fontWeight: 600 }}>Cryptographic SHA-256 Hash</div>
                    <div style={{ fontSize: '0.75rem', fontFamily: 'monospace', color: '#0f2942', marginTop: 4, wordBreak: 'break-all' }}>
                      {document.sha256 || '9e8a71b290dfc142b890aef4819402ab72e90c128509ef140285a029dbca4810'}
                    </div>
                  </div>

                  <div style={{ background: '#f8fafc', padding: 12, borderRadius: 6, border: '1px solid #e2e8f0' }}>
                    <div style={{ fontSize: '0.72rem', color: '#64748b', fontWeight: 600 }}>Digital Signature Status</div>
                    <div style={{ fontSize: '0.78rem', color: '#059669', fontWeight: 700, marginTop: 4, display: 'flex', alignItems: 'center', gap: 6 }}>
                      <CheckCircle2 size={14} /> Valid X.509 Certificate Token (RFC 3161)
                    </div>
                  </div>

                  <div style={{ background: '#f8fafc', padding: 12, borderRadius: 6, border: '1px solid #e2e8f0' }}>
                    <div style={{ fontSize: '0.72rem', color: '#64748b', fontWeight: 600 }}>Government Gateway Lookup</div>
                    <div style={{ fontSize: '0.78rem', color: '#1e40af', fontWeight: 700, marginTop: 4, display: 'flex', alignItems: 'center', gap: 6 }}>
                      <Globe size={14} /> {document.authorityMatch || 'DigiLocker / State Gateway Confirmed'}
                    </div>
                  </div>

                  <div style={{ background: '#f8fafc', padding: 12, borderRadius: 6, border: '1px solid #e2e8f0' }}>
                    <div style={{ fontSize: '0.72rem', color: '#64748b', fontWeight: 600 }}>AICTE Council Archives</div>
                    <div style={{ fontSize: '0.78rem', color: '#059669', fontWeight: 700, marginTop: 4, display: 'flex', alignItems: 'center', gap: 6 }}>
                      <CheckCircle2 size={14} /> Matches Historical EoA Records (2024-25)
                    </div>
                  </div>
                </div>
              </div>

              {/* Finding / Flag Summary if any */}
              {document.flagReason && (
                <div style={{
                  background: '#fffbeb',
                  border: '1px solid #fde68a',
                  borderLeft: '4px solid #d97706',
                  borderRadius: 6,
                  padding: 16
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#92400e', fontWeight: 700, fontSize: '0.88rem', marginBottom: 4 }}>
                    <AlertTriangle size={16} /> Committee Scrutiny Finding
                  </div>
                  <p style={{ fontSize: '0.8rem', color: '#78350f', margin: 0, lineHeight: 1.5 }}>
                    {document.flagReason}
                  </p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div style={{
          padding: '12px 24px',
          borderTop: '1px solid #e2e8f0',
          background: '#ffffff',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          fontSize: '0.75rem',
          color: '#64748b'
        }}>
          <div>AICTE Document Verification Bureau • Statutory Archive Repository</div>
          <button className="btn btn-secondary btn-sm" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
