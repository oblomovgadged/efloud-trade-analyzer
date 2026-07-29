import type { KeyLevel } from '@/lib/types';
import { STRENGTH_COLORS } from '@/lib/constants';

interface KeyLevelsProps {
  levels: KeyLevel[];
}

export function KeyLevels({ levels }: KeyLevelsProps) {
  if (!levels || levels.length === 0) {
    return <div style={{ color: 'var(--text-dim)', fontSize: '0.875rem' }}>Belirlenen belirgin seviye bulunamadı.</div>;
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
      <div style={{
        display: 'grid',
        gridTemplateColumns: '80px 100px 1fr 90px',
        padding: '0.5rem 0.75rem',
        background: 'var(--bg-input)',
        borderRadius: '8px',
        fontSize: '0.75rem',
        fontWeight: 700,
        color: 'var(--text-muted)',
        textTransform: 'uppercase',
        letterSpacing: '0.05em'
      }}>
        <div>TİP</div>
        <div>FİYAT</div>
        <div>AÇIKLAMA</div>
        <div style={{ textAlign: 'right' }}>GÜÇ</div>
      </div>

      {levels.map((lvl, index) => {
        const isSupport = lvl.type === 'support';
        const color = isSupport ? 'var(--bull-green)' : 'var(--bear-red)';

        return (
          <div key={index} style={{
            display: 'grid',
            gridTemplateColumns: '80px 100px 1fr 90px',
            alignItems: 'center',
            padding: '0.75rem',
            background: 'var(--bg-glass)',
            border: '1px solid var(--border-subtle)',
            borderRadius: '10px',
            fontSize: '0.875rem'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', fontWeight: 700, color }}>
              <span>{isSupport ? '🟢' : '🔴'}</span>
              <span>{isSupport ? 'DESTEK' : 'DİRENÇ'}</span>
            </div>

            <div style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, color: 'var(--text-main)' }}>
              {lvl.price}
            </div>

            <div style={{ color: 'var(--text-muted)' }}>
              <div style={{ fontWeight: 600, color: 'var(--text-main)' }}>{lvl.label}</div>
              <div style={{ fontSize: '0.8125rem' }}>{lvl.description}</div>
            </div>

            <div style={{ textAlign: 'right' }}>
              <span style={{
                display: 'inline-block',
                padding: '0.2rem 0.5rem',
                borderRadius: '4px',
                fontSize: '0.75rem',
                fontWeight: 600,
                color: STRENGTH_COLORS[lvl.strength] || 'var(--text-muted)',
                background: 'rgba(255, 255, 255, 0.05)'
              }}>
                {lvl.strength?.toUpperCase() || 'MODERATE'}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
