/**
 * Cloudflare Pages Function: proxies iTunes Lookup API for App Store ratings.
 * Avoids CORS by fetching server-side. Route: /api/rating
 */

const DEFAULT_APP_ID = '6757462559';

/** iTunes userRatingCount can lag behind visible reviews; floor per app when we know better. */
const USER_RATING_COUNT_MIN = { '6761225473': 2 };

export async function onRequestGet(context) {
  try {
    const url = new URL(context.request.url);
    const id = url.searchParams.get('id') || DEFAULT_APP_ID;
    const ITUNES_URL = `https://itunes.apple.com/lookup?id=${id}&country=gb`;
    const res = await fetch(ITUNES_URL);
    const data = await res.json();
    const app = data.results && data.results[0];
    if (!app) {
      return jsonResponse({ rating: 0, count: 0 }, 404);
    }
    const rating = app.averageUserRating || 0;
    let count = app.userRatingCount || 0;
    const floor = USER_RATING_COUNT_MIN[id];
    if (floor != null) count = Math.max(count, floor);
    return jsonResponse({ rating, count }, 200);
  } catch (e) {
    return jsonResponse({ error: 'Failed to fetch rating' }, 500);
  }
}

function jsonResponse(body, status) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'public, max-age=3600',
    },
  });
}
