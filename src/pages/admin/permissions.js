// Which roles may use each area of the admin panel (admins can use all).
// Mirrors User::AREA_ROLES in the backend, which is what actually enforces it;
// this copy only decides what to show in the UI.
export const AREA_ROLES = {
  leads: ['sales'],
  clients: ['sales', 'finance'],
  quotations: ['sales'],
  projects: ['sales', 'developer'],
  invoices: ['finance'],
  finances: ['finance'],
  renewals: ['finance', 'sales'],
  employees: ['finance'],
  timesheets: ['developer', 'finance'],
  tickets: ['sales', 'developer'],
  content: ['sales'],
  users: [],
  audit: []
};

export const ROLE_META = {
  admin: { label: 'Admin', color: '#4F46E5' },
  sales: { label: 'Sales', color: '#0E7490' },
  finance: { label: 'Finance', color: '#0ca30c' },
  developer: { label: 'Developer', color: '#7C3AED' }
};

// Sessions from before roles existed have no role stored; the backend
// treats those users as admins, so the UI does too.
export const canAccess = (user, area) => {
  const role = user?.role || 'admin';
  return role === 'admin' || (AREA_ROLES[area] || []).includes(role);
};
