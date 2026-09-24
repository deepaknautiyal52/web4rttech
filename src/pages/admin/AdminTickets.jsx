import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import ResourcePage from './components/ResourcePage';
import StatusBadge from './components/StatusBadge';
import { clientLabel } from './api';
import { TICKET_PRIORITY, TICKET_STATUS, toOptions } from './moduleMeta';

const SLA_TEXT = 'SLA: urgent 4h, high 24h, medium 3 days, low 7 days from when the ticket was opened.';

const formatDateTime = (value) =>
  value ? new Date(value).toLocaleString('en-IN', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' }) : '—';

const AdminTickets = () => {
  const location = useLocation();

  return (
    <ResourcePage
      title="Support Tickets"
      subtitle="Client bug reports and change requests, with priority-based SLA deadlines."
      endpoint="/tickets"
      exportType="tickets"
      addLabel="+ New Ticket"
      formTitle="Ticket"
      searchPlaceholder="Search tickets..."
      initialForm={location.state?.prefill}
      defaultFilters={{ status: 'open_all' }}
      filters={[
        { name: 'status', label: 'Status', options: [{ value: 'open_all', label: 'All unresolved' }, ...toOptions(TICKET_STATUS)] },
        { name: 'priority', label: 'Priority', options: toOptions(TICKET_PRIORITY) }
      ]}
      fields={[
        { name: 'title', label: 'Title', required: true, full: true, placeholder: 'e.g. Contact form not sending emails' },
        {
          name: 'client_id',
          label: 'Client',
          type: 'select',
          placeholder: 'Internal / none',
          optionsFrom: (l) => l.clients.map((c) => ({ value: String(c.id), label: clientLabel(c) }))
        },
        {
          name: 'project_id',
          label: 'Project',
          type: 'select',
          placeholder: 'None',
          optionsFrom: (l, form) =>
            l.projects
              .filter((p) => !form.client_id || String(p.client_id) === String(form.client_id))
              .map((p) => ({ value: String(p.id), label: p.name }))
        },
        { name: 'priority', label: 'Priority', type: 'select', options: toOptions(TICKET_PRIORITY), help: SLA_TEXT },
        { name: 'status', label: 'Status', type: 'select', options: toOptions(TICKET_STATUS) },
        {
          name: 'employee_id',
          label: 'Assigned to',
          type: 'select',
          placeholder: 'Unassigned',
          optionsFrom: (l) => l.employees.filter((e) => e.status === 'active').map((e) => ({ value: String(e.id), label: e.name }))
        },
        { name: 'description', label: 'Details', type: 'textarea', full: true, rows: 5 }
      ]}
      emptyForm={{ title: '', client_id: '', project_id: '', priority: 'medium', status: 'open', employee_id: '', description: '' }}
      toForm={(t) => ({
        title: t.title,
        client_id: t.client_id ? String(t.client_id) : '',
        project_id: t.project_id ? String(t.project_id) : '',
        priority: t.priority,
        status: t.status,
        employee_id: t.employee_id ? String(t.employee_id) : '',
        description: t.description || ''
      })}
      columns={[
        { key: 'id', label: '#', render: (t) => `#${t.id}` },
        {
          key: 'title',
          label: 'Ticket',
          render: (t) => (
            <div className="resource-primary">
              <strong>{t.title}</strong>
              <span>
                {t.client ? <Link to={`/admin/clients/${t.client_id}`} onClick={(e) => e.stopPropagation()}>{clientLabel(t.client)}</Link> : 'Internal'}
                {t.project ? ` · ${t.project.name}` : ''}
              </span>
            </div>
          )
        },
        { key: 'priority', label: 'Priority', render: (t) => <StatusBadge meta={TICKET_PRIORITY} value={t.priority} /> },
        { key: 'status', label: 'Status', render: (t) => <StatusBadge meta={TICKET_STATUS} value={t.status} /> },
        { key: 'employee', label: 'Assignee', render: (t) => t.employee?.name || '—' },
        {
          key: 'due_at',
          label: 'SLA due',
          render: (t) => (
            <span className={t.sla_breached ? 'expense-cell' : undefined}>
              {formatDateTime(t.due_at)}
              {t.sla_breached ? ' (breached)' : ''}
            </span>
          )
        },
        { key: 'created_at', label: 'Opened', render: (t) => formatDateTime(t.created_at) }
      ]}
      renderDetail={(t) => (
        <div>
          <div className="admin-detail-meta">
            <span><strong>Opened:</strong> {formatDateTime(t.created_at)}</span>
            <span><strong>SLA due:</strong> {formatDateTime(t.due_at)}</span>
            <span><strong>Resolved:</strong> {formatDateTime(t.resolved_at)}</span>
          </div>
          {t.description ? <p>{t.description}</p> : <p className="resource-muted">No details.</p>}
        </div>
      )}
    />
  );
};

export default AdminTickets;
