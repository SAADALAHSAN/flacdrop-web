const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export interface Track {
  id: string;
  title: string;
  artist: string;
  album: string;
  duration: number; // seconds
  albumArt: string;
  quality: {
    format: string;
    bitDepth: number;
    sampleRate: number;
  };
}

export interface SearchResult {
  tracks: Track[];
  query: string;
  source: "search" | "youtube";
}

class ApiError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const url = `${API_BASE}${path}`;

  try {
    const res = await fetch(url, {
      headers: {
        "Content-Type": "application/json",
        ...init?.headers,
      },
      ...init,
    });

    if (!res.ok) {
      const body = await res.text().catch(() => "Unknown error");
      throw new ApiError(
        `API request failed: ${res.status} ${res.statusText} — ${body}`,
        res.status,
      );
    }

    const data = await res.json().catch(() => {
      throw new ApiError(
        `Invalid response from ${path}: expected JSON but received unparseable body`,
        res.status,
      );
    });

    return data as T;
  } catch (err) {
    if (err instanceof ApiError) throw err;

    throw new ApiError(
      `Network error: unable to reach ${url}. Is the backend running?`,
      0,
    );
  }
}

export async function searchTracks(query: string): Promise<SearchResult> {
  return request<SearchResult>(
    `/api/search?q=${encodeURIComponent(query)}`,
  );
}

export async function resolveYouTube(url: string): Promise<SearchResult> {
  return request<SearchResult>("/api/youtube/resolve", {
    method: "POST",
    body: JSON.stringify({ url }),
  });
}

export async function getTrackInfo(trackId: string): Promise<Track> {
  return request<Track>(`/api/tracks/${encodeURIComponent(trackId)}`);
}

export function getDownloadUrl(trackId: string): string {
  return `${API_BASE}/api/tracks/${encodeURIComponent(trackId)}/download`;
}

export async function getQueueStatus(): Promise<{
  position: number;
  estimatedSeconds: number;
}> {
  return request<{ position: number; estimatedSeconds: number }>(
    "/api/queue/status",
  );
}
