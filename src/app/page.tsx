'use client';

import { useRouter } from 'next/navigation';
import WaveformHero from '@/components/WaveformHero';
import SearchBar from '@/components/SearchBar';
import GearSection from '@/components/GearSection';
import DonateWidget from '@/components/DonateWidget';
import { navigateToSearch } from '@/lib/navigation';

export default function Home() {
  const router = useRouter();

  const handleSearch = (result: { query: string; isYouTube: boolean }) => {
    navigateToSearch(router, result);
  };

  return (
    <>
      {/* ─── Hero Section ─── */}
      <section className="hero-section">
        <WaveformHero />

        <div className="hero-section__content fade-in-up">
          <h1 className="hero-section__title">
            {'FLACDROP'.split('').map((char, i) => (
              <span key={i} style={{ animationDelay: `${i * 0.05}s` }}>
                {char}
              </span>
            ))}
          </h1>

          <p className="hero-section__subtitle">
            Genuine music. Real quality. Free.
          </p>

          <div className="hero-section__search">
            <SearchBar onSearch={handleSearch} />
          </div>

          <div className="hero-section__badges">
            <span className="quality-badge">
              <span className="quality-badge__dot" aria-hidden="true" />
              FLAC · 16-bit · 44.1kHz
            </span>
            <span style={{
              color: 'var(--text-secondary, #6B6B76)',
              fontFamily: "var(--font-ibm-plex-mono, 'IBM Plex Mono', monospace)",
              fontSize: '13px',
              lineHeight: 1.6,
              maxWidth: '500px',
              textAlign: 'center' as const,
            }}>
              Every file is genuine CD-quality — no fake upscaling, no scam.
            </span>
          </div>
        </div>

        {/* Scroll indicator */}
        <div style={{
          position: 'absolute',
          bottom: '32px',
          left: '50%',
          transform: 'translateX(-50%)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '8px',
          color: 'var(--text-tertiary, #3A3A44)',
          fontSize: '11px',
          fontFamily: "var(--font-ibm-plex-mono, 'IBM Plex Mono', monospace)",
          letterSpacing: '2px',
          textTransform: 'uppercase',
          animation: 'fadeIn 1s ease 2s both',
        }}>
          <span>scroll</span>
          <svg width="16" height="24" viewBox="0 0 16 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M8 4 L8 18 M3 14 L8 19 L13 14" />
          </svg>
        </div>
      </section>

      {/* ─── How It Works ─── */}
      <section style={{
        padding: '96px 24px',
        background: 'var(--bg-secondary, #141416)',
      }}>
        <div className="container">
          <h2 style={{
            fontFamily: "var(--font-space-grotesk, 'Space Grotesk', sans-serif)",
            fontSize: 'clamp(28px, 4vw, 40px)',
            fontWeight: 700,
            color: 'var(--text-primary, #E8E8EC)',
            textAlign: 'center',
            marginBottom: '16px',
          }}>
            How It Works
          </h2>
          <p style={{
            fontFamily: "var(--font-ibm-plex-mono, 'IBM Plex Mono', monospace)",
            fontSize: '14px',
            color: 'var(--text-secondary, #6B6B76)',
            textAlign: 'center',
            marginBottom: '64px',
          }}>
            Three steps. No account needed. No catch.
          </p>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '32px',
            maxWidth: '960px',
            margin: '0 auto',
          }}>
            {[
              {
                step: '01',
                title: 'Search',
                desc: 'Type a song name or paste a YouTube link. We detect the track automatically.',
                icon: '🔍',
              },
              {
                step: '02',
                title: 'Verify',
                desc: 'Confirm the match. Every result shows quality, artist, album, and duration.',
                icon: '✓',
              },
              {
                step: '03',
                title: 'Download',
                desc: 'One click. Genuine 16-bit/44.1kHz FLAC saved directly to your device.',
                icon: '⬇',
              },
            ].map((item) => (
              <div key={item.step} className="card" style={{
                padding: '40px 32px',
                textAlign: 'center',
              }}>
                <span style={{
                  display: 'block',
                  fontFamily: "var(--font-space-grotesk, 'Space Grotesk', sans-serif)",
                  fontSize: '48px',
                  marginBottom: '16px',
                }}>
                  {item.icon}
                </span>
                <span style={{
                  fontFamily: "var(--font-ibm-plex-mono, 'IBM Plex Mono', monospace)",
                  fontSize: '12px',
                  color: 'var(--accent, #00E5CC)',
                  letterSpacing: '3px',
                  textTransform: 'uppercase',
                  marginBottom: '8px',
                  display: 'block',
                }}>
                  STEP {item.step}
                </span>
                <h3 style={{
                  fontFamily: "var(--font-space-grotesk, 'Space Grotesk', sans-serif)",
                  fontSize: '22px',
                  fontWeight: 600,
                  color: 'var(--text-primary, #E8E8EC)',
                  marginBottom: '12px',
                }}>
                  {item.title}
                </h3>
                <p style={{
                  fontFamily: "var(--font-ibm-plex-mono, 'IBM Plex Mono', monospace)",
                  fontSize: '13px',
                  color: 'var(--text-secondary, #6B6B76)',
                  lineHeight: 1.7,
                }}>
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Why FlacDrop ─── */}
      <section style={{
        padding: '96px 24px',
        background: 'var(--bg-primary, #0A0A0B)',
      }}>
        <div className="container" style={{ maxWidth: '720px' }}>
          <h2 style={{
            fontFamily: "var(--font-space-grotesk, 'Space Grotesk', sans-serif)",
            fontSize: 'clamp(28px, 4vw, 40px)',
            fontWeight: 700,
            color: 'var(--text-primary, #E8E8EC)',
            textAlign: 'center',
            marginBottom: '48px',
          }}>
            Why FlacDrop?
          </h2>

          <div style={{
            display: 'grid',
            gap: '1px',
            background: 'var(--border, #2A2A30)',
            borderRadius: '12px',
            overflow: 'hidden',
          }}>
            {[
              { label: 'Format', us: 'FLAC (Lossless)', them: 'MP3 / AAC (Lossy)' },
              { label: 'Bit Depth', us: '16-bit', them: '8-bit or unknown' },
              { label: 'Sample Rate', us: '44.1 kHz', them: '22-44 kHz (variable)' },
              { label: 'Price', us: 'Free', them: '$10-15/month' },
              { label: 'Account Required', us: 'No', them: 'Yes' },
              { label: 'Genuine Quality', us: 'Verified', them: 'Often fake / upscaled' },
            ].map((row, i) => (
              <div key={row.label} style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr 1fr',
                background: i % 2 === 0 ? 'var(--bg-secondary, #141416)' : 'var(--bg-tertiary, #1E1E22)',
              }}>
                <span style={{
                  padding: '16px 20px',
                  fontFamily: "var(--font-ibm-plex-mono, 'IBM Plex Mono', monospace)",
                  fontSize: '13px',
                  fontWeight: 600,
                  color: 'var(--text-secondary, #6B6B76)',
                }}>
                  {row.label}
                </span>
                <span style={{
                  padding: '16px 20px',
                  fontFamily: "var(--font-ibm-plex-mono, 'IBM Plex Mono', monospace)",
                  fontSize: '13px',
                  color: 'var(--accent, #00E5CC)',
                  fontWeight: 500,
                }}>
                  {row.us}
                </span>
                <span style={{
                  padding: '16px 20px',
                  fontFamily: "var(--font-ibm-plex-mono, 'IBM Plex Mono', monospace)",
                  fontSize: '13px',
                  color: 'var(--text-tertiary, #3A3A44)',
                }}>
                  {row.them}
                </span>
              </div>
            ))}
          </div>
          <p style={{
            fontFamily: "var(--font-ibm-plex-mono, 'IBM Plex Mono', monospace)",
            fontSize: '11px',
            color: 'var(--text-tertiary, #3A3A44)',
            textAlign: 'center',
            marginTop: '16px',
          }}>
            FlacDrop vs typical &quot;free download&quot; sites
          </p>
        </div>
      </section>

      {/* ─── Verify Quality Teaser ─── */}
      <section style={{
        padding: '96px 24px',
        background: 'var(--bg-secondary, #141416)',
      }}>
        <div className="container" style={{ maxWidth: '900px' }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '40px',
            alignItems: 'center',
          }}>
            {/* Image side */}
            <div style={{
              borderRadius: '12px',
              overflow: 'hidden',
              borderWidth: '1px',
              borderStyle: 'solid',
              borderColor: 'var(--border, #2A2A30)',
            }}>
              <img
                src="/images/real-vs-fake-spectrogram.png"
                alt="Real vs Fake FLAC spectrogram comparison"
                style={{
                  width: '100%',
                  height: 'auto',
                  display: 'block',
                }}
              />
            </div>

            {/* Text side */}
            <div>
              <span style={{
                fontFamily: "var(--font-ibm-plex-mono, 'IBM Plex Mono', monospace)",
                fontSize: '12px',
                color: 'var(--accent, #00E5CC)',
                letterSpacing: '3px',
                textTransform: 'uppercase',
                marginBottom: '12px',
                display: 'block',
              }}>
                TRANSPARENCY
              </span>
              <h2 style={{
                fontFamily: "var(--font-space-grotesk, 'Space Grotesk', sans-serif)",
                fontSize: 'clamp(24px, 4vw, 36px)',
                fontWeight: 700,
                color: 'var(--text-primary, #E8E8EC)',
                marginBottom: '16px',
                lineHeight: 1.2,
              }}>
                Don&apos;t Trust Us.<br />Verify It Yourself.
              </h2>
              <p style={{
                fontFamily: "var(--font-ibm-plex-mono, 'IBM Plex Mono', monospace)",
                fontSize: '14px',
                color: 'var(--text-secondary, #6B6B76)',
                lineHeight: 1.8,
                marginBottom: '24px',
              }}>
                Most &quot;free FLAC&quot; sites serve re-encoded MP3s. We show you how to spot the difference 
                with free tools like Spek — and encourage you to check every file.
              </p>
              <a
                href="/verify"
                className="btn-secondary"
                style={{
                  textDecoration: 'none',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                }}
              >
                Learn How to Verify →
              </a>
            </div>
          </div>
        </div>
      </section>
      {/* ─── Gear Section ─── */}
      <section style={{
        padding: '96px 24px',
        background: 'var(--bg-secondary, #141416)',
      }}>
        <div className="container">
          <GearSection />
        </div>
      </section>

      {/* ─── Donate ─── */}
      <section style={{
        padding: '64px 24px 96px',
        background: 'var(--bg-primary, #0A0A0B)',
      }}>
        <div className="container" style={{ maxWidth: '600px' }}>
          <DonateWidget />
        </div>
      </section>
    </>
  );
}
