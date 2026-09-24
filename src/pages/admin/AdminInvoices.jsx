import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import ResourcePage from './components/ResourcePage';
import StatusBadge from './components/StatusBadge';
import { emptyItem } from './components/LineItemsEditor';
import { itemsField, toItemsPayload } from './AdminQuotations';
import { clientLabel, useApi } from './api';
import { formatMoney, CURRENCY_OPTIONS } from './financeMeta';
import { INVOICE_STATUS, PAYMENT_METHODS, addDays, formatDate, toOptions, today } from './moduleMeta';

// Paid / partially paid are set automatically from recorded payments.
const EDITABLE_STATUSES = [
  { value: 'draft', label: 'Draft' },
  { value: 'sent', label: 'Sent' },
  { value: 'cancelled', label: 'Cancelled' }
];

const Receivables = ({ reloadKey }) => {
  const request = useApi();
  const [summary, setSummary] = useState(null);

  useEffect(() => {
    request('/invoices?status=unpaid&all=1')
      .then(({ data }) => {
        const overdue = data.filter((i) => i.display_status === 'overdue');
        setSummary({
          outstanding: data.reduce((s, i) => s + i.balance, 0),
          count: data.length,
          overdue: overdue.reduce((s, i) => s + i.balance, 0),
          overdueCount: overdue.length
        });
      })
      .catch(() => {});
  }, [request, reloadKey]);

  if (!summary) return null;
  return (
    <div className="admin-stat-grid admin-stat-grid-2">
      <div className="admin-stat-card">
        <span className="admin-stat-label">Outstanding receivables</span>
        <span className="admin-stat-value admin-stat-value-small">{formatMoney(summary.outstanding)}</span>
        <span className="admin-stat-sub">{summary.count} unpaid invoice{summary.count === 1 ? '' : 's'}</span>
      </div>
      <div className="admin-stat-card">
        <span className="admin-stat-label">Overdue</span>
        <span className={`admin-stat-value admin-stat-value-small admin-stat-value-flat ${summary.overdue > 0 ? 'expense-text' : ''}`}>
          {formatMoney(summary.overdue)}
        </span>
        <span className="admin-stat-sub">{summary.overdueCount} past due date</span>
      </div>
    </div>
  );
};

const Payments = ({ invoice, request, onChange }) => {
  const [detail, setDetail] = useState(null);
  const [form, setForm] = useState({ amount: '', paid_on: today(), method: 'Bank transfer', reference: '' });
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    request(`/invoices/${invoice.id}`).then(setDetail).catch(() => {});
  }, [invoice.id, invoice.amount_paid, request]);

  useEffect(() => {
    setForm((f) => ({ ...f, amount: invoice.balance > 0 ? invoice.balance : '' }));
  }, [invoice.balance]);

  const add = async (e) => {
    e.preventDefault();
    setSaving(true);
    setErrors({});
    try {
      const res = await request(`/invoices/${invoice.id}/payments`, { method: 'POST', body: form });
      setDetail(res.data);
      onChange();
    } catch (err) {
      setErrors(err.errors || { amount: [err.message] });
    } finally {
      setSaving(false);
    }
  };

  const remove = async (payment) => {
    if (!window.confirm(`Remove this payment of ${formatMoney(payment.amount, invoice.currency)}? Its Finances entry is removed too.`)) return;
    try {
      const res = await request(`/payments/${payment.id}`, { method: 'DELETE' });
      setDetail(res.data);
      onChange();
    } catch (err) {
      setErrors({ payment: [err.message] });
    }
  };

  return (
    <div onClick={(e) => e.stopPropagation()} className="payments-panel">
      <strong>Payments</strong>
      {!detail && <p>Loading...</p>}
      {detail && detail.payments.length === 0 && <p className="resource-muted">No payments recorded yet.</p>}
      {detail && detail.payments.length > 0 && (
        <table className="finance-table compact-table payments-table">
          <tbody>
            {detail.payments.map((p) => (
              <tr key={p.id}>
                <td>{formatDate(p.paid_on)}</td>
                <td className="finance-amount-income">{formatMoney(p.amount, invoice.currency)}</td>
                <td>{p.method || '—'}</td>
                <td>{p.reference || ''}</td>
                <td className="finance-row-actions">
                  <button type="button" onClick={() => remove(p)} title="Remove payment">🗑️</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {invoice.status !== 'cancelled' && invoice.balance > 0 && (
        <form className="deal-edit payment-form" onSubmit={add}>
          <div className="deal-edit-field">
            <label>Amount</label>
            <input type="number" min="0" step="0.01" value={form.amount} onChange={(e) => setForm({ ...form, amount: e.target.value })} />
          </div>
          <div className="deal-edit-field">
            <label>Paid on</label>
            <input type="date" value={form.paid_on} onChange={(e) => setForm({ ...form, paid_on: e.target.value })} />
          </div>
          <div className="deal-edit-field">
            <label>Method</label>
            <select value={form.method} onChange={(e) => setForm({ ...form, method: e.target.value })}>
              {PAYMENT_METHODS.map((m) => (
                <option key={m}>{m}</option>
              ))}
            </select>
          </div>
          <div className="deal-edit-field">
            <label>Reference</label>
            <input type="text" placeholder="UTR / txn id" value={form.reference} onChange={(e) => setForm({ ...form, reference: e.target.value })} />
          </div>
          <button type="submit" className="deal-save-btn" disabled={saving}>
            {saving ? 'Saving...' : 'Record payment'}
          </button>
        </form>
      )}
      {Object.values(errors).map((e) => (
        <div key={e[0]} className="deal-save-error">{e[0]}</div>
      ))}
      <p className="resource-field-help">Each payment is also added to Finances as income.</p>
    </div>
  );
};

const AdminInvoices = () => {
  const location = useLocation();
  const [changes, setChanges] = useState(0);
  const bump = () => setChanges((n) => n + 1);

  return (
    <ResourcePage
      title="Invoices"
      subtitle="Bill clients with GST, track what is paid and what is overdue."
      endpoint="/invoices"
      exportType="invoices"
      addLabel="+ New Invoice"
      formTitle="Invoice"
      searchPlaceholder="Search by invoice number or notes..."
      initialForm={location.state?.prefill}
      onSaved={bump}
      renderAbove={() => <Receivables reloadKey={changes} />}
      filters={[
        {
          name: 'status',
          label: 'Status',
          options: [{ value: 'unpaid', label: 'Unpaid (sent + partial)' }, ...toOptions(INVOICE_STATUS)]
        }
      ]}
      fields={[
        {
          name: 'client_id',
          label: 'Client',
          type: 'select',
          required: true,
          placeholder: 'Select a client...',
          optionsFrom: (l) => l.clients.map((c) => ({ value: String(c.id), label: clientLabel(c) }))
        },
        {
          name: 'project_id',
          label: 'Project',
          type: 'select',
          placeholder: 'None',
          optionsFrom: (l, form) =>
            l.projects.filter((p) => String(p.client_id) === String(form.client_id)).map((p) => ({ value: String(p.id), label: p.name }))
        },
        {
          name: 'status',
          label: 'Status',
          type: 'select',
          options: EDITABLE_STATUSES,
          help: 'Paid and partially paid are set automatically when you record payments.'
        },
        { name: 'currency', label: 'Currency', type: 'select', options: CURRENCY_OPTIONS.map((c) => ({ value: c, label: c })) },
        { name: 'issue_date', label: 'Issue date', type: 'date', required: true },
        { name: 'due_date', label: 'Due date', type: 'date' },
        { name: 'tax_rate', label: 'GST / tax %', type: 'number', help: '18% GST by default. Use 0 for export of services.' },
        itemsField,
        { name: 'notes', label: 'Notes / payment instructions', type: 'textarea', full: true, placeholder: 'Bank details, UPI id, terms...' }
      ]}
      emptyForm={{
        client_id: '',
        project_id: '',
        status: 'draft',
        currency: 'INR',
        issue_date: today(),
        due_date: addDays(today(), 15),
        tax_rate: 18,
        items: [emptyItem()],
        notes: ''
      }}
      toForm={(i) => ({
        client_id: String(i.client_id),
        project_id: i.project_id ? String(i.project_id) : '',
        // Keep paid/partial invoices as "sent" in the form; the backend re-derives them.
        status: ['paid', 'partially_paid'].includes(i.status) ? 'sent' : i.status,
        currency: i.currency,
        issue_date: i.issue_date,
        due_date: i.due_date || '',
        tax_rate: i.tax_rate,
        items: i.items,
        notes: i.notes || ''
      })}
      toPayload={toItemsPayload}
      deleteLabel={(i) => i.number}
      rowActions={(i) => (
        <button type="button" title="Print / save as PDF" onClick={() => window.open(`/admin-print/invoice/${i.id}`, '_blank')}>
          🖨️
        </button>
      )}
      columns={[
        { key: 'number', label: 'Number', render: (i) => <strong>{i.number}</strong> },
        {
          key: 'client',
          label: 'Client',
          render: (i) => (
            <div className="resource-primary">
              <Link to={`/admin/clients/${i.client_id}`} onClick={(e) => e.stopPropagation()}>
                {clientLabel(i.client)}
              </Link>
              {i.project && <span>{i.project.name}</span>}
            </div>
          )
        },
        { key: 'issue_date', label: 'Issued', render: (i) => formatDate(i.issue_date) },
        { key: 'due_date', label: 'Due', render: (i) => formatDate(i.due_date) },
        { key: 'total', label: 'Total', render: (i) => <strong>{formatMoney(i.total, i.currency)}</strong> },
        {
          key: 'balance',
          label: 'Balance',
          render: (i) => (i.status === 'cancelled' ? '—' : <span className={i.balance > 0 ? 'expense-cell' : 'finance-amount-income'}>{formatMoney(i.balance, i.currency)}</span>)
        },
        { key: 'status', label: 'Status', render: (i) => <StatusBadge meta={INVOICE_STATUS} value={i.display_status} /> }
      ]}
      renderDetail={(i, { request, reload }) => (
        <Payments
          invoice={i}
          request={request}
          onChange={() => {
            reload();
            bump();
          }}
        />
      )}
    />
  );
};

export default AdminInvoices;
