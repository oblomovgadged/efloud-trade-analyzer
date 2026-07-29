import type { TradingSignal } from '@/lib/types';

interface TradingSignalsProps {
  signals: TradingSignal[];
}

export function TradingSignals({ signals }: TradingSignalsProps) {
  if (!signals || signals.length === 0) {
    return <div style={{ color: 'var(--text-dim)', fontSize: '0.875rem' }}>Öne çıkan aktif trade sinyali yok.</div>;
  }

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem' }}>
      {signals.map((sig, index) => {
        const isLong = sig.direction === 'long';
        const accentColor = isLong ? 'var(--bull-green)' : 'var(--bear-red)';
        const borderColor = isLong ? 'var(--bull-border)' : 'var(--bear-border)';
        const bgColor = isLong ? 'var(--bull-bg)' : 'var(--bear-bg)';

        return (
          <div key={index} style={{
            background: bgColor,
            border: `1px solid ${borderColor}`,
            borderRadius: '12px',
            padding: '1.25rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.875rem'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{
                fontWeight: 800,
                fontSize: '1rem',
                color: accentColor,
                display: 'flex',
                alignItems: 'center',
                gap: '0.375rem'
              }}>
                {isLong ? '📈 LONG (ALIM) STRATEJİSİ' : '📉 SHORT (SATIŞ) STRATEJİSİ'}
              </span>
              {sig.riskReward && (
                <span style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  background: 'rgba(0, 0, 0, 0.4)',
                  padding: '0.2rem 0.5rem',
                  borderRadius: '6px',
                  color: 'var(--accent-gold)'
                }}>
                  R/R: {sig.riskReward}
                </span>
              )}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', fontSize: '0.875rem' }}>
              <div style={{ background: 'rgba(0, 0, 0, 0.25)', padding: '0.5rem 0.75rem', borderRadius: '8px' }}>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>GİRİŞ BÖLGESİ</div>
                <div style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, color: 'var(--text-main)' }}>
                  {sig.entryZone}
                </div>
              </div>

              <div style={{ background: 'rgba(0, 0, 0, 0.25)', padding: '0.5rem 0.75rem', borderRadius: '8px' }}>
                <div style={{ fontSize: '0.75rem', color: 'var(--bear-red)' }}>STOP LOSS (ZARAR KES)</div>
                <div style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, color: 'var(--bear-red)' }}>
                  {sig.stopLoss}
                </div>
              </div>
            </div>

            {sig.takeProfit && sig.takeProfit.length > 0 && (
              <div style={{ background: 'rgba(0, 0, 0, 0.25)', padding: '0.5rem 0.75rem', borderRadius: '8px', fontSize: '0.875rem' }}>
                <div style={{ fontSize: '0.75rem', color: 'var(--bull-green)' }}>TAKE PROFIT (KAR AL HEDEFLERİ)</div>
                <div style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, color: 'var(--bull-green)', display: 'flex', gap: '0.5rem' }}>
                  {sig.takeProfit.map((tp, i) => (
                    <span key={i} style={{ background: 'rgba(16, 185, 129, 0.15)', padding: '0.1rem 0.4rem', borderRadius: '4px' }}>
                      TP{i + 1}: {tp}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {sig.reasoning && (
              <div style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', lineHeight: 1.4 }}>
                💡 <strong>Gerekçe:</strong> {sig.reasoning}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
