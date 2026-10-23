'use client';

import { useState, useEffect, useMemo, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import {
  FileCheck, AlertTriangle, CheckCircle2, AlertCircle, Send,
  ArrowRight, Search, FileText, Check, Shield, Building2,
  Calendar, Clock, ExternalLink, HelpCircle, X, Download, RefreshCw, Eye,
  GitCompare, Printer
} from 'lucide-react';
import ProvenanceBadge from '@/components/ProvenanceBadge';
import { ProvenanceTier } from '@/lib/provenance';
import DocumentViewerModal, { ViewableDocument } from '@/components/DocumentViewerModal';
import ResetDemoButton from '@/components/ResetDemoButton';
import CrossDocumentComparisonModal from '@/components/CrossDocumentComparisonModal';
import ScrutinyReportExportModal from '@/components/ScrutinyReportExportModal';
import DemoWalkthroughModal from '@/components/DemoWalkthroughModal';
import { useTranslation } from '@/lib/i18n';
import {
  usePortalSync,
  sendNoticeToCollege,
  verifyDocumentManually,
  matchesCollege,
  matchesDoc,
  PortalNotice,
  ManualVerification
} from '@/lib/portalSync';

export const dynamic = 'force-dynamic';

interface BaseDocumentItem {
  id: string;
  name: string;
  category: string;
  tier: ProvenanceTier;
  issuer: string;
  checkMethod: string;
  baseStatus: 'verified' | 'flagged';
  flagReason?: string;
}

interface CollegeDossier {
  id: string;
  name: string;
  code: string;
  city: string;
  state: string;
  category: string;
  documents: BaseDocumentItem[];
}

const initialColleges: CollegeDossier[] = [
  {
    id: 'app_001',
    name: 'Apex Institute of Technology',
    code: '1-102938475',
    city: 'Greater Noida',
    state: 'Uttar Pradesh',
    category: 'Extension of Approval (EoA) 2026–27',
    documents: [
      {
        id: 'doc_01',
        name: 'Fire Safety Certificate (NOC)',
        category: 'Safety & Compliance',
        tier: 2,
        issuer: 'State Fire Services Directorate (UP)',
        checkMethod: 'Checked via State Fire Portal API',
        baseStatus: 'flagged',
        flagReason: 'Certificate expires in 18 days (validity cutoff is 30 days). The college must submit a renewal acknowledgment receipt.'
      },
      {
        id: 'doc_02',
        name: 'Faculty Cadre & Salary Undertaking (Form 16)',
        category: 'Academic Faculty',
        tier: 4,
        issuer: 'Principal & Chartered Accountant',
        checkMethod: 'Automated Cadre Calculation',
        baseStatus: 'flagged',
        flagReason: 'Shortfall of 1 Professor in Computer Science Dept for 1:20 teacher-student ratio. Need Selection Committee minutes.'
      },
      {
        id: 'doc_03',
        name: 'Campus Land Registered Deed (Plot 402/1)',
        category: 'Land & Infrastructure',
        tier: 2,
        issuer: 'Sub-Registrar Office, Greater Noida',
        checkMethod: 'DigiLocker Land Registry API',
        baseStatus: 'flagged',
        flagReason: 'Collusion Alert: Survey coordinates for Plot 402/1 match Modern Management Institute in Collusion Radar.'
      },
      {
        id: 'doc_04',
        name: 'University Affiliation Continuance Letter',
        category: 'University Affiliation',
        tier: 1,
        issuer: 'Dr. A.P.J. Abdul Kalam Technical University (AKTU)',
        checkMethod: 'Controller of Examinations Digital Token (X.509)',
        baseStatus: 'verified'
      },
      {
        id: 'doc_05',
        name: 'Building Safety & Approved Blueprint',
        category: 'Campus Infrastructure',
        tier: 3,
        issuer: 'PWD Executive Engineer & AICTE Archive',
        checkMethod: 'Matched with 2024-25 Council Approved Footprint',
        baseStatus: 'verified'
      }
    ]
  },
  {
    id: 'app_006',
    name: 'Saraswati Institute of Polytechnic',
    code: '1-692810394',
    city: 'Panipat',
    state: 'Haryana',
    category: 'Extension of Approval 2026–27',
    documents: [
      {
        id: 'doc_06_1',
        name: 'Building Stability Certificate',
        category: 'Campus Safety',
        tier: 4,
        issuer: 'State PWD Executive Engineer',
        checkMethod: 'System Image Analysis',
        baseStatus: 'flagged',
        flagReason: 'PWD seal stamp is faint and layout has slight variance. Officer must review physical copy or confirm with PWD.'
      },
      {
        id: 'doc_06_2',
        name: 'State Board Affiliation Letter',
        category: 'Affiliation',
        tier: 2,
        issuer: 'Haryana State Board of Technical Education (HSBTE)',
        checkMethod: 'HSBTE State Examination Portal API',
        baseStatus: 'verified'
      },
      {
        id: 'doc_06_3',
        name: 'Fire Safety NOC',
        category: 'Safety Clearance',
        tier: 2,
        issuer: 'Haryana Fire Services Directorate',
        checkMethod: 'Haryana Fire Service Portal Lookup',
        baseStatus: 'verified'
      }
    ]
  },
  {
    id: 'app_002',
    name: 'Modern Management Institute',
    code: '1-592019483',
    city: 'New Delhi',
    state: 'Delhi NCR',
    category: 'Increase in Intake (MBA)',
    documents: [
      {
        id: 'doc_02_1',
        name: 'Campus Land Title Deed',
        category: 'Land & Infrastructure',
        tier: 4,
        issuer: 'Delhi Revenue Department',
        checkMethod: 'Collusion Radar Cross-Check',
        baseStatus: 'flagged',
        flagReason: 'Collusion Alert: Survey coordinates for Plot 402/1 match Apex Institute of Technology.'
      },
      {
        id: 'doc_02_2',
        name: 'University Affiliation Order',
        category: 'Affiliation',
        tier: 1,
        issuer: 'Guru Gobind Singh Indraprastha University (GGSIPU)',
        checkMethod: 'GGSIPU Registrar Digital Signature (X.509)',
        baseStatus: 'verified'
      },
      {
        id: 'doc_02_3',
        name: 'Delhi Fire Service Safety NOC',
        category: 'Safety Clearance',
        tier: 2,
        issuer: 'Delhi Fire Service Directorate',
        checkMethod: 'Delhi Fire Portal API Gateway',
        baseStatus: 'verified'
      }
    ]
  },
  {
    id: 'app_003',
    name: 'Indian Institute of Technology, Delhi',
    code: 'IITD-001',
    city: 'New Delhi',
    state: 'Delhi',
    category: 'New Course Approval (Quantum Tech)',
    documents: [
      {
        id: 'doc_03_1',
        name: 'Senate & Board of Governors Resolution',
        category: 'Statutory Approval',
        tier: 1,
        issuer: 'Director, IIT Delhi',
        checkMethod: 'Director Digital Signature Token (X.509)',
        baseStatus: 'verified'
      },
      {
        id: 'doc_03_2',
        name: 'Laboratory Equipment & High-Performance Facilities',
        category: 'Infrastructure',
        tier: 1,
        issuer: 'Dean (Academics), IIT Delhi',
        checkMethod: 'Dean Digital Signature Token',
        baseStatus: 'verified'
      },
      {
        id: 'doc_03_3',
        name: 'Faculty Qualifications & Degrees',
        category: 'Faculty Qualifications',
        tier: 2,
        issuer: 'National Academic Depository (NAD)',
        checkMethod: 'DigiLocker NAD Database API',
        baseStatus: 'verified'
      }
    ]
  }
];

function DocumentValidationContent() {
  const searchParams = useSearchParams();
  const urlAppId = searchParams.get('app');
  const { t } = useTranslation();

  const [colleges] = useState<CollegeDossier[]>(initialColleges);
  const [selectedCollegeId, setSelectedCollegeId] = useState<string>(urlAppId || 'app_001');

  // Real-time synchronization hook
  const { notices, verifications } = usePortalSync();

  // Manual verification modal / remarks state
  const [manualVerifyDoc, setManualVerifyDoc] = useState<BaseDocumentItem | null>(null);
  const [manualNote, setManualNote] = useState('');

  // Send Notice Modal State
  const [noticeModalDoc, setNoticeModalDoc] = useState<BaseDocumentItem | null>(null);
  const [noticeSubject, setNoticeSubject] = useState('');
  const [noticeInstructions, setNoticeInstructions] = useState('');
  const [noticeDeadline, setNoticeDeadline] = useState('15-Nov-2026');
  const [noticeSeverity, setNoticeSeverity] = useState<'warning' | 'critical'>('warning');

  // Success Alert Toast
  const [successToast, setSuccessToast] = useState<{ message: string; isNotice?: boolean } | null>(null);

  // Document Viewer Modal State
  const [selectedDocToView, setSelectedDocToView] = useState<ViewableDocument | null>(null);

  // Cross-Document Comparison & Discrepancy Analyzer State
  const [compareModalOpen, setCompareModalOpen] = useState(false);

  // Scrutiny Report Export Modal State
  const [reportModalOpen, setReportModalOpen] = useState(false);

  // 12-Step Demo Walkthrough Modal State
  const [walkthroughModalOpen, setWalkthroughModalOpen] = useState(false);

  // Sync with URL parameter if present
  useEffect(() => {
    if (urlAppId && colleges.some(c => c.id === urlAppId)) {
      setSelectedCollegeId(urlAppId);
    }
  }, [urlAppId, colleges]);

  const selectedCollege = colleges.find(c => c.id === selectedCollegeId) || colleges[0];

  // Calculate dynamic live documents based on shared real-time sync state
  const liveDocuments = useMemo(() => {
    return selectedCollege.documents.map(doc => {
      // 1. Check if manually verified
      const manualVerif = verifications.find(v =>
        matchesCollege(v.collegeId, selectedCollege.id) && matchesDoc(v.docName, doc.name)
      );

      if (manualVerif) {
        return {
          ...doc,
          computedStatus: 'verified' as const,
          verifiedNote: manualVerif.officerNote,
          isManual: true,
          activeNotice: undefined,
          rectificationNotice: undefined
        };
      }

      // 2. Check for active or resolved notices
      const matchingNotice = notices.find(n =>
        matchesCollege(n.collegeId, selectedCollege.id) && matchesDoc(n.docName, doc.name)
      );

      if (matchingNotice) {
        if (matchingNotice.status === 'pending') {
          return {
            ...doc,
            computedStatus: 'notice_sent' as const,
            isManual: false,
            verifiedNote: undefined,
            activeNotice: matchingNotice,
            rectificationNotice: undefined
          };
        } else if (matchingNotice.status === 'resolved' && matchingNotice.resolvedFile) {
          return {
            ...doc,
            computedStatus: 'college_rectified' as const,
            isManual: false,
            verifiedNote: undefined,
            rectificationNotice: matchingNotice,
            activeNotice: undefined
          };
        }
      }

      // 3. Fallback to base status
      return {
        ...doc,
        computedStatus: doc.baseStatus,
        isManual: false,
        verifiedNote: undefined,
        activeNotice: undefined,
        rectificationNotice: undefined
      };
    });
  }, [selectedCollege, notices, verifications]);

  // Open Notice Modal pre-filled
  const handleOpenNoticeModal = (doc: BaseDocumentItem) => {
    setNoticeModalDoc(doc);
    setNoticeSubject(`Clarification Required: ${doc.name}`);
    setNoticeInstructions(doc.flagReason || `Please upload a certified copy of ${doc.name} with official endorsement.`);
    setNoticeDeadline('15-Nov-2026');
    setNoticeSeverity(doc.tier === 4 ? 'critical' : 'warning');
  };

  // Dispatch Notice to College Portal
  const handleSendNotice = (e: React.FormEvent) => {
    e.preventDefault();
    if (!noticeModalDoc) return;

    const notice = sendNoticeToCollege({
      collegeId: selectedCollege.id,
      collegeCode: selectedCollege.code,
      docName: noticeModalDoc.name,
      subject: noticeSubject,
      instructions: noticeInstructions,
      deadline: noticeDeadline,
      severity: noticeSeverity
    });

    setNoticeModalDoc(null);
    setSuccessToast({
      message: `Notice sent to ${selectedCollege.name}! The college can now see this in their portal under "Actions Needed". Notice ID: ${notice.id}`,
      isNotice: true
    });
  };

  // Perform Manual Verification
  const handleConfirmManualVerify = (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualVerifyDoc) return;

    const officerNote = manualNote.trim() || 'Verified manually by Dr. Rajesh Kumar (AICTE Scrutiny Officer) - physical/digital copy inspected and authenticated.';
    verifyDocumentManually(selectedCollege.id, manualVerifyDoc.name, officerNote);

    setManualVerifyDoc(null);
    setManualNote('');
    setSuccessToast({
      message: `"${manualVerifyDoc.name}" has been marked as Verified Manually by Dr. Rajesh Kumar. This is updated in real time in the Institution Portal too!`,
      isNotice: false
    });
  };

  const flaggedCount = liveDocuments.filter(d => d.computedStatus === 'flagged').length;
  const verifiedCount = liveDocuments.filter(d => d.computedStatus === 'verified').length;
  const noticesSentCount = liveDocuments.filter(d => d.computedStatus === 'notice_sent').length;
  const rectifiedCount = liveDocuments.filter(d => d.computedStatus === 'college_rectified').length;

  return (
    <div className="page-container" style={{ maxWidth: 1280, margin: '0 auto', padding: '24px 32px' }}>
      {/* 1. Header */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingBottom: 20,
        marginBottom: 20,
        borderBottom: '1px solid #e2e8f0',
        flexWrap: 'wrap',
        gap: 16
      }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
            <h1 style={{ fontSize: '1.45rem', fontWeight: 800, color: '#0f2942', margin: 0 }}>
              {t('docReviewTitle')}
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
              Real-Time Sync Active
            </span>
          </div>
          <p style={{ fontSize: '0.82rem', color: '#64748b', margin: 0 }}>
            {t('docReviewSubtitle')}
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
          <button
            type="button"
            onClick={() => setWalkthroughModalOpen(true)}
            className="btn btn-secondary"
            style={{ fontSize: '0.78rem', padding: '8px 14px', gap: 6, background: '#fffbeb', border: '1px solid #fde68a', color: '#92400e' }}
            title="Open 12-step recommended demonstration walkthrough"
          >
            <CheckCircle2 size={14} style={{ color: '#d97706' }} />
            <span>{t('demoGuideBtn')}</span>
          </button>

          <button
            type="button"
            onClick={() => setReportModalOpen(true)}
            className="btn btn-secondary"
            style={{ fontSize: '0.78rem', padding: '8px 14px', gap: 6 }}
            title="Export official AICTE Scrutiny Evaluation Report (PDF)"
          >
            <Printer size={14} style={{ color: '#0284c7' }} />
            <span>{t('exportScrutinyReport')}</span>
          </button>

          <button
            type="button"
            onClick={() => setCompareModalOpen(true)}
            className="btn btn-primary"
            style={{ fontSize: '0.78rem', padding: '8px 14px', gap: 6 }}
          >
            <GitCompare size={14} />
            <span>{t('crossDocExtractor')}</span>
          </button>

          <ResetDemoButton
            variant="button"
            label={t('resetFlagsBtn')}
            onResetComplete={() => {
              setSuccessToast({
                message: 'Demo state has been restored to initial baseline. All flags and original notices are reset.',
                isNotice: false
              });
              setTimeout(() => setSuccessToast(null), 5000);
            }}
          />

          <Link
            href="/institution"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
              padding: '8px 14px',
              borderRadius: 5,
              background: '#f8fafc',
              border: '1px solid #cbd5e1',
              color: '#0f2942',
              fontSize: '0.78rem',
              fontWeight: 600,
              textDecoration: 'none'
            }}
          >
            <Building2 size={14} style={{ color: '#0284c7' }} />
            <span>Switch to College Portal View</span>
            <ExternalLink size={12} style={{ opacity: 0.6 }} />
          </Link>
        </div>
      </div>

      {/* Success Banner */}
      {successToast && (
        <div style={{
          padding: '14px 18px',
          borderRadius: 6,
          background: '#ecfdf5',
          border: '1px solid #a7f3d0',
          color: '#065f46',
          fontSize: '0.8rem',
          fontWeight: 600,
          marginBottom: 20,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 12
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <CheckCircle2 size={18} style={{ color: '#059669', flexShrink: 0 }} />
            <span>{successToast.message}</span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            {successToast.isNotice && (
              <Link
                href="/institution"
                style={{
                  fontSize: '0.74rem',
                  fontWeight: 700,
                  color: '#065f46',
                  textDecoration: 'underline'
                }}
              >
                View Notice in College Portal ↗
              </Link>
            )}
            <button
              onClick={() => setSuccessToast(null)}
              style={{ background: 'none', border: 'none', color: '#065f46', fontWeight: 800, cursor: 'pointer' }}
            >
              ✕
            </button>
          </div>
        </div>
      )}

      {/* 2. Select College Dropdown Bar */}
      <div style={{
        background: '#ffffff',
        border: '1px solid #e2e8f0',
        borderRadius: 8,
        padding: '16px 20px',
        marginBottom: 24,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: 16,
        boxShadow: '0 1px 2px rgba(0,0,0,0.02)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, flex: 1, minWidth: 300 }}>
          <label style={{ fontSize: '0.82rem', fontWeight: 700, color: '#0f2942', whiteSpace: 'nowrap' }}>
            Select College to Review:
          </label>
          <select
            value={selectedCollegeId}
            onChange={e => setSelectedCollegeId(e.target.value)}
            style={{
              flex: 1,
              maxWidth: 420,
              padding: '8px 12px',
              borderRadius: 6,
              border: '1px solid #cbd5e1',
              fontSize: '0.82rem',
              fontWeight: 600,
              color: '#0f2942',
              background: '#f8fafc',
              outline: 'none'
            }}
          >
            {colleges.map(c => {
              return (
                <option key={c.id} value={c.id}>
                  {c.name} ({c.code})
                </option>
              );
            })}
          </select>
        </div>

        {/* Selected College Quick Health Indicator */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: '0.74rem' }}>
          <span style={{
            background: '#ecfdf5',
            color: '#065f46',
            border: '1px solid #a7f3d0',
            padding: '4px 10px',
            borderRadius: 4,
            fontWeight: 700
          }}>
            {verifiedCount} Verified
          </span>

          {rectifiedCount > 0 && (
            <span style={{
              background: '#eff6ff',
              color: '#1e40af',
              border: '1px solid #bfdbfe',
              padding: '4px 10px',
              borderRadius: 4,
              fontWeight: 700
            }}>
              {rectifiedCount} College Rectified
            </span>
          )}

          {flaggedCount > 0 && (
            <span style={{
              background: '#fffbeb',
              color: '#92400e',
              border: '1px solid #fde68a',
              padding: '4px 10px',
              borderRadius: 4,
              fontWeight: 700
            }}>
              {flaggedCount} Flagged
            </span>
          )}

          {noticesSentCount > 0 && (
            <span style={{
              background: '#f5f3ff',
              color: '#6d28d9',
              border: '1px solid #ddd6fe',
              padding: '4px 10px',
              borderRadius: 4,
              fontWeight: 700
            }}>
              {noticesSentCount} Notice Sent
            </span>
          )}
        </div>
      </div>

      {/* 3. Selected College Info Banner */}
      <div style={{
        background: '#f8fafc',
        border: '1px solid #cbd5e1',
        borderRadius: 8,
        padding: '16px 20px',
        marginBottom: 24,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: 12
      }}>
        <div>
          <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0f2942' }}>
            {selectedCollege.name}
          </div>
          <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: 2 }}>
            AICTE Code: <strong>{selectedCollege.code}</strong> • {selectedCollege.city}, {selectedCollege.state} • {selectedCollege.category}
          </div>
        </div>

        <div style={{ display: 'flex', gap: 10 }}>
          <Link
            href="/collusion"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
              padding: '6px 12px',
              borderRadius: 5,
              background: '#ffffff',
              border: '1px solid #cbd5e1',
              color: '#92400e',
              fontSize: '0.74rem',
              fontWeight: 700,
              textDecoration: 'none'
            }}
          >
            <AlertTriangle size={13} style={{ color: '#d97706' }} />
            <span>Check Collusion Radar</span>
          </Link>

          <Link
            href="/applications"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
              padding: '6px 12px',
              borderRadius: 5,
              background: '#ffffff',
              border: '1px solid #cbd5e1',
              color: '#0f2942',
              fontSize: '0.74rem',
              fontWeight: 600,
              textDecoration: 'none'
            }}
          >
            <span>Back to Applications</span>
          </Link>
        </div>
      </div>

      {/* 4. Document List with Flags, Manual Verify, and Send Notice */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        {liveDocuments.map(doc => {
          const isVerified = doc.computedStatus === 'verified';
          const isFlagged = doc.computedStatus === 'flagged';
          const isNoticeSent = doc.computedStatus === 'notice_sent';
          const isRectified = doc.computedStatus === 'college_rectified';

          return (
            <div
              key={doc.id}
              style={{
                background: '#ffffff',
                border: '1px solid #e2e8f0',
                borderLeft: isFlagged
                  ? '5px solid #d97706'
                  : isNoticeSent
                  ? '5px solid #7c3aed'
                  : isRectified
                  ? '5px solid #2563eb'
                  : '5px solid #059669',
                borderRadius: 8,
                padding: '20px 24px',
                boxShadow: '0 1px 3px rgba(0,0,0,0.02)'
              }}
            >
              {/* Top row: Name, Trust Badge, Status Badge */}
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12, marginBottom: 8 }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
                    <FileText size={18} style={{ color: '#0f2942' }} />
                    <span style={{ fontSize: '0.96rem', fontWeight: 800, color: '#0f2942' }}>
                      {doc.name}
                    </span>
                    <ProvenanceBadge tier={doc.tier} />
                  </div>
                  <div style={{ fontSize: '0.72rem', color: '#64748b' }}>
                    Category: <strong>{doc.category}</strong> • Issuing Authority: {doc.issuer}
                  </div>
                </div>

                {/* Status Badge */}
                <div>
                  {isVerified && (
                    <span style={{
                      background: '#ecfdf5',
                      color: '#065f46',
                      border: '1px solid #a7f3d0',
                      fontSize: '0.72rem',
                      fontWeight: 700,
                      padding: '3px 10px',
                      borderRadius: 4,
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: 4
                    }}>
                      <CheckCircle2 size={12} /> {doc.isManual ? '✓ Manually Verified by Officer' : 'Verified Valid'}
                    </span>
                  )}

                  {isFlagged && (
                    <span style={{
                      background: '#fffbeb',
                      color: '#92400e',
                      border: '1px solid #fde68a',
                      fontSize: '0.72rem',
                      fontWeight: 700,
                      padding: '3px 10px',
                      borderRadius: 4,
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: 4
                    }}>
                      <AlertTriangle size={12} /> Flagged for Review
                    </span>
                  )}

                  {isNoticeSent && (
                    <span style={{
                      background: '#f5f3ff',
                      color: '#6d28d9',
                      border: '1px solid #ddd6fe',
                      fontSize: '0.72rem',
                      fontWeight: 700,
                      padding: '3px 10px',
                      borderRadius: 4,
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: 4
                    }}>
                      <Send size={12} /> Notice Sent to College
                    </span>
                  )}

                  {isRectified && (
                    <span style={{
                      background: '#eff6ff',
                      color: '#1e40af',
                      border: '1px solid #bfdbfe',
                      fontSize: '0.72rem',
                      fontWeight: 700,
                      padding: '3px 10px',
                      borderRadius: 4,
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: 4
                    }}>
                      <RefreshCw size={12} /> College Uploaded Rectification
                    </span>
                  )}
                </div>
              </div>

              {/* Check Details */}
              <div style={{ fontSize: '0.72rem', color: '#475569', marginBottom: 12 }}>
                <strong>Verification Method:</strong> {doc.checkMethod}
                {doc.verifiedNote && (
                  <span style={{ marginLeft: 10, color: '#059669', fontWeight: 600 }}>
                    ({doc.verifiedNote})
                  </span>
                )}
              </div>

              {/* THE FLAG BOX (If Flagged) - Clear, Simple English */}
              {isFlagged && doc.flagReason && (
                <div style={{
                  background: '#fffbeb',
                  border: '1px solid #fde68a',
                  borderRadius: 6,
                  padding: '12px 16px',
                  marginBottom: 14
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#92400e', fontWeight: 800, fontSize: '0.78rem', marginBottom: 4 }}>
                    <AlertCircle size={15} />
                    <span>Issue Spotted by System:</span>
                  </div>
                  <div style={{ fontSize: '0.76rem', color: '#78350f', lineHeight: 1.4 }}>
                    {doc.flagReason}
                  </div>
                </div>
              )}

              {/* Notice Sent Box (If notice was dispatched) */}
              {isNoticeSent && doc.activeNotice && (
                <div style={{
                  background: '#f5f3ff',
                  border: '1px solid #ddd6fe',
                  borderRadius: 6,
                  padding: '12px 16px',
                  marginBottom: 14
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#6d28d9', fontWeight: 800, fontSize: '0.78rem' }}>
                      <Send size={14} />
                      <span>Active Notice Sent to College ({doc.activeNotice.id})</span>
                    </div>
                    <span style={{ fontSize: '0.7rem', color: '#7c3aed', fontWeight: 600 }}>
                      Deadline: {doc.activeNotice.deadline}
                    </span>
                  </div>
                  <div style={{ fontSize: '0.74rem', color: '#4c1d95', lineHeight: 1.4, marginBottom: 6 }}>
                    <strong>Subject:</strong> {doc.activeNotice.subject}
                    <br />
                    <strong>Instructions:</strong> {doc.activeNotice.instructions}
                  </div>
                  <div style={{ fontSize: '0.7rem', color: '#5b21b6' }}>
                    ✓ This notice is live in the college&apos;s portal under their &quot;Actions Needed&quot; tab.
                  </div>
                </div>
              )}

              {/* College Rectification Submitted Box */}
              {isRectified && doc.rectificationNotice && (
                <div style={{
                  background: '#eff6ff',
                  border: '1px solid #bfdbfe',
                  borderRadius: 6,
                  padding: '12px 16px',
                  marginBottom: 14
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#1e40af', fontWeight: 800, fontSize: '0.78rem' }}>
                      <CheckCircle2 size={14} />
                      <span>College Submitted Rectification File for Notice {doc.rectificationNotice.id}</span>
                    </div>
                    <span style={{ fontSize: '0.7rem', color: '#1e40af', fontWeight: 600 }}>
                      Uploaded: {doc.rectificationNotice.resolvedAt}
                    </span>
                  </div>
                  <div style={{ fontSize: '0.74rem', color: '#1e3a8a', lineHeight: 1.4, marginBottom: 4 }}>
                    <strong>Rectified File:</strong> {doc.rectificationNotice.resolvedFile}
                    <br />
                    <strong>College Explanation:</strong> {doc.rectificationNotice.resolvedNote}
                  </div>
                  <div style={{ fontSize: '0.7rem', color: '#1e40af', fontWeight: 600 }}>
                    Please review the replacement file and mark as verified if satisfactory.
                  </div>
                </div>
              )}

              {/* ACTION BUTTONS: Verify Manually & Send Notice */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'flex-end',
                gap: 10,
                paddingTop: 12,
                borderTop: '1px solid #f1f5f9'
              }}>
                {/* View Document (PDF) Button */}
                <button
                  type="button"
                  onClick={() => setSelectedDocToView({
                    name: doc.name,
                    category: doc.category,
                    tier: doc.tier,
                    issuer: doc.issuer,
                    statusLabel: doc.computedStatus,
                    flagReason: doc.flagReason
                  })}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 6,
                    padding: '7px 14px',
                    borderRadius: 5,
                    background: '#f8fafc',
                    border: '1px solid #cbd5e1',
                    color: '#0f2942',
                    fontSize: '0.76rem',
                    fontWeight: 600,
                    cursor: 'pointer'
                  }}
                >
                  <Eye size={14} style={{ color: '#0284c7' }} />
                  <span>View Document (PDF)</span>
                </button>

                {/* Verify Manually Button */}
                {!isVerified && (
                  <button
                    type="button"
                    onClick={() => {
                      setManualVerifyDoc(doc);
                      setManualNote('');
                    }}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: 6,
                      padding: '7px 14px',
                      borderRadius: 5,
                      background: '#f0fdf4',
                      border: '1px solid #86efac',
                      color: '#166534',
                      fontSize: '0.76rem',
                      fontWeight: 700,
                      cursor: 'pointer'
                    }}
                  >
                    <Check size={14} />
                    <span>Verify Manually</span>
                  </button>
                )}

                {/* Send Notice to College Button */}
                <button
                  type="button"
                  onClick={() => handleOpenNoticeModal(doc)}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 6,
                    padding: '7px 16px',
                    borderRadius: 5,
                    background: isNoticeSent ? '#f5f3ff' : '#0f2942',
                    border: isNoticeSent ? '1px solid #c4b5fd' : 'none',
                    color: isNoticeSent ? '#6d28d9' : '#ffffff',
                    fontSize: '0.76rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    boxShadow: isNoticeSent ? 'none' : '0 2px 4px rgba(15, 41, 66, 0.15)'
                  }}
                >
                  <Send size={13} />
                  <span>{isNoticeSent ? 'Send Follow-up Notice' : 'Send Notice to College'}</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* 5. MODAL 1: Send Notice to College */}
      {noticeModalDoc && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(15, 23, 42, 0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 9999,
          padding: 16
        }}>
          <div style={{
            background: '#ffffff',
            borderRadius: 8,
            maxWidth: 540,
            width: '100%',
            padding: '24px 28px',
            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <Send size={18} style={{ color: '#0f2942' }} />
                <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#0f2942', margin: 0 }}>
                  Send Official Notice to College
                </h3>
              </div>
              <button
                onClick={() => setNoticeModalDoc(null)}
                style={{ background: 'none', border: 'none', color: '#64748b', cursor: 'pointer', padding: 4 }}
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSendNotice}>
              <div style={{ fontSize: '0.76rem', color: '#64748b', marginBottom: 16, background: '#f8fafc', padding: '10px 14px', borderRadius: 6, border: '1px solid #e2e8f0' }}>
                <div><strong>College:</strong> {selectedCollege.name} ({selectedCollege.code})</div>
                <div style={{ marginTop: 2 }}><strong>Document:</strong> {noticeModalDoc.name}</div>
              </div>

              {/* Subject */}
              <div style={{ marginBottom: 14 }}>
                <label style={{ display: 'block', fontSize: '0.74rem', fontWeight: 700, color: '#334155', marginBottom: 4 }}>
                  Notice Title / Subject:
                </label>
                <input
                  type="text"
                  required
                  value={noticeSubject}
                  onChange={e => setNoticeSubject(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    borderRadius: 5,
                    border: '1px solid #cbd5e1',
                    fontSize: '0.78rem',
                    outline: 'none'
                  }}
                />
              </div>

              {/* Instructions / Message */}
              <div style={{ marginBottom: 14 }}>
                <label style={{ display: 'block', fontSize: '0.74rem', fontWeight: 700, color: '#334155', marginBottom: 4 }}>
                  Deficiency Details & Instructions for College:
                </label>
                <textarea
                  rows={4}
                  required
                  value={noticeInstructions}
                  onChange={e => setNoticeInstructions(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    borderRadius: 5,
                    border: '1px solid #cbd5e1',
                    fontSize: '0.76rem',
                    outline: 'none',
                    fontFamily: 'inherit'
                  }}
                />
              </div>

              {/* Deadline & Urgency */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 20 }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.74rem', fontWeight: 700, color: '#334155', marginBottom: 4 }}>
                    Response Deadline:
                  </label>
                  <input
                    type="text"
                    value={noticeDeadline}
                    onChange={e => setNoticeDeadline(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '8px 12px',
                      borderRadius: 5,
                      border: '1px solid #cbd5e1',
                      fontSize: '0.78rem',
                      outline: 'none'
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.74rem', fontWeight: 700, color: '#334155', marginBottom: 4 }}>
                    Notice Urgency:
                  </label>
                  <select
                    value={noticeSeverity}
                    onChange={e => setNoticeSeverity(e.target.value as 'warning' | 'critical')}
                    style={{
                      width: '100%',
                      padding: '8px 12px',
                      borderRadius: 5,
                      border: '1px solid #cbd5e1',
                      fontSize: '0.78rem',
                      outline: 'none',
                      background: '#ffffff'
                    }}
                  >
                    <option value="warning">Warning (Standard 7-Day)</option>
                    <option value="critical">Critical (Immediate Response)</option>
                  </select>
                </div>
              </div>

              <div style={{
                background: '#eff6ff',
                border: '1px solid #bfdbfe',
                borderRadius: 5,
                padding: '8px 12px',
                fontSize: '0.7rem',
                color: '#1e40af',
                marginBottom: 20
              }}>
                ℹ <strong>Direct Portal Sync:</strong> Once sent, this notice will instantly appear on the college portal under their <strong>&quot;Actions Needed&quot;</strong> dashboard, where they can upload the rectified file.
              </div>

              {/* Actions */}
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10 }}>
                <button
                  type="button"
                  onClick={() => setNoticeModalDoc(null)}
                  style={{
                    padding: '8px 16px',
                    borderRadius: 5,
                    border: '1px solid #cbd5e1',
                    background: '#ffffff',
                    color: '#475569',
                    fontSize: '0.76rem',
                    fontWeight: 600,
                    cursor: 'pointer'
                  }}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  style={{
                    padding: '8px 18px',
                    borderRadius: 5,
                    border: 'none',
                    background: '#0f2942',
                    color: '#ffffff',
                    fontSize: '0.76rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 6
                  }}
                >
                  <Send size={13} />
                  <span>Send Notice to College Portal</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 6. MODAL 2: Verify Manually */}
      {manualVerifyDoc && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(15, 23, 42, 0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 9999,
          padding: 16
        }}>
          <div style={{
            background: '#ffffff',
            borderRadius: 8,
            maxWidth: 480,
            width: '100%',
            padding: '24px 28px',
            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <CheckCircle2 size={18} style={{ color: '#059669' }} />
                <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#0f2942', margin: 0 }}>
                  Mark Document as Verified Manually
                </h3>
              </div>
              <button
                onClick={() => setManualVerifyDoc(null)}
                style={{ background: 'none', border: 'none', color: '#64748b', cursor: 'pointer', padding: 4 }}
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleConfirmManualVerify}>
              <div style={{ fontSize: '0.76rem', color: '#475569', marginBottom: 14, background: '#f0fdf4', padding: '10px 14px', borderRadius: 6, border: '1px solid #bbf7d0' }}>
                <div><strong>Document:</strong> {manualVerifyDoc.name}</div>
                <div style={{ marginTop: 2 }}><strong>College:</strong> {selectedCollege.name}</div>
              </div>

              <div style={{ marginBottom: 16 }}>
                <label style={{ display: 'block', fontSize: '0.74rem', fontWeight: 700, color: '#334155', marginBottom: 4 }}>
                  Officer Verification Remark / Justification:
                </label>
                <textarea
                  rows={3}
                  value={manualNote}
                  onChange={e => setManualNote(e.target.value)}
                  placeholder="e.g. Inspected original document copy with registrar stamp. Verified authentic."
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    borderRadius: 5,
                    border: '1px solid #cbd5e1',
                    fontSize: '0.76rem',
                    outline: 'none',
                    fontFamily: 'inherit'
                  }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10 }}>
                <button
                  type="button"
                  onClick={() => setManualVerifyDoc(null)}
                  style={{
                    padding: '8px 16px',
                    borderRadius: 5,
                    border: '1px solid #cbd5e1',
                    background: '#ffffff',
                    color: '#475569',
                    fontSize: '0.76rem',
                    fontWeight: 600,
                    cursor: 'pointer'
                  }}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  style={{
                    padding: '8px 18px',
                    borderRadius: 5,
                    border: 'none',
                    background: '#059669',
                    color: '#ffffff',
                    fontSize: '0.76rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 6
                  }}
                >
                  <Check size={14} />
                  <span>Confirm Manual Verification</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Real Document Viewer Modal */}
      {selectedDocToView && (
        <DocumentViewerModal
          document={selectedDocToView}
          onClose={() => setSelectedDocToView(null)}
        />
      )}

      {/* Cross-Document Discrepancy & Provenance Analyzer Modal */}
      <CrossDocumentComparisonModal
        isOpen={compareModalOpen}
        onClose={() => setCompareModalOpen(false)}
      />

      {/* Official Scrutiny Evaluation Report Export Modal */}
      <ScrutinyReportExportModal
        isOpen={reportModalOpen}
        onClose={() => setReportModalOpen(false)}
        collegeName={selectedCollege.name}
        collegeCode={selectedCollege.code}
      />

      {/* 12-Step Recommended Demo Walkthrough Modal */}
      <DemoWalkthroughModal
        isOpen={walkthroughModalOpen}
        onClose={() => setWalkthroughModalOpen(false)}
        onOpenReportExport={() => setReportModalOpen(true)}
        onOpenCrossDoc={() => setCompareModalOpen(true)}
      />
    </div>
  );
}

export default function DocumentValidationPage() {
  return (
    <Suspense fallback={<div className="page-container" style={{ padding: 40, textAlign: 'center' }}>Loading Document Review...</div>}>
      <DocumentValidationContent />
    </Suspense>
  );
}
