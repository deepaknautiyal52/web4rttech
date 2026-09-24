import React from 'react';
import ResourcePage from './components/ResourcePage';
import StatusBadge from './components/StatusBadge';
import { ROLE_META, AREA_ROLES } from './permissions';
import { toOptions } from './moduleMeta';
import { getUser } from '../../utils/adminAuth';

const AREA_LABELS = {
  leads: 'Leads',
  clients: 'Clients',
  quotations: 'Quotations',
  projects: 'Projects',
  invoices: 'Invoices',
  finances: 'Finances',
  renewals: 'Renewals',
  employees: 'Team',
  timesheets: 'Timesheets',
  tickets: 'Tickets',
  content: 'News'
};

const areasFor = (role) =>
  role === 'admin'
    ? 'Everything, including users and the audit log'
    : Object.entries(AREA_ROLES)
        .filter(([, roles]) => roles.includes(role))
        .map(([area]) => AREA_LABELS[area])
        .filter(Boolean)
        .join(', ');

const AdminUsers = () => {
  const me = getUser();

  return (
    <ResourcePage
      title="Users & Roles"
      subtitle="Who can log in to this admin panel, and what each person can see."
      endpoint="/users"
      addLabel="+ Add User"
      formTitle="User"
      searchPlaceholder="Search by name or email..."
      filters={[{ name: 'role', label: 'Role', options: toOptions(ROLE_META) }]}
      renderAbove={() => (
        <div className="admin-panel role-legend">
          {Object.entries(ROLE_META).map(([role, meta]) => (
            <div key={role}>
              <StatusBadge meta={ROLE_META} value={role} /> <span>{areasFor(role)}</span>
            </div>
          ))}
        </div>
      )}
      fields={[
        { name: 'name', label: 'Name', required: true },
        { name: 'email', label: 'Email', type: 'email', required: true },
        { name: 'role', label: 'Role', type: 'select', options: toOptions(ROLE_META) },
        {
          name: 'password',
          label: 'Password',
          type: 'password',
          placeholder: 'At least 8 characters',
          help: 'Leave blank when editing to keep the current password.'
        }
      ]}
      emptyForm={{ name: '', email: '', role: 'sales', password: '' }}
      toForm={(u) => ({ name: u.name, email: u.email, role: u.role || 'admin', password: '' })}
      toPayload={(f) => {
        const payload = { ...f };
        if (!payload.password) delete payload.password;
        return payload;
      }}
      columns={[
        {
          key: 'name',
          label: 'Name',
          render: (u) => (
            <strong>
              {u.name}
              {me?.id === u.id ? ' (you)' : ''}
            </strong>
          )
        },
        { key: 'email', label: 'Email' },
        { key: 'role', label: 'Role', render: (u) => <StatusBadge meta={ROLE_META} value={u.role} /> },
        { key: 'access', label: 'Can access', render: (u) => <span className="resource-muted">{areasFor(u.role)}</span> }
      ]}
    />
  );
};

export default AdminUsers;
