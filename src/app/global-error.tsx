'use client';

import { useEffect } from 'react';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Unhandled global error:', error);
  }, [error]);

  return (
    <html lang="en">
      <body style={{
        margin: 0,
        background: '#0A0A0B',
        color: '#E8E8EC',
        fontFamily: "'Space Grotesk', sans-serif",
      }}>
        <div style={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '48px 24px',
        }}>
          <div style={{ maxWidth: '480px', textAlign: 'center' }}>
            <span style={{ fontSize: '48px', display: 'block', marginBottom: '16px' }}>
              ⚠
            </span>
            <h2 style={{ fontSize: '24px', fontWeight: 700, marginBottom: '12px' }}>
              Something went wrong
            </h2>
            <p style={{
              fontFamily: "'IBM Plex Mono', monospace",
              fontSize: '13px',
              color: '#6B6B76',
              lineHeight: 1.7,
              marginBottom: '24px',
            }}>
              {error.message || 'A critical error occurred. Please try refreshing the page.'}
            </p>
            <button
              onClick={reset}
              style={{
                padding: '10px 24px',
                borderRadius: '8px',
                border: '1px solid #00E5CC',
                background: 'transparent',
                color: '#00E5CC',
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
      </body>
    </html>
  );
}
