'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  AlertTriangle, Shield, CheckCircle, Search, Filter,
  Fingerprint, FileText, ArrowRight, Eye, ShieldAlert,
  AlertCircle, Check, Clock, X, ChevronRight, RefreshCw,
  ExternalLink, Building2, MapPin, Scale
} from 'lucide-react';
import ProvenanceBadge from '@/components/ProvenanceBadge';

interface AnomalyItem {
  id: string;
  application_id: string;
  document_id: string;
  type: string;
  severity: 'critical' | 'high' | 'medium' | 'low';
  title: string;
  description: string;
  evidence: string;
  status: 'open' | 'investigating' | 'resolved';
  reviewed_by: string | null;
  reviewed_at: string | null;
  created_at: string;
  document_name?: string;
  document_type?: string;
  institution_name?: string;
  app_category?: string;
}

interface AnomalyStats {
  total: number;
  open_count: number;
  investigating_count: number;
  resolved_count: number;
  critical_count: number;
  high_count: number;
  medium_count: number;
  low_count: number;
}

export default function AnomalyDetectionPage() {
  const [anomalies, setAnomalies] = useState<AnomalyItem[]>([]);
  const [stats, setStats] = useState<AnomalyStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedSeverity, setSelectedSeverity] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [activeAnomaly, setActiveAnomaly] = useState<AnomalyItem | null>(null);
  const [reviewNote, setReviewNote] = useState('');
  const [updating, setUpdating] = useState(false);

  const fetchAnomalies = () => {
    setLoading(true);
    let url = '/api/anomalies';
    const params = new URLSearchParams();
    if (selectedSeverity !== 'all') params.append('severity', selectedSeverity);
    if (selectedStatus !== 'all') params.append('status', selectedStatus);
    if (params.toString()) url += `?${params.toString()}`;

    fetch(url)
      .then(res => res.json())
      .then(data => {
        setAnomalies(data.anomalies || []);
        if (data.stats) setStats(data.stats);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  };

  useEffect(() => {
    fetchAnomalies();
  }, [selectedSeverity, selectedStatus]);

  const handleUpdateStatus = async (anomalyId: string, newStatus: string) => {
    setUpdating(true);
    try {
      const res = await fetch('/api/anomalies', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: anomalyId,
          status: newStatus,
          reviewed_by: 'Dr. Rajesh Kumar (Approval Bureau)',
          notes: reviewNote
        })
      });
      if (res.ok) {
        setReviewNote('');
        setActiveAnomaly(null);
        fetchAnomalies();
      }
    } catch (e) {
      console.error(e);
    } finally {
      setUpdating(false);
    }
  };

  return (
    <div className="page-container">
      {/* Header */}
      <div className="page-header">
        <div>
          <div className="page-header-pretitle">
            <ShieldAlert size={14} style={{ color: 'var(--accent-red)', display: 'inline', marginRight: 6 }} />
            AICTE Forensic Verification Engine
          </div>
          <h1 className="page-header-title">Anomaly & Alteration Detection</h1>
          <p className="page-header-subtitle">
            AI-powered forensic document analysis: detecting PDF metadata tampering, duplicate document reuse, font inconsistencies, and unauthorized modifications
          </p>
        </div>
        <div>
          <button className="btn btn-secondary" onClick={fetchAnomalies}>
            <RefreshCw size={16} /> Refresh Flags
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="stats-grid" style={{ marginBottom: 'var(--spacing-lg)' }}>
        <div className="stat-card">
          <div className="stat-card-header">
            <span className="stat-card-title">Open Anomaly Flags</span>
            <div className="stat-card-icon amber"><AlertTriangle size={18} /></div>
          </div>
          <div className="stat-card-value">{stats?.open_count || 0}</div>
          <div className="stat-card-change positive">Requires official scrutiny</div>
        </div>

        <div className="stat-card">
          <div className="stat-card-header">
            <span className="stat-card-title">Critical Severity</span>
            <div className="stat-card-icon red"><ShieldAlert size={18} /></div>
          </div>
          <div className="stat-card-value">{stats?.critical_count || 0}</div>
          <div className="stat-card-change negative">Potential document fraud / duplicate hash</div>
        </div>

        <div className="stat-card">
          <div className="stat-card-header">
            <span className="stat-card-title">Under Investigation</span>
            <div className="stat-card-icon blue"><Clock size={18} /></div>
          </div>
          <div className="stat-card-value">{stats?.investigating_count || 0}</div>
          <div className="stat-card-change positive">Assigned to Vigilance / Scrutiny officer</div>
        </div>

        <div className="stat-card">
          <div className="stat-card-header">
            <span className="stat-card-title">Resolved / Cleared</span>
            <div className="stat-card-icon green"><CheckCircle size={18} /></div>
          </div>
          <div className="stat-card-value">{stats?.resolved_count || 0}</div>
          <div className="stat-card-change positive">Clarified or rectified by institution</div>
        </div>
      </div>

      {/* Advisory Banner */}
      <div className="card" style={{
        marginBottom: 'var(--spacing-lg)',
        borderLeft: '4px solid var(--accent-amber)',
        background: 'rgba(245, 158, 11, 0.05)',
        padding: 'var(--spacing-md)'
      }}>
        <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
          <AlertCircle size={20} style={{ color: 'var(--accent-amber)', flexShrink: 0, marginTop: 2 }} />
          <div>
            <strong style={{ color: 'var(--text-primary)', fontSize: '0.9rem' }}>
              Statutory Advisory & Non-Conclusive Pre-Screening Notice:
            </strong>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginTop: 4 }}>
              In accordance with AICTE Regulations and Ministry guidelines, automated forensic flags are preliminary indicators and decision-support aids only. They do not constitute a conclusive finding of forgery. All flags must be corroborated through competent authority inquiry and issuing body confirmation before any administrative action.
            </p>
          </div>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="filters-bar" style={{ marginBottom: 'var(--spacing-lg)' }}>
        <div style={{ display: 'flex', gap: 'var(--spacing-sm)', flexWrap: 'wrap', alignItems: 'center' }}>
          <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: 600 }}>Filter by:</span>

          <select
            className="filter-select"
            value={selectedSeverity}
            onChange={(e) => setSelectedSeverity(e.target.value)}
          >
            <option value="all">All Severities</option>
            <option value="critical">Critical</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>

          <select
            className="filter-select"
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
          >
            <option value="all">All Statuses</option>
            <option value="open">Open</option>
            <option value="investigating">Under Investigation</option>
            <option value="resolved">Resolved</option>
          </select>
        </div>

        <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
          Showing {anomalies.length} forensic flag{anomalies.length !== 1 ? 's' : ''}
        </div>
      </div>

      {/* Anomalies List Grid */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-md)' }}>
        {anomalies.map((anomaly) => {
          const isCritical = anomaly.severity === 'critical';
          const isHigh = anomaly.severity === 'high';
          const isResolved = anomaly.status === 'resolved';

          return (
            <div
              key={anomaly.id}
              className="card"
              style={{
                transition: 'all 0.2s ease',
                borderLeft: `4px solid ${
                  isCritical ? 'var(--accent-red)' : isHigh ? 'var(--accent-amber)' : 'var(--accent-blue)'
                }`,
                opacity: isResolved ? 0.75 : 1
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 12 }}>
                <div style={{ flex: 1, minWidth: 280 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6, flexWrap: 'wrap' }}>
                    <ProvenanceBadge tier={4} showDetails={true} />
                    <span className={`badge ${
                      isCritical ? 'badge-danger' : isHigh ? 'badge-warning' : 'badge-info'
                    }`}>
                      {anomaly.severity.toUpperCase()}
                    </span>
                    <span className="badge badge-neutral" style={{ textTransform: 'capitalize' }}>
                      {anomaly.type.replace('_', ' ')}
                    </span>
                    <span className={`badge ${
                      anomaly.status === 'open' ? 'badge-warning' : anomaly.status === 'investigating' ? 'badge-info' : 'badge-success'
                    }`}>
                      {anomaly.status === 'open' ? 'Needs Review' : anomaly.status === 'investigating' ? 'Under Review' : 'Resolved'}
                    </span>
                  </div>

                  <h3 style={{ fontSize: '1.05rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: 4 }}>
                    {anomaly.title}
                  </h3>

                  <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: 12 }}>
                    {anomaly.description}
                  </p>

                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16, fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                    <span>Institution: <strong style={{ color: 'var(--text-primary)' }}>{anomaly.institution_name || 'Apex Institute'}</strong></span>
                    <span>Document: <strong style={{ color: 'var(--text-primary)' }}>{anomaly.document_name || 'Supporting_Doc.pdf'}</strong></span>
                    <span>Application: <Link href={`/applications/${anomaly.application_id}`} style={{ color: 'var(--accent-blue)', textDecoration: 'underline' }}>{anomaly.application_id}</Link></span>
                    <span>Flagged: {new Date(anomaly.created_at).toLocaleDateString()}</span>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                  <button
                    className="btn btn-secondary btn-sm"
                    onClick={() => setActiveAnomaly(anomaly)}
                  >
                    <Eye size={14} /> Inspect Forensics
                  </button>
                  {anomaly.status !== 'resolved' && (
                    <button
                      className="btn btn-primary btn-sm"
                      onClick={() => handleUpdateStatus(anomaly.id, 'investigating')}
                      disabled={updating}
                    >
                      Assign Investigation
                    </button>
                  )}
                </div>
              </div>

              {/* Evidence Box */}
              {anomaly.evidence && (
                <div style={{
                  marginTop: 12,
                  padding: '10px 14px',
                  borderRadius: 'var(--border-radius-sm)',
                  background: '#f8fafc',
                  border: '1px solid #e2e8f0',
                  fontSize: '0.8rem',
                  color: 'var(--text-secondary)'
                }}>
                  <strong style={{ color: 'var(--accent-blue)' }}>Forensic Evidence Signature: </strong>
                  <code style={{ background: '#f1f5f9', padding: '2px 6px', borderRadius: 4, color: '#0f172a' }}>{anomaly.evidence}</code>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Forensic Inspection Modal */}
      {activeAnomaly && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(15, 23, 42, 0.5)',
          backdropFilter: 'blur(4px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 100,
          padding: 'var(--spacing-md)'
        }}>
          <div className="card" style={{ maxWidth: 720, width: '100%', maxHeight: '90vh', overflowY: 'auto', background: '#ffffff', boxShadow: 'var(--shadow-xl)' }}>
            <div className="card-header">
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                  <span className={`badge ${activeAnomaly.severity === 'critical' ? 'badge-danger' : 'badge-warning'}`}>
                    {activeAnomaly.severity.toUpperCase()}
                  </span>
                  <span className="badge badge-neutral">{activeAnomaly.id}</span>
                </div>
                <h3 className="card-title">{activeAnomaly.title}</h3>
                <p className="card-subtitle">Forensic Deep-Dive & Decision Support</p>
              </div>
              <button
                className="btn btn-secondary btn-sm"
                onClick={() => setActiveAnomaly(null)}
              >
                <X size={16} />
              </button>
            </div>

            {/* Forensic Detail Breakdown */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div style={{
                background: '#f8fafc',
                padding: 'var(--spacing-md)',
                borderRadius: 'var(--border-radius-md)',
                border: '1px solid #e2e8f0'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                  <h4 style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--accent-blue)', margin: 0 }}>
                    Anomaly Diagnostics & Evidentiary Classification
                  </h4>
                  <ProvenanceBadge tier={4} showDetails={true} />
                </div>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                  {activeAnomaly.description}
                </p>
                <div style={{ marginTop: 8, padding: 8, background: '#fffbeb', border: '1px solid #fde68a', borderRadius: 4, fontSize: '0.75rem', color: '#92400e' }}>
                  <strong>Evidentiary Standard:</strong> Tier 4 Forensic Heuristic is an investigative lead, NOT legal proof of malfeasance. Officials must issue a query or confirm via issuing authority (Tier 2) before initiating de-recognition.
                </div>
                <div style={{ marginTop: 8, padding: 8, background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: 4, fontFamily: 'monospace', fontSize: '0.78rem', color: '#0f172a' }}>
                  {activeAnomaly.evidence}
                </div>
              </div>

              {/* Side by side comparison visualization */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: 12,
                background: '#f8fafc',
                padding: 'var(--spacing-md)',
                borderRadius: 'var(--border-radius-md)',
                border: '1px solid #e2e8f0'
              }}>
                <div>
                  <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: 6 }}>
                    SUBMITTED DOCUMENT SCAN
                  </div>
                  <div style={{
                    height: 140,
                    borderRadius: 6,
                    background: '#ffffff',
                    border: '1px dashed #fca5a5',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: 12,
                    textAlign: 'center'
                  }}>
                    <FileText size={24} style={{ color: 'var(--accent-red)', marginBottom: 6 }} />
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-primary)', fontWeight: 600 }}>
                      {activeAnomaly.document_name || 'Suspect_Document.pdf'}
                    </span>
                    <span style={{ fontSize: '0.7rem', color: 'var(--accent-red)', marginTop: 4 }}>
                      ⚠ Inconsistent font encoding (TimesNewRoman spliced into Arial)
                    </span>
                  </div>
                </div>

                <div>
                  <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: 6 }}>
                    AUTHORITY REPOSITORY RECORD
                  </div>
                  <div style={{
                    height: 140,
                    borderRadius: 6,
                    background: '#ffffff',
                    border: '1px dashed #86efac',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: 12,
                    textAlign: 'center'
                  }}>
                    <Shield size={24} style={{ color: 'var(--accent-green)', marginBottom: 6 }} />
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-primary)', fontWeight: 600 }}>
                      DigiLocker / Issuing Authority Canonical
                    </span>
                    <span style={{ fontSize: '0.7rem', color: 'var(--accent-green)', marginTop: 4 }}>
                      ✓ Original verified certificate record on state server
                    </span>
                  </div>
                </div>
              </div>

              {/* Reviewer Note Input */}
              <div>
                <label style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: 6 }}>
                  Scrutiny Officer Remarks / Action Note:
                </label>
                <textarea
                  className="filter-select"
                  style={{ width: '100%', height: 70, padding: 10, resize: 'none' }}
                  placeholder="Enter remarks, institutional justification, or findings for the audit log..."
                  value={reviewNote}
                  onChange={(e) => setReviewNote(e.target.value)}
                />
              </div>

              {/* Action Buttons */}
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 8 }}>
                <button
                  className="btn btn-secondary"
                  onClick={() => handleUpdateStatus(activeAnomaly.id, 'resolved')}
                  disabled={updating}
                >
                  <Check size={16} /> Resolve as False Positive / Clarified
                </button>
                <button
                  className="btn btn-danger"
                  onClick={() => handleUpdateStatus(activeAnomaly.id, 'investigating')}
                  disabled={updating}
                >
                  <ShieldAlert size={16} /> Escalate to AICTE Vigilance Cell
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
