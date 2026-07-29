'use client';

import { useState } from 'react';

interface ChartViewerProps {
  imageUrls: string[];
}

export function ChartViewer({ imageUrls }: ChartViewerProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);

  if (!imageUrls || imageUrls.length === 0) {
    return (
      <div style={{
        height: '240px',
        background: 'var(--bg-input)',
        borderRadius: '12px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'var(--text-dim)'
      }}>
        Grafik görseli bulunamadı.
      </div>
    );
  }

  const currentImage = imageUrls[selectedIndex];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
      {/* Main Image View */}
      <div 
        onClick={() => setIsZoomed(!isZoomed)}
        style={{
          position: 'relative',
          borderRadius: '12px',
          overflow: 'hidden',
          border: '1px solid var(--border-subtle)',
          background: '#020617',
          cursor: 'zoom-in'
        }}
      >
        {/* Simple image tag rendering with full width */}
        {/* eslint-disable-next-html-element */}
        <img
          src={currentImage}
          alt={`Grafik analizi ${selectedIndex + 1}`}
          style={{
            width: '100%',
            maxHeight: isZoomed ? 'none' : '550px',
            objectFit: 'contain',
            display: 'block'
          }}
          onError={(e) => {
            // Fallback for broken images or mock placeholders
            e.currentTarget.src = 'https://placehold.co/1200x675/0f172a/f59e0b?text=Grafik+Gorseli+(TradingView)';
          }}
        />
        
        <div style={{
          position: 'absolute',
          bottom: '12px',
          right: '12px',
          background: 'rgba(0, 0, 0, 0.75)',
          padding: '0.375rem 0.75rem',
          borderRadius: '6px',
          fontSize: '0.75rem',
          color: 'var(--text-muted)',
          backdropFilter: 'blur(4px)'
        }}>
          🔍 {isZoomed ? 'Küçültmek için tıkla' : 'Büyütmek için tıkla'}
        </div>
      </div>

      {/* Thumbnails if multiple images */}
      {imageUrls.length > 1 && (
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          {imageUrls.map((url, idx) => (
            <button
              key={idx}
              onClick={() => setSelectedIndex(idx)}
              style={{
                width: '80px',
                height: '50px',
                borderRadius: '6px',
                overflow: 'hidden',
                border: idx === selectedIndex ? '2px solid var(--accent-gold)' : '1px solid var(--border-subtle)',
                background: '#020617',
                cursor: 'pointer',
                opacity: idx === selectedIndex ? 1 : 0.6,
                padding: 0
              }}
            >
              <img
                src={url}
                alt={`Thumbnail ${idx + 1}`}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                onError={(e) => {
                  e.currentTarget.src = 'https://placehold.co/1200x675/0f172a/f59e0b?text=Grafik';
                }}
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
