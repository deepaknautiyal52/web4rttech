import React, { useCallback, useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useApi, invalidateLookups } from './api';
import StatusBadge from './components/StatusBadge';
import { STATUS_META } from './statusMeta';
import { formatMoney } from './financeMeta';
import {
  ACTIVE_STATUS,
  INVOICE_STATUS,
  PROJECT_STATUS,
  QUOTATION_STATUS,
  RENEWAL_TYPE,
  TICKET_PRIORITY,
  TICKET_STATUS,
  formatDate
} from './moduleMeta';
import { getUser } from '../../utils/adminAuth';
import { canAccess } from './permissions';

const Section = ({ title, action, children, empty }) => (
  <div className="admin-panel client-section">
    <div className="admin-panel-header">
      <h2>{title}</h2>
      {action}
    </div>
    {empty ? <div className="client-section-empty">{empty}</div> : children}
  </div>
);

const AdminClientDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const request = useApi();
  const user = getUser();
  const [client, setClient] = useState(null);
  const [error, setError] = useState('');

  const load = useCallback(async () => {
    try {
      setClient(await request(`/clients/${id}`));
    } catch (err) {
      setError(err.status === 404 ? 'Client not found.' : err.message);
    }
  }, [id, request]);

  useEffect(() => {
    load();
  }, [load]);

  const handleDelete = async () => {
    if (!window.confirm(`Delete ${client.company || client.name}? Their projects and invoices are deleted too. This cannot be undone.`)) return;
    try {
      await request(`/clients/${id}`, { method: 'DELETE' });
      invalidateLookups();
      navigate('/admin/clients', { replace: true });
    } catch (err) {
      setError(err.message);
    }
  };

  if (error) {
    return (
      <>
        <div className="admin-dashboard-error">{error}</div>
        <Link to="/admin/clients" className="admin-panel-link">← Back to clients</Link>
      </>
    );
  }
  if (!client) return <div className="admin-dashboard-loading">Loading client...</div>;

  const invoiced = client.invoices.filter((i) => i.status !== 'cancelled').reduce((s, i) => s + parseFloat(i.total), 0);
  const received = client.invoices.reduce((s, i) => s + parseFloat(i.amount_paid), 0);
  const outstanding = client.invoices
    .filter((i) => ['sent', 'partially_paid'].includes(i.status))
    .reduce((s, i) => s + parseFloat(i.balance), 0);
  const prefill = { client_id: String(client.id) };

  return (
    <>
      <Link to="/admin/clients" className="admin-panel-link">← All clients</Link>
      <div className="admin-page-header client-header">
        <div>
          <h1>{client.company || client.name}</h1>
          <p>
            {client.company && `${client.name} · `}
            {client.email || 'No email'} · {client.phone || 'No phone'}
            {client.gst_number && ` · GST ${client.gst_number}`}
          </p>
        </div>
        <div className="admin-header-actions">
          <StatusBadge meta={ACTIVE_STATUS} value={client.status} />
          <Link to="/admin/clients" state={{ edit: client }} className="admin-secondary-btn">
            Edit client
          </Link>
          <button type="button" className="admin-secondary-btn admin-danger-btn" onClick={handleDelete}>
            Delete client
          </button>
        </div>
      </div>

      <div className="admin-stat-grid">
        <div className="admin-stat-card">
          <span className="admin-stat-label">Projects</span>
          <span className="admin-stat-value">{client.projects.length}</span>
        </div>
        <div className="admin-stat-card">
          <span className="admin-stat-label">Invoiced</span>
          <span className="admin-stat-value admin-stat-value-small">{formatMoney(invoiced)}</span>
        </div>
        <div className="admin-stat-card">
          <span className="admin-stat-label">Received</span>
          <span className="admin-stat-value admin-stat-value-small admin-stat-value-flat income-text">{formatMoney(received)}</span>
        </div>
        <div className="admin-stat-card">
          <span className="admin-stat-label">Outstanding</span>
          <span className={`admin-stat-value admin-stat-value-small admin-stat-value-flat ${outstanding > 0 ? 'expense-text' : ''}`}>
            {formatMoney(outstanding)}
          </span>
        </div>
      </div>

      {(client.billing_address || client.notes || client.website) && (
        <div className="admin-panel client-section">
          {(client.website || client.billing_address) && (
            <div className="admin-detail-meta client-profile">
              {client.website && <span><strong>Website:</strong> <a href={client.website} target="_blank" rel="noreferrer">{client.website}</a></span>}
              {client.billing_address && <span><strong>Billing address:</strong> {client.billing_address}</span>}
            </div>
          )}
          {client.notes && <p className={`client-notes${client.website || client.billing_address ? '' : ' client-notes-only'}`}>{client.notes}</p>}
        </div>
      )}

      <div className="client-grid">
        {canAccess(user, 'projects') && (
          <Section
            title="Projects"
            action={<Link className="admin-panel-link" to="/admin/projects" state={{ prefill }}>+ New project</Link>}
            empty={client.projects.length === 0 && 'No projects yet.'}
          >
            <table className="finance-table compact-table">
              <tbody>
                {client.projects.map((p) => (
                  <tr key={p.id}>
                    <td>{p.name}</td>
                    <td><StatusBadge meta={PROJECT_STATUS} value={p.status} /></td>
                    <td>Due {formatDate(p.deadline)}</td>
                    <td>{formatMoney(p.revenue, p.currency)} received</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Section>
        )}

        {canAccess(user, 'invoices') && (
          <Section
            title="Invoices"
            action={<Link className="admin-panel-link" to="/admin/invoices" state={{ prefill }}>+ New invoice</Link>}
            empty={client.invoices.length === 0 && 'No invoices yet.'}
          >
            <table className="finance-table compact-table">
              <tbody>
                {client.invoices.map((i) => (
                  <tr key={i.id}>
                    <td><Link to={`/admin-print/invoice/${i.id}`} target="_blank">{i.number}</Link></td>
                    <td>{formatDate(i.issue_date)}</td>
                    <td><StatusBadge meta={INVOICE_STATUS} value={i.display_status} /></td>
                    <td>{formatMoney(i.total, i.currency)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Section>
        )}

        {canAccess(user, 'renewals') && (
          <Section
            title="Domains, hosting & AMC"
            action={<Link className="admin-panel-link" to="/admin/renewals" state={{ prefill }}>+ Add</Link>}
            empty={client.renewals.length === 0 && 'Nothing tracked yet.'}
          >
            <table className="finance-table compact-table">
              <tbody>
                {client.renewals.map((r) => (
                  <tr key={r.id}>
                    <td><StatusBadge meta={RENEWAL_TYPE} value={r.type} /></td>
                    <td>{r.name}</td>
                    <td className={r.days_left <= 30 ? 'expense-cell' : undefined}>
                      Expires {formatDate(r.expiry_date)} ({r.days_left < 0 ? `${-r.days_left}d ago` : `${r.days_left}d`})
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Section>
        )}

        {canAccess(user, 'tickets') && (
          <Section
            title="Support tickets"
            action={<Link className="admin-panel-link" to="/admin/tickets" state={{ prefill }}>+ New ticket</Link>}
            empty={client.tickets.length === 0 && 'No tickets.'}
          >
            <table className="finance-table compact-table">
              <tbody>
                {client.tickets.map((t) => (
                  <tr key={t.id}>
                    <td>{t.title}</td>
                    <td><StatusBadge meta={TICKET_PRIORITY} value={t.priority} /></td>
                    <td><StatusBadge meta={TICKET_STATUS} value={t.status} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Section>
        )}

        {canAccess(user, 'quotations') && (
          <Section
            title="Quotations"
            action={<Link className="admin-panel-link" to="/admin/quotations" state={{ prefill }}>+ New quotation</Link>}
            empty={client.quotations.length === 0 && 'No quotations.'}
          >
            <table className="finance-table compact-table">
              <tbody>
                {client.quotations.map((q) => (
                  <tr key={q.id}>
                    <td><Link to={`/admin-print/quotation/${q.id}`} target="_blank">{q.number}</Link></td>
                    <td>{q.title}</td>
                    <td><StatusBadge meta={QUOTATION_STATUS} value={q.status} /></td>
                    <td>{formatMoney(q.total, q.currency)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Section>
        )}

        {canAccess(user, 'leads') && client.contacts.length > 0 && (
          <Section title="Original inquiries">
            <table className="finance-table compact-table">
              <tbody>
                {client.contacts.map((c) => (
                  <tr key={c.id}>
                    <td>{c.subject}</td>
                    <td><StatusBadge meta={STATUS_META} value={c.status} /></td>
                    <td>{formatDate(c.created_at)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Section>
        )}
      </div>
    </>
  );
};

export default AdminClientDetail;
