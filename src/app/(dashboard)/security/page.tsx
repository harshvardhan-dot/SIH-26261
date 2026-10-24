'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  ShieldCheck, Lock, Eye, EyeOff, UserCheck, Server,
  Database, CheckCircle, FileText, ChevronRight, Activity,
  HardDrive, Layers, Scale, Sparkles
} from 'lucide-react';

interface SecurityPillar {
  title: string;
  badge: string;
  badgeColor: string;
  badgeBg: string;
  icon: any;
  method: string;
  mechanism: string;
  technology: string[];
  threatMitigated: string;
  statutoryStandard: string;
}

const securityPillars: SecurityPillar[] = [
  {
    title: '1. In-Transit & At-Rest Encryption',
    badge: 'CRYPTOGRAPHY',
    badgeColor: '#0284c7',
    badgeBg: '#e0f2fe',
    icon: Lock,
    method: 'End-to-End Cryptographic Envelope Encryption',
    mechanism: 'All communications enforce TLS 1.3 with Perfect Forward Secrecy (PFS). Dossiers stored at rest are encrypted via AES-256-GCM with master encryption keys rotated every 90 days inside a dedicated Hardware Security Module (HSM).',
    technology: ['TLS 1.3 (RFC 8446)', 'AES-256-GCM', 'FIPS 140-2 Level 3 HSM', 'Strict HSTS'],
    threatMitigated: 'Network sniffing, Man-in-the-Middle (MitM) eavesdropping, and disk-level theft.',
    statutoryStandard: 'CERT-In Cybersecurity Directions 2022 & MeitY Cloud Mandate'
  },
  {
    title: '2. PII Sanitization & Privacy Shield',
    badge: 'DPDP ACT 2023',
    badgeColor: '#15803d',
    badgeBg: '#dcfce7',
    icon: EyeOff,
    method: 'Automated Pre-Ingestion PII Redaction & Data Minimization',
    mechanism: 'Regex and Named Entity Recognition (NER) detectors mask the first 8 digits of Aadhaar numbers (e.g. XXXX-XXXX-4819), tokenize trustee PANs, and redact private phone numbers before dossiers enter the AI or committee review queue.',
    technology: ['DPDP Act 2023 Pipeline', 'Regex Tokenizer', 'UIDAI Verhoeff Scrubber', 'Presidio NER'],
    threatMitigated: 'Identity theft, trustee/faculty doxxing, and unauthorized personal data exposure.',
    statutoryStandard: 'Digital Personal Data Protection (DPDP) Act 2023 § 6 & 8'
  },
  {
    title: '3. Ephemeral Sandboxed Processing',
    badge: 'AIR-GAPPED COMPUTE',
    badgeColor: '#7c3aed',
    badgeBg: '#f5f3ff',
    icon: Server,
    method: 'Isolated RAM-Only Compute (Zero Model Retention)',
    mechanism: 'Document parsing and OCR run in isolated Linux container cgroups with RAM-mounted tmpfs. Network egress is blocked during parsing. Zero institutional data is retained or used to train external AI models. RAM is overwritten immediately on exit.',
    technology: ['Linux cgroups & AppArmor', 'RAM-disk tmpfs Buffer', 'DoD 5220.22-M Zeroing', 'Zero-Persistence AI'],
    threatMitigated: 'PDF exploit payloads, buffer overflows, and institutional data leakage to commercial AI.',
    statutoryStandard: 'ISO/IEC 27001:2022 Control A.8 (Secure System Architecture)'
  },
  {
    title: '4. Sovereign Access & Audit Ledger',
    badge: 'IAM & AUDIT',
    badgeColor: '#4338ca',
    badgeBg: '#eef2ff',
    icon: Activity,
    method: 'National SSO Authentication & Hash-Chained Audit Trail',
    mechanism: 'Officers authenticate through MeriPehchaan National SSO with hardware token MFA. Adverse notices require Two-Officer Concurrence. Every view, download, verification, and status flip creates an append-only SHA-256 hash block.',
    technology: ['MeriPehchaan (National SSO)', 'FIDO2 / WebAuthn MFA', 'SHA-256 Hash Chaining', 'NTP Millisecond Sync'],
    threatMitigated: 'Credential stuffing, rogue insider tampering, and non-repudiation disputes.',
    statutoryStandard: 'CERT-In 180-Day Log Mandate & IT Act 2000 § 66C'
  }
];

export default function SecurityArchitecturePage() {
  const [isPIIMasked, setIsPIIMasked] = useState<boolean>(true);

  return (
    <div className="dashboard-content" style={{ paddingBottom: 60 }}>
      {/* Official Top Tricolor Line */}
      <div style={{
        height: '4px',
        width: '100%',
        borderRadius: '2px',
        marginBottom: '16px',
        background: 'linear-gradient(90deg, #FF9933 0%, #FF9933 33.3%, #ffffff 33.3%, #ffffff 66.6%, #138808 66.6%, #138808 100%)'
      }} />

      {/* Page Header */}
      <div style={{
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: 16,
        marginBottom: 20
      }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
            <span style={{
              padding: '2px 8px',
              borderRadius: 4,
              fontSize: '0.72rem',
              fontWeight: 700,
              background: '#f0fdf4',
              color: '#15803d',
              border: '1px solid #bbf7d0'
            }}>
              SECURITY & PRIVACY BRIEF
            </span>
            <span style={{
              padding: '2px 8px',
              borderRadius: 4,
              fontSize: '0.72rem',
              fontWeight: 700,
              background: '#eff6ff',
              color: '#1e40af',
              border: '1px solid #bfdbfe'
            }}>
              FOR EVALUATION PANEL
            </span>
          </div>
          <h1 style={{ fontSize: '1.45rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>
            Security, Privacy & Sovereign Data Protection Architecture
          </h1>
          <p style={{ fontSize: '0.84rem', color: '#64748b', marginTop: 4 }}>
            Direct overview of the core <strong>Method</strong>, <strong>Mechanism</strong>, and <strong>Technology</strong> protecting institutional records.
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <Link
            href="/architecture"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
              padding: '8px 14px',
              borderRadius: 6,
              background: '#ffffff',
              border: '1px solid #cbd5e1',
              color: '#0f172a',
              fontSize: '0.8rem',
              fontWeight: 600,
              textDecoration: 'none'
            }}
          >
            <Layers size={15} color="#0284c7" />
            Validation Pipeline Architecture ➔
          </Link>
          <Link
            href="/audit"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
              padding: '8px 14px',
              borderRadius: 6,
              background: '#0f2942',
              color: '#ffffff',
              fontSize: '0.8rem',
              fontWeight: 600,
              textDecoration: 'none'
            }}
          >
            <Activity size={15} />
            Immutable Audit Trail
          </Link>
        </div>
      </div>

      {/* THE 4 CORE SECURITY PILLARS (METHOD, MECHANISM, TECHNOLOGY) */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(4, 1fr)',
        gap: 14,
        marginBottom: 24
      }}>
        {securityPillars.map((pillar, idx) => {
          const Icon = pillar.icon;
          return (
            <div
              key={idx}
              style={{
                background: '#ffffff',
                borderRadius: 8,
                border: '1px solid #e2e8f0',
                padding: '16px 18px',
                boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
                display: 'flex',
                flexDirection: 'column'
              }}
            >
              {/* Header */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
                <span style={{
                  fontSize: '0.68rem',
                  fontWeight: 800,
                  padding: '2px 7px',
                  borderRadius: 4,
                  background: pillar.badgeBg,
                  color: pillar.badgeColor
                }}>
                  {pillar.badge}
                </span>
                <Icon size={16} color={pillar.badgeColor} />
              </div>

              <div style={{ fontSize: '0.96rem', fontWeight: 800, color: '#0f172a', marginBottom: 10 }}>
                {pillar.title}
              </div>

              {/* Method */}
              <div style={{ marginBottom: 8 }}>
                <div style={{ fontSize: '0.68rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                  Method
                </div>
                <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#0f172a', marginTop: 2 }}>
                  {pillar.method}
                </div>
              </div>

              {/* Mechanism */}
              <div style={{ marginBottom: 10 }}>
                <div style={{ fontSize: '0.68rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                  Mechanism
                </div>
                <div style={{ fontSize: '0.76rem', color: '#334155', lineHeight: 1.45, marginTop: 2 }}>
                  {pillar.mechanism}
                </div>
              </div>

              {/* Technology Stack */}
              <div style={{ marginTop: 'auto', paddingTop: 8, borderTop: '1px solid #f1f5f9' }}>
                <div style={{ fontSize: '0.68rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', marginBottom: 6 }}>
                  Technology Stack
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5, marginBottom: 8 }}>
                  {pillar.technology.map((tech, tIdx) => (
                    <span
                      key={tIdx}
                      style={{
                        fontSize: '0.68rem',
                        fontWeight: 700,
                        padding: '2px 6px',
                        borderRadius: 4,
                        background: '#f8fafc',
                        border: '1px solid #cbd5e1',
                        color: '#0f2942'
                      }}
                    >
                      {tech}
                    </span>
                  ))}
                </div>

                <div style={{ fontSize: '0.68rem', color: '#64748b' }}>
                  <strong style={{ color: '#0f172a' }}>Standard:</strong> {pillar.statutoryStandard}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* QUICK PANEL DEMO: 1-CLICK PII PRIVACY REDACTOR TOGGLE */}
      <div style={{
        background: '#ffffff',
        borderRadius: 8,
        border: '1px solid #e2e8f0',
        padding: '18px 20px',
        marginBottom: 24,
        boxShadow: '0 1px 3px rgba(0,0,0,0.04)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12, marginBottom: 14 }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <span style={{ fontSize: '0.68rem', fontWeight: 800, background: '#dcfce7', color: '#15803d', padding: '2px 6px', borderRadius: 4 }}>
                1-CLICK PANEL DEMO
              </span>
              <h2 style={{ fontSize: '1rem', fontWeight: 700, color: '#0f172a', margin: 0 }}>
                Live PII Redaction &amp; Data Minimization Demo (DPDP Act 2023)
              </h2>
            </div>
            <p style={{ fontSize: '0.76rem', color: '#64748b', margin: '3px 0 0 0' }}>
              Toggle the switch to see how sensitive identity data is automatically sanitized before model and committee review.
            </p>
          </div>

          {/* Toggle Switch */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{ fontSize: '0.76rem', fontWeight: 600, color: !isPIIMasked ? '#b91c1c' : '#64748b' }}>
              Raw Dossier (Exposed)
            </span>
            <button
              onClick={() => setIsPIIMasked(!isPIIMasked)}
              style={{
                width: 44,
                height: 24,
                borderRadius: 12,
                background: isPIIMasked ? '#15803d' : '#e2e8f0',
                position: 'relative',
                border: 'none',
                cursor: 'pointer',
                transition: 'background 0.2s ease',
                padding: 0
              }}
            >
              <div style={{
                width: 18,
                height: 18,
                borderRadius: 9,
                background: '#ffffff',
                position: 'absolute',
                top: 3,
                left: isPIIMasked ? 23 : 3,
                transition: 'left 0.2s ease',
                boxShadow: '0 1px 2px rgba(0,0,0,0.2)'
              }} />
            </button>
            <span style={{ fontSize: '0.76rem', fontWeight: 700, color: isPIIMasked ? '#15803d' : '#64748b' }}>
              Sanitized Privacy View (Protected)
            </span>
          </div>
        </div>

        {/* 4 Fields Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: 12,
          background: '#f8fafc',
          padding: '14px',
          borderRadius: 6,
          border: '1px solid #e2e8f0'
        }}>
          <div style={{ background: '#ffffff', padding: '10px 12px', borderRadius: 6, border: '1px solid #cbd5e1' }}>
            <div style={{ fontSize: '0.7rem', color: '#64748b', fontWeight: 600 }}>Trustee Aadhaar UID</div>
            <div style={{
              fontSize: '0.82rem',
              fontFamily: 'monospace',
              fontWeight: 700,
              marginTop: 4,
              color: isPIIMasked ? '#15803d' : '#b91c1c',
              background: isPIIMasked ? '#f0fdf4' : '#fef2f2',
              padding: '3px 6px',
              borderRadius: 4,
              display: 'inline-block'
            }}>
              {isPIIMasked ? 'XXXX-XXXX-4819' : '5491-8820-4819'}
            </div>
            <div style={{ fontSize: '0.68rem', color: '#64748b', marginTop: 4 }}>
              {isPIIMasked ? 'First 8 digits masked (UIDAI Circular)' : '⚠️ Unmasked Aadhaar exposed'}
            </div>
          </div>

          <div style={{ background: '#ffffff', padding: '10px 12px', borderRadius: 6, border: '1px solid #cbd5e1' }}>
            <div style={{ fontSize: '0.7rem', color: '#64748b', fontWeight: 600 }}>Trustee PAN Number</div>
            <div style={{
              fontSize: '0.82rem',
              fontFamily: 'monospace',
              fontWeight: 700,
              marginTop: 4,
              color: isPIIMasked ? '#15803d' : '#b91c1c',
              background: isPIIMasked ? '#f0fdf4' : '#fef2f2',
              padding: '3px 6px',
              borderRadius: 4,
              display: 'inline-block'
            }}>
              {isPIIMasked ? 'AAATT****K' : 'AAATT1928K'}
            </div>
            <div style={{ fontSize: '0.68rem', color: '#64748b', marginTop: 4 }}>
              {isPIIMasked ? 'Middle 4 digits salted token' : '⚠️ Plaintext PAN visible'}
            </div>
          </div>

          <div style={{ background: '#ffffff', padding: '10px 12px', borderRadius: 6, border: '1px solid #cbd5e1' }}>
            <div style={{ fontSize: '0.7rem', color: '#64748b', fontWeight: 600 }}>Principal Mobile Contact</div>
            <div style={{
              fontSize: '0.82rem',
              fontFamily: 'monospace',
              fontWeight: 700,
              marginTop: 4,
              color: isPIIMasked ? '#15803d' : '#b91c1c',
              background: isPIIMasked ? '#f0fdf4' : '#fef2f2',
              padding: '3px 6px',
              borderRadius: 4,
              display: 'inline-block'
            }}>
              {isPIIMasked ? '+91-XXXXX-99412' : '+91-98112-99412'}
            </div>
            <div style={{ fontSize: '0.68rem', color: '#64748b', marginTop: 4 }}>
              {isPIIMasked ? 'Phone prefix masked against phishing' : '⚠️ Personal telephone exposed'}
            </div>
          </div>

          <div style={{ background: '#ffffff', padding: '10px 12px', borderRadius: 6, border: '1px solid #cbd5e1' }}>
            <div style={{ fontSize: '0.7rem', color: '#64748b', fontWeight: 600 }}>Regulatory Claim (Preserved)</div>
            <div style={{
              fontSize: '0.82rem',
              fontFamily: 'monospace',
              fontWeight: 700,
              marginTop: 4,
              color: '#0f2942',
              background: '#f1f5f9',
              padding: '3px 6px',
              borderRadius: 4,
              display: 'inline-block'
            }}>
              Plot #142/A • 7.85 Ac • NOC 2027
            </div>
            <div style={{ fontSize: '0.68rem', color: '#15803d', marginTop: 4, fontWeight: 600 }}>
              ✓ Data Minimization: Only regulatory metrics kept
            </div>
          </div>
        </div>
      </div>

      {/* COMPACT SUMMARY TABLE FOR THE PANEL */}
      <div style={{
        background: '#ffffff',
        borderRadius: 8,
        border: '1px solid #e2e8f0',
        padding: '16px 20px',
        boxShadow: '0 1px 3px rgba(0,0,0,0.04)'
      }}>
        <div style={{ fontSize: '0.88rem', fontWeight: 800, color: '#0f172a', marginBottom: 10 }}>
          Executive Security &amp; Privacy Summary Matrix
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.76rem' }}>
            <thead>
              <tr style={{ background: '#f8fafc', borderBottom: '1px solid #cbd5e1', textAlign: 'left' }}>
                <th style={{ padding: '8px 10px', color: '#475569', fontWeight: 700 }}>Domain</th>
                <th style={{ padding: '8px 10px', color: '#475569', fontWeight: 700 }}>Method</th>
                <th style={{ padding: '8px 10px', color: '#475569', fontWeight: 700 }}>Mechanism</th>
                <th style={{ padding: '8px 10px', color: '#475569', fontWeight: 700 }}>Technology Used</th>
                <th style={{ padding: '8px 10px', color: '#475569', fontWeight: 700 }}>Statutory Standard</th>
              </tr>
            </thead>
            <tbody>
              <tr style={{ borderBottom: '1px solid #f1f5f9' }}>
                <td style={{ padding: '10px 10px', fontWeight: 700, color: '#0284c7' }}>1. Data Encryption</td>
                <td style={{ padding: '10px 10px', fontWeight: 600, color: '#0f172a' }}>Envelope Encryption &amp; PFS</td>
                <td style={{ padding: '10px 10px', color: '#334155' }}>TLS 1.3 in-transit, AES-256-GCM at-rest with 90-day HSM key rotation</td>
                <td style={{ padding: '10px 10px', fontFamily: 'monospace', color: '#0f2942' }}>TLS 1.3 + AES-256-GCM + FIPS 140-2 HSM</td>
                <td style={{ padding: '10px 10px', color: '#64748b' }}>CERT-In 2022 Directions</td>
              </tr>
              <tr style={{ borderBottom: '1px solid #f1f5f9' }}>
                <td style={{ padding: '10px 10px', fontWeight: 700, color: '#15803d' }}>2. Data Privacy</td>
                <td style={{ padding: '10px 10px', fontWeight: 600, color: '#0f172a' }}>Automated PII Scrubbing</td>
                <td style={{ padding: '10px 10px', color: '#334155' }}>Masks Aadhaar 8 digits, tokenizes PANs, redacts private phone numbers before review</td>
                <td style={{ padding: '10px 10px', fontFamily: 'monospace', color: '#0f2942' }}>Regex Tokenizer + Verhoeff + Presidio NER</td>
                <td style={{ padding: '10px 10px', color: '#64748b' }}>DPDP Act 2023 § 6 &amp; 8</td>
              </tr>
              <tr style={{ borderBottom: '1px solid #f1f5f9' }}>
                <td style={{ padding: '10px 10px', fontWeight: 700, color: '#7c3aed' }}>3. Compute Sandbox</td>
                <td style={{ padding: '10px 10px', fontWeight: 600, color: '#0f172a' }}>Air-Gapped RAM-Only Compute</td>
                <td style={{ padding: '10px 10px', color: '#334155' }}>Ephemeral tmpfs execution, zero external network egress, immediate memory zeroing</td>
                <td style={{ padding: '10px 10px', fontFamily: 'monospace', color: '#0f2942' }}>Linux cgroups + tmpfs + DoD 5220.22-M</td>
                <td style={{ padding: '10px 10px', color: '#64748b' }}>ISO/IEC 27001 Control A.8</td>
              </tr>
              <tr>
                <td style={{ padding: '10px 10px', fontWeight: 700, color: '#4338ca' }}>4. Access &amp; Audit</td>
                <td style={{ padding: '10px 10px', fontWeight: 600, color: '#0f172a' }}>National SSO &amp; Hash Chaining</td>
                <td style={{ padding: '10px 10px', color: '#334155' }}>MeriPehchaan SSO, hardware MFA, two-officer concurrence, append-only SHA-256 ledger</td>
                <td style={{ padding: '10px 10px', fontFamily: 'monospace', color: '#0f2942' }}>MeriPehchaan + FIDO2 + SHA-256 Ledger</td>
                <td style={{ padding: '10px 10px', color: '#64748b' }}>CERT-In 180-Day &amp; IT Act § 66C</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
