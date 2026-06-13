import type { ReactElement } from 'react'

type Icon = 'dumbbell' | 'bottle' | 'plate' | 'barbell' | 'bolt' | 'shoe'

const icons: Record<Icon, ReactElement> = {
  dumbbell: (
    <svg width={52} height={52} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.1} strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="10" width="3" height="4" rx="1"/>
      <rect x="5" y="8" width="2" height="8" rx="1"/>
      <line x1="7" y1="12" x2="17" y2="12"/>
      <rect x="17" y="8" width="2" height="8" rx="1"/>
      <rect x="19" y="10" width="3" height="4" rx="1"/>
    </svg>
  ),
  bottle: (
    <svg width={44} height={52} viewBox="0 0 24 28" fill="none" stroke="currentColor" strokeWidth={1.1} strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 2h6v2l2 3v15a2 2 0 01-2 2H9a2 2 0 01-2-2V7l2-3V2z"/>
      <line x1="7" y1="13" x2="17" y2="13"/>
      <line x1="10" y1="2" x2="14" y2="2"/>
    </svg>
  ),
  plate: (
    <svg width={52} height={52} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.1} strokeLinecap="round">
      <circle cx="12" cy="12" r="10"/>
      <circle cx="12" cy="12" r="6"/>
      <circle cx="12" cy="12" r="2"/>
    </svg>
  ),
  barbell: (
    <svg width={60} height={36} viewBox="0 0 32 20" fill="none" stroke="currentColor" strokeWidth={1.1} strokeLinecap="round" strokeLinejoin="round">
      <rect x="1" y="7" width="3" height="6" rx="1"/>
      <rect x="4" y="5" width="2" height="10" rx="1"/>
      <line x1="6" y1="10" x2="26" y2="10"/>
      <rect x="26" y="5" width="2" height="10" rx="1"/>
      <rect x="28" y="7" width="3" height="6" rx="1"/>
    </svg>
  ),
  bolt: (
    <svg width={38} height={52} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.1} strokeLinecap="round" strokeLinejoin="round">
      <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/>
    </svg>
  ),
  shoe: (
    <svg width={56} height={44} viewBox="0 0 30 24" fill="none" stroke="currentColor" strokeWidth={1.1} strokeLinecap="round" strokeLinejoin="round">
      <path d="M2 16c0 0 2-6 7-8l4 2 5-4c2-1 5 0 6 2l2 4c0 2-2 4-4 4H4a2 2 0 01-2-2v0z"/>
      <path d="M9 8l2 4"/>
    </svg>
  ),
}

const sequence: Icon[] = ['dumbbell', 'bottle', 'plate', 'barbell', 'bolt', 'shoe', 'dumbbell', 'plate', 'bolt', 'bottle']

export default function Divider({ index = 0 }: { index?: number }) {
  const icon = icons[sequence[index % sequence.length]]
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 20, paddingBlock: 0, background: 'inherit' }}>
      <div style={{ flex: 1, height: 1, background: 'rgba(255,255,255,0.04)' }} />
      <div style={{ color: 'rgba(255,255,255,0.45)', display: 'flex', alignItems: 'center' }}>
        {icon}
      </div>
      <div style={{ flex: 1, height: 1, background: 'rgba(255,255,255,0.04)' }} />
    </div>
  )
}
