// Buckets a list of contacts into trailing time periods (week/month/quarter/
// half-year/year) for the admin analytics charts. All bucketing happens
// client-side against the full contact list returned by /api/analytics.

const PERIOD_CONFIG = {
  week: { count: 12 },
  month: { count: 12 },
  quarter: { count: 8 },
  'half-year': { count: 6 },
  year: { count: 5 }
};

export const PERIOD_OPTIONS = [
  { value: 'week', label: 'Weekly' },
  { value: 'month', label: 'Monthly' },
  { value: 'quarter', label: 'Quarterly' },
  { value: 'half-year', label: 'Half-Yearly' },
  { value: 'year', label: 'Yearly' }
];

function startOfWeek(date) {
  const d = new Date(date);
  const day = d.getDay();
  const diff = (day === 0 ? -6 : 1) - day; // Monday as the first day of the week
  d.setDate(d.getDate() + diff);
  d.setHours(0, 0, 0, 0);
  return d;
}

function bucketStart(date, period) {
  const d = new Date(date);
  switch (period) {
    case 'week':
      return startOfWeek(d);
    case 'quarter': {
      const q = Math.floor(d.getMonth() / 3);
      return new Date(d.getFullYear(), q * 3, 1);
    }
    case 'half-year': {
      const h = d.getMonth() < 6 ? 0 : 6;
      return new Date(d.getFullYear(), h, 1);
    }
    case 'year':
      return new Date(d.getFullYear(), 0, 1);
    case 'month':
    default:
      return new Date(d.getFullYear(), d.getMonth(), 1);
  }
}

function addPeriod(date, period, n) {
  const d = new Date(date);
  switch (period) {
    case 'week':
      d.setDate(d.getDate() + n * 7);
      break;
    case 'quarter':
      d.setMonth(d.getMonth() + n * 3);
      break;
    case 'half-year':
      d.setMonth(d.getMonth() + n * 6);
      break;
    case 'year':
      d.setFullYear(d.getFullYear() + n);
      break;
    case 'month':
    default:
      d.setMonth(d.getMonth() + n);
      break;
  }
  return d;
}

function formatBucketLabel(start, period) {
  switch (period) {
    case 'week':
      return start.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    case 'quarter':
      return `Q${Math.floor(start.getMonth() / 3) + 1} '${String(start.getFullYear()).slice(-2)}`;
    case 'half-year':
      return `${start.getMonth() < 6 ? 'H1' : 'H2'} '${String(start.getFullYear()).slice(-2)}`;
    case 'year':
      return String(start.getFullYear());
    case 'month':
    default:
      return start.toLocaleDateString('en-US', { month: 'short', year: '2-digit' });
  }
}

export function buildBuckets(period) {
  const config = PERIOD_CONFIG[period] || PERIOD_CONFIG.month;
  const currentStart = bucketStart(new Date(), period);
  const buckets = [];

  for (let i = config.count - 1; i >= 0; i -= 1) {
    const start = addPeriod(currentStart, period, -i);
    const end = addPeriod(start, period, 1);
    buckets.push({ start, end, label: formatBucketLabel(start, period) });
  }

  return buckets;
}

export function aggregateInquiries(contacts, buckets) {
  return buckets.map((bucket) => {
    const value = contacts.filter((c) => {
      const t = new Date(c.created_at);
      return t >= bucket.start && t < bucket.end;
    }).length;
    return { label: bucket.label, value };
  });
}

export function aggregateRevenue(contacts, buckets) {
  const wonContacts = contacts.filter((c) => c.status === 'won' && c.won_at);

  return buckets.map((bucket) => {
    const value = wonContacts
      .filter((c) => {
        const t = new Date(c.won_at);
        return t >= bucket.start && t < bucket.end;
      })
      .reduce((sum, c) => sum + (parseFloat(c.deal_value) || 0), 0);
    return { label: bucket.label, value };
  });
}
