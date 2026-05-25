'use client';

import { useMemo } from 'react';

type DownloadStatus = 'idle' | 'queued' | 'downloading' | 'complete' | 'error';

interface DownloadButtonProps {
  trackId: string;
  fileName: string;
  status: DownloadStatus;
  progress?: number; // 0-100, used when status === 'downloading'
  onClick: () => void;
  onRetry?: () => void;
}

const baseStyle: React.CSSProperties = {
  position: 'relative',
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '8px',
  padding: '12px 24px',
  borderRadius: '8px',
  fontFamily: "'Space Grotesk', sans-serif",
  fontWeight: 600,
  fontSize: '14px',
  cursor: 'pointer',
  border: 'none',
  transition: 'all 0.25s ease',
  overflow: 'hidden',
  minWidth: '180px',
  lineHeight: 1,
};

const statusConfig: Record<
  DownloadStatus,
  {
    label: string;
    icon: string;
    bg: string;
    color: string;
    border: string;
    glow?: string;
  }
> = {
  idle: {
    label: '⬇ Download FLAC',
    icon: '',
    bg: 'transparent',
    color: 'var(--accent, #00E5CC)',
    border: '1px solid var(--accent, #00E5CC)',
    glow: '0 0 20px rgba(0, 229, 204, 0.15)',
  },
  queued: {
    label: 'In Queue...',
    icon: '',
    bg: 'rgba(0, 229, 204, 0.08)',
    color: 'var(--accent, #00E5CC)',
    border: '1px solid rgba(0, 229, 204, 0.3)',
  },
  downloading: {
    label: 'Downloading',
    icon: '',
    bg: 'transparent',
    color: 'var(--accent, #00E5CC)',
    border: '1px solid rgba(0, 229, 204, 0.4)',
  },
  complete: {
    label: '✓ Downloaded',
    icon: '',
    bg: 'rgba(34, 197, 94, 0.1)',
    color: '#22C55E',
    border: '1px solid rgba(34, 197, 94, 0.4)',
  },
  error: {
    label: '✗ Failed — Retry',
    icon: '',
    bg: 'rgba(239, 68, 68, 0.1)',
    color: '#EF4444',
    border: '1px solid rgba(239, 68, 68, 0.4)',
  },
};

export default function DownloadButton({
  trackId,
  fileName,
  status,
  progress = 0,
  onClick,
  onRetry,
}: DownloadButtonProps) {
  const config = statusConfig[status];
  const clampedProgress = Math.min(100, Math.max(0, progress));

  const buttonStyle = useMemo<React.CSSProperties>(
    () => ({
      ...baseStyle,
      background: config.bg,
      color: config.color,
      border: config.border,
      boxShadow: config.glow ?? 'none',
      cursor: status === 'downloading' ? 'default' : 'pointer',
      animation: status === 'queued' ? 'pulse-glow 2s ease-in-out infinite' : 'none',
    }),
    [config, status]
  );

  const handleClick = () => {
    if (status === 'error' && onRetry) {
      onRetry();
      return;
    }
    if (status === 'idle') {
      onClick();
    }
  };

  return (
    <>
      <style>{`
        @keyframes pulse-glow {
          0%, 100% { opacity: 1; box-shadow: 0 0 8px rgba(0, 229, 204, 0.1); }
          50% { opacity: 0.85; box-shadow: 0 0 20px rgba(0, 229, 204, 0.25); }
        }
      `}</style>

      <button
        type="button"
        onClick={handleClick}
        style={buttonStyle}
        disabled={status === 'downloading' || status === 'complete'}
        aria-label={
          status === 'idle'
            ? `Download ${fileName} as FLAC`
            : status === 'error'
              ? `Retry download of ${fileName}`
              : `${config.label} — ${fileName}`
        }
        data-track-id={trackId}
      >
        {/* Progress bar fill (only visible during download) */}
        {status === 'downloading' && (
          <span
            aria-hidden="true"
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              height: '100%',
              width: `${clampedProgress}%`,
              background: 'rgba(0, 229, 204, 0.12)',
              borderRadius: '8px',
              transition: 'width 0.3s ease',
              pointerEvents: 'none',
            }}
          />
        )}

        <span style={{ position: 'relative', zIndex: 1 }}>
          {status === 'downloading'
            ? `Downloading · ${clampedProgress}%`
            : config.label}
        </span>
      </button>
    </>
  );
}
