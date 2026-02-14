/**
 * Fetches "The reality" stats from stats.csv (in this repo).
 *
 * To update: Edit stats.csv with your latest numbers from App Store Connect.
 * You can export from Apple Numbers to CSV, or edit the file directly.
 *
 * CSV format (first row = headers, second row = values):
 * impressions,product_page_views,conversion_rate,downloads,proceeds,proceeds_per_user,sessions_per_device,crashes,months
 * 182,106,39.2%,20,$5,$1.67,3.43,0,3
 */

async function loadAnalytics() {
  try {
    const res = await fetch('/stats.csv');
    if (!res.ok) return;
    const text = await res.text();
    const lines = text.trim().split('\n');
    if (lines.length < 2) return;

    const headers = parseCSVLine(lines[0]);
    const values = parseCSVLine(lines[1]);
    const data = {};
    headers.forEach((h, i) => {
      const key = h.trim().toLowerCase().replace(/\s+/g, '_');
      data[key] = values[i] ? values[i].trim() : '';
    });

    document.querySelectorAll('.number-value[data-stat]').forEach(el => {
      const key = el.getAttribute('data-stat');
      if (data[key]) el.textContent = data[key];
    });
  } catch (e) {
    console.warn('Could not load analytics:', e.message);
  }
}

function parseCSVLine(line) {
  const result = [];
  let current = '';
  let inQuotes = false;
  for (let i = 0; i < line.length; i++) {
    const c = line[i];
    if (c === '"') {
      inQuotes = !inQuotes;
    } else if ((c === ',' && !inQuotes) || c === '\r') {
      result.push(current);
      current = '';
    } else {
      current += c;
    }
  }
  result.push(current);
  return result;
}

loadAnalytics();
