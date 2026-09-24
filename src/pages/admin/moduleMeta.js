// Label/colour metadata for the status-like fields of the newer admin
// modules, shared by their tables, filters, forms and the Overview.
// Same scale as statusMeta.js: gray = neutral, amber = in flight,
// green = good, red = needs attention.

const GRAY = '#898781';
const AMBER = '#fab219';
const BLUE = '#4F46E5';
const TEAL = '#0E7490';
const GREEN = '#0ca30c';
const RED = '#d03b3b';
const PURPLE = '#7C3AED';

export const PROJECT_STATUS = {
  planning: { label: 'Planning', color: GRAY },
  in_progress: { label: 'In progress', color: BLUE },
  review: { label: 'Review', color: AMBER },
  delivered: { label: 'Delivered', color: GREEN },
  maintenance: { label: 'Maintenance', color: TEAL },
  on_hold: { label: 'On hold', color: RED }
};

export const INVOICE_STATUS = {
  draft: { label: 'Draft', color: GRAY },
  sent: { label: 'Sent', color: BLUE },
  partially_paid: { label: 'Partially paid', color: AMBER },
  paid: { label: 'Paid', color: GREEN },
  overdue: { label: 'Overdue', color: RED },
  cancelled: { label: 'Cancelled', color: GRAY }
};

export const QUOTATION_STATUS = {
  draft: { label: 'Draft', color: GRAY },
  sent: { label: 'Sent', color: BLUE },
  accepted: { label: 'Accepted', color: GREEN },
  rejected: { label: 'Rejected', color: RED }
};

export const TICKET_STATUS = {
  open: { label: 'Open', color: BLUE },
  in_progress: { label: 'In progress', color: AMBER },
  waiting: { label: 'Waiting on client', color: PURPLE },
  resolved: { label: 'Resolved', color: GREEN },
  closed: { label: 'Closed', color: GRAY }
};

export const TICKET_PRIORITY = {
  low: { label: 'Low', color: GRAY },
  medium: { label: 'Medium', color: BLUE },
  high: { label: 'High', color: AMBER },
  urgent: { label: 'Urgent', color: RED }
};

export const RENEWAL_TYPE = {
  domain: { label: 'Domain', color: BLUE },
  hosting: { label: 'Hosting', color: TEAL },
  ssl: { label: 'SSL', color: GREEN },
  amc: { label: 'AMC', color: PURPLE },
  other: { label: 'Other', color: GRAY }
};

export const ACTIVE_STATUS = {
  active: { label: 'Active', color: GREEN },
  inactive: { label: 'Inactive', color: GRAY }
};

export const ACTIVITY_TYPE = {
  note: { label: 'Note', icon: '📝' },
  call: { label: 'Call', icon: '📞' },
  email: { label: 'Email', icon: '✉️' },
  meeting: { label: 'Meeting', icon: '🤝' }
};

export const BILLING_CYCLES = [
  { value: 'monthly', label: 'Monthly' },
  { value: 'quarterly', label: 'Quarterly' },
  { value: 'yearly', label: 'Yearly' }
];

export const PAYMENT_METHODS = ['Bank transfer', 'UPI', 'Card', 'Cash', 'Cheque', 'PayPal', 'Other'];

export const toOptions = (meta) => Object.entries(meta).map(([value, m]) => ({ value, label: m.label }));

export const formatDate = (value) => {
  if (!value) return '—';
  const d = new Date(value.length === 10 ? `${value}T00:00:00` : value);
  return Number.isNaN(d.getTime()) ? value : d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
};

export const today = () => {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
};

export const addDays = (isoDate, days) => {
  const d = new Date(`${isoDate}T00:00:00`);
  d.setDate(d.getDate() + days);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
};
