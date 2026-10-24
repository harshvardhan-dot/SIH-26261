'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  X, CheckCircle2, ArrowRight, Play, ExternalLink, Shield,
  FileText, Building2, AlertTriangle, Upload, Printer, RotateCcw,
  Sparkles, Check, HelpCircle
} from 'lucide-react';

interface DemoWalkthroughModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenReportExport?: () => void;
  onOpenCrossDoc?: () => void;
}

export default function DemoWalkthroughModal({
  isOpen,
  onClose,
  onOpenReportExport,
  onOpenCrossDoc
}: DemoWalkthroughModalProps) {
  const router = useRouter();
  const [activeStep, setActiveStep] = useState(1);

  if (!isOpen) return null;

  const demoSteps = [
    {
      num: 1,
      title: 'Log in as the Applicant',
      portal: 'Authentication Portal (/login)',
      description: 'Log into the institutional workspace as the applicant for Apex Institute of Technology & Management (PID: 1-102938475).',
      actionLabel: 'Go to Login Portal',
      actionHref: '/login',
      status: 'Ready'
    },
    {
      num: 2,
      title: 'Create an Application',
      portal: 'Institutional Submission (/institution/submit)',
      description: 'Initiate a new Extension of Approval (EoA 2026–27) filing, selecting Category and 720 sanctioned student intake under APH 2024–27.',
      actionLabel: 'Open Application Filing Flow',
      actionHref: '/institution/submit',
      status: 'Ready'
    },
    {
      num: 3,
      title: 'Pre-Scrutiny Date Detection Test (Expired vs Valid NOC)',
      portal: 'AI Pre-Scrutiny Engine (/institution & /institution/submit)',
      description: 'Demonstrate automated OCR date detection: compare Fire_Safety_NOC_EXPIRED.pdf (expired 14-May-2025) vs Fire_Safety_NOC_VALID.pdf (valid through 30-Jun-2027) under APH Regulation 3.4.',
      actionLabel: 'Open Pre-Scrutiny Simulator',
      actionHref: '/institution',
      status: 'Ready'
    },
    {
      num: 4,
      title: 'Show the Extracted Information',
      portal: 'AI OCR & Structured Extraction Engine',
      description: 'Demonstrate automated extraction of institution name, approval dates, registration numbers, acreage (7.85 acres), and 38 faculty on rolls with bounding box tracking.',
      actionLabel: 'Launch Cross-Doc Field Extractor',
      actionCustom: () => {
        onClose();
        if (onOpenCrossDoc) onOpenCrossDoc();
      },
      status: 'Ready'
    },
    {
      num: 5,
      title: 'Demonstrate Missing-Document Warning',
      portal: 'Mandatory Checklist Verification',
      description: 'Show how the engine detects incomplete dossiers and flags missing statutory certificates (e.g., Mandatory State PWD Structural Stability Certificate under APH Chapter II, Clause 2.1).',
      actionLabel: 'View Checklist Warning',
      actionHref: '/institution',
      status: 'Ready'
    },
    {
      num: 6,
      title: 'Demonstrate Inconsistent Registration Number',
      portal: 'Entity Coherence & PID Binding',
      description: 'Demonstrate detection of registration number discrepancies across documents (e.g. Sub-Registrar Deed #402/1-2020 vs Society Affidavit #402/1-2018, or PID 1-102938475 vs PID 1-994821044).',
      actionLabel: 'Show Discrepancy Flag',
      actionHref: '/validation',
      status: 'Ready'
    },
    {
      num: 7,
      title: 'Open the Reviewer Dashboard',
      portal: 'AICTE Scrutiny Committee (/validation & /dashboard)',
      description: 'Switch to the official Scrutiny Officer dashboard to view the flagged college queue, active dossiers, and the 4-tier Provenance Ladder.',
      actionLabel: 'Open Reviewer Dashboard',
      actionHref: '/validation',
      status: 'Ready'
    },
    {
      num: 8,
      title: 'Show Evidence Supporting the Finding',
      portal: 'Interactive PDF Viewer & Provenance Seal',
      description: 'Open the real statutory PDF modal for any flagged document to inspect the cryptographic SHA-256 seal, digital signature verification, and State Gateway live lookup.',
      actionLabel: 'Inspect Evidence Queue',
      actionHref: '/validation',
      status: 'Ready'
    },
    {
      num: 9,
      title: 'Request a Correction (Send Notice)',
      portal: 'Real-Time Deficiency Notice Module',
      description: 'Click "Send Deficiency Notice" on a flagged document (e.g. Fire Safety NOC 18-day expiry), enter instructions and deadline, and transmit it directly to the college portal.',
      actionLabel: 'Simulate Correction Request',
      actionHref: '/validation',
      status: 'Ready'
    },
    {
      num: 10,
      title: 'Upload a Corrected Version',
      portal: 'College Notice Resolution Dropzone',
      description: 'Switch back to the Institution Portal, click "Resolve Action & Upload", and attach the rectified document (Rectified_Fire_Safety_NOC_Renewal.pdf) to satisfy the finding.',
      actionLabel: 'Open College Workspace',
      actionHref: '/institution',
      status: 'Ready'
    },
    {
      num: 11,
      title: 'Show Updated Status and Audit History',
      portal: 'Cross-Portal Real-Time Sync & /audit',
      description: 'Demonstrate live real-time status synchronization across portals without browser refresh, mark as verified manually, and inspect the tamper-evident audit log (/audit).',
      actionLabel: 'Inspect Audit Trail Log',
      actionHref: '/audit',
      status: 'Ready'
    },
    {
      num: 12,
      title: 'Export the Review Report',
      portal: 'Official Scrutiny Evaluation Report (PDF / Print)',
      description: 'Generate the complete, official AICTE Scrutiny Committee Evaluation Report with institution metadata, document checklist, discrepancy findings, and officer digital signatures.',
      actionLabel: 'Export Official Scrutiny Report (PDF)',
      actionCustom: () => {
        onClose();
        if (onOpenReportExport) onOpenReportExport();
      },
      status: 'Ready'
    }
  ];

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 2000,
        background: 'rgba(15, 23, 42, 0.75)',
        backdropFilter: 'blur(4px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20
      }}
      onClick={onClose}
    >
      <div
        style={{
          background: '#ffffff',
          borderRadius: 10,
          width: '100%',
          maxWidth: 900,
          maxHeight: '90vh',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
          overflow: 'hidden'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div
          style={{
            background: '#0f2942',
            color: '#ffffff',
            padding: '16px 24px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderBottom: '3px solid #FF9933'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div
              style={{
                width: 36,
                height: 36,
                borderRadius: 6,
                background: '#1e40af',
                color: '#fde047',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <CheckCircle2 size={20} />
            </div>
            <div>
              <div style={{ fontSize: '1rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: 8 }}>
                AICTE Recommended Demonstration Walkthrough (12 Exact Steps)
                <span
                  style={{
                    background: '#15803d',
                    color: '#ffffff',
                    fontSize: '0.65rem',
                    fontWeight: 700,
                    padding: '2px 8px',
                    borderRadius: 4
                  }}
                >
                  COMPLETE SPEC
                </span>
              </div>
              <div style={{ fontSize: '0.72rem', color: '#94a3b8' }}>
                Step-by-step evaluator flow with synthetic documents, discrepancy simulation, finding correction, and PDF report export
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            style={{
              background: 'transparent',
              border: 'none',
              color: '#cbd5e1',
              cursor: 'pointer',
              padding: 4
            }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Step List Container */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '20px 24px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {demoSteps.map((step) => {
              const isSelected = activeStep === step.num;
              return (
                <div
                  key={step.num}
                  style={{
                    border: `1px solid ${isSelected ? '#1e40af' : '#e2e8f0'}`,
                    borderRadius: 8,
                    background: isSelected ? '#f8fafc' : '#ffffff',
                    padding: '14px 18px',
                    transition: 'all 0.15s ease',
                    boxShadow: isSelected ? '0 2px 6px rgba(30, 64, 175, 0.08)' : 'none'
                  }}
                  onClick={() => setActiveStep(step.num)}
                >
                  <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12 }}>
                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
                      <div
                        style={{
                          width: 28,
                          height: 28,
                          borderRadius: '50%',
                          background: isSelected ? '#1e40af' : '#f1f5f9',
                          color: isSelected ? '#ffffff' : '#64748b',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '0.75rem',
                          fontWeight: 800,
                          flexShrink: 0,
                          marginTop: 2
                        }}
                      >
                        {step.num}
                      </div>

                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 2 }}>
                          <h4 style={{ fontSize: '0.88rem', fontWeight: 800, color: '#0f2942', margin: 0 }}>
                            {step.title}
                          </h4>
                          <span style={{ fontSize: '0.68rem', color: '#64748b', background: '#f1f5f9', padding: '1px 6px', borderRadius: 4 }}>
                            {step.portal}
                          </span>
                        </div>
                        <p style={{ fontSize: '0.76rem', color: '#475569', margin: '4px 0 0', lineHeight: 1.5 }}>
                          {step.description}
                        </p>
                      </div>
                    </div>

                    {/* Action Button */}
                    <div style={{ flexShrink: 0 }}>
                      {step.actionHref ? (
                        <Link
                          href={step.actionHref}
                          onClick={onClose}
                          className="btn btn-secondary btn-sm"
                          style={{ fontSize: '0.74rem', padding: '6px 12px', gap: 5, whiteSpace: 'nowrap' }}
                        >
                          <Play size={12} style={{ color: '#1e40af' }} />
                          <span>{step.actionLabel}</span>
                        </Link>
                      ) : (
                        <button
                          type="button"
                          onClick={step.actionCustom}
                          className="btn btn-primary btn-sm"
                          style={{ fontSize: '0.74rem', padding: '6px 12px', gap: 5, whiteSpace: 'nowrap' }}
                        >
                          <Play size={12} />
                          <span>{step.actionLabel}</span>
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer */}
        <div
          style={{
            background: '#ffffff',
            borderTop: '1px solid #e2e8f0',
            padding: '12px 24px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}
        >
          <div style={{ fontSize: '0.72rem', color: '#64748b' }}>
            Reference: SIH 2026 Problem Statement Recommended Demonstration Walkthrough (12/12 Steps Configured)
          </div>

          <button
            type="button"
            className="btn btn-secondary btn-sm"
            onClick={onClose}
          >
            Close Guide
          </button>
        </div>
      </div>
    </div>
  );
}
