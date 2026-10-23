'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  ShieldAlert, AlertTriangle, FileText, Building2, MapPin,
  CheckCircle, ArrowRight, Eye, RefreshCw, Download, ExternalLink,
  Users, Map, Layers, Check, X, Scale
} from 'lucide-react';
import ProvenanceBadge from '@/components/ProvenanceBadge';

interface CollusionFlag {
  id: string;
  type: 'land_overlap' | 'duplicate_cert' | 'ghost_faculty';
  severity: 'critical' | 'high';
  tier: 1 | 2 | 3 | 4;
  title: string;
  instituteA: {
    name: string;
    code: string;
    state: string;
    appId: string;
    docName: string;
  };
  instituteB: {
    name: string;
    code: string;
    state: string;
    appId: string;
    docName: string;
  };
  sharedEvidence: string;
  confidence: number;
  status: 'active' | 'investigating' | 'resolved';
}

const mockCollusionFlags: CollusionFlag[] = [
  {
    id: 'COL-001',
    type: 'land_overlap',
    severity: 'critical',
    tier: 3,
    title: 'Identical Land Survey Parcel Submitted Across 2 Distinct Institutions',
    instituteA: {
      name: 'Apex Institute of Technology',
      code: '1-102938475',
      state: 'Uttar Pradesh (G. Noida)',
      appId: 'app_001',
      docName: 'Land_Title_Deed_Khasra.pdf'
    },
    instituteB: {
      name: 'Shri Balaji College of Engineering',
      code: '1-847291039',
      state: 'Uttar Pradesh (Meerut)',
      appId: 'app_003',
      docName: 'Possession_Title_Deed_2022.pdf'
    },
    sharedEvidence: 'Survey Plot Khasra #142/A (7.85 Acres) declared identically by both institutes under overlapping Trust deeds with identical registration number Reg/2018/7741.',
    confidence: 99.4,
    status: 'active'
  },
  {
    id: 'COL-002',
    type: 'duplicate_cert',
    severity: 'critical',
    tier: 4,
    title: 'Duplicate Building Stability & Occupancy Certificate Hash',
    instituteA: {
      name: 'National College of Pharmacy',
      code: '1-492019482',
      state: 'Haryana (Faridabad)',
      appId: 'app_005',
      docName: 'Building_Safety_NOC_2024.pdf'
    },
    instituteB: {
      name: 'Saraswati Institute of Polytechnic',
      code: '1-692810394',
      state: 'Haryana (Palwal)',
      appId: 'app_008',
      docName: 'Safety_Occupancy_Cert_PWD.pdf'
    },
    sharedEvidence: 'Perceptual document image hash (pHash: a7f8c9b2) and PWD Engineer signature token identical with only institution header modified.',
    confidence: 98.7,
    status: 'investigating'
  },
  {
    id: 'COL-003',
    type: 'ghost_faculty',
    severity: 'high',
    tier: 2,
    title: 'Ghost Faculty: Same Professor Listed as Full-Time on 2 Institutes',
    instituteA: {
      name: 'Modern Management Institute',
      code: '1-592019483',
      state: 'Delhi NCR',
      appId: 'app_002',
      docName: 'Faculty_Roster_Form16.pdf'
    },
    instituteB: {
      name: 'Capital Institute of Business',
      code: '1-748291048',
      state: 'Delhi NCR',
      appId: 'app_009',
      docName: 'FullTime_Faculty_List.pdf'
    },
    sharedEvidence: 'Dr. Alok Verma (PAN: ABCPV1234D) declared as Full-Time Regular Professor in Computer Science at both institutions simultaneously for AY 2026-27.',
    confidence: 100.0,
    status: 'active'
  }
];

export default function CollusionRadarPage() {
  const [flags, setFlags] = useState<CollusionFlag[]>(mockCollusionFlags);
  const [activeInspector, setActiveInspector] = useState<CollusionFlag | null>(null);
  const [filterType, setFilterType] = useState('all');

  const filteredFlags = flags.filter(f => {
    if (filterType === 'all') return true;
    return f.type === filterType;
  });

  const handleUpdateStatus = (id: string, newStatus: 'investigating' | 'resolved') => {
    setFlags(prev => prev.map(f => f.id === id ? { ...f, status: newStatus } : f));
    setActiveInspector(null);
  };

  return (
    <div className="page-container">
      {/* Header */}
      <div className="page-header">
        <div>
          <div className="page-header-pretitle" style={{ color: '#b91c1c' }}>
            <ShieldAlert size={14} style={{ display: 'inline', marginRight: 6 }} />
            ★ Hackathon USP: Cross-Institutional Collusion & Land Duplication Radar
          </div>
          <h1 className="page-header-title">Cross-Institute Collusion Radar</h1>
          <p className="page-header-subtitle">
            Federated spatial and cryptographic detection: flags shared land parcels, duplicated building certificates, and multi-college ghost faculty
          </p>
        </div>
        <div style={{ display: 'flex', gap: 'var(--spacing-sm)' }}>
          <button className="btn btn-secondary" onClick={() => window.print()}>
            <Download size={15} /> Export Vigilance Dossier
          </button>
        </div>
      </div>

      {/* USP Context Explainer Card */}
      <div className="card" style={{
        marginBottom: 24,
        background: '#ffffff',
        borderLeft: '4px solid #b91c1c',
        boxShadow: 'var(--shadow-sm)'
      }}>
        <div style={{ display: 'flex', gap: 14, alignItems: 'flex-start' }}>
          <ShieldAlert size={24} style={{ color: '#b91c1c', flexShrink: 0, marginTop: 2 }} />
          <div>
            <div style={{ fontSize: '0.9rem', fontWeight: 700, color: '#0f172a' }}>
              Why This Revolutionary Feature Wins Over Siloed Scrutiny Systems:
            </div>
            <p style={{ fontSize: '0.8rem', color: '#475569', marginTop: 4, lineHeight: 1.55 }}>
              Standard AICTE scrutiny evaluates applications one college at a time in isolation. Collusion rings exploit this by submitting the <em>same 5-acre land title</em> or <em>the same PWD building stability certificate</em> to separate regional committees under different trust names. Our Collusion Radar performs federated cross-entity hash and cadastral matching to intercept multi-institutional collusion before approval is granted.
            </p>
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="filters-bar" style={{ marginBottom: 20 }}>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <span style={{ fontSize: '0.82rem', fontWeight: 600, color: '#64748b' }}>Filter Collusion Type:</span>
          {(['all', 'land_overlap', 'duplicate_cert', 'ghost_faculty'] as const).map(typeKey => (
            <button
              key={typeKey}
              className={`btn btn-sm ${filterType === typeKey ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => setFilterType(typeKey)}
            >
              {typeKey === 'all' ? 'All Collusion Types' :
               typeKey === 'land_overlap' ? 'Land Parcel Overlap' :
               typeKey === 'duplicate_cert' ? 'Duplicate Certificate Hash' : 'Ghost Faculty Overlap'}
            </button>
          ))}
        </div>
        <div style={{ fontSize: '0.8rem', color: '#64748b' }}>
          Showing {filteredFlags.length} multi-institutional collision{filteredFlags.length !== 1 ? 's' : ''}
        </div>
      </div>

      {/* Collusion Cards List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
        {filteredFlags.map((flag) => {
          const isCritical = flag.severity === 'critical';
          const isActive = flag.status === 'active';

          return (
            <div
              key={flag.id}
              className="card"
              style={{
                borderLeft: `4px solid ${isCritical ? '#b91c1c' : '#b45309'}`,
                background: '#ffffff'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 12, marginBottom: 12 }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                    <span className={`badge ${isCritical ? 'badge-danger' : 'badge-warning'}`}>
                      {flag.severity.toUpperCase()} COLLUSION
                    </span>
                    <span className="badge badge-neutral" style={{ textTransform: 'capitalize' }}>
                      {flag.type.replace('_', ' ')}
                    </span>
                    <span className={`badge ${isActive ? 'badge-warning' : 'badge-info'}`}>
                      {isActive ? 'Active Collusion Alert' : 'Inquiry Underway'}
                    </span>
                    <ProvenanceBadge tier={flag.tier} showDetails={true} />
                  </div>

                  <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#0f172a', marginBottom: 6 }}>
                    [{flag.id}] {flag.title}
                  </h3>
                </div>

                <div style={{ display: 'flex', gap: 8 }}>
                  <button
                    className="btn btn-secondary btn-sm"
                    onClick={() => setActiveInspector(flag)}
                  >
                    <Eye size={14} /> Side-by-Side Comparative Audit
                  </button>
                  {flag.status !== 'investigating' && (
                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() => handleUpdateStatus(flag.id, 'investigating')}
                    >
                      Refer to AICTE Vigilance
                    </button>
                  )}
                </div>
              </div>

              {/* Institutions Comparison Grid */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: 14,
                marginBottom: 12
              }}>
                <div style={{
                  background: '#f8fafc',
                  border: '1px solid #e2e8f0',
                  borderRadius: 6,
                  padding: '12px 14px'
                }}>
                  <div style={{ fontSize: '0.72rem', fontWeight: 700, color: '#1e40af', textTransform: 'uppercase' }}>
                    COLLUDING INSTITUTION A
                  </div>
                  <div style={{ fontSize: '0.9rem', fontWeight: 700, color: '#0f172a', marginTop: 2 }}>
                    {flag.instituteA.name}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: 2 }}>
                    PID: {flag.instituteA.code} • {flag.instituteA.state}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: '#0f2942', marginTop: 4, fontFamily: 'monospace' }}>
                    Doc: {flag.instituteA.docName}
                  </div>
                </div>

                <div style={{
                  background: '#f8fafc',
                  border: '1px solid #e2e8f0',
                  borderRadius: 6,
                  padding: '12px 14px'
                }}>
                  <div style={{ fontSize: '0.72rem', fontWeight: 700, color: '#b91c1c', textTransform: 'uppercase' }}>
                    COLLUDING INSTITUTION B
                  </div>
                  <div style={{ fontSize: '0.9rem', fontWeight: 700, color: '#0f172a', marginTop: 2 }}>
                    {flag.instituteB.name}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: 2 }}>
                    PID: {flag.instituteB.code} • {flag.instituteB.state}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: '#0f2942', marginTop: 4, fontFamily: 'monospace' }}>
                    Doc: {flag.instituteB.docName}
                  </div>
                </div>
              </div>

              {/* Shared Evidence Signature */}
              <div style={{
                background: '#fef2f2',
                border: '1px solid #fecaca',
                padding: '10px 14px',
                borderRadius: 6,
                fontSize: '0.78rem',
                color: '#7f1d1d'
              }}>
                <strong>Common Collusion Signature: </strong>
                {flag.sharedEvidence}
              </div>
            </div>
          );
        })}
      </div>

      {/* Comparative Modal */}
      {activeInspector && (
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
          <div className="card" style={{ maxWidth: 840, width: '100%', maxHeight: '90vh', overflowY: 'auto', background: '#ffffff', boxShadow: 'var(--shadow-xl)' }}>
            <div className="card-header">
              <div>
                <h3 className="card-title">Side-by-Side Cross-Institutional Collision Audit</h3>
                <p className="card-subtitle">AI-assisted comparative verification of duplicate declared assets</p>
              </div>
              <button className="btn btn-secondary btn-sm" onClick={() => setActiveInspector(null)}>
                <X size={16} />
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                <div style={{ background: '#f8fafc', padding: 16, borderRadius: 6, border: '1px solid #e2e8f0' }}>
                  <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#1e40af' }}>SUBMISSION 1: {activeInspector.instituteA.name}</div>
                  <div style={{ marginTop: 8, fontSize: '0.8rem', color: '#334155' }}>
                    <div><strong>PID:</strong> {activeInspector.instituteA.code}</div>
                    <div><strong>Location:</strong> {activeInspector.instituteA.state}</div>
                    <div><strong>Submitted File:</strong> {activeInspector.instituteA.docName}</div>
                  </div>
                </div>

                <div style={{ background: '#f8fafc', padding: 16, borderRadius: 6, border: '1px solid #e2e8f0' }}>
                  <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#b91c1c' }}>SUBMISSION 2: {activeInspector.instituteB.name}</div>
                  <div style={{ marginTop: 8, fontSize: '0.8rem', color: '#334155' }}>
                    <div><strong>PID:</strong> {activeInspector.instituteB.code}</div>
                    <div><strong>Location:</strong> {activeInspector.instituteB.state}</div>
                    <div><strong>Submitted File:</strong> {activeInspector.instituteB.docName}</div>
                  </div>
                </div>
              </div>

              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '10px 14px',
                background: '#f8fafc',
                border: '1px solid #e2e8f0',
                borderRadius: 6
              }}>
                <span style={{ fontSize: '0.82rem', fontWeight: 600, color: '#334155' }}>
                  Statutory Proof Classification:
                </span>
                <ProvenanceBadge tier={activeInspector.tier} showDetails={true} />
              </div>

              <div style={{ background: '#fffbeb', border: '1px solid #fde68a', padding: 14, borderRadius: 6, fontSize: '0.8rem', color: '#92400e' }}>
                <strong>Vigilance Advisory:</strong> Under AICTE Approval Process Handbook regulations, fraudulent duplication of campus land or faculty constitutes grounds for immediate withdrawal of approval and institutional debarment. Tier 1–3 findings carry statutory weight for show-cause issuance; Tier 4 heuristic flags warrant physical committee inspection before penal action.
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10 }}>
                <button
                  className="btn btn-secondary"
                  onClick={() => handleUpdateStatus(activeInspector.id, 'resolved')}
                >
                  <Check size={15} /> Clear as Distinct Legitimate Asset
                </button>
                <button
                  className="btn btn-danger"
                  onClick={() => handleUpdateStatus(activeInspector.id, 'investigating')}
                >
                  <ShieldAlert size={15} /> Issue Statutory Show-Cause Notice
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
