'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import {
  FileText, CheckCircle2, AlertTriangle, AlertCircle, Send,
  ArrowRight, Shield, Search, Eye, Building2, MapPin, Clock,
  ExternalLink, UserCheck, Check, Sparkles, HelpCircle
} from 'lucide-react';
import ProvenanceBadge from '@/components/ProvenanceBadge';
import { usePortalSync, matchesCollege } from '@/lib/portalSync';

export const dynamic = 'force-dynamic';

export default function SimpleMainDashboard() {
  const [selectedTab, setSelectedTab] = useState<'all' | 'flagged' | 'notices' | 'approved'>('all');
  const { notices, verifications } = usePortalSync();

  const pendingNoticesCount = notices.filter(n => n.status === 'pending').length;
  const verifiedCount = verifications.length;

  const urgentApplications = useMemo(() => {
    const isApexNoticeSent = notices.some(n => matchesCollege(n.collegeId, 'app_001') && n.status === 'pending');
    const isApexVerified = verifications.filter(v => matchesCollege(v.collegeId, 'app_001')).length >= 2;

    return [
      {
        id: 'app_001',
        code: '1-102938475',
        name: 'Apex Institute of Technology',
        city: 'Greater Noida',
        state: 'Uttar Pradesh',
        category: 'Extension of Approval 2026–27',
        issueTitle: isApexVerified ? 'All Flagged Documents Verified by Council Officer' : 'Fire Safety NOC Expiring & Duplicate Land Check',
        issueDetail: isApexVerified
          ? 'Dr. Rajesh Kumar manually inspected and verified all compliance certificates.'
          : 'Fire NOC expires in 18 days. Also, land coordinates match another application in the Collusion Radar.',
        flagCount: isApexVerified ? 0 : 2,
        tier: isApexVerified ? (1 as const) : (4 as const),
        status: isApexVerified ? 'Approved' : isApexNoticeSent ? 'Notice Sent' : 'Needs Review'
      },
      {
        id: 'app_006',
        code: '1-692810394',
        name: 'Saraswati Institute of Polytechnic',
        city: 'Panipat',
        state: 'Haryana',
        category: 'Extension of Approval 2026–27',
        issueTitle: 'Building Safety Seal Needs Manual Check',
        issueDetail: 'System detected faint seal on PWD certificate. Needs officer to check physical or scanned copy.',
        flagCount: 1,
        tier: 4 as const,
        status: 'Notice Sent'
      },
      {
        id: 'app_002',
        code: '1-592019483',
        name: 'Modern Management Institute',
        city: 'New Delhi',
        state: 'Delhi NCR',
        category: 'Increase in Intake',
        issueTitle: 'Land Overlap Flag with Apex Institute',
        issueDetail: 'Digital signatures are clean, but campus land coordinates match Apex Institute of Technology.',
        flagCount: 1,
        tier: 1 as const,
        status: 'Needs Review'
      },
      {
        id: 'app_003',
        code: 'IITD-001',
        name: 'Indian Institute of Technology, Delhi',
        city: 'New Delhi',
        state: 'Delhi',
        category: 'New Course in Quantum Tech',
        issueTitle: 'All 3 Documents 100% Genuine & Verified',
        issueDetail: 'Signed digitally by Director & verified with DigiLocker. Fast-track approval granted.',
        flagCount: 0,
        tier: 1 as const,
        status: 'Approved'
      }
    ];
  }, [notices, verifications]);

  return (
    <div className="page-container" style={{ maxWidth: 1280, margin: '0 auto', padding: '24px 32px' }}>
      {/* 1. Welcome Header (Plain English, Friendly) */}
      <div style={{
        background: '#ffffff',
        border: '1px solid #e2e8f0',
        borderRadius: 8,
        padding: '20px 24px',
        marginBottom: 24,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: 16,
        boxShadow: '0 1px 2px rgba(0,0,0,0.02)'
      }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
            <h1 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#0f2942', margin: 0 }}>
              AICTE Scrutiny & Approval Dashboard
            </h1>
            <span style={{
              background: '#eff6ff',
              color: '#1e40af',
              fontSize: '0.72rem',
              fontWeight: 700,
              padding: '2px 8px',
              borderRadius: 4,
              border: '1px solid #bfdbfe'
            }}>
              AY 2026–27
            </span>
          </div>
          <p style={{ fontSize: '0.82rem', color: '#64748b', margin: 0 }}>
            Welcome, <strong>Dr. Rajesh Kumar</strong> (Scrutiny Officer) • Review college applications, verify flagged documents, and send notices.
          </p>
        </div>

        <div style={{ display: 'flex', gap: 10 }}>
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
              textDecoration: 'none',
              boxShadow: '0 2px 4px rgba(15, 41, 66, 0.2)'
            }}
          >
            <AlertCircle size={14} />
            <span>Review Flagged Documents (5)</span>
          </Link>
          <Link
            href="/applications"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
              padding: '8px 14px',
              borderRadius: 6,
              background: '#f8fafc',
              border: '1px solid #cbd5e1',
              color: '#0f2942',
              fontSize: '0.78rem',
              fontWeight: 600,
              textDecoration: 'none'
            }}
          >
            <span>All Applications</span>
            <ArrowRight size={14} />
          </Link>
        </div>
      </div>

      {/* 2. 4 Simple, Big Stat Cards (Zero Jargon) */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
        gap: 16,
        marginBottom: 28
      }}>
        {/* Card 1: Total */}
        <div style={{
          background: '#ffffff',
          border: '1px solid #e2e8f0',
          borderRadius: 8,
          padding: '18px 20px',
          boxShadow: '0 1px 2px rgba(0,0,0,0.02)'
        }}>
          <div style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 600, marginBottom: 4 }}>
            Total College Applications
          </div>
          <div style={{ fontSize: '2rem', fontWeight: 800, color: '#0f2942' }}>
            24
          </div>
          <div style={{ fontSize: '0.7rem', color: '#64748b', marginTop: 4 }}>
            All applications received for this cycle
          </div>
        </div>

        {/* Card 2: Approved */}
        <div style={{
          background: '#ffffff',
          border: '1px solid #e2e8f0',
          borderRadius: 8,
          padding: '18px 20px',
          boxShadow: '0 1px 2px rgba(0,0,0,0.02)'
        }}>
          <div style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 600, marginBottom: 4 }}>
            Approved & Cleared
          </div>
          <div style={{ fontSize: '2rem', fontWeight: 800, color: '#059669' }}>
            {15 + (verifiedCount >= 2 ? 1 : 0)}
          </div>
          <div style={{ fontSize: '0.7rem', color: '#16a34a', fontWeight: 600, marginTop: 4 }}>
            ✓ Passed all document checks cleanly
          </div>
        </div>

        {/* Card 3: Needs Review */}
        <div style={{
          background: '#ffffff',
          border: '1px solid #e2e8f0',
          borderRadius: 8,
          padding: '18px 20px',
          boxShadow: '0 1px 2px rgba(0,0,0,0.02)'
        }}>
          <div style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 600, marginBottom: 4 }}>
            Needs Officer Review
          </div>
          <div style={{ fontSize: '2rem', fontWeight: 800, color: '#d97706' }}>
            {Math.max(1, 5 - (verifiedCount > 0 ? 1 : 0))}
          </div>
          <div style={{ fontSize: '0.7rem', color: '#b45309', fontWeight: 600, marginTop: 4 }}>
            ⚠️ Has flagged documents to inspect
          </div>
        </div>

        {/* Card 4: Notices Sent */}
        <div style={{
          background: '#ffffff',
          border: '1px solid #e2e8f0',
          borderRadius: 8,
          padding: '18px 20px',
          boxShadow: '0 1px 2px rgba(0,0,0,0.02)'
        }}>
          <div style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 600, marginBottom: 4 }}>
            Notices Sent to Colleges
          </div>
          <div style={{ fontSize: '2rem', fontWeight: 800, color: '#7c3aed' }}>
            {Math.max(2, pendingNoticesCount)}
          </div>
          <div style={{ fontSize: '0.7rem', color: '#6d28d9', fontWeight: 600, marginTop: 4 }}>
            ✉ Waiting for colleges to fix and re-upload
          </div>
        </div>
      </div>

      {/* 3. The Core Feature Explained Simply: 4 Proof Levels */}
      <div style={{
        background: '#ffffff',
        border: '1px solid #e2e8f0',
        borderRadius: 8,
        padding: '20px 24px',
        marginBottom: 28,
        boxShadow: '0 1px 3px rgba(0,0,0,0.02)'
      }}>
        <div style={{ marginBottom: 16 }}>
          <div style={{ fontSize: '0.96rem', fontWeight: 800, color: '#0f2942', display: 'flex', alignItems: 'center', gap: 8 }}>
            <Shield size={18} style={{ color: '#0f2942' }} />
            <span>How Our Document Verification Works (4 Simple Levels)</span>
          </div>
          <div style={{ fontSize: '0.74rem', color: '#64748b', marginTop: 2 }}>
            Instead of confusing AI scores, every document is checked against reliable proof:
          </div>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
          gap: 14
        }}>
          {/* Level 1 */}
          <div style={{
            background: '#f8fafc',
            border: '1px solid #c7d2fe',
            borderLeft: '4px solid #4f46e5',
            borderRadius: 6,
            padding: '12px 14px'
          }}>
            <div style={{ fontSize: '0.78rem', fontWeight: 800, color: '#3730a3', marginBottom: 4 }}>
              Level 1: Official Digital Signature
            </div>
            <div style={{ fontSize: '0.72rem', color: '#475569', lineHeight: 1.4 }}>
              Signed digitally by the University or Authority with an authentic DSC token. 100% genuine and legally valid.
            </div>
            <div style={{ fontSize: '0.68rem', color: '#4f46e5', fontWeight: 700, marginTop: 6 }}>
              ● 52 Documents Verified (Highest Trust)
            </div>
          </div>

          {/* Level 2 */}
          <div style={{
            background: '#f8fafc',
            border: '1px solid #a7f3d0',
            borderLeft: '4px solid #059669',
            borderRadius: 6,
            padding: '12px 14px'
          }}>
            <div style={{ fontSize: '0.78rem', fontWeight: 800, color: '#065f46', marginBottom: 4 }}>
              Level 2: Checked with Govt Portal
            </div>
            <div style={{ fontSize: '0.72rem', color: '#475569', lineHeight: 1.4 }}>
              Checked directly with DigiLocker, State Fire Department, or University portal to verify it is genuine.
            </div>
            <div style={{ fontSize: '0.68rem', color: '#059669', fontWeight: 700, marginTop: 6 }}>
              ● 78 Documents Confirmed with Govt
            </div>
          </div>

          {/* Level 3 */}
          <div style={{
            background: '#f8fafc',
            border: '1px solid #bae6fd',
            borderLeft: '4px solid #0284c7',
            borderRadius: 6,
            padding: '12px 14px'
          }}>
            <div style={{ fontSize: '0.78rem', fontWeight: 800, color: '#0369a1', marginBottom: 4 }}>
              Level 3: Matches AICTE Records
            </div>
            <div style={{ fontSize: '0.72rem', color: '#475569', lineHeight: 1.4 }}>
              Matches AICTE’s permanent institutional database, previous year approvals, and registered campus land records.
            </div>
            <div style={{ fontSize: '0.68rem', color: '#0284c7', fontWeight: 700, marginTop: 6 }}>
              ● 41 Documents Matched on File
            </div>
          </div>

          {/* Level 4 */}
          <div style={{
            background: '#fffbeb',
            border: '1px solid #fde68a',
            borderLeft: '4px solid #d97706',
            borderRadius: 6,
            padding: '12px 14px'
          }}>
            <div style={{ fontSize: '0.78rem', fontWeight: 800, color: '#92400e', marginBottom: 4 }}>
              Level 4: Needs Manual Check
            </div>
            <div style={{ fontSize: '0.72rem', color: '#475569', lineHeight: 1.4 }}>
              Our system found a possible problem (expired date, missing seal, or unclear text). Officer must review manually.
            </div>
            <div style={{ fontSize: '0.68rem', color: '#b45309', fontWeight: 700, marginTop: 6 }}>
              ⚠️ 5 Documents Waiting for Officer Review
            </div>
          </div>
        </div>
      </div>

      {/* 4. Urgent Applications Needing Attention Today */}
      <div style={{
        background: '#ffffff',
        border: '1px solid #e2e8f0',
        borderRadius: 8,
        padding: '20px 24px',
        marginBottom: 28,
        boxShadow: '0 1px 3px rgba(0,0,0,0.02)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
          <div>
            <div style={{ fontSize: '0.96rem', fontWeight: 800, color: '#0f2942' }}>
              Applications Needing Attention
            </div>
            <div style={{ fontSize: '0.74rem', color: '#64748b' }}>
              Colleges with flagged documents where you can verify manually or send a notice
            </div>
          </div>

          <Link
            href="/applications"
            style={{
              fontSize: '0.76rem',
              color: '#1e40af',
              fontWeight: 700,
              textDecoration: 'none'
            }}
          >
            View All 24 Applications ↗
          </Link>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {urgentApplications.map(app => (
            <div
              key={app.id}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '14px 18px',
                borderRadius: 6,
                background: app.flagCount > 0 ? '#f8fafc' : '#ffffff',
                border: '1px solid #e2e8f0',
                borderLeft: app.flagCount > 0 ? '4px solid #d97706' : '4px solid #059669',
                flexWrap: 'wrap',
                gap: 12
              }}
            >
              <div style={{ flex: 1, minWidth: 260 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 2 }}>
                  <span style={{ fontSize: '0.88rem', fontWeight: 800, color: '#0f2942' }}>
                    {app.name}
                  </span>
                  <span style={{ fontSize: '0.7rem', color: '#64748b' }}>
                    ({app.code})
                  </span>
                  <ProvenanceBadge tier={app.tier} />
                </div>
                <div style={{ fontSize: '0.72rem', color: '#64748b', marginBottom: 6 }}>
                  {app.category} • {app.city}, {app.state}
                </div>
                <div style={{
                  fontSize: '0.72rem',
                  color: app.flagCount > 0 ? '#92400e' : '#166534',
                  background: app.flagCount > 0 ? '#fffbeb' : '#f0fdf4',
                  border: `1px solid ${app.flagCount > 0 ? '#fde68a' : '#bbf7d0'}`,
                  borderRadius: 4,
                  padding: '4px 8px',
                  display: 'inline-block'
                }}>
                  <strong>{app.issueTitle}:</strong> {app.issueDetail}
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                {app.flagCount > 0 ? (
                  <Link
                    href={`/validation?app=${app.id}`}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: 6,
                      padding: '7px 14px',
                      borderRadius: 5,
                      background: '#0f2942',
                      color: '#ffffff',
                      fontSize: '0.75rem',
                      fontWeight: 700,
                      textDecoration: 'none'
                    }}
                  >
                    <span>Review Documents & Send Notice</span>
                    <ArrowRight size={13} />
                  </Link>
                ) : (
                  <span style={{
                    fontSize: '0.72rem',
                    color: '#065f46',
                    background: '#ecfdf5',
                    border: '1px solid #a7f3d0',
                    padding: '4px 10px',
                    borderRadius: 4,
                    fontWeight: 700
                  }}>
                    ✓ Cleared & Approved
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 5. Quick Links (Easy Access) */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
        gap: 16
      }}>
        <Link
          href="/applications"
          style={{
            background: '#ffffff',
            border: '1px solid #e2e8f0',
            borderRadius: 8,
            padding: '16px 20px',
            textDecoration: 'none',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            boxShadow: '0 1px 2px rgba(0,0,0,0.02)'
          }}
        >
          <div>
            <div style={{ fontSize: '0.86rem', fontWeight: 800, color: '#0f2942', marginBottom: 2 }}>
              1. View All College Applications
            </div>
            <div style={{ fontSize: '0.72rem', color: '#64748b' }}>
              Check statuses, intake details, and application stages.
            </div>
          </div>
          <ArrowRight size={16} style={{ color: '#1e40af' }} />
        </Link>

        <Link
          href="/validation"
          style={{
            background: '#ffffff',
            border: '1px solid #e2e8f0',
            borderRadius: 8,
            padding: '16px 20px',
            textDecoration: 'none',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            boxShadow: '0 1px 2px rgba(0,0,0,0.02)'
          }}
        >
          <div>
            <div style={{ fontSize: '0.86rem', fontWeight: 800, color: '#0f2942', marginBottom: 2 }}>
              2. Document Review & Send Notices
            </div>
            <div style={{ fontSize: '0.72rem', color: '#64748b' }}>
              View flagged documents, verify manually, and issue notices.
            </div>
          </div>
          <ArrowRight size={16} style={{ color: '#d97706' }} />
        </Link>

        <Link
          href="/collusion"
          style={{
            background: '#ffffff',
            border: '1px solid #e2e8f0',
            borderRadius: 8,
            padding: '16px 20px',
            textDecoration: 'none',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            boxShadow: '0 1px 2px rgba(0,0,0,0.02)'
          }}
        >
          <div>
            <div style={{ fontSize: '0.86rem', fontWeight: 800, color: '#0f2942', marginBottom: 2 }}>
              3. Collusion Radar (Duplicate Check)
            </div>
            <div style={{ fontSize: '0.72rem', color: '#64748b' }}>
              Find colleges submitting duplicate land or faculty across states.
            </div>
          </div>
          <ArrowRight size={16} style={{ color: '#92400e' }} />
        </Link>
      </div>
    </div>
  );
}
