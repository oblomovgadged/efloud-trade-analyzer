interface TraderBadgeProps {
  username: string;
  displayName: string;
}

export function TraderBadge({ username, displayName }: TraderBadgeProps) {
  return (
    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
      <div style={{
        width: '28px',
        height: '28px',
        borderRadius: '50%',
        background: 'linear-gradient(135deg, #1d4ed8, #3b82f6)',
        color: 'white',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '0.75rem',
        fontWeight: 'bold'
      }}>
        {displayName ? displayName[0].toUpperCase() : 'T'}
      </div>
      <div>
        <span style={{ fontWeight: 600, color: 'var(--text-main)', fontSize: '0.875rem' }}>
          {displayName}
        </span>
        <span style={{ color: 'var(--text-dim)', fontSize: '0.75rem', marginLeft: '0.375rem' }}>
          {username.startsWith('@') ? username : `@${username}`}
        </span>
      </div>
    </div>
  );
}
