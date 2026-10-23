'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard, FileText, Shield, Search,
  ClipboardList, History, Settings, Bell, ChevronRight,
  BarChart3, AlertTriangle, FileCheck
} from 'lucide-react';

import { useTranslation } from '@/lib/i18n';

const navSections = [
  {
    titleKey: 'mainMenu',
    items: [
      { labelKey: 'mainDashboard', href: '/dashboard', icon: LayoutDashboard },
      { labelKey: 'applications', href: '/applications', icon: FileText, badge: 24 },
      { labelKey: 'documentReview', href: '/validation', icon: FileCheck, badge: 5 },
    ]
  },
  {
    titleKey: 'verificationTools',
    items: [
      { labelKey: 'collusionRadar', href: '/collusion', icon: AlertTriangle, badge: 'USP' },
      { labelKey: 'govtChecks', href: '/verification', icon: Search },
      { labelKey: 'rulesRequirements', href: '/compliance', icon: ClipboardList },
    ]
  },
  {
    titleKey: 'system',
    items: [
      { labelKey: 'activityLog', href: '/audit', icon: History },
      { labelKey: 'settings', href: '/settings', icon: Settings },
    ]
  }
];

export default function Sidebar() {
  const pathname = usePathname();
  const { t } = useTranslation();

  return (
    <aside className="sidebar">
      {/* Indian Tricolor Accent Line */}
      <div style={{
        height: '3px',
        width: '100%',
        background: 'linear-gradient(90deg, #FF9933 0%, #FF9933 33.3%, #ffffff 33.3%, #ffffff 66.6%, #138808 66.6%, #138808 100%)'
      }} />

      <div className="sidebar-logo">
        <div className="logo-icon">
          <Shield size={20} />
        </div>
        <div className="logo-text">
          <h1>{t('aicteVerify')}</h1>
          <span>{t('ministryOfEducation')}</span>
        </div>
      </div>

      <nav className="sidebar-nav">
        {navSections.map((section) => (
          <div key={section.titleKey} className="nav-section">
            <div className="nav-section-title">{t(section.titleKey)}</div>
            {section.items.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href ||
                (item.href !== '/dashboard' && pathname.startsWith(item.href));
              const label = t(item.labelKey);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`nav-item ${isActive ? 'active' : ''}`}
                >
                  <Icon className="nav-icon" size={18} />
                  <span>{label}</span>
                  {item.badge && (
                    <span className="nav-badge" style={{
                      background: item.badge === 'USP' ? '#ecfdf5' : '#f1f5f9',
                      color: item.badge === 'USP' ? '#065f46' : '#334155',
                      border: '1px solid ' + (item.badge === 'USP' ? '#a7f3d0' : '#cbd5e1'),
                      fontWeight: item.badge === 'USP' ? 700 : 600,
                      fontSize: item.badge === 'USP' ? '0.65rem' : '0.72rem',
                      letterSpacing: item.badge === 'USP' ? '0.05em' : 'normal',
                    }}>
                      {item.badge}
                    </span>
                  )}
                  {isActive && <ChevronRight size={14} style={{ marginLeft: 'auto', opacity: 0.6 }} />}
                </Link>
              );
            })}
          </div>
        ))}

        {/* Institution Portal Quick Link */}
        <div style={{ marginTop: 'auto', padding: '12px 10px 0' }}>
          <Link
            href="/institution"
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '10px 12px',
              borderRadius: 6,
              background: '#f8fafc',
              border: '1px solid #cbd5e1',
              color: '#0f2942',
              fontSize: '0.78rem',
              fontWeight: 600,
              textDecoration: 'none'
            }}
          >
            <span>{t('institutionPortal')}</span>
            <span style={{ fontSize: '0.68rem', color: '#0284c7', background: '#e0f2fe', padding: '2px 6px', borderRadius: 4, fontWeight: 700 }}>
              OPEN ↗
            </span>
          </Link>
        </div>
      </nav>

      {/* User Session Footer */}
      <div style={{
        padding: '14px 16px',
        borderTop: '1px solid #e2e8f0',
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        background: '#ffffff'
      }}>
        <div style={{
          width: 34,
          height: 34,
          borderRadius: 6,
          background: '#0f2942',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '0.75rem',
          fontWeight: 700,
          color: 'white',
          flexShrink: 0,
        }}>
          RK
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: '0.82rem', fontWeight: 600, color: '#0f172a' }}>
            Dr. Rajesh Kumar
          </div>
          <div style={{ fontSize: '0.7rem', color: '#64748b' }}>
            Scrutiny Bureau, AICTE
          </div>
        </div>
      </div>
    </aside>
  );
}
