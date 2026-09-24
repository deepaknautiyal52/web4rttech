import React from 'react';
import ResourcePage from './components/ResourcePage';
import StatusBadge from './components/StatusBadge';
import { formatMoney, CURRENCY_OPTIONS } from './financeMeta';
import { ACTIVE_STATUS, formatDate, toOptions } from './moduleMeta';

const AdminEmployees = () => (
  <ResourcePage
    title="Team"
    subtitle="Employees, their cost, and who can be assigned to projects, timesheets and tickets."
    endpoint="/employees"
    addLabel="+ Add Employee"
    formTitle="Employee"
    searchPlaceholder="Search by name, email or designation..."
    filters={[{ name: 'status', label: 'Status', options: toOptions(ACTIVE_STATUS) }]}
    fields={[
      { name: 'name', label: 'Full name', required: true },
      { name: 'designation', label: 'Designation', placeholder: 'e.g. Senior React Developer' },
      { name: 'email', label: 'Email', type: 'email' },
      { name: 'phone', label: 'Phone' },
      { name: 'monthly_salary', label: 'Monthly salary', type: 'number' },
      {
        name: 'hourly_cost',
        label: 'Hourly cost',
        type: 'number',
        help: 'Used for project cost from timesheets. Leave blank to use salary ÷ 160.'
      },
      { name: 'currency', label: 'Currency', type: 'select', options: CURRENCY_OPTIONS.map((c) => ({ value: c, label: c })) },
      { name: 'joined_on', label: 'Joined on', type: 'date' },
      { name: 'status', label: 'Status', type: 'select', options: toOptions(ACTIVE_STATUS) }
    ]}
    emptyForm={{
      name: '',
      designation: '',
      email: '',
      phone: '',
      monthly_salary: '',
      hourly_cost: '',
      currency: 'INR',
      joined_on: '',
      status: 'active'
    }}
    columns={[
      {
        key: 'name',
        label: 'Name',
        render: (e) => (
          <div className="resource-primary">
            <strong>{e.name}</strong>
            {e.designation && <span>{e.designation}</span>}
          </div>
        )
      },
      { key: 'email', label: 'Email', render: (e) => e.email || '—' },
      { key: 'phone', label: 'Phone', render: (e) => e.phone || '—' },
      { key: 'monthly_salary', label: 'Salary / month', render: (e) => (e.monthly_salary ? formatMoney(e.monthly_salary, e.currency) : '—') },
      { key: 'hourly_cost', label: 'Hourly cost', render: (e) => (e.hourly_cost ? formatMoney(e.hourly_cost, e.currency) : '—') },
      { key: 'joined_on', label: 'Joined', render: (e) => formatDate(e.joined_on) },
      { key: 'status', label: 'Status', render: (e) => <StatusBadge meta={ACTIVE_STATUS} value={e.status} /> }
    ]}
  />
);

export default AdminEmployees;
