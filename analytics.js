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
  last_updated: '16 Feb 2026',
  date_range: '10 Feb – 16 Feb 2026'
};

const MONTHS = { Jan: 0, Feb: 1, Mar: 2, Apr: 3, May: 4, Jun: 5, Jul: 6, Aug: 7, Sep: 8, Oct: 9, Nov: 10, Dec: 11 };
const RELEASE_DATE = '10 Feb 2026';
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

function formatShortDate(d, leadingZeroDay) {
  const day = d.getDate();
  const month = d.toLocaleString('en', { month: 'short' });
  const year = d.getFullYear();
  const dayStr = leadingZeroDay && day <= 9 ? '0' + day : formatOrdinal(day);
  return dayStr + ' ' + month + ' ' + year;
}

function computeDateRange(lastUpdated, period) {
  const end = parseDate(lastUpdated);
  if (!end) return lastUpdated;
  const p = String(period || '').trim().toLowerCase();
  let start;

  if (p === 'ytd') {
    start = new Date(end.getFullYear(), 0, 1); // 1st Jan
    return formatShortDate(start, true) + ' – ' + formatShortDate(end, false);
  }
  if (p === 'lifetime') {
    const release = parseDate(RELEASE_DATE);
    return release ? formatShortDate(release, false) + ' – ' + formatShortDate(end, false) : formatShortDate(end, false);
  }

  start = new Date(end);
  const msPerDay = 24 * 60 * 60 * 1000;
  if (p === '7d') start.setTime(end.getTime() - 6 * msPerDay);
  else if (p === '30d') start.setTime(end.getTime() - 29 * msPerDay);
  else if (p === '90d') start.setTime(end.getTime() - 89 * msPerDay);
  else if (p === 'last_week') start.setTime(end.getTime() - 6 * msPerDay);
  else if (p === 'last_month') start.setTime(end.getTime() - 29 * msPerDay);
  else return formatShortDate(end, false);

  return formatShortDate(start, false) + ' – ' + formatShortDate(end, false);
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
  document.querySelectorAll('[data-stat]').forEach(el => {
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
    if (data.last_updated) {
      data.date_range = computeDateRange(data.last_updated, period);
    }
    applyStats(data);
    setPeriodSelect(period);
    var dateEl = document.getElementById('stats-date-range');
    if (dateEl && data.date_range) dateEl.textContent = data.date_range;
  }

  const select = document.getElementById('stats-period');
  if (select) {
    select.addEventListener('change', function() { showPeriod(this.value); });
  }

  showPeriod(select ? select.value : 'lifetime');
}

async function loadAppRating() {
  const el = document.getElementById('app-rating');
  const dataEl = document.getElementById('app-rating-data');
  if (!el || !dataEl) return;
  try {
    const res = await fetch('https://itunes.apple.com/lookup?id=6757462559&country=gb');
    const data = await res.json();
    if (data.results && data.results[0]) {
      const r = data.results[0];
      const rating = r.averageUserRating;
      const count = r.userRatingCount || 0;
      const stars = '★'.repeat(Math.round(rating)) + '☆'.repeat(5 - Math.round(rating));
      dataEl.innerHTML = '<span class="app-rating-stars">' + stars + '</span> ' + (count > 0 ? rating.toFixed(1) + ' (' + count + ' rating' + (count === 1 ? '' : 's') + ')' : 'No ratings yet');
    } else {
      dataEl.textContent = '—';
    }
  } catch (e) {
    el.style.display = 'none';
  }
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', function() {
    loadAnalytics();
    loadAppRating();
  });
} else {
  loadAnalytics();
  loadAppRating();
}
