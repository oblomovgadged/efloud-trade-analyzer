'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export function AdminForm() {
  const router = useRouter();

  const [password, setPassword] = useState('');
  const [traderUsername, setTraderUsername] = useState('@Efloud');
  const [traderDisplayName, setTraderDisplayName] = useState('Efloud');
  const [tweetUrl, setTweetUrl] = useState('');
  const [tweetText, setTweetText] = useState('');
  const [imageUrls, setImageUrls] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccessMsg('');

    const urls = imageUrls
      .split('\n')
      .map((url) => url.trim())
      .filter((url) => url.length > 0);

    if (!tweetText || urls.length === 0) {
      setError('Lütfen tweet metnini ve en az 1 görsel URL\'sini doldurun.');
      setLoading(false);
      return;
    }

    try {
      const response = await fetch('/api/tweets/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-admin-password': password,
        },
        body: JSON.stringify({
          tweetUrl,
          tweetText,
          traderUsername,
          traderDisplayName,
          imageUrls: urls,
          tweetDate: new Date().toISOString(),
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Analiz oluşturulurken bir sunucu hatası meydana geldi.');
      }

      setSuccessMsg('✅ Analiz başarıyla oluşturuldu ve yayınlandı!');
      setTimeout(() => {
        router.push(`/analysis/${data.data.id}`);
      }, 1500);
    } catch (err: any) {
      setError(err.message || 'Analiz gönderilirken bir hata oluştu.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="glass-card" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-main)' }}>
        📌 Yeni Tweet & Grafik Ekle
      </h2>

      {error && (
        <div style={{
          background: 'var(--bear-bg)',
          border: '1px solid var(--bear-border)',
          color: 'var(--bear-red)',
          padding: '0.75rem 1rem',
          borderRadius: '8px',
          fontSize: '0.875rem'
        }}>
          ⚠️ {error}
        </div>
      )}

      {successMsg && (
        <div style={{
          background: 'var(--bull-bg)',
          border: '1px solid var(--bull-border)',
          color: 'var(--bull-green)',
          padding: '0.75rem 1rem',
          borderRadius: '8px',
          fontSize: '0.875rem'
        }}>
          {successMsg}
        </div>
      )}

      {/* Form Fields */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
        <div>
          <label style={{ display: 'block', fontSize: '0.8125rem', color: 'var(--text-muted)', marginBottom: '0.375rem' }}>
            Trader Kullanıcı Adı
          </label>
          <input
            type="text"
            value={traderUsername}
            onChange={(e) => setTraderUsername(e.target.value)}
            style={{
              width: '100%',
              padding: '0.625rem 0.875rem',
              background: 'var(--bg-input)',
              border: '1px solid var(--border-subtle)',
              borderRadius: '8px',
              color: 'var(--text-main)',
              fontSize: '0.875rem'
            }}
          />
        </div>

        <div>
          <label style={{ display: 'block', fontSize: '0.8125rem', color: 'var(--text-muted)', marginBottom: '0.375rem' }}>
            Trader Ekran Adı
          </label>
          <input
            type="text"
            value={traderDisplayName}
            onChange={(e) => setTraderDisplayName(e.target.value)}
            style={{
              width: '100%',
              padding: '0.625rem 0.875rem',
              background: 'var(--bg-input)',
              border: '1px solid var(--border-subtle)',
              borderRadius: '8px',
              color: 'var(--text-main)',
              fontSize: '0.875rem'
            }}
          />
        </div>
      </div>

      <div>
        <label style={{ display: 'block', fontSize: '0.8125rem', color: 'var(--text-muted)', marginBottom: '0.375rem' }}>
          Orijinal Tweet URL (Opsiyonel)
        </label>
        <input
          type="url"
          placeholder="https://x.com/Efloud/status/..."
          value={tweetUrl}
          onChange={(e) => setTweetUrl(e.target.value)}
          style={{
            width: '100%',
            padding: '0.625rem 0.875rem',
            background: 'var(--bg-input)',
            border: '1px solid var(--border-subtle)',
            borderRadius: '8px',
            color: 'var(--text-main)',
            fontSize: '0.875rem'
          }}
        />
      </div>

      <div>
        <label style={{ display: 'block', fontSize: '0.8125rem', color: 'var(--text-muted)', marginBottom: '0.375rem' }}>
          Tweet Metni *
        </label>
        <textarea
          rows={6}
          placeholder="Trader'ın tweet açıklamasını buraya yapıştırın..."
          value={tweetText}
          onChange={(e) => setTweetText(e.target.value)}
          required
          style={{
            width: '100%',
            padding: '0.625rem 0.875rem',
            background: 'var(--bg-input)',
            border: '1px solid var(--border-subtle)',
            borderRadius: '8px',
            color: 'var(--text-main)',
            fontSize: '0.875rem',
            fontFamily: 'inherit',
            resize: 'vertical'
          }}
        />
      </div>

      <div>
        <label style={{ display: 'block', fontSize: '0.8125rem', color: 'var(--text-muted)', marginBottom: '0.375rem' }}>
          Görsel (Grafik) URL'leri * (Her satıra 1 URL)
        </label>
        <textarea
          rows={3}
          placeholder="https://pbs.twimg.com/media/..."
          value={imageUrls}
          onChange={(e) => setImageUrls(e.target.value)}
          required
          style={{
            width: '100%',
            padding: '0.625rem 0.875rem',
            background: 'var(--bg-input)',
            border: '1px solid var(--border-subtle)',
            borderRadius: '8px',
            color: 'var(--text-main)',
            fontSize: '0.875rem',
            fontFamily: 'var(--font-mono)'
          }}
        />
      </div>

      <div>
        <label style={{ display: 'block', fontSize: '0.8125rem', color: 'var(--text-muted)', marginBottom: '0.375rem' }}>
          Admin Şifresi (Gerekliyse)
        </label>
        <input
          type="password"
          placeholder="Şifre"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={{
            width: '100%',
            padding: '0.625rem 0.875rem',
            background: 'var(--bg-input)',
            border: '1px solid var(--border-subtle)',
            borderRadius: '8px',
            color: 'var(--text-main)',
            fontSize: '0.875rem'
          }}
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="btn btn-primary"
        style={{ padding: '0.875rem', fontSize: '1rem', marginTop: '0.5rem' }}
      >
        {loading ? '🤖 AI Görsel ve Metni Analiz Ediyor...' : '🔍 Analiz Et ve Yayınla'}
      </button>
    </form>
  );
}
