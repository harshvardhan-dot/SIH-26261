'use client';

import { useEffect, useState, useMemo } from 'react';
import Link from 'next/link';
import {
  Search, FileText, ArrowRight, Building2, MapPin, Calendar,
  CheckCircle2, AlertTriangle, AlertCircle, Send, Check
} from 'lucide-react';
import ProvenanceBadge from '@/components/ProvenanceBadge';
import { usePortalSync, matchesCollege } from '@/lib/portalSync';

export const dynamic = 'force-dynamic';

interface CollegeApplication {
  id: string;
  name: string;
  code: string;
  city: string;
  state: string;
  category: string;
  submittedDate: string;
  tier: 1 | 2 | 3 | 4;
  status: 'approved' | 'needs_review' | 'notice_sent' | 'under_scrutiny';
  statusLabel: string;
  docStatus: string;
  docCount: number;
  flagCount: number;
}

const mockApplicationsList: CollegeApplication[] = [
  {
    id: 'app_001',
    name: 'Apex Institute of Technology',
    code: '1-102938475',
    city: 'Greater Noida',
    state: 'Uttar Pradesh',
    category: 'Extension of Approval (EoA) 2026–27',
    submittedDate: '12-Oct-2026',
    tier: 4,
    status: 'needs_review',
    statusLabel: 'Needs Officer Review',
    docStatus: '2 Documents Flagged',
    docCount: 5,
    flagCount: 2
  },
  {
    id: 'app_002',
    name: 'Modern Management Institute',
    code: '1-592019483',
    city: 'New Delhi',
    state: 'Delhi NCR',
    category: 'Increase in Intake (MBA)',
    submittedDate: '14-Oct-2026',
    tier: 1,
    status: 'needs_review',
    statusLabel: 'Needs Officer Review',
    docStatus: '1 Land Overlap Flag',
    docCount: 4,
    flagCount: 1
  },
  {
    id: 'app_003',
    name: 'Indian Institute of Technology, Delhi',
    code: 'IITD-001',
    city: 'New Delhi',
    state: 'Delhi',
    category: 'New Course Approval (Quantum Tech)',
    submittedDate: '08-Oct-2026',
    tier: 1,
    status: 'approved',
    statusLabel: 'Approved',
    docStatus: 'All 3 Documents Verified',
    docCount: 3,
    flagCount: 0
  },
  {
    id: 'app_004',
    name: 'Shri Balaji College of Engineering',
    code: '1-847291039',
    city: 'Meerut',
    state: 'Uttar Pradesh',
    category: 'Extension of Approval (EoA) 2026–27',
    submittedDate: '10-Oct-2026',
    tier: 2,
    status: 'approved',
    statusLabel: 'Approved',
    docStatus: 'All 4 Documents Verified',
    docCount: 4,
    flagCount: 0
  },
  {
    id: 'app_005',
    name: 'National College of Pharmacy',
    code: '1-492019482',
    city: 'Gurugram',
    state: 'Haryana',
    category: 'New Course Approval (Pharm.D)',
    submittedDate: '15-Oct-2026',
    tier: 3,
    status: 'under_scrutiny',
    statusLabel: 'Under Scrutiny',
    docStatus: 'Hospital MoU Verified',
    docCount: 4,
    flagCount: 0
  },
  {
    id: 'app_006',
    name: 'Saraswati Institute of Polytechnic',
    code: '1-692810394',
    city: 'Panipat',
    state: 'Haryana',
    category: 'Extension of Approval (EoA) 2026–27',
    submittedDate: '11-Oct-2026',
    tier: 4,
    status: 'notice_sent',
    statusLabel: 'Notice Sent to College',
    docStatus: 'Notice Sent: Building Seal Check',
    docCount: 4,
    flagCount: 1
  },
  {
    id: 'app_007',
    name: 'Rajiv Gandhi Technical University Affiliate',
    code: 'RGTU-045',
    city: 'Bhopal',
    state: 'Madhya Pradesh',
    category: 'Change in Site / Relocation',
    submittedDate: '09-Oct-2026',
    tier: 2,
    status: 'under_scrutiny',
    statusLabel: 'Under Scrutiny',
    docStatus: 'State NOC Confirmed',
    docCount: 3,
    flagCount: 0
  },
  {
    id: 'app_008',
    name: 'Bangalore Institute of Technology',
    code: 'BIT-078',
    city: 'Bengaluru',
    state: 'Karnataka',
    category: 'Extension of Approval (EoA) 2026–27',
    submittedDate: '07-Oct-2026',
    tier: 1,
    status: 'approved',
    statusLabel: 'Approved',
    docStatus: 'All Documents Digitally Signed',
    docCount: 5,
    flagCount: 0
  }
];

export default function ApplicationsPage() {
  const { notices, verifications } = usePortalSync();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'needs_review' | 'notice_sent' | 'approved'>('all');

  const applications = useMemo(() => {
    return mockApplicationsList.map(app => {
      const pendingNotices = notices.filter(n => matchesCollege(n.collegeId, app.id) && n.status === 'pending');
      const collegeVerifs = verifications.filter(v => matchesCollege(v.collegeId, app.id));

      if (pendingNotices.length > 0) {
        return {
          ...app,
          status: 'notice_sent' as const,
          statusLabel: `Notice Sent (${pendingNotices.length})`,
          docStatus: `Notice Sent: ${pendingNotices[0].subject}`
        };
      }

      if (app.id === 'app_001' && collegeVerifs.length >= 2) {
        return {
          ...app,
          status: 'approved' as const,
          statusLabel: 'Approved & Cleared',
          docStatus: 'All Documents Manually Verified',
          flagCount: 0
        };
      }

      return app;
    });
  }, [notices, verifications]);

  const filteredApplications = applications.filter(app => {
    const matchesSearch =
      app.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.state.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.category.toLowerCase().includes(searchTerm.toLowerCase());

    if (!matchesSearch) return false;

    if (statusFilter !== 'all' && app.status !== statusFilter) return false;

    return true;
  });

  const getStatusBadge = (status: CollegeApplication['status'], label: string) => {
    switch (status) {
      case 'approved':
        return (
          <span style={{
            background: '#ecfdf5',
            color: '#065f46',
            border: '1px solid #a7f3d0',
            fontSize: '0.72rem',
            fontWeight: 700,
            padding: '3px 8px',
            borderRadius: 4,
            display: 'inline-flex',
            alignItems: 'center',
            gap: 4
          }}>
            <CheckCircle2 size={12} /> {label}
          </span>
        );
      case 'needs_review':
        return (
          <span style={{
            background: '#fffbeb',
            color: '#92400e',
            border: '1px solid #fde68a',
            fontSize: '0.72rem',
            fontWeight: 700,
            padding: '3px 8px',
            borderRadius: 4,
            display: 'inline-flex',
            alignItems: 'center',
            gap: 4
          }}>
            <AlertTriangle size={12} /> {label}
          </span>
        );
      case 'notice_sent':
        return (
          <span style={{
            background: '#f5f3ff',
            color: '#6d28d9',
            border: '1px solid #ddd6fe',
            fontSize: '0.72rem',
            fontWeight: 700,
            padding: '3px 8px',
            borderRadius: 4,
            display: 'inline-flex',
            alignItems: 'center',
            gap: 4
          }}>
            <Send size={12} /> {label}
          </span>
        );
      default:
        return (
          <span style={{
            background: '#f8fafc',
            color: '#334155',
            border: '1px solid #cbd5e1',
            fontSize: '0.72rem',
            fontWeight: 600,
            padding: '3px 8px',
            borderRadius: 4,
            display: 'inline-flex',
            alignItems: 'center',
            gap: 4
          }}>
            {label}
          </span>
        );
    }
  };

  return (
    <div className="page-container" style={{ maxWidth: 1280, margin: '0 auto', padding: '24px 32px' }}>
      {/* Header */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingBottom: 20,
        marginBottom: 24,
        borderBottom: '1px solid #e2e8f0',
        flexWrap: 'wrap',
        gap: 16
      }}>
        <div>
          <h1 style={{ fontSize: '1.45rem', fontWeight: 800, color: '#0f2942', margin: 0 }}>
            College Applications
          </h1>
          <p style={{ fontSize: '0.82rem', color: '#64748b', marginTop: 4, margin: 0 }}>
            View all 2026–27 college applications, their approval status, and document verification health.
          </p>
        </div>

        <Link
          href="/validation"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 6,
            padding: '8px 16px',
            borderRadius: 6,
            background: '#0f2942',
            color: '#ffffff',
            fontSize: '0.78rem',
            fontWeight: 700,
            textDecoration: 'none'
          }}
        >
          <AlertCircle size={14} />
          <span>Document Review & Send Notices</span>
        </Link>
      </div>

      {/* Search & Filter Bar */}
      <div style={{
        background: '#ffffff',
        border: '1px solid #e2e8f0',
        borderRadius: 8,
        padding: '16px 20px',
        marginBottom: 20,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: 14,
        boxShadow: '0 1px 2px rgba(0,0,0,0.02)'
      }}>
        {/* Search */}
        <div style={{ position: 'relative', flex: 1, minWidth: 280, maxWidth: 440 }}>
          <Search size={15} style={{ position: 'absolute', left: 12, top: 10, color: '#94a3b8' }} />
          <input
            type="text"
            placeholder="Search by college name, code, or city..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            style={{
              width: '100%',
              padding: '8px 12px 8px 36px',
              borderRadius: 6,
              border: '1px solid #cbd5e1',
              fontSize: '0.8rem',
              outline: 'none',
              background: '#ffffff'
            }}
          />
        </div>

        {/* Filter Pills */}
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          <button
            onClick={() => setStatusFilter('all')}
            style={{
              padding: '6px 12px',
              borderRadius: 5,
              fontSize: '0.75rem',
              fontWeight: 600,
              cursor: 'pointer',
              border: '1px solid',
              background: statusFilter === 'all' ? '#0f2942' : '#ffffff',
              color: statusFilter === 'all' ? '#ffffff' : '#334155',
              borderColor: statusFilter === 'all' ? '#0f2942' : '#cbd5e1'
            }}
          >
            All Applications ({applications.length})
          </button>

          <button
            onClick={() => setStatusFilter('needs_review')}
            style={{
              padding: '6px 12px',
              borderRadius: 5,
              fontSize: '0.75rem',
              fontWeight: 600,
              cursor: 'pointer',
              border: '1px solid',
              background: statusFilter === 'needs_review' ? '#d97706' : '#ffffff',
              color: statusFilter === 'needs_review' ? '#ffffff' : '#b45309',
              borderColor: statusFilter === 'needs_review' ? '#d97706' : '#fde68a'
            }}
          >
            ⚠️ Needs Review ({applications.filter(a => a.status === 'needs_review').length})
          </button>

          <button
            onClick={() => setStatusFilter('notice_sent')}
            style={{
              padding: '6px 12px',
              borderRadius: 5,
              fontSize: '0.75rem',
              fontWeight: 600,
              cursor: 'pointer',
              border: '1px solid',
              background: statusFilter === 'notice_sent' ? '#7c3aed' : '#ffffff',
              color: statusFilter === 'notice_sent' ? '#ffffff' : '#6d28d9',
              borderColor: statusFilter === 'notice_sent' ? '#7c3aed' : '#ddd6fe'
            }}
          >
            ✉ Notices Sent ({applications.filter(a => a.status === 'notice_sent').length})
          </button>

          <button
            onClick={() => setStatusFilter('approved')}
            style={{
              padding: '6px 12px',
              borderRadius: 5,
              fontSize: '0.75rem',
              fontWeight: 600,
              cursor: 'pointer',
              border: '1px solid',
              background: statusFilter === 'approved' ? '#059669' : '#ffffff',
              color: statusFilter === 'approved' ? '#ffffff' : '#065f46',
              borderColor: statusFilter === 'approved' ? '#059669' : '#a7f3d0'
            }}
          >
            ✓ Approved ({applications.filter(a => a.status === 'approved').length})
          </button>
        </div>
      </div>

      {/* Applications Table */}
      <div style={{
        background: '#ffffff',
        border: '1px solid #e2e8f0',
        borderRadius: 8,
        overflow: 'hidden',
        boxShadow: '0 1px 3px rgba(0,0,0,0.02)'
      }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.78rem' }}>
          <thead>
            <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0', textAlign: 'left', color: '#475569' }}>
              <th style={{ padding: '12px 16px', fontWeight: 700 }}>College Details</th>
              <th style={{ padding: '12px 16px', fontWeight: 700 }}>Application Category</th>
              <th style={{ padding: '12px 16px', fontWeight: 700 }}>Trust Level</th>
              <th style={{ padding: '12px 16px', fontWeight: 700 }}>Application Status</th>
              <th style={{ padding: '12px 16px', fontWeight: 700 }}>Document Summary</th>
              <th style={{ padding: '12px 16px', fontWeight: 700, textAlign: 'right' }}>Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredApplications.map((app, idx) => (
              <tr
                key={app.id}
                style={{
                  borderBottom: idx === filteredApplications.length - 1 ? 'none' : '1px solid #f1f5f9',
                  background: app.flagCount > 0 ? '#fffdfa' : '#ffffff'
                }}
              >
                {/* College Info */}
                <td style={{ padding: '14px 16px' }}>
                  <div style={{ fontWeight: 800, color: '#0f2942', fontSize: '0.85rem' }}>
                    {app.name}
                  </div>
                  <div style={{ fontSize: '0.72rem', color: '#64748b', marginTop: 2 }}>
                    AICTE Code: <strong>{app.code}</strong> • {app.city}, {app.state}
                  </div>
                </td>

                {/* Category */}
                <td style={{ padding: '14px 16px', color: '#334155', fontWeight: 500 }}>
                  {app.category}
                </td>

                {/* Trust Level */}
                <td style={{ padding: '14px 16px' }}>
                  <ProvenanceBadge tier={app.tier} />
                </td>

                {/* Status */}
                <td style={{ padding: '14px 16px' }}>
                  {getStatusBadge(app.status, app.statusLabel)}
                </td>

                {/* Document Status */}
                <td style={{ padding: '14px 16px' }}>
                  <span style={{
                    fontSize: '0.72rem',
                    fontWeight: 600,
                    color: app.flagCount > 0 ? '#b45309' : '#059669'
                  }}>
                    {app.docStatus}
                  </span>
                </td>

                {/* Action Button */}
                <td style={{ padding: '14px 16px', textAlign: 'right' }}>
                  <Link
                    href={`/validation?app=${app.id}`}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: 4,
                      padding: '6px 12px',
                      borderRadius: 4,
                      background: app.flagCount > 0 ? '#0f2942' : '#f8fafc',
                      color: app.flagCount > 0 ? '#ffffff' : '#0f2942',
                      border: '1px solid',
                      borderColor: app.flagCount > 0 ? '#0f2942' : '#cbd5e1',
                      fontSize: '0.72rem',
                      fontWeight: 700,
                      textDecoration: 'none'
                    }}
                  >
                    <span>{app.flagCount > 0 ? 'Review & Notice' : 'View Docs'}</span>
                    <ArrowRight size={12} />
                  </Link>
                </td>
              </tr>
            ))}

            {filteredApplications.length === 0 && (
              <tr>
                <td colSpan={6} style={{ padding: '36px 16px', textAlign: 'center', color: '#64748b' }}>
                  No applications found matching your search.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
