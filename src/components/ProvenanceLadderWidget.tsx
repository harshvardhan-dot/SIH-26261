'use client';

import React from 'react';
import { PROVENANCE_TIERS, ProvenanceTier } from '@/lib/provenance';
import { ShieldCheck, Database, History, AlertCircle, Info, Scale } from 'lucide-react';

interface ProvenanceLadderWidgetProps {
  stats?: {
    tier1Count: number;
    tier2Count: number;
    tier3Count: number;
    tier4Count: number;
  };
  compact?: boolean;
}

export default function ProvenanceLadderWidget({
  stats = { tier1Count: 48, tier2Count: 74, tier3Count: 39, tier4Count: 14 },
  compact = false
}: ProvenanceLadderWidgetProps) {
  const total = stats.tier1Count + stats.tier2Count + stats.tier3Count + stats.tier4Count;

  const tiersData = [
    { tier: 1 as ProvenanceTier, count: stats.tier1Count, icon: ShieldCheck },
    { tier: 2 as ProvenanceTier, count: stats.tier2Count, icon: Database },
    { tier: 3 as ProvenanceTier, count: stats.tier3Count, icon: History },
    { tier: 4 as ProvenanceTier, count: stats.tier4Count, icon: AlertCircle },
  ];

  return (
    <div style={{
      background: '#ffffff',
      border: '1px solid #e2e8f0',
      borderRadius: 8,
      padding: compact ? '16px 20px' : '22px 24px',
      boxShadow: '0 1px 3px rgba(0,0,0,0.03)'
    }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{
            width: 34,
            height: 34,
            borderRadius: 6,
            background: '#eff6ff',
            color: '#1e40af',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <Scale size={18} />
          </div>
          <div>
            <div style={{ fontSize: '0.92rem', fontWeight: 700, color: '#0f172a', lineHeight: 1.2 }}>
              Evidence Provenance Ladder
            </div>
            <div style={{ fontSize: '0.72rem', color: '#64748b' }}>
              Hierarchical Proof Strength (Replacing Arbitrary AI Scores)
            </div>
          </div>
        </div>

        <span style={{
          background: '#f8fafc',
          border: '1px solid #e2e8f0',
          fontSize: '0.72rem',
          fontWeight: 700,
          color: '#334155',
          padding: '3px 8px',
          borderRadius: 4
        }}>
          {total} Total Checks
        </span>
      </div>

      {/* Visual Tiers Stack */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {tiersData.map(({ tier, count, icon: Icon }) => {
          const info = PROVENANCE_TIERS[tier];
          const pct = total > 0 ? Math.round((count / total) * 100) : 0;

          return (
            <div
              key={tier}
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: 5,
                padding: '8px 12px',
                borderRadius: 6,
                background: '#f8fafc',
                border: `1px solid ${info.badgeBorder}`,
                borderLeft: `4px solid ${info.accentColor}`
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <Icon size={14} style={{ color: info.accentColor }} />
                  <span style={{ fontSize: '0.78rem', fontWeight: 700, color: '#0f172a' }}>
                    {info.name}
                  </span>
                  <span style={{
                    fontSize: '0.65rem',
                    color: info.badgeColor,
                    background: info.badgeBg,
                    padding: '1px 6px',
                    borderRadius: 3,
                    fontWeight: 600
                  }}>
                    {info.category}
                  </span>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <span style={{ fontSize: '0.78rem', fontWeight: 800, color: '#0f172a' }}>
                    {count}
                  </span>
                  <span style={{ fontSize: '0.7rem', color: '#64748b' }}>
                    ({pct}%)
                  </span>
                </div>
              </div>

              {/* Mini Progress Line */}
              <div style={{ height: 4, background: '#e2e8f0', borderRadius: 2, overflow: 'hidden' }}>
                <div style={{
                  height: '100%',
                  width: `${pct}%`,
                  background: info.accentColor,
                  borderRadius: 2
                }} />
              </div>

              {!compact && (
                <div style={{ fontSize: '0.68rem', color: '#64748b', lineHeight: 1.35 }}>
                  {info.description} • <strong style={{ color: tier === 4 ? '#b45309' : '#15803d' }}>{tier === 4 ? 'Investigative Hint Only' : 'Statutory Grounding'}</strong>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Officer Advisory Footer */}
      <div style={{
        marginTop: 14,
        padding: '8px 10px',
        background: '#fffbeb',
        border: '1px solid #fde68a',
        borderRadius: 5,
        display: 'flex',
        alignItems: 'flex-start',
        gap: 8,
        fontSize: '0.7rem',
        color: '#92400e',
        lineHeight: 1.4
      }}>
        <Info size={13} style={{ flexShrink: 0, marginTop: 1, color: '#d97706' }} />
        <span>
          <strong>Scrutiny Notice:</strong> Tiers 1–3 provide verifiable proof. Tier 4 flags are preliminary forensic heuristics requiring officer inquiry before any adverse decision.
        </span>
      </div>
    </div>
  );
}
