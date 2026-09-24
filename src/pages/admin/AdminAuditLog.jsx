import React from 'react';
import ResourcePage from './components/ResourcePage';
import StatusBadge from './components/StatusBadge';

const ACTIONS = {
  created: { label: 'Created', color: '#0ca30c' },
  updated: { label: 'Updated', color: '#4F46E5' },
  deleted: { label: 'Deleted', color: '#d03b3b' }
};

const MODEL_TYPES = [
  'Contact',
  'Client',
  'Project',
  'Quotation',
  'Invoice',
  'Payment',
  'FinanceEntry',
  'Renewal',
  'Employee',
  'Timesheet',
  'Ticket',
  'Article',
  'User'
].map((m) => ({ value: m, label: m.replace(/([a-z])([A-Z])/g, '$1 $2') }));

const show = (v) => {
  if (v === null || v === undefined || v === '') return '∅';
  if (typeof v === 'object') return JSON.stringify(v);
  const s = String(v);
  return s.length > 80 ? `${s.slice(0, 80)}…` : s;
};

const Changes = ({ log }) => {
  if (!log.changes) return <span className="resource-muted">—</span>;
  const entries = Object.entries(log.changes).filter(([k]) => !['id', 'created_at', 'updated_at'].includes(k));
  if (entries.length === 0) return <span className="resource-muted">—</span>;

  return (
    <ul className="audit-changes">
      {entries.map(([field, value]) => (
        <li key={field}>
          <strong>{field}</strong>:{' '}
          {log.action === 'updated' && value && typeof value === 'object' && 'to' in value ? (
            <>
              <span className="audit-from">{show(value.from)}</span> → <span>{show(value.to)}</span>
            </>
          ) : (
            show(value)
          )}
        </li>
      ))}
    </ul>
  );
};

const AdminAuditLog = () => (
  <ResourcePage
    title="Audit Log"
    subtitle="Who created, changed or deleted what, and when. Click a row to see the details."
    endpoint="/audit-logs"
    canCreate={false}
    canEdit={false}
    canDelete={false}
    searchPlaceholder="Search by record name..."
    filters={[
      { name: 'model_type', label: 'Record', options: MODEL_TYPES },
      { name: 'action', label: 'Action', options: Object.entries(ACTIONS).map(([value, m]) => ({ value, label: m.label })) }
    ]}
    columns={[
      { key: 'created_at', label: 'When', render: (l) => new Date(l.created_at).toLocaleString('en-IN') },
      { key: 'user', label: 'By', render: (l) => l.user?.name || <span className="resource-muted">Website visitor / system</span> },
      { key: 'action', label: 'Action', render: (l) => <StatusBadge meta={ACTIONS} value={l.action} /> },
      { key: 'model_type', label: 'Record', render: (l) => `${l.model_type} #${l.model_id}` },
      { key: 'summary', label: 'Name', render: (l) => l.summary || '—' }
    ]}
    renderDetail={(l) => <Changes log={l} />}
  />
);

export default AdminAuditLog;
