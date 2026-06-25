'use client';

import { useEffect, useState, useCallback } from 'react';
import { API_BASE } from '@/lib/api';
import { downloadTrack } from '@/lib/download';
import type { DownloadState } from '@/lib/types';

interface Track {
  id: string;
  title: string;
  version: string;
  artist: string;
  artists: string[];
  album: string;
  duration: number;
  duration_formatted: string;
  albumArt: string;
  trackNumber: number;
  explicit: boolean;
}

interface AlbumData {
  id: string;
  title: string;
  artist: string;
  artists: string[];
  albumArt: string;
  tracksCount: number;
  releaseDate: string;
  tracks: Track[];
}

interface AlbumModalProps {
  albumId: string | null;
  isOpen: boolean;
  onClose: () => void;
}

const styles = {
  overlay: {
    position: 'fixed' as const,
    inset: 0,
    background: 'rgba(5, 5, 6, 0.8)',
    backdropFilter: 'blur(20px)',
    WebkitBackdropFilter: 'blur(20px)',
    zIndex: 1000,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '20px',
    animation: 'fadeIn 0.25s ease both',
  },
  modal: {
    background: 'var(--bg-secondary, #141416)',
    border: '1px solid var(--border, #2A2A30)',
    borderRadius: '20px',
    width: '100%',
    maxWidth: '840px',
    maxHeight: '90vh',
    display: 'flex',
    flexDirection: 'column' as const,
    overflow: 'hidden',
    boxShadow: '0 24px 64px rgba(0, 0, 0, 0.8)',
    position: 'relative' as const,
    animation: 'scaleIn 0.3s cubic-bezier(0.16, 1, 0.3, 1) both',
  },
  closeBtn: {
    position: 'absolute' as const,
    top: '20px',
    right: '20px',
    width: '36px',
    height: '36px',
    borderRadius: '50%',
    background: 'rgba(255, 255, 255, 0.04)',
    border: '1px solid var(--border, #2A2A30)',
    color: 'var(--text-secondary, #6B6B76)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    zIndex: 10,
  },
  closeBtnHover: {
    background: 'rgba(255, 71, 87, 0.1)',
    borderColor: 'rgba(255, 71, 87, 0.2)',
    color: 'var(--danger, #FF4757)',
  },
  header: {
    padding: '32px',
    borderBottom: '1px solid var(--border-subtle, #1F1F24)',
    display: 'flex',
    gap: '24px',
    alignItems: 'center',
    background: 'linear-gradient(180deg, rgba(0, 229, 204, 0.03) 0%, transparent 100%)',
    flexWrap: 'wrap' as const,
  },
  art: {
    width: '140px',
    height: '140px',
    borderRadius: '12px',
    objectFit: 'cover' as const,
    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.5)',
    background: '#1a1a1e',
  },
  info: {
    flex: 1,
    minWidth: '240px',
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '8px',
  },
  title: {
    fontFamily: "'Space Grotesk', sans-serif",
    fontSize: 'clamp(20px, 3vw, 28px)',
    fontWeight: 700,
    color: 'var(--text-primary, #E8E8EC)',
    margin: 0,
    lineHeight: 1.2,
  },
  artist: {
    fontFamily: "'IBM Plex Mono', monospace",
    fontSize: '14px',
    color: 'var(--text-secondary, #6B6B76)',
    margin: 0,
  },
  badgeRow: {
    display: 'flex',
    gap: '12px',
    alignItems: 'center',
    flexWrap: 'wrap' as const,
    marginTop: '6px',
  },
  badge: {
    display: 'inline-flex',
    alignItems: 'center',
    padding: '4px 12px',
    borderRadius: '100px',
    border: '1px solid var(--border, #2A2A30)',
    fontSize: '11px',
    fontFamily: "'IBM Plex Mono', monospace",
    color: 'var(--text-secondary, #6B6B76)',
  },
  accentBadge: {
    borderColor: 'var(--accent, #00E5CC)',
    color: 'var(--accent, #00E5CC)',
    background: 'var(--accent-dim, rgba(0, 229, 204, 0.05))',
  },
  actionArea: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-start',
    width: '100%',
    marginTop: '16px',
  },
  dlAllBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    padding: '12px 24px',
    borderRadius: '10px',
    border: '1px solid var(--accent, #00E5CC)',
    background: 'var(--accent, #00E5CC)',
    color: '#0A0A0C',
    fontFamily: "'Space Grotesk', sans-serif",
    fontWeight: 600,
    fontSize: '15px',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    boxShadow: '0 4px 20px rgba(0, 229, 204, 0.2)',
  },
  dlAllBtnHover: {
    background: 'var(--accent-hover, #00FFE0)',
    boxShadow: '0 0 24px rgba(0, 229, 204, 0.4)',
    transform: 'translateY(-1px)',
  },
  dlAllBtnDownloading: {
    background: 'transparent',
    borderColor: 'var(--warning, #FFA502)',
    color: 'var(--warning, #FFA502)',
    cursor: 'default',
    boxShadow: 'none',
  },
  dlAllBtnComplete: {
    background: 'transparent',
    borderColor: 'var(--success, #2ED573)',
    color: 'var(--success, #2ED573)',
    cursor: 'default',
    boxShadow: 'none',
  },
  tracksContainer: {
    flex: 1,
    overflowY: 'auto' as const,
    padding: '16px 32px 32px',
  },
  trackRow: {
    display: 'flex',
    alignItems: 'center',
    padding: '12px 16px',
    borderBottom: '1px solid var(--border-subtle, #1F1F24)',
    gap: '16px',
    borderRadius: '8px',
    transition: 'background 0.2s ease',
  },
  trackRowHover: {
    background: 'rgba(255, 255, 255, 0.02)',
  },
  trackNum: {
    width: '24px',
    fontFamily: "'IBM Plex Mono', monospace",
    fontSize: '12px',
    color: 'var(--text-tertiary, #3A3A44)',
    textAlign: 'center' as const,
  },
  trackMeta: {
    flex: 1,
    minWidth: 0,
  },
  trackTitle: {
    fontFamily: "'Space Grotesk', sans-serif",
    fontSize: '15px',
    fontWeight: 500,
    color: 'var(--text-primary, #E8E8EC)',
    margin: 0,
    whiteSpace: 'nowrap' as const,
    overflow: 'hidden' as const,
    textOverflow: 'ellipsis' as const,
  },
  trackArtists: {
    fontFamily: "'IBM Plex Mono', monospace",
    fontSize: '11px',
    color: 'var(--text-secondary, #6B6B76)',
    margin: 0,
    whiteSpace: 'nowrap' as const,
    overflow: 'hidden' as const,
    textOverflow: 'ellipsis' as const,
  },
  trackDuration: {
    fontFamily: "'IBM Plex Mono', monospace",
    fontSize: '13px',
    color: 'var(--text-secondary, #6B6B76)',
  },
  trackAction: {
    width: '180px',
    display: 'flex',
    justifyContent: 'flex-end',
    flexShrink: 0,
  },
  spinner: {
    width: '40px',
    height: '40px',
    border: '3px solid rgba(0, 229, 204, 0.1)',
    borderTopColor: 'var(--accent, #00E5CC)',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite',
    margin: '64px auto',
  },
  errorBox: {
    padding: '32px',
    textAlign: 'center' as const,
    color: 'var(--danger, #FF4757)',
    fontFamily: "'IBM Plex Mono', monospace",
    fontSize: '13px',
  },
};

const inlineStyles = {
  downloadBtn: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '6px',
    padding: '8px 16px',
    borderRadius: '6px',
    border: '1px solid var(--accent, #00E5CC)',
    background: 'transparent',
    color: 'var(--accent, #00E5CC)',
    fontFamily: "'Space Grotesk', sans-serif",
    fontWeight: 600,
    fontSize: '12px',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    whiteSpace: 'nowrap' as const,
    position: 'relative' as const,
    overflow: 'hidden' as const,
    width: '100%',
    maxWidth: '160px',
  },
  downloadBtnHover: {
    background: 'var(--accent, #00E5CC)',
    color: '#0A0A0C',
    boxShadow: '0 0 10px rgba(0, 229, 204, 0.3)',
  },
};

interface InlineDownloadButtonProps {
  trackId: string;
  trackTitle: string;
  trackArtist: string;
  downloadState: DownloadState;
  downloadProgress: number;
  downloadEta: string;
  onDownload: (trackId: string, title: string, artist: string) => void;
}

function InlineDownloadButton({
  trackId,
  trackTitle,
  trackArtist,
  downloadState,
  downloadProgress,
  downloadEta,
  onDownload,
}: InlineDownloadButtonProps) {
  const [hovered, setHovered] = useState(false);

  return (
    <div style={{ width: '100%', display: 'flex', justifyContent: 'flex-end' }}>
      {downloadState === 'idle' && (
        <button
          type="button"
          onClick={() => onDownload(trackId, trackTitle, trackArtist)}
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
          style={{ ...inlineStyles.downloadBtn, ...(hovered ? inlineStyles.downloadBtnHover : {}) }}
          aria-label={`Download ${trackTitle}`}
        >
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
            <polyline points="7 10 12 15 17 10" />
            <line x1="12" y1="15" x2="12" y2="3" />
          </svg>
          Download FLAC
        </button>
      )}

      {downloadState === 'queued' && (
        <span style={{
          ...inlineStyles.downloadBtn,
          cursor: 'default',
          opacity: 0.85,
          borderColor: 'var(--warning, #FFA502)',
          color: 'var(--warning, #FFA502)',
        }}>
          <span style={{
            position: 'absolute',
            top: 0,
            left: 0,
            height: '100%',
            width: `${downloadProgress}%`,
            background: 'var(--warning, #FFA502)',
            opacity: 0.15,
            transition: 'width 0.2s ease',
            borderRadius: '6px',
          }} />
          <span style={{ position: 'relative', fontSize: '11px' }}>
            Preparing: {downloadProgress}% {downloadEta ? `(${downloadEta})` : ''}
          </span>
        </span>
      )}

      {downloadState === 'downloading' && (
        <span style={{
          ...inlineStyles.downloadBtn,
          cursor: 'default',
        }}>
          <span style={{
            position: 'absolute',
            top: 0,
            left: 0,
            height: '100%',
            width: `${downloadProgress}%`,
            background: 'var(--accent, #00E5CC)',
            opacity: 0.15,
            transition: 'width 0.2s ease',
            borderRadius: '6px',
          }} />
          <span style={{ position: 'relative', fontSize: '11px' }}>
            Downloading: {downloadProgress}% {downloadEta ? `(${downloadEta})` : ''}
          </span>
        </span>
      )}

      {downloadState === 'complete' && (
        <span style={{
          ...inlineStyles.downloadBtn,
          borderColor: 'var(--success, #2ED573)',
          color: 'var(--success, #2ED573)',
          cursor: 'default',
        }}>
          ✓ Saved
        </span>
      )}

      {downloadState === 'error' && (
        <button
          type="button"
          onClick={() => onDownload(trackId, trackTitle, trackArtist)}
          style={{
            ...inlineStyles.downloadBtn,
            borderColor: 'var(--danger, #FF4757)',
            color: 'var(--danger, #FF4757)',
          }}
        >
          ✗ Failed — Retry
        </button>
      )}
    </div>
  );
}

export default function AlbumModal({ albumId, isOpen, onClose }: AlbumModalProps) {
  const [album, setAlbum] = useState<AlbumData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [closeHovered, setCloseHovered] = useState(false);
  const [dlAllHovered, setDlAllHovered] = useState(false);
  const [hoveredRow, setHoveredRow] = useState<string | null>(null);

  const [downloadStates, setDownloadStates] = useState<Record<string, DownloadState>>({});
  const [downloadProgress, setDownloadProgress] = useState<Record<string, number>>({});
  const [downloadEtas, setDownloadEtas] = useState<Record<string, string>>({});

  const [albumDownloadState, setAlbumDownloadState] = useState<'idle' | 'downloading' | 'complete'>('idle');
  const [albumDownloadProgressText, setAlbumDownloadProgressText] = useState('');

  // Fetch album tracklist
  useEffect(() => {
    if (!albumId || !isOpen) {
      setAlbum(null);
      setError(null);
      return;
    }

    const fetchAlbum = async () => {
      setLoading(true);
      setError(null);

      try {
        const res = await fetch(`${API_BASE}/api/album/${albumId}`);
        if (!res.ok) {
          throw new Error(`Failed to load album tracks (HTTP ${res.status})`);
        }
        const data = await res.json();
        setAlbum(data);
      } catch (err: any) {
        console.error(err);
        setError(err.message || 'Could not connect to server.');
      } finally {
        setLoading(false);
      }
    };

    fetchAlbum();
  }, [albumId, isOpen]);

  // Clean states when modal closes
  useEffect(() => {
    if (!isOpen) {
      setDownloadStates({});
      setDownloadProgress({});
      setDownloadEtas({});
      setAlbumDownloadState('idle');
      setAlbumDownloadProgressText('');
    }
  }, [isOpen]);

  const handleTrackDownload = useCallback(async (trackId: string, trackTitle: string, trackArtist: string): Promise<boolean> => {
    return downloadTrack(trackId, trackTitle, trackArtist, {
      setDownloadStates,
      setDownloadProgress,
      setDownloadEtas,
    });
  }, []);

  // Sequential Album Downloader Loop
  const handleDownloadFullAlbum = async () => {
    if (!album || album.tracks.length === 0 || albumDownloadState === 'downloading') return;

    setAlbumDownloadState('downloading');
    
    let completedCount = 0;
    const totalTracks = album.tracks.length;

    for (let i = 0; i < totalTracks; i++) {
      const track = album.tracks[i];
      
      // Skip already completed tracks
      if (downloadStates[track.id] === 'complete') {
        completedCount++;
        continue;
      }

      setAlbumDownloadProgressText(`Track ${i + 1} of ${totalTracks}`);
      
      // Download this track synchronously and wait for it
      const success = await handleTrackDownload(track.id, track.title, track.artist);
      if (success) {
        completedCount++;
      } else {
        // If one fails, we continue but warn
        console.warn(`Album download: Track ${track.title} failed.`);
      }
    }

    setAlbumDownloadState(completedCount === totalTracks ? 'complete' : 'idle');
    setAlbumDownloadProgressText(
      completedCount === totalTracks 
        ? 'All Tracks Downloaded!' 
        : `Downloaded ${completedCount} of ${totalTracks} tracks`
    );
  };

  if (!isOpen) return null;

  const releaseYear = album?.releaseDate ? album.releaseDate.split('-')[0] : 'Unknown';

  return (
    <div style={styles.overlay} onClick={onClose}>
      <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          onMouseEnter={() => setCloseHovered(true)}
          onMouseLeave={() => setCloseHovered(false)}
          style={{ ...styles.closeBtn, ...(closeHovered ? styles.closeBtnHover : {}) }}
          aria-label="Close album details"
        >
          ✕
        </button>

        {/* Dynamic States */}
        {loading && <div style={styles.spinner} />}
        
        {error && (
          <div style={styles.errorBox}>
            <span style={{ fontSize: '32px', display: 'block', marginBottom: '8px' }}>⚠</span>
            {error}
          </div>
        )}

        {/* Modal content */}
        {!loading && !error && album && (
          <>
            {/* Header Banner */}
            <div style={styles.header}>
              <img src={album.albumArt} alt={album.title} style={styles.art} />
              
              <div style={styles.info}>
                <h2 style={styles.title}>{album.title}</h2>
                <p style={styles.artist}>{album.artist}</p>
                
                <div style={styles.badgeRow}>
                  <span style={{ ...styles.badge, ...styles.accentBadge }}>LOSSLESS FLAC</span>
                  <span style={styles.badge}>{album.tracksCount} Songs</span>
                  <span style={styles.badge}>{releaseYear}</span>
                </div>

                {/* Album Action */}
                <div style={styles.actionArea}>
                  {albumDownloadState === 'idle' && (
                    <button
                      type="button"
                      onClick={handleDownloadFullAlbum}
                      onMouseEnter={() => setDlAllHovered(true)}
                      onMouseLeave={() => setDlAllHovered(false)}
                      style={{ ...styles.dlAllBtn, ...(dlAllHovered ? styles.dlAllBtnHover : {}) }}
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                        <polyline points="7 10 12 15 17 10" />
                        <line x1="12" y1="15" x2="12" y2="3" />
                      </svg>
                      Download Full Album
                    </button>
                  )}
                  {albumDownloadState === 'downloading' && (
                    <span style={{ ...styles.dlAllBtn, ...styles.dlAllBtnDownloading }}>
                      <span style={{
                        display: 'inline-block',
                        width: '12px',
                        height: '12px',
                        border: '2px solid rgba(255, 165, 2, 0.2)',
                        borderTopColor: 'var(--warning, #FFA502)',
                        borderRadius: '50%',
                        animation: 'spin 1s linear infinite',
                        marginRight: '8px',
                      }} />
                      Downloading {albumDownloadProgressText}...
                    </span>
                  )}
                  {albumDownloadState === 'complete' && (
                    <span style={{ ...styles.dlAllBtn, ...styles.dlAllBtnComplete }}>
                      ✓ {albumDownloadProgressText || 'Album Downloaded'}
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Tracks List */}
            <div style={styles.tracksContainer}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {album.tracks.map((track, i) => (
                  <div
                    key={track.id}
                    style={{
                      ...styles.trackRow,
                      ...(hoveredRow === track.id ? styles.trackRowHover : {}),
                    }}
                    onMouseEnter={() => setHoveredRow(track.id)}
                    onMouseLeave={() => setHoveredRow(null)}
                  >
                    {/* Index */}
                    <span style={styles.trackNum}>
                      {String(track.trackNumber || i + 1).padStart(2, '0')}
                    </span>
                    
                    {/* Meta */}
                    <div style={styles.trackMeta}>
                      <h4 style={styles.trackTitle}>
                        {track.title} {track.version ? `(${track.version})` : ''}
                      </h4>
                      <p style={styles.trackArtists}>{track.artists.join(', ')}</p>
                    </div>

                    {/* Duration */}
                    <span style={styles.trackDuration}>{track.duration_formatted}</span>

                    {/* Track Action */}
                    <div style={styles.trackAction}>
                      <InlineDownloadButton
                        trackId={track.id}
                        trackTitle={track.title}
                        trackArtist={track.artist}
                        downloadState={downloadStates[track.id] || 'idle'}
                        downloadProgress={downloadProgress[track.id] || 0}
                        downloadEta={downloadEtas[track.id] || ''}
                        onDownload={handleTrackDownload}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
