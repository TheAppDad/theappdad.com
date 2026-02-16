/**
 * Loads stats from stats.csv and populates "The reality" section.
 * Edit stats.csv to update numbers; values in HTML are fallbacks if fetch fails.
 * Supports period presets: 7d, 30d, 90d, last_week, last_month, ytd, lifetime.
 */

const FALLBACK = {
  impressions: '270',
  product_page_views: '125',
  conversion_rate: '21.2%',
  downloads: '21',
  proceeds: '$5',
  proceeds_per_user: '$1.67',
  sessions_per_device: '4.38',
  crashes: '0',
  last_updated: '15 Feb 2026',
  date_range: '10 Feb – 15 Feb 2026'
};

const MONTHS = { Jan: 0, Feb: 1, Mar: 2, Apr: 3, May: 4, Jun: 5, Jul: 6, Aug: 7, Sep: 8, Oct: 9, Nov: 10, Dec: 11 };
const DAYS = ['st', 'nd', 'rd', 'th'];

function parseDate(s) {
  const m = String(s).match(/^(\d{1,2})\s+(\w{3})\s+(\d{4})$/);
  if (!m) return null;
  const month = MONTHS[m[2]];
  if (month === undefined) return null;
  return new Date(parseInt(m[3], 10), month, parseInt(m[1], 10));
}

function formatOrdinal(n) {
  const d = n % 10;
  const suffix = (n >= 11 && n <= 13) ? 'th' : (DAYS[d] || 'th');
  return n + suffix;
}

function formatShortDate(d) {
  const day = d.getDate();
  const month = d.toLocaleString('en', { month: 'short' });
  const year = d.getFullYear();
  return formatOrdinal(day) + ' ' + month + ' ' + year;
}

function computeDateRange(lastUpdated, period) {
  const end = parseDate(lastUpdated);
  if (!end) return lastUpdated;
  const start = new Date(end);
  if (period === '7d') start.setDate(start.getDate() - 6);
  else if (period === '30d') start.setDate(start.getDate() - 29);
  else if (period === '90d') start.setDate(start.getDate() - 89);
  else if (period === 'last_week') start.setDate(start.getDate() - 6);
  else if (period === 'last_month') start.setDate(start.getDate() - 29);
  else if (period === 'ytd') start.setMonth(0, 1);
  else return lastUpdated;
  return formatShortDate(start) + ' – ' + formatShortDate(end);
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

function rowToData(headers, values) {
  const data = {};
  headers.forEach((h, i) => {
    const key = h.trim().toLowerCase().replace(/\s+/g, '_');
    if (values[i] !== undefined) data[key] = String(values[i]).trim();
  });
  return data;
}

function applyStats(data) {
  document.querySelectorAll('.analytics-value[data-stat]').forEach(el => {
    const key = el.getAttribute('data-stat');
    if (data[key] !== undefined) el.textContent = data[key];
  });
}

function setPeriodSelect(period) {
  const select = document.getElementById('stats-period');
  if (select) select.value = period;
}

async function loadAnalytics() {
  let dataByPeriod = {};
  let fallbackData = { ...FALLBACK };

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
          const periodIdx = headers.findIndex(h => h.trim().toLowerCase() === 'period');

          for (let i = 1; i < lines.length; i++) {
            const values = parseCSVLine(lines[i]);
            const row = rowToData(headers, values);
            const period = (periodIdx >= 0 && values[periodIdx]) ? String(values[periodIdx]).trim().toLowerCase() : 'lifetime';
            dataByPeriod[period] = row;
          }

          fallbackData = dataByPeriod['lifetime'] || (lines.length >= 2 ? rowToData(headers, parseCSVLine(lines[lines.length - 1])) : FALLBACK);
          loaded = true;
          break;
        }
      }
    } catch (e) {
      continue;
    }
  }

  if (!loaded) {
    dataByPeriod['lifetime'] = FALLBACK;
  }

  function showPeriod(period) {
    let data = dataByPeriod[period] || dataByPeriod['lifetime'] || fallbackData;
    data = { ...data };
    if (!data.date_range && data.last_updated) {
      data.date_range = computeDateRange(data.last_updated, period);
    }
    applyStats(data);
    setPeriodSelect(period);
  }

  const select = document.getElementById('stats-period');
  if (select) {
    select.addEventListener('change', () => showPeriod(select.value));
  }

  showPeriod('lifetime');
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', loadAnalytics);
} else {
  loadAnalytics();
}
