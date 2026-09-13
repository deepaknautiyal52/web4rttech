// Fixed category scale for finance entries, shared between the summary
// charts and the entry form so a category always means the same thing
// everywhere in the admin panel.
export const CATEGORY_META = {
  domain: { label: 'Domain', color: '#4F46E5' },
  hosting: { label: 'Hosting', color: '#06B6D4' },
  salary: { label: 'Salary', color: '#7C3AED' },
  sale: { label: 'Sale / Income', color: '#0ca30c' },
  other: { label: 'Other', color: '#898781' }
};

export const CATEGORY_OPTIONS = Object.entries(CATEGORY_META).map(([value, meta]) => ({
  value,
  label: meta.label
}));

export const CURRENCY_OPTIONS = ['INR', 'USD'];

export const currencySymbol = (currency) => (currency === 'USD' ? '$' : '₹');

export const formatMoney = (amount, currency = 'INR') =>
  `${currencySymbol(currency)}${Math.round(Number(amount) || 0).toLocaleString('en-IN')}`;
