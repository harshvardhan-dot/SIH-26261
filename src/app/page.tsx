'use client';

import Link from 'next/link';
import LanguageSwitcher from '@/components/LanguageSwitcher';
import {
  Building2, UserCheck, CheckCircle2,
  Lock, PhoneCall, BookOpen, ExternalLink, ArrowRight
} from 'lucide-react';
import { useTranslation } from '@/lib/i18n';

export default function LandingPage() {
  const { t, language } = useTranslation();

  return (
    <div key={language} style={{
      minHeight: '100vh',
      background: '#f8fafc',
      display: 'flex',
      flexDirection: 'column',
      color: '#0f172a',
      fontFamily: 'var(--font-family)'
    }}>
      {/* Indian National Tricolor Ribbon */}
      <div style={{
        height: '4px',
        width: '100%',
        background: 'linear-gradient(90deg, #FF9933 0%, #FF9933 33.3%, #ffffff 33.3%, #ffffff 66.6%, #138808 66.6%, #138808 100%)'
      }} />

      {/* Top Ministry & Auxiliary Bar */}
      <div style={{
        background: '#ffffff',
        borderBottom: '1px solid #e2e8f0',
        padding: '6px 32px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        fontSize: '0.74rem',
        color: '#64748b'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <span>{t('govIndia')}</span>
          <span style={{ color: '#cbd5e1' }}>|</span>
          <span>{t('ministryEdu')}</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 18 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <PhoneCall size={12} style={{ color: '#1e40af' }} />
            <span>{t('helpdesk')}</span>
          </div>
          <span style={{ color: '#cbd5e1' }}>|</span>
          <LanguageSwitcher compact />
        </div>
      </div>

      {/* Main Header */}
      <header style={{
        background: '#ffffff',
        borderBottom: '1px solid #e2e8f0',
        padding: '16px 32px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        boxShadow: '0 1px 3px rgba(0,0,0,0.03)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <div style={{
            width: 48,
            height: 48,
            borderRadius: 6,
            background: '#0f2942',
            color: '#ffffff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '1.4rem'
          }}>
            🏛️
          </div>
          <div>
            <div style={{ fontSize: '1.05rem', fontWeight: 800, color: '#0f2942', lineHeight: 1.2 }}>
              {t('aicteFull')}
            </div>
            <div style={{ fontSize: '0.74rem', color: '#64748b', marginTop: 2 }}>
              {t('aicteStatutory')}
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{
            background: '#ecfdf5',
            color: '#166534',
            border: '1px solid #bbf7d0',
            fontSize: '0.74rem',
            fontWeight: 700,
            padding: '4px 10px',
            borderRadius: 4
          }}>
            {t('academicYear')}
          </span>
        </div>
      </header>

      {/* Notification Strip with Verified In-App Handbook Link */}
      <div style={{
        background: '#eff6ff',
        borderBottom: '1px solid #bfdbfe',
        padding: '8px 32px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexWrap: 'wrap',
        gap: 14,
        fontSize: '0.78rem',
        color: '#1e40af',
        fontWeight: 500
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{
            background: '#1e40af',
            color: '#ffffff',
            fontSize: '0.68rem',
            fontWeight: 700,
            padding: '2px 7px',
            borderRadius: 3,
            textTransform: 'uppercase'
          }}>
            {t('noticeBadge')}
          </span>
          <span>
            {t('noticeText')}
          </span>
        </div>

        <Link
          href="/handbook"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 5,
            padding: '3px 10px',
            borderRadius: 4,
            background: '#ffffff',
            border: '1px solid #93c5fd',
            color: '#1e40af',
            fontWeight: 700,
            fontSize: '0.74rem',
            textDecoration: 'none',
            boxShadow: '0 1px 2px rgba(0,0,0,0.04)',
            transition: 'all 0.15s ease'
          }}
          title="Open AICTE Approval Process Handbook (APH 2024–27)"
        >
          <BookOpen size={13} style={{ color: '#1e40af' }} />
          <span>{t('officialHandbook')}</span>
          <ArrowRight size={12} style={{ opacity: 0.8 }} />
        </Link>
      </div>

      {/* Main Gateway Hub */}
      <main style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '40px 24px',
        maxWidth: 1080,
        margin: '0 auto',
        width: '100%'
      }}>
        <div style={{ textAlign: 'center', marginBottom: 36, maxWidth: 720 }}>
          <h1 style={{
            fontSize: '1.75rem',
            fontWeight: 800,
            color: '#0f2942',
            marginBottom: 8,
            letterSpacing: '-0.02em'
          }}>
            {t('landingTitle')}
          </h1>
          <p style={{ fontSize: '0.92rem', color: '#475569', lineHeight: 1.5 }}>
            {t('landingSubtitle')}
          </p>
        </div>

        {/* Dual Gateways: Two Clean Cards */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))',
          gap: 24,
          width: '100%',
          marginBottom: 40
        }}>
          {/* Institution Card */}
          <div style={{
            background: '#ffffff',
            border: '1px solid #cbd5e1',
            borderTop: '4px solid #0284c7',
            borderRadius: 8,
            padding: 28,
            boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between'
          }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 14 }}>
                <div style={{
                  width: 40,
                  height: 40,
                  borderRadius: 6,
                  background: '#f0f9ff',
                  color: '#0284c7',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <Building2 size={22} />
                </div>
                <div>
                  <h2 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#0f172a' }}>
                    {t('techInstitutions')}
                  </h2>
                  <span style={{ fontSize: '0.74rem', color: '#64748b' }}>
                    {t('collegesDesc')}
                  </span>
                </div>
              </div>

              <p style={{ fontSize: '0.84rem', color: '#475569', lineHeight: 1.5, marginBottom: 18 }}>
                {t('techInstitutionsInfo')}
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 24 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: '0.78rem', color: '#334155' }}>
                  <CheckCircle2 size={14} style={{ color: '#16a34a' }} />
                  <span>{t('featureEoASubmit')}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: '0.78rem', color: '#334155' }}>
                  <CheckCircle2 size={14} style={{ color: '#16a34a' }} />
                  <span>{t('featureReadiness')}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: '0.78rem', color: '#334155' }}>
                  <CheckCircle2 size={14} style={{ color: '#16a34a' }} />
                  <span>{t('featureDeficiency')}</span>
                </div>
              </div>
            </div>

            <Link
              href="/login?tab=institution"
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 8,
                padding: '11px 16px',
                background: '#0284c7',
                color: '#ffffff',
                borderRadius: 6,
                fontSize: '0.86rem',
                fontWeight: 600,
                textDecoration: 'none'
              }}
            >
              <span>{t('institutionLoginBtn')}</span>
              <ArrowRight size={14} />
            </Link>
          </div>

          {/* AICTE Council Official Card */}
          <div style={{
            background: '#ffffff',
            border: '1px solid #cbd5e1',
            borderTop: '4px solid #0f2942',
            borderRadius: 8,
            padding: 28,
            boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between'
          }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 14 }}>
                <div style={{
                  width: 40,
                  height: 40,
                  borderRadius: 6,
                  background: '#f1f5f9',
                  color: '#0f2942',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <UserCheck size={22} />
                </div>
                <div>
                  <h2 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#0f172a' }}>
                    {t('councilOfficials')}
                  </h2>
                  <span style={{ fontSize: '0.74rem', color: '#64748b' }}>
                    {t('councilDesc')}
                  </span>
                </div>
              </div>

              <p style={{ fontSize: '0.84rem', color: '#475569', lineHeight: 1.5, marginBottom: 18 }}>
                {t('councilInfo')}
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 24 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: '0.78rem', color: '#334155' }}>
                  <CheckCircle2 size={14} style={{ color: '#16a34a' }} />
                  <span>{t('featureAPH')}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: '0.78rem', color: '#334155' }}>
                  <CheckCircle2 size={14} style={{ color: '#16a34a' }} />
                  <span>{t('featureCollusion')}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: '0.78rem', color: '#334155' }}>
                  <CheckCircle2 size={14} style={{ color: '#16a34a' }} />
                  <span>{t('featureDigiLocker')}</span>
                </div>
              </div>
            </div>

            <Link
              href="/login?tab=council"
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 8,
                padding: '11px 16px',
                background: '#0f2942',
                color: '#ffffff',
                borderRadius: 6,
                fontSize: '0.86rem',
                fontWeight: 600,
                textDecoration: 'none'
              }}
            >
              <span>{t('councilSSOBtn')}</span>
              <ArrowRight size={14} />
            </Link>
          </div>
        </div>

        {/* Subtle Regulatory Compliance Band */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 24,
          flexWrap: 'wrap',
          padding: '12px 20px',
          background: '#ffffff',
          borderRadius: 6,
          border: '1px solid #e2e8f0',
          fontSize: '0.76rem',
          color: '#64748b'
        }}>
          <span>🔒 {t('securityEncrypted')}</span>
          <span>•</span>
          <span>📜 {t('securityAPH')}</span>
          <span>•</span>
          <span>🏛️ {t('securitySSO')}</span>
        </div>
      </main>

      {/* Official Footer */}
      <footer style={{
        background: '#ffffff',
        borderTop: '1px solid #e2e8f0',
        padding: '20px 32px',
        textAlign: 'center',
        fontSize: '0.74rem',
        color: '#64748b'
      }}>
        <div style={{ fontWeight: 600, color: '#334155', marginBottom: 4 }}>
          {t('aicteFull')} • {t('ministryEdu')}, {t('govIndia')}
        </div>
        <div>
          {t('footerAddress')}
        </div>
        <div style={{ marginTop: 4, color: '#94a3b8' }}>
          {t('footerDisclaimer')}
        </div>
      </footer>
    </div>
  );
}
