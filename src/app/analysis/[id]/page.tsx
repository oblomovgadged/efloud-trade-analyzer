import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getAnalysisById } from '@/lib/storage';
import { TraderBadge } from '@/components/TraderBadge';
import { BiasIndicator } from '@/components/BiasIndicator';
import { KeyLevels } from '@/components/KeyLevels';
import { TradingSignals } from '@/components/TradingSignals';
import { ChartViewer } from '@/components/ChartViewer';
import { INSTRUMENT_CONFIG } from '@/lib/constants';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function AnalysisDetailPage({ params }: PageProps) {
  const { id } = await params;
  const item = await getAnalysisById(id);

  if (!item) {
    notFound();
  }

  const primary = item.analysis.primaryInstrument || 'EURUSD';
  const instConfig = INSTRUMENT_CONFIG[primary] || { label: primary, color: '#3b82f6', category: 'Market' };

  const formattedDate = new Date(item.tweetDate || item.analyzedAt).toLocaleDateString('tr-TR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });

  return (
    <div className="app-container" style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {/* Back Button & Header */}
      <div>
        <Link href="/" className="btn btn-secondary" style={{ display: 'inline-flex', padding: '0.4rem 0.875rem', fontSize: '0.8125rem', marginBottom: '1.25rem' }}>
          ← Tüm Analizlere Dön
        </Link>

        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{
              padding: '0.4rem 0.875rem',
              borderRadius: '8px',
              fontWeight: 800,
              fontSize: '1.125rem',
              color: instConfig.color,
              background: 'var(--bg-input)',
              border: `1px solid ${instConfig.color}40`
            }}>
              {primary}
            </div>
            <div>
              <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-main)' }}>
                {primary} Teknik Analiz & Fed Güncellemesi
              </h1>
              <div style={{ fontSize: '0.8125rem', color: 'var(--text-dim)', marginTop: '0.25rem' }}>
                Yayınlanma: {formattedDate}
              </div>
            </div>
          </div>

          <TraderBadge username={item.traderUsername} displayName={item.traderDisplayName} />
        </div>
      </div>

      {/* Main Grid: Chart + Bias Summary */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem' }}>
        {/* Left Column: Chart Viewer */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <h2 style={{ fontSize: '1.125rem', fontWeight: 700, color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            🖼️ Orijinal Grafik Analizi
          </h2>
          <ChartViewer imageUrls={item.imageUrls} />
        </div>

        {/* Right Column: AI Executive Summary & Bias */}
        <div className="glass-card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <h2 style={{ fontSize: '1.125rem', fontWeight: 700, color: 'var(--text-main)' }}>
            🤖 AI Özet & Piyasa Yönü (Bias)
          </h2>

          <BiasIndicator bias={item.analysis.bias} confidence={item.analysis.biasConfidence} />

          <div style={{ background: 'var(--bg-input)', padding: '1rem', borderRadius: '10px', fontSize: '0.875rem' }}>
            <strong style={{ color: 'var(--accent-gold)', display: 'block', marginBottom: '0.25rem' }}>
              🎯 Yön Gerekçesi (Bias Reasoning):
            </strong>
            <p style={{ color: 'var(--text-main)', lineHeight: 1.5 }}>
              {item.analysis.biasReasoning}
            </p>
          </div>

          <div style={{ fontSize: '0.875rem', color: 'var(--text-muted)', lineHeight: 1.6 }}>
            <strong style={{ color: 'var(--text-main)', display: 'block', marginBottom: '0.25rem' }}>
              📝 Analiz Özeti:
            </strong>
            {item.analysis.summary}
          </div>

          {item.tweetUrl && (
            <a 
              href={item.tweetUrl} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="btn btn-secondary" 
              style={{ fontSize: '0.8125rem', marginTop: 'auto', textAlign: 'center' }}
            >
              🐦 X (Twitter)'da Orijinal Tweet'i Görüntüle ↗
            </a>
          )}
        </div>
      </div>

      {/* Teacher Explanation Card */}
      {item.analysis.teacherExplanation && (
        <div className="glass-card" style={{
          padding: '1.75rem',
          background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.9) 0%, rgba(245, 158, 11, 0.08) 100%)',
          border: '1px solid rgba(245, 158, 11, 0.25)'
        }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--accent-gold)', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            👨‍🏫 Eğitmen Anlatımı (Basitçe Ne Anlama Geliyor?)
          </h2>
          <div style={{ color: 'var(--text-main)', fontSize: '0.9375rem', lineHeight: 1.7, whiteSpace: 'pre-line' }}>
            {item.analysis.teacherExplanation}
          </div>
        </div>
      )}

      {/* Detailed Analysis Section */}
      <div className="glass-card" style={{ padding: '1.75rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-main)' }}>
          🔍 Detaylı Teknik Analiz & Formasyonlar
        </h2>
        <p style={{ color: 'var(--text-muted)', lineHeight: 1.7, whiteSpace: 'pre-line' }}>
          {item.analysis.detailedAnalysis}
        </p>

        {item.analysis.chartPatterns && item.analysis.chartPatterns.length > 0 && (
          <div style={{ marginTop: '1rem', display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
            {item.analysis.chartPatterns.map((pat, i) => (
              <div key={i} style={{
                background: 'var(--bg-input)',
                border: '1px solid var(--border-subtle)',
                padding: '0.5rem 0.875rem',
                borderRadius: '8px',
                fontSize: '0.8125rem'
              }}>
                <strong style={{ color: 'var(--accent-cyan)' }}>📐 {pat.name}</strong> ({pat.status}) — {pat.implication}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Key Support / Resistance Levels */}
      <div className="glass-card" style={{ padding: '1.75rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-main)' }}>
          📍 Kritik Destek ve Direnç Seviyeleri
        </h2>
        <KeyLevels levels={item.analysis.keyLevels} />
      </div>

      {/* Trading Signals Section */}
      <div className="glass-card" style={{ padding: '1.75rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-main)' }}>
          🎯 Olası İşlem Sinyalleri & Stratejiler
        </h2>
        <TradingSignals signals={item.analysis.tradingSignals} />
      </div>

      {/* Market Context & Risk Warnings */}
      {item.analysis.riskWarnings && item.analysis.riskWarnings.length > 0 && (
        <div style={{
          background: 'var(--bear-bg)',
          border: '1px solid var(--bear-border)',
          borderRadius: '12px',
          padding: '1.5rem',
          color: 'var(--bear-red)'
        }}>
          <h3 style={{ fontSize: '1rem', fontWeight: 800, marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            ⚠️ Kritik Risk Uyarıları & Makro Görünüm
          </h3>
          <ul style={{ paddingLeft: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.875rem' }}>
            {item.analysis.riskWarnings.map((warn, i) => (
              <li key={i}>{warn}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Original Tweet Text Drawer */}
      <div className="glass-card" style={{ padding: '1.5rem' }}>
        <h3 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '0.75rem' }}>
          💬 Orijinal Tweet Metni:
        </h3>
        <p style={{
          color: 'var(--text-dim)',
          fontSize: '0.875rem',
          fontStyle: 'italic',
          lineHeight: 1.6,
          whiteSpace: 'pre-line',
          background: 'var(--bg-input)',
          padding: '1rem',
          borderRadius: '8px'
        }}>
          "{item.tweetText}"
        </p>
      </div>
    </div>
  );
}
