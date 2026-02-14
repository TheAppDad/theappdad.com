/**
 * Loads stats from stats.csv and populates "The reality" section.
 * Edit stats.csv to update numbers; values in HTML are fallbacks if fetch fails.
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
  last_updated: '14 Feb 2026'
};

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

function applyStats(data) {
  document.querySelectorAll('.analytics-value[data-stat]').forEach(el => {
    const key = el.getAttribute('data-stat');
    if (data[key] !== undefined) el.textContent = data[key];
  });
}

async function loadAnalytics() {
  let data = { ...FALLBACK };

  // Try absolute path first (works from any page), then relative
  const urls = ['/stats.csv', 'stats.csv', './stats.csv'];
  let loaded = false;

  for (const url of urls) {
    try {
      const res = await fetch(url);
      if (res.ok) {
        const text = await res.text();
        const lines = text.trim().split('\n').filter(l => l.length > 0);
        if (lines.length >= 2) {
          const headers = parseCSVLine(lines[0]);
          const values = parseCSVLine(lines[1]);
          headers.forEach((h, i) => {
            const key = h.trim().toLowerCase().replace(/\s+/g, '_');
            if (values[i] !== undefined) data[key] = String(values[i]).trim();
          });
          loaded = true;
          break;
        }
      }
    } catch (e) {
      continue;
    }
  }

  applyStats(data);
}

// Run when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', loadAnalytics);
} else {
  loadAnalytics();
}
