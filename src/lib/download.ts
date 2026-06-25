import { API_BASE } from '@/lib/api';
import type { DownloadState } from '@/lib/types';

export interface DownloadStateSetters {
  setDownloadStates: React.Dispatch<React.SetStateAction<Record<string, DownloadState>>>;
  setDownloadProgress: React.Dispatch<React.SetStateAction<Record<string, number>>>;
  setDownloadEtas: React.Dispatch<React.SetStateAction<Record<string, string>>>;
}

interface PrepAnimationResult {
  stop: () => void;
}

function startPrepAnimation(
  trackId: string,
  setters: DownloadStateSetters,
): PrepAnimationResult {
  let prepProgress = 0;
  let timeoutId: NodeJS.Timeout | null = null;

  const run = () => {
    let delay = 120;
    let step = 0;

    if (prepProgress < 50) {
      step = Math.round(Math.random() * 8 + 6);
      delay = 120;
    } else if (prepProgress < 80) {
      step = Math.round(Math.random() * 4 + 2);
      delay = 250;
    } else if (prepProgress < 94) {
      step = Math.round(Math.random() * 2 + 1);
      delay = 600;
    } else if (prepProgress < 98) {
      step = 1;
      delay = 1500;
    }

    prepProgress += step;
    if (prepProgress > 98) prepProgress = 98;

    let prepEta = '';
    if (prepProgress < 40) prepEta = '~4s left';
    else if (prepProgress < 70) prepEta = '~3s left';
    else if (prepProgress < 90) prepEta = '~2s left';
    else if (prepProgress < 95) prepEta = '~1s left';
    else prepEta = 'almost ready...';

    setters.setDownloadProgress(prev => ({ ...prev, [trackId]: prepProgress }));
    setters.setDownloadEtas(prev => ({ ...prev, [trackId]: prepEta }));

    if (prepProgress < 98) {
      timeoutId = setTimeout(run, delay);
    }
  };

  run();

  return {
    stop: () => {
      if (timeoutId) clearTimeout(timeoutId);
    },
  };
}

export function sanitizeFilename(title: string, artist: string): string {
  const safeTitle = title.replace(/[^a-zA-Z0-9 \-_]/g, '').trim();
  const safeArtist = artist.replace(/[^a-zA-Z0-9 \-_]/g, '').trim();
  return `${safeArtist} - ${safeTitle}.flac`;
}

function triggerBrowserDownload(blob: Blob, filename: string): void {
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.URL.revokeObjectURL(url);
}

export async function downloadTrack(
  trackId: string,
  trackTitle: string,
  trackArtist: string,
  setters: DownloadStateSetters,
): Promise<boolean> {
  setters.setDownloadStates(prev => ({ ...prev, [trackId]: 'queued' }));
  setters.setDownloadProgress(prev => ({ ...prev, [trackId]: 0 }));
  setters.setDownloadEtas(prev => ({ ...prev, [trackId]: '' }));

  const prepAnimation = startPrepAnimation(trackId, setters);

  try {
    const response = await fetch(`${API_BASE}/api/download/${trackId}`);
    prepAnimation.stop();

    if (!response.ok) {
      throw new Error(`Server returned ${response.status}`);
    }

    const contentType = response.headers.get('content-type') || '';
    if (contentType.includes('application/json')) {
      const errData = await response.json();
      throw new Error(errData.detail || errData.message || 'Download failed');
    }

    const contentLengthHeader = response.headers.get('content-length');
    const contentLength = contentLengthHeader ? parseInt(contentLengthHeader, 10) : 0;

    setters.setDownloadStates(prev => ({ ...prev, [trackId]: 'downloading' }));
    setters.setDownloadProgress(prev => ({ ...prev, [trackId]: 0 }));
    setters.setDownloadEtas(prev => ({ ...prev, [trackId]: '' }));

    const reader = response.body?.getReader();
    if (!reader) {
      throw new Error('ReadableStream not supported in this browser.');
    }

    let receivedLength = 0;
    const chunks: BlobPart[] = [];
    const downloadStartTime = Date.now();

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      chunks.push(value);
      receivedLength += value.length;

      if (contentLength > 0) {
        const progress = Math.round((receivedLength / contentLength) * 100);
        setters.setDownloadProgress(prev => ({ ...prev, [trackId]: Math.min(progress, 99) }));

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
          setters.setDownloadEtas(prev => ({ ...prev, [trackId]: etaText }));
        }
      }
    }

    setters.setDownloadProgress(prev => ({ ...prev, [trackId]: 100 }));
    setters.setDownloadEtas(prev => ({ ...prev, [trackId]: '' }));

    const blob = new Blob(chunks, { type: 'audio/flac' });
    const filename = sanitizeFilename(trackTitle, trackArtist);
    triggerBrowserDownload(blob, filename);

    setters.setDownloadStates(prev => ({ ...prev, [trackId]: 'complete' }));
    return true;
  } catch (err) {
    prepAnimation.stop();
    console.error('Download error:', err);
    setters.setDownloadStates(prev => ({ ...prev, [trackId]: 'error' }));
    setters.setDownloadEtas(prev => ({ ...prev, [trackId]: 'failed' }));
    return false;
  }
}
