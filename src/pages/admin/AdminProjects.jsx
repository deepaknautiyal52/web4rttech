import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import services from '../../data/services';
import ResourcePage from './components/ResourcePage';
import StatusBadge from './components/StatusBadge';
import { clientLabel } from './api';
import { formatMoney, CURRENCY_OPTIONS } from './financeMeta';
import { PROJECT_STATUS, formatDate, toOptions, today } from './moduleMeta';

const SERVICE_OPTIONS = services.map((s) => ({ value: s.id, label: s.title }));
const serviceTitle = (id) => services.find((s) => s.id === id)?.title || id || '—';

export const projectCost = (p) => (parseFloat(p.labour_cost) || 0) + (parseFloat(p.other_costs) || 0);

const AdminProjects = () => {
  const location = useLocation();

  return (
    <ResourcePage
      title="Projects"
      subtitle="Delivery status, deadlines, and budget against actual cost for every client project."
      endpoint="/projects"
      exportType="projects"
      addLabel="+ New Project"
      formTitle="Project"
      searchPlaceholder="Search projects..."
      initialForm={location.state?.prefill}
      filters={[
        { name: 'status', label: 'Status', options: toOptions(PROJECT_STATUS) },
        { name: 'active', label: 'Scope', options: [{ value: '1', label: 'Active only' }] }
      ]}
      fields={[
        { name: 'name', label: 'Project name', required: true, placeholder: 'e.g. Acme corporate website' },
        {
          name: 'client_id',
          label: 'Client',
          type: 'select',
          required: true,
          placeholder: 'Select a client...',
          optionsFrom: (l) => l.clients.map((c) => ({ value: String(c.id), label: clientLabel(c) }))
        },
        { name: 'service_id', label: 'Service', type: 'select', placeholder: 'Not specified', options: SERVICE_OPTIONS },
        { name: 'status', label: 'Status', type: 'select', options: toOptions(PROJECT_STATUS) },
        { name: 'start_date', label: 'Start date', type: 'date' },
        { name: 'deadline', label: 'Deadline', type: 'date' },
        { name: 'budget', label: 'Budget', type: 'number', help: 'What the client is paying / your cost ceiling.' },
        {
          name: 'other_costs',
          label: 'Other costs',
          type: 'number',
          help: 'Licences, freelancers, etc. Staff time is added from timesheets.'
        },
        { name: 'currency', label: 'Currency', type: 'select', options: CURRENCY_OPTIONS.map((c) => ({ value: c, label: c })) },
        {
          name: 'employee_id',
          label: 'Project lead',
          type: 'select',
          placeholder: 'Unassigned',
          optionsFrom: (l) => l.employees.filter((e) => e.status === 'active').map((e) => ({ value: String(e.id), label: e.name }))
        },
        { name: 'description', label: 'Description / scope', type: 'textarea', full: true }
      ]}
      emptyForm={{
        name: '',
        client_id: '',
        service_id: '',
        status: 'planning',
        start_date: today(),
        deadline: '',
        budget: '',
        other_costs: '',
        currency: 'INR',
        employee_id: '',
        description: ''
      }}
      toForm={(p) => ({
        name: p.name,
        client_id: String(p.client_id),
        service_id: p.service_id || '',
        status: p.status,
        start_date: p.start_date || '',
        deadline: p.deadline || '',
        budget: p.budget ?? '',
        other_costs: p.other_costs ?? '',
        currency: p.currency,
        employee_id: p.employee_id ? String(p.employee_id) : '',
        description: p.description || ''
      })}
      columns={[
        {
          key: 'name',
          label: 'Project',
          render: (p) => (
            <div className="resource-primary">
              <strong>{p.name}</strong>
              <span>
                <Link to={`/admin/clients/${p.client_id}`} onClick={(e) => e.stopPropagation()}>
                  {clientLabel(p.client)}
                </Link>
              </span>
            </div>
          )
        },
        { key: 'service_id', label: 'Service', render: (p) => serviceTitle(p.service_id) },
        { key: 'employee', label: 'Lead', render: (p) => p.employee?.name || '—' },
        { key: 'status', label: 'Status', render: (p) => <StatusBadge meta={PROJECT_STATUS} value={p.status} /> },
        {
          key: 'deadline',
          label: 'Deadline',
          render: (p) => {
            const late = p.deadline && p.deadline < today() && ['planning', 'in_progress', 'review'].includes(p.status);
            return <span className={late ? 'expense-cell' : undefined}>{formatDate(p.deadline)}{late ? ' (late)' : ''}</span>;
          }
        },
        { key: 'budget', label: 'Budget', render: (p) => (p.budget ? formatMoney(p.budget, p.currency) : '—') },
        {
          key: 'cost',
          label: 'Cost so far',
          render: (p) => {
            const cost = projectCost(p);
            const over = p.budget && cost > parseFloat(p.budget);
            return <span className={over ? 'expense-cell' : undefined}>{formatMoney(cost, p.currency)}{over ? ' ⚠' : ''}</span>;
          }
        },
        { key: 'revenue', label: 'Received', render: (p) => formatMoney(p.revenue, p.currency) },
        {
          key: 'profit',
          label: 'Profit',
          render: (p) => {
            const profit = (parseFloat(p.revenue) || 0) - projectCost(p);
            return (
              <span className={profit >= 0 ? 'finance-amount-income' : 'finance-amount-expense'}>
                {profit < 0 ? '-' : ''}{formatMoney(Math.abs(profit), p.currency)}
              </span>
            );
          }
        }
      ]}
      renderDetail={(p) => (
        <div>
          <div className="admin-detail-meta">
            <span><strong>Start:</strong> {formatDate(p.start_date)}</span>
            <span><strong>Hours logged:</strong> {parseFloat(p.hours_logged) || 0}h</span>
            <span><strong>Staff cost:</strong> {formatMoney(p.labour_cost, p.currency)}</span>
            <span><strong>Other costs:</strong> {formatMoney(p.other_costs || 0, p.currency)}</span>
          </div>
          {p.description ? <p>{p.description}</p> : <p className="resource-muted">No description.</p>}
          <div className="resource-detail-links">
            <Link to="/admin/timesheets" state={{ prefill: { project_id: String(p.id) } }}>+ Log time</Link>
            <Link to="/admin/invoices" state={{ prefill: { client_id: String(p.client_id), project_id: String(p.id), currency: p.currency } }}>
              + Create invoice
            </Link>
            <Link to="/admin/tickets" state={{ prefill: { client_id: String(p.client_id), project_id: String(p.id) } }}>+ New ticket</Link>
          </div>
        </div>
      )}
    />
  );
};

export default AdminProjects;
