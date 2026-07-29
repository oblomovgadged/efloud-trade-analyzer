'use client';

import { useState, useEffect } from 'react';
import type { TweetAnalysis } from '@/lib/types';
import { AnalysisCard } from '@/components/AnalysisCard';
import { InstrumentFilter } from '@/components/InstrumentFilter';
import { LoadingSpinner } from '@/components/LoadingSpinner';

export default function HomePage() {
  const [analyses, setAnalyses] = useState<TweetAnalysis[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedInstrument, setSelectedInstrument] = useState('ALL');

  useEffect(() => {
    async function fetchAnalyses() {
      setLoading(true);
      try {
        const url = selectedInstrument === 'ALL' 
          ? '/api/tweets' 
          : `/api/tweets?instrument=${encodeURIComponent(selectedInstrument)}`;
        
        const res = await fetch(url);
        const json = await res.json();
        if (json.success && json.data) {
          setAnalyses(json.data);
        }
      } catch (err) {
        console.error('Failed to load analyses:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchAnalyses();
  }, [selectedInstrument]);

  return (
    <div className="app-container" style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {/* Hero Section */}
      <div className="glass-card animate-fade-in" style={{
        padding: '2.5rem 2rem',
        background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.9) 0%, rgba(30, 58, 138, 0.25) 100%)',
        border: '1px solid rgba(59, 130, 246, 0.2)',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <div style={{ maxWidth: '750px', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.25rem 0.75rem',
            background: 'rgba(245, 158, 11, 0.15)',
            border: '1px solid rgba(245, 158, 11, 0.3)',
            borderRadius: '9999px',
            color: 'var(--accent-gold)',
            fontSize: '0.8125rem',
            fontWeight: 700,
            width: 'fit-content'
          }}>
            ⚡ Yapay Zekalı Piyasa İstihbarat Platformu
          </div>

          <h1 style={{ fontSize: '2.25rem', fontWeight: 800, lineHeight: 1.2, color: 'var(--text-main)' }}>
            Trader Paylaşımları & Grafikler <br />
            <span style={{
              background: 'linear-gradient(135deg, #60a5fa, #f59e0b)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}>
              Anında AI Tarafından Analiz Ediliyor
            </span>
          </h1>

          <p style={{ color: 'var(--text-muted)', fontSize: '1rem', lineHeight: 1.6 }}>
            @Efloud ve lider analistlerin teknik grafiklerini, destek/direnç bölgelerini, düşüş/yükseliş bias'larını ve işlem fırsatlarını otomatik olarak öğrenin ve takip edin.
          </p>
        </div>
      </div>

      {/* Filter Section */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-main)' }}>
            📊 Güncel Analizler
          </h2>
          <span style={{ fontSize: '0.875rem', color: 'var(--text-dim)' }}>
            {analyses.length} Analiz Gösteriliyor
          </span>
        </div>

        <InstrumentFilter 
          selected={selectedInstrument} 
          onSelect={(inst) => setSelectedInstrument(inst)} 
        />
      </div>

      {/* Grid List */}
      {loading ? (
        <LoadingSpinner text="Analizler getiriliyor..." />
      ) : analyses.length === 0 ? (
        <div className="glass-card" style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>
          🔍 Seçilen enstrümana ait analiz bulunamadı. Henüz analiz eklenmemiş olabilir.
        </div>
      ) : (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))',
          gap: '1.5rem'
        }}>
          {analyses.map((item) => (
            <AnalysisCard key={item.id} analysis={item} />
          ))}
        </div>
      )}
    </div>
  );
}
