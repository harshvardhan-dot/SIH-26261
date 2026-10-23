'use client';

import { useState, useEffect } from 'react';

export interface PortalNotice {
  id: string;
  collegeId: string;
  collegeCode: string;
  docName: string;
  docKey?: string;
  subject: string;
  instructions: string;
  deadline: string;
  severity: 'warning' | 'critical';
  sentAt: string;
  status: 'pending' | 'resolved';
  resolvedFile?: string;
  resolvedNote?: string;
  resolvedAt?: string;
}

export interface ManualVerification {
  collegeId: string;
  docName: string;
  docKey?: string;
  verifiedBy: string;
  officerNote: string;
  verifiedAt: string;
}

const NOTICES_STORAGE_KEY = 'aicte_portal_notices_v2';
const MANUAL_VERIF_STORAGE_KEY = 'aicte_manual_verifications_v2';
const USER_DOCS_STORAGE_KEY = 'aicte_user_uploaded_docs_v2';
const SYNC_EVENT_NAME = 'aicte_realtime_portal_sync';

// Default initial notices to make the demo immediately rich
const defaultNotices: PortalNotice[] = [
  {
    id: 'NOT-1029',
    collegeId: 'app_001',
    collegeCode: '1-102938475',
    docName: 'Fire Safety Certificate (NOC)',
    docKey: 'Fire_Safety_NOC_StateDirectorate.pdf',
    subject: 'Fire Safety NOC Renewal Receipt Required',
    instructions: 'Fire Safety NOC issued by State Fire Services Directorate expires in 18 days. Please upload the renewal application acknowledgment receipt and fire safety compliance undertaking.',
    deadline: '15-Nov-2026',
    severity: 'warning',
    sentAt: '21-Oct-2026',
    status: 'pending'
  },
  {
    id: 'NOT-1030',
    collegeId: 'app_001',
    collegeCode: '1-102938475',
    docName: 'Faculty Cadre & Salary Undertaking (Form 16)',
    docKey: 'Faculty_Aadhaar_Form16_AuditedList.pdf',
    subject: 'Faculty Cadre Proportion Compliance Affidavit',
    instructions: 'Cadre ratio analysis detected a shortfall of 1 Professor in Computer Science Dept for 1:20 cadre norm (APH Appendix 7). Upload Selection Committee meeting minutes or institutional undertaking of scheduled interviews.',
    deadline: '10-Nov-2026',
    severity: 'critical',
    sentAt: '22-Oct-2026',
    status: 'pending'
  }
];

export function getStoredNotices(): PortalNotice[] {
  if (typeof window === 'undefined') return defaultNotices;
  try {
    const raw = localStorage.getItem(NOTICES_STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(NOTICES_STORAGE_KEY, JSON.stringify(defaultNotices));
      return defaultNotices;
    }
    return JSON.parse(raw);
  } catch (e) {
    return defaultNotices;
  }
}

export function getStoredVerifications(): ManualVerification[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(MANUAL_VERIF_STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    return [];
  }
}

function broadcastSync() {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent(SYNC_EVENT_NAME));
  }
}

// 1. Officer sends notice to institution
export function sendNoticeToCollege(notice: {
  collegeId: string;
  collegeCode: string;
  docName: string;
  docKey?: string;
  subject: string;
  instructions: string;
  deadline?: string;
  severity?: 'warning' | 'critical';
}): PortalNotice {
  const all = getStoredNotices();
  const noticeId = `NOTICE-${Math.floor(1000 + Math.random() * 9000)}`;

  const newNotice: PortalNotice = {
    id: noticeId,
    collegeId: notice.collegeId,
    collegeCode: notice.collegeCode,
    docName: notice.docName,
    docKey: notice.docKey || notice.docName,
    subject: notice.subject,
    instructions: notice.instructions,
    deadline: notice.deadline || '15-Nov-2026',
    severity: notice.severity || 'warning',
    sentAt: new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }),
    status: 'pending'
  };

  // Remove any manual verification on this doc if a new notice is sent
  const verifs = getStoredVerifications().filter(v =>
    !(matchesCollege(v.collegeId, notice.collegeId) && matchesDoc(v.docName, notice.docName))
  );
  if (typeof window !== 'undefined') {
    localStorage.setItem(MANUAL_VERIF_STORAGE_KEY, JSON.stringify(verifs));
    localStorage.setItem(NOTICES_STORAGE_KEY, JSON.stringify([newNotice, ...all]));
  }

  broadcastSync();
  return newNotice;
}

// 2. Officer manually verifies a document
export function verifyDocumentManually(
  collegeId: string,
  docName: string,
  officerNote?: string
): ManualVerification {
  const verifs = getStoredVerifications();
  const note = officerNote?.trim() || 'Verified manually by Dr. Rajesh Kumar (AICTE Scrutiny Officer) - physical/digital copy inspected and authenticated.';

  const newVerif: ManualVerification = {
    collegeId,
    docName,
    verifiedBy: 'Dr. Rajesh Kumar (AICTE Scrutiny Officer)',
    officerNote: note,
    verifiedAt: new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })
  };

  // Mark any active notice for this document as resolved by manual verification
  const notices = getStoredNotices().map(n => {
    if (matchesCollege(n.collegeId, collegeId) && matchesDoc(n.docName, docName)) {
      return {
        ...n,
        status: 'resolved' as const,
        resolvedNote: `Resolved by Council Manual Verification (${note})`,
        resolvedAt: newVerif.verifiedAt
      };
    }
    return n;
  });

  if (typeof window !== 'undefined') {
    localStorage.setItem(NOTICES_STORAGE_KEY, JSON.stringify(notices));
    localStorage.setItem(MANUAL_VERIF_STORAGE_KEY, JSON.stringify([newVerif, ...verifs.filter(v => !(matchesCollege(v.collegeId, collegeId) && matchesDoc(v.docName, docName)))]));
  }

  broadcastSync();
  return newVerif;
}

// 3. College resolves notice by uploading rectification
export function resolveNoticeByCollege(
  noticeIdOrDocName: string,
  fileName: string,
  explanation: string
) {
  const notices = getStoredNotices().map(n => {
    const isIdMatch = n.id === noticeIdOrDocName;
    const isDocMatch = matchesDoc(n.docName, noticeIdOrDocName) || (n.docKey && matchesDoc(n.docKey, noticeIdOrDocName));
    if (isIdMatch || isDocMatch) {
      return {
        ...n,
        status: 'resolved' as const,
        resolvedFile: fileName,
        resolvedNote: explanation,
        resolvedAt: new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })
      };
    }
    return n;
  });

  if (typeof window !== 'undefined') {
    localStorage.setItem(NOTICES_STORAGE_KEY, JSON.stringify(notices));
  }

  broadcastSync();
}

// Helper matchers to support flexible IDs and document names
export function matchesCollege(id1: string, id2: string): boolean {
  if (!id1 || !id2) return false;
  if (id1 === id2) return true;
  const clean1 = id1.toLowerCase().replace(/[^a-z0-9]/g, '');
  const clean2 = id2.toLowerCase().replace(/[^a-z0-9]/g, '');
  if (clean1.includes(clean2) || clean2.includes(clean1)) return true;

  // Apex Institute of Technology
  const isApex1 = id1.includes('102938475') || id1 === 'app_001' || id1.toLowerCase().includes('apex');
  const isApex2 = id2.includes('102938475') || id2 === 'app_001' || id2.toLowerCase().includes('apex');
  if (isApex1 && isApex2) return true;

  // Saraswati Institute
  const isSaras1 = id1.includes('692810394') || id1 === 'app_006' || id1.toLowerCase().includes('saraswati');
  const isSaras2 = id2.includes('692810394') || id2 === 'app_006' || id2.toLowerCase().includes('saraswati');
  if (isSaras1 && isSaras2) return true;

  // Modern Management
  const isMod1 = id1.includes('592019483') || id1 === 'app_002' || id1.toLowerCase().includes('modern');
  const isMod2 = id2.includes('592019483') || id2 === 'app_002' || id2.toLowerCase().includes('modern');
  if (isMod1 && isMod2) return true;

  return false;
}

export function matchesDoc(name1: string, name2: string): boolean {
  if (!name1 || !name2) return false;
  if (name1 === name2) return true;
  const n1 = name1.toLowerCase();
  const n2 = name2.toLowerCase();
  if (n1.includes('fire') && n2.includes('fire')) return true;
  if (n1.includes('faculty') && n2.includes('faculty')) return true;
  if (n1.includes('land') && n2.includes('land')) return true;
  if (n1.includes('building') && n2.includes('building')) return true;
  if (n1.includes('affiliation') && n2.includes('affiliation')) return true;
  if (n1.includes('khasra') && n2.includes('khasra')) return true;
  if (n1.includes('deed') && n2.includes('deed')) return true;
  return false;
}

export function getStoredUserDocs(): any[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(USER_DOCS_STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    return [];
  }
}

export function saveUserDoc(doc: any) {
  if (typeof window === 'undefined') return;
  const current = getStoredUserDocs();
  localStorage.setItem(USER_DOCS_STORAGE_KEY, JSON.stringify([doc, ...current]));
  broadcastSync();
}

export function resetPortalSyncToDefaults() {
  if (typeof window !== 'undefined') {
    localStorage.setItem(NOTICES_STORAGE_KEY, JSON.stringify(defaultNotices));
    localStorage.removeItem(MANUAL_VERIF_STORAGE_KEY);
    localStorage.removeItem(USER_DOCS_STORAGE_KEY);
    broadcastSync();
  }
}

// React Hook to subscribe to real-time changes
export function usePortalSync() {
  const [notices, setNotices] = useState<PortalNotice[]>([]);
  const [verifications, setVerifications] = useState<ManualVerification[]>([]);
  const [userDocs, setUserDocs] = useState<any[]>([]);
  const [tick, setTick] = useState(0);

  useEffect(() => {
    setNotices(getStoredNotices());
    setVerifications(getStoredVerifications());
    setUserDocs(getStoredUserDocs());

    const handleSync = () => {
      setNotices(getStoredNotices());
      setVerifications(getStoredVerifications());
      setUserDocs(getStoredUserDocs());
      setTick(t => t + 1);
    };

    window.addEventListener(SYNC_EVENT_NAME, handleSync);
    window.addEventListener('storage', handleSync);

    return () => {
      window.removeEventListener(SYNC_EVENT_NAME, handleSync);
      window.removeEventListener('storage', handleSync);
    };
  }, []);

  return { notices, verifications, userDocs, tick, resetToDefaults: resetPortalSyncToDefaults };
}
