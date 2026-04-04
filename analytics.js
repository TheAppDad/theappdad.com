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
function getOrdinalSuffix(n) {
  if (n >= 11 && n <= 13) return 'th';
  switch (n % 10) {
    case 1: return 'st';
    case 2: return 'nd';
    case 3: return 'rd';
    default: return 'th';
  }
}

function parseDate(s) {
  const m = String(s).match(/^(\d{1,2})\s+(\w{3})\s+(\d{4})$/);
  if (!m) return null;
  const month = MONTHS[m[2]];
  if (month === undefined) return null;
  return new Date(parseInt(m[3], 10), month, parseInt(m[1], 10));
}

function formatOrdinal(n) {
  return n + getOrdinalSuffix(n);
}

function formatShortDate(d, leadingZeroDay) {
  const day = d.getDate();
  const month = d.toLocaleString('en', { month: 'short' });
  const year = d.getFullYear();
  const suffix = getOrdinalSuffix(day);
  const dayStr = leadingZeroDay && day <= 9 ? '0' + day + suffix : formatOrdinal(day);
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

function parseStatNumber(val, key) {
  if (val === undefined || val === null || val === '') return NaN;
  const s = String(val).trim();
  const num = parseFloat(s.replace(/[$,%]/g, ''));
  return isNaN(num) ? NaN : num;
}

function computePercentChange(current, previous) {
  const curr = parseFloat(current);
  const prev = parseFloat(previous);
  if (isNaN(curr) || isNaN(prev) || prev === 0) return null;
  const pct = ((curr - prev) / prev) * 100;
  if (Math.abs(pct) < 0.1) return '0%';
  const sign = pct >= 0 ? '+' : '';
  return sign + pct.toFixed(1) + '%';
}

const TREND_METRICS = ['impressions', 'product_page_views', 'conversion_rate', 'downloads', 'proceeds', 'proceeds_per_user', 'sessions_per_device', 'crashes'];

function applyStats(data, changes) {
  document.querySelectorAll('[data-stat]').forEach(el => {
    const key = el.getAttribute('data-stat');
    if (data[key] !== undefined) el.textContent = data[key];
    if (changes && TREND_METRICS.includes(key)) {
      const cell = el.closest('.analytics-cell');
      const changeEl = cell && cell.querySelector('.analytics-change');
      if (changeEl) {
        const ch = changes[key];
        changeEl.textContent = ch != null ? ch : '—';
        changeEl.classList.remove('analytics-change-up', 'analytics-change-down');
        if (ch && ch.startsWith('+')) changeEl.classList.add('analytics-change-up');
        else if (ch && ch.startsWith('-')) changeEl.classList.add('analytics-change-down');
      }
    }
  });
}

function setPeriodSelect(period) {
  const select = document.getElementById('stats-period');
  if (select) select.value = period;
}

function computeChanges(currentRow, previousRow) {
  const changes = {};
  if (!currentRow || !previousRow) return changes;
  for (const key of TREND_METRICS) {
    const curr = parseStatNumber(currentRow[key], key);
    const prev = parseStatNumber(previousRow[key], key);
    const ch = computePercentChange(curr, prev);
    if (ch != null) changes[key] = ch;
  }
  return changes;
}

async function loadAnalytics() {
  let snapshots = [];
  let dataByPeriod = {};
  let fallbackData = { ...FALLBACK };
  let changes = {};

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
          const lastUpdatedIdx = headers.findIndex(h => h.trim().toLowerCase().replace(/\s+/g, '_') === 'last_updated');
          const periodIdx = headers.findIndex(h => h.trim().toLowerCase() === 'period');

          for (let i = 1; i < lines.length; i++) {
            const values = parseCSVLine(lines[i]);
            const row = rowToData(headers, values);
            const period = (periodIdx >= 0 && values[periodIdx]) ? String(values[periodIdx]).trim().toLowerCase() : 'lifetime';
            const date = lastUpdatedIdx >= 0 && row.last_updated ? parseDate(row.last_updated) : null;
            snapshots.push({ data: row, period, date });
          }

          snapshots.sort((a, b) => (b.date && a.date ? b.date.getTime() - a.date.getTime() : 0));
          const current = snapshots[0] && snapshots[0].data;
          const previous = snapshots[1] && snapshots[1].data;
          if (current) {
            fallbackData = current;
            dataByPeriod['lifetime'] = current;
            dataByPeriod['7d'] = dataByPeriod['30d'] = dataByPeriod['90d'] = dataByPeriod['last_week'] = dataByPeriod['last_month'] = dataByPeriod['ytd'] = current;
            changes = computeChanges(current, previous);
          }
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
    applyStats(data, changes);
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

const RATING_FALLBACK = { rating: 5, count: 3 };
const CAMREF_RATING_FALLBACK = { rating: 5, count: 1 };
const APP_STORE_ID_CHOSEN = '6757462559';
const APP_STORE_ID_CAMREF = '6761225473';

async function loadAppRatingFor(elementId, appId, fallback) {
  const dataEl = document.getElementById(elementId);
  if (!dataEl) return;

  function showRating(rating, count) {
    const stars = '★'.repeat(Math.round(rating)) + '☆'.repeat(5 - Math.round(rating));
    dataEl.innerHTML = '<span class="app-rating-stars">' + stars + '</span> ' + (count > 0 ? rating.toFixed(1) + ' (' + count + ' rating' + (count === 1 ? '' : 's') + ')' : '—');
  }

  function useFallback() {
    showRating(fallback.rating, fallback.count);
  }

  try {
    const ctrl = new AbortController();
    const timeout = setTimeout(() => ctrl.abort(), 5000);
    const res = await fetch('/api/rating?id=' + encodeURIComponent(appId), { signal: ctrl.signal });
    clearTimeout(timeout);
    var data;
    try {
      data = await res.json();
    } catch (_) {
      useFallback();
      return;
    }
    if (res.ok && data.rating !== undefined) {
      showRating(data.rating, data.count || 0);
      return;
    }
  } catch (e) {
    /* API failed, try JSONP fallback */
  }

  try {
    const scriptId = 'itunes-script-' + appId;
    const jsonp = await new Promise(function(resolve, reject) {
      const cb = 'itunes_' + appId + '_' + Date.now();
      window[cb] = function(obj) {
        delete window[cb];
        document.getElementById(scriptId)?.remove();
        resolve(obj && obj.results && obj.results[0] ? obj.results[0] : null);
      };
      const s = document.createElement('script');
      s.id = scriptId;
      s.src = 'https://itunes.apple.com/lookup?id=' + appId + '&country=gb&callback=' + cb;
      s.onerror = function() {
        delete window[cb];
        reject(new Error('JSONP failed'));
      };
      document.head.appendChild(s);
    });
    if (jsonp && (jsonp.averageUserRating !== undefined || jsonp.userRatingCount !== undefined)) {
      showRating(jsonp.averageUserRating || 0, jsonp.userRatingCount || 0);
      return;
    }
  } catch (_) { /* JSONP failed */ }
  useFallback();
}

function loadAppRating() {
  loadAppRatingFor('app-rating-data', APP_STORE_ID_CHOSEN, RATING_FALLBACK);
}

function loadCamRefRating() {
  loadAppRatingFor('camref-rating-data', APP_STORE_ID_CAMREF, CAMREF_RATING_FALLBACK);
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', function() {
    loadAnalytics();
    loadAppRating();
    loadCamRefRating();
  });
} else {
  loadAnalytics();
  loadAppRating();
  loadCamRefRating();
}
