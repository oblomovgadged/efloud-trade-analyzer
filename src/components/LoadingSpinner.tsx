export function LoadingSpinner({ text = 'Yükleniyor...' }: { text?: string }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '3rem 1rem', gap: '1rem' }}>
      <div style={{
        width: '40px',
        height: '40px',
        border: '3px solid var(--border-subtle)',
        borderTopColor: 'var(--accent-gold)',
        borderRadius: '50%',
        animation: 'spin 0.8s linear infinite'
      }} />
      <span style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>{text}</span>
      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
