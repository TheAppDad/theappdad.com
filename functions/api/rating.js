/**
 * Cloudflare Pages Function: proxies iTunes Lookup API for App Store ratings.
 * Avoids CORS by fetching server-side. Route: /api/rating
 */

const APP_ID = '6757462559';
const ITUNES_URL = `https://itunes.apple.com/lookup?id=${APP_ID}&country=gb`;

export async function onRequestGet(context) {
  try {
    const res = await fetch(ITUNES_URL);
    const data = await res.json();
    const app = data.results && data.results[0];
    if (!app) {
      return jsonResponse({ rating: 0, count: 0 }, 404);
    }
    const rating = app.averageUserRating || 0;
    const count = app.userRatingCount || 0;
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
