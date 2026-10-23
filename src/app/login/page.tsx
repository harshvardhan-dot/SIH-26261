'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import {
  Shield, Building2, UserCheck, Lock, ArrowRight,
  CheckCircle, AlertCircle, Eye, EyeOff, Globe
} from 'lucide-react';
import LanguageSwitcher from '@/components/LanguageSwitcher';
import { useTranslation } from '@/lib/i18n';

function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { t } = useTranslation();

  const tabParam = searchParams.get('tab');
  const isCouncilInitial = tabParam === 'council' || tabParam === 'official';

  const [role, setRole] = useState<'institution' | 'official'>(isCouncilInitial ? 'official' : 'institution');
  const [instituteId, setInstituteId] = useState(isCouncilInitial ? 'AICTE-RO-DELHI-04' : '1-102938475');
  const [email, setEmail] = useState(isCouncilInitial ? 'rajesh.kumar@aicte-india.org' : 'director@apextag.ac.in');
  const [password, setPassword] = useState('••••••••••••');
  const [showPassword, setShowPassword] = useState(false);
  const [loggingIn, setLoggingIn] = useState(false);

  useEffect(() => {
    const currentTab = searchParams.get('tab');
    if (currentTab === 'council' || currentTab === 'official') {
      setRole('official');
      setInstituteId('AICTE-RO-DELHI-04');
      setEmail('rajesh.kumar@aicte-india.org');
    } else if (currentTab === 'institution') {
      setRole('institution');
      setInstituteId('1-102938475');
      setEmail('director@apextag.ac.in');
    }
  }, [searchParams]);

  const handleRoleChange = (newRole: 'institution' | 'official') => {
    setRole(newRole);
    if (newRole === 'institution') {
      setInstituteId('1-102938475');
      setEmail('director@apextag.ac.in');
    } else {
      setInstituteId('AICTE-RO-DELHI-04');
      setEmail('rajesh.kumar@aicte-india.org');
    }
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoggingIn(true);
    setTimeout(() => {
      setLoggingIn(false);
      if (role === 'institution') {
        router.push('/institution');
      } else {
        router.push('/dashboard');
      }
    }, 700);
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: '#f8fafc',
      display: 'flex',
      flexDirection: 'column',
      color: '#0f172a'
    }}>
      {/* Indian National Tricolor Header Accent */}
      <div style={{
        height: '4px',
        width: '100%',
        background: 'linear-gradient(90deg, #FF9933 0%, #FF9933 33.3%, #000080 33.3%, #000080 33.7%, #ffffff 33.7%, #ffffff 66.3%, #138808 66.3%, #138808 100%)'
      }} />

      {/* Top Institutional Bar */}
      <header style={{
        background: '#ffffff',
        borderBottom: '1px solid #e2e8f0',
        padding: '12px 28px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        boxShadow: '0 1px 2px rgba(0,0,0,0.02)'
      }}>
        <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 12, textDecoration: 'none' }}>
          <div style={{
            width: 38,
            height: 38,
            borderRadius: 6,
            background: '#0f2942',
            color: '#ffffff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: 800,
            fontSize: '1.1rem'
          }}>
            <Shield size={20} />
          </div>
          <div>
            <div style={{ fontSize: '0.9rem', fontWeight: 700, color: '#0f172a', lineHeight: 1.2 }}>
              {t('aicteFull')}
            </div>
            <div style={{ fontSize: '0.72rem', color: '#64748b' }}>
              {t('ministryEdu')}
            </div>
          </div>
        </Link>

        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <LanguageSwitcher compact />
          <Link href="/" className="btn btn-secondary btn-sm">
            {t('portalTitle')}
          </Link>
        </div>
      </header>

      {/* Main Login Card Container */}
      <main style={{
        flex: 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '32px 16px'
      }}>
        <div className="card" style={{
          maxWidth: 480,
          width: '100%',
          padding: '32px 36px',
          boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05), 0 2px 4px -2px rgba(0,0,0,0.05)',
          background: '#ffffff',
          borderRadius: 8,
          border: '1px solid #e2e8f0'
        }}>
          {/* Header */}
          <div style={{ textAlign: 'center', marginBottom: 24 }}>
            <div style={{
              display: 'inline-flex',
              padding: '4px 10px',
              background: '#eff6ff',
              borderRadius: 4,
              fontSize: '0.72rem',
              fontWeight: 700,
              color: '#1e40af',
              marginBottom: 10,
              letterSpacing: '0.04em'
            }}>
              {t('ssoBadge')}
            </div>
            <h1 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#0f2942', letterSpacing: '-0.02em', marginBottom: 6 }}>
              {role === 'institution' ? t('institutionPortalTab') : t('councilOfficialTab')}
            </h1>
            <p style={{ fontSize: '0.8rem', color: '#64748b' }}>
              {role === 'institution' ? t('institutionPortalDesc') : t('councilOfficialDesc')}
            </p>
          </div>

          {/* Role Switcher Tabs */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            background: '#f1f5f9',
            padding: 4,
            borderRadius: 6,
            marginBottom: 24,
            border: '1px solid #e2e8f0'
          }}>
            <button
              type="button"
              onClick={() => handleRoleChange('institution')}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 6,
                padding: '8px 10px',
                borderRadius: 4,
                border: 'none',
                background: role === 'institution' ? '#ffffff' : 'transparent',
                color: role === 'institution' ? '#0f2942' : '#64748b',
                fontWeight: role === 'institution' ? 700 : 500,
                fontSize: '0.78rem',
                cursor: 'pointer',
                boxShadow: role === 'institution' ? '0 1px 2px rgba(0,0,0,0.08)' : 'none',
                transition: 'all 0.15s ease'
              }}
            >
              <Building2 size={15} />
              {t('institutionLogin')}
            </button>

            <button
              type="button"
              onClick={() => handleRoleChange('official')}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 6,
                padding: '8px 10px',
                borderRadius: 4,
                border: 'none',
                background: role === 'official' ? '#ffffff' : 'transparent',
                color: role === 'official' ? '#0f2942' : '#64748b',
                fontWeight: role === 'official' ? 700 : 500,
                fontSize: '0.78rem',
                cursor: 'pointer',
                boxShadow: role === 'official' ? '0 1px 2px rgba(0,0,0,0.08)' : 'none',
                transition: 'all 0.15s ease'
              }}
            >
              <UserCheck size={15} />
              {t('officialLogin')}
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div>
              <label style={{ fontSize: '0.78rem', fontWeight: 600, color: '#334155', display: 'block', marginBottom: 4 }}>
                {role === 'institution' ? t('institutionIdLabel') : t('officialIdLabel')}
              </label>
              <input
                type="text"
                required
                value={instituteId}
                onChange={(e) => setInstituteId(e.target.value)}
                style={{
                  width: '100%',
                  padding: '9px 12px',
                  border: '1px solid #cbd5e1',
                  borderRadius: 6,
                  fontSize: '0.86rem',
                  fontFamily: 'monospace',
                  background: '#f8fafc',
                  color: '#0f2942'
                }}
              />
            </div>

            <div>
              <label style={{ fontSize: '0.78rem', fontWeight: 600, color: '#334155', display: 'block', marginBottom: 4 }}>
                {role === 'institution' ? 'Registered Principal / Director Email:' : 'Government NIC Email ID (@gov.in / @aicte-india.org):'}
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={{
                  width: '100%',
                  padding: '9px 12px',
                  border: '1px solid #cbd5e1',
                  borderRadius: 6,
                  fontSize: '0.86rem',
                  color: '#0f2942'
                }}
              />
            </div>

            <div>
              <label style={{ fontSize: '0.78rem', fontWeight: 600, color: '#334155', display: 'block', marginBottom: 4 }}>
                {t('passwordLabel')}:
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '9px 36px 9px 12px',
                    border: '1px solid #cbd5e1',
                    borderRadius: 6,
                    fontSize: '0.86rem',
                    color: '#0f2942'
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    position: 'absolute',
                    right: 10,
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'none',
                    border: 'none',
                    color: '#64748b',
                    cursor: 'pointer',
                    padding: 0
                  }}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {/* Security note */}
            <div style={{
              background: '#f8fafc',
              border: '1px solid #e2e8f0',
              padding: '10px 12px',
              borderRadius: 6,
              display: 'flex',
              gap: 8,
              alignItems: 'center',
              fontSize: '0.72rem',
              color: '#64748b'
            }}>
              <Lock size={14} style={{ color: '#16a34a', flexShrink: 0 }} />
              <span>
                {t('securityEncrypted')} • {t('securityAPH')}
              </span>
            </div>

            <button
              type="submit"
              disabled={loggingIn}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 8,
                padding: '11px',
                background: role === 'institution' ? '#0284c7' : '#0f2942',
                color: '#ffffff',
                border: 'none',
                borderRadius: 6,
                fontWeight: 700,
                fontSize: '0.9rem',
                cursor: 'pointer',
                boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
                transition: 'background 0.15s ease'
              }}
            >
              <span>{loggingIn ? t('loggingIn') : t('signInBtn')}</span>
              <ArrowRight size={15} />
            </button>
          </form>

          {/* Quick SSO Divider */}
          <div style={{
            marginTop: 20,
            paddingTop: 16,
            borderTop: '1px solid #e2e8f0',
            textAlign: 'center'
          }}>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => {
                if (role === 'institution') router.push('/institution');
                else router.push('/dashboard');
              }}
              style={{
                width: '100%',
                padding: '9px',
                fontSize: '0.8rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 8
              }}
            >
              <Shield size={16} style={{ color: '#15803d' }} />
              Login via DigiLocker / MeriPehchaan (Single Sign-On)
            </button>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer style={{
        background: '#ffffff',
        borderTop: '1px solid #e2e8f0',
        padding: '16px 24px',
        textAlign: 'center',
        fontSize: '0.72rem',
        color: '#64748b'
      }}>
        All India Council for Technical Education • Ministry of Education, Government of India • National Security Directive compliant
      </footer>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f8fafc' }}>
        <div style={{ color: '#0f2942', fontWeight: 600, fontSize: '0.9rem' }}>Loading secure access gateway...</div>
      </div>
    }>
      <LoginContent />
    </Suspense>
  );
}
