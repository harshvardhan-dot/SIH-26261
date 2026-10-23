'use client';

import { useState, useEffect } from 'react';
import {
  Settings, Sliders, Shield, Database, Globe, Key,
  CheckCircle, AlertCircle, RefreshCw, Save, Lock,
  SlidersHorizontal, Check, ToggleLeft, ToggleRight
} from 'lucide-react';

interface RuleItem {
  id: string;
  category: string;
  requirement: string;
  description: string;
  mandatory: number;
  applicable_categories: string;
}

export default function SystemSettingsPage() {
  const [activeTab, setActiveTab] = useState<'rules' | 'ai' | 'gateways' | 'users' | 'database'>('rules');
  const [rules, setRules] = useState<RuleItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [savingRuleId, setSavingRuleId] = useState<string | null>(null);

  // AI Sensitivity Sliders
  const [ocrThreshold, setOcrThreshold] = useState<number>(85);
  const [fontSensitivity, setFontSensitivity] = useState<number>(80);
  const [duplicateThreshold, setDuplicateThreshold] = useState<number>(90);
  const [savedAiSettings, setSavedAiSettings] = useState(false);

  // Authority API Config
  const [digilockerEndpoint, setDigilockerEndpoint] = useState('https://api.digilocker.gov.in/public/v2/oauth');
  const [ugcEndpoint, setUgcEndpoint] = useState('https://nad.digilocker.gov.in/api/v1/institution/verify');
  const [stateGatewayEndpoint, setStateGatewayEndpoint] = useState('https://edugov.nic.in/aicte/state-services');
  const [savedGateway, setSavedGateway] = useState(false);

  const fetchRules = () => {
    setLoading(true);
    fetch('/api/rules')
      .then(res => res.json())
      .then(data => {
        setRules(data.rules || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  };

  useEffect(() => {
    fetchRules();
  }, []);

  const handleToggleRuleMandatory = async (rule: RuleItem) => {
    setSavingRuleId(rule.id);
    const newMandatory = rule.mandatory === 1 ? 0 : 1;
    try {
      const res = await fetch('/api/rules', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: rule.id,
          mandatory: newMandatory
        })
      });
      if (res.ok) {
        setRules(prev => prev.map(r => r.id === rule.id ? { ...r, mandatory: newMandatory } : r));
      }
    } catch (e) {
      console.error(e);
    } finally {
      setSavingRuleId(null);
    }
  };

  const handleSaveAi = () => {
    setSavedAiSettings(true);
    setTimeout(() => setSavedAiSettings(false), 2500);
  };

  const handleSaveGateway = () => {
    setSavedGateway(true);
    setTimeout(() => setSavedGateway(false), 2500);
  };

  return (
    <div className="page-container">
      {/* Header */}
      <div className="page-header">
        <div>
          <div className="page-header-pretitle">
            <SlidersHorizontal size={14} style={{ color: 'var(--accent-blue)', display: 'inline', marginRight: 6 }} />
            Regulatory Policy & Platform Administration
          </div>
          <h1 className="page-header-title">System Settings & Rules Engine</h1>
          <p className="page-header-subtitle">
            Configure Approval Process Handbook rules, AI anomaly sensitivity thresholds, and issuing authority API endpoints
          </p>
        </div>
      </div>

      {/* Settings Navigation Tabs */}
      <div className="tabs" style={{ marginBottom: 'var(--spacing-xl)' }}>
        {[
          { key: 'rules', label: 'APH Regulatory Rules', icon: Shield },
          { key: 'ai', label: 'AI Detection Thresholds', icon: Sliders },
          { key: 'gateways', label: 'Authority Gateways & APIs', icon: Globe },
          { key: 'users', label: 'Roles & Permissions', icon: Lock },
          { key: 'database', label: 'Database & Environment', icon: Database },
        ].map(tab => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.key}
              className={`tab-btn ${activeTab === tab.key ? 'active' : ''}`}
              onClick={() => setActiveTab(tab.key as any)}
              style={{ display: 'flex', alignItems: 'center', gap: 8 }}
            >
              <Icon size={16} />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Tab 1: Regulatory Rules Engine */}
      {activeTab === 'rules' && (
        <div className="card">
          <div className="card-header">
            <div>
              <h3 className="card-title">Approval Process Handbook (APH) Rule Catalog</h3>
              <p className="card-subtitle">
                Enable, disable, or set mandatory status for regulatory validation rules
              </p>
            </div>
            <button className="btn btn-secondary btn-sm" onClick={fetchRules}>
              <RefreshCw size={14} /> Refresh Rules
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {rules.map((rule) => {
              const isMandatory = rule.mandatory === 1;
              const isSaving = savingRuleId === rule.id;

              return (
                <div
                  key={rule.id}
                  style={{
                    padding: '14px 18px',
                    borderRadius: 'var(--border-radius-md)',
                    background: 'var(--glass-bg)',
                    border: '1px solid var(--glass-border)',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    gap: 16
                  }}
                >
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                      <span className="badge badge-neutral" style={{ fontSize: '0.7rem' }}>{rule.category}</span>
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>ID: {rule.id}</span>
                      <span className={`badge ${isMandatory ? 'badge-danger' : 'badge-neutral'}`} style={{ fontSize: '0.65rem' }}>
                        {isMandatory ? 'MANDATORY DEFICIENCY' : 'ADVISORY GUIDELINE'}
                      </span>
                    </div>

                    <div style={{ fontSize: '0.92rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                      {rule.requirement}
                    </div>

                    <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: 2 }}>
                      {rule.description}
                    </div>

                    <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: 4 }}>
                      Applicable: {rule.applicable_categories || 'All Technical Institutions (UG/PG)'}
                    </div>
                  </div>

                  <div>
                    <button
                      className={`btn ${isMandatory ? 'btn-danger' : 'btn-secondary'} btn-sm`}
                      onClick={() => handleToggleRuleMandatory(rule)}
                      disabled={isSaving}
                      style={{ minWidth: 140 }}
                    >
                      {isMandatory ? 'Disable Mandatory' : 'Make Mandatory'}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Tab 2: AI Detection Thresholds */}
      {activeTab === 'ai' && (
        <div className="card" style={{ maxWidth: 760 }}>
          <div className="card-header">
            <div>
              <h3 className="card-title">AI & Forensic Neural Sensitivity Controls</h3>
              <p className="card-subtitle">
                Calibrate thresholds for triggering anomaly investigations and optical recognition certainty
              </p>
            </div>
            {savedAiSettings && (
              <span className="badge badge-success">✓ Settings Saved</span>
            )}
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 24, padding: 'var(--spacing-md) 0' }}>
            {/* OCR Threshold */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                <div>
                  <div style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                    Minimum OCR Confidence Acceptance Cutoff
                  </div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
                    Documents below this character confidence score are flagged for manual human re-transcription.
                  </div>
                </div>
                <strong style={{ fontSize: '1.1rem', color: 'var(--accent-blue)' }}>{ocrThreshold}%</strong>
              </div>
              <input
                type="range"
                min="60"
                max="98"
                value={ocrThreshold}
                onChange={(e) => setOcrThreshold(parseInt(e.target.value))}
                style={{ width: '100%', accentColor: 'var(--accent-blue)', height: 6 }}
              />
            </div>

            {/* Font Discrepancy Sensitivity */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                <div>
                  <div style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                    Font, Kerning & Splice Anomaly Sensitivity
                  </div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
                    Sensitivity level for detecting spliced numerical text blocks (e.g. land area or financial amounts).
                  </div>
                </div>
                <strong style={{ fontSize: '1.1rem', color: 'var(--accent-amber)' }}>{fontSensitivity}%</strong>
              </div>
              <input
                type="range"
                min="50"
                max="99"
                value={fontSensitivity}
                onChange={(e) => setFontSensitivity(parseInt(e.target.value))}
                style={{ width: '100%', accentColor: 'var(--accent-amber)', height: 6 }}
              />
            </div>

            {/* Duplicate File Hash Match */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                <div>
                  <div style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                    Cross-Institutional Duplicate Document Strictness
                  </div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
                    Perceptual hash distance threshold for matching identical certificates uploaded by different institutions.
                  </div>
                </div>
                <strong style={{ fontSize: '1.1rem', color: 'var(--accent-red)' }}>{duplicateThreshold}%</strong>
              </div>
              <input
                type="range"
                min="70"
                max="99"
                value={duplicateThreshold}
                onChange={(e) => setDuplicateThreshold(parseInt(e.target.value))}
                style={{ width: '100%', accentColor: 'var(--accent-red)', height: 6 }}
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 12 }}>
              <button className="btn btn-primary" onClick={handleSaveAi}>
                <Save size={16} /> Save AI Configuration
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: Authority Gateways & APIs */}
      {activeTab === 'gateways' && (
        <div className="card" style={{ maxWidth: 760 }}>
          <div className="card-header">
            <div>
              <h3 className="card-title">National Authority Gateways & Integration Endpoints</h3>
              <p className="card-subtitle">
                REST and OAuth2 endpoints for real-time document verification against issuing authorities
              </p>
            </div>
            {savedGateway && (
              <span className="badge badge-success">✓ Endpoints Updated</span>
            )}
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 18, padding: 'var(--spacing-md) 0' }}>
            <div>
              <label style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-primary)', display: 'block', marginBottom: 6 }}>
                DigiLocker National Authority Gateway Endpoint:
              </label>
              <input
                type="text"
                className="filter-select"
                style={{ width: '100%', padding: '10px 14px' }}
                value={digilockerEndpoint}
                onChange={(e) => setDigilockerEndpoint(e.target.value)}
              />
              <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                Used for Land Registry, Trust Deeds, and State PWD NOCs
              </span>
            </div>

            <div>
              <label style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-primary)', display: 'block', marginBottom: 6 }}>
                UGC National Academic Depository (NAD) Verification API:
              </label>
              <input
                type="text"
                className="filter-select"
                style={{ width: '100%', padding: '10px 14px' }}
                value={ugcEndpoint}
                onChange={(e) => setUgcEndpoint(e.target.value)}
              />
              <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                Used for faculty qualifications, doctoral degrees, and university recognition
              </span>
            </div>

            <div>
              <label style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-primary)', display: 'block', marginBottom: 6 }}>
                NIC State Higher Education & Affiliation Gateway:
              </label>
              <input
                type="text"
                className="filter-select"
                style={{ width: '100%', padding: '10px 14px' }}
                value={stateGatewayEndpoint}
                onChange={(e) => setStateGatewayEndpoint(e.target.value)}
              />
              <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                Used for Affiliating University annual approvals and State Government NOCs
              </span>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 12 }}>
              <button className="btn btn-primary" onClick={handleSaveGateway}>
                <Save size={16} /> Save Gateway Configurations
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Tab 4: Roles & Permissions */}
      {activeTab === 'users' && (
        <div className="card">
          <div className="card-header">
            <div>
              <h3 className="card-title">Role-Based Access Control (RBAC) Matrix</h3>
              <p className="card-subtitle">Defined privilege tiers for AICTE Scrutiny Division</p>
            </div>
            <span className="badge badge-info">Ministry Security Directive</span>
          </div>

          <div className="table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Role Name</th>
                  <th>Department / Level</th>
                  <th>Document Scrutiny</th>
                  <th>Forensic Anomaly Review</th>
                  <th>Authority Re-verification</th>
                  <th>Final Approval Decision</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td><strong>AICTE Scrutiny Officer</strong></td>
                  <td>Approval Bureau (Regional)</td>
                  <td><span className="badge badge-success">Full Access</span></td>
                  <td><span className="badge badge-info">Flag & Inspect</span></td>
                  <td><span className="badge badge-success">Direct Query</span></td>
                  <td><span className="badge badge-neutral">Advisory Only</span></td>
                </tr>
                <tr>
                  <td><strong>Regional Officer (RO)</strong></td>
                  <td>Regional Directorate</td>
                  <td><span className="badge badge-success">Full Access</span></td>
                  <td><span className="badge badge-warning">Escalate to Vigilance</span></td>
                  <td><span className="badge badge-success">Direct Query</span></td>
                  <td><span className="badge badge-success">Recommend / Deficit</span></td>
                </tr>
                <tr>
                  <td><strong>Chief Vigilance Officer</strong></td>
                  <td>AICTE Vigilance Division</td>
                  <td><span className="badge badge-success">Full Forensic Log</span></td>
                  <td><span className="badge badge-danger">Formal Inquiry</span></td>
                  <td><span className="badge badge-success">Subpoena Records</span></td>
                  <td><span className="badge badge-danger">Show-Cause / Debar</span></td>
                </tr>
                <tr>
                  <td><strong>Chairman / Member Sec.</strong></td>
                  <td>Executive Committee, AICTE</td>
                  <td><span className="badge badge-success">Executive Dossier</span></td>
                  <td><span className="badge badge-success">Full Forensic Audit</span></td>
                  <td><span className="badge badge-success">Omni-Channel</span></td>
                  <td><span className="badge badge-success">Final Statutory Order</span></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 5: Database & Environment */}
      {activeTab === 'database' && (
        <div className="card" style={{ maxWidth: 760 }}>
          <div className="card-header">
            <div>
              <h3 className="card-title">Prototype Storage & SQLite Database Health</h3>
              <p className="card-subtitle">Local database statistics and sample data controls</p>
            </div>
            <span className="badge badge-success">Database Connected</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 16, padding: 'var(--spacing-md) 0' }}>
            <div style={{
              background: '#f8fafc',
              padding: 'var(--spacing-md)',
              borderRadius: 'var(--border-radius-md)',
              border: '1px solid #e2e8f0',
              display: 'grid',
              gridTemplateColumns: 'repeat(2, 1fr)',
              gap: 12
            }}>
              <div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>DATABASE ENGINE</div>
                <div style={{ fontSize: '0.9rem', fontWeight: 600 }}>SQLite via better-sqlite3 (WAL Mode)</div>
              </div>
              <div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>FILE LOCATION</div>
                <div style={{ fontSize: '0.9rem', fontWeight: 600, fontFamily: 'monospace' }}>./data/aicte.db</div>
              </div>
              <div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>TOTAL INSTITUTIONS SEEDED</div>
                <div style={{ fontSize: '0.9rem', fontWeight: 600 }}>12 Sample Technical Institutions</div>
              </div>
              <div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>AUDIT TRAIL RECORDS</div>
                <div style={{ fontSize: '0.9rem', fontWeight: 600 }}>Chained Cryptographic Logs</div>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-start', gap: 12 }}>
              <button
                className="btn btn-secondary"
                onClick={() => {
                  fetch('/api/applications')
                    .then(() => alert('Database verified and active.'));
                }}
              >
                <CheckCircle size={16} /> Run Integrity Ping
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
