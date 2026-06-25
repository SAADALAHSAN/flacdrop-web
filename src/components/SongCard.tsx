'use client';

import { useState } from 'react';
import { cardStyles, coverArtPlaceholderStyle } from '@/lib/cardStyles';
import type { DownloadState } from '@/lib/types';

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
  onDownload: (trackId: string) => void;
}

function formatDuration(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${s.toString().padStart(2, '0')}`;
}

const styles = {
  card: cardStyles.card,
  cardHover: cardStyles.cardHover,
  albumArt: { ...cardStyles.coverArt, boxShadow: undefined },
  meta: cardStyles.meta,
  title: cardStyles.title,
  subtitle: cardStyles.subtitle,
  row: cardStyles.badgeRow,
  qualityBadge: cardStyles.accentBadge,
  duration: cardStyles.mutedText,
  actions: cardStyles.actions,
  downloadBtn: cardStyles.actionBtn,
  downloadBtnHover: cardStyles.actionBtnHover,
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
        <div style={coverArtPlaceholderStyle(color)} aria-hidden="true">
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
          <button
            type="button"
            onClick={() => onDownload(trackId)}
            style={{ ...styles.downloadBtn, borderColor: 'var(--danger, #FF4757)', color: 'var(--danger, #FF4757)' }}
          >
            ✗ Failed — Retry
          </button>
        )}
      </div>
    </article>
  );
}
