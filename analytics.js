/**
 * Fetches "The reality" stats from stats.csv.
 * Uses fallback values if fetch fails (e.g. cache, path issues).
 */

const FALLBACK = {
  impressions: '182',
  product_page_views: '106',
  conversion_rate: '39.2%',
  downloads: '20',
  proceeds: '$5',
  proceeds_per_user: '$1.67',
  sessions_per_device: '3.43',
  crashes: '0',
  months: '3',
  last_updated: '14 Feb 2026'
};

async function loadAnalytics() {
  let data = { ...FALLBACK };

  try {
    const res = await fetch('stats.csv');
    if (res.ok) {
      const text = await res.text();
      const lines = text.trim().split('\n');
      if (lines.length >= 2) {
        const headers = parseCSVLine(lines[0]);
        const values = parseCSVLine(lines[1]);
        headers.forEach((h, i) => {
          const key = h.trim().toLowerCase().replace(/\s+/g, '_');
          if (values[i]) data[key] = values[i].trim();
        });
      }
    }
  } catch (e) {
    console.warn('Using fallback stats:', e.message);
  }

  document.querySelectorAll('.analytics-value[data-stat]').forEach(el => {
    const key = el.getAttribute('data-stat');
    if (data[key]) el.textContent = data[key];
  });
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
