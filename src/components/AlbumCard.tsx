'use client';

import { useState } from 'react';

interface AlbumCardProps {
  id: string;
  title: string;
  artist: string;
  tracksCount: number;
  albumArt: string;
  releaseDate?: string;
  color?: string;
  onOpenTracks: (albumId: string) => void;
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
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.4)',
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
  countBadge: {
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
  year: {
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
  viewBtn: {
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
  viewBtnHover: {
    background: 'var(--accent, #00E5CC)',
    color: '#0A0A0C',
    boxShadow: '0 0 20px rgba(0, 229, 204, 0.3)',
  },
};

export default function AlbumCard({
  id,
  title,
  artist,
  tracksCount,
  albumArt,
  releaseDate,
  color,
  onOpenTracks,
}: AlbumCardProps) {
  const [hovered, setHovered] = useState(false);
  const [btnHovered, setBtnHovered] = useState(false);
  const [imgError, setImgError] = useState(false);

  // Extract year from release date (format: YYYY-MM-DD or YYYY)
  const releaseYear = releaseDate ? releaseDate.split('-')[0] : 'Unknown';

  return (
    <article
      style={{ ...styles.card, ...(hovered ? styles.cardHover : {}) }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {albumArt && !imgError ? (
        <img
          src={albumArt}
          alt={`${title} album cover`}
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
          💽
        </div>
      )}

      <div style={styles.meta}>
        <h3 style={styles.title}>{title}</h3>
        <p style={styles.subtitle}>{artist}</p>
        <div style={styles.row}>
          <span style={styles.countBadge}>
            {tracksCount} {tracksCount === 1 ? 'Track' : 'Tracks'}
          </span>
          <span style={styles.year}>{releaseYear} · FLAC</span>
        </div>
      </div>

      <div style={styles.actions}>
        <button
          type="button"
          onClick={() => onOpenTracks(id)}
          onMouseEnter={() => setBtnHovered(true)}
          onMouseLeave={() => setBtnHovered(false)}
          style={{ ...styles.viewBtn, ...(btnHovered ? styles.viewBtnHover : {}) }}
          aria-label={`Browse tracks for ${title}`}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <line x1="8" y1="6" x2="21" y2="6" />
            <line x1="8" y1="12" x2="21" y2="12" />
            <line x1="8" y1="18" x2="21" y2="18" />
            <line x1="3" y1="6" x2="3.01" y2="6" />
            <line x1="3" y1="12" x2="3.01" y2="12" />
            <line x1="3" y1="18" x2="3.01" y2="18" />
          </svg>
          View Tracks
        </button>
      </div>
    </article>
  );
}
