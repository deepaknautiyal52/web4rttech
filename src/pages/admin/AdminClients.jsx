import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import ResourcePage from './components/ResourcePage';
import StatusBadge from './components/StatusBadge';
import { ACTIVE_STATUS, toOptions } from './moduleMeta';
import { formatMoney } from './financeMeta';

export const CLIENT_FIELDS = [
  { name: 'name', label: 'Contact person', required: true, placeholder: 'e.g. Priya Mehta' },
  { name: 'company', label: 'Company', placeholder: 'e.g. Acme Pvt Ltd' },
  { name: 'email', label: 'Email', type: 'email' },
  { name: 'phone', label: 'Phone' },
  { name: 'website', label: 'Website', placeholder: 'https://' },
  { name: 'gst_number', label: 'GST number', placeholder: '22AAAAA0000A1Z5' },
  { name: 'status', label: 'Status', type: 'select', options: toOptions(ACTIVE_STATUS) },
  { name: 'billing_address', label: 'Billing address', type: 'textarea', full: true },
  { name: 'notes', label: 'Notes', type: 'textarea', full: true }
];

export const CLIENT_EMPTY = {
  name: '',
  company: '',
  email: '',
  phone: '',
  website: '',
  gst_number: '',
  status: 'active',
  billing_address: '',
  notes: ''
};

const AdminClients = () => {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <ResourcePage
      title="Clients"
      subtitle="Everyone you have won work from, with their projects and billing."
      endpoint="/clients"
      exportType="clients"
      addLabel="+ Add Client"
      formTitle="Client"
      searchPlaceholder="Search by name, company, email, phone or GST..."
      filters={[{ name: 'status', label: 'Status', options: toOptions(ACTIVE_STATUS) }]}
      fields={CLIENT_FIELDS}
      emptyForm={CLIENT_EMPTY}
      initialForm={location.state?.prefill}
      initialEdit={location.state?.edit}
      onRowClick={(row) => navigate(`/admin/clients/${row.id}`)}
      canDelete={false}
      columns={[
        {
          key: 'name',
          label: 'Client',
          render: (c) => (
            <div className="resource-primary">
              <strong>{c.company || c.name}</strong>
              {c.company && <span>{c.name}</span>}
            </div>
          )
        },
        { key: 'email', label: 'Email', render: (c) => c.email || '—' },
        { key: 'phone', label: 'Phone', render: (c) => c.phone || '—' },
        { key: 'projects_count', label: 'Projects' },
        { key: 'total_invoiced', label: 'Invoiced', render: (c) => formatMoney(c.total_invoiced || 0) },
        { key: 'total_paid', label: 'Received', render: (c) => formatMoney(c.total_paid || 0) },
        { key: 'status', label: 'Status', render: (c) => <StatusBadge meta={ACTIVE_STATUS} value={c.status} /> }
      ]}
    />
  );
};

export default AdminClients;
