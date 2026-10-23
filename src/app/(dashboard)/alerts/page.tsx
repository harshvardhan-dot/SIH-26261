'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Bell, AlertTriangle, ShieldAlert, CheckCircle, Info,
  Search, Filter, Check, Clock, ArrowRight, RefreshCw,
  Building2, ExternalLink
} from 'lucide-react';

interface AlertItem {
  id: string;
  application_id: string;
  type: string;
  severity: 'critical' | 'warning' | 'info';
  title: string;
  message: string;
  resolved: number;
  resolved_by?: string;
  resolved_at?: string;
  created_at: string;
  institution_name?: string;
  institution_code?: string;
  app_category?: string;
}

interface AlertStats {
  total: number;
  unresolved: number;
  resolved_count: number;
  critical_count: number;
  warning_count: number;
}

export default function AlertsCenterPage() {
  const [alerts, setAlerts] = useState<AlertItem[]>([]);
  const [stats, setStats] = useState<AlertStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedSeverity, setSelectedSeverity] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('0'); // 0 for unresolved
  const [resolvingId, setResolvingId] = useState<string | null>(null);

  const fetchAlerts = () => {
    setLoading(true);
    let url = '/api/alerts';
    const params = new URLSearchParams();
    if (selectedSeverity !== 'all') params.append('severity', selectedSeverity);
    if (selectedStatus !== 'all') params.append('resolved', selectedStatus);
    if (params.toString()) url += `?${params.toString()}`;

    fetch(url)
      .then(res => res.json())
      .then(data => {
        setAlerts(data.alerts || []);
        if (data.stats) setStats(data.stats);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  };

  useEffect(() => {
    fetchAlerts();
  }, [selectedSeverity, selectedStatus]);

  const handleResolveAlert = async (id: string) => {
    setResolvingId(id);
    try {
      const res = await fetch('/api/alerts', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id,
          resolved: true,
          resolved_by: 'Dr. Rajesh Kumar (Approval Bureau)'
        })
      });
      if (res.ok) {
        fetchAlerts();
      }
    } catch (e) {
      console.error(e);
    } finally {
      setResolvingId(null);
    }
  };

  return (
    <div className="page-container">
      {/* Header */}
      <div className="page-header">
        <div>
          <div className="page-header-pretitle">
            <Bell size={14} style={{ color: 'var(--accent-amber)', display: 'inline', marginRight: 6 }} />
            Operational Deficiencies & Threat Monitoring
          </div>
          <h1 className="page-header-title">Alerts & Threat Intelligence</h1>
          <p className="page-header-subtitle">
            Centralized notification feed for critical document fraud alerts, expiring certificates, and statutory breaches
          </p>
        </div>
        <div>
          <button className="btn btn-secondary" onClick={fetchAlerts}>
            <RefreshCw size={16} /> Refresh Alerts
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="stats-grid" style={{ marginBottom: 'var(--spacing-lg)' }}>
        <div className="stat-card">
          <div className="stat-card-header">
            <span className="stat-card-title">Active / Unresolved</span>
            <div className="stat-card-icon amber"><Bell size={18} /></div>
          </div>
          <div className="stat-card-value">{stats?.unresolved || 0}</div>
          <div className="stat-card-change positive">Requiring officer attention</div>
        </div>

        <div className="stat-card">
          <div className="stat-card-header">
            <span className="stat-card-title">Critical Threats</span>
            <div className="stat-card-icon red"><ShieldAlert size={18} /></div>
          </div>
          <div className="stat-card-value">{stats?.critical_count || 0}</div>
          <div className="stat-card-change negative">Potential forgery or severe non-compliance</div>
        </div>

        <div className="stat-card">
          <div className="stat-card-header">
            <span className="stat-card-title">Regulatory Warnings</span>
            <div className="stat-card-icon amber"><AlertTriangle size={18} /></div>
          </div>
          <div className="stat-card-value">{stats?.warning_count || 0}</div>
          <div className="stat-card-change positive">Expiring certificates / missing NOCs</div>
        </div>

        <div className="stat-card">
          <div className="stat-card-header">
            <span className="stat-card-title">Resolved & Discharged</span>
            <div className="stat-card-icon green"><CheckCircle size={18} /></div>
          </div>
          <div className="stat-card-value">{stats?.resolved_count || 0}</div>
          <div className="stat-card-change positive">Actioned by Scrutiny Committee</div>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="filters-bar" style={{ marginBottom: 'var(--spacing-lg)' }}>
        <div style={{ display: 'flex', gap: 'var(--spacing-sm)', flexWrap: 'wrap', alignItems: 'center' }}>
          <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: 600 }}>Filter:</span>

          <select
            className="filter-select"
            value={selectedSeverity}
            onChange={(e) => setSelectedSeverity(e.target.value)}
          >
            <option value="all">All Severities</option>
            <option value="critical">Critical Severity</option>
            <option value="warning">Warning</option>
            <option value="info">Informational</option>
          </select>

          <select
            className="filter-select"
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
          >
            <option value="0">Unresolved Only (Active)</option>
            <option value="1">Resolved Only</option>
            <option value="all">All Statuses</option>
          </select>
        </div>

        <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
          Showing {alerts.length} notifications
        </div>
      </div>

      {/* Alerts Feed */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-md)' }}>
        {alerts.length === 0 ? (
          <div className="card" style={{ textAlign: 'center', padding: 'var(--spacing-2xl)' }}>
            <CheckCircle size={40} style={{ color: 'var(--accent-green)', margin: '0 auto 12px' }} />
            <h3 style={{ fontSize: '1.1rem', fontWeight: 600, color: 'var(--text-primary)' }}>No Active Alerts in this View</h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: 4 }}>
              All operational deficiencies in the selected category have been resolved or cleared.
            </p>
          </div>
        ) : (
          alerts.map((alert) => {
            const isCritical = alert.severity === 'critical';
            const isWarning = alert.severity === 'warning';
            const isResolved = alert.resolved === 1;

            return (
              <div
                key={alert.id}
                className="card"
                style={{
                  borderLeft: `4px solid ${
                    isCritical ? 'var(--accent-red)' : isWarning ? 'var(--accent-amber)' : 'var(--accent-blue)'
                  }`,
                  opacity: isResolved ? 0.7 : 1,
                  transition: 'all 0.2s ease'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 12 }}>
                  <div style={{ flex: 1, minWidth: 280 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                      <span className={`badge ${
                        isCritical ? 'badge-danger' : isWarning ? 'badge-warning' : 'badge-info'
                      }`}>
                        {alert.severity.toUpperCase()}
                      </span>
                      <span className="badge badge-neutral" style={{ textTransform: 'capitalize' }}>
                        {alert.type.replace('_', ' ')}
                      </span>
                      {isResolved ? (
                        <span className="badge badge-success">Resolved ✓</span>
                      ) : (
                        <span className="badge badge-warning">Active Attention</span>
                      )}
                    </div>

                    <h3 style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: 4 }}>
                      {alert.title}
                    </h3>

                    <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: 8 }}>
                      {alert.message}
                    </p>

                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 14, fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                      <span>Target: <strong style={{ color: 'var(--text-primary)' }}>{alert.institution_name || 'Technical Institute'}</strong> ({alert.institution_code || 'AICTE'})</span>
                      {alert.application_id && (
                        <span>Application: <Link href={`/applications/${alert.application_id}`} style={{ color: 'var(--accent-blue)', textDecoration: 'underline' }}>{alert.application_id}</Link></span>
                      )}
                      <span>Created: {new Date(alert.created_at).toLocaleString()}</span>
                    </div>

                    {isResolved && alert.resolved_by && (
                      <div style={{ marginTop: 8, fontSize: '0.75rem', color: 'var(--accent-green)' }}>
                        Resolved by {alert.resolved_by} on {new Date(alert.resolved_at || '').toLocaleDateString()}
                      </div>
                    )}
                  </div>

                  <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                    {alert.application_id && (
                      <Link
                        href={`/applications/${alert.application_id}`}
                        className="btn btn-secondary btn-sm"
                      >
                        Inspect Application <ArrowRight size={14} />
                      </Link>
                    )}
                    {!isResolved && (
                      <button
                        className="btn btn-primary btn-sm"
                        onClick={() => handleResolveAlert(alert.id)}
                        disabled={resolvingId === alert.id}
                      >
                        <Check size={14} /> Mark Resolved
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
