import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
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
import { API_URL, clearSession, getToken } from '../../utils/adminAuth';
import { PERIOD_OPTIONS, buildBuckets } from './analyticsUtils';
import { CATEGORY_META, CATEGORY_OPTIONS, CURRENCY_OPTIONS, formatMoney } from './financeMeta';
import './AdminFinances.css';

const COLOR_INCOME = '#0ca30c';
const COLOR_EXPENSE = '#d03b3b';

const emptyForm = {
  id: null,
  type: 'expense',
  category: 'domain',
  title: '',
  party_name: '',
  amount: '',
  currency: 'INR',
  period_start: '',
  period_end: '',
  notes: ''
};

const LineTooltip = ({ active, payload, label, color }) => {
  if (!active || !payload || !payload.length) return null;
  return (
    <div className="chart-tooltip">
      <div className="chart-tooltip-value">
        <span className="chart-tooltip-swatch" style={{ backgroundColor: color }} />
        {formatMoney(payload[0].value)}
      </div>
      <div className="chart-tooltip-label">{label}</div>
    </div>
  );
};

const BarTooltip = ({ active, payload, color }) => {
  if (!active || !payload || !payload.length) return null;
  const item = payload[0];
  return (
    <div className="chart-tooltip">
      <div className="chart-tooltip-value">
        <span className="chart-tooltip-swatch" style={{ backgroundColor: color }} />
        {formatMoney(item.value)}
      </div>
      <div className="chart-tooltip-label">{item.payload.label}</div>
    </div>
  );
};

// Aggregates raw numeric amounts per bucket, assuming INR as the primary
// reporting currency -- individual entries still keep/display their own
// stored currency in the table, this is just the chart rollup.
function aggregateByType(entries, buckets, type) {
  const filtered = entries.filter((e) => e.type === type);
  return buckets.map((bucket) => {
    const value = filtered
      .filter((e) => {
        const t = new Date(e.period_start);
        return t >= bucket.start && t < bucket.end;
      })
      .reduce((sum, e) => sum + (parseFloat(e.amount) || 0), 0);
    return { label: bucket.label, value };
  });
}

const AdminFinances = () => {
  const navigate = useNavigate();
  const [entries, setEntries] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [period, setPeriod] = useState('month');

  const [formOpen, setFormOpen] = useState(false);
  const [formData, setFormData] = useState(emptyForm);
  const [formErrors, setFormErrors] = useState({});
  const [formStatus, setFormStatus] = useState('idle'); // idle | submitting | error
  const [formErrorMessage, setFormErrorMessage] = useState('');

  const loadEntries = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await fetch(`${API_URL}/finance-entries/analytics`, {
        headers: { Accept: 'application/json', Authorization: `Bearer ${getToken()}` }
      });

      if (response.status === 401) {
        clearSession();
        navigate('/admin/login', { replace: true });
        return;
      }

      if (!response.ok) throw new Error('Failed to load finance entries.');

      const json = await response.json();
      setEntries(json.data);
    } catch (err) {
      setError(err.message || 'Something went wrong loading finance entries.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadEntries();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const buckets = useMemo(() => buildBuckets(period), [period]);
  const incomeSeries = useMemo(
    () => (entries ? aggregateByType(entries, buckets, 'income') : []),
    [entries, buckets]
  );
  const expenseSeries = useMemo(
    () => (entries ? aggregateByType(entries, buckets, 'expense') : []),
    [entries, buckets]
  );

  const stats = useMemo(() => {
    if (!entries) return null;
    const totalIncome = entries
      .filter((e) => e.type === 'income')
      .reduce((sum, e) => sum + (parseFloat(e.amount) || 0), 0);
    const totalExpense = entries
      .filter((e) => e.type === 'expense')
      .reduce((sum, e) => sum + (parseFloat(e.amount) || 0), 0);
    return { totalIncome, totalExpense, net: totalIncome - totalExpense };
  }, [entries]);

  const categoryBreakdown = useMemo(() => {
    if (!entries) return [];
    const totals = {};
    entries
      .filter((e) => e.type === 'expense')
      .forEach((e) => {
        totals[e.category] = (totals[e.category] || 0) + (parseFloat(e.amount) || 0);
      });
    return Object.entries(totals)
      .map(([category, value]) => ({
        label: CATEGORY_META[category]?.label || category,
        value,
        color: CATEGORY_META[category]?.color || '#898781'
      }))
      .sort((a, b) => b.value - a.value);
  }, [entries]);

  const sortedEntries = entries
    ? [...entries].sort((a, b) => new Date(b.period_start) - new Date(a.period_start))
    : [];

  const resetForm = () => {
    setFormData(emptyForm);
    setFormErrors({});
    setFormErrorMessage('');
    setFormStatus('idle');
  };

  const openAddForm = () => {
    resetForm();
    setFormOpen(true);
  };

  const openEditForm = (entry) => {
    setFormData({
      id: entry.id,
      type: entry.type,
      category: entry.category,
      title: entry.title,
      party_name: entry.party_name || '',
      amount: entry.amount,
      currency: entry.currency || 'INR',
      period_start: entry.period_start,
      period_end: entry.period_end || '',
      notes: entry.notes || ''
    });
    setFormErrors({});
    setFormErrorMessage('');
    setFormStatus('idle');
    setFormOpen(true);
  };

  const closeForm = () => {
    setFormOpen(false);
    resetForm();
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setFormStatus('submitting');
    setFormErrors({});
    setFormErrorMessage('');

    const isEdit = Boolean(formData.id);
    const url = isEdit ? `${API_URL}/finance-entries/${formData.id}` : `${API_URL}/finance-entries`;
    const payload = { ...formData };
    delete payload.id;
    if (!payload.period_end) delete payload.period_end;

    try {
      const response = await fetch(url, {
        method: isEdit ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
          Authorization: `Bearer ${getToken()}`
        },
        body: JSON.stringify(payload)
      });

      const data = await response.json();

      if (response.status === 401) {
        clearSession();
        navigate('/admin/login', { replace: true });
        return;
      }

      if (response.status === 422) {
        setFormErrors(data.errors || {});
        setFormErrorMessage('Please check the highlighted fields and try again.');
        setFormStatus('error');
        return;
      }

      if (!response.ok) {
        throw new Error(data.message || 'Something went wrong. Please try again.');
      }

      closeForm();
      loadEntries();
    } catch (err) {
      setFormErrorMessage(err.message || 'Unable to save this entry right now.');
      setFormStatus('error');
    }
  };

  const handleDelete = async (entry) => {
    if (!window.confirm(`Delete "${entry.title}"? This cannot be undone.`)) return;

    try {
      const response = await fetch(`${API_URL}/finance-entries/${entry.id}`, {
        method: 'DELETE',
        headers: { Accept: 'application/json', Authorization: `Bearer ${getToken()}` }
      });

      if (response.status === 401) {
        clearSession();
        navigate('/admin/login', { replace: true });
        return;
      }

      if (!response.ok) throw new Error('Failed to delete entry.');

      loadEntries();
    } catch (err) {
      setError(err.message || 'Failed to delete entry.');
    }
  };

  return (
    <>
      <div className="admin-page-header">
        <div>
          <h1>Company Finances</h1>
          <p>Domain, hosting, and salary costs alongside sales &amp; income.</p>
        </div>
        <button type="button" className="admin-add-btn" onClick={openAddForm}>
          + Add Entry
        </button>
      </div>

      {error && <div className="admin-dashboard-error">{error}</div>}

      {formOpen && (
        <div className="admin-panel finance-form-panel">
          <div className="admin-panel-header">
            <h2>{formData.id ? 'Edit Entry' : 'Add Entry'}</h2>
            <button type="button" className="admin-panel-link" onClick={closeForm}>Cancel</button>
          </div>

          {formStatus === 'error' && formErrorMessage && (
            <div className="form-alert form-alert-error">{formErrorMessage}</div>
          )}

          <form onSubmit={handleFormSubmit} className="finance-form" noValidate>
            <div className="finance-form-row">
              <div className="admin-form-group">
                <label htmlFor="type">Type</label>
                <select id="type" name="type" value={formData.type} onChange={handleFormChange}>
                  <option value="expense">Expense</option>
                  <option value="income">Income</option>
                </select>
              </div>
              <div className="admin-form-group">
                <label htmlFor="category">Category</label>
                <select id="category" name="category" value={formData.category} onChange={handleFormChange}>
                  {CATEGORY_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="admin-form-group">
              <label htmlFor="title">Title *</label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleFormChange}
                required
                placeholder="e.g. web4rttech.com domain renewal"
              />
              {formErrors.title && <span className="field-error">{formErrors.title[0]}</span>}
            </div>

            <div className="admin-form-group">
              <label htmlFor="party_name">Vendor / Employee / Client</label>
              <input
                type="text"
                id="party_name"
                name="party_name"
                value={formData.party_name}
                onChange={handleFormChange}
                placeholder="e.g. Namecheap, Rahul Sharma, Acme Corp"
              />
            </div>

            <div className="finance-form-row">
              <div className="admin-form-group">
                <label htmlFor="amount">Amount *</label>
                <input
                  type="number"
                  id="amount"
                  name="amount"
                  min="0"
                  step="0.01"
                  value={formData.amount}
                  onChange={handleFormChange}
                  required
                />
                {formErrors.amount && <span className="field-error">{formErrors.amount[0]}</span>}
              </div>
              <div className="admin-form-group">
                <label htmlFor="currency">Currency</label>
                <select id="currency" name="currency" value={formData.currency} onChange={handleFormChange}>
                  {CURRENCY_OPTIONS.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="finance-form-row">
              <div className="admin-form-group">
                <label htmlFor="period_start">Valid From / Date *</label>
                <input
                  type="date"
                  id="period_start"
                  name="period_start"
                  value={formData.period_start}
                  onChange={handleFormChange}
                  required
                />
                {formErrors.period_start && <span className="field-error">{formErrors.period_start[0]}</span>}
              </div>
              <div className="admin-form-group">
                <label htmlFor="period_end">Valid To (optional)</label>
                <input
                  type="date"
                  id="period_end"
                  name="period_end"
                  value={formData.period_end}
                  onChange={handleFormChange}
                />
                {formErrors.period_end && <span className="field-error">{formErrors.period_end[0]}</span>}
              </div>
            </div>

            <div className="admin-form-group">
              <label htmlFor="notes">Notes</label>
              <textarea
                id="notes"
                name="notes"
                rows="3"
                value={formData.notes}
                onChange={handleFormChange}
                placeholder="Optional details..."
              ></textarea>
            </div>

            <button type="submit" className="admin-settings-btn" disabled={formStatus === 'submitting'}>
              {formStatus === 'submitting' ? 'Saving...' : formData.id ? 'Update Entry' : 'Add Entry'}
            </button>
          </form>
        </div>
      )}

      {loading && <div className="admin-dashboard-loading">Loading finances...</div>}

      {!loading && entries && (
        <>
          <div className="admin-stat-grid">
            <div className="admin-stat-card">
              <span className="admin-stat-label">Total Income</span>
              <span className="admin-stat-value admin-stat-value-flat income-text">
                {formatMoney(stats.totalIncome)}
              </span>
            </div>
            <div className="admin-stat-card">
              <span className="admin-stat-label">Total Expenses</span>
              <span className="admin-stat-value admin-stat-value-flat expense-text">
                {formatMoney(stats.totalExpense)}
              </span>
            </div>
            <div className="admin-stat-card">
              <span className="admin-stat-label">Net</span>
              <span className={`admin-stat-value admin-stat-value-flat ${stats.net >= 0 ? 'income-text' : 'expense-text'}`}>
                {stats.net >= 0 ? '+' : '-'}{formatMoney(Math.abs(stats.net))}
              </span>
            </div>
            <div className="admin-stat-card">
              <span className="admin-stat-label">Total Entries</span>
              <span className="admin-stat-value">{entries.length}</span>
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
              <h2 className="admin-chart-title">Income Over Time</h2>
              <ResponsiveContainer width="100%" height={220}>
                <LineChart data={incomeSeries} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                  <CartesianGrid stroke="#e1e0d9" vertical={false} />
                  <XAxis dataKey="label" tick={{ fontSize: 12, fill: '#898781' }} axisLine={{ stroke: '#c3c2b7' }} tickLine={false} />
                  <YAxis
                    tick={{ fontSize: 12, fill: '#898781' }}
                    axisLine={false}
                    tickLine={false}
                    width={46}
                    tickFormatter={(v) => `₹${v >= 1000 ? `${(v / 1000).toFixed(0)}k` : v}`}
                  />
                  <RechartsTooltip content={<LineTooltip color={COLOR_INCOME} />} />
                  <Line type="monotone" dataKey="value" stroke={COLOR_INCOME} strokeWidth={2} dot={{ r: 4, fill: COLOR_INCOME, stroke: '#fff', strokeWidth: 2 }} activeDot={{ r: 5 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>

            <div className="admin-panel">
              <h2 className="admin-chart-title">Expenses Over Time</h2>
              <ResponsiveContainer width="100%" height={220}>
                <LineChart data={expenseSeries} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                  <CartesianGrid stroke="#e1e0d9" vertical={false} />
                  <XAxis dataKey="label" tick={{ fontSize: 12, fill: '#898781' }} axisLine={{ stroke: '#c3c2b7' }} tickLine={false} />
                  <YAxis
                    tick={{ fontSize: 12, fill: '#898781' }}
                    axisLine={false}
                    tickLine={false}
                    width={46}
                    tickFormatter={(v) => `₹${v >= 1000 ? `${(v / 1000).toFixed(0)}k` : v}`}
                  />
                  <RechartsTooltip content={<LineTooltip color={COLOR_EXPENSE} />} />
                  <Line type="monotone" dataKey="value" stroke={COLOR_EXPENSE} strokeWidth={2} dot={{ r: 4, fill: COLOR_EXPENSE, stroke: '#fff', strokeWidth: 2 }} activeDot={{ r: 5 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="admin-panel" style={{ marginBottom: 20 }}>
            <h2 className="admin-chart-title">Expenses by Category</h2>
            {categoryBreakdown.length === 0 ? (
              <div className="admin-empty-state">No expenses recorded yet.</div>
            ) : (
              <ResponsiveContainer width="100%" height={Math.max(120, categoryBreakdown.length * 46)}>
                <BarChart data={categoryBreakdown} layout="vertical" margin={{ top: 5, right: 30, left: 10, bottom: 5 }}>
                  <CartesianGrid stroke="#e1e0d9" horizontal={false} />
                  <XAxis type="number" tick={{ fontSize: 12, fill: '#898781' }} axisLine={false} tickLine={false} tickFormatter={(v) => `₹${v >= 1000 ? `${(v / 1000).toFixed(0)}k` : v}`} />
                  <YAxis type="category" dataKey="label" tick={{ fontSize: 12, fill: '#52514e' }} axisLine={false} tickLine={false} width={100} />
                  <RechartsTooltip content={<BarTooltip color={COLOR_EXPENSE} />} cursor={{ fill: 'rgba(208,59,59,0.06)' }} />
                  <Bar dataKey="value" fill={COLOR_EXPENSE} radius={[0, 4, 4, 0]} maxBarSize={22} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>

          <div className="admin-panel">
            <div className="admin-panel-header">
              <h2>All Entries</h2>
            </div>

            {sortedEntries.length === 0 ? (
              <div className="admin-empty-state">No finance entries yet. Add your first one above.</div>
            ) : (
              <div className="finance-table-wrap">
                <table className="finance-table">
                  <thead>
                    <tr>
                      <th>Type</th>
                      <th>Category</th>
                      <th>Title</th>
                      <th>Vendor / Party</th>
                      <th>Amount</th>
                      <th>Period</th>
                      <th></th>
                    </tr>
                  </thead>
                  <tbody>
                    {sortedEntries.map((entry) => (
                      <tr key={entry.id}>
                        <td>
                          <span className={`finance-type-badge ${entry.type}`}>
                            {entry.type === 'income' ? 'Income' : 'Expense'}
                          </span>
                        </td>
                        <td>
                          <span className="finance-category-dot" style={{ backgroundColor: CATEGORY_META[entry.category]?.color || '#898781' }} />
                          {CATEGORY_META[entry.category]?.label || entry.category}
                        </td>
                        <td>{entry.title}</td>
                        <td>{entry.party_name || '—'}</td>
                        <td className={entry.type === 'income' ? 'finance-amount-income' : 'finance-amount-expense'}>
                          {formatMoney(entry.amount, entry.currency)}
                        </td>
                        <td>
                          {entry.period_start}
                          {entry.period_end && entry.period_end !== entry.period_start ? ` → ${entry.period_end}` : ''}
                        </td>
                        <td className="finance-row-actions">
                          <button type="button" onClick={() => openEditForm(entry)} title="Edit">✏️</button>
                          <button type="button" onClick={() => handleDelete(entry)} title="Delete">🗑️</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </>
      )}
    </>
  );
};

export default AdminFinances;
