/**
 * Loads stats from stats.csv and populates "The reality" section.
 * Multi-app: rows include an `app` column (chosen | camref). Same last_updated = one snapshot.
 * Combined "All apps" is computed in JS. Legacy CSV without `app` is treated as Chosen-only.
 */

const METRICS = [
  'impressions',
  'product_page_views',
  'conversion_rate',
  'downloads',
  'proceeds',
  'proceeds_per_user',
  'sessions_per_device',
  'crashes'
];

const APPS = ['chosen', 'camref', 'all'];

function flatKeys() {
  const keys = [];
  for (const m of METRICS) {
    for (const a of APPS) {
      keys.push(m + '_' + a);
    }
  }
  return keys;
}

const TREND_METRICS = flatKeys();

const FALLBACK = buildFallbackFromLegacy({
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
});

const MONTHS = { Jan: 0, Feb: 1, Mar: 2, Apr: 3, May: 4, Jun: 5, Jul: 6, Aug: 7, Sep: 8, Oct: 9, Nov: 10, Dec: 11 };
const RELEASE_DATE_CHOSEN = '10 Feb 2026';

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
    start = new Date(end.getFullYear(), 0, 1);
    return formatShortDate(start, true) + ' – ' + formatShortDate(end, false);
  }
  if (p === 'lifetime') {
    const release = parseDate(RELEASE_DATE_CHOSEN);
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
  if (s === '—' || s === '-') return NaN;
  const num = parseFloat(s.replace(/[$,%]/g, ''));
  return isNaN(num) ? NaN : num;
}

function parseMoney(val) {
  const n = parseStatNumber(val, 'proceeds');
  return isNaN(n) ? 0 : n;
}

function formatMoney(n) {
  if (n === 0) return '$0';
  const rounded = Math.round(n * 100) / 100;
  if (Math.abs(rounded - Math.round(rounded)) < 0.001) return '$' + Math.round(rounded);
  return '$' + rounded.toFixed(2);
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

function emptyMetricRow() {
  return {
    impressions: '0',
    product_page_views: '0',
    conversion_rate: '0%',
    downloads: '0',
    proceeds: '$0',
    proceeds_per_user: '$0',
    sessions_per_device: '0',
    crashes: '0'
  };
}

function mergeAppRows(chosen, camref, hasCamrefRow) {
  const c = chosen || emptyMetricRow();
  const r = camref || emptyMetricRow();
  const imp = parseStatNumber(c.impressions) + parseStatNumber(r.impressions);
  const ppv = parseStatNumber(c.product_page_views) + parseStatNumber(r.product_page_views);
  const dl = parseStatNumber(c.downloads) + parseStatNumber(r.downloads);
  const money = parseMoney(c.proceeds) + parseMoney(r.proceeds);
  const convDisplay = ppv > 0 ? ((dl / ppv) * 100).toFixed(2) + '%' : (c.conversion_rate || r.conversion_rate || '—');

  let sessions = '—';
  const sc = parseStatNumber(c.sessions_per_device);
  const sr = parseStatNumber(r.sessions_per_device);
  if (hasCamrefRow && !isNaN(sc) && !isNaN(sr) && sc > 0 && sr > 0) {
    sessions = ((sc + sr) / 2).toFixed(2);
  } else if (!isNaN(sc) && sc > 0) {
    sessions = String(sc);
  } else if (!isNaN(sr) && sr > 0) {
    sessions = String(sr);
  }

  const crashes = parseStatNumber(c.crashes) + parseStatNumber(r.crashes);

  return {
    impressions: imp > 0 ? String(Math.round(imp)) : '0',
    product_page_views: ppv > 0 ? String(Math.round(ppv)) : '0',
    conversion_rate: convDisplay,
    downloads: dl > 0 ? String(Math.round(dl)) : '0',
    proceeds: formatMoney(money),
    proceeds_per_user: '—',
    sessions_per_device: sessions,
    crashes: String(Math.max(0, Math.round(crashes)))
  };
}

function prefixMetrics(row, suffix, missing) {
  const out = {};
  for (const m of METRICS) {
    const key = m + '_' + suffix;
    if (missing) {
      out[key] = '—';
    } else {
      out[key] = row[m] !== undefined && row[m] !== '' ? row[m] : '—';
    }
  }
  return out;
}

function legacyRowToFlat(row) {
  const chosen = row;
  const camref = emptyMetricRow();
  const all = mergeAppRows(chosen, camref, false);
  return {
    ...prefixMetrics(chosen, 'chosen', false),
    ...prefixMetrics(camref, 'camref', true),
    ...prefixMetrics(all, 'all', false),
    last_updated: row.last_updated,
    period: row.period
  };
}

function groupToFlat(group, legacySingle) {
  if (legacySingle) {
    return legacyRowToFlat(group);
  }
  const chosen = group.chosen;
  const camref = group.camref;
  const hasCamrefRow = camref !== undefined && camref !== null;
  const chosenRow = chosen || emptyMetricRow();
  const camrefRow = hasCamrefRow ? camref : null;
  const merged = mergeAppRows(chosenRow, camrefRow || emptyMetricRow(), hasCamrefRow);
  const lastUpdated = (chosen && chosen.last_updated) || (camref && camref.last_updated) || '';
  const period = (chosen && chosen.period) || (camref && camref.period) || 'lifetime';

  return {
    ...prefixMetrics(chosenRow, 'chosen', !chosen),
    ...prefixMetrics(camrefRow || emptyMetricRow(), 'camref', !hasCamrefRow),
    ...prefixMetrics(merged, 'all', false),
    last_updated: lastUpdated,
    period
  };
}

function buildFallbackFromLegacy(legacy) {
  const flat = legacyRowToFlat(legacy);
  flat.date_range = legacy.date_range;
  return flat;
}

function applyStats(data, changes, multiApp) {
  const root = document.getElementById('stats-matrix');
  if (root) {
    root.setAttribute('data-apps', multiApp ? 'multi' : 'single');
  }

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

function computeChanges(currentFlat, previousFlat) {
  const changes = {};
  if (!currentFlat || !previousFlat) return changes;
  for (const key of TREND_METRICS) {
    const curr = parseStatNumber(currentFlat[key], key);
    const prev = parseStatNumber(previousFlat[key], key);
    const ch = computePercentChange(curr, prev);
    if (ch != null) changes[key] = ch;
  }
  return changes;
}

function parseSnapshotsFromCSV(text) {
  const lines = text.trim().split('\n').filter(l => l.length > 0);
  if (lines.length < 2) return { multiApp: false, groups: [], legacyRows: [] };

  const headers = parseCSVLine(lines[0]);
  const appIdx = headers.findIndex(h => h.trim().toLowerCase() === 'app');
  const multiApp = appIdx >= 0;

  const rows = [];
  for (let i = 1; i < lines.length; i++) {
    const values = parseCSVLine(lines[i]);
    const row = rowToData(headers, values);
    const lastUpdatedIdx = headers.findIndex(h => h.trim().toLowerCase().replace(/\s+/g, '_') === 'last_updated');
    const periodIdx = headers.findIndex(h => h.trim().toLowerCase() === 'period');
    row.period = (periodIdx >= 0 && values[periodIdx]) ? String(values[periodIdx]).trim().toLowerCase() : 'lifetime';
    if (row.last_updated) {
      row._date = parseDate(row.last_updated);
    }
    if (multiApp) {
      row._app = (row.app || '').trim().toLowerCase();
      if (row._app !== 'chosen' && row._app !== 'camref') continue;
    }
    rows.push(row);
  }

  if (!multiApp) {
    rows.sort((a, b) => (b._date && a._date ? b._date.getTime() - a._date.getTime() : 0));
    return { multiApp: false, groups: [], legacyRows: rows };
  }

  const groupMap = new Map();
  for (const row of rows) {
    const key = row.last_updated + '|' + row.period;
    if (!groupMap.has(key)) groupMap.set(key, {});
    groupMap.get(key)[row._app] = row;
  }

  const groups = [];
  for (const [, apps] of groupMap) {
    const d = (apps.chosen && apps.chosen._date) || (apps.camref && apps.camref._date);
    groups.push({ date: d, apps });
  }
  groups.sort((a, b) => (b.date && a.date ? b.date.getTime() - a.date.getTime() : 0));

  return { multiApp: true, groups: groups.map(g => g.apps), legacyRows: [] };
}

async function loadAnalytics() {
  let fallbackData = { ...FALLBACK };
  let changes = {};
  let multiApp = true;

  const urls = ['/stats.csv', 'stats.csv', './stats.csv'];
  let loaded = false;
  let currentFlat = null;
  let previousFlat = null;

  for (const url of urls) {
    try {
      const res = await fetch(url);
      if (res.ok) {
        const text = await res.text();
        const parsed = parseSnapshotsFromCSV(text);

        if (parsed.multiApp && parsed.groups.length) {
          multiApp = true;
          const currG = parsed.groups[0];
          const prevG = parsed.groups[1];
          currentFlat = groupToFlat(currG, false);
          previousFlat = prevG ? groupToFlat(prevG, false) : null;
          fallbackData = currentFlat;
          changes = computeChanges(currentFlat, previousFlat);
          loaded = true;
        } else if (!parsed.multiApp && parsed.legacyRows.length) {
          multiApp = false;
          const current = parsed.legacyRows[0];
          const previous = parsed.legacyRows[1];
          currentFlat = legacyRowToFlat(current);
          previousFlat = previous ? legacyRowToFlat(previous) : null;
          fallbackData = currentFlat;
          changes = computeChanges(currentFlat, previousFlat);
          loaded = true;
        }
        if (loaded) break;
      }
    } catch (e) {
      continue;
    }
  }

  if (!loaded) {
    currentFlat = FALLBACK;
    multiApp = true;
  }

  function showPeriod(period) {
    let data = { ...currentFlat };
    if (data.last_updated) {
      data.date_range = computeDateRange(data.last_updated, period);
    }
    applyStats(data, changes, multiApp);
    setPeriodSelect(period);
    const dateEl = document.getElementById('stats-date-range');
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
