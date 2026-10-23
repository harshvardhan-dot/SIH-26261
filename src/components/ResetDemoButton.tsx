'use client';

import { useState } from 'react';
import { RotateCcw, Check, Sparkles, AlertCircle } from 'lucide-react';
import { resetPortalSyncToDefaults } from '@/lib/portalSync';

interface ResetDemoButtonProps {
  variant?: 'topbar' | 'button' | 'compact' | 'danger';
  className?: string;
  onResetComplete?: () => void;
  label?: string;
}

export default function ResetDemoButton({
  variant = 'topbar',
  className = '',
  onResetComplete,
  label = 'Reset Demo State'
}: ResetDemoButtonProps) {
  const [resetting, setResetting] = useState(false);
  const [showToast, setShowToast] = useState(false);

  const handleReset = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    setResetting(true);
    try {
      resetPortalSyncToDefaults();
    } catch (err) {
      console.error('Failed to reset demo state:', err);
    }

    setTimeout(() => {
      setResetting(false);
      setShowToast(true);
      if (onResetComplete) {
        onResetComplete();
      }
      setTimeout(() => {
        setShowToast(false);
      }, 4000);
    }, 450);
  };

  // Styles based on variant
  const getStyle = (): React.CSSProperties => {
    if (variant === 'topbar') {
      return {
        display: 'inline-flex',
        alignItems: 'center',
        gap: 6,
        padding: '5px 11px',
        borderRadius: 5,
        background: '#fffbeb',
        border: '1px solid #fde68a',
        color: '#92400e',
        fontSize: '0.75rem',
        fontWeight: 600,
        cursor: 'pointer',
        transition: 'all 0.15s ease',
        boxShadow: '0 1px 2px rgba(245, 158, 11, 0.08)'
      };
    }

    if (variant === 'button') {
      return {
        display: 'inline-flex',
        alignItems: 'center',
        gap: 6,
        padding: '7px 14px',
        borderRadius: 6,
        background: '#ffffff',
        border: '1px solid #cbd5e1',
        color: '#0f2942',
        fontSize: '0.78rem',
        fontWeight: 600,
        cursor: 'pointer',
        transition: 'all 0.15s ease',
        boxShadow: '0 1px 2px rgba(0,0,0,0.03)'
      };
    }

    if (variant === 'compact') {
      return {
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: 32,
        height: 32,
        borderRadius: 5,
        background: '#fffbeb',
        border: '1px solid #fde68a',
        color: '#92400e',
        cursor: 'pointer',
        transition: 'all 0.15s ease'
      };
    }

    // danger / outline
    return {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 6,
      padding: '6px 12px',
      borderRadius: 6,
      background: '#fef2f2',
      border: '1px solid #fecaca',
      color: '#991b1b',
      fontSize: '0.75rem',
      fontWeight: 600,
      cursor: 'pointer'
    };
  };

  return (
    <>
      <button
        type="button"
        onClick={handleReset}
        disabled={resetting}
        style={getStyle()}
        className={className}
        title="Reset all flags, deficiency notices, and manual verification statuses back to initial demo presentation baseline"
        aria-label="Reset Demo State"
      >
        <RotateCcw
          size={variant === 'compact' ? 14 : 13}
          style={{
            transition: 'transform 0.4s ease',
            transform: resetting ? 'rotate(-360deg)' : 'none'
          }}
        />
        {variant !== 'compact' && (
          <span>{resetting ? 'Resetting...' : label}</span>
        )}
      </button>

      {/* Instant Notification Toast */}
      {showToast && (
        <div
          style={{
            position: 'fixed',
            bottom: 24,
            right: 24,
            zIndex: 9999,
            background: '#064e3b',
            color: '#ffffff',
            padding: '12px 18px',
            borderRadius: 8,
            boxShadow: '0 10px 25px -5px rgba(0,0,0,0.3), 0 8px 10px -6px rgba(0,0,0,0.2)',
            display: 'flex',
            alignItems: 'flex-start',
            gap: 12,
            maxWidth: 380,
            fontSize: '0.8rem',
            lineHeight: 1.45,
            animation: 'fadeInUp 0.25s ease forwards'
          }}
        >
          <div
            style={{
              width: 22,
              height: 22,
              borderRadius: '50%',
              background: '#059669',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
              marginTop: 1
            }}
          >
            <Check size={14} color="#ffffff" />
          </div>
          <div>
            <div style={{ fontWeight: 700, fontSize: '0.82rem', marginBottom: 2 }}>
              Demo State Restored
            </div>
            <div style={{ color: '#d1fae5', fontSize: '0.74rem' }}>
              All statutory flags, manual officer verifications, deficiency notices, and uploaded documents have been reset to the clean baseline.
            </div>
          </div>
        </div>
      )}
    </>
  );
}
