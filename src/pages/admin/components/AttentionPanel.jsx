import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { clientLabel, useApi } from '../api';
import { formatMoney } from '../financeMeta';
import { RENEWAL_TYPE, formatDate } from '../moduleMeta';
import { DaysLeft } from '../AdminRenewals';

const Stat = ({ label, value, sub, tone, to }) => {
  const body = (
    <>
      <span className="admin-stat-label">{label}</span>
      <span className={`admin-stat-value admin-stat-value-small${tone ? ` admin-stat-value-flat ${tone}` : ''}`}>{value}</span>
      {sub && <span className="admin-stat-sub">{sub}</span>}
    </>
  );
  return to ? (
    <Link to={to} className="admin-stat-card attention-stat">
      {body}
    </Link>
  ) : (
    <div className="admin-stat-card">{body}</div>
  );
};

const List = ({ title, to, items, render, empty }) => (
  <div className="admin-panel attention-list">
    <div className="admin-panel-header">
      <h2>{title}</h2>
      {to && <Link to={to} className="admin-panel-link">View all →</Link>}
    </div>
    {items.length === 0 ? <div className="client-section-empty">{empty}</div> : <ul>{items.map(render)}</ul>}
  </div>
);

// "What needs doing today" summary at the top of the Overview. Sections
// the user's role cannot see are simply absent from the /dashboard reply.
const AttentionPanel = () => {
  const request = useApi();
  const [data, setData] = useState(null);

  useEffect(() => {
    request('/dashboard')
      .then((json) => setData(json.data))
      .catch(() => setData({}));
  }, [request]);

  if (!data) return null;

  const stats = [];
  if (data.receivables) {
    stats.push(
      <Stat
        key="recv"
        label="Outstanding"
        value={formatMoney(data.receivables.outstanding)}
        sub={`${data.receivables.outstanding_count} unpaid invoice${data.receivables.outstanding_count === 1 ? '' : 's'}`}
        to="/admin/invoices"
      />,
      <Stat
        key="overdue"
        label="Overdue"
        value={formatMoney(data.receivables.overdue_total)}
        sub={`${data.receivables.overdue.length} past due`}
        tone={data.receivables.overdue_total > 0 ? 'expense-text' : undefined}
        to="/admin/invoices"
      />
    );
  }
  if (data.projects) {
    stats.push(
      <Stat
        key="proj"
        label="Active projects"
        value={data.projects.active}
        sub={`${data.projects.overdue.length} late · ${data.projects.over_budget.length} over budget`}
        to="/admin/projects"
      />
    );
  }
  if (data.tickets) {
    stats.push(
      <Stat
        key="tickets"
        label="Open tickets"
        value={data.tickets.open}
        sub={`${data.tickets.breached} past SLA · ${data.tickets.urgent} high/urgent`}
        tone={data.tickets.breached > 0 ? 'expense-text' : undefined}
        to="/admin/tickets"
      />
    );
  }
  if (data.monthly_burn !== undefined) {
    stats.push(<Stat key="burn" label="Monthly burn" value={formatMoney(data.monthly_burn)} sub="Recurring expenses" to="/admin/finances" />);
  }

  const lists = [];
  if (data.follow_ups) {
    lists.push(
      <List
        key="fu"
        title="Follow-ups due"
        to="/admin/submissions"
        items={data.follow_ups}
        empty="No follow-ups due. 🎉"
        render={(c) => (
          <li key={c.id}>
            <span><strong>{c.name}</strong>{c.company ? ` (${c.company})` : ''}: {c.subject}</span>
            <span className="expense-cell">{formatDate(c.next_follow_up_at)}</span>
          </li>
        )}
      />
    );
  }
  if (data.stale_leads && data.stale_leads.length > 0) {
    lists.push(
      <List
        key="stale"
        title="New leads waiting over 48h"
        to="/admin/submissions"
        items={data.stale_leads}
        render={(c) => (
          <li key={c.id}>
            <span><strong>{c.name}</strong>: {c.subject}</span>
            <span className="resource-muted">{formatDate(c.created_at)}</span>
          </li>
        )}
      />
    );
  }
  if (data.renewals) {
    lists.push(
      <List
        key="ren"
        title="Renewals due in 30 days"
        to="/admin/renewals"
        items={data.renewals}
        empty="Nothing expiring in the next 30 days."
        render={(r) => (
          <li key={r.id}>
            <span>
              <strong>{RENEWAL_TYPE[r.type]?.label}</strong> {r.name}
              {r.client ? ` · ${clientLabel(r.client)}` : ''}
            </span>
            <DaysLeft days={r.days_left} />
          </li>
        )}
      />
    );
  }
  if (data.receivables && data.receivables.overdue.length > 0) {
    lists.push(
      <List
        key="inv"
        title="Overdue invoices"
        to="/admin/invoices"
        items={data.receivables.overdue}
        render={(i) => (
          <li key={i.id}>
            <span><strong>{i.number}</strong> · {clientLabel(i.client)}</span>
            <span className="expense-cell">{formatMoney(i.balance, i.currency)}</span>
          </li>
        )}
      />
    );
  }
  if (data.projects && (data.projects.overdue.length > 0 || data.projects.over_budget.length > 0)) {
    const items = [
      ...data.projects.overdue.map((p) => ({ ...p, why: `Deadline ${formatDate(p.deadline)} passed` })),
      ...data.projects.over_budget.map((p) => ({
        ...p,
        why: `Cost ${formatMoney(p.cost, p.currency)} vs budget ${formatMoney(p.budget, p.currency)}`
      }))
    ];
    lists.push(
      <List
        key="proj"
        title="Projects at risk"
        to="/admin/projects"
        items={items}
        render={(p, idx) => (
          <li key={`${p.id}-${idx}`}>
            <span><strong>{p.name}</strong>{p.client ? ` · ${clientLabel(p.client)}` : ''}</span>
            <span className="expense-cell">{p.why}</span>
          </li>
        )}
      />
    );
  }

  if (stats.length === 0 && lists.length === 0) return null;

  return (
    <>
      {stats.length > 0 && <div className="admin-stat-grid attention-stats">{stats}</div>}
      {lists.length > 0 && <div className="attention-grid">{lists}</div>}
    </>
  );
};

export default AttentionPanel;
