'use client';

import { useState } from 'react';

type DownloadState = 'idle' | 'queued' | 'downloading' | 'complete' | 'error';

interface SongCardProps {
  title: string;
  artist: string;
  album: string;
  duration: number; // seconds
  albumArt: string;
  trackId: string;
  color?: string;
  downloadState?: DownloadState;
  downloadProgress?: number;
  downloadEta?: string;
  errorMessage?: string;
  onDownload: (trackId: string) => void;
}

function formatDuration(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${s.toString().padStart(2, '0')}`;
}

const styles = {
  card: {
    display: 'flex',
    alignItems: 'center',
    gap: '20px',
    padding: '20px',
    background: 'var(--surface, #111113)',
    borderWidth: '1px',
    borderStyle: 'solid',
    borderColor: 'var(--border, #222226)',
    borderRadius: '12px',
    transition: 'transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease',
    cursor: 'default',
    width: '100%',
    maxWidth: '720px',
  },
  cardHover: {
    transform: 'translateY(-2px)',
    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
    borderColor: 'var(--border-hover, #333)',
  },
  albumArt: {
    width: '120px',
    height: '120px',
    borderRadius: '8px',
    objectFit: 'cover' as const,
    flexShrink: 0,
    background: '#1a1a1e',
  },
  albumArtPlaceholder: {
    width: '120px',
    height: '120px',
    borderRadius: '8px',
    flexShrink: 0,
    background: 'linear-gradient(135deg, #1a1a1e, #222226)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: 'var(--text-muted, #555)',
    fontSize: '32px',
  },
  meta: {
    flex: 1,
    minWidth: 0,
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '6px',
  },
  title: {
    fontFamily: "'Space Grotesk', sans-serif",
    fontSize: '18px',
    fontWeight: 600,
    color: 'var(--text-primary, #F0F0F0)',
    lineHeight: 1.3,
    margin: 0,
    overflow: 'hidden' as const,
    textOverflow: 'ellipsis' as const,
    whiteSpace: 'nowrap' as const,
  },
  subtitle: {
    fontFamily: "'IBM Plex Mono', monospace",
    fontSize: '13px',
    color: 'var(--text-muted, #888)',
    lineHeight: 1.4,
    margin: 0,
    overflow: 'hidden' as const,
    textOverflow: 'ellipsis' as const,
    whiteSpace: 'nowrap' as const,
  },
  row: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    marginTop: '8px',
    flexWrap: 'wrap' as const,
  },
  qualityBadge: {
    display: 'inline-flex',
    alignItems: 'center',
    padding: '4px 12px',
    borderRadius: '100px',
    borderWidth: '1px',
    borderStyle: 'solid',
    borderColor: 'var(--accent, #00E5CC)',
    color: 'var(--accent, #00E5CC)',
    fontSize: '11px',
    fontFamily: "'IBM Plex Mono', monospace",
    fontWeight: 500,
    letterSpacing: '0.5px',
    whiteSpace: 'nowrap' as const,
  },
  duration: {
    fontFamily: "'IBM Plex Mono', monospace",
    fontSize: '13px',
    color: 'var(--text-muted, #888)',
  },
  actions: {
    display: 'flex',
    flexDirection: 'column' as const,
    alignItems: 'flex-end',
    flexShrink: 0,
    gap: '8px',
  },
  downloadBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '10px 20px',
    borderRadius: '8px',
    borderWidth: '1px',
    borderStyle: 'solid',
    borderColor: 'var(--accent, #00E5CC)',
    background: 'transparent',
    color: 'var(--accent, #00E5CC)',
    fontFamily: "'Space Grotesk', sans-serif",
    fontWeight: 600,
    fontSize: '14px',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    whiteSpace: 'nowrap' as const,
  },
  downloadBtnHover: {
    background: 'var(--accent, #00E5CC)',
    color: '#0A0A0C',
    boxShadow: '0 0 20px rgba(0, 229, 204, 0.3)',
  },
};

export default function SongCard({
  title,
  artist,
  album,
  duration,
  albumArt,
  trackId,
  color,
  downloadState = 'idle',
  downloadProgress = 0,
  downloadEta = '',
  errorMessage,
  onDownload,
}: SongCardProps) {
  const [hovered, setHovered] = useState(false);
  const [btnHovered, setBtnHovered] = useState(false);
  const [imgError, setImgError] = useState(false);

  return (
    <article
      style={{ ...styles.card, ...(hovered ? styles.cardHover : {}) }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {albumArt && !imgError ? (
        <img
          src={albumArt}
          alt={`${album} album art`}
          style={styles.albumArt}
          onError={() => setImgError(true)}
          loading="lazy"
        />
      ) : (
        <div style={{
          ...styles.albumArtPlaceholder,
          background: color
            ? `linear-gradient(135deg, ${color}33, ${color}11)`
            : styles.albumArtPlaceholder.background,
          color: color || 'var(--text-muted, #555)',
        }} aria-hidden="true">
          ♪
        </div>
      )}

      <div style={styles.meta}>
        <h3 style={styles.title}>{title}</h3>
        <p style={styles.subtitle}>
          {artist}
          {album ? ` · ${album}` : ''}
        </p>
        <div style={styles.row}>
          <span style={styles.qualityBadge}>FLAC · 16-bit · 44.1kHz</span>
          <span style={styles.duration}>{formatDuration(duration)}</span>
        </div>
      </div>

      <div style={styles.actions}>
        {downloadState === 'idle' && (
          <button
            type="button"
            onClick={() => onDownload(trackId)}
            onMouseEnter={() => setBtnHovered(true)}
            onMouseLeave={() => setBtnHovered(false)}
            style={{ ...styles.downloadBtn, ...(btnHovered ? styles.downloadBtnHover : {}) }}
            aria-label={`Download ${title} as FLAC`}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="7 10 12 15 17 10" />
              <line x1="12" y1="15" x2="12" y2="3" />
            </svg>
            Download FLAC
          </button>
        )}
        {downloadState === 'queued' && (
          <span style={{
            ...styles.downloadBtn,
            cursor: 'default',
            position: 'relative' as const,
            overflow: 'hidden' as const,
            opacity: 0.85,
            borderColor: 'var(--warning, #FFA502)',
            color: 'var(--warning, #FFA502)',
          }}>
            <span style={{
              position: 'absolute' as const,
              top: 0,
              left: 0,
              height: '100%',
              width: `${downloadProgress}%`,
              background: 'var(--warning, #FFA502)',
              opacity: 0.15,
              transition: 'width 0.2s ease',
              borderRadius: '8px',
            }} />
            <span style={{ position: 'relative' as const }}>
              Preparing: {downloadProgress}% {downloadEta ? `(${downloadEta})` : ''}
            </span>
          </span>
        )}
        {downloadState === 'downloading' && (
          <span style={{
            ...styles.downloadBtn,
            cursor: 'default',
            position: 'relative' as const,
            overflow: 'hidden' as const,
          }}>
            <span style={{
              position: 'absolute' as const,
              top: 0,
              left: 0,
              height: '100%',
              width: `${downloadProgress}%`,
              background: 'var(--accent, #00E5CC)',
              opacity: 0.15,
              transition: 'width 0.2s ease',
              borderRadius: '8px',
            }} />
            <span style={{ position: 'relative' as const }}>
              Downloading: {downloadProgress}% {downloadEta ? `(${downloadEta})` : ''}
            </span>
          </span>
        )}
        {downloadState === 'complete' && (
          <span style={{ ...styles.downloadBtn, borderColor: 'var(--success, #2ED573)', color: 'var(--success, #2ED573)', cursor: 'default' }}>
            ✓ Downloaded
          </span>
        )}
        {downloadState === 'error' && (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '4px' }}>
            <button
              type="button"
              onClick={() => onDownload(trackId)}
              style={{ ...styles.downloadBtn, borderColor: 'var(--danger, #FF4757)', color: 'var(--danger, #FF4757)' }}
            >
              ✗ Failed — Retry
            </button>
            {errorMessage && (
              <span style={{
                fontFamily: "'IBM Plex Mono', monospace",
                fontSize: '11px',
                color: 'var(--danger, #FF4757)',
                maxWidth: '200px',
                textAlign: 'right',
                lineHeight: 1.3,
                opacity: 0.8,
              }}>
                {errorMessage}
              </span>
            )}
          </div>
        )}
      </div>
    </article>
  );
}
