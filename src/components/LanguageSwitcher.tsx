'use client';

import React from 'react';
import { useTranslation, LANGUAGES, Language } from '@/lib/i18n';
import { Globe, ChevronDown } from 'lucide-react';

export default function LanguageSwitcher({ compact = false }: { compact?: boolean }) {
  const { language, setLanguage } = useTranslation();

  return (
    <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, position: 'relative' }}>
      <Globe size={15} style={{ color: '#1e40af', flexShrink: 0 }} />
      <select
        id="language-selector"
        name="language-selector"
        value={language || 'en'}
        onChange={(e) => {
          const val = e.target.value as Language;
          setLanguage(val);
        }}
        style={{
          background: '#ffffff',
          border: '1px solid #cbd5e1',
          borderRadius: 4,
          padding: compact ? '4px 8px' : '5px 10px',
          fontSize: '0.78rem',
          fontWeight: 600,
          color: '#0f172a',
          cursor: 'pointer',
          outline: 'none',
          boxShadow: '0 1px 2px rgba(0,0,0,0.03)'
        }}
        title="Select Regional Language"
      >
        {LANGUAGES.map((lang) => (
          <option key={lang.code} value={lang.code}>
            {lang.nativeName} ({lang.name})
          </option>
        ))}
      </select>
    </div>
  );
}
