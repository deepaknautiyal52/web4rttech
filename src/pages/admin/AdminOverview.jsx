import React, { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip
} from 'recharts';
import { API_URL, clearSession, getToken, getUser } from '../../utils/adminAuth';
import services from '../../data/services';
import { PERIOD_OPTIONS, buildBuckets, aggregateInquiries, aggregateRevenue } from './analyticsUtils';
import { STATUS_META } from './statusMeta';
import { canAccess } from './permissions';
import AttentionPanel from './components/AttentionPanel';
import PipelineInsights from './components/PipelineInsights';
import './AdminOverview.css';

const COLOR_INQUIRIES = '#4F46E5';
const COLOR_REVENUE = '#0E7490';

const serviceTitle = (id) => services.find((s) => s.id === id)?.title || id;

const formatCurrency = (n) => `$${Math.round(n).toLocaleString('en-US')}`;

const LineTooltip = ({ active, payload, label, valueFormatter, color }) => {
  if (!active || !payload || !payload.length) return null;
  return (
    <div className="chart-tooltip">
      <div className="chart-tooltip-value">
        <span className="chart-tooltip-swatch" style={{ backgroundColor: color }} />
        {valueFormatter(payload[0].value)}
      </div>
      <div className="chart-tooltip-label">{label}</div>
    </div>
  );
};

const BarTooltip = ({ active, payload, valueFormatter, color }) => {
  if (!active || !payload || !payload.length) return null;
  const item = payload[0];
  return (
    <div className="chart-tooltip">
      <div className="chart-tooltip-value">
        <span className="chart-tooltip-swatch" style={{ backgroundColor: color }} />
        {valueFormatter(item.value)}
      </div>
      <div className="chart-tooltip-label">{item.payload.label}</div>
    </div>
  );
};

const AdminOverview = () => {
  const navigate = useNavigate();
  const user = getUser();
  const showLeads = canAccess(user, 'leads');
  const [contacts, setContacts] = useState(null);
  const [loading, setLoading] = useState(showLeads);
  const [error, setError] = useState('');
  const [period, setPeriod] = useState('month');

  useEffect(() => {
    // Lead analytics are only for roles with access to leads.
    if (!showLeads) return;

    const load = async () => {
      try {
        const response = await fetch(`${API_URL}/analytics`, {
          headers: { Accept: 'application/json', Authorization: `Bearer ${getToken()}` }
        });

        if (response.status === 401) {
          clearSession();
          navigate('/admin/login', { replace: true });
          return;
        }

        if (!response.ok) throw new Error('Failed to load analytics.');

        const json = await response.json();
        setContacts(json.data);
      } catch (err) {
        setError(err.message || 'Something went wrong loading analytics.');
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [navigate, showLeads]);

  const buckets = useMemo(() => buildBuckets(period), [period]);
  const inquirySeries = useMemo(
    () => (contacts ? aggregateInquiries(contacts, buckets) : []),
    [contacts, buckets]
  );
  const revenueSeries = useMemo(
    () => (contacts ? aggregateRevenue(contacts, buckets) : []),
    [contacts, buckets]
  );

  const stats = useMemo(() => {
    if (!contacts) return null;
    const won = contacts.filter((c) => c.status === 'won');
    const lost = contacts.filter((c) => c.status === 'lost');
    const decided = won.length + lost.length;
    return {
      total: contacts.length,
      won: won.length,
      totalRevenue: won.reduce((sum, c) => sum + (parseFloat(c.deal_value) || 0), 0),
      winRate: decided > 0 ? Math.round((won.length / decided) * 100) : null
    };
  }, [contacts]);

  const serviceBreakdown = useMemo(() => {
    if (!contacts) return [];
    const counts = {};
    contacts.forEach((c) => {
      const key = c.service_interested || 'other';
      counts[key] = (counts[key] || 0) + 1;
    });
    return Object.entries(counts)
      .map(([id, value]) => ({ label: id === 'other' ? 'Not specified' : serviceTitle(id), value }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 6);
  }, [contacts]);

  const statusBreakdown = useMemo(() => {
    if (!contacts) return [];
    const counts = Object.fromEntries(Object.keys(STATUS_META).map((key) => [key, 0]));
    contacts.forEach((c) => {
      if (counts[c.status] !== undefined) counts[c.status] += 1;
    });
    return Object.entries(counts).map(([key, value]) => ({ key, value, ...STATUS_META[key] }));
  }, [contacts]);

  const maxStatusValue = Math.max(1, ...statusBreakdown.map((s) => s.value));

  const recent = contacts
    ? [...contacts].sort((a, b) => new Date(b.created_at) - new Date(a.created_at)).slice(0, 5)
    : [];

  return (
    <>
      <div className="admin-page-header">
        <div>
          <h1>Welcome back{user?.name ? `, ${user.name}` : ''}</h1>
          <p>What needs attention today, plus inquiry volume and business performance at a glance.</p>
        </div>
      </div>

      <AttentionPanel />

      {error && <div className="admin-dashboard-error">{error}</div>}
      {loading && <div className="admin-dashboard-loading">Loading analytics...</div>}

      {!loading && contacts && (
        <>
          <h2 className="admin-section-title">Inquiries</h2>
          <div className="admin-stat-grid">
            <div className="admin-stat-card">
              <span className="admin-stat-label">Total Inquiries</span>
              <span className="admin-stat-value">{stats.total}</span>
            </div>
            <div className="admin-stat-card">
              <span className="admin-stat-label">Won Deals</span>
              <span className="admin-stat-value">{stats.won}</span>
            </div>
            <div className="admin-stat-card">
              <span className="admin-stat-label">Total Revenue</span>
              <span className="admin-stat-value">{formatCurrency(stats.totalRevenue)}</span>
            </div>
            <div className="admin-stat-card">
              <span className="admin-stat-label">Win Rate</span>
              <span className="admin-stat-value">{stats.winRate === null ? '—' : `${stats.winRate}%`}</span>
            </div>
          </div>

          <div className="admin-period-toggle" role="tablist" aria-label="Chart time period">
            {PERIOD_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                type="button"
                role="tab"
                aria-selected={period === opt.value}
                className={`admin-period-btn ${period === opt.value ? 'active' : ''}`}
                onClick={() => setPeriod(opt.value)}
              >
                {opt.label}
              </button>
            ))}
          </div>

          <div className="admin-chart-grid">
            <div className="admin-panel">
              <h2 className="admin-chart-title">Inquiries Received</h2>
              <ResponsiveContainer width="100%" height={240}>
                <LineChart data={inquirySeries} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                  <CartesianGrid stroke="#e1e0d9" vertical={false} />
                  <XAxis
                    dataKey="label"
                    tick={{ fontSize: 12, fill: '#898781' }}
                    axisLine={{ stroke: '#c3c2b7' }}
                    tickLine={false}
                  />
                  <YAxis
                    allowDecimals={false}
                    tick={{ fontSize: 12, fill: '#898781' }}
                    axisLine={false}
                    tickLine={false}
                    width={30}
                  />
                  <RechartsTooltip
                    content={
                      <LineTooltip
                        color={COLOR_INQUIRIES}
                        valueFormatter={(v) => `${v} inquir${v === 1 ? 'y' : 'ies'}`}
                      />
                    }
                  />
                  <Line
                    type="monotone"
                    dataKey="value"
                    stroke={COLOR_INQUIRIES}
                    strokeWidth={2}
                    dot={{ r: 4, fill: COLOR_INQUIRIES, stroke: '#fff', strokeWidth: 2 }}
                    activeDot={{ r: 5 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>

            <div className="admin-panel">
              <h2 className="admin-chart-title">Revenue Won</h2>
              <ResponsiveContainer width="100%" height={240}>
                <LineChart data={revenueSeries} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                  <CartesianGrid stroke="#e1e0d9" vertical={false} />
                  <XAxis
                    dataKey="label"
                    tick={{ fontSize: 12, fill: '#898781' }}
                    axisLine={{ stroke: '#c3c2b7' }}
                    tickLine={false}
                  />
                  <YAxis
                    allowDecimals={false}
                    tick={{ fontSize: 12, fill: '#898781' }}
                    axisLine={false}
                    tickLine={false}
                    width={46}
                    tickFormatter={(v) => `$${v >= 1000 ? `${(v / 1000).toFixed(0)}k` : v}`}
                  />
                  <RechartsTooltip
                    content={<LineTooltip color={COLOR_REVENUE} valueFormatter={(v) => formatCurrency(v)} />}
                  />
                  <Line
                    type="monotone"
                    dataKey="value"
                    stroke={COLOR_REVENUE}
                    strokeWidth={2}
                    dot={{ r: 4, fill: COLOR_REVENUE, stroke: '#fff', strokeWidth: 2 }}
                    activeDot={{ r: 5 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="admin-chart-grid">
            <div className="admin-panel">
              <h2 className="admin-chart-title">Top Services Requested</h2>
              {serviceBreakdown.length === 0 ? (
                <div className="admin-empty-state">No service data yet.</div>
              ) : (
                <ResponsiveContainer width="100%" height={240}>
                  <BarChart
                    data={serviceBreakdown}
                    layout="vertical"
                    margin={{ top: 5, right: 30, left: 10, bottom: 5 }}
                  >
                    <CartesianGrid stroke="#e1e0d9" horizontal={false} />
                    <XAxis
                      type="number"
                      allowDecimals={false}
                      tick={{ fontSize: 12, fill: '#898781' }}
                      axisLine={false}
                      tickLine={false}
                    />
                    <YAxis
                      type="category"
                      dataKey="label"
                      tick={{ fontSize: 12, fill: '#52514e' }}
                      axisLine={false}
                      tickLine={false}
                      width={140}
                    />
                    <RechartsTooltip
                      content={
                        <BarTooltip
                          color={COLOR_INQUIRIES}
                          valueFormatter={(v) => `${v} inquir${v === 1 ? 'y' : 'ies'}`}
                        />
                      }
                      cursor={{ fill: 'rgba(79,70,229,0.06)' }}
                    />
                    <Bar dataKey="value" fill={COLOR_INQUIRIES} radius={[0, 4, 4, 0]} maxBarSize={22} />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </div>

            <div className="admin-panel">
              <h2 className="admin-chart-title">Pipeline by Status</h2>
              <div className="status-bars">
                {statusBreakdown.map((s) => (
                  <div key={s.key} className="status-bar-row">
                    <span className="status-bar-label">
                      <span className="status-dot" style={{ backgroundColor: s.color }} />
                      {s.label}
                    </span>
                    <div className="status-bar-track">
                      <div
                        className="status-bar-fill"
                        style={{ width: `${(s.value / maxStatusValue) * 100}%`, backgroundColor: s.color }}
                      />
                    </div>
                    <span className="status-bar-value">{s.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <PipelineInsights contacts={contacts} />

          <div className="admin-panel">
            <div className="admin-panel-header">
              <h2>Recent Submissions</h2>
              <Link to="/admin/submissions" className="admin-panel-link">View all →</Link>
            </div>

            {recent.length === 0 ? (
              <div className="admin-empty-state">No contact submissions yet.</div>
            ) : (
              <ul className="admin-recent-list">
                {recent.map((c) => (
                  <li key={c.id} className="admin-recent-item">
                    <div className="admin-recent-avatar">{c.name.charAt(0).toUpperCase()}</div>
                    <div className="admin-recent-info">
                      <span className="admin-recent-name">{c.name}</span>
                      <span className="admin-recent-subject">{c.subject}</span>
                    </div>
                    <span className="admin-recent-date">{new Date(c.created_at).toLocaleDateString()}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </>
      )}
    </>
  );
};

export default AdminOverview;
