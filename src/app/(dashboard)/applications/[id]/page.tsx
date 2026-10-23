'use client';

import { useEffect, useState, use, Suspense } from 'react';
import Link from 'next/link';
import {
  ArrowLeft, FileText, AlertTriangle, CheckCircle, ClipboardList,
  History, Shield, Search, Building2, MapPin, Calendar, User,
  FileCheck, XCircle, Clock, AlertCircle, ExternalLink,
  Eye, Download, RotateCcw, ChevronDown, ChevronUp,
  Loader2, Info, Fingerprint, Globe, QrCode, Key, Scale
} from 'lucide-react';
import ProvenanceBadge from '@/components/ProvenanceBadge';
import ProvenanceLadderWidget from '@/components/ProvenanceLadderWidget';
import ScrutinyReportExportModal from '@/components/ScrutinyReportExportModal';

export const dynamic = 'force-dynamic';

function getRuleProvenanceTier(ruleName: string): 1 | 2 | 3 | 4 {
  const lower = ruleName.toLowerCase();
  if (lower.includes('signature') || lower.includes('digital') || lower.includes('qr') || lower.includes('cryptographic')) return 1;
  if (lower.includes('authority') || lower.includes('fire') || lower.includes('affiliation') || lower.includes('noc') || lower.includes('digilocker') || lower.includes('ugc')) return 2;
  if (lower.includes('society') || lower.includes('pid') || lower.includes('trust') || lower.includes('archive') || lower.includes('intake')) return 3;
  return 4;
}

interface ApplicationData {
  application: {
    id: string; category: string; status: string; priority: string;
    submitted_at: string; institution_name: string; institution_code: string;
    state: string; city: string; institution_type: string; established_year: number;
    university_affiliation: string; assigned_to_name: string; assigned_to_email: string;
    validation_score: number; anomaly_count: number; compliance_score: number;
    verification_status: string; academic_year: string;
  };
  documents: Array<{
    id: string; type: string; filename: string; file_size: number;
    status: string; upload_date: string; expiry_date: string;
  }>;
  validationResults: Array<{
    id: string; rule_name: string; status: string; severity: string;
    details: string; created_at: string;
  }>;
  anomalyFlags: Array<{
    id: string; type: string; severity: string; title: string;
    description: string; status: string; created_at: string;
  }>;
  verificationRecords: Array<{
    id: string; source: string; source_type: string; status: string;
    created_at: string; notes: string;
  }>;
  complianceChecks: Array<{
    id: string; category: string; requirement: string; status: string;
    severity: string; evidence: string; notes: string;
  }>;
  auditLog: Array<{
    id: string; action: string; module: string; details: string;
    user_name: string; created_at: string;
  }>;
  alerts: Array<{
    id: string; type: string; severity: string; title: string;
    message: string; resolved: number; created_at: string;
  }>;
}

const tabs = [
  { id: 'overview', label: 'Overview', icon: Eye },
  { id: 'validation', label: 'Document Validation', icon: FileCheck },
  { id: 'anomaly', label: 'Anomaly Detection', icon: AlertTriangle },
  { id: 'verification', label: 'Verification', icon: Search },
  { id: 'compliance', label: 'Compliance', icon: ClipboardList },
  { id: 'audit', label: 'Audit Trail', icon: History },
];

const statusLabels: Record<string, string> = {
  submitted: 'Submitted', under_review: 'Under Review', validated: 'Validated',
  verification_pending: 'Verification Pending', verified: 'Verified',
  compliance_check: 'Compliance Check', approved: 'Approved',
  rejected: 'Rejected', flagged: 'Flagged',
  valid: 'Valid', expired: 'Expired', missing: 'Missing',
  passed: 'Passed', failed: 'Failed', warning: 'Warning',
  open: 'Open', investigating: 'Investigating', resolved: 'Resolved',
  false_positive: 'False Positive', mismatch: 'Mismatch', pending: 'Pending',
  source_unavailable: 'Source Unavailable', manual_review: 'Manual Review',
  compliant: 'Compliant', non_compliant: 'Non-Compliant',
  partially_compliant: 'Partial', not_applicable: 'N/A',
};

const docTypeLabels: Record<string, string> = {
  affidavit: 'Affidavit / Undertaking', noc_state_govt: 'NOC (State Govt)',
  land_document: 'Land Document', building_plan: 'Building Plan',
  fire_safety_cert: 'Fire Safety Certificate', accreditation_cert: 'Accreditation Certificate',
  faculty_list: 'Faculty List', financial_statement: 'Financial Statement',
  fee_receipt: 'Fee Receipt', university_affiliation_letter: 'University Affiliation Letter',
  trust_deed: 'Trust Deed', eoa_previous: 'Previous EoA',
  infrastructure_photos: 'Infrastructure Photos', lab_equipment_list: 'Lab Equipment List',
  anti_ragging_affidavit: 'Anti-Ragging Affidavit', sc_st_committee_report: 'SC/ST Committee Report',
};

const verificationIcons: Record<string, typeof CheckCircle> = {
  api: Globe, portal: ExternalLink, manual: User, qr: QrCode,
};

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return bytes + ' B';
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
  return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
}

function ApplicationDetailContent({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [data, setData] = useState<ApplicationData | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [expandedCompliance, setExpandedCompliance] = useState<string | null>(null);
  const [reportModalOpen, setReportModalOpen] = useState(false);

  useEffect(() => {
    fetch(`/api/applications/${id}`)
      .then(r => r.json())
      .then(d => { setData(d); setLoading(false); })
      .catch(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="page-container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '60vh' }}>
        <Loader2 size={32} style={{ animation: 'spin 1s linear infinite', color: 'var(--accent-blue)' }} />
        <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  if (!data || !data.application) {
    return (
      <div className="page-container">
        <div className="empty-state">
          <h3>Application Not Found</h3>
          <p>The requested application could not be found.</p>
          <Link href="/applications" className="btn btn-primary" style={{ marginTop: '16px' }}>
            <ArrowLeft size={16} /> Back to Applications
          </Link>
        </div>
      </div>
    );
  }

  const app = data.application;
  const getScoreColor = (score: number) => {
    if (score >= 85) return 'var(--accent-green)';
    if (score >= 70) return 'var(--accent-amber)';
    return 'var(--accent-red)';
  };

  const passedValidations = data.validationResults.filter(v => v.status === 'passed').length;
  const totalValidations = data.validationResults.length;
  const openAnomalies = data.anomalyFlags.filter(a => a.status === 'open' || a.status === 'investigating').length;
  const verifiedDocs = data.verificationRecords.filter(v => v.status === 'verified').length;
  const compliantChecks = data.complianceChecks.filter(c => c.status === 'compliant').length;

  // Group compliance checks by category
  const complianceByCategory: Record<string, typeof data.complianceChecks> = {};
  data.complianceChecks.forEach(c => {
    if (!complianceByCategory[c.category]) complianceByCategory[c.category] = [];
    complianceByCategory[c.category].push(c);
  });

  return (
    <div className="page-container">
      {/* Header */}
      <div className="animate-fade-in" style={{ marginBottom: 'var(--spacing-xl)' }}>
        <Link href="/applications" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: 'var(--spacing-md)' }}>
          <ArrowLeft size={14} /> Back to Applications
        </Link>

        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: 'var(--spacing-md)' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
              <div style={{
                width: 48, height: 48, borderRadius: 'var(--border-radius-lg)',
                background: 'var(--gradient-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <Building2 size={24} color="white" />
              </div>
              <div>
                <h1 className="page-title" style={{ fontSize: '1.5rem' }}>{app.institution_name}</h1>
                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-md)', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <MapPin size={13} /> {app.city}, {app.state}
                  </span>
                  <span>•</span>
                  <span>{app.institution_code}</span>
                  <span>•</span>
                  <span>{app.institution_type}</span>
                </div>
              </div>
            </div>
          </div>
          <div style={{ display: 'flex', gap: 'var(--spacing-sm)', alignItems: 'center' }}>
            <button
              onClick={() => setReportModalOpen(true)}
              className="btn btn-primary btn-sm"
              style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
              id="export-scrutiny-report-btn"
            >
              <Download size={14} /> Export Report (PDF)
            </button>
            <span className={`status-badge ${app.status}`} style={{ padding: '6px 16px', fontSize: '0.85rem' }}>
              <span className="status-dot" />
              {statusLabels[app.status]}
            </span>
            <span className={`severity-badge ${app.priority}`}>{app.priority}</span>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="stats-grid" style={{ marginTop: 'var(--spacing-lg)' }}>
          <div className="stat-card" style={{ padding: 'var(--spacing-md)', '--stat-bg': 'var(--accent-blue-soft)', '--stat-color': 'var(--accent-blue)' } as React.CSSProperties}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div className="stat-icon" style={{ width: 36, height: 36 }}><FileCheck size={18} /></div>
              <div>
                <div style={{ fontSize: '1.3rem', fontWeight: 700 }}>{passedValidations}/{totalValidations}</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Validations Passed</div>
              </div>
            </div>
          </div>
          <div className="stat-card" style={{ padding: 'var(--spacing-md)', '--stat-bg': 'var(--accent-amber-soft)', '--stat-color': 'var(--accent-amber)' } as React.CSSProperties}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div className="stat-icon" style={{ width: 36, height: 36 }}><AlertTriangle size={18} /></div>
              <div>
                <div style={{ fontSize: '1.3rem', fontWeight: 700 }}>{openAnomalies}</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Open Anomalies</div>
              </div>
            </div>
          </div>
          <div className="stat-card" style={{ padding: 'var(--spacing-md)', '--stat-bg': 'var(--accent-green-soft)', '--stat-color': 'var(--accent-green)' } as React.CSSProperties}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div className="stat-icon" style={{ width: 36, height: 36 }}><Shield size={18} /></div>
              <div>
                <div style={{ fontSize: '1.3rem', fontWeight: 700 }}>{verifiedDocs}/{data.verificationRecords.length}</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Verified Sources</div>
              </div>
            </div>
          </div>
          <div className="stat-card" style={{ padding: 'var(--spacing-md)', '--stat-bg': 'var(--accent-purple-soft)', '--stat-color': 'var(--accent-purple)' } as React.CSSProperties}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div className="stat-icon" style={{ width: 36, height: 36 }}><ClipboardList size={18} /></div>
              <div>
                <div style={{ fontSize: '1.3rem', fontWeight: 700 }}>{compliantChecks}/{data.complianceChecks.length}</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Compliance Checks</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="tabs animate-fade-in">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              className={`tab ${activeTab === tab.id ? 'active' : ''}`}
              onClick={() => setActiveTab(tab.id)}
            >
              <Icon size={16} style={{ marginRight: '6px', verticalAlign: 'middle' }} />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Tab Content */}
      <div className="animate-fade-in">
        {/* ===== OVERVIEW TAB ===== */}
        {activeTab === 'overview' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            <div className="grid-2">
              <div className="card">
                <div className="card-header">
                  <div className="card-title">Application Dossier Overview</div>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--spacing-md)', fontSize: '0.85rem' }}>
                  {[
                    ['Category', app.category],
                    ['Academic Year', app.academic_year],
                    ['Submitted', new Date(app.submitted_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })],
                    ['Assigned To', app.assigned_to_name || 'Unassigned'],
                    ['Institution Type', app.institution_type],
                    ['University', app.university_affiliation],
                    ['Established', String(app.established_year)],
                    ['Permanent ID (PID)', app.institution_code],
                  ].map(([label, value]) => (
                    <div key={label as string}>
                      <div style={{ color: 'var(--text-muted)', fontSize: '0.75rem', marginBottom: '2px' }}>{label}</div>
                      <div style={{ fontWeight: 500, color: 'var(--text-primary)' }}>{value}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Provenance Ladder for this dossier */}
              <ProvenanceLadderWidget
                compact={true}
                stats={{
                  tier1Count: 4,
                  tier2Count: 6,
                  tier3Count: 5,
                  tier4Count: data.anomalyFlags.length || 2
                }}
              />
            </div>

            <div className="card">
              <div className="card-header">
                <div className="card-title">Submitted Documents ({data.documents.length})</div>
              </div>
              <div style={{ maxHeight: '300px', overflow: 'auto' }}>
                {data.documents.map(doc => (
                  <div key={doc.id} style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    padding: '10px 0', borderBottom: '1px solid var(--glass-border)',
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <FileText size={16} style={{ color: 'var(--accent-blue)', flexShrink: 0 }} />
                      <div>
                        <div style={{ fontSize: '0.85rem', fontWeight: 500 }}>{docTypeLabels[doc.type] || doc.type}</div>
                        <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{formatFileSize(doc.file_size)}</div>
                      </div>
                    </div>
                    <span className={`status-badge ${doc.status}`}>{statusLabels[doc.status] || doc.status}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ===== VALIDATION TAB ===== */}
        {activeTab === 'validation' && (
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-md)', marginBottom: 'var(--spacing-xl)', padding: 'var(--spacing-lg)', background: 'var(--glass-bg)', borderRadius: 'var(--border-radius-lg)', border: '1px solid var(--glass-border)' }}>
              <Info size={20} style={{ color: 'var(--accent-blue)', flexShrink: 0 }} />
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                <strong style={{ color: 'var(--text-primary)' }}>Intelligent Validation Report</strong> — The system has automatically checked all submitted documents against
                the {app.category} checklist. Fields marked as failed require attention. Validation results are advisory and subject to official review.
              </p>
            </div>

            <div className="card" style={{ marginBottom: 'var(--spacing-lg)' }}>
              <div className="card-header">
                <div>
                  <div className="card-title">Validation Score</div>
                  <div className="card-subtitle">Overall completeness and consistency</div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-md)' }}>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '2rem', fontWeight: 700, color: getScoreColor(app.validation_score) }}>
                      {app.validation_score}%
                    </div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{passedValidations} of {totalValidations} rules passed</div>
                  </div>
                </div>
              </div>
              <div className="progress-bar" style={{ height: '8px' }}>
                <div className="progress-fill" style={{ width: `${app.validation_score}%`, background: getScoreColor(app.validation_score) }} />
              </div>
            </div>

            <div className="data-table-wrapper">
              <table className="data-table">
                <thead>
                  <tr>
                    <th style={{ width: '40px' }}></th>
                    <th>Validation Rule</th>
                    <th>Evidence Provenance</th>
                    <th>Status</th>
                    <th>Details</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {data.validationResults.map((v) => {
                    const ruleTier = getRuleProvenanceTier(v.rule_name);
                    return (
                      <tr key={v.id}>
                        <td>
                          {v.status === 'passed' ? <CheckCircle size={16} style={{ color: 'var(--accent-green)' }} /> :
                            v.status === 'failed' ? <XCircle size={16} style={{ color: 'var(--accent-red)' }} /> :
                              <AlertTriangle size={16} style={{ color: 'var(--accent-amber)' }} />}
                        </td>
                        <td style={{ fontWeight: 600 }}>{v.rule_name}</td>
                        <td>
                          <ProvenanceBadge tier={ruleTier} showDetails={true} />
                        </td>
                        <td><span className={`status-badge ${v.status}`}>{statusLabels[v.status] || v.status}</span></td>
                        <td style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', maxWidth: '300px' }}>{v.details}</td>
                        <td>
                          {v.status !== 'passed' && (
                            <button className="btn btn-ghost btn-sm">
                              <RotateCcw size={12} /> Rectify
                            </button>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ===== ANOMALY DETECTION TAB ===== */}
        {activeTab === 'anomaly' && (
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-md)', marginBottom: 'var(--spacing-xl)', padding: 'var(--spacing-lg)', background: '#fffbeb', borderRadius: 'var(--border-radius-lg)', border: '1px solid #fde68a' }}>
              <AlertTriangle size={20} style={{ color: '#d97706', flexShrink: 0 }} />
              <p style={{ fontSize: '0.85rem', color: '#92400e', lineHeight: 1.6 }}>
                <strong>Provenance Tier 4 (Forensic Heuristics):</strong> These flags are preliminary investigative hints requiring human inquiry. They are <strong>NOT conclusive findings of forgery</strong> under administrative law. Officials should corroborate each flag before issuing adverse notices.
              </p>
            </div>

            {data.anomalyFlags.length === 0 ? (
              <div className="empty-state">
                <CheckCircle className="empty-icon" style={{ color: 'var(--accent-green)' }} />
                <h3>No Anomalies Detected</h3>
                <p>All documents passed the initial anomaly screening.</p>
              </div>
            ) : (
              <div style={{ display: 'grid', gap: 'var(--spacing-md)' }}>
                {data.anomalyFlags.map((anomaly) => (
                  <div key={anomaly.id} className="card" style={{
                    borderLeft: `4px solid ${anomaly.severity === 'critical' ? 'var(--accent-red)' : '#d97706'}`,
                  }}>
                    <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 'var(--spacing-md)' }}>
                      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 'var(--spacing-md)' }}>
                        <div style={{
                          width: 40, height: 40, borderRadius: 'var(--border-radius-md)',
                          background: anomaly.severity === 'critical' ? 'var(--accent-red-soft)' : '#fef3c7',
                          display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                        }}>
                          <Fingerprint size={20} style={{
                            color: anomaly.severity === 'critical' ? 'var(--accent-red)' : '#d97706'
                          }} />
                        </div>
                        <div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
                            <div style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-primary)' }}>{anomaly.title}</div>
                            <ProvenanceBadge tier={4} showDetails={true} />
                          </div>
                          <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: 8 }}>{anomaly.description}</div>
                          <div style={{ display: 'flex', gap: 'var(--spacing-sm)', alignItems: 'center', flexWrap: 'wrap' }}>
                            <span className="chip">{anomaly.type.replace(/_/g, ' ')}</span>
                            <span style={{ fontSize: '0.72rem', color: '#b45309', background: '#fef3c7', padding: '2px 8px', borderRadius: 4, fontWeight: 600 }}>
                              Investigative Hint Only
                            </span>
                            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                              Detected: {new Date(anomaly.created_at).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '8px' }}>
                        <span className={`severity-badge ${anomaly.severity}`}>{anomaly.severity}</span>
                        <span className={`status-badge ${anomaly.status}`}>
                          <span className="status-dot" />
                          {statusLabels[anomaly.status] || anomaly.status}
                        </span>
                      </div>
                    </div>
                    <div style={{ display: 'flex', gap: 'var(--spacing-sm)', marginTop: 'var(--spacing-md)', paddingTop: 'var(--spacing-md)', borderTop: '1px solid var(--glass-border)' }}>
                      <button className="btn btn-secondary btn-sm"><Eye size={12} /> Review Evidence</button>
                      <button className="btn btn-ghost btn-sm"><CheckCircle size={12} /> Mark Reviewed</button>
                      <button className="btn btn-ghost btn-sm"><XCircle size={12} /> False Positive</button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ===== VERIFICATION TAB ===== */}
        {activeTab === 'verification' && (
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-md)', marginBottom: 'var(--spacing-xl)', padding: 'var(--spacing-lg)', background: 'var(--glass-bg)', borderRadius: 'var(--border-radius-lg)', border: '1px solid var(--glass-border)' }}>
              <Shield size={20} style={{ color: 'var(--accent-green)', flexShrink: 0 }} />
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                <strong style={{ color: 'var(--text-primary)' }}>Issuing Authority Verification</strong> — Documents verified through authorized APIs, official portals,
                QR codes, and digital signatures. Results show verification status from each source with timestamp.
              </p>
            </div>

            <div style={{ display: 'grid', gap: 'var(--spacing-md)' }}>
              {data.verificationRecords.map((v) => {
                const SourceIcon = verificationIcons[v.source_type] || Globe;
                const statusColors: Record<string, { bg: string; color: string; icon: typeof CheckCircle }> = {
                  verified: { bg: 'var(--accent-green-soft)', color: 'var(--accent-green)', icon: CheckCircle },
                  mismatch: { bg: 'var(--accent-red-soft)', color: 'var(--accent-red)', icon: XCircle },
                  expired: { bg: 'var(--accent-red-soft)', color: 'var(--accent-red)', icon: Clock },
                  pending: { bg: 'var(--accent-amber-soft)', color: 'var(--accent-amber)', icon: Clock },
                  source_unavailable: { bg: 'var(--accent-purple-soft)', color: 'var(--accent-purple)', icon: AlertCircle },
                  manual_review: { bg: 'var(--accent-cyan-soft)', color: 'var(--accent-cyan)', icon: User },
                };
                const s = statusColors[v.status] || statusColors.pending;
                const StatusIcon = s.icon;

                return (
                  <div key={v.id} className="card" style={{ padding: 'var(--spacing-md) var(--spacing-lg)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-md)' }}>
                        <div style={{
                          width: 44, height: 44, borderRadius: 'var(--border-radius-md)',
                          background: s.bg, display: 'flex', alignItems: 'center', justifyContent: 'center',
                        }}>
                          <StatusIcon size={20} style={{ color: s.color }} />
                        </div>
                        <div>
                          <div style={{ fontSize: '0.95rem', fontWeight: 600, color: 'var(--text-primary)' }}>{v.source}</div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-sm)', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                            <SourceIcon size={12} />
                            <span style={{ textTransform: 'capitalize' }}>{v.source_type} verification</span>
                            <span>•</span>
                            <span>{new Date(v.created_at).toLocaleString()}</span>
                          </div>
                        </div>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-sm)' }}>
                        <span className={`status-badge ${v.status}`}>
                          <span className="status-dot" />
                          {statusLabels[v.status]}
                        </span>
                        {v.status === 'pending' && (
                          <button className="btn btn-primary btn-sm"><RotateCcw size={12} /> Retry</button>
                        )}
                        {v.status === 'manual_review' && (
                          <button className="btn btn-secondary btn-sm"><User size={12} /> Assign</button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ===== COMPLIANCE TAB ===== */}
        {activeTab === 'compliance' && (
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-md)', marginBottom: 'var(--spacing-xl)', padding: 'var(--spacing-lg)', background: 'var(--glass-bg)', borderRadius: 'var(--border-radius-lg)', border: '1px solid var(--glass-border)' }}>
              <ClipboardList size={20} style={{ color: 'var(--accent-purple)', flexShrink: 0 }} />
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                <strong style={{ color: 'var(--text-primary)' }}>Regulatory Compliance Assessment</strong> — Checks based on the AICTE Approval Process Handbook.
                Findings are advisory and subject to review by authorized officials. Physical inspection may be required.
              </p>
            </div>

            {/* Compliance Score Card */}
            <div className="card" style={{ marginBottom: 'var(--spacing-lg)' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div>
                  <div className="card-title">Overall Compliance Score</div>
                  <div className="card-subtitle">{compliantChecks} of {data.complianceChecks.length} requirements met</div>
                </div>
                <div style={{ fontSize: '2.5rem', fontWeight: 700, color: getScoreColor(app.compliance_score) }}>
                  {app.compliance_score}%
                </div>
              </div>
              <div className="progress-bar" style={{ height: '8px', marginTop: 'var(--spacing-md)' }}>
                <div className="progress-fill" style={{ width: `${app.compliance_score}%`, background: getScoreColor(app.compliance_score) }} />
              </div>
            </div>

            {/* Category Breakdown */}
            {Object.entries(complianceByCategory).map(([category, checks]) => {
              const catCompliant = checks.filter(c => c.status === 'compliant').length;
              const catPercent = Math.round((catCompliant / checks.length) * 100);
              const isExpanded = expandedCompliance === category;

              return (
                <div key={category} className="card" style={{ marginBottom: 'var(--spacing-md)' }}>
                  <div
                    style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer' }}
                    onClick={() => setExpandedCompliance(isExpanded ? null : category)}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-md)' }}>
                      <div style={{
                        width: 36, height: 36, borderRadius: 'var(--border-radius-md)',
                        background: catPercent >= 70 ? 'var(--accent-green-soft)' : 'var(--accent-amber-soft)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                      }}>
                        <span style={{ fontWeight: 700, fontSize: '0.85rem', color: catPercent >= 70 ? 'var(--accent-green)' : 'var(--accent-amber)' }}>
                          {catPercent}%
                        </span>
                      </div>
                      <div>
                        <div style={{ fontWeight: 600 }}>{category}</div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{catCompliant}/{checks.length} requirements met</div>
                      </div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-sm)' }}>
                      <div className="progress-bar" style={{ width: '100px' }}>
                        <div className="progress-fill" style={{ width: `${catPercent}%`, background: getScoreColor(catPercent) }} />
                      </div>
                      {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                    </div>
                  </div>

                  {isExpanded && (
                    <div style={{ marginTop: 'var(--spacing-lg)', borderTop: '1px solid var(--glass-border)', paddingTop: 'var(--spacing-md)' }}>
                      {checks.map(check => (
                        <div key={check.id} style={{
                          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                          padding: '10px 0', borderBottom: '1px solid #f1f5f9',
                        }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            {check.status === 'compliant' ? <CheckCircle size={14} style={{ color: 'var(--accent-green)', flexShrink: 0 }} /> :
                              check.status === 'non_compliant' ? <XCircle size={14} style={{ color: 'var(--accent-red)', flexShrink: 0 }} /> :
                                check.status === 'partially_compliant' ? <AlertTriangle size={14} style={{ color: 'var(--accent-amber)', flexShrink: 0 }} /> :
                                  <Clock size={14} style={{ color: 'var(--text-muted)', flexShrink: 0 }} />}
                            <span style={{ fontSize: '0.85rem' }}>{check.requirement}</span>
                          </div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-sm)' }}>
                            <span className={`severity-badge ${check.severity === 'required' ? 'high' : 'low'}`}>
                              {check.severity}
                            </span>
                            <span className={`status-badge ${check.status}`}>
                              {statusLabels[check.status]}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* ===== AUDIT TRAIL TAB ===== */}
        {activeTab === 'audit' && (
          <div className="card">
            <div className="card-header">
              <div>
                <div className="card-title">Audit Trail</div>
                <div className="card-subtitle">Complete history of actions on this application</div>
              </div>
              <button
                className="btn btn-secondary btn-sm"
                onClick={() => setReportModalOpen(true)}
                style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
              >
                <Download size={14} /> Export Scrutiny PDF
              </button>
            </div>
            <div className="timeline">
              {data.auditLog.map((log) => (
                <div key={log.id} className={`timeline-item ${
                  log.action.includes('Anomaly') ? 'warning' :
                    log.action.includes('rejected') || log.action.includes('Alert') ? 'error' :
                      log.action.includes('Verified') || log.action.includes('approved') ? 'success' : ''
                }`}>
                  <div className="timeline-time">
                    {new Date(log.created_at).toLocaleString()} • {log.user_name}
                  </div>
                  <div className="timeline-title">{log.action}</div>
                  <div className="timeline-desc">
                    Module: {log.module} • {log.details}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <ScrutinyReportExportModal
        isOpen={reportModalOpen}
        onClose={() => setReportModalOpen(false)}
        collegeName={app.institution_name}
        collegeCode={app.institution_code}
        applicationId={app.id}
      />
    </div>
  );
}

export default function ApplicationDetailPage({ params }: { params: Promise<{ id: string }> }) {
  return (
    <Suspense fallback={
      <div className="page-container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '60vh' }}>
        <Loader2 size={32} style={{ animation: 'spin 1s linear infinite', color: 'var(--accent-blue)' }} />
      </div>
    }>
      <ApplicationDetailContent params={params} />
    </Suspense>
  );
}

