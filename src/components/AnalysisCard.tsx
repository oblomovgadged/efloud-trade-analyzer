import Link from 'next/link';
import type { TweetAnalysis } from '@/lib/types';
import { TraderBadge } from './TraderBadge';
import { BiasIndicator } from './BiasIndicator';
import { INSTRUMENT_CONFIG } from '@/lib/constants';

interface AnalysisCardProps {
  analysis: TweetAnalysis;
}

export function AnalysisCard({ analysis }: AnalysisCardProps) {
  const primary = analysis.analysis.primaryInstrument || 'EURUSD';
  const instConfig = INSTRUMENT_CONFIG[primary] || { label: primary, color: '#3b82f6', category: 'Market' };
  const firstImage = analysis.imageUrls?.[0];

  const formattedDate = new Date(analysis.tweetDate || analysis.analyzedAt).toLocaleDateString('tr-TR', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });

  return (
    <div className="glass-card glow-hover animate-fade-in" style={{ display: 'flex', flexDirection: 'column' }}>
      {/* Thumbnail Header */}
      {firstImage && (
        <div style={{ height: '180px', overflow: 'hidden', background: '#020617', position: 'relative' }}>
          <img 
            src={firstImage} 
            alt={primary}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            onError={(e) => {
              e.currentTarget.src = 'https://placehold.co/600x300/0f172a/f59e0b?text=' + primary + '+Grafik+Analizi';
            }}
          />
          <div style={{
            position: 'absolute',
            top: '12px',
            left: '12px',
            background: 'rgba(15, 23, 42, 0.85)',
            backdropFilter: 'blur(8px)',
            padding: '0.25rem 0.625rem',
            borderRadius: '6px',
            fontSize: '0.75rem',
            fontWeight: 700,
            color: instConfig.color,
            border: `1px solid ${instConfig.color}40`
          }}>
            {primary}
          </div>
        </div>
      )}

      {/* Card Content */}
      <div style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '1rem', flex: 1 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <TraderBadge 
            username={analysis.traderUsername} 
            displayName={analysis.traderDisplayName} 
          />
          <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>
            {formattedDate}
          </span>
        </div>

        <div>
          <BiasIndicator 
            bias={analysis.analysis.bias} 
            confidence={analysis.analysis.biasConfidence} 
          />
        </div>

        <p style={{
          fontSize: '0.875rem',
          color: 'var(--text-muted)',
          display: '-webkit-box',
          WebkitLineClamp: 3,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden',
          lineHeight: 1.5,
          flex: 1
        }}>
          {analysis.analysis.summary || analysis.tweetText}
        </p>

        {/* Level & Signal summary badges */}
        <div style={{ display: 'flex', gap: '0.5rem', fontSize: '0.75rem', color: 'var(--text-dim)' }}>
          <span>📊 {analysis.analysis.keyLevels?.length || 0} Seviye</span>
          <span>•</span>
          <span>🎯 {analysis.analysis.tradingSignals?.length || 0} Sinyal</span>
        </div>

        {/* Action Button */}
        <Link 
          href={`/analysis/${analysis.id}`} 
          className="btn btn-secondary" 
          style={{ width: '100%', marginTop: 'auto', textAlign: 'center', fontSize: '0.875rem' }}
        >
          Detaylı Analizi İncele →
        </Link>
      </div>
    </div>
  );
}
