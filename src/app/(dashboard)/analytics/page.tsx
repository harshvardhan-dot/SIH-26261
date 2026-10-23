'use client';

import { useState } from 'react';
import {
  BarChart3, TrendingUp, Zap, Clock, ShieldCheck,
  FileCheck, AlertTriangle, Building2, MapPin, Download
} from 'lucide-react';
import {
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis,
  CartesianGrid, Tooltip, Legend, PieChart, Pie, Cell,
  AreaChart, Area
} from 'recharts';

const regionalData = [
  { region: 'Northern (Delhi, UP, PB)', applications: 840, approved: 680, rejected: 42, underReview: 118 },
  { region: 'Southern (TN, AP, KL)', applications: 960, approved: 820, rejected: 35, underReview: 105 },
  { region: 'Western (MH, GJ, GA)', applications: 780, approved: 640, rejected: 38, underReview: 102 },
  { region: 'South-Western (KA, TS)', applications: 890, approved: 750, rejected: 29, underReview: 111 },
  { region: 'Eastern (WB, OR, BH)', applications: 450, approved: 360, rejected: 24, underReview: 66 },
  { region: 'Central (MP, CG, RJ)', applications: 520, approved: 420, rejected: 31, underReview: 69 },
];

const defectFrequencyData = [
  { defect: 'Fire Safety NOC Expiry', count: 184, impact: 'High' },
  { defect: 'FSR Cadre Shortfall', count: 162, impact: 'High' },
  { defect: 'Land Khasra Plot Mismatch', count: 128, impact: 'Critical' },
  { defect: 'Society Annual Return Missing', count: 94, impact: 'Medium' },
  { defect: 'Affiliation Letter Stale', count: 76, impact: 'Medium' },
  { defect: 'Digital Signature Invalid', count: 42, impact: 'Critical' },
];

const efficiencyData = [
  { month: 'Jan', manualDays: 24, aiAssistedDays: 3.2, volume: 120 },
  { month: 'Feb', manualDays: 22, aiAssistedDays: 2.8, volume: 240 },
  { month: 'Mar', manualDays: 26, aiAssistedDays: 2.1, volume: 510 },
  { month: 'Apr', manualDays: 25, aiAssistedDays: 1.8, volume: 880 },
  { month: 'May', manualDays: 28, aiAssistedDays: 1.5, volume: 1200 },
  { month: 'Jun', manualDays: 24, aiAssistedDays: 1.4, volume: 740 },
];

const categoryDistribution = [
  { name: 'Engineering & Tech (UG/PG)', value: 52, color: 'hsl(217, 91%, 60%)' },
  { name: 'Management (MBA/PGDM)', value: 24, color: 'hsl(262, 83%, 58%)' },
  { name: 'Pharmacy (B.Pharm/M.Pharm)', value: 12, color: 'hsl(142, 71%, 45%)' },
  { name: 'Architecture & Town Planning', value: 7, color: 'hsl(38, 92%, 50%)' },
  { name: 'Applied Arts & Crafts', value: 5, color: 'hsl(186, 73%, 46%)' },
];

export default function AnalyticsDashboardPage() {
  const [timeframe, setTimeframe] = useState('2025-26');

  return (
    <div className="page-container">
      {/* Header */}
      <div className="page-header">
        <div>
          <div className="page-header-pretitle">
            <BarChart3 size={14} style={{ color: 'var(--accent-cyan)', display: 'inline', marginRight: 6 }} />
            Executive Intelligence & Operational Benchmarks
          </div>
          <h1 className="page-header-title">Institutional Approval Analytics</h1>
          <p className="page-header-subtitle">
            Macro-level performance indicators, regional distribution, approval velocity, and statutory defect frequency trends
          </p>
        </div>
        <div style={{ display: 'flex', gap: 'var(--spacing-sm)' }}>
          <select
            className="filter-select"
            value={timeframe}
            onChange={(e) => setTimeframe(e.target.value)}
          >
            <option value="2025-26">Approval Cycle 2025-26</option>
            <option value="2024-25">Approval Cycle 2024-25</option>
            <option value="all-time">All Cycles Aggregated</option>
          </select>
          <button className="btn btn-secondary" onClick={() => window.print()}>
            <Download size={16} /> Export Dossier
          </button>
        </div>
      </div>

      {/* Hero Impact Metrics */}
      <div className="stats-grid" style={{ marginBottom: 'var(--spacing-xl)' }}>
        <div className="stat-card">
          <div className="stat-card-header">
            <span className="stat-card-title">Turnaround Acceleration</span>
            <div className="stat-card-icon green"><Zap size={18} /></div>
          </div>
          <div className="stat-card-value">1.8 Days</div>
          <div className="stat-card-change positive">Down from 24.5 days manual scrutiny (92% reduction)</div>
        </div>

        <div className="stat-card">
          <div className="stat-card-header">
            <span className="stat-card-title">First-Pass Compliance</span>
            <div className="stat-card-icon blue"><ShieldCheck size={18} /></div>
          </div>
          <div className="stat-card-value">78.6%</div>
          <div className="stat-card-change positive">+14.2% YoY through automated pre-validation guidance</div>
        </div>

        <div className="stat-card">
          <div className="stat-card-header">
            <span className="stat-card-title">Fraud & Alteration Catch</span>
            <div className="stat-card-icon amber"><AlertTriangle size={18} /></div>
          </div>
          <div className="stat-card-value">100% Intercept</div>
          <div className="stat-card-change positive">Zero undetected metadata or hash duplicates</div>
        </div>

        <div className="stat-card">
          <div className="stat-card-header">
            <span className="stat-card-title">Institutions Processed</span>
            <div className="stat-card-icon purple"><Building2 size={18} /></div>
          </div>
          <div className="stat-card-value">4,440</div>
          <div className="stat-card-change positive">Across 6 AICTE Regional Bureaus</div>
        </div>
      </div>

      {/* Main Charts Grid 1: Regional Breakdown & Velocity Comparison */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: 'var(--spacing-lg)', marginBottom: 'var(--spacing-lg)' }}>
        {/* Regional Volume Bar Chart */}
        <div className="card">
          <div className="card-header">
            <div>
              <h3 className="card-title">Regional Processing & Disposal Volumes</h3>
              <p className="card-subtitle">Extension of Approval (EoA) decisions across AICTE Regional Offices</p>
            </div>
            <span className="badge badge-info">2025-26 Cycle</span>
          </div>

          <div style={{ height: 320, width: '100%' }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={regionalData} margin={{ top: 10, right: 10, left: -20, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="region" stroke="#64748b" fontSize={11} angle={-15} textAnchor="end" />
                <YAxis stroke="#64748b" fontSize={11} />
                <Tooltip
                  contentStyle={{
                    background: '#ffffff',
                    border: '1px solid #e2e8f0',
                    borderRadius: 6,
                    color: '#0f172a',
                    boxShadow: '0 4px 6px -1px rgba(0,0,0,0.08)',
                    fontSize: '0.8rem'
                  }}
                />
                <Legend wrapperStyle={{ fontSize: '0.78rem', paddingTop: 10 }} />
                <Bar dataKey="approved" name="Approved ✓" fill="#15803d" radius={[4, 4, 0, 0]} />
                <Bar dataKey="underReview" name="Under Scrutiny ⏳" fill="#1e40af" radius={[4, 4, 0, 0]} />
                <Bar dataKey="rejected" name="Rejected / Deficient ✗" fill="#b91c1c" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Category Share Donut */}
        <div className="card">
          <div className="card-header">
            <div>
              <h3 className="card-title">Disciplines & Program Mix</h3>
              <p className="card-subtitle">Proportion of applications by academic domain</p>
            </div>
          </div>

          <div style={{ height: 240, width: '100%' }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryDistribution}
                  cx="50%"
                  cy="50%"
                  innerRadius={65}
                  outerRadius={95}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {categoryDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    background: 'var(--bg-elevated)',
                    border: '1px solid var(--glass-border)',
                    borderRadius: 8,
                    fontSize: '0.8rem'
                  }}
                  formatter={(val: any) => `${val}%`}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginTop: 8 }}>
            {categoryDistribution.map((cat, idx) => (
              <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.78rem' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'var(--text-secondary)' }}>
                  <span style={{ width: 10, height: 10, borderRadius: '50%', background: cat.color }} />
                  {cat.name}
                </span>
                <strong style={{ color: 'var(--text-primary)' }}>{cat.value}%</strong>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main Charts Grid 2: Turnaround Velocity Area Chart & Defect Pareto List */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: 'var(--spacing-lg)' }}>
        {/* Processing Velocity Comparison */}
        <div className="card">
          <div className="card-header">
            <div>
              <h3 className="card-title">Manual vs. AI-Assisted Turnaround (Days)</h3>
              <p className="card-subtitle">Dramatic reduction in institutional wait times through decision-support</p>
            </div>
            <span className="badge badge-success">11.6x Acceleration</span>
          </div>

          <div style={{ height: 280, width: '100%' }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={efficiencyData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorManual" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(0, 84%, 60%)" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="hsl(0, 84%, 60%)" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorAI" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(142, 71%, 45%)" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="hsl(142, 71%, 45%)" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="month" stroke="#64748b" fontSize={11} />
                <YAxis stroke="#64748b" fontSize={11} label={{ value: 'Days', angle: -90, position: 'insideLeft', fill: '#64748b' }} />
                <Tooltip
                  contentStyle={{
                    background: '#ffffff',
                    border: '1px solid #e2e8f0',
                    borderRadius: 6,
                    color: '#0f172a',
                    boxShadow: '0 4px 6px -1px rgba(0,0,0,0.08)',
                    fontSize: '0.8rem'
                  }}
                />
                <Legend wrapperStyle={{ fontSize: '0.78rem' }} />
                <Area type="monotone" dataKey="manualDays" name="Legacy Manual Review (Days)" stroke="#b91c1c" fillOpacity={1} fill="url(#colorManual)" />
                <Area type="monotone" dataKey="aiAssistedDays" name="AI-Assisted Platform (Days)" stroke="#15803d" fillOpacity={1} fill="url(#colorAI)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Defect Pareto Breakdown */}
        <div className="card">
          <div className="card-header">
            <div>
              <h3 className="card-title">Top Scrutiny Defect Drivers</h3>
              <p className="card-subtitle">Most prevalent statutory grounds for scrutiny deficiency notice</p>
            </div>
            <span className="badge badge-warning">Target for Capacity Building</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {defectFrequencyData.map((item, idx) => (
              <div key={idx} style={{
                padding: '10px 14px',
                borderRadius: 'var(--border-radius-sm)',
                background: 'var(--glass-bg)',
                border: '1px solid var(--glass-border)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
              }}>
                <div style={{ flex: 1, minWidth: 0, paddingRight: 10 }}>
                  <div style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                    {idx + 1}. {item.defect}
                  </div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: 2 }}>
                    Impact Level: <strong style={{ color: item.impact === 'Critical' ? 'var(--accent-red)' : 'var(--accent-amber)' }}>{item.impact}</strong>
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--accent-blue)' }}>
                    {item.count}
                  </div>
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                    Institutions
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
