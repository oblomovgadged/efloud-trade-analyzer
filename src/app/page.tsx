'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import type { Trader, TweetAnalysis } from '@/lib/types';
import { TraderCard } from '@/components/TraderCard';
import { AddTraderForm } from '@/components/AddTraderForm';
import { AnalysisCard } from '@/components/AnalysisCard';
import { LoadingSpinner } from '@/components/LoadingSpinner';

export default function HomePage() {
  const [traders, setTraders] = useState<Trader[]>([]);
  const [analyses, setAnalyses] = useState<TweetAnalysis[]>([]);
  const [loadingTraders, setLoadingTraders] = useState(true);
  const [loadingAnalyses, setLoadingAnalyses] = useState(true);

  const fetchTraders = async () => {
    setLoadingTraders(true);
    try {
      const res = await fetch('/api/traders');
      const data = await res.json();
      if (data.success) setTraders(data.data);
    } catch (err) { console.error(err); }
    setLoadingTraders(false);
  };

  const fetchAnalyses = async () => {
    setLoadingAnalyses(true);
    try {
      const res = await fetch('/api/tweets');
      const data = await res.json();
      if (data.success) setAnalyses(data.data);
    } catch (err) { console.error(err); }
    setLoadingAnalyses(false);
  };

  useEffect(() => { fetchTraders(); fetchAnalyses(); }, []);

  const handleDeleteTrader = async (username: string) => {
    try {
      await fetch(`/api/traders?username=${encodeURIComponent(username)}`, { method: 'DELETE' });
      fetchTraders();
    } catch (err) { console.error(err); }
  };

  return (
    <div className="app-container" style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
      {/* Hero */}
      <div className="glass-card animate-fade-in" style={{
        padding: '2.5rem 2rem',
        background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.9) 0%, rgba(30, 58, 138, 0.25) 100%)',
        border: '1px solid rgba(59, 130, 246, 0.2)',
      }}>
        <div style={{ maxWidth: '750px', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
            padding: '0.25rem 0.75rem', background: 'rgba(245, 158, 11, 0.15)',
            border: '1px solid rgba(245, 158, 11, 0.3)', borderRadius: '9999px',
            color: 'var(--accent-gold)', fontSize: '0.8125rem', fontWeight: 700, width: 'fit-content'
          }}>
            ⚡ Otomatik Piyasa İstihbarat Platformu
          </div>
          <h1 style={{ fontSize: '2.25rem', fontWeight: 800, lineHeight: 1.2 }}>
            Trader'a Tıkla, <br/>
            <span style={{ background: 'linear-gradient(135deg, #60a5fa, #f59e0b)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              AI Otomatik Analiz Etsin
            </span>
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '1rem', lineHeight: 1.6 }}>
            Trader ekle → Tıkla → Sistem son grafikli tweet'i otomatik çeker → Gemini Vision AI analiz eder → Sonuç karşına çıkar.
          </p>
        </div>
      </div>

      {/* Add Trader Section */}
      <div className="glass-card" style={{ padding: '1.5rem' }}>
        <h2 style={{ fontSize: '1.125rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: '1rem' }}>
          ➕ Yeni Trader Ekle
        </h2>
        <AddTraderForm onAdded={fetchTraders} />
      </div>

      {/* Traders Grid */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-main)' }}>
            👤 Takip Edilen Trader'lar
          </h2>
          <span style={{ fontSize: '0.875rem', color: 'var(--text-dim)' }}>{traders.length} Trader</span>
        </div>

        {loadingTraders ? (
          <LoadingSpinner text="Trader'lar yükleniyor..." />
        ) : traders.length === 0 ? (
          <div className="glass-card" style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>
            Henüz trader eklenmemiş. Yukarıdan Twitter URL'si yapıştırarak başlayın.
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
            {traders.map((t) => (
              <div key={t.username} style={{ position: 'relative' }}>
                <TraderCard trader={t} />
                <button
                  onClick={() => handleDeleteTrader(t.username)}
                  style={{
                    position: 'absolute', top: '12px', right: '12px',
                    background: 'rgba(239, 68, 68, 0.15)', border: '1px solid rgba(239, 68, 68, 0.3)',
                    borderRadius: '6px', padding: '0.25rem 0.5rem',
                    color: 'var(--bear-red)', fontSize: '0.75rem', cursor: 'pointer',
                  }}
                >
                  🗑️
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Recent Analyses */}
      {analyses.length > 0 && (
        <div>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: '1rem' }}>
            📊 Son Analizler
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '1.5rem' }}>
            {analyses.slice(0, 6).map((item) => (
              <AnalysisCard key={item.id} analysis={item} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
