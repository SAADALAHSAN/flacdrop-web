import GearSection from '@/components/GearSection';
import DonateWidget from '@/components/DonateWidget';

export default function AboutPage() {
  return (
    <div style={{ minHeight: '100vh' }}>
      {/* ─── Hero ─── */}
      <section style={{
        padding: '96px 24px 64px',
        textAlign: 'center',
      }}>
        <div className="container" style={{ maxWidth: '720px' }}>
          <span style={{
            fontFamily: "var(--font-ibm-plex-mono, 'IBM Plex Mono', monospace)",
            fontSize: '12px',
            color: 'var(--accent, #00E5CC)',
            letterSpacing: '3px',
            textTransform: 'uppercase',
            marginBottom: '16px',
            display: 'block',
          }}>
            THE STORY
          </span>
          <h1 style={{
            fontFamily: "var(--font-space-grotesk, 'Space Grotesk', sans-serif)",
            fontSize: 'clamp(36px, 6vw, 56px)',
            fontWeight: 700,
            color: 'var(--text-primary, #E8E8EC)',
            marginBottom: '24px',
            lineHeight: 1.1,
          }}>
            About FlacDrop
          </h1>
          <p style={{
            fontFamily: "var(--font-ibm-plex-mono, 'IBM Plex Mono', monospace)",
            fontSize: '15px',
            color: 'var(--text-secondary, #6B6B76)',
            lineHeight: 1.8,
            maxWidth: '560px',
            margin: '0 auto',
          }}>
            Built from frustration. Maintained with purpose.
          </p>
        </div>
      </section>

      {/* ─── Story ─── */}
      <section style={{
        padding: '64px 24px',
        background: 'var(--bg-secondary, #141416)',
      }}>
        <div className="container" style={{ maxWidth: '680px' }}>
          <div style={{
            fontFamily: "var(--font-ibm-plex-mono, 'IBM Plex Mono', monospace)",
            fontSize: '14px',
            color: 'var(--text-primary, #E8E8EC)',
            lineHeight: 2,
          }}>
            <p style={{ marginBottom: '24px' }}>
              FlacDrop was born from a simple frustration — I wanted to enjoy hi-res
              music on my LDAC earbuds, but every platform was either too expensive
              or served fake quality files labeled as &quot;lossless.&quot;
            </p>
            <p style={{ marginBottom: '24px' }}>
              Streaming services charge $10-15/month for what they call &quot;hi-fi,&quot;
              and even then, they don&apos;t let you download files to your device.
              Third-party tools are either paid, broken, or sketchy. Free download
              sites serve re-encoded MP3s disguised as FLAC.
            </p>
            <p style={{ marginBottom: '24px' }}>
              So I built something honest.
            </p>
            <p style={{
              padding: '24px',
              borderLeft: '3px solid var(--accent, #00E5CC)',
              background: 'var(--bg-tertiary, #1E1E22)',
              borderRadius: '0 8px 8px 0',
              marginBottom: '24px',
              color: 'var(--accent, #00E5CC)',
              fontWeight: 500,
            }}>
              Every file on FlacDrop is genuine 16-bit/44.1kHz FLAC — sourced,
              verified, and delivered without compromise.
            </p>
            <p style={{ color: 'var(--text-secondary, #6B6B76)' }}>
              No fake upscaling. No re-encoded MP3s. No subscription required.
              No account needed. Just search, verify, and download.
            </p>
          </div>
        </div>
      </section>

      {/* ─── Open Source ─── */}
      <section style={{
        padding: '96px 24px',
        textAlign: 'center',
      }}>
        <div className="container" style={{ maxWidth: '600px' }}>
          <h2 style={{
            fontFamily: "var(--font-space-grotesk, 'Space Grotesk', sans-serif)",
            fontSize: 'clamp(28px, 4vw, 40px)',
            fontWeight: 700,
            color: 'var(--text-primary, #E8E8EC)',
            marginBottom: '16px',
          }}>
            Open Source
          </h2>
          <p style={{
            fontFamily: "var(--font-ibm-plex-mono, 'IBM Plex Mono', monospace)",
            fontSize: '14px',
            color: 'var(--text-secondary, #6B6B76)',
            lineHeight: 1.8,
            marginBottom: '32px',
          }}>
            FlacDrop is free and open source. The code is on GitHub for anyone
            to inspect, fork, and contribute to. Transparency is part of the promise.
          </p>

          <div style={{
            display: 'flex',
            gap: '16px',
            justifyContent: 'center',
            flexWrap: 'wrap',
          }}>
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                textDecoration: 'none',
              }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
              </svg>
              Star on GitHub
            </a>
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-secondary"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                textDecoration: 'none',
              }}
            >
              View Source Code
            </a>
          </div>
        </div>
      </section>

      {/* ─── Donate ─── */}
      <section style={{
        padding: '64px 24px',
        background: 'var(--bg-secondary, #141416)',
      }}>
        <div className="container" style={{ maxWidth: '600px' }}>
          <DonateWidget />
        </div>
      </section>

      {/* ─── Gear ─── */}
      <section style={{
        padding: '96px 24px',
      }}>
        <div className="container">
          <GearSection />
        </div>
      </section>
    </div>
  );
}
