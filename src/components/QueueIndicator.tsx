'use client';

interface QueueIndicatorProps {
  position: number;
  estimatedSeconds: number;
}

function formatWait(seconds: number): string {
  if (seconds < 60) return `${seconds}s`;
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  if (s === 0) return `${m}m`;
  return `${m}m ${s}s`;
}

export default function QueueIndicator({ position, estimatedSeconds }: QueueIndicatorProps) {
  if (position <= 0) return null;

  return (
    <>
      <style>{`
        @keyframes queue-pulse {
          0%, 100% { opacity: 0.7; }
          50% { opacity: 1; }
        }
      `}</style>

      <div
        role="status"
        aria-live="polite"
        aria-label={`Queue position ${position}, estimated wait ${formatWait(estimatedSeconds)}`}
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '6px',
          padding: '6px 0',
          fontFamily: "'IBM Plex Mono', monospace",
          fontSize: '12px',
          color: 'var(--text-muted, #888)',
          animation: 'queue-pulse 2.5s ease-in-out infinite',
        }}
      >
        <span
          aria-hidden="true"
          style={{
            display: 'inline-block',
            width: '6px',
            height: '6px',
            borderRadius: '50%',
            background: 'var(--accent, #00E5CC)',
            opacity: 0.6,
          }}
        />
        <span>
          Position #{position} in queue · ~{formatWait(estimatedSeconds)} remaining
        </span>
      </div>
    </>
  );
}
