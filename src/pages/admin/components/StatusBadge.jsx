import React from 'react';

// Pill with a coloured dot, same look as the Submissions status badge.
const StatusBadge = ({ meta, value }) => {
  const m = meta[value] || { label: value || '—', color: '#898781' };
  return (
    <span className="status-badge" style={{ backgroundColor: `${m.color}1a`, color: m.color }}>
      <span className="status-badge-dot" style={{ backgroundColor: m.color }} />
      {m.label}
    </span>
  );
};

export default StatusBadge;
