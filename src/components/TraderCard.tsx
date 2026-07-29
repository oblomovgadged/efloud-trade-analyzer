'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import type { Trader } from '@/lib/types';

interface TraderCardProps {
  trader: Trader;
}

export function TraderCard({ trader }: TraderCardProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleAnalyze = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch(`/api/fetch-tweets?username=${encodeURIComponent(trader.username)}`);
      const data = await res.json();
      if (data.success && data.data?.id) {
        router.push(`/analysis/${data.data.id}`);
      } else {
        setError(data.error || 'Analiz başarısız oldu.');
      }
    } catch (err: any) {
      setError(err.message || 'Bağlantı hatası.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="glass-card glow-hover animate-fade-in" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
        <div style={{
          width: '48px', height: '48px', borderRadius: '50%',
          background: 'linear-gradient(135deg, #f59e0b, #d97706)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: '1.25rem', fontWeight: 'bold', color: '#080c14',
          boxShadow: '0 0 15px rgba(245, 158, 11, 0.25)'
        }}>
          {trader.displayName?.[0]?.toUpperCase() || 'T'}
        </div>
        <div>
          <div style={{ fontWeight: 700, fontSize: '1.125rem', color: 'var(--text-main)' }}>
            {trader.displayName}
          </div>
          <a href={trader.twitterUrl} target="_blank" rel="noopener noreferrer"
            style={{ fontSize: '0.8125rem', color: 'var(--accent-blue)', textDecoration: 'none' }}>
            @{trader.username}
          </a>
        </div>
      </div>

      {trader.lastAnalyzedAt && (
        <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>
          Son Analiz: {new Date(trader.lastAnalyzedAt).toLocaleDateString('tr-TR', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
        </div>
      )}

      {error && (
        <div style={{ background: 'var(--bear-bg)', border: '1px solid var(--bear-border)', color: 'var(--bear-red)', padding: '0.5rem 0.75rem', borderRadius: '8px', fontSize: '0.8125rem' }}>
          ⚠️ {error}
        </div>
      )}

      <button
        onClick={handleAnalyze}
        disabled={loading}
        className="btn btn-primary"
        style={{ width: '100%', padding: '0.75rem', fontSize: '0.9375rem', marginTop: 'auto' }}
      >
        {loading ? '🤖 Tweetler Çekiliyor & AI Analiz Ediyor...' : '📊 Son Grafikli Tweet\'i Analiz Et'}
      </button>
    </div>
  );
}
