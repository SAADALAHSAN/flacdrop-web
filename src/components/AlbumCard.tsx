'use client';

import { useState } from 'react';
import { cardStyles, coverArtPlaceholderStyle } from '@/lib/cardStyles';

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
  card: cardStyles.card,
  cardHover: cardStyles.cardHover,
  albumArt: { ...cardStyles.coverArt, boxShadow: '0 4px 12px rgba(0, 0, 0, 0.4)' },
  meta: cardStyles.meta,
  title: cardStyles.title,
  subtitle: cardStyles.subtitle,
  row: cardStyles.badgeRow,
  countBadge: cardStyles.accentBadge,
  year: cardStyles.mutedText,
  actions: cardStyles.actions,
  viewBtn: cardStyles.actionBtn,
  viewBtnHover: cardStyles.actionBtnHover,
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
        <div style={coverArtPlaceholderStyle(color)} aria-hidden="true">
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
