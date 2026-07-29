export function Footer() {
  return (
    <footer style={{
      borderTop: '1px solid var(--border-subtle)',
      background: 'var(--bg-secondary)',
      padding: '2.5rem 0',
      marginTop: '4rem',
      color: 'var(--text-dim)',
      fontSize: '0.875rem'
    }}>
      <div className="app-container" style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '1rem',
        textAlign: 'center'
      }}>
        <div style={{ fontWeight: 600, color: 'var(--text-muted)' }}>
          📊 Efloud Trade Analyzer &copy; {new Date().getFullYear()} — Tüm Hakları Saklıdır.
        </div>
        <p style={{ maxWidth: '700px', lineHeight: 1.5, fontSize: '0.8125rem' }}>
          ⚠️ <strong>Yasal Uyarı:</strong> Bu sitede sunulan tüm teknik analizler, grafik yorumları ve AI sinyalleri sadece eğitim ve bilgilendirme amaçlıdır. Kesinlikle yatırım tavsiyesi niteliği taşımaz. Piyasalar yüksek risk içerir.
        </p>
      </div>
    </footer>
  );
}
