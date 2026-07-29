import { BIAS_COLORS } from '@/lib/constants';
import type { Bias } from '@/lib/types';

interface BiasIndicatorProps {
  bias: Bias;
  confidence?: number;
  showBar?: boolean;
}

export function BiasIndicator({ bias, confidence, showBar = true }: BiasIndicatorProps) {
  const config = BIAS_COLORS[bias] || BIAS_COLORS.neutral;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.375rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <span className={`badge badge-${bias}`}>
          {config.emoji} {bias.toUpperCase()}
        </span>
        {confidence !== undefined && (
          <span style={{ fontSize: '0.8125rem', fontWeight: 600, color: config.text, fontFamily: 'var(--font-mono)' }}>
            %{confidence} Güven
          </span>
        )}
      </div>

      {showBar && confidence !== undefined && (
        <div style={{
          width: '100%',
          height: '4px',
          background: 'var(--bg-input)',
          borderRadius: '2px',
          overflow: 'hidden'
        }}>
          <div style={{
            width: `${confidence}%`,
            height: '100%',
            background: config.border,
            transition: 'width 0.5s ease'
          }} />
        </div>
      )}
    </div>
  );
}
