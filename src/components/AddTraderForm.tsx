'use client';

import { useState } from 'react';

interface AddTraderFormProps {
  onAdded: () => void;
}

export function AddTraderForm({ onAdded }: AddTraderFormProps) {
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const res = await fetch('/api/traders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: input.trim() }),
      });
      const data = await res.json();
      if (data.success) {
        setSuccess(`✅ @${data.data.username} başarıyla eklendi!`);
        setInput('');
        onAdded();
      } else {
        setError(data.error || 'Trader eklenemedi.');
      }
    } catch (err: any) {
      setError(err.message || 'Bağlantı hatası.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
      <div style={{ display: 'flex', gap: '0.5rem' }}>
        <input
          type="text"
          placeholder="Twitter URL veya kullanıcı adı (ör: @Efloud veya https://x.com/Efloud)"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          style={{
            flex: 1, padding: '0.75rem 1rem',
            background: 'var(--bg-input)', border: '1px solid var(--border-subtle)',
            borderRadius: '10px', color: 'var(--text-main)', fontSize: '0.9375rem',
          }}
        />
        <button type="submit" disabled={loading} className="btn btn-primary" style={{ whiteSpace: 'nowrap' }}>
          {loading ? '⏳...' : '➕ Ekle'}
        </button>
      </div>
      {error && <div style={{ color: 'var(--bear-red)', fontSize: '0.8125rem' }}>⚠️ {error}</div>}
      {success && <div style={{ color: 'var(--bull-green)', fontSize: '0.8125rem' }}>{success}</div>}
    </form>
  );
}
