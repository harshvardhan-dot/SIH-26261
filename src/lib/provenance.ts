export type ProvenanceTier = 1 | 2 | 3 | 4;

export interface ProvenanceTierInfo {
  tier: ProvenanceTier;
  code: string;
  name: string;
  shortName: string;
  category: string;
  description: string;
  proofMechanism: string;
  legalGuidance: string;
  badgeBg: string;
  badgeColor: string;
  badgeBorder: string;
  accentColor: string;
  tag: string;
}

export const PROVENANCE_TIERS: Record<ProvenanceTier, ProvenanceTierInfo> = {
  1: {
    tier: 1,
    code: 'LEVEL-1',
    name: 'Level 1: Official Digital Signature',
    shortName: 'Digital Signature',
    category: '100% Verified Genuine',
    description: 'Signed with an official government/university digital signature token.',
    proofMechanism: 'Cryptographically verified with official digital signature authority.',
    legalGuidance: 'Legally 100% valid. No manual re-checking needed.',
    badgeBg: '#eef2ff',
    badgeColor: '#3730a3',
    badgeBorder: '#c7d2fe',
    accentColor: '#4f46e5',
    tag: 'Level 1: Digital Signature'
  },
  2: {
    tier: 2,
    code: 'LEVEL-2',
    name: 'Level 2: Verified with Govt Portal',
    shortName: 'Govt Portal Check',
    category: 'Direct Authority Check',
    description: 'Checked directly with DigiLocker, State Fire Department, or University portal.',
    proofMechanism: 'Confirmed online with the government department that issued it.',
    legalGuidance: 'Confirmed directly by the issuing authority.',
    badgeBg: '#ecfdf5',
    badgeColor: '#065f46',
    badgeBorder: '#a7f3d0',
    accentColor: '#059669',
    tag: 'Level 2: Govt Verified'
  },
  3: {
    tier: 3,
    code: 'LEVEL-3',
    name: 'Level 3: Matches AICTE Records',
    shortName: 'AICTE Record Match',
    category: 'Council Database Match',
    description: 'Matches previous year AICTE approval records, institute ID, and land records.',
    proofMechanism: 'Confirmed matching in AICTE’s permanent approval database.',
    legalGuidance: 'Consistent with previous council records on file.',
    badgeBg: '#f0f9ff',
    badgeColor: '#0369a1',
    badgeBorder: '#bae6fd',
    accentColor: '#0284c7',
    tag: 'Level 3: AICTE Match'
  },
  4: {
    tier: 4,
    code: 'LEVEL-4',
    name: 'Level 4: Needs Manual Check',
    shortName: 'Needs Check',
    category: 'System Flagged for Review',
    description: 'Our system spotted a possible issue (expired date, missing seal, or unclear text).',
    proofMechanism: 'Automated check flagged an issue that an officer needs to review.',
    legalGuidance: 'Please review manually or send a notice to the college before deciding.',
    badgeBg: '#fffbeb',
    badgeColor: '#92400e',
    badgeBorder: '#fde68a',
    accentColor: '#d97706',
    tag: 'Level 4: Needs Review'
  }
};

export function getTierInfo(tier: ProvenanceTier | number): ProvenanceTierInfo {
  const t = (tier >= 1 && tier <= 4) ? (tier as ProvenanceTier) : 4;
  return PROVENANCE_TIERS[t];
}
