import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import ResourcePage from './components/ResourcePage';
import StatusBadge from './components/StatusBadge';
import { clientLabel } from './api';
import { formatMoney, CURRENCY_OPTIONS } from './financeMeta';
import { BILLING_CYCLES, RENEWAL_TYPE, formatDate, toOptions } from './moduleMeta';

export const DaysLeft = ({ days }) => {
  if (days === null || days === undefined) return '—';
  const cls = days < 0 ? 'days-pill expired' : days <= 7 ? 'days-pill urgent' : days <= 30 ? 'days-pill soon' : 'days-pill';
  return <span className={cls}>{days < 0 ? `Expired ${-days}d ago` : days === 0 ? 'Today' : `${days} days`}</span>;
};

const AdminRenewals = () => {
  const location = useLocation();

  return (
    <ResourcePage
      title="Renewals"
      subtitle="Domains, hosting, SSL certificates and AMC contracts, sorted by what expires first."
      endpoint="/renewals"
      exportType="renewals"
      addLabel="+ Add Renewal"
      formTitle="Renewal"
      searchPlaceholder="Search by name or provider..."
      initialForm={location.state?.prefill}
      filters={[
        { name: 'type', label: 'Type', options: toOptions(RENEWAL_TYPE) },
        {
          name: 'due_within',
          label: 'Expiring',
          options: [
            { value: '7', label: 'Within 7 days' },
            { value: '30', label: 'Within 30 days' },
            { value: '90', label: 'Within 90 days' }
          ]
        }
      ]}
      fields={[
        { name: 'type', label: 'Type', type: 'select', options: toOptions(RENEWAL_TYPE) },
        { name: 'name', label: 'Name', required: true, placeholder: 'e.g. acme.com, VPS plan, AMC 2026' },
        {
          name: 'client_id',
          label: 'Client',
          type: 'select',
          placeholder: 'Web4rtTech (our own)',
          optionsFrom: (l) => l.clients.map((c) => ({ value: String(c.id), label: clientLabel(c) }))
        },
        { name: 'provider', label: 'Provider', placeholder: 'e.g. GoDaddy, Hostinger, AWS' },
        { name: 'expiry_date', label: 'Expiry date', type: 'date', required: true },
        { name: 'billing_cycle', label: 'Billing cycle', type: 'select', options: BILLING_CYCLES },
        { name: 'cost', label: 'Our cost', type: 'number' },
        { name: 'price', label: 'Price charged to client', type: 'number' },
        { name: 'currency', label: 'Currency', type: 'select', options: CURRENCY_OPTIONS.map((c) => ({ value: c, label: c })) },
        { name: 'auto_renew', label: 'Auto-renew', type: 'checkbox', checkboxLabel: 'Auto-renews with the provider' },
        { name: 'notes', label: 'Notes', type: 'textarea', full: true }
      ]}
      emptyForm={{
        type: 'domain',
        name: '',
        client_id: '',
        provider: '',
        expiry_date: '',
        billing_cycle: 'yearly',
        cost: '',
        price: '',
        currency: 'INR',
        auto_renew: false,
        notes: ''
      }}
      toForm={(r) => ({
        type: r.type,
        name: r.name,
        client_id: r.client_id ? String(r.client_id) : '',
        provider: r.provider || '',
        expiry_date: r.expiry_date,
        billing_cycle: r.billing_cycle,
        cost: r.cost ?? '',
        price: r.price ?? '',
        currency: r.currency,
        auto_renew: Boolean(r.auto_renew),
        notes: r.notes || ''
      })}
      rowActions={(r, { request, reload, setNotice, setError }) => (
        <button
          type="button"
          title="Mark as renewed (extend by one billing cycle)"
          onClick={async () => {
            if (!window.confirm(`Mark ${r.name} as renewed for another ${r.billing_cycle.replace('ly', '')}?`)) return;
            try {
              const res = await request(`/renewals/${r.id}/renew`, { method: 'POST' });
              setNotice(res.message);
              setTimeout(() => setNotice(''), 3000);
              reload();
            } catch (err) {
              setError(err.message);
            }
          }}
        >
          🔄
        </button>
      )}
      columns={[
        { key: 'type', label: 'Type', render: (r) => <StatusBadge meta={RENEWAL_TYPE} value={r.type} /> },
        {
          key: 'name',
          label: 'Name',
          render: (r) => (
            <div className="resource-primary">
              <strong>{r.name}</strong>
              {r.provider && <span>{r.provider}</span>}
            </div>
          )
        },
        {
          key: 'client',
          label: 'Client',
          render: (r) =>
            r.client ? <Link to={`/admin/clients/${r.client_id}`}>{clientLabel(r.client)}</Link> : <span className="resource-muted">Web4rtTech</span>
        },
        { key: 'expiry_date', label: 'Expires', render: (r) => formatDate(r.expiry_date) },
        { key: 'days_left', label: 'Left', render: (r) => <DaysLeft days={r.days_left} /> },
        { key: 'billing_cycle', label: 'Cycle', render: (r) => BILLING_CYCLES.find((b) => b.value === r.billing_cycle)?.label },
        { key: 'cost', label: 'Cost', render: (r) => (r.cost ? formatMoney(r.cost, r.currency) : '—') },
        {
          key: 'price',
          label: 'Charged',
          render: (r) => (r.price ? formatMoney(r.price, r.currency) : '—')
        },
        { key: 'auto_renew', label: 'Auto', render: (r) => (r.auto_renew ? '✓' : '—') }
      ]}
    />
  );
};

export default AdminRenewals;
