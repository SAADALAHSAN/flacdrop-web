'use client';

import { useEffect } from 'react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Unhandled page error:', error);
  }, [error]);

  return (
    <div style={{
      minHeight: '60vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '48px 24px',
    }}>
      <div style={{
        maxWidth: '480px',
        textAlign: 'center',
      }}>
        <span style={{ fontSize: '48px', display: 'block', marginBottom: '16px' }}>
          ⚠
        </span>
        <h2 style={{
          fontFamily: "'Space Grotesk', sans-serif",
          fontSize: '24px',
          fontWeight: 700,
          color: 'var(--text-primary, #E8E8EC)',
          marginBottom: '12px',
        }}>
          Something went wrong
        </h2>
        <p style={{
          fontFamily: "'IBM Plex Mono', monospace",
          fontSize: '13px',
          color: 'var(--text-secondary, #6B6B76)',
          lineHeight: 1.7,
          marginBottom: '24px',
        }}>
          {error.message || 'An unexpected error occurred while loading this page.'}
        </p>
        <button
          onClick={reset}
          style={{
            padding: '10px 24px',
            borderRadius: '8px',
            border: '1px solid var(--accent, #00E5CC)',
            background: 'transparent',
            color: 'var(--accent, #00E5CC)',
            fontFamily: "'Space Grotesk', sans-serif",
            fontWeight: 600,
            fontSize: '14px',
            cursor: 'pointer',
          }}
        >
          Try Again
        </button>
      </div>
    </div>
  );
}
