'use client';

import { Suspense, useState, useCallback, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import SearchBar from '@/components/SearchBar';
import SongCard from '@/components/SongCard';
import AlbumCard from '@/components/AlbumCard';
import AlbumModal from '@/components/AlbumModal';

type DownloadState = 'idle' | 'queued' | 'downloading' | 'complete' | 'error';

function SongCardSkeleton() {
  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      gap: '20px',
      padding: '20px',
      background: 'var(--surface, #111113)',
      border: '1px solid var(--border, #222226)',
      borderRadius: '12px',
      width: '100%',
      maxWidth: '720px',
      margin: '0 auto',
      animation: 'pulseGlow 2s ease infinite',
    }}>
      <div style={{
        width: '120px',
        height: '120px',
        borderRadius: '8px',
        background: 'linear-gradient(135deg, #1a1a1e, #222226)',
        flexShrink: 0,
      }} />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '12px', minWidth: 0 }}>
        <div style={{ height: '20px', width: '60%', background: '#222226', borderRadius: '4px' }} />
        <div style={{ height: '14px', width: '40%', background: '#1a1a1e', borderRadius: '4px' }} />
        <div style={{ display: 'flex', gap: '12px', marginTop: '8px' }}>
          <div style={{ height: '22px', width: '120px', background: '#1a1a1e', borderRadius: '100px' }} />
          <div style={{ height: '14px', width: '40px', background: '#1a1a1e', borderRadius: '4px', alignSelf: 'center' }} />
        </div>
      </div>
      <div style={{ width: '140px', height: '40px', background: '#222226', borderRadius: '8px', flexShrink: 0 }} />
    </div>
  );
}

function ResultsContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const query = searchParams.get('q') || '';
  const isYt = searchParams.get('yt') === '1';

  const [tracks, setTracks] = useState<any[]>([]);
  const [albums, setAlbums] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<'tracks' | 'albums'>('tracks');
  
  const [selectedAlbumId, setSelectedAlbumId] = useState<string | null>(null);
  const [isAlbumModalOpen, setIsAlbumModalOpen] = useState<boolean>(false);

  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [youtubeDetected, setYoutubeDetected] = useState<{ title: string; artist: string } | null>(null);

  const [downloadStates, setDownloadStates] = useState<Record<string, DownloadState>>({});
  const [downloadProgress, setDownloadProgress] = useState<Record<string, number>>({});
  const [downloadEtas, setDownloadEtas] = useState<Record<string, string>>({});

  const handleSearch = ({ query: q, isYouTube }: { query: string; isYouTube: boolean }) => {
    const params = new URLSearchParams();
    params.set('q', q);
    if (isYouTube) params.set('yt', '1');
    router.push(`/results?${params.toString()}`);
  };

  const fetchResults = useCallback(async (searchQuery: string, searchIsYt: boolean) => {
    if (!searchQuery.trim()) {
      setTracks([]);
      setAlbums([]);
      setYoutubeDetected(null);
      return;
    }

    setLoading(true);
    setError(null);
    setYoutubeDetected(null);

    const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
    const endpoint = searchIsYt 
      ? `${API_BASE}/api/resolve-yt?url=${encodeURIComponent(searchQuery)}`
      : `${API_BASE}/api/search?q=${encodeURIComponent(searchQuery)}`;

    try {
      const response = await fetch(endpoint);
      if (!response.ok) {
        throw new Error(`Failed to fetch results from server (HTTP ${response.status})`);
      }
      const data = await response.json();
      setTracks(data.tracks || []);
      setAlbums(data.albums || []);
      
      if (data.source === 'youtube' && data.youtube_detected) {
        setYoutubeDetected(data.youtube_detected);
        setActiveTab('tracks'); // YouTube always resolves to single track
      }
    } catch (err: any) {
      setError(err.message || 'Could not connect to the backend server. Please verify it is running.');
      setTracks([]);
      setAlbums([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchResults(query, isYt);
  }, [query, isYt, fetchResults]);

  const handleOpenAlbum = (albumId: string) => {
    setSelectedAlbumId(albumId);
    setIsAlbumModalOpen(true);
  };

  const handleDownload = useCallback(async (trackId: string, trackTitle: string, trackArtist: string) => {
    const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
    
    // Idle → Queued
    setDownloadStates(prev => ({ ...prev, [trackId]: 'queued' }));
    setDownloadProgress(prev => ({ ...prev, [trackId]: 0 }));
    setDownloadEtas(prev => ({ ...prev, [trackId]: '' }));

    // Start server-side preparation progress simulation with asymptotic slowdown (0-98%)
    let prepProgress = 0;
    let prepTimeoutId: NodeJS.Timeout | null = null;
    
    const runPrepAnimation = () => {
      let delay = 120;
      let step = 0;
      
      if (prepProgress < 50) {
        step = Math.round(Math.random() * 8 + 6); // Fast growth
        delay = 120;
      } else if (prepProgress < 80) {
        step = Math.round(Math.random() * 4 + 2); // Medium growth
        delay = 250;
      } else if (prepProgress < 94) {
        step = Math.round(Math.random() * 2 + 1); // Slow growth
        delay = 600;
      } else if (prepProgress < 98) {
        step = 1; // Creeping growth
        delay = 1500;
      }
      
      prepProgress += step;
      if (prepProgress > 98) {
        prepProgress = 98; // Cap at 98% to avoid completing prematurely
      }
      
      // Calculate an estimated preparation time remaining based on progress
      let prepEta = '';
      if (prepProgress < 40) {
        prepEta = '~4s left';
      } else if (prepProgress < 70) {
        prepEta = '~3s left';
      } else if (prepProgress < 90) {
        prepEta = '~2s left';
      } else if (prepProgress < 95) {
        prepEta = '~1s left';
      } else {
        prepEta = 'almost ready...';
      }

      setDownloadProgress(prev => ({ ...prev, [trackId]: prepProgress }));
      setDownloadEtas(prev => ({ ...prev, [trackId]: prepEta }));
      
      if (prepProgress < 98) {
        prepTimeoutId = setTimeout(runPrepAnimation, delay);
      }
    };

    runPrepAnimation();

    try {
      const response = await fetch(`${API_BASE}/api/download/${trackId}`);
      
      // Stop preparation interval once response is received
      if (prepTimeoutId) {
        clearTimeout(prepTimeoutId);
      }

      if (!response.ok) {
        throw new Error(`Server returned ${response.status}`);
      }

      // Check if response is JSON (like queue full or other backend API issue)
      const contentType = response.headers.get('content-type') || '';
      if (contentType.includes('application/json')) {
        const errData = await response.json();
        throw new Error(errData.detail || errData.message || 'Download failed');
      }

      // Read Content-Length
      const contentLengthHeader = response.headers.get('content-length');
      const contentLength = contentLengthHeader ? parseInt(contentLengthHeader, 10) : 0;

      // We are officially downloading now
      setDownloadStates(prev => ({ ...prev, [trackId]: 'downloading' }));
      setDownloadProgress(prev => ({ ...prev, [trackId]: 0 }));
      setDownloadEtas(prev => ({ ...prev, [trackId]: '' }));

      const reader = response.body?.getReader();
      if (!reader) {
        throw new Error('ReadableStream not supported in this browser.');
      }

      let receivedLength = 0;
      const chunks: any[] = [];
      const downloadStartTime = Date.now();

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        chunks.push(value);
        receivedLength += value.length;

        if (contentLength > 0) {
          const progress = Math.round((receivedLength / contentLength) * 100);
          setDownloadProgress(prev => ({ ...prev, [trackId]: Math.min(progress, 99) }));

          // Calculate Speed & Real-time ETA based on raw stream transfer
          const elapsedSeconds = (Date.now() - downloadStartTime) / 1000;
          if (elapsedSeconds > 0.2) {
            const speedBps = receivedLength / elapsedSeconds;
            const remainingBytes = contentLength - receivedLength;
            const remainingSeconds = speedBps > 0 ? Math.round(remainingBytes / speedBps) : 0;
            
            let etaText = '';
            if (remainingSeconds > 60) {
              const m = Math.floor(remainingSeconds / 60);
              const s = remainingSeconds % 60;
              etaText = `${m}m ${s}s left`;
            } else {
              etaText = `${remainingSeconds}s left`;
            }
            setDownloadEtas(prev => ({ ...prev, [trackId]: etaText }));
          }
        }
      }

      // Completed downloading stream
      setDownloadProgress(prev => ({ ...prev, [trackId]: 100 }));
      setDownloadEtas(prev => ({ ...prev, [trackId]: '' }));

      // Assemble file download
      const blob = new Blob(chunks, { type: 'audio/flac' });
      const downloadUrl = window.URL.createObjectURL(blob);
      
      const safeTitle = trackTitle.replace(/[^a-zA-Z0-9 -_]/g, '').trim();
      const safeArtist = trackArtist.replace(/[^a-zA-Z0-9 -_]/g, '').trim();
      const filename = `${safeArtist} - ${safeTitle}.flac`;

      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(downloadUrl);

      setDownloadStates(prev => ({ ...prev, [trackId]: 'complete' }));
    } catch {
      if (prepTimeoutId) {
        clearTimeout(prepTimeoutId);
      }
      setDownloadStates(prev => ({ ...prev, [trackId]: 'error' }));
      setDownloadEtas(prev => ({ ...prev, [trackId]: 'failed' }));
    }
  }, []);

  return (
    <div style={{
      minHeight: '100vh',
      paddingTop: '32px',
      paddingBottom: '96px',
    }}>
      <div className="container">
        {/* Search bar at top */}
        <div style={{ marginBottom: '48px', maxWidth: '720px', margin: '0 auto 48px' }}>
          <SearchBar onSearch={handleSearch} />
        </div>

        {/* Results header */}
        <div style={{ marginBottom: '32px', maxWidth: '720px', margin: '0 auto 32px' }}>
          {isYt && (
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '8px 16px',
              borderRadius: '8px',
              background: 'rgba(255, 71, 87, 0.08)',
              border: '1px solid rgba(255, 71, 87, 0.2)',
              marginBottom: '16px',
              fontFamily: "var(--font-ibm-plex-mono, 'IBM Plex Mono', monospace)",
              fontSize: '12px',
              color: 'var(--danger, #FF4757)',
            }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M23.5 6.2a3 3 0 0 0-2.1-2.1C19.5 3.5 12 3.5 12 3.5s-7.5 0-9.4.6A3 3 0 0 0 .5 6.2 31.9 31.9 0 0 0 0 12a31.9 31.9 0 0 0 .5 5.8 3 3 0 0 0 2.1 2.1c1.9.6 9.4.6 9.4.6s7.5 0 9.4-.6a3 3 0 0 0 2.1-2.1c.3-1.9.5-3.8.5-5.8s-.2-3.9-.5-5.8zM9.5 15.5V8.5l6.3 3.5-6.3 3.5z" />
              </svg>
              YouTube link detected {youtubeDetected && `— Resolved to: "${youtubeDetected.title}" by ${youtubeDetected.artist}`}
            </div>
          )}

          <h1 style={{
            fontFamily: "var(--font-space-grotesk, 'Space Grotesk', sans-serif)",
            fontSize: 'clamp(24px, 4vw, 36px)',
            fontWeight: 700,
            color: 'var(--text-primary, #E8E8EC)',
            marginBottom: '8px',
          }}>
            Results for &ldquo;{query}&rdquo;
          </h1>
          <p style={{
            fontFamily: "var(--font-ibm-plex-mono, 'IBM Plex Mono', monospace)",
            fontSize: '13px',
            color: 'var(--text-secondary, #6B6B76)',
          }}>
            {!loading && (
              activeTab === 'tracks'
                ? `${tracks.length} tracks found · All genuine FLAC quality`
                : `${albums.length} albums found · All genuine FLAC quality`
            )}
            {loading && 'Searching Lossless Database...'}
          </p>
        </div>

        {/* Industrial Tab Selector (only show if not loading and has query, and not YouTube search) */}
        {!loading && query && !isYt && (
          <div style={{
            display: 'flex',
            background: 'var(--bg-secondary, #141416)',
            border: '1px solid var(--border, #2A2A30)',
            borderRadius: '8px',
            padding: '4px',
            maxWidth: '720px',
            margin: '0 auto 32px',
            gap: '4px',
          }}>
            <button
              onClick={() => setActiveTab('tracks')}
              style={{
                flex: 1,
                padding: '10px',
                borderRadius: '6px',
                fontFamily: "var(--font-space-grotesk, 'Space Grotesk', sans-serif)",
                fontSize: '14px',
                fontWeight: 600,
                textAlign: 'center',
                cursor: 'pointer',
                background: activeTab === 'tracks' ? 'var(--border, #2A2A30)' : 'transparent',
                color: activeTab === 'tracks' ? 'var(--accent, #00E5CC)' : 'var(--text-secondary, #6B6B76)',
                transition: 'all 0.2s ease',
              }}
            >
              🎵 Tracks ({tracks.length})
            </button>
            <button
              onClick={() => setActiveTab('albums')}
              style={{
                flex: 1,
                padding: '10px',
                borderRadius: '6px',
                fontFamily: "var(--font-space-grotesk, 'Space Grotesk', sans-serif)",
                fontSize: '14px',
                fontWeight: 600,
                textAlign: 'center',
                cursor: 'pointer',
                background: activeTab === 'albums' ? 'var(--border, #2A2A30)' : 'transparent',
                color: activeTab === 'albums' ? 'var(--accent, #00E5CC)' : 'var(--text-secondary, #6B6B76)',
                transition: 'all 0.2s ease',
              }}
            >
              💽 Albums ({albums.length})
            </button>
          </div>
        )}

        {/* Loading Skeletons */}
        {loading && (
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '16px',
            marginBottom: '48px',
          }}>
            <SongCardSkeleton />
            <SongCardSkeleton />
            <SongCardSkeleton />
          </div>
        )}

        {/* Error State */}
        {error && (
          <div style={{
            padding: '40px',
            borderRadius: '12px',
            border: '1px solid rgba(255, 71, 87, 0.2)',
            background: 'rgba(255, 71, 87, 0.05)',
            textAlign: 'center',
            maxWidth: '720px',
            margin: '0 auto 48px',
          }}>
            <span style={{ fontSize: '48px', display: 'block', marginBottom: '16px' }}>⚠</span>
            <h3 style={{
              fontFamily: "var(--font-space-grotesk, 'Space Grotesk', sans-serif)",
              fontSize: '20px',
              fontWeight: 600,
              color: 'var(--danger, #FF4757)',
              marginBottom: '12px',
            }}>
              Search Connection Error
            </h3>
            <p style={{
              fontFamily: "var(--font-ibm-plex-mono, 'IBM Plex Mono', monospace)",
              fontSize: '13px',
              color: 'var(--text-secondary, #6B6B76)',
              lineHeight: 1.6,
              marginBottom: '24px',
              maxWidth: '500px',
              margin: '0 auto 24px',
            }}>
              {error}
            </p>
            <button
              onClick={() => fetchResults(query, isYt)}
              className="btn-secondary"
              style={{
                fontFamily: "var(--font-space-grotesk, 'Space Grotesk', sans-serif)",
                fontSize: '14px',
                fontWeight: 600,
                padding: '10px 24px',
                borderRadius: '8px',
                cursor: 'pointer',
              }}
            >
              Retry Search
            </button>
          </div>
        )}

        {/* Empty State Tracks */}
        {!loading && !error && tracks.length === 0 && activeTab === 'tracks' && query && (
          <div style={{
            padding: '48px 24px',
            borderRadius: '12px',
            border: '1px solid var(--border, #2A2A30)',
            background: 'var(--surface, #111113)',
            textAlign: 'center',
            maxWidth: '720px',
            margin: '0 auto 48px',
          }}>
            <span style={{ fontSize: '48px', display: 'block', marginBottom: '16px' }}>🔍</span>
            <h3 style={{
              fontFamily: "var(--font-space-grotesk, 'Space Grotesk', sans-serif)",
              fontSize: '20px',
              fontWeight: 600,
              color: 'var(--text-primary, #E8E8EC)',
              marginBottom: '12px',
            }}>
              No Lossless Matches Found
            </h3>
            <p style={{
              fontFamily: "var(--font-ibm-plex-mono, 'IBM Plex Mono', monospace)",
              fontSize: '13px',
              color: 'var(--text-secondary, #6B6B76)',
              lineHeight: 1.6,
              maxWidth: '500px',
              margin: '0 auto',
            }}>
              Tidal couldn&apos;t find any matching tracks for &ldquo;{query}&rdquo;. Check your spelling or try search terms with artist names.
            </p>
          </div>
        )}

        {/* Empty State Albums */}
        {!loading && !error && albums.length === 0 && activeTab === 'albums' && query && (
          <div style={{
            padding: '48px 24px',
            borderRadius: '12px',
            border: '1px solid var(--border, #2A2A30)',
            background: 'var(--surface, #111113)',
            textAlign: 'center',
            maxWidth: '720px',
            margin: '0 auto 48px',
          }}>
            <span style={{ fontSize: '48px', display: 'block', marginBottom: '16px' }}>💽</span>
            <h3 style={{
              fontFamily: "var(--font-space-grotesk, 'Space Grotesk', sans-serif)",
              fontSize: '20px',
              fontWeight: 600,
              color: 'var(--text-primary, #E8E8EC)',
              marginBottom: '12px',
            }}>
              No Lossless Albums Found
            </h3>
            <p style={{
              fontFamily: "var(--font-ibm-plex-mono, 'IBM Plex Mono', monospace)",
              fontSize: '13px',
              color: 'var(--text-secondary, #6B6B76)',
              lineHeight: 1.6,
              maxWidth: '500px',
              margin: '0 auto',
            }}>
              Tidal couldn&apos;t find any matching albums for &ldquo;{query}&rdquo;.
            </p>
          </div>
        )}

        {/* Tracks List */}
        {!loading && !error && activeTab === 'tracks' && tracks.length > 0 && (
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '16px',
            marginBottom: '48px',
            width: '100%',
            alignItems: 'center',
          }}>
            {tracks.map((track) => (
              <SongCard
                key={track.id}
                title={track.title}
                artist={track.artist}
                album={track.album}
                duration={track.duration}
                albumArt={track.albumArt}
                trackId={track.id}
                downloadState={downloadStates[track.id] || 'idle'}
                downloadProgress={downloadProgress[track.id] || 0}
                downloadEta={downloadEtas[track.id] || ''}
                onDownload={() => handleDownload(track.id, track.title, track.artist)}
              />
            ))}
          </div>
        )}

        {/* Albums List */}
        {!loading && !error && activeTab === 'albums' && albums.length > 0 && (
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '16px',
            marginBottom: '48px',
            width: '100%',
            alignItems: 'center',
          }}>
            {albums.map((albumItem) => (
              <AlbumCard
                key={albumItem.id}
                id={albumItem.id}
                title={albumItem.title}
                artist={albumItem.artist}
                tracksCount={albumItem.tracksCount}
                albumArt={albumItem.albumArt}
                releaseDate={albumItem.releaseDate}
                onOpenTracks={handleOpenAlbum}
              />
            ))}
          </div>
        )}

        {/* Ad banner placeholder */}
        <div style={{
          padding: '24px',
          borderRadius: '12px',
          border: '1px dashed var(--border, #2A2A30)',
          textAlign: 'center',
          fontFamily: "var(--font-ibm-plex-mono, 'IBM Plex Mono', monospace)",
          fontSize: '12px',
          color: 'var(--text-tertiary, #3A3A44)',
          maxWidth: '720px',
          margin: '0 auto',
        }}>
          Ad Space — Google AdSense will be placed here
        </div>
      </div>

      {/* Album Tracks Browse Modal */}
      <AlbumModal
        albumId={selectedAlbumId}
        isOpen={isAlbumModalOpen}
        onClose={() => setIsAlbumModalOpen(false)}
      />
    </div>
  );
}

export default function ResultsPage() {
  return (
    <Suspense fallback={
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: "var(--font-ibm-plex-mono, 'IBM Plex Mono', monospace)",
        color: 'var(--text-secondary, #6B6B76)',
      }}>
        Loading results...
      </div>
    }>
      <ResultsContent />
    </Suspense>
  );
}
