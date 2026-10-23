'use client';

import React, { useState } from 'react';
import { getTierInfo, ProvenanceTier } from '@/lib/provenance';
import { ShieldCheck, Database, History, AlertCircle, Info } from 'lucide-react';

interface ProvenanceBadgeProps {
  tier: ProvenanceTier | number;
  showDetails?: boolean;
  size?: 'sm' | 'md';
}

const tierIcons = {
  1: ShieldCheck,
  2: Database,
  3: History,
  4: AlertCircle,
};

export default function ProvenanceBadge({ tier, showDetails = false, size = 'sm' }: ProvenanceBadgeProps) {
  const [showTooltip, setShowTooltip] = useState(false);
  const info = getTierInfo(tier);
  const Icon = tierIcons[info.tier];

  return (
    <div style={{ position: 'relative', display: 'inline-flex', alignItems: 'center' }}>
      <span
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: 5,
          padding: size === 'sm' ? '2px 7px' : '4px 10px',
          borderRadius: 4,
          background: info.badgeBg,
          color: info.badgeColor,
          border: `1px solid ${info.badgeBorder}`,
          fontSize: size === 'sm' ? '0.7rem' : '0.78rem',
          fontWeight: 700,
          cursor: 'help',
          whiteSpace: 'nowrap',
          letterSpacing: '0.01em',
          boxShadow: '0 1px 2px rgba(0,0,0,0.02)'
        }}
      >
        <Icon size={size === 'sm' ? 12 : 14} style={{ color: info.accentColor, flexShrink: 0 }} />
        <span>{showDetails ? info.name : info.tag}</span>
      </span>

      {/* Interactive Tooltip with Legal Guidance */}
      {showTooltip && (
        <div style={{
          position: 'absolute',
          bottom: 'calc(100% + 6px)',
          left: '50%',
          transform: 'translateX(-50%)',
          width: 280,
          background: '#0f2942',
          color: '#ffffff',
          borderRadius: 6,
          padding: '10px 12px',
          fontSize: '0.72rem',
          boxShadow: '0 8px 16px rgba(0,0,0,0.2)',
          zIndex: 100,
          lineHeight: 1.45,
          pointerEvents: 'none',
          border: '1px solid rgba(255,255,255,0.1)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 }}>
            <span style={{ fontWeight: 800, color: '#93c5fd', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              {info.name}
            </span>
            <span style={{ fontSize: '0.65rem', background: 'rgba(255,255,255,0.15)', padding: '1px 5px', borderRadius: 3 }}>
              {info.category}
            </span>
          </div>
          <p style={{ color: '#e2e8f0', marginBottom: 6 }}>
            {info.proofMechanism}
          </p>
          <div style={{
            borderTop: '1px solid rgba(255,255,255,0.15)',
            paddingTop: 5,
            color: info.tier === 4 ? '#fcd34d' : '#86efac',
            fontWeight: 600,
            fontSize: '0.68rem'
          }}>
            ⚖️ {info.legalGuidance}
          </div>
        </div>
      )}
    </div>
  );
}
