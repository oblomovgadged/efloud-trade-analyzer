'use client';

import { INSTRUMENT_CONFIG } from '@/lib/constants';

interface InstrumentFilterProps {
  selected: string;
  onSelect: (instrument: string) => void;
}

export function InstrumentFilter({ selected, onSelect }: InstrumentFilterProps) {
  const instruments = ['ALL', ...Object.keys(INSTRUMENT_CONFIG)];

  return (
    <div style={{
      display: 'flex',
      gap: '0.5rem',
      overflowX: 'auto',
      paddingBottom: '0.5rem',
      scrollbarWidth: 'none'
    }}>
      {instruments.map((inst) => {
        const isSelected = selected === inst;
        const conf = INSTRUMENT_CONFIG[inst];
        const label = inst === 'ALL' ? '🌐 Tümü' : inst;

        return (
          <button
            key={inst}
            onClick={() => onSelect(inst)}
            style={{
              padding: '0.4rem 0.875rem',
              borderRadius: '9999px',
              fontSize: '0.8125rem',
              fontWeight: 600,
              cursor: 'pointer',
              whiteSpace: 'nowrap',
              border: isSelected ? '1px solid var(--accent-gold)' : '1px solid var(--border-subtle)',
              background: isSelected ? 'rgba(245, 158, 11, 0.15)' : 'var(--bg-card)',
              color: isSelected ? 'var(--accent-gold)' : 'var(--text-muted)',
              transition: 'all 0.2s ease'
            }}
          >
            {label} {conf && <span style={{ opacity: 0.6, fontSize: '0.75rem', marginLeft: '0.25rem' }}>({conf.category})</span>}
          </button>
        );
      })}
    </div>
  );
}
