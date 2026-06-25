import type { AppRouterInstance } from 'next/dist/shared/lib/app-router-context.shared-runtime';

export function navigateToSearch(
  router: AppRouterInstance,
  { query, isYouTube }: { query: string; isYouTube: boolean },
): void {
  const params = new URLSearchParams();
  params.set('q', query);
  if (isYouTube) params.set('yt', '1');
  router.push(`/results?${params.toString()}`);
}
