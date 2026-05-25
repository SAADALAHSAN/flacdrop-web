'use client';

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column' as const,
    alignItems: 'center',
    gap: '12px',
    padding: '40px 24px',
    maxWidth: '400px',
    margin: '0 auto',
    textAlign: 'center' as const,
  },
  emoji: {
    fontSize: '36px',
    lineHeight: 1,
  },
  title: {
    fontFamily: "'Space Grotesk', sans-serif",
    fontSize: '18px',
    fontWeight: 600,
    color: 'var(--text-primary, #F0F0F0)',
    margin: 0,
  },
  description: {
    fontFamily: "'IBM Plex Mono', monospace",
    fontSize: '13px',
    color: 'var(--text-muted, #888)',
    margin: 0,
    lineHeight: 1.6,
  },
  button: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '8px',
    padding: '10px 24px',
    marginTop: '8px',
    borderRadius: '8px',
    border: '1px solid var(--border, #222226)',
    background: 'var(--surface, #111113)',
    color: 'var(--text-primary, #F0F0F0)',
    fontFamily: "'Space Grotesk', sans-serif",
    fontWeight: 600,
    fontSize: '14px',
    cursor: 'pointer',
    textDecoration: 'none',
    transition: 'border-color 0.2s ease, background 0.2s ease',
  },
};

export default function DonateWidget() {
  return (
    <aside style={styles.container} aria-label="Support FlacDrop">
      <span style={styles.emoji} aria-hidden="true">
        ☕
      </span>
      <h3 style={styles.title}>Support FlacDrop</h3>
      <p style={styles.description}>
        Built with love. Kept alive by your support.
      </p>
      <a
        href="#"
        style={styles.button}
        target="_blank"
        rel="noopener noreferrer"
        onMouseEnter={(e) => {
          const el = e.currentTarget as HTMLElement;
          el.style.borderColor = 'var(--accent, #00E5CC)';
          el.style.background = 'rgba(0, 229, 204, 0.06)';
        }}
        onMouseLeave={(e) => {
          const el = e.currentTarget as HTMLElement;
          el.style.borderColor = 'var(--border, #222226)';
          el.style.background = 'var(--surface, #111113)';
        }}
      >
        <span aria-hidden="true">☕</span>
        Buy me a coffee
      </a>
    </aside>
  );
}
