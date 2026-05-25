'use client';

import { useState } from 'react';

const TOOLS = [
  {
    name: 'Spek',
    url: 'https://www.spek.cc/',
    platform: 'Windows / macOS / Linux',
    description: 'Free spectrum analyzer. Open any audio file and instantly see its frequency content. The gold standard for spotting fakes.',
    icon: '📊',
    how: 'Drag and drop your FLAC file into Spek. A genuine 16-bit/44.1kHz file will show frequency content up to 22kHz. A fake will cut off sharply at 16kHz or lower.',
  },
  {
    name: 'MediaInfo',
    url: 'https://mediaarea.net/en/MediaInfo',
    platform: 'Windows / macOS / Linux',
    description: 'Displays technical metadata: codec, bit depth, sample rate, channels, and encoding info.',
    icon: '🔍',
    how: 'Open your file with MediaInfo. Check that Format is "FLAC", Bit depth is "16", and Sampling rate is "44 100 Hz". If it says "converted" or shows MP3 origin, it\'s fake.',
  },
  {
    name: 'foobar2000',
    url: 'https://www.foobar2000.org/',
    platform: 'Windows',
    description: 'Audio player with built-in bitrate and format analysis. The "Properties" panel shows exact file specs.',
    icon: '🎵',
    how: 'Right-click → Properties. Check the codec info, bit depth, and sample rate. You can also install the "Dynamic Range Meter" plugin for deeper analysis.',
  },
  {
    name: 'ffprobe (FFmpeg)',
    url: 'https://ffmpeg.org/',
    platform: 'CLI — All platforms',
    description: 'Command-line tool that extracts every technical detail from any audio file.',
    icon: '⌨️',
    how: 'Run: ffprobe -show_format -show_streams yourfile.flac — Look for codec_name=flac, bits_per_raw_sample=16, sample_rate=44100.',
  },
];

const SIGNS = [
  {
    fake: 'Frequency cutoff at ~16kHz',
    real: 'Frequency content up to 22kHz',
    explanation: 'MP3 encoding strips everything above ~16-18kHz. When re-encoded to FLAC, that data is gone forever. A spectrogram makes this instantly visible.',
  },
  {
    fake: 'Suspiciously small file size',
    real: 'Consistent size (~30-50 MB for a typical song)',
    explanation: 'A genuine 16-bit/44.1kHz FLAC file for a 4-minute song is typically 25-40 MB. If it\'s under 15 MB, it was likely transcoded from a lossy source.',
  },
  {
    fake: '"Shelf" or hard line in spectrogram',
    real: 'Smooth, natural frequency rolloff',
    explanation: 'Real masters have a natural high-frequency rolloff. Fakes show an unnatural hard edge — like a cliff at a specific frequency — because the MP3 encoder cut everything above it.',
  },
  {
    fake: 'Metadata says "LAME" or "iTunes AAC"',
    real: 'No lossy encoder fingerprints',
    explanation: 'Some lazy fakers leave the original MP3/AAC encoder tags in the file. Tools like MediaInfo can reveal this origin information.',
  },
  {
    fake: 'Identical waveform to MP3 version',
    real: 'Higher dynamic range than MP3',
    explanation: 'If a FLAC file produces the exact same waveform as an MP3, it was transcoded. Genuine lossless files preserve dynamics that MP3 compression destroys.',
  },
];

export default function VerifyPage() {
  const [expandedTool, setExpandedTool] = useState<number | null>(null);

  return (
    <div style={{ minHeight: '100vh' }}>
      {/* ─── Hero ─── */}
      <section style={{
        padding: '96px 24px 64px',
        textAlign: 'center',
      }}>
        <div className="container" style={{ maxWidth: '760px' }}>
          <span style={{
            fontFamily: "var(--font-ibm-plex-mono, 'IBM Plex Mono', monospace)",
            fontSize: '12px',
            color: 'var(--accent, #00E5CC)',
            letterSpacing: '3px',
            textTransform: 'uppercase',
            marginBottom: '16px',
            display: 'block',
          }}>
            TRANSPARENCY
          </span>
          <h1 style={{
            fontFamily: "var(--font-space-grotesk, 'Space Grotesk', sans-serif)",
            fontSize: 'clamp(36px, 6vw, 56px)',
            fontWeight: 700,
            color: 'var(--text-primary, #E8E8EC)',
            marginBottom: '24px',
            lineHeight: 1.1,
          }}>
            Don&apos;t Trust Us.<br />Verify It Yourself.
          </h1>
          <p style={{
            fontFamily: "var(--font-ibm-plex-mono, 'IBM Plex Mono', monospace)",
            fontSize: '15px',
            color: 'var(--text-secondary, #6B6B76)',
            lineHeight: 1.8,
            maxWidth: '580px',
            margin: '0 auto',
          }}>
            Most &quot;free FLAC&quot; sites serve re-encoded MP3s disguised as lossless. 
            We show you exactly how to tell the difference — and encourage you to check every file you download from us.
          </p>
        </div>
      </section>

      {/* ─── Real vs Fake Spectrogram ─── */}
      <section style={{
        padding: '64px 24px',
        background: 'var(--bg-secondary, #141416)',
      }}>
        <div className="container" style={{ maxWidth: '900px' }}>
          <h2 style={{
            fontFamily: "var(--font-space-grotesk, 'Space Grotesk', sans-serif)",
            fontSize: 'clamp(24px, 4vw, 36px)',
            fontWeight: 700,
            color: 'var(--text-primary, #E8E8EC)',
            textAlign: 'center',
            marginBottom: '16px',
          }}>
            Real vs Fake — The Spectrogram Test
          </h2>
          <p style={{
            fontFamily: "var(--font-ibm-plex-mono, 'IBM Plex Mono', monospace)",
            fontSize: '14px',
            color: 'var(--text-secondary, #6B6B76)',
            textAlign: 'center',
            marginBottom: '40px',
            lineHeight: 1.7,
          }}>
            A spectrum analyzer reveals the truth in seconds. Open any audio file in Spek and look at the frequency ceiling.
          </p>

          {/* Spectrogram comparison image */}
          <div style={{
            borderRadius: '12px',
            overflow: 'hidden',
            borderWidth: '1px',
            borderStyle: 'solid',
            borderColor: 'var(--border, #2A2A30)',
            marginBottom: '32px',
          }}>
            <img
              src="/images/real-vs-fake-spectrogram.png"
              alt="Side-by-side spectrogram comparison: Real FLAC shows frequencies up to 22kHz, Fake FLAC (upscaled MP3) shows hard cutoff at 16kHz"
              style={{
                width: '100%',
                height: 'auto',
                display: 'block',
              }}
            />
          </div>

          {/* Explanation cards */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '20px',
          }}>
            <div style={{
              padding: '28px',
              background: 'var(--bg-tertiary, #1E1E22)',
              borderRadius: '12px',
              borderLeft: '3px solid var(--accent, #00E5CC)',
            }}>
              <h3 style={{
                fontFamily: "var(--font-space-grotesk, 'Space Grotesk', sans-serif)",
                fontSize: '18px',
                fontWeight: 600,
                color: 'var(--accent, #00E5CC)',
                marginBottom: '12px',
              }}>
                ✓ Genuine FLAC
              </h3>
              <ul style={{
                fontFamily: "var(--font-ibm-plex-mono, 'IBM Plex Mono', monospace)",
                fontSize: '13px',
                color: 'var(--text-primary, #E8E8EC)',
                lineHeight: 2,
                listStyle: 'none',
                padding: 0,
                margin: 0,
              }}>
                <li>→ Frequencies extend to 22kHz</li>
                <li>→ Smooth, natural rolloff at the top</li>
                <li>→ Rich detail across all frequencies</li>
                <li>→ File size: 25-50 MB for a typical song</li>
                <li>→ Bit depth: 16-bit, Sample rate: 44.1kHz</li>
              </ul>
            </div>

            <div style={{
              padding: '28px',
              background: 'var(--bg-tertiary, #1E1E22)',
              borderRadius: '12px',
              borderLeft: '3px solid var(--danger, #FF4757)',
            }}>
              <h3 style={{
                fontFamily: "var(--font-space-grotesk, 'Space Grotesk', sans-serif)",
                fontSize: '18px',
                fontWeight: 600,
                color: 'var(--danger, #FF4757)',
                marginBottom: '12px',
              }}>
                ✗ Fake FLAC (Upscaled MP3)
              </h3>
              <ul style={{
                fontFamily: "var(--font-ibm-plex-mono, 'IBM Plex Mono', monospace)",
                fontSize: '13px',
                color: 'var(--text-primary, #E8E8EC)',
                lineHeight: 2,
                listStyle: 'none',
                padding: 0,
                margin: 0,
              }}>
                <li>→ Hard cutoff at ~16kHz (or lower)</li>
                <li>→ Everything above is just black/empty</li>
                <li>→ Larger file size but no real quality gain</li>
                <li>→ May show MP3 encoder artifacts</li>
                <li>→ &quot;Shelf&quot; edge visible in spectrogram</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Your Spek Screenshot ─── */}
      <section style={{
        padding: '96px 24px',
      }}>
        <div className="container" style={{ maxWidth: '900px' }}>
          <h2 style={{
            fontFamily: "var(--font-space-grotesk, 'Space Grotesk', sans-serif)",
            fontSize: 'clamp(24px, 4vw, 36px)',
            fontWeight: 700,
            color: 'var(--text-primary, #E8E8EC)',
            textAlign: 'center',
            marginBottom: '16px',
          }}>
            What a FlacDrop Download Looks Like
          </h2>
          <p style={{
            fontFamily: "var(--font-ibm-plex-mono, 'IBM Plex Mono', monospace)",
            fontSize: '14px',
            color: 'var(--text-secondary, #6B6B76)',
            textAlign: 'center',
            marginBottom: '12px',
            lineHeight: 1.7,
          }}>
            This is a real file downloaded from FlacDrop, analyzed in Spek:
          </p>
          <p style={{
            fontFamily: "var(--font-ibm-plex-mono, 'IBM Plex Mono', monospace)",
            fontSize: '12px',
            color: 'var(--accent, #00E5CC)',
            textAlign: 'center',
            marginBottom: '40px',
          }}>
            &quot;Let Me Down Slowly&quot; — Alec Benjamin · FLAC · 16-bit · 44100 Hz
          </p>

          <div style={{
            borderRadius: '12px',
            overflow: 'hidden',
            borderWidth: '1px',
            borderStyle: 'solid',
            borderColor: 'var(--accent, #00E5CC)',
            boxShadow: '0 0 40px rgba(0, 229, 204, 0.08)',
            marginBottom: '24px',
          }}>
            <img
              src="/images/spek-flacdrop-proof.png"
              alt="Spek spectrum analysis of a FlacDrop download showing genuine FLAC quality with frequencies up to 22kHz — Let Me Down Slowly by Alec Benjamin"
              style={{
                width: '100%',
                height: 'auto',
                display: 'block',
              }}
            />
          </div>

          <div style={{
            padding: '20px 24px',
            background: 'var(--bg-tertiary, #1E1E22)',
            borderRadius: '8px',
            fontFamily: "var(--font-ibm-plex-mono, 'IBM Plex Mono', monospace)",
            fontSize: '13px',
            color: 'var(--text-secondary, #6B6B76)',
            lineHeight: 1.8,
            textAlign: 'center',
          }}>
            Notice how the frequency content extends all the way to <span style={{ color: 'var(--accent, #00E5CC)', fontWeight: 600 }}>22kHz</span> with 
            no hard cutoff. This is what genuine CD-quality audio looks like. 
            The metadata confirms: <span style={{ color: 'var(--text-primary, #E8E8EC)' }}>FLAC, 44100 Hz, 16 bits</span>.
          </div>
        </div>
      </section>

      {/* ─── 5 Signs of Fake FLAC ─── */}
      <section style={{
        padding: '96px 24px',
        background: 'var(--bg-secondary, #141416)',
      }}>
        <div className="container" style={{ maxWidth: '800px' }}>
          <h2 style={{
            fontFamily: "var(--font-space-grotesk, 'Space Grotesk', sans-serif)",
            fontSize: 'clamp(24px, 4vw, 36px)',
            fontWeight: 700,
            color: 'var(--text-primary, #E8E8EC)',
            textAlign: 'center',
            marginBottom: '16px',
          }}>
            5 Signs of a Fake FLAC File
          </h2>
          <p style={{
            fontFamily: "var(--font-ibm-plex-mono, 'IBM Plex Mono', monospace)",
            fontSize: '14px',
            color: 'var(--text-secondary, #6B6B76)',
            textAlign: 'center',
            marginBottom: '48px',
          }}>
            Know what to look for. Protect your ears.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {SIGNS.map((sign, i) => (
              <div key={i} style={{
                padding: '28px',
                background: 'var(--bg-primary, #0A0A0B)',
                borderRadius: '12px',
                borderWidth: '1px',
                borderStyle: 'solid',
                borderColor: 'var(--border, #2A2A30)',
              }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '16px',
                  marginBottom: '16px',
                }}>
                  <span style={{
                    fontFamily: "var(--font-space-grotesk, 'Space Grotesk', sans-serif)",
                    fontSize: '32px',
                    fontWeight: 700,
                    color: 'var(--text-tertiary, #3A3A44)',
                    lineHeight: 1,
                    minWidth: '40px',
                  }}>
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <div style={{ flex: 1 }}>
                    <div style={{
                      display: 'grid',
                      gridTemplateColumns: '1fr 1fr',
                      gap: '12px',
                      marginBottom: '12px',
                    }}>
                      <div style={{
                        padding: '12px 16px',
                        background: 'rgba(255, 71, 87, 0.06)',
                        borderRadius: '8px',
                        borderLeft: '2px solid var(--danger, #FF4757)',
                      }}>
                        <span style={{
                          fontFamily: "var(--font-ibm-plex-mono, 'IBM Plex Mono', monospace)",
                          fontSize: '10px',
                          color: 'var(--danger, #FF4757)',
                          textTransform: 'uppercase',
                          letterSpacing: '1px',
                          display: 'block',
                          marginBottom: '4px',
                        }}>
                          FAKE
                        </span>
                        <span style={{
                          fontFamily: "var(--font-space-grotesk, 'Space Grotesk', sans-serif)",
                          fontSize: '14px',
                          fontWeight: 600,
                          color: 'var(--text-primary, #E8E8EC)',
                        }}>
                          {sign.fake}
                        </span>
                      </div>
                      <div style={{
                        padding: '12px 16px',
                        background: 'rgba(0, 229, 204, 0.06)',
                        borderRadius: '8px',
                        borderLeft: '2px solid var(--accent, #00E5CC)',
                      }}>
                        <span style={{
                          fontFamily: "var(--font-ibm-plex-mono, 'IBM Plex Mono', monospace)",
                          fontSize: '10px',
                          color: 'var(--accent, #00E5CC)',
                          textTransform: 'uppercase',
                          letterSpacing: '1px',
                          display: 'block',
                          marginBottom: '4px',
                        }}>
                          REAL
                        </span>
                        <span style={{
                          fontFamily: "var(--font-space-grotesk, 'Space Grotesk', sans-serif)",
                          fontSize: '14px',
                          fontWeight: 600,
                          color: 'var(--text-primary, #E8E8EC)',
                        }}>
                          {sign.real}
                        </span>
                      </div>
                    </div>
                    <p style={{
                      fontFamily: "var(--font-ibm-plex-mono, 'IBM Plex Mono', monospace)",
                      fontSize: '13px',
                      color: 'var(--text-secondary, #6B6B76)',
                      lineHeight: 1.7,
                      margin: 0,
                    }}>
                      {sign.explanation}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Free Tools ─── */}
      <section style={{
        padding: '96px 24px',
      }}>
        <div className="container" style={{ maxWidth: '800px' }}>
          <h2 style={{
            fontFamily: "var(--font-space-grotesk, 'Space Grotesk', sans-serif)",
            fontSize: 'clamp(24px, 4vw, 36px)',
            fontWeight: 700,
            color: 'var(--text-primary, #E8E8EC)',
            textAlign: 'center',
            marginBottom: '16px',
          }}>
            Free Tools to Verify
          </h2>
          <p style={{
            fontFamily: "var(--font-ibm-plex-mono, 'IBM Plex Mono', monospace)",
            fontSize: '14px',
            color: 'var(--text-secondary, #6B6B76)',
            textAlign: 'center',
            marginBottom: '48px',
          }}>
            All free. All trusted by the audiophile community.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {TOOLS.map((tool, i) => (
              <div
                key={tool.name}
                style={{
                  background: 'var(--bg-secondary, #141416)',
                  borderRadius: '12px',
                  borderWidth: '1px',
                  borderStyle: 'solid',
                  borderColor: expandedTool === i ? 'var(--accent, #00E5CC)' : 'var(--border, #2A2A30)',
                  overflow: 'hidden',
                  transition: 'border-color 0.2s ease',
                }}
              >
                <button
                  onClick={() => setExpandedTool(expandedTool === i ? null : i)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '16px',
                    width: '100%',
                    padding: '20px 24px',
                    background: 'transparent',
                    border: 'none',
                    cursor: 'pointer',
                    textAlign: 'left',
                  }}
                >
                  <span style={{ fontSize: '28px' }}>{tool.icon}</span>
                  <div style={{ flex: 1 }}>
                    <h3 style={{
                      fontFamily: "var(--font-space-grotesk, 'Space Grotesk', sans-serif)",
                      fontSize: '18px',
                      fontWeight: 600,
                      color: 'var(--text-primary, #E8E8EC)',
                      margin: '0 0 4px',
                    }}>
                      {tool.name}
                    </h3>
                    <p style={{
                      fontFamily: "var(--font-ibm-plex-mono, 'IBM Plex Mono', monospace)",
                      fontSize: '12px',
                      color: 'var(--text-secondary, #6B6B76)',
                      margin: 0,
                    }}>
                      {tool.description}
                    </p>
                  </div>
                  <span style={{
                    fontFamily: "var(--font-ibm-plex-mono, 'IBM Plex Mono', monospace)",
                    fontSize: '11px',
                    color: 'var(--text-tertiary, #3A3A44)',
                    padding: '4px 8px',
                    borderRadius: '4px',
                    background: 'var(--bg-tertiary, #1E1E22)',
                    whiteSpace: 'nowrap',
                  }}>
                    {tool.platform}
                  </span>
                  <span style={{
                    color: 'var(--text-secondary, #6B6B76)',
                    transition: 'transform 0.2s ease',
                    transform: expandedTool === i ? 'rotate(180deg)' : 'rotate(0)',
                  }}>
                    ▾
                  </span>
                </button>

                {expandedTool === i && (
                  <div style={{
                    padding: '0 24px 24px',
                    animation: 'fadeIn 0.2s ease',
                  }}>
                    <div style={{
                      padding: '16px 20px',
                      background: 'var(--bg-tertiary, #1E1E22)',
                      borderRadius: '8px',
                      borderLeft: '3px solid var(--accent, #00E5CC)',
                      marginBottom: '16px',
                    }}>
                      <span style={{
                        fontFamily: "var(--font-ibm-plex-mono, 'IBM Plex Mono', monospace)",
                        fontSize: '10px',
                        color: 'var(--accent, #00E5CC)',
                        textTransform: 'uppercase',
                        letterSpacing: '1px',
                        display: 'block',
                        marginBottom: '8px',
                      }}>
                        HOW TO USE
                      </span>
                      <p style={{
                        fontFamily: "var(--font-ibm-plex-mono, 'IBM Plex Mono', monospace)",
                        fontSize: '13px',
                        color: 'var(--text-primary, #E8E8EC)',
                        lineHeight: 1.7,
                        margin: 0,
                      }}>
                        {tool.how}
                      </p>
                    </div>
                    <a
                      href={tool.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '6px',
                        fontFamily: "var(--font-space-grotesk, 'Space Grotesk', sans-serif)",
                        fontSize: '14px',
                        fontWeight: 600,
                        color: 'var(--accent, #00E5CC)',
                        textDecoration: 'none',
                      }}
                    >
                      Download {tool.name} →
                    </a>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Our Promise ─── */}
      <section style={{
        padding: '96px 24px',
        background: 'var(--bg-secondary, #141416)',
      }}>
        <div className="container" style={{ maxWidth: '700px', textAlign: 'center' }}>
          <h2 style={{
            fontFamily: "var(--font-space-grotesk, 'Space Grotesk', sans-serif)",
            fontSize: 'clamp(24px, 4vw, 36px)',
            fontWeight: 700,
            color: 'var(--text-primary, #E8E8EC)',
            marginBottom: '24px',
          }}>
            Our Promise
          </h2>
          <div style={{
            padding: '32px',
            background: 'var(--bg-primary, #0A0A0B)',
            borderRadius: '16px',
            borderWidth: '1px',
            borderStyle: 'solid',
            borderColor: 'var(--accent, #00E5CC)',
            boxShadow: '0 0 40px rgba(0, 229, 204, 0.05)',
          }}>
            <p style={{
              fontFamily: "var(--font-ibm-plex-mono, 'IBM Plex Mono', monospace)",
              fontSize: '15px',
              color: 'var(--text-primary, #E8E8EC)',
              lineHeight: 2,
              margin: 0,
            }}>
              {"Every file served by FlacDrop is genuine "}
              <span style={{ color: 'var(--accent, #00E5CC)', fontWeight: 600 }}>16-bit/44.1kHz FLAC</span>
              {" sourced directly from CD-quality streams. We will never serve re-encoded, upscaled, or transcoded files."}
              <br /><br />
              {"We encourage you to verify every download. If you ever find a file that doesn\u2019t pass the spectrogram test, "}
              <a href="https://github.com" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--accent, #00E5CC)' }}>open an issue on GitHub</a>
              {" and we\u2019ll investigate immediately."}
            </p>
          </div>

          <div style={{
            marginTop: '40px',
            display: 'flex',
            gap: '16px',
            justifyContent: 'center',
            flexWrap: 'wrap',
          }}>
            <a href="/" className="btn-primary" style={{ textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
              ← Back to FlacDrop
            </a>
            <a href="https://www.spek.cc/" target="_blank" rel="noopener noreferrer" className="btn-secondary" style={{ textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
              Download Spek (Free)
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
