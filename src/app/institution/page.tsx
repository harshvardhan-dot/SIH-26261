'use client';

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Building2, FileText, CheckCircle, AlertTriangle, Clock,
  Upload, ArrowRight, ShieldCheck, FileCheck, RefreshCw,
  Info, ChevronRight, Download, Send, Globe, LogOut,
  AlertCircle, Calendar, Check, X, Eye, Shield, HelpCircle,
  ExternalLink, Layers, Scale, Sparkles, MapPin, Plus, Radio, BookOpen
} from 'lucide-react';
import LanguageSwitcher from '@/components/LanguageSwitcher';
import { useTranslation } from '@/lib/i18n';
import ProvenanceBadge from '@/components/ProvenanceBadge';
import DocumentViewerModal, { ViewableDocument } from '@/components/DocumentViewerModal';
import FileUploadDropzone from '@/components/FileUploadDropzone';
import ResetDemoButton from '@/components/ResetDemoButton';
import DemoWalkthroughModal from '@/components/DemoWalkthroughModal';
import {
  usePortalSync,
  resolveNoticeByCollege,
  saveUserDoc,
  matchesCollege,
  matchesDoc,
  PortalNotice,
  ManualVerification
} from '@/lib/portalSync';

interface ApplicationAction {
  id: string;
  severity: 'critical' | 'warning' | 'info';
  deadline: string;
  title: string;
  description: string;
  docTarget?: string;
  status: 'pending' | 'submitted' | 'resolved';
}

interface ApplicationDoc {
  id: string;
  name: string;
  issuer: string;
  size: string;
  category: string;
  tier: 1 | 2 | 3 | 4;
  authorityMatch: string;
  status: 'verified' | 'action_required' | 'under_scan' | 'expired_notice';
  statusLabel: string;
  actionNote?: string;
}

interface ActiveApplication {
  id: string;
  title: string;
  category: string;
  academicYear: string;
  submittedDate: string;
  regionalOffice: string;
  status: 'action_required' | 'under_scrutiny' | 'hearing_scheduled' | 'approved_provisional';
  statusLabel: string;
  currentStage: number; // 1 to 5
  stageName: string;
  readinessScore: number;
  actions: ApplicationAction[];
  documents: ApplicationDoc[];
}

const mockActiveApplications: ActiveApplication[] = [
  {
    id: 'AICTE/AB/2026-27/EOA-102938475',
    title: 'Extension of Approval (EoA) 2026-27 — Existing Technical Programs',
    category: 'Extension of Approval (EoA)',
    academicYear: 'AY 2026-27',
    submittedDate: '12-Oct-2026',
    regionalOffice: 'Northern Regional Office (Kanpur)',
    status: 'action_required',
    statusLabel: 'Action Required — 2 Directives Pending',
    currentStage: 3,
    stageName: 'Scrutiny Sub-Committee Evaluation',
    readinessScore: 82,
    actions: [
      {
        id: 'ACT-01',
        severity: 'warning',
        deadline: '15-Nov-2026',
        title: 'Fire Safety NOC Renewal Undertaking Required',
        description: 'Fire Safety NOC issued by State Fire Services Directorate expires in 18 days. Under APH 2024-27 Clause 4.6, upload the renewal application acknowledgment receipt and fire safety compliance undertaking.',
        docTarget: 'Fire_Safety_NOC_StateDirectorate.pdf',
        status: 'pending'
      },
      {
        id: 'ACT-02',
        severity: 'critical',
        deadline: '10-Nov-2026',
        title: 'Faculty Cadre Proportion Compliance Affidavit',
        description: 'Cadre ratio analysis detected a shortfall of 1 Professor in Computer Science Dept for 1:20 cadre norm (APH Appendix 7). Upload Selection Committee meeting minutes or institutional undertaking of scheduled interviews.',
        docTarget: 'Faculty_Aadhaar_Form16_AuditedList.pdf',
        status: 'pending'
      }
    ],
    documents: [
      {
        id: 'doc-001',
        name: 'Land_Title_Khasra_Deed_Registered.pdf',
        issuer: 'Sub-Registrar Office, Greater Noida',
        size: '4.2 MB',
        category: 'Land & Campus Infrastructure',
        tier: 2,
        authorityMatch: 'DigiLocker / State Revenue Gateway',
        status: 'verified',
        statusLabel: '✓ Verified Valid'
      },
      {
        id: 'doc-002',
        name: 'Fire_Safety_NOC_StateDirectorate.pdf',
        issuer: 'State Fire Services Directorate (UP)',
        size: '1.8 MB',
        category: 'Statutory Safety Clearance',
        tier: 2,
        authorityMatch: 'State Fire Services Portal',
        status: 'action_required',
        statusLabel: '⚠ Action Required: Expiry Imminent',
        actionNote: 'Expires on 11-Nov-2026 (18 days remaining as of 24-Oct-2026); renewal receipt required'
      },
      {
        id: 'doc-003',
        name: 'AKTU_Affiliation_Extension_2025_26.pdf',
        issuer: 'Controller of Examinations, AKTU',
        size: '2.1 MB',
        category: 'University Affiliation NOC',
        tier: 1,
        authorityMatch: 'AKTU Examination Database API',
        status: 'verified',
        statusLabel: '✓ Verified Valid (DSC Authenticated)'
      },
      {
        id: 'doc-004',
        name: 'Faculty_Aadhaar_Form16_AuditedList.pdf',
        issuer: 'Chartered Accountant Endorsement & Principal DSC',
        size: '5.8 MB',
        category: 'Faculty Roster & Cadre Norms',
        tier: 3,
        authorityMatch: 'Income Tax Linked & AICTE Council Archive',
        status: 'action_required',
        statusLabel: '✗ Clarification Pending',
        actionNote: 'Shortfall of 1 Professor in CS Dept'
      }
    ]
  },
  {
    id: 'AICTE/AB/2026-27/NEW-882019482',
    title: 'Introduction of New Course: B.Tech in Artificial Intelligence & Machine Learning (60 Intake)',
    category: 'New Course (Emerging Area)',
    academicYear: 'AY 2026-27',
    submittedDate: '18-Oct-2026',
    regionalOffice: 'Northern Regional Office (Kanpur)',
    status: 'under_scrutiny',
    statusLabel: 'Under Scrutiny Committee Review',
    currentStage: 2,
    stageName: 'Automated AI Pre-Scrutiny & Cadastral Verification',
    readinessScore: 94,
    actions: [
      {
        id: 'ACT-03',
        severity: 'info',
        deadline: '25-Nov-2026',
        title: 'Inspection Fee Remittance Acknowledgment',
        description: 'Application successfully cleared automated cadastral and curriculum compliance checks. Expert Visit Committee (EVC) inspection date will be notified via SMS and portal alert.',
        status: 'resolved'
      }
    ],
    documents: [
      {
        id: 'doc-005',
        name: 'AI_ML_Curriculum_AKTU_Senate_Approval.pdf',
        issuer: 'Academic Council & Board of Studies, AKTU',
        size: '3.4 MB',
        category: 'Curriculum & Syllabus',
        tier: 1,
        authorityMatch: 'Digital Signature (X.509) by University Registrar',
        status: 'verified',
        statusLabel: '✓ Verified Valid'
      },
      {
        id: 'doc-006',
        name: 'GPU_Computing_Lab_Infrastructure_Deed.pdf',
        issuer: 'GeM Procurement Division & Vendor Audit',
        size: '6.2 MB',
        category: 'Emerging Area Lab Infrastructure',
        tier: 2,
        authorityMatch: 'GeM Portal Electronic Invoice Match',
        status: 'verified',
        statusLabel: '✓ Hardware Invoices Matched'
      },
      {
        id: 'doc-007',
        name: 'Faculty_Phd_Specialization_Roster.pdf',
        issuer: 'Dean of Academics & Research Endorsement',
        size: '2.8 MB',
        category: 'Specialized Faculty Qualifications',
        tier: 2,
        authorityMatch: 'UGC NAD Doctoral Repository',
        status: 'verified',
        statusLabel: '✓ Qualifications Authenticated'
      },
      {
        id: 'doc-008',
        name: 'Trust_Resolution_Capital_Commitment.pdf',
        issuer: 'Governing Body, Apex Educational Trust',
        size: '1.4 MB',
        category: 'Financial Capital Allocation',
        tier: 3,
        authorityMatch: 'AICTE Trust Permanent Registry',
        status: 'verified',
        statusLabel: '✓ Council Archive Matched'
      }
    ]
  },
  {
    id: 'AICTE/AB/2026-27/INTAKE-49102938',
    title: 'Increase in Approved Intake: B.Tech Computer Science & Engineering (120 to 180 Seats)',
    category: 'Increase in Intake',
    academicYear: 'AY 2026-27',
    submittedDate: '05-Oct-2026',
    regionalOffice: 'Northern Regional Office (Kanpur)',
    status: 'hearing_scheduled',
    statusLabel: 'Scrutiny Committee Hearing Scheduled',
    currentStage: 4,
    stageName: 'Standing Hearing Committee (Virtual NIC WebEx)',
    readinessScore: 88,
    actions: [
      {
        id: 'ACT-04',
        severity: 'warning',
        deadline: '28-Oct-2026 (11:30 AM)',
        title: 'Standing Scrutiny Virtual Hearing Attendance',
        description: 'Virtual hearing before AICTE Scrutiny Committee scheduled for 28-Oct-2026 at 11:30 AM via NIC WebEx. Principal and Head of Department must join with institutional DSC token.',
        status: 'pending'
      }
    ],
    documents: [
      {
        id: 'doc-009',
        name: 'NBA_Accreditation_Certificate_Tier1.pdf',
        issuer: 'National Board of Accreditation (NBA)',
        size: '2.2 MB',
        category: 'Accreditation Quality Norm',
        tier: 1,
        authorityMatch: 'NBA Master Database & QR Cryptographic Token',
        status: 'verified',
        statusLabel: '✓ NBA Accreditation Verified'
      },
      {
        id: 'doc-010',
        name: 'Classroom_Carpet_Area_PWD_Plan.pdf',
        issuer: 'Executive Engineer, State PWD Building Division',
        size: '7.1 MB',
        category: 'Instructional Area Requirement',
        tier: 4,
        authorityMatch: 'Automated OCR & Layout Cadastral Map',
        status: 'verified',
        statusLabel: '✓ Instructional Norms Satisfied'
      },
      {
        id: 'doc-011',
        name: 'Audited_Balance_Sheet_3Years_CA.pdf',
        issuer: 'S.K. Singhal & Co., Chartered Accountants',
        size: '8.4 MB',
        category: 'Financial Health & Reserves',
        tier: 1,
        authorityMatch: 'ICAI UDIN Gateway (UDIN: 25084920BKAL8941)',
        status: 'verified',
        statusLabel: '✓ ICAI UDIN Authenticated'
      },
      {
        id: 'doc-012',
        name: 'AKTU_No_Objection_Intake_Hike.pdf',
        issuer: 'Registrar, Dr. APJ Abdul Kalam Technical University',
        size: '1.9 MB',
        category: 'Affiliating University NOC',
        tier: 2,
        authorityMatch: 'AKTU Affiliation Portal Verified',
        status: 'verified',
        statusLabel: '✓ University NOC Verified'
      }
    ]
  },
  {
    id: 'AICTE/AB/2026-27/SITE-20193817',
    title: 'Demarcation of Additional Technical Campus Land (2.85 Acres Adjacent Expansion)',
    category: 'Change in Site / Land Demarcation',
    academicYear: 'AY 2026-27',
    submittedDate: '22-Sep-2026',
    regionalOffice: 'Northern Regional Office (Kanpur)',
    status: 'action_required',
    statusLabel: 'Deficiency Notice Issued — Cadastral Rectification',
    currentStage: 3,
    stageName: 'Cadastral & Spatial Inspection (Survey of India)',
    readinessScore: 68,
    actions: [
      {
        id: 'ACT-05',
        severity: 'critical',
        deadline: '02-Nov-2026',
        title: 'Certified Contiguity Map from Revenue SDM Required',
        description: 'Revenue record scan identified potential boundary bifurcation on Khasra plot #142/B. Upload non-encumbrance certificate and contiguous plot map endorsed by Sub-Divisional Magistrate (SDM) Dadri.',
        docTarget: 'Khasra_Map_Contiguity_Dispute.pdf',
        status: 'pending'
      }
    ],
    documents: [
      {
        id: 'doc-013',
        name: 'Revenue_Record_Khatauni_SDM.pdf',
        issuer: 'Revenue Department, Gautam Buddha Nagar',
        size: '4.6 MB',
        category: 'Land Title & Ownership',
        tier: 2,
        authorityMatch: 'UP Bhulekh Land Record Portal',
        status: 'verified',
        statusLabel: '✓ Bhulekh Matched'
      },
      {
        id: 'doc-014',
        name: 'Khasra_Map_Contiguity_Dispute.pdf',
        issuer: 'Tehsil Dadri Revenue Inspector',
        size: '3.1 MB',
        category: 'Campus Contiguity & Boundary',
        tier: 4,
        authorityMatch: 'Automated Heuristic Spatial Plot Check',
        status: 'action_required',
        statusLabel: '✗ Deficiency Notice Issued',
        actionNote: 'Contiguity endorsement required from SDM'
      },
      {
        id: 'doc-015',
        name: 'Town_Planning_Land_Use_NOC.pdf',
        issuer: 'Greater Noida Industrial Development Authority (GNIDA)',
        size: '2.4 MB',
        category: 'Land Use Conversion (Master Plan)',
        tier: 2,
        authorityMatch: 'GNIDA Institutional Land Portal',
        status: 'verified',
        statusLabel: '✓ Land Use Approved'
      }
    ]
  }
];

export default function InstitutionPortalPage() {
  const router = useRouter();
  const { t } = useTranslation();
  
  // Real-time synchronization with AICTE Scrutiny Committee Portal
  const { notices, verifications, userDocs } = usePortalSync();
  const [selectedAppId, setSelectedAppId] = useState<string>('AICTE/AB/2026-27/EOA-102938475');
  const [statusFilter, setStatusFilter] = useState<'all' | 'action_required' | 'under_scrutiny' | 'hearing_scheduled'>('all');
  
  // Action Resolution Modal State
  const [actionModalOpen, setActionModalOpen] = useState(false);
  const [activeActionItem, setActiveActionItem] = useState<ApplicationAction | null>(null);
  const [clarificationFile, setClarificationFile] = useState<string>('');
  const [referenceNumber, setReferenceNumber] = useState<string>('');
  const [explanationNote, setExplanationNote] = useState<string>('');
  const [submittingClarification, setSubmittingClarification] = useState(false);
  const [successToast, setSuccessToast] = useState<string | null>(null);

  // Document Viewer Modal State
  const [selectedDocToView, setSelectedDocToView] = useState<ViewableDocument | null>(null);

  // Upload New Document Modal State
  const [addDocModalOpen, setAddDocModalOpen] = useState(false);
  const [newDocTitle, setNewDocTitle] = useState('');
  const [newDocCategory, setNewDocCategory] = useState('Land & Campus Infrastructure');
  const [newDocIssuer, setNewDocIssuer] = useState('State Government Authority');
  const [newDocFile, setNewDocFile] = useState<{ name: string; url?: string; size: string } | null>(null);
  const [userUploadedDocs, setUserUploadedDocs] = useState<ApplicationDoc[]>([]);

  // Keep userUploadedDocs in sync with shared demo state
  useEffect(() => {
    if (userDocs) {
      setUserUploadedDocs(userDocs);
    }
  }, [userDocs]);

  // Pre-Scrutiny Date Detection Simulator Modal
  const [preScrutinySimModalOpen, setPreScrutinySimModalOpen] = useState(false);
  const [simDocType, setSimDocType] = useState<'expired' | 'valid'>('expired');
  const [simScanning, setSimScanning] = useState(false);

  // Self Scrutiny
  const [analyzing, setAnalyzing] = useState(false);

  // 12-Step Demo Walkthrough Modal State
  const [walkthroughModalOpen, setWalkthroughModalOpen] = useState(false);

  // Real-Time Derived Applications based on live committee actions
  const applications: ActiveApplication[] = useMemo(() => {
    return mockActiveApplications.map(app => {
      // Merge in any user-uploaded documents for this application
      const baseDocs = app.id === 'AICTE/AB/2026-27/EOA-102938475'
        ? [...userUploadedDocs, ...app.documents]
        : app.documents;

      // 1. Live status for each document
      const docs = baseDocs.map(doc => {
        // A. Has committee officer manually verified this doc?
        const manualVerif = verifications.find(v =>
          matchesCollege(v.collegeId, app.id) && matchesDoc(v.docName, doc.name)
        );

        if (manualVerif) {
          return {
            ...doc,
            status: 'verified' as const,
            statusLabel: '✓ Verified by Council Officer',
            actionNote: undefined
          };
        }

        // B. Is there an active deficiency notice sent by committee?
        const pendingNotice = notices.find(n =>
          matchesCollege(n.collegeId, app.id) && matchesDoc(n.docName, doc.name) && n.status === 'pending'
        );

        if (pendingNotice) {
          return {
            ...doc,
            status: 'action_required' as const,
            statusLabel: '⚠ Action Required: Notice Sent by AICTE',
            actionNote: pendingNotice.subject
          };
        }

        // C. Has college uploaded a rectification for this doc?
        const resolvedNotice = notices.find(n =>
          matchesCollege(n.collegeId, app.id) && matchesDoc(n.docName, doc.name) && n.status === 'resolved'
        );

        if (resolvedNotice && resolvedNotice.resolvedFile) {
          return {
            ...doc,
            status: 'verified' as const,
            statusLabel: '✓ Rectification Uploaded (Under Review)',
            actionNote: undefined
          };
        }

        return doc;
      });

      // 2. Live Actions Needed
      let actions: ApplicationAction[] = app.actions.map(action => {
        // If target doc was manually verified, action is resolved!
        const isDocManuallyVerified = verifications.some(v =>
          matchesCollege(v.collegeId, app.id) && matchesDoc(v.docName, action.docTarget || '')
        );

        if (isDocManuallyVerified) {
          return {
            ...action,
            status: 'resolved' as const
          };
        }

        // If target doc was resolved by upload
        const isDocResolved = notices.some(n =>
          matchesCollege(n.collegeId, app.id) && matchesDoc(n.docName, action.docTarget || '') && n.status === 'resolved'
        );

        if (isDocResolved) {
          return {
            ...action,
            status: 'submitted' as const
          };
        }

        return action;
      });

      // Also merge any new official notices sent by the committee
      const collegeNotices = notices.filter(n => matchesCollege(n.collegeId, app.id));
      collegeNotices.forEach(notice => {
        const isDocManuallyVerified = verifications.some(v =>
          matchesCollege(v.collegeId, app.id) && matchesDoc(v.docName, notice.docName)
        );

        const existingActionIndex = actions.findIndex(a =>
          a.id === notice.id || (notice.docName && a.docTarget && matchesDoc(notice.docName, a.docTarget))
        );

        const targetStatus: ApplicationAction['status'] = isDocManuallyVerified
          ? 'resolved'
          : notice.status === 'resolved'
          ? 'submitted'
          : 'pending';

        if (existingActionIndex >= 0) {
          actions[existingActionIndex] = {
            ...actions[existingActionIndex],
            id: notice.id,
            title: notice.subject,
            description: notice.instructions,
            deadline: notice.deadline,
            severity: notice.severity,
            status: targetStatus
          };
        } else {
          actions.unshift({
            id: notice.id,
            severity: notice.severity,
            deadline: notice.deadline,
            title: notice.subject,
            description: notice.instructions,
            docTarget: notice.docName,
            status: targetStatus
          });
        }
      });

      // 3. Compute overall application status
      const pendingActions = actions.filter(a => a.status === 'pending');
      const verifiedDocsCount = docs.filter(d => d.status === 'verified').length;

      let appStatus: ActiveApplication['status'] = app.status;
      let appStatusLabel: string = app.statusLabel;

      if (pendingActions.length === 0) {
        if (app.status === 'action_required') {
          appStatus = 'under_scrutiny';
          appStatusLabel = 'Under Scrutiny Committee Review (All Directives Cleared)';
        }
      } else {
        appStatus = 'action_required';
        appStatusLabel = `Action Required — ${pendingActions.length} Directive${pendingActions.length > 1 ? 's' : ''} Pending`;
      }

      return {
        ...app,
        documents: docs,
        actions,
        status: appStatus,
        statusLabel: appStatusLabel,
        readinessScore: Math.min(100, Math.max(app.readinessScore, Math.round((verifiedDocsCount / docs.length) * 100)))
      };
    });
  }, [notices, verifications]);

  const activeApp = applications.find(a => a.id === selectedAppId) || applications[0];

  const filteredApplications = applications.filter(app => {
    if (statusFilter === 'all') return true;
    return app.status === statusFilter;
  });

  const totalActionsCount = applications.reduce((acc, app) => {
    return acc + app.actions.filter(a => a.status === 'pending').length;
  }, 0);

  const runSelfScrutiny = () => {
    setPreScrutinySimModalOpen(true);
  };

  const handleOpenActionModal = (action: ApplicationAction) => {
    setActiveActionItem(action);
    setClarificationFile(action.docTarget ? `Rectified_${action.docTarget.replace(/\s+/g, '_')}` : 'Statutory_Compliance_Affidavit.pdf');
    setReferenceNumber(`UP/REV/2026/${Math.floor(100000 + Math.random() * 900000)}`);
    setExplanationNote('');
    setActionModalOpen(true);
  };

  const handleSubmitClarification = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeActionItem) return;

    setSubmittingClarification(true);

    // Transmit resolution to shared real-time sync module!
    resolveNoticeByCollege(
      activeActionItem.id,
      clarificationFile,
      `${explanationNote} (Ref: ${referenceNumber})`
    );

    setTimeout(() => {
      setSubmittingClarification(false);
      setActionModalOpen(false);
      setSuccessToast(`Clarification successfully submitted for "${activeActionItem.title}". Transmitted in real time to the Council Scrutiny Committee.`);
      setTimeout(() => setSuccessToast(null), 5000);
    }, 800);
  };

  const handleAddNewDocument = (e: React.FormEvent) => {
    e.preventDefault();
    const fileName = newDocFile?.name || (newDocTitle ? `${newDocTitle.replace(/\s+/g, '_')}.pdf` : 'Statutory_Compliance_Doc.pdf');
    const newDoc: ApplicationDoc = {
      id: `doc-user-${Date.now()}`,
      name: fileName,
      issuer: newDocIssuer || 'State Statutory Authority',
      size: newDocFile?.size || '2.8 MB',
      category: newDocCategory,
      tier: 2,
      authorityMatch: 'State Official Gateway / Electronic Repository',
      status: 'verified',
      statusLabel: '✓ Uploaded & Pre-Scrutiny Cleared'
    };

    saveUserDoc(newDoc);
    setUserUploadedDocs(prev => [newDoc, ...prev]);
    setAddDocModalOpen(false);
    setNewDocTitle('');
    setNewDocFile(null);
    setSuccessToast(`Document "${fileName}" successfully uploaded and registered in application dossier.`);
    setTimeout(() => setSuccessToast(null), 5000);
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: '#f8fafc',
      color: '#0f172a',
      display: 'flex',
      flexDirection: 'column'
    }}>
      {/* Indian National Tricolor Header Accent */}
      <div style={{
        height: '4px',
        width: '100%',
        background: 'linear-gradient(90deg, #FF9933 0%, #FF9933 33.3%, #000080 33.3%, #000080 33.7%, #ffffff 33.7%, #ffffff 66.3%, #138808 66.3%, #138808 100%)'
      }} />

      {/* Institutional Top Navbar */}
      <header style={{
        background: '#ffffff',
        borderBottom: '1px solid #e2e8f0',
        padding: '12px 32px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        boxShadow: '0 1px 2px rgba(0,0,0,0.02)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <div style={{
            width: 40,
            height: 40,
            borderRadius: 6,
            background: '#0f2942',
            color: '#ffffff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: 800
          }}>
            <Building2 size={22} />
          </div>
          <div>
            <div style={{ fontSize: '0.95rem', fontWeight: 700, color: '#0f172a', display: 'flex', alignItems: 'center', gap: 8 }}>
              Apex Institute of Technology & Management
              <span className="badge badge-info" style={{ fontSize: '0.68rem', padding: '2px 8px' }}>
                AICTE PID: 1-102938475
              </span>
              <span style={{ fontSize: '0.68rem', padding: '2px 8px', borderRadius: 4, background: '#f8fafc', color: '#0f2942', fontWeight: 700, border: '1px solid #cbd5e1', display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                <span>📅</span>
                <span>24-Oct-2026</span>
              </span>
            </div>
            <div style={{ fontSize: '0.75rem', color: '#64748b' }}>
              Affiliated to Dr. APJ Abdul Kalam Technical University (AKTU) • Northern Regional Office (Kanpur)
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
          <button
            type="button"
            onClick={() => setWalkthroughModalOpen(true)}
            className="btn btn-secondary btn-sm"
            style={{ fontSize: '0.74rem', gap: 6, background: '#fffbeb', border: '1px solid #fde68a', color: '#92400e' }}
            title="Open 12-step recommended demonstration walkthrough"
          >
            <CheckCircle size={13} style={{ color: '#d97706' }} />
            <span>{t('demoGuideBtn')}</span>
          </button>
          <LanguageSwitcher compact />
          <ResetDemoButton variant="topbar" label={t('resetDemo')} />
          <Link href="/institution/submit" className="btn btn-primary btn-sm">
            <Plus size={14} /> {t('newAppBtn')}
          </Link>
          <Link href="/dashboard" className="btn btn-secondary btn-sm" title="View Council Scrutiny Portal">
            <Shield size={14} /> {t('officerView')}
          </Link>
          <Link href="/login" className="btn btn-secondary btn-sm" title="Sign out">
            <LogOut size={14} />
          </Link>
        </div>
      </header>

      {/* Toast Notification */}
      {successToast && (
        <div style={{
          position: 'fixed',
          top: 24,
          right: 24,
          zIndex: 1000,
          background: '#065f46',
          color: '#ffffff',
          padding: '12px 20px',
          borderRadius: 6,
          boxShadow: 'var(--shadow-lg)',
          display: 'flex',
          alignItems: 'center',
          gap: 10,
          fontSize: '0.85rem',
          fontWeight: 600,
          animation: 'fade-in 0.2s ease'
        }}>
          <CheckCircle size={18} />
          {successToast}
        </div>
      )}

      {/* Main Container */}
      <main style={{ flex: 1, padding: '28px 28px', maxWidth: 1440, margin: '0 auto', width: '100%' }}>
        
        {/* Missing-Document Warning & Mandatory Checklist Banner (Step 5 Demonstration) */}
        <div style={{
          background: '#fffbeb',
          border: '1px solid #fde68a',
          borderRadius: 8,
          padding: '12px 18px',
          marginBottom: 20,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 16
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{
              width: 32,
              height: 32,
              borderRadius: '50%',
              background: '#fef3c7',
              color: '#d97706',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0
            }}>
              <AlertTriangle size={18} />
            </div>
            <div>
              <div style={{ fontSize: '0.82rem', fontWeight: 700, color: '#92400e', display: 'flex', alignItems: 'center', gap: 8 }}>
                {t('missingDocWarningTitle')} (APH Chapter II, Clause 2.1)
                <span className="badge badge-warning" style={{ fontSize: '0.65rem' }}>Missing Certificate Flagged</span>
              </div>
              <div style={{ fontSize: '0.74rem', color: '#78350f', marginTop: 2 }}>
                <strong>State PWD Structural Safety Certificate:</strong> {t('missingDocWarningDesc')}
              </div>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setAddDocModalOpen(true)}
            className="btn btn-secondary btn-sm"
            style={{ fontSize: '0.74rem', whiteSpace: 'nowrap', gap: 6, background: '#ffffff', borderColor: '#fde68a', color: '#92400e' }}
          >
            <Upload size={13} /> {t('uploadDocBtn')}
          </button>
        </div>

        {/* KPI Banner with Active Application Stats */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: 14,
          marginBottom: 24
        }}>
          <div className="card" style={{ padding: '16px 20px', background: '#ffffff', borderLeft: '4px solid #1e40af' }}>
            <div style={{ fontSize: '0.75rem', fontWeight: 600, color: '#64748b', textTransform: 'uppercase' }}>
              Active Applications
            </div>
            <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#0f2942', marginTop: 4 }}>
              {applications.length} <span style={{ fontSize: '0.85rem', fontWeight: 500, color: '#64748b' }}>in AY 2026-27</span>
            </div>
            <div style={{ fontSize: '0.72rem', color: '#15803d', marginTop: 2 }}>
              ✓ All applications synchronized with NIC
            </div>
          </div>

          <div className="card" style={{ padding: '16px 20px', background: '#ffffff', borderLeft: `4px solid ${totalActionsCount > 0 ? '#b91c1c' : '#15803d'}` }}>
            <div style={{ fontSize: '0.75rem', fontWeight: 600, color: '#64748b', textTransform: 'uppercase' }}>
              Actions Needed by Institution
            </div>
            <div style={{ fontSize: '1.8rem', fontWeight: 800, color: totalActionsCount > 0 ? '#b91c1c' : '#15803d', marginTop: 4 }}>
              {totalActionsCount} <span style={{ fontSize: '0.85rem', fontWeight: 500, color: '#64748b' }}>pending compliance{totalActionsCount !== 1 ? 's' : ''}</span>
            </div>
            <div style={{ fontSize: '0.72rem', color: totalActionsCount > 0 ? '#b91c1c' : '#15803d', marginTop: 2 }}>
              {totalActionsCount > 0 ? '⚠ Requires urgent response before hearing' : '✓ No outstanding directives'}
            </div>
          </div>

          <div className="card" style={{ padding: '16px 20px', background: '#ffffff', borderLeft: '4px solid #7c3aed' }}>
            <div style={{ fontSize: '0.75rem', fontWeight: 600, color: '#64748b', textTransform: 'uppercase' }}>
              Upcoming Hearings
            </div>
            <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#6b21a8', marginTop: 4 }}>
              1 <span style={{ fontSize: '0.85rem', fontWeight: 500, color: '#64748b' }}>Scheduled</span>
            </div>
            <div style={{ fontSize: '0.72rem', color: '#6b21a8', marginTop: 2 }}>
              Virtual NIC WebEx on 28-Oct-2026
            </div>
          </div>

          <div className="card" style={{ padding: '16px 20px', background: '#ffffff', borderLeft: '4px solid #0284c7' }}>
            <div style={{ fontSize: '0.75rem', fontWeight: 600, color: '#64748b', textTransform: 'uppercase' }}>
              Documents Verified
            </div>
            <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#0369a1', marginTop: 4 }}>
              13 / 16 <span style={{ fontSize: '0.85rem', fontWeight: 500, color: '#64748b' }}>across files</span>
            </div>
            <div style={{ fontSize: '0.72rem', color: '#0284c7', marginTop: 2 }}>
              81% cryptographic & source match
            </div>
          </div>
        </div>

        {/* SECTION 1: Active Applications Switcher & Selector */}
        <div className="card" style={{ marginBottom: 28, padding: '20px 24px', background: '#ffffff' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 14, marginBottom: 16 }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <Layers size={18} style={{ color: '#1e40af' }} />
                <h2 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#0f2942', margin: 0 }}>
                  Active Institutional Applications (AY 2026-27)
                </h2>
              </div>
              <p style={{ fontSize: '0.8rem', color: '#64748b', marginTop: 2 }}>
                Select an active application to view real-time scrutiny status, review required institution actions, and manage document verifications.
              </p>
            </div>

            {/* Filter Pills */}
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
              {(['all', 'action_required', 'under_scrutiny', 'hearing_scheduled'] as const).map((filterKey) => (
                <button
                  key={filterKey}
                  className={`btn btn-sm ${statusFilter === filterKey ? 'btn-primary' : 'btn-secondary'}`}
                  onClick={() => setStatusFilter(filterKey)}
                  style={{ textTransform: 'capitalize', fontSize: '0.75rem', padding: '5px 12px' }}
                >
                  {filterKey === 'all' ? `All Applications (${applications.length})` :
                   filterKey === 'action_required' ? `Actions Needed (${applications.filter(a => a.status === 'action_required').length})` :
                   filterKey === 'under_scrutiny' ? `Under Scrutiny (${applications.filter(a => a.status === 'under_scrutiny').length})` :
                   `Hearing Scheduled (${applications.filter(a => a.status === 'hearing_scheduled').length})`}
                </button>
              ))}
            </div>
          </div>

          {/* Applications Grid Cards */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(310px, 1fr))',
            gap: 14
          }}>
            {filteredApplications.map((app) => {
              const isSelected = app.id === selectedAppId;
              const pendingActions = app.actions.filter(a => a.status === 'pending');
              const verifiedDocs = app.documents.filter(d => d.status === 'verified').length;

              return (
                <div
                  key={app.id}
                  onClick={() => setSelectedAppId(app.id)}
                  style={{
                    cursor: 'pointer',
                    padding: '16px 18px',
                    borderRadius: 8,
                    background: isSelected ? '#f8fafc' : '#ffffff',
                    border: isSelected ? '2px solid #1e40af' : '1px solid #e2e8f0',
                    boxShadow: isSelected ? '0 4px 12px rgba(30, 64, 175, 0.08)' : '0 1px 2px rgba(0,0,0,0.02)',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    transition: 'all 0.15s ease'
                  }}
                >
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                      <span className="chip" style={{ fontSize: '0.7rem', padding: '2px 8px' }}>
                        {app.category}
                      </span>
                      <span style={{ fontSize: '0.72rem', color: '#64748b', fontFamily: 'monospace' }}>
                        {app.id.split('/').pop()}
                      </span>
                    </div>

                    <h3 style={{ fontSize: '0.92rem', fontWeight: 700, color: '#0f172a', marginBottom: 8, lineHeight: 1.4 }}>
                      {app.title}
                    </h3>

                    {/* Status Badge */}
                    <div style={{ marginBottom: 10 }}>
                      <span className={`badge ${
                        app.status === 'action_required' ? 'badge-warning' :
                        app.status === 'hearing_scheduled' ? 'badge-info' : 'badge-neutral'
                      }`} style={{ fontSize: '0.72rem', padding: '3px 8px', display: 'inline-flex', alignItems: 'center', gap: 5 }}>
                        <span style={{
                          width: 6,
                          height: 6,
                          borderRadius: '50%',
                          background: app.status === 'action_required' ? '#b45309' : app.status === 'hearing_scheduled' ? '#7c3aed' : '#0284c7'
                        }} />
                        {app.statusLabel}
                      </span>
                    </div>
                  </div>

                  {/* Card Footer: Actions count and Documents progress */}
                  <div style={{
                    borderTop: '1px solid #e2e8f0',
                    paddingTop: 10,
                    marginTop: 8,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    fontSize: '0.72rem'
                  }}>
                    <div>
                      {pendingActions.length > 0 ? (
                        <span style={{ color: '#b91c1c', fontWeight: 700, display: 'flex', alignItems: 'center', gap: 4 }}>
                          <AlertTriangle size={13} /> {pendingActions.length} Action{pendingActions.length !== 1 ? 's' : ''} Needed
                        </span>
                      ) : (
                        <span style={{ color: '#15803d', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 4 }}>
                          <CheckCircle size={13} /> All Actions Cleared
                        </span>
                      )}
                    </div>

                    <div style={{ color: '#64748b' }}>
                      Docs: <strong>{verifiedDocs}/{app.documents.length}</strong> Verified
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* SECTION 2: Selected Application Workspace Details */}
        <div className="card" style={{
          marginBottom: 28,
          background: '#ffffff',
          borderTop: '4px solid #1e40af',
          padding: 24
        }}>
          {/* Header of Selected Application */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 16, marginBottom: 20 }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
                <span className="badge badge-info">{activeApp.academicYear}</span>
                <span className="badge badge-neutral">{activeApp.category}</span>
                <span style={{ fontSize: '0.75rem', color: '#64748b', fontFamily: 'monospace' }}>
                  Ref: {activeApp.id}
                </span>
              </div>
              <h2 style={{ fontSize: '1.3rem', fontWeight: 800, color: '#0f2942', marginBottom: 4 }}>
                {activeApp.title}
              </h2>
              <div style={{ fontSize: '0.78rem', color: '#64748b', display: 'flex', gap: 16, flexWrap: 'wrap' }}>
                <span><strong>Filing Date:</strong> {activeApp.submittedDate}</span>
                <span><strong>Jurisdiction:</strong> {activeApp.regionalOffice}</span>
                <span><strong>Current Stage:</strong> <strong style={{ color: '#1e40af' }}>{activeApp.stageName}</strong></span>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '1.8rem', fontWeight: 800, color: activeApp.readinessScore >= 80 ? '#15803d' : '#b45309', lineHeight: 1 }}>
                  {activeApp.readinessScore}%
                </div>
                <div style={{ fontSize: '0.7rem', color: '#64748b' }}>Pre-Scrutiny Readiness</div>
              </div>
              <button
                className="btn btn-secondary btn-sm"
                onClick={() => setPreScrutinySimModalOpen(true)}
                style={{ fontSize: '0.74rem', gap: 6, background: '#eff6ff', border: '1px solid #93c5fd', color: '#1e40af', fontWeight: 700 }}
                title="Launch Pre-Scrutiny Date Detection Demo"
              >
                <Sparkles size={14} style={{ color: '#d97706' }} />
                Pre-Scrutiny Date Demo
              </button>
              <button
                className="btn btn-secondary btn-sm"
                onClick={runSelfScrutiny}
                disabled={analyzing}
              >
                <RefreshCw size={14} className={analyzing ? 'spinner' : ''} />
                {analyzing ? 'Evaluating...' : 'Re-Run Norms Check'}
              </button>
            </div>
          </div>

          {/* Lifecycle Stepper Tracker */}
          <div style={{
            background: '#f8fafc',
            border: '1px solid #e2e8f0',
            borderRadius: 8,
            padding: '16px 20px',
            marginBottom: 24
          }}>
            <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#1e40af', textTransform: 'uppercase', marginBottom: 12 }}>
              Statutory Approval Workflow Progress:
            </div>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(5, 1fr)',
              gap: 8
            }}>
              {[
                { step: 1, label: '1. Online Application (Ch I/II)' },
                { step: 2, label: '2. Scrutiny Committee (Cl 2.23.1)' },
                { step: 3, label: '3. Expert Visit (EVC / Virtual)' },
                { step: 4, label: '4. Standing Hearing / Appellate' },
                { step: 5, label: '5. Council EoA / Approval' },
              ].map(s => {
                const isCurrent = activeApp.currentStage === s.step;
                const isPast = activeApp.currentStage > s.step;
                return (
                  <div key={s.step} style={{ textAlign: 'center' }}>
                    <div style={{
                      height: 4,
                      background: isPast ? '#15803d' : isCurrent ? '#1e40af' : '#cbd5e1',
                      borderRadius: 2,
                      marginBottom: 8
                    }} />
                    <div style={{
                      fontSize: '0.72rem',
                      fontWeight: isCurrent ? 800 : isPast ? 600 : 500,
                      color: isCurrent ? '#1e40af' : isPast ? '#15803d' : '#64748b'
                    }}>
                      {s.label}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Interactive Pre-Scrutiny Date Detection Demonstration Panel */}
          <div style={{
            background: '#ffffff',
            border: '1.5px solid #bfdbfe',
            borderRadius: 8,
            padding: '16px 20px',
            marginBottom: 24,
            boxShadow: '0 1px 3px rgba(0,0,0,0.03)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12, flexWrap: 'wrap', gap: 8 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <Sparkles size={18} style={{ color: '#d97706' }} />
                <div>
                  <div style={{ fontSize: '0.9rem', fontWeight: 800, color: '#0f2942' }}>
                    Interactive Demonstration: AI Pre-Scrutiny Date Expiry Detection
                  </div>
                  <div style={{ fontSize: '0.74rem', color: '#64748b' }}>
                    Test the automated regulatory engine comparing an expired statutory certificate vs an unbroken valid certificate under APH Regulation 3.4.
                  </div>
                </div>
              </div>
              <div style={{ display: 'flex', gap: 8 }}>
                <button
                  type="button"
                  onClick={() => setPreScrutinySimModalOpen(true)}
                  className="btn btn-secondary btn-sm"
                  style={{ fontSize: '0.74rem', background: '#eff6ff', border: '1px solid #93c5fd', color: '#1e40af', fontWeight: 700 }}
                >
                  <Sparkles size={13} style={{ color: '#d97706' }} /> Open Pre-Scrutiny Simulator Modal
                </button>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 12 }}>
              {/* Expired Doc Test Tile */}
              <div style={{
                background: '#fff5f5',
                border: '1.5px solid #fecaca',
                borderRadius: 6,
                padding: '14px 16px'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
                  <span style={{ fontSize: '0.8rem', fontWeight: 800, color: '#b91c1c', display: 'flex', alignItems: 'center', gap: 6 }}>
                    <AlertTriangle size={15} style={{ color: '#dc2626' }} />
                    Demo Doc 1: Date Expired Certificate
                  </span>
                  <span className="badge badge-danger" style={{ fontSize: '0.62rem', padding: '2px 6px' }}>Deficient</span>
                </div>
                <div style={{ fontSize: '0.74rem', fontFamily: 'monospace', color: '#475569', marginBottom: 6 }}>
                  Fire_Safety_NOC_EXPIRED.pdf
                </div>
                <div style={{ fontSize: '0.72rem', color: '#991b1b', marginBottom: 10, lineHeight: 1.45 }}>
                  • Extracted Dates: Issued 15-May-2024 • <strong>Expired 14-May-2025</strong><br />
                  • AI Pre-Scrutiny Check: <strong>LAPSED (500+ Days Overdue)</strong><br />
                  • Violation: APH Regulation 3.4 (Unbroken AY 2026-27 Coverage Mandate)
                </div>
                <div style={{ display: 'flex', gap: 8 }}>
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedDocToView({
                        name: 'Fire_Safety_NOC_EXPIRED.pdf',
                        url: '/docs/Fire_Safety_NOC_EXPIRED.pdf',
                        category: 'Safety & Compliance',
                        tier: 4,
                        issuer: 'Directorate of Fire & Emergency Services, UP',
                        statusLabel: '⚠ Lapsed Certificate (Expired 14-May-2025)',
                        isFlagged: true,
                        flagReason: 'Certificate expired on 14-May-2025. Non-compliant with APH Regulation 3.4.'
                      });
                    }}
                    className="btn btn-secondary btn-sm"
                    style={{ fontSize: '0.7rem', padding: '3px 8px', background: '#ffffff' }}
                  >
                    <Eye size={12} /> View Expired PDF
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setSimDocType('expired');
                      setPreScrutinySimModalOpen(true);
                    }}
                    className="btn btn-secondary btn-sm"
                    style={{ fontSize: '0.7rem', padding: '3px 8px', background: '#fee2e2', border: '1px solid #fca5a5', color: '#991b1b', fontWeight: 600 }}
                  >
                    Test Scan
                  </button>
                </div>
              </div>

              {/* Valid Doc Test Tile */}
              <div style={{
                background: '#f0fdf4',
                border: '1.5px solid #bbf7d0',
                borderRadius: 6,
                padding: '14px 16px'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
                  <span style={{ fontSize: '0.8rem', fontWeight: 800, color: '#15803d', display: 'flex', alignItems: 'center', gap: 6 }}>
                    <CheckCircle size={15} style={{ color: '#16a34a' }} />
                    Demo Doc 2: Correct &amp; Valid Certificate
                  </span>
                  <span className="badge badge-success" style={{ fontSize: '0.62rem', padding: '2px 6px' }}>Compliant</span>
                </div>
                <div style={{ fontSize: '0.74rem', fontFamily: 'monospace', color: '#475569', marginBottom: 6 }}>
                  Fire_Safety_NOC_VALID.pdf
                </div>
                <div style={{ fontSize: '0.72rem', color: '#166534', marginBottom: 10, lineHeight: 1.45 }}>
                  • Extracted Dates: Issued 24-Oct-2026 • <strong>Valid to 30-Jun-2027</strong><br />
                  • AI Pre-Scrutiny Check: <strong>PASSED (Full AY 2026-27 Coverage)</strong><br />
                  • Status: Tier 1 Cryptographic Token Verified &amp; Council Compliant
                </div>
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedDocToView({
                        name: 'Fire_Safety_NOC_VALID.pdf',
                        url: '/docs/Fire_Safety_NOC_VALID.pdf',
                        category: 'Safety & Compliance',
                        tier: 1,
                        issuer: 'Directorate of Fire & Emergency Services, UP',
                        statusLabel: '✓ Valid Certificate (Expires 30-Jun-2027)',
                        isFlagged: false
                      });
                    }}
                    className="btn btn-secondary btn-sm"
                    style={{ fontSize: '0.7rem', padding: '3px 8px', background: '#ffffff' }}
                  >
                    <Eye size={12} /> View Valid PDF
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      resolveNoticeByCollege(
                        'NOT-1029',
                        'Fire_Safety_NOC_VALID.pdf',
                        'Uploaded valid Fire Safety NOC (UP/FS/GBN/2026/NOC-VAL-98421) valid through 30-Jun-2027.'
                      );
                      setSuccessToast('Valid document Fire_Safety_NOC_VALID.pdf applied! Active deficiency cleared and transmitted to Scrutiny Committee.');
                      setTimeout(() => setSuccessToast(null), 5000);
                    }}
                    className="btn btn-sm"
                    style={{ fontSize: '0.7rem', padding: '3px 10px', background: '#15803d', color: '#ffffff', fontWeight: 700 }}
                  >
                    <Check size={12} /> Resolve Deficiency with This Doc
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* SECTION 2A: ACTIONS NEEDED BY THE INSTITUTION */}
          <div style={{ marginBottom: 28 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <AlertTriangle size={18} style={{ color: activeApp.actions.some(a => a.status === 'pending') ? '#b91c1c' : '#15803d' }} />
                <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#0f172a', margin: 0 }}>
                  {t('pendingDeficiencies')}
                </h3>
              </div>
              <span style={{ fontSize: '0.75rem', color: '#64748b' }}>
                {activeApp.actions.filter(a => a.status === 'pending').length} pending item{activeApp.actions.filter(a => a.status === 'pending').length !== 1 ? 's' : ''}
              </span>
            </div>

            {activeApp.actions.length === 0 || activeApp.actions.every(a => a.status !== 'pending') ? (
              <div style={{
                background: '#ecfdf5',
                border: '1px solid #a7f3d0',
                borderRadius: 6,
                padding: '14px 18px',
                display: 'flex',
                alignItems: 'center',
                gap: 12
              }}>
                <CheckCircle size={20} style={{ color: '#047857', flexShrink: 0 }} />
                <div>
                  <strong style={{ color: '#065f46', fontSize: '0.85rem' }}>No Outstanding Actions Needed</strong>
                  <p style={{ fontSize: '0.78rem', color: '#047857', marginTop: 2, margin: 0 }}>
                    All regulatory submissions and clarifications for this application are complete. The application is proceeding under committee review.
                  </p>
                </div>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {activeApp.actions.map(action => {
                  const isPending = action.status === 'pending';
                  const isCritical = action.severity === 'critical';

                  return (
                    <div
                      key={action.id}
                      style={{
                        padding: '14px 18px',
                        borderRadius: 6,
                        background: isPending ? (isCritical ? '#fef2f2' : '#fffbeb') : '#f8fafc',
                        border: `1px solid ${isPending ? (isCritical ? '#fecaca' : '#fde68a') : '#e2e8f0'}`,
                        borderLeft: `4px solid ${isPending ? (isCritical ? '#b91c1c' : '#b45309') : '#15803d'}`,
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'flex-start',
                        flexWrap: 'wrap',
                        gap: 14
                      }}
                    >
                      <div style={{ flex: 1, minWidth: 280 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                          <span className={`badge ${isCritical ? 'badge-danger' : 'badge-warning'}`} style={{ fontSize: '0.68rem' }}>
                            {action.severity.toUpperCase()} DIRECTIVE
                          </span>
                          <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#64748b' }}>
                            Statutory Deadline: <strong style={{ color: '#b91c1c' }}>{action.deadline}</strong>
                          </span>
                          {action.status === 'submitted' && (
                            <span className="badge badge-success" style={{ fontSize: '0.68rem' }}>
                              ✓ Clarification Submitted
                            </span>
                          )}
                        </div>

                        <h4 style={{ fontSize: '0.92rem', fontWeight: 700, color: '#0f172a', marginBottom: 4 }}>
                          {action.title}
                        </h4>
                        <p style={{ fontSize: '0.8rem', color: '#475569', lineHeight: 1.5, margin: 0 }}>
                          {action.description}
                        </p>
                        {action.docTarget && (
                          <div style={{ fontSize: '0.72rem', color: '#1e40af', marginTop: 6, fontFamily: 'monospace' }}>
                            Target Statutory Document: {action.docTarget}
                          </div>
                        )}
                      </div>

                      <div>
                        {isPending ? (
                          <button
                            className="btn btn-primary btn-sm"
                            onClick={() => handleOpenActionModal(action)}
                            style={{ whiteSpace: 'nowrap' }}
                          >
                            <Upload size={13} /> Resolve Action / Upload
                          </button>
                        ) : (
                          <span className="badge badge-success" style={{ padding: '6px 12px' }}>
                            <Check size={13} style={{ marginRight: 4 }} /> Submitted for Verification
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* SECTION 2B: DOCUMENT STATUSES & PROVENANCE BREAKDOWN */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
              <div>
                <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#0f172a', margin: 0 }}>
                  {t('statutoryDocuments')}
                </h3>
                <p style={{ fontSize: '0.75rem', color: '#64748b', marginTop: 2 }}>
                  Documents required under AICTE Approval Process Handbook (APH 2024-27) for this specific application.
                </p>
              </div>
              <button
                className="btn btn-primary btn-sm"
                onClick={() => setAddDocModalOpen(true)}
              >
                <Upload size={13} /> {t('uploadDocBtn')}
              </button>
            </div>

            <div className="table-container">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Document Title & Issuing Authority</th>
                    <th>Mandatory APH Category</th>
                    <th>Evidence Provenance</th>
                    <th>Issuing Authority Match</th>
                    <th>Verification Status</th>
                    <th style={{ textAlign: 'right' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {activeApp.documents.map((doc) => {
                    const isVerified = doc.status === 'verified';
                    const isAction = doc.status === 'action_required';

                    return (
                      <tr key={doc.id}>
                        <td>
                          <div style={{ fontWeight: 700, fontSize: '0.85rem', color: '#0f172a' }}>
                            {doc.name}
                          </div>
                          <div style={{ fontSize: '0.72rem', color: '#64748b' }}>
                            {doc.issuer} • {doc.size}
                          </div>
                        </td>

                        <td>
                          <span className="chip" style={{ fontSize: '0.72rem' }}>{doc.category}</span>
                        </td>

                        <td>
                          <ProvenanceBadge tier={doc.tier} showDetails={true} />
                        </td>

                        <td>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                            <Globe size={13} style={{ color: '#1e40af' }} />
                            <span style={{ fontSize: '0.78rem', color: '#334155', fontWeight: 600 }}>
                              {doc.authorityMatch}
                            </span>
                          </div>
                        </td>

                        <td>
                          <span className={`badge ${isVerified ? 'badge-success' : 'badge-warning'}`} style={{ fontSize: '0.72rem' }}>
                            {doc.statusLabel}
                          </span>
                          {doc.actionNote && (
                            <div style={{ fontSize: '0.7rem', color: '#b91c1c', marginTop: 3 }}>
                              {doc.actionNote}
                            </div>
                          )}
                        </td>

                        <td style={{ textAlign: 'right' }}>
                          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 6 }}>
                            <button
                              className="btn btn-secondary btn-sm"
                              style={{ padding: '4px 8px', fontSize: '0.72rem' }}
                              onClick={() => setSelectedDocToView({
                                name: doc.name,
                                category: doc.category,
                                tier: doc.tier,
                                issuer: doc.issuer,
                                size: doc.size,
                                authorityMatch: doc.authorityMatch,
                                statusLabel: doc.statusLabel,
                                flagReason: doc.actionNote
                              })}
                            >
                              <Eye size={12} /> View PDF
                            </button>
                            {isAction && (
                              <button
                                className="btn btn-primary btn-sm"
                                style={{ padding: '4px 8px', fontSize: '0.72rem' }}
                                onClick={() => {
                                  const matchingAction = activeApp.actions.find(a => a.docTarget === doc.name) || {
                                    id: 'ACT-CUSTOM',
                                    severity: 'warning' as const,
                                    deadline: 'Immediate',
                                    title: `Rectification for ${doc.name}`,
                                    description: `Upload rectified or renewed copy of ${doc.name} to clear scrutiny deficiency.`,
                                    docTarget: doc.name,
                                    status: 'pending' as const
                                  };
                                  handleOpenActionModal(matchingAction);
                                }}
                              >
                                Rectify
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* SECTION 3: Archived Approvals History */}
        <div className="card" style={{ background: '#ffffff' }}>
          <div className="card-header">
            <div>
              <h3 className="card-title">Previous AICTE Approval Orders & Letters (Archived)</h3>
              <p className="card-subtitle">Official letters of extension of approval issued in past academic cycles</p>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 14 }}>
            {[
              { year: '2025-26', status: 'Extension of Approval Granted', ref: 'AICTE/AB/EoA/2025-26/1-102938475', date: '28-Apr-2025' },
              { year: '2024-25', status: 'Extension of Approval Granted', ref: 'AICTE/AB/EoA/2024-25/1-102938475', date: '15-May-2024' },
              { year: '2023-24', status: 'Approved with Intake Expansion', ref: 'AICTE/AB/EoA/2023-24/1-102938475', date: '02-Jun-2023' },
            ].map((app, idx) => (
              <div key={idx} style={{
                padding: '14px 16px',
                borderRadius: 6,
                background: '#f8fafc',
                border: '1px solid #e2e8f0',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between'
              }}>
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                    <span style={{ fontSize: '0.88rem', fontWeight: 700, color: '#0f172a' }}>Academic Year {app.year}</span>
                    <span className="badge badge-success" style={{ fontSize: '0.65rem' }}>Active</span>
                  </div>
                  <div style={{ fontSize: '0.78rem', color: '#15803d', fontWeight: 600 }}>{app.status}</div>
                  <div style={{ fontSize: '0.72rem', color: '#64748b', marginTop: 4, fontFamily: 'monospace' }}>{app.ref}</div>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 12, paddingTop: 8, borderTop: '1px solid #e2e8f0' }}>
                  <span style={{ fontSize: '0.7rem', color: '#94a3b8' }}>Issued: {app.date}</span>
                  <button className="btn btn-secondary btn-sm" style={{ padding: '2px 8px', fontSize: '0.72rem' }}>
                    <Download size={12} /> Download LoA
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* Action Resolution / Clarification Modal */}
      {actionModalOpen && activeActionItem && (
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
          zIndex: 1000,
          padding: 20
        }}>
          <div className="card" style={{ maxWidth: 640, width: '100%', maxHeight: '90vh', overflowY: 'auto', background: '#ffffff', boxShadow: 'var(--shadow-xl)' }}>
            <div className="card-header">
              <div>
                <span className="badge badge-warning" style={{ marginBottom: 6 }}>Institutional Clarification & Compliance Filing</span>
                <h3 className="card-title">{activeActionItem.title}</h3>
                <p className="card-subtitle">Application: {activeApp.id}</p>
              </div>
              <button className="btn btn-secondary btn-sm" onClick={() => setActionModalOpen(false)}>
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleSubmitClarification} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div style={{ background: '#f8fafc', padding: 14, borderRadius: 6, border: '1px solid #e2e8f0', fontSize: '0.8rem', color: '#475569' }}>
                <strong>Statutory Notice:</strong> {activeActionItem.description}
                <div style={{ marginTop: 6, color: '#b91c1c', fontWeight: 600 }}>
                  Mandatory Submission Deadline: {activeActionItem.deadline}
                </div>
              </div>

              <div>
                <FileUploadDropzone
                  defaultFileName={clarificationFile}
                  label="Upload Rectified Statutory Document / Acknowledgment (PDF):"
                  helperText="Select from demo documents above or upload your own rectified certificate from your computer."
                  onFileSelect={(file, meta) => {
                    if (meta) {
                      setClarificationFile(meta.name);
                    }
                  }}
                />
              </div>

              <div>
                <label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#334155', display: 'block', marginBottom: 6 }}>
                  Issuing Authority Dispatch / Reference Number:
                </label>
                <input
                  type="text"
                  className="filter-select"
                  style={{ width: '100%', fontFamily: 'monospace' }}
                  value={referenceNumber}
                  onChange={(e) => setReferenceNumber(e.target.value)}
                  placeholder="e.g. UP/FIRE/NOC/2026/89410"
                  required
                />
              </div>

              <div>
                <label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#334155', display: 'block', marginBottom: 6 }}>
                  Official Institutional Justification & Remarks for Scrutiny Committee:
                </label>
                <textarea
                  className="filter-select"
                  style={{ width: '100%', height: 80, padding: 10, resize: 'none' }}
                  placeholder="State the institutional compliance steps taken, application renewal dates, or temporary undertakings conforming to APH 2024-27..."
                  value={explanationNote}
                  onChange={(e) => setExplanationNote(e.target.value)}
                  required
                />
              </div>

              <div style={{
                background: '#eff6ff',
                border: '1px solid #bfdbfe',
                padding: '10px 14px',
                borderRadius: 6,
                fontSize: '0.75rem',
                color: '#1e40af'
              }}>
                <strong>Verification Guarantee:</strong> Uploaded document will be timestamped and submitted to the Northern Regional Office Scrutiny Committee repository.
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 8 }}>
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setActionModalOpen(false)}
                  disabled={submittingClarification}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={submittingClarification}
                >
                  <Send size={14} />
                  {submittingClarification ? 'Transmitting to AICTE...' : 'Submit Clarification to AICTE Bureau'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Upload New Document Modal */}
      {addDocModalOpen && (
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
          zIndex: 1000,
          padding: 20
        }}>
          <div className="card" style={{ maxWidth: 640, width: '100%', maxHeight: '90vh', overflowY: 'auto', background: '#ffffff', boxShadow: 'var(--shadow-xl)' }}>
            <div className="card-header">
              <div>
                <span className="badge badge-info" style={{ marginBottom: 6 }}>APH 2024-27 Regulatory Compliance</span>
                <h3 className="card-title">Upload New Statutory Document</h3>
                <p className="card-subtitle">Apex Institute of Technology • AY 2026-27 Application</p>
              </div>
              <button className="btn btn-secondary btn-sm" onClick={() => setAddDocModalOpen(false)}>
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleAddNewDocument} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div>
                <label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#334155', display: 'block', marginBottom: 6 }}>
                  Statutory Document Title / Name:
                </label>
                <input
                  type="text"
                  className="filter-select"
                  style={{ width: '100%' }}
                  value={newDocTitle}
                  onChange={(e) => setNewDocTitle(e.target.value)}
                  placeholder="e.g. Building Structural Stability Certificate / State STP NOC"
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div>
                  <label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#334155', display: 'block', marginBottom: 6 }}>
                    Regulatory APH Category:
                  </label>
                  <select
                    className="filter-select"
                    style={{ width: '100%' }}
                    value={newDocCategory}
                    onChange={(e) => setNewDocCategory(e.target.value)}
                  >
                    <option value="Land & Campus Infrastructure">Land & Campus Infrastructure</option>
                    <option value="Statutory Safety Clearance">Statutory Safety Clearance</option>
                    <option value="Faculty Roster & Cadre Norms">Faculty Roster & Cadre Norms</option>
                    <option value="University Affiliation NOC">University Affiliation NOC</option>
                    <option value="Emerging Area Lab Infrastructure">Emerging Area Lab Infrastructure</option>
                    <option value="Financial Health & Reserves">Financial Health & Reserves</option>
                  </select>
                </div>

                <div>
                  <label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#334155', display: 'block', marginBottom: 6 }}>
                    Issuing Authority:
                  </label>
                  <input
                    type="text"
                    className="filter-select"
                    style={{ width: '100%' }}
                    value={newDocIssuer}
                    onChange={(e) => setNewDocIssuer(e.target.value)}
                    placeholder="e.g. State PWD / Fire Directorate / AKTU"
                  />
                </div>
              </div>

              {/* Real File Upload Dropzone */}
              <FileUploadDropzone
                label="Select File or Drop Statutory PDF Document:"
                onFileSelect={(file, meta) => {
                  if (meta) {
                    setNewDocFile(meta);
                    if (!newDocTitle) setNewDocTitle(meta.name);
                  }
                }}
              />

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 8 }}>
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setAddDocModalOpen(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={!newDocFile && !newDocTitle}
                >
                  <Upload size={14} /> Submit & Upload to AICTE Dossier
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* AI Pre-Scrutiny Date Detection Simulator Modal */}
      {preScrutinySimModalOpen && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(15, 23, 42, 0.75)',
          backdropFilter: 'blur(5px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 2000,
          padding: 20
        }}>
          <div style={{
            background: '#ffffff',
            borderRadius: 10,
            maxWidth: 880,
            width: '100%',
            maxHeight: '92vh',
            display: 'flex',
            flexDirection: 'column',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
            overflow: 'hidden',
            border: '1px solid #cbd5e1'
          }}>
            {/* Modal Header */}
            <div style={{
              padding: '16px 24px',
              borderBottom: '1px solid #e2e8f0',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              background: '#0f2942',
              color: '#ffffff'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <Sparkles size={20} style={{ color: '#f59e0b' }} />
                <div>
                  <div style={{ fontSize: '1rem', fontWeight: 800 }}>
                    AI Pre-Scrutiny Engine — Statutory Date Verification Test
                  </div>
                  <div style={{ fontSize: '0.72rem', color: '#94a3b8' }}>
                    Approval Process Handbook (APH 2024–27 Regulation 3.4) Date Validity Simulator
                  </div>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setPreScrutinySimModalOpen(false)}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: '#94a3b8',
                  cursor: 'pointer',
                  padding: 4
                }}
              >
                <X size={20} />
              </button>
            </div>

            {/* Modal Content */}
            <div style={{ padding: '20px 24px', overflowY: 'auto', flex: 1 }}>
              <p style={{ fontSize: '0.82rem', color: '#475569', lineHeight: 1.55, margin: '0 0 16px 0' }}>
                This demonstration tests the Council's automated OCR and regulatory pipeline on two synthetic documents: one with a <strong>lapsed/expired date</strong> and one with <strong>unbroken valid coverage</strong>. Switch between documents below to inspect how the AI detects statutory defects before submission:
              </p>

              {/* Two Document Selector Tabs */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 16 }}>
                {/* Expired Doc Tab */}
                <div
                  onClick={() => {
                    setSimDocType('expired');
                    setSimScanning(true);
                    setTimeout(() => setSimScanning(false), 500);
                  }}
                  style={{
                    padding: '14px 16px',
                    borderRadius: 8,
                    background: simDocType === 'expired' ? '#fef2f2' : '#ffffff',
                    border: `2px solid ${simDocType === 'expired' ? '#ef4444' : '#e2e8f0'}`,
                    cursor: 'pointer',
                    transition: 'all 0.15s ease'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
                    <span style={{ fontSize: '0.84rem', fontWeight: 800, color: '#b91c1c', display: 'flex', alignItems: 'center', gap: 6 }}>
                      <AlertTriangle size={16} style={{ color: '#dc2626' }} />
                      Demo Doc A: Date Expired
                    </span>
                    <span className="badge badge-danger" style={{ fontSize: '0.64rem', padding: '2px 7px' }}>
                      {simDocType === 'expired' ? 'Testing Active' : 'Select'}
                    </span>
                  </div>
                  <div style={{ fontSize: '0.76rem', fontFamily: 'monospace', color: '#1e293b', fontWeight: 600 }}>
                    Fire_Safety_NOC_EXPIRED.pdf
                  </div>
                  <div style={{ fontSize: '0.72rem', color: '#b91c1c', marginTop: 4 }}>
                    Issued: 15-May-2024 • <strong>Expired: 14-May-2025</strong> (Lapsed)
                  </div>
                </div>

                {/* Valid Doc Tab */}
                <div
                  onClick={() => {
                    setSimDocType('valid');
                    setSimScanning(true);
                    setTimeout(() => setSimScanning(false), 500);
                  }}
                  style={{
                    padding: '14px 16px',
                    borderRadius: 8,
                    background: simDocType === 'valid' ? '#f0fdf4' : '#ffffff',
                    border: `2px solid ${simDocType === 'valid' ? '#22c55e' : '#e2e8f0'}`,
                    cursor: 'pointer',
                    transition: 'all 0.15s ease'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
                    <span style={{ fontSize: '0.84rem', fontWeight: 800, color: '#15803d', display: 'flex', alignItems: 'center', gap: 6 }}>
                      <CheckCircle size={16} style={{ color: '#16a34a' }} />
                      Demo Doc B: Valid &amp; Correct
                    </span>
                    <span className="badge badge-success" style={{ fontSize: '0.64rem', padding: '2px 7px' }}>
                      {simDocType === 'valid' ? 'Testing Active' : 'Select'}
                    </span>
                  </div>
                  <div style={{ fontSize: '0.76rem', fontFamily: 'monospace', color: '#1e293b', fontWeight: 600 }}>
                    Fire_Safety_NOC_VALID.pdf
                  </div>
                  <div style={{ fontSize: '0.72rem', color: '#15803d', marginTop: 4 }}>
                    Issued: 10-Oct-2026 • <strong>Valid Thru: 30-Jun-2027</strong> (Compliant)
                  </div>
                </div>
              </div>

              {/* Real-time OCR & Regulatory Pipeline Output Card */}
              {simScanning ? (
                <div style={{
                  background: '#f8fafc',
                  border: '1px solid #cbd5e1',
                  borderRadius: 8,
                  padding: '30px 20px',
                  textAlign: 'center'
                }}>
                  <div className="spinner" style={{ margin: '0 auto 12px', width: 28, height: 28 }} />
                  <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#0f2942' }}>
                    Scanning Document with Multimodal OCR &amp; Temporal Analysis Engine...
                  </div>
                  <div style={{ fontSize: '0.72rem', color: '#64748b', marginTop: 4 }}>
                    Extracting issue stamps, digital seal signatures, and testing cutoff dates against Academic Year 2026-27 norms...
                  </div>
                </div>
              ) : simDocType === 'expired' ? (
                <div style={{
                  background: '#fff5f5',
                  border: '1.5px solid #fca5a5',
                  borderRadius: 8,
                  padding: '18px 20px'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12, flexWrap: 'wrap', gap: 8 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <AlertCircle size={20} style={{ color: '#dc2626' }} />
                      <div>
                        <div style={{ fontSize: '0.9rem', fontWeight: 800, color: '#991b1b' }}>
                          AI PRE-SCRUTINY VERDICT: STATUTORY DEFECT (LAPSED DOCUMENT)
                        </div>
                        <div style={{ fontSize: '0.72rem', color: '#b91c1c' }}>
                          Severity: Critical (Non-Compliant under APH Regulation 3.4 &amp; Appendix 3)
                        </div>
                      </div>
                    </div>
                    <button
                      type="button"
                      className="btn btn-secondary btn-sm"
                      onClick={() => setSelectedDocToView({
                        name: 'Fire_Safety_NOC_EXPIRED.pdf',
                        url: '/docs/Fire_Safety_NOC_EXPIRED.pdf',
                        category: 'Safety & Compliance',
                        tier: 4,
                        issuer: 'Directorate of Fire & Emergency Services, UP',
                        statusLabel: '⚠ Lapsed Certificate (Expired 14-May-2025)',
                        isFlagged: true,
                        flagReason: 'Certificate expired on 14-May-2025. Lacks unbroken statutory coverage for AY 2026-27.'
                      })}
                      style={{ fontSize: '0.72rem', background: '#ffffff', gap: 4 }}
                    >
                      <Eye size={12} /> Inspect Expired PDF
                    </button>
                  </div>

                  <div style={{
                    background: '#ffffff',
                    border: '1px solid #fecaca',
                    borderRadius: 6,
                    padding: '12px 16px',
                    fontSize: '0.76rem',
                    marginBottom: 12
                  }}>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 8, marginBottom: 8 }}>
                      <div>
                        <span style={{ color: '#64748b' }}>Dispatch Ref No:</span> <span style={{ fontFamily: 'monospace', fontWeight: 700 }}>UP/FS/GBN/2024/NOC-EXP-31048</span>
                      </div>
                      <div>
                        <span style={{ color: '#64748b' }}>Date of Issue:</span> <strong>15-May-2024</strong>
                      </div>
                      <div>
                        <span style={{ color: '#64748b' }}>Extracted Expiry Date:</span> <strong style={{ color: '#dc2626' }}>14-May-2025 (528 Days Overdue)</strong>
                      </div>
                      <div>
                        <span style={{ color: '#64748b' }}>AY 2026-27 Requirement:</span> <strong style={{ color: '#dc2626' }}>UNMET (Coverage Lapsed)</strong>
                      </div>
                    </div>
                    <div style={{ borderTop: '1px solid #fee2e2', paddingTop: 8, color: '#7f1d1d' }}>
                      <strong>Statutory Explanation:</strong> AICTE Approval Process Handbook (APH 2024–27 Regulation 3.4) explicitly mandates that an institution must hold continuous, unexpired safety clearance covering the full academic year. Because this certificate expired on 14-May-2025, the application is ineligible for unconditional approval.
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 8 }}>
                    <div style={{ fontSize: '0.75rem', color: '#991b1b', fontWeight: 600 }}>
                      Pre-Scrutiny Score Impact: <strong>68% Readiness (Hearing Directive Required)</strong>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setSimDocType('valid');
                        setSimScanning(true);
                        setTimeout(() => setSimScanning(false), 400);
                      }}
                      className="btn btn-sm"
                      style={{ background: '#15803d', color: '#ffffff', fontSize: '0.74rem', fontWeight: 700, gap: 6 }}
                    >
                      <CheckCircle size={14} /> Test with Valid Document Instead
                    </button>
                  </div>
                </div>
              ) : (
                <div style={{
                  background: '#f0fdf4',
                  border: '1.5px solid #86efac',
                  borderRadius: 8,
                  padding: '18px 20px'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12, flexWrap: 'wrap', gap: 8 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <CheckCircle size={20} style={{ color: '#16a34a' }} />
                      <div>
                        <div style={{ fontSize: '0.9rem', fontWeight: 800, color: '#14532d' }}>
                          AI PRE-SCRUTINY VERDICT: STATUTORY CLEARANCE GRANTED
                        </div>
                        <div style={{ fontSize: '0.72rem', color: '#15803d' }}>
                          Status: Tier 1 Cryptographic Pass (Full Coverage for Academic Year 2026-27)
                        </div>
                      </div>
                    </div>
                    <button
                      type="button"
                      className="btn btn-secondary btn-sm"
                      onClick={() => setSelectedDocToView({
                        name: 'Fire_Safety_NOC_VALID.pdf',
                        url: '/docs/Fire_Safety_NOC_VALID.pdf',
                        category: 'Safety & Compliance',
                        tier: 1,
                        issuer: 'Directorate of Fire & Emergency Services, UP',
                        statusLabel: '✓ Valid Certificate (Expires 30-Jun-2027)',
                        isFlagged: false
                      })}
                      style={{ fontSize: '0.72rem', background: '#ffffff', gap: 4 }}
                    >
                      <Eye size={12} /> Inspect Valid PDF
                    </button>
                  </div>

                  <div style={{
                    background: '#ffffff',
                    border: '1px solid #bbf7d0',
                    borderRadius: 6,
                    padding: '12px 16px',
                    fontSize: '0.76rem',
                    marginBottom: 12
                  }}>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 8, marginBottom: 8 }}>
                      <div>
                        <span style={{ color: '#64748b' }}>Dispatch Ref No:</span> <span style={{ fontFamily: 'monospace', fontWeight: 700 }}>UP/FS/GBN/2026/NOC-VAL-98421</span>
                      </div>
                      <div>
                        <span style={{ color: '#64748b' }}>Date of Issue:</span> <strong>24-Oct-2026</strong>
                      </div>
                      <div>
                        <span style={{ color: '#64748b' }}>Extracted Expiry Date:</span> <strong style={{ color: '#15803d' }}>30-Jun-2027 (Active &amp; Unbroken)</strong>
                      </div>
                      <div>
                        <span style={{ color: '#64748b' }}>AY 2026-27 Requirement:</span> <strong style={{ color: '#15803d' }}>100% COMPLIANT</strong>
                      </div>
                    </div>
                    <div style={{ borderTop: '1px solid #dcfce7', paddingTop: 8, color: '#14532d' }}>
                      <strong>Statutory Explanation:</strong> Certificate covers the entire Academic Year 2026–27 up to 30-Jun-2027 without gap. Endorsed with Chief Fire Officer X.509 digital token (DSC: 2026:UPFS:DSC:VALID:77810A) and verified against National Building Code (NBC 2016 Part 4).
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 8 }}>
                    <div style={{ fontSize: '0.75rem', color: '#15803d', fontWeight: 600 }}>
                      Pre-Scrutiny Score Impact: <strong>100% Readiness (Direct Approval Track)</strong>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        resolveNoticeByCollege(
                          'NOT-1029',
                          'Fire_Safety_NOC_VALID.pdf',
                          'Uploaded valid Fire Safety NOC (UP/FS/GBN/2026/NOC-VAL-98421) valid through 30-Jun-2027.'
                        );
                        setPreScrutinySimModalOpen(false);
                        setSuccessToast('Valid document Fire_Safety_NOC_VALID.pdf applied! Active deficiency cleared and transmitted to Scrutiny Committee.');
                        setTimeout(() => setSuccessToast(null), 5000);
                      }}
                      className="btn btn-sm"
                      style={{ background: '#15803d', color: '#ffffff', fontSize: '0.74rem', fontWeight: 700, gap: 6 }}
                    >
                      <Check size={14} /> Apply Valid Document to Active Application
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div style={{
              padding: '12px 24px',
              borderTop: '1px solid #e2e8f0',
              display: 'flex',
              justifyContent: 'flex-end',
              background: '#f8fafc'
            }}>
              <button
                type="button"
                className="btn btn-secondary btn-sm"
                onClick={() => setPreScrutinySimModalOpen(false)}
              >
                Close Simulator
              </button>
            </div>
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

      {/* 12-Step Recommended Demo Walkthrough Modal */}
      <DemoWalkthroughModal
        isOpen={walkthroughModalOpen}
        onClose={() => setWalkthroughModalOpen(false)}
      />

      {/* Footer */}
      <footer style={{
        background: '#ffffff',
        borderTop: '1px solid #e2e8f0',
        padding: '16px 32px',
        textAlign: 'center',
        fontSize: '0.72rem',
        color: '#64748b'
      }}>
        All India Council for Technical Education • Ministry of Education, Government of India • Institution Portal
      </footer>
    </div>
  );
}
