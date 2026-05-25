'use client';

interface GearItem {
  name: string;
  description: string;
  link: string;
  icon: string;
  accentHue: number;
}

const GEAR: GearItem[] = [
  {
    name: 'QCY MeloBuds Pro',
    description: 'LDAC codec, Hi-Res certified',
    link: '#',
    icon: '🎧',
    accentHue: 170,
  },
  {
    name: 'Moondrop Chu II',
    description: 'Audiophile IEMs under $20',
    link: '#',
    icon: '🎵',
    accentHue: 200,
  },
  {
    name: 'FiiO BTR7',
    description: 'Portable Bluetooth DAC/AMP',
    link: '#',
    icon: '📱',
    accentHue: 260,
  },
  {
    name: 'Topping DX3 Pro+',
    description: 'Desktop DAC for serious listening',
    link: '#',
    icon: '🔊',
    accentHue: 320,
  },
];

const styles = {
  section: {
    width: '100%',
    maxWidth: '900px',
    margin: '0 auto',
    padding: '64px 24px',
  },
  header: {
    textAlign: 'center' as const,
    marginBottom: '40px',
  },
  title: {
    fontFamily: "'Space Grotesk', sans-serif",
    fontSize: '28px',
    fontWeight: 700,
    color: 'var(--text-primary, #F0F0F0)',
    margin: '0 0 12px',
    lineHeight: 1.2,
  },
  subtitle: {
    fontFamily: "'IBM Plex Mono', monospace",
    fontSize: '14px',
    color: 'var(--text-muted, #888)',
    margin: 0,
    lineHeight: 1.6,
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '16px',
  },
  card: {
    display: 'flex',
    flexDirection: 'column' as const,
    padding: '24px',
    background: 'var(--surface, #111113)',
    border: '1px solid var(--border, #222226)',
    borderRadius: '12px',
    transition: 'transform 0.2s ease, border-color 0.2s ease',
    textDecoration: 'none',
    color: 'inherit',
  },
  iconBox: {
    width: '56px',
    height: '56px',
    borderRadius: '12px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '24px',
    marginBottom: '16px',
  },
  cardName: {
    fontFamily: "'Space Grotesk', sans-serif",
    fontSize: '16px',
    fontWeight: 600,
    color: 'var(--text-primary, #F0F0F0)',
    margin: '0 0 6px',
    lineHeight: 1.3,
  },
  cardDesc: {
    fontFamily: "'IBM Plex Mono', monospace",
    fontSize: '12px',
    color: 'var(--text-muted, #888)',
    margin: '0 0 16px',
    lineHeight: 1.5,
    flex: 1,
  },
  link: {
    fontFamily: "'Space Grotesk', sans-serif",
    fontSize: '13px',
    fontWeight: 600,
    color: 'var(--accent, #00E5CC)',
    textDecoration: 'none',
    display: 'inline-flex',
    alignItems: 'center',
    gap: '4px',
    transition: 'gap 0.2s ease',
  },
  affiliateNote: {
    fontFamily: "'IBM Plex Mono', monospace",
    fontSize: '11px',
    color: 'var(--text-muted, #555)',
    textAlign: 'center' as const,
    marginTop: '24px',
    letterSpacing: '0.3px',
  },
};

export default function GearSection() {
  return (
    <section style={styles.section} aria-labelledby="gear-title">
      <div style={styles.header}>
        <h2 id="gear-title" style={styles.title}>
          Hear the Difference — Recommended Gear
        </h2>
        <p style={styles.subtitle}>
          Hand-picked for lossless audio. Affiliate links help support FlacDrop.
        </p>
      </div>

      <div style={styles.grid}>
        {GEAR.map((item) => (
          <a
            key={item.name}
            href={item.link}
            target="_blank"
            rel="noopener noreferrer sponsored"
            style={styles.card}
            onMouseEnter={(e) => {
              const el = e.currentTarget as HTMLElement;
              el.style.transform = 'translateY(-3px)';
              el.style.borderColor = `hsl(${item.accentHue}, 60%, 40%)`;
            }}
            onMouseLeave={(e) => {
              const el = e.currentTarget as HTMLElement;
              el.style.transform = 'translateY(0)';
              el.style.borderColor = 'var(--border, #222226)';
            }}
          >
            <div
              style={{
                ...styles.iconBox,
                background: `linear-gradient(135deg, hsl(${item.accentHue}, 60%, 15%), hsl(${item.accentHue}, 40%, 8%))`,
                border: `1px solid hsl(${item.accentHue}, 50%, 25%)`,
              }}
              aria-hidden="true"
            >
              {item.icon}
            </div>
            <h3 style={styles.cardName}>{item.name}</h3>
            <p style={styles.cardDesc}>{item.description}</p>
            <span style={styles.link}>
              View Deal <span aria-hidden="true">&rarr;</span>
            </span>
          </a>
        ))}
      </div>

      <p style={styles.affiliateNote}>
        * Links are affiliate — purchases help keep FlacDrop free.
      </p>
    </section>
  );
}
