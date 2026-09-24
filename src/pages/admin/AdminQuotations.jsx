import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import ResourcePage from './components/ResourcePage';
import StatusBadge from './components/StatusBadge';
import LineItemsEditor, { emptyItem } from './components/LineItemsEditor';
import { clientLabel, invalidateLookups } from './api';
import { formatMoney, CURRENCY_OPTIONS } from './financeMeta';
import { QUOTATION_STATUS, addDays, formatDate, toOptions, today } from './moduleMeta';

export const itemsField = {
  name: 'items',
  label: 'Line items',
  type: 'custom',
  full: true,
  required: true,
  render: ({ value, form, setField, errors }) => (
    <>
      <LineItemsEditor
        items={value && value.length ? value : [emptyItem()]}
        onChange={(items) => setField('items', items)}
        currency={form.currency}
        taxRate={form.tax_rate}
        errors={errors}
      />
      {errors.items && <span className="field-error">{errors.items[0]}</span>}
    </>
  )
};

export const toItemsPayload = (form) => ({
  ...form,
  items: (form.items || []).map((i) => ({
    description: i.description,
    quantity: parseFloat(i.quantity) || 0,
    unit_price: parseFloat(i.unit_price) || 0
  }))
});

const AdminQuotations = () => {
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <ResourcePage
      title="Quotations"
      subtitle="Proposals built from your pricing guide. Accepted quotes turn into invoices in one click."
      endpoint="/quotations"
      addLabel="+ New Quotation"
      formTitle="Quotation"
      searchPlaceholder="Search by number or title..."
      initialForm={location.state?.prefill}
      filters={[{ name: 'status', label: 'Status', options: toOptions(QUOTATION_STATUS) }]}
      fields={[
        { name: 'title', label: 'Title', required: true, full: true, placeholder: 'e.g. Business website + 1 year hosting' },
        {
          name: 'contact_id',
          label: 'Lead',
          type: 'select',
          placeholder: 'None',
          optionsFrom: (l) => l.contacts.map((c) => ({ value: String(c.id), label: `${c.name}${c.company ? ` (${c.company})` : ''}` }))
        },
        {
          name: 'client_id',
          label: 'Client',
          type: 'select',
          placeholder: 'None (not a client yet)',
          optionsFrom: (l) => l.clients.map((c) => ({ value: String(c.id), label: clientLabel(c) }))
        },
        { name: 'status', label: 'Status', type: 'select', options: toOptions(QUOTATION_STATUS) },
        { name: 'currency', label: 'Currency', type: 'select', options: CURRENCY_OPTIONS.map((c) => ({ value: c, label: c })) },
        { name: 'issue_date', label: 'Issue date', type: 'date', required: true },
        { name: 'valid_until', label: 'Valid until', type: 'date' },
        { name: 'tax_rate', label: 'GST / tax %', type: 'number', help: '18% GST by default. Use 0 for export of services.' },
        itemsField,
        { name: 'notes', label: 'Terms & notes', type: 'textarea', full: true, placeholder: 'Payment terms, scope exclusions, timeline...' }
      ]}
      emptyForm={{
        title: '',
        contact_id: '',
        client_id: '',
        status: 'draft',
        currency: 'INR',
        issue_date: today(),
        valid_until: addDays(today(), 30),
        tax_rate: 18,
        items: [emptyItem()],
        notes: ''
      }}
      toForm={(q) => ({
        title: q.title,
        contact_id: q.contact_id ? String(q.contact_id) : '',
        client_id: q.client_id ? String(q.client_id) : '',
        status: q.status,
        currency: q.currency,
        issue_date: q.issue_date,
        valid_until: q.valid_until || '',
        tax_rate: q.tax_rate,
        items: q.items,
        notes: q.notes || ''
      })}
      toPayload={toItemsPayload}
      deleteLabel={(q) => q.number}
      rowActions={(q, { request, setError }) => (
        <>
          <button type="button" title="Print / save as PDF" onClick={() => window.open(`/admin-print/quotation/${q.id}`, '_blank')}>
            🖨️
          </button>
          {q.status !== 'rejected' && (
            <button
              type="button"
              title="Create invoice from this quotation"
              onClick={async () => {
                if (!window.confirm(`Create a draft invoice from ${q.number}? The quotation will be marked accepted.`)) return;
                try {
                  await request(`/quotations/${q.id}/invoice`, { method: 'POST' });
                  invalidateLookups();
                  navigate('/admin/invoices');
                } catch (err) {
                  setError(err.errors?.client_id?.[0] || err.message);
                }
              }}
            >
              🧾
            </button>
          )}
        </>
      )}
      columns={[
        { key: 'number', label: 'Number', render: (q) => <strong>{q.number}</strong> },
        {
          key: 'title',
          label: 'Quotation',
          render: (q) => (
            <div className="resource-primary">
              <strong>{q.title}</strong>
              <span>{q.client ? clientLabel(q.client) : q.contact ? `Lead: ${q.contact.name}` : '—'}</span>
            </div>
          )
        },
        { key: 'issue_date', label: 'Issued', render: (q) => formatDate(q.issue_date) },
        {
          key: 'valid_until',
          label: 'Valid until',
          render: (q) => {
            const expired = q.valid_until && q.valid_until < today() && ['draft', 'sent'].includes(q.status);
            return <span className={expired ? 'expense-cell' : undefined}>{formatDate(q.valid_until)}{expired ? ' (expired)' : ''}</span>;
          }
        },
        { key: 'total', label: 'Total', render: (q) => <strong>{formatMoney(q.total, q.currency)}</strong> },
        { key: 'status', label: 'Status', render: (q) => <StatusBadge meta={QUOTATION_STATUS} value={q.status} /> }
      ]}
    />
  );
};

export default AdminQuotations;
