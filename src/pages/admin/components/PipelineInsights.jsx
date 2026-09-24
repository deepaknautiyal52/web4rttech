import React, { useMemo } from 'react';
import services from '../../../data/services';

const serviceTitle = (id) => (!id || id === 'other' ? 'Not specified' : services.find((s) => s.id === id)?.title || id);
const formatCurrency = (n) => `$${Math.round(n).toLocaleString('en-US')}`;

// Win rate = won / (won + lost), i.e. only decided deals count.
function winRates(contacts, keyFn) {
  const groups = {};
  contacts.forEach((c) => {
    const key = keyFn(c);
    groups[key] = groups[key] || { key, total: 0, won: 0, lost: 0 };
    groups[key].total += 1;
    if (c.status === 'won') groups[key].won += 1;
    if (c.status === 'lost') groups[key].lost += 1;
  });
  return Object.values(groups)
    .map((g) => ({ ...g, rate: g.won + g.lost > 0 ? Math.round((g.won / (g.won + g.lost)) * 100) : null }))
    .sort((a, b) => b.total - a.total);
}

const RateTable = ({ title, rows }) => (
  <div className="admin-panel">
    <h2 className="admin-chart-title">{title}</h2>
    {rows.length === 0 ? (
      <div className="client-section-empty">No data yet.</div>
    ) : (
      <table className="finance-table compact-table insights-table">
        <thead>
          <tr>
            <th></th>
            <th>Leads</th>
            <th>Won</th>
            <th>Win rate</th>
          </tr>
        </thead>
        <tbody>
          {rows.slice(0, 7).map((r) => (
            <tr key={r.key}>
              <td>{r.key}</td>
              <td>{r.total}</td>
              <td>{r.won}</td>
              <td>
                {r.rate === null ? (
                  <span className="resource-muted">—</span>
                ) : (
                  <span className="insights-rate">
                    <span className="insights-rate-bar" style={{ width: `${r.rate}%` }} />
                    {r.rate}%
                  </span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    )}
  </div>
);

const PipelineInsights = ({ contacts }) => {
  const insights = useMemo(() => {
    const won = contacts.filter((c) => c.status === 'won');
    const withValue = won.filter((c) => parseFloat(c.deal_value) > 0);
    const withDates = won.filter((c) => c.won_at && c.created_at);
    const lost = contacts.filter((c) => c.status === 'lost');

    const lostReasons = {};
    lost.forEach((c) => {
      const r = c.lost_reason || 'No reason recorded';
      lostReasons[r] = (lostReasons[r] || 0) + 1;
    });

    return {
      avgDeal: withValue.length ? withValue.reduce((s, c) => s + parseFloat(c.deal_value), 0) / withValue.length : null,
      avgDays: withDates.length
        ? Math.round(withDates.reduce((s, c) => s + (new Date(c.won_at) - new Date(c.created_at)) / 86400000, 0) / withDates.length)
        : null,
      open: contacts.filter((c) => !['won', 'lost'].includes(c.status)).length,
      byService: winRates(contacts, (c) => serviceTitle(c.service_interested)),
      byBudget: winRates(contacts, (c) => c.budget_range || 'Not specified'),
      lostReasons: Object.entries(lostReasons).sort((a, b) => b[1] - a[1]),
      lostTotal: lost.length
    };
  }, [contacts]);

  return (
    <>
      <h2 className="admin-section-title">Sales pipeline</h2>
      <div className="admin-stat-grid">
        <div className="admin-stat-card">
          <span className="admin-stat-label">Open deals</span>
          <span className="admin-stat-value">{insights.open}</span>
        </div>
        <div className="admin-stat-card">
          <span className="admin-stat-label">Average deal size</span>
          <span className="admin-stat-value admin-stat-value-small">{insights.avgDeal === null ? '—' : formatCurrency(insights.avgDeal)}</span>
        </div>
        <div className="admin-stat-card">
          <span className="admin-stat-label">Average time to win</span>
          <span className="admin-stat-value admin-stat-value-small">
            {insights.avgDays === null ? '—' : `${insights.avgDays} day${insights.avgDays === 1 ? '' : 's'}`}
          </span>
        </div>
        <div className="admin-stat-card">
          <span className="admin-stat-label">Deals lost</span>
          <span className="admin-stat-value">{insights.lostTotal}</span>
        </div>
      </div>

      <div className="admin-chart-grid insights-grid">
        <RateTable title="Win rate by service" rows={insights.byService} />
        <RateTable title="Win rate by budget" rows={insights.byBudget} />
      </div>

      {insights.lostReasons.length > 0 && (
        <div className="admin-panel" style={{ marginBottom: 20 }}>
          <h2 className="admin-chart-title">Why deals are lost</h2>
          <div className="status-bars">
            {insights.lostReasons.map(([reason, count]) => (
              <div key={reason} className="status-bar-row lost-reason-row">
                <span className="status-bar-label">{reason}</span>
                <div className="status-bar-track">
                  <div className="status-bar-fill" style={{ width: `${(count / insights.lostReasons[0][1]) * 100}%`, backgroundColor: '#d03b3b' }} />
                </div>
                <span className="status-bar-value">{count}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  );
};

export default PipelineInsights;
