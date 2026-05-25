'use client';

import { useState, useCallback, type KeyboardEvent, type ChangeEvent } from 'react';

interface SearchBarProps {
  onSearch: (result: { query: string; isYouTube: boolean }) => void;
}

function isYouTubeUrl(input: string): boolean {
  const trimmed = input.trim().toLowerCase();
  return trimmed.includes('youtube.com') || trimmed.includes('youtu.be');
}

const styles = {
  container: {
    position: 'relative' as const,
    display: 'flex',
    alignItems: 'center',
    width: '100%',
    maxWidth: '720px',
    margin: '0 auto',
    background: 'var(--surface, #111113)',
    borderWidth: '1px',
    borderStyle: 'solid',
    borderColor: 'var(--border, #222226)',
    borderRadius: '12px',
    transition: 'border-color 0.2s ease, box-shadow 0.2s ease',
  },
  containerFocused: {
    borderColor: 'var(--accent, #00E5CC)',
    boxShadow: '0 0 0 3px rgba(0, 229, 204, 0.1)',
  },
  iconWrap: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    paddingLeft: '16px',
    flexShrink: 0,
  },
  input: {
    flex: 1,
    background: 'transparent',
    border: 'none',
    outline: 'none',
    color: 'var(--text-primary, #F0F0F0)',
    fontFamily: "'IBM Plex Mono', monospace",
    fontSize: '15px',
    padding: '16px 12px',
    width: '100%',
    lineHeight: 1.5,
  },
  badge: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '4px',
    padding: '4px 10px',
    borderRadius: '6px',
    background: 'rgba(255, 0, 0, 0.1)',
    border: '1px solid rgba(255, 0, 0, 0.3)',
    color: '#FF4444',
    fontSize: '11px',
    fontFamily: "'IBM Plex Mono', monospace",
    fontWeight: 600,
    letterSpacing: '0.5px',
    textTransform: 'uppercase' as const,
    whiteSpace: 'nowrap' as const,
    marginRight: '8px',
    flexShrink: 0,
  },
  button: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '6px',
    padding: '10px 20px',
    margin: '6px',
    borderRadius: '8px',
    border: 'none',
    background: 'var(--accent, #00E5CC)',
    color: '#0A0A0C',
    fontFamily: "'Space Grotesk', sans-serif",
    fontWeight: 600,
    fontSize: '14px',
    cursor: 'pointer',
    transition: 'opacity 0.15s ease, transform 0.1s ease',
    flexShrink: 0,
  },
};

export default function SearchBar({ onSearch }: SearchBarProps) {
  const [query, setQuery] = useState('');
  const [focused, setFocused] = useState(false);

  const isYT = isYouTubeUrl(query);

  const handleSubmit = useCallback(() => {
    const trimmed = query.trim();
    if (!trimmed) return;
    onSearch({ query: trimmed, isYouTube: isYT });
  }, [query, isYT, onSearch]);

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSubmit();
    }
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
  };

  return (
    <div
      style={{
        ...styles.container,
        ...(focused ? styles.containerFocused : {}),
      }}
      role="search"
    >
      {/* Search icon */}
      <div style={styles.iconWrap}>
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="var(--text-muted, #888)"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <circle cx="11" cy="11" r="8" />
          <line x1="21" y1="21" x2="16.65" y2="16.65" />
        </svg>
      </div>

      <input
        type="text"
        value={query}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        placeholder="Search a song or paste a YouTube link..."
        aria-label="Search for a song or paste a YouTube link"
        style={styles.input}
      />

      {isYT && (
        <span style={styles.badge}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="#FF4444" aria-hidden="true">
            <path d="M23.5 6.2a3 3 0 0 0-2.1-2.1C19.5 3.5 12 3.5 12 3.5s-7.5 0-9.4.6A3 3 0 0 0 .5 6.2 31.9 31.9 0 0 0 0 12a31.9 31.9 0 0 0 .5 5.8 3 3 0 0 0 2.1 2.1c1.9.6 9.4.6 9.4.6s7.5 0 9.4-.6a3 3 0 0 0 2.1-2.1c.3-1.9.5-3.8.5-5.8s-.2-3.9-.5-5.8zM9.5 15.5V8.5l6.3 3.5-6.3 3.5z" />
          </svg>
          YouTube
        </span>
      )}

      <button
        type="button"
        onClick={handleSubmit}
        style={styles.button}
        onMouseDown={(e) => e.preventDefault()}
        aria-label="Search"
      >
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <circle cx="11" cy="11" r="8" />
          <line x1="21" y1="21" x2="16.65" y2="16.65" />
        </svg>
        Search
      </button>
    </div>
  );
}
