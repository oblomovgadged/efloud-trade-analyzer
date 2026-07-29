import Link from 'next/link';

export function Header() {
  return (
    <header style={{
      position: 'sticky',
      top: 0,
      zIndex: 50,
      background: 'rgba(8, 12, 20, 0.85)',
      backdropFilter: 'blur(12px)',
      borderBottom: '1px solid var(--border-subtle)',
    }}>
      <div className="app-container" style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        height: '72px'
      }}>
        <Link href="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{
            width: '40px',
            height: '40px',
            borderRadius: '10px',
            background: 'linear-gradient(135deg, #f59e0b, #d97706)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '1.25rem',
            fontWeight: 'bold',
            color: '#080c14',
            boxShadow: '0 0 15px rgba(245, 158, 11, 0.3)'
          }}>
            ⚡
          </div>
          <div>
            <span style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-main)', letterSpacing: '-0.02em' }}>
              Efloud <span style={{ color: 'var(--accent-gold)' }}>Analyzer</span>
            </span>
            <span style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              AI Supported Trade & Market Intelligence
            </span>
          </div>
        </Link>

        <nav style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <Link href="/" className="btn btn-secondary" style={{ fontSize: '0.875rem' }}>
            📈 Analizler
          </Link>
          <Link href="/" className="btn btn-primary" style={{ fontSize: '0.875rem' }}>
            ➕ Tweet Ekle
          </Link>
        </nav>
      </div>
    </header>
  );
}
