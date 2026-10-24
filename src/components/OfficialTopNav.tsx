'use client';

import Link from 'next/link';
import LanguageSwitcher from '@/components/LanguageSwitcher';
import ResetDemoButton from '@/components/ResetDemoButton';
import { Shield, ExternalLink, LogOut, Lock, Building, CheckCircle2 } from 'lucide-react';
import { useTranslation } from '@/lib/i18n';

export default function OfficialTopNav() {
  const { t } = useTranslation();

  return (
    <header style={{
      background: '#ffffff',
      borderBottom: '1px solid #e2e8f0',
      position: 'sticky',
      top: 0,
      zIndex: 50,
      boxShadow: '0 1px 2px rgba(0,0,0,0.03)'
    }}>
      {/* Indian National Tricolor Stripe */}
      <div style={{
        height: '3px',
        width: '100%',
        background: 'linear-gradient(90deg, #FF9933 0%, #FF9933 33.3%, #ffffff 33.3%, #ffffff 66.6%, #138808 66.6%, #138808 100%)'
      }} />

      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '10px 24px',
        gap: 16
      }}>
        {/* Left: Official Authority Details */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <div style={{
            width: 32,
            height: 32,
            borderRadius: 6,
            background: '#0f2942',
            color: '#ffffff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '0.8rem',
            fontWeight: 800
          }}>
            🏛️
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ fontSize: '0.86rem', fontWeight: 700, color: '#0f172a' }}>
                {t('aicteFull')}
              </span>
              <span style={{
                background: '#eff6ff',
                color: '#1e40af',
                fontSize: '0.68rem',
                fontWeight: 700,
                padding: '2px 8px',
                borderRadius: 4,
                border: '1px solid #bfdbfe'
              }}>
                {t('bureauScrutiny')}
              </span>
            </div>
            <div style={{ fontSize: '0.72rem', color: '#64748b' }}>
              {t('ministryOfEducation')} • {t('aphYear')}
            </div>
          </div>
        </div>

        {/* Right: Security Pill, Language Switcher, Reset Demo, Portal Link, Officer Profile */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          {/* Current Date Badge */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: 5,
            padding: '4px 10px',
            borderRadius: 4,
            background: '#f8fafc',
            border: '1px solid #cbd5e1',
            fontSize: '0.72rem',
            color: '#0f172a',
            fontWeight: 700
          }}>
            <span style={{ color: '#0284c7' }}>📅</span>
            <span>24-Oct-2026</span>
          </div>

          {/* Security Badge */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            padding: '4px 10px',
            borderRadius: 4,
            background: '#f0fdf4',
            border: '1px solid #bbf7d0',
            fontSize: '0.72rem',
            color: '#166534',
            fontWeight: 600
          }}>
            <Lock size={12} style={{ color: '#16a34a' }} />
            <span>{t('ssoBadge')}</span>
          </div>

          {/* Regional Language Selector */}
          <LanguageSwitcher compact />

          {/* Reset Demo State Button */}
          <ResetDemoButton variant="topbar" label={t('resetDemo')} />

          {/* Institution Switcher Button */}
          <Link
            href="/institution"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              padding: '5px 12px',
              borderRadius: 5,
              background: '#f8fafc',
              border: '1px solid #cbd5e1',
              color: '#0f2942',
              fontSize: '0.75rem',
              fontWeight: 600,
              textDecoration: 'none'
            }}
          >
            <Building size={14} style={{ color: '#0284c7' }} />
            <span>{t('institutionView')}</span>
            <ExternalLink size={12} style={{ opacity: 0.6 }} />
          </Link>

          {/* Sign Out */}
          <Link
            href="/login"
            title="Sign out of AICTE Session"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 4,
              padding: '5px 10px',
              borderRadius: 5,
              background: '#ffffff',
              border: '1px solid #e2e8f0',
              color: '#64748b',
              fontSize: '0.75rem',
              fontWeight: 500,
              textDecoration: 'none'
            }}
          >
            <LogOut size={13} />
            <span>{t('logout')}</span>
          </Link>
        </div>
      </div>
    </header>
  );
}
