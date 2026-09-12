// Fixed status scale (never themed) shared between the Overview charts and
// the Submissions table, so a status color always means the same thing
// everywhere in the admin panel. "New" isn't evaluative so it stays a
// neutral gray rather than borrowing a good/warning/critical slot.
export const STATUS_META = {
  new: { label: 'New', color: '#898781' },
  contacted: { label: 'Contacted', color: '#fab219' },
  won: { label: 'Won', color: '#0ca30c' },
  lost: { label: 'Lost', color: '#d03b3b' }
};

export const STATUS_OPTIONS = Object.entries(STATUS_META).map(([value, meta]) => ({
  value,
  label: meta.label
}));
