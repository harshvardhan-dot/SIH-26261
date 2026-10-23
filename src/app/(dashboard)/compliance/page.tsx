'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  ClipboardList, CheckCircle, XCircle, AlertTriangle, Calculator,
  FileText, Download, Printer, Filter, Search, RefreshCw,
  Building2, Users, BookOpen, Monitor, ShieldCheck, ChevronRight
} from 'lucide-react';

interface ComplianceCheck {
  id: string;
  application_id: string;
  category: string;
  requirement: string;
  description: string;
  status: 'compliant' | 'non_compliant' | 'partially_compliant' | 'pending' | 'not_applicable';
  evidence: string;
  notes: string;
  severity: string;
  checked_at: string;
  institution_name?: string;
  app_category?: string;
}

interface ComplianceStats {
  total: number;
  compliant_count: number;
  non_compliant_count: number;
  partial_count: number;
  pending_count: number;
  na_count: number;
}

interface CategoryBreakdown {
  category: string;
  total: number;
  compliant: number;
  non_compliant: number;
  partial: number;
  pending: number;
}

export default function RegulatoryCompliancePage() {
  const [checks, setChecks] = useState<ComplianceCheck[]>([]);
  const [stats, setStats] = useState<ComplianceStats | null>(null);
  const [categories, setCategories] = useState<CategoryBreakdown[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');

  // Calculator State
  const [calcIntake, setCalcIntake] = useState<number>(720);
  const [calcFaculty, setCalcFaculty] = useState<number>(38);
  const [calcCadreProf, setCalcCadreProf] = useState<number>(3);
  const [calcCadreAssoc, setCalcCadreAssoc] = useState<number>(7);
  const [calcCadreAsst, setCalcCadreAsst] = useState<number>(28);
  const [calcRatioNorm, setCalcRatioNorm] = useState<'1:15' | '1:20'>('1:20');

  const fetchCompliance = () => {
    setLoading(true);
    fetch('/api/compliance')
      .then(res => res.json())
      .then(data => {
        setChecks(data.checks || []);
        if (data.stats) setStats(data.stats);
        if (data.byCategory) setCategories(data.byCategory);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  };

  useEffect(() => {
    fetchCompliance();
  }, []);

  // FSR Calculator Logic
  const ratioFactor = calcRatioNorm === '1:15' ? 15 : 20;
  const requiredFaculty = Math.ceil(calcIntake / ratioFactor);
  const facultyShortfall = Math.max(0, requiredFaculty - calcFaculty);
  const isFacultyCompliant = calcFaculty >= requiredFaculty;

  // Cadre requirement (1 : 2 : 6 for Engineering UG)
  const totalCadreUnits = 1 + 2 + 6; // 9
  const requiredProf = Math.ceil((requiredFaculty / totalCadreUnits) * 1);
  const requiredAssoc = Math.ceil((requiredFaculty / totalCadreUnits) * 2);
  const requiredAsst = Math.max(0, requiredFaculty - requiredProf - requiredAssoc);

  const filteredChecks = checks.filter(c => {
    if (selectedCategory !== 'all' && c.category !== selectedCategory) return false;
    if (selectedStatus !== 'all' && c.status !== selectedStatus) return false;
    return true;
  });

  return (
    <div className="page-container">
      {/* Header */}
      <div className="page-header">
        <div>
          <div className="page-header-pretitle">
            <ClipboardList size={14} style={{ color: 'var(--accent-purple)', display: 'inline', marginRight: 6 }} />
            Approval Process Handbook (APH 2024-27) Rules Engine
          </div>
          <h1 className="page-header-title">Regulatory Compliance & Norms</h1>
          <p className="page-header-subtitle">
            Automated scrutiny against statutory AICTE norms for faculty ratios, infrastructure, land title, and mandatory bodies
          </p>
        </div>
        <div style={{ display: 'flex', gap: 'var(--spacing-sm)' }}>
          <button
            className="btn btn-secondary"
            onClick={() => window.print()}
          >
            <Printer size={16} /> Print Scrutiny Sheet
          </button>
          <button
            className="btn btn-primary"
            onClick={fetchCompliance}
          >
            <RefreshCw size={16} /> Re-evaluate Norms
          </button>
        </div>
      </div>

      {/* Top Stats */}
      <div className="stats-grid" style={{ marginBottom: 'var(--spacing-lg)' }}>
        <div className="stat-card">
          <div className="stat-card-header">
            <span className="stat-card-title">Compliance Pass Rate</span>
            <div className="stat-card-icon green"><CheckCircle size={18} /></div>
          </div>
          <div className="stat-card-value">
            {stats ? Math.round((stats.compliant_count / (stats.total || 1)) * 100) : 82}%
          </div>
          <div className="stat-card-change positive">Meeting mandatory APH regulations</div>
        </div>

        <div className="stat-card">
          <div className="stat-card-header">
            <span className="stat-card-title">Deficiencies / Non-Compliant</span>
            <div className="stat-card-icon red"><XCircle size={18} /></div>
          </div>
          <div className="stat-card-value">{stats?.non_compliant_count || 0}</div>
          <div className="stat-card-change negative">Critical norms violated</div>
        </div>

        <div className="stat-card">
          <div className="stat-card-header">
            <span className="stat-card-title">Partially Compliant</span>
            <div className="stat-card-icon amber"><AlertTriangle size={18} /></div>
          </div>
          <div className="stat-card-value">{stats?.partial_count || 0}</div>
          <div className="stat-card-change positive">Minor deficiencies under rectification</div>
        </div>

        <div className="stat-card">
          <div className="stat-card-header">
            <span className="stat-card-title">Total Rules Evaluated</span>
            <div className="stat-card-icon blue"><ClipboardList size={18} /></div>
          </div>
          <div className="stat-card-value">{stats?.total || 0}</div>
          <div className="stat-card-change positive">Across 6 regulatory categories</div>
        </div>
      </div>

      {/* Interactive AICTE Live FSR & Deficit Calculator */}
      <div className="card" style={{
        marginBottom: 'var(--spacing-xl)',
        background: '#ffffff',
        border: '1px solid #e2e8f0',
        boxShadow: 'var(--shadow-sm)'
      }}>
        <div className="card-header">
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
              <Calculator size={18} style={{ color: 'var(--accent-blue)' }} />
              <h3 className="card-title">Interactive AICTE Faculty-Student Ratio (FSR) & Cadre Calculator</h3>
            </div>
            <p className="card-subtitle">
              Calculates statutory faculty headcount and cadre proportion (Professor : Associate : Assistant = 1 : 2 : 6) per APH guidelines
            </p>
          </div>
          <span className="badge badge-neutral">APH Appendix 7</span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 'var(--spacing-lg)' }}>
          {/* Inputs */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div>
              <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: 4 }}>
                Approved Total Student Intake (All Years UG/PG):
              </label>
              <input
                type="number"
                className="filter-select"
                style={{ width: '100%', padding: '8px 12px' }}
                value={calcIntake}
                onChange={(e) => setCalcIntake(parseInt(e.target.value) || 0)}
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <div>
                <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: 4 }}>
                  Prescribed FSR Norm:
                </label>
                <select
                  className="filter-select"
                  style={{ width: '100%' }}
                  value={calcRatioNorm}
                  onChange={(e) => setCalcRatioNorm(e.target.value as any)}
                >
                  <option value="1:20">1:20 (Standard UG Tech)</option>
                  <option value="1:15">1:15 (Accredited / PG)</option>
                </select>
              </div>

              <div>
                <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: 4 }}>
                  Available Regular Faculty:
                </label>
                <input
                  type="number"
                  className="filter-select"
                  style={{ width: '100%', padding: '8px 12px' }}
                  value={calcFaculty}
                  onChange={(e) => setCalcFaculty(parseInt(e.target.value) || 0)}
                />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8 }}>
              <div>
                <label style={{ fontSize: '0.72rem', color: 'var(--text-muted)', display: 'block', marginBottom: 2 }}>
                  Professors:
                </label>
                <input
                  type="number"
                  className="filter-select"
                  style={{ width: '100%', padding: '6px' }}
                  value={calcCadreProf}
                  onChange={(e) => setCalcCadreProf(parseInt(e.target.value) || 0)}
                />
              </div>
              <div>
                <label style={{ fontSize: '0.72rem', color: 'var(--text-muted)', display: 'block', marginBottom: 2 }}>
                  Assoc. Prof:
                </label>
                <input
                  type="number"
                  className="filter-select"
                  style={{ width: '100%', padding: '6px' }}
                  value={calcCadreAssoc}
                  onChange={(e) => setCalcCadreAssoc(parseInt(e.target.value) || 0)}
                />
              </div>
              <div>
                <label style={{ fontSize: '0.72rem', color: 'var(--text-muted)', display: 'block', marginBottom: 2 }}>
                  Asst. Prof:
                </label>
                <input
                  type="number"
                  className="filter-select"
                  style={{ width: '100%', padding: '6px' }}
                  value={calcCadreAsst}
                  onChange={(e) => setCalcCadreAsst(parseInt(e.target.value) || 0)}
                />
              </div>
            </div>
          </div>

          {/* Real-time Calculation Result Box */}
          <div style={{
            background: '#f8fafc',
            borderRadius: 'var(--border-radius-md)',
            padding: 'var(--spacing-md)',
            border: `1px solid ${isFacultyCompliant ? '#a7f3d0' : '#fecaca'}`,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between'
          }}>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)' }}>FSR COMPLIANCE RESULT</span>
                <span className={`badge ${isFacultyCompliant ? 'badge-success' : 'badge-danger'}`}>
                  {isFacultyCompliant ? '✓ COMPLIANT' : '✗ DEFICIENCY DETECTED'}
                </span>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8, fontSize: '0.85rem' }}>
                <span style={{ color: 'var(--text-secondary)' }}>Mandatory Required Faculty:</span>
                <strong style={{ color: 'var(--text-primary)' }}>{requiredFaculty} Faculty Members</strong>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8, fontSize: '0.85rem' }}>
                <span style={{ color: 'var(--text-secondary)' }}>Currently Available Faculty:</span>
                <strong style={{ color: isFacultyCompliant ? 'var(--accent-green)' : 'var(--accent-red)' }}>
                  {calcFaculty} Members
                </strong>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12, fontSize: '0.85rem' }}>
                <span style={{ color: 'var(--text-secondary)' }}>Cadre Deficit Shortfall:</span>
                <strong style={{ color: facultyShortfall > 0 ? 'var(--accent-red)' : 'var(--accent-green)' }}>
                  {facultyShortfall > 0 ? `${facultyShortfall} Faculty Shortfall` : 'Nil Shortfall'}
                </strong>
              </div>
            </div>

            <div style={{
              background: '#ffffff',
              border: '1px solid #e2e8f0',
              borderRadius: 6,
              padding: 10,
              fontSize: '0.75rem',
              color: 'var(--text-secondary)'
            }}>
              <strong>Mandatory Cadre Distribution Breakdown:</strong>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 4 }}>
                <span>Professors required: {requiredProf} (Available: {calcCadreProf})</span>
                <span>Assoc required: {requiredAssoc} (Available: {calcCadreAssoc})</span>
                <span>Asst required: {requiredAsst} (Available: {calcCadreAsst})</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Categories & Filter Selector */}
      <div className="filters-bar" style={{ marginBottom: 'var(--spacing-lg)' }}>
        <div style={{ display: 'flex', gap: 'var(--spacing-sm)', flexWrap: 'wrap', alignItems: 'center' }}>
          <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: 600 }}>Filter Norm:</span>

          <select
            className="filter-select"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            <option value="all">All Regulatory Categories</option>
            <option value="Land & Infrastructure">Land & Infrastructure</option>
            <option value="Faculty & Staff">Faculty & Staff</option>
            <option value="Laboratories & Equipment">Laboratories & Equipment</option>
            <option value="Library Resources">Library Resources</option>
            <option value="Mandatory Committees">Mandatory Committees</option>
            <option value="Financial & Safety">Financial & Safety</option>
          </select>

          <select
            className="filter-select"
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
          >
            <option value="all">All Statuses</option>
            <option value="compliant">Compliant</option>
            <option value="partially_compliant">Partially Compliant</option>
            <option value="non_compliant">Non Compliant</option>
          </select>
        </div>

        <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
          Showing {filteredChecks.length} compliance checklist items
        </div>
      </div>

      {/* Compliance Checklist Cards */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-md)' }}>
        {filteredChecks.map((check) => {
          const isCompliant = check.status === 'compliant';
          const isNonCompliant = check.status === 'non_compliant';
          const isPartial = check.status === 'partially_compliant';

          return (
            <div
              key={check.id}
              className="card"
              style={{
                borderLeft: `4px solid ${
                  isCompliant ? 'var(--accent-green)' : isNonCompliant ? 'var(--accent-red)' : 'var(--accent-amber)'
                }`
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 12 }}>
                <div style={{ flex: 1, minWidth: 280 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
                    <span className="badge badge-neutral">{check.category}</span>
                    <span className={`badge ${
                      isCompliant ? 'badge-success' : isNonCompliant ? 'badge-danger' : 'badge-warning'
                    }`}>
                      {isCompliant ? '✓ COMPLIANT' : isNonCompliant ? '✗ NON-COMPLIANT' : '⚠ PARTIALLY COMPLIANT'}
                    </span>
                    <span className="badge badge-info" style={{ fontSize: '0.65rem' }}>
                      {check.severity.toUpperCase()}
                    </span>
                  </div>

                  <h3 style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: 4 }}>
                    {check.requirement}
                  </h3>

                  <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: 8 }}>
                    {check.description}
                  </p>

                  <div style={{
                    padding: '8px 12px',
                    borderRadius: 'var(--border-radius-sm)',
                    background: '#f8fafc',
                    border: '1px solid #e2e8f0',
                    fontSize: '0.8rem',
                    color: 'var(--text-secondary)'
                  }}>
                    <strong style={{ color: 'var(--accent-blue)' }}>Evidence Evaluated: </strong>
                    {check.evidence || 'Institutional Self-Disclosure & Architect Endorsement'}
                  </div>
                </div>

                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    Evaluated: {new Date(check.checked_at || Date.now()).toLocaleDateString()}
                  </div>
                  <Link
                    href={`/applications/${check.application_id}`}
                    className="btn btn-secondary btn-sm"
                    style={{ marginTop: 8 }}
                  >
                    View Application Dossier <ChevronRight size={14} />
                  </Link>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
