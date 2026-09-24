import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { API_URL, clearSession, getToken } from '../../utils/adminAuth';
import services from '../../data/services';
import { STATUS_META, STATUS_OPTIONS, LOST_REASONS } from './statusMeta';
import { ACTIVITY_TYPE, formatDate, today } from './moduleMeta';
import { downloadExport, invalidateLookups, useApi } from './api';
import './AdminSubmissions.css';

const serviceTitle = (id) => {
  if (!id) return '—';
  if (id === 'other') return 'Other';
  return services.find((s) => s.id === id)?.title || id;
};

const VIEWS = [
  { value: '', label: 'All leads' },
  { value: 'follow_up', label: 'Follow-ups due' },
  { value: 'stale', label: 'New for more than 48h' }
];

const draftFrom = (c) => ({
  status: c.status,
  deal_value: c.deal_value ?? '',
  next_follow_up_at: c.next_follow_up_at || '',
  lost_reason: c.lost_reason || ''
});

// Activity timeline + "log a touchpoint" form for one lead.
const LeadActivity = ({ contact, onContactChange }) => {
  const request = useApi();
  const [detail, setDetail] = useState(null);
  const [form, setForm] = useState({ type: 'call', body: '', next_follow_up_at: '' });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    request(`/contacts/${contact.id}`)
      .then(setDetail)
      .catch((err) => setError(err.message));
  }, [contact.id, request]);

  const submit = async (e) => {
    e.preventDefault();
    if (!form.body.trim()) return;
    setSaving(true);
    setError('');
    try {
      const body = { type: form.type, body: form.body };
      if (form.next_follow_up_at) body.next_follow_up_at = form.next_follow_up_at;
      const res = await request(`/contacts/${contact.id}/activities`, { method: 'POST', body });
      setDetail(res.data);
      onContactChange({ ...res.data, activities_count: res.data.activities.length });
      setForm({ type: form.type, body: '', next_follow_up_at: '' });
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const remove = async (activity) => {
    if (!window.confirm('Delete this activity?')) return;
    try {
      const res = await request(`/contacts/${contact.id}/activities/${activity.id}`, { method: 'DELETE' });
      setDetail(res.data);
      onContactChange({ ...res.data, activities_count: res.data.activities.length });
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="lead-activity">
      <strong>Activity</strong>
      <form className="lead-activity-form" onSubmit={submit}>
        <select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })}>
          {Object.entries(ACTIVITY_TYPE).map(([value, m]) => (
            <option key={value} value={value}>
              {m.icon} {m.label}
            </option>
          ))}
        </select>
        <input
          type="text"
          placeholder="What happened? e.g. Called, they want a quote by Friday"
          value={form.body}
          onChange={(e) => setForm({ ...form, body: e.target.value })}
        />
        <label className="lead-activity-followup">
          Next follow-up
          <input type="date" value={form.next_follow_up_at} onChange={(e) => setForm({ ...form, next_follow_up_at: e.target.value })} />
        </label>
        <button type="submit" className="deal-save-btn" disabled={saving || !form.body.trim()}>
          {saving ? 'Saving...' : 'Log'}
        </button>
      </form>
      {error && <div className="deal-save-error">{error}</div>}

      {!detail && !error && <p>Loading...</p>}
      {detail && detail.activities.length === 0 && <p className="resource-muted">No activity logged yet.</p>}
      {detail && detail.activities.length > 0 && (
        <ul className="lead-timeline">
          {detail.activities.map((a) => (
            <li key={a.id}>
              <span className="lead-timeline-icon">{ACTIVITY_TYPE[a.type]?.icon || '•'}</span>
              <div>
                <div className="lead-timeline-body">{a.body}</div>
                <div className="lead-timeline-meta">
                  {ACTIVITY_TYPE[a.type]?.label} · {a.user?.name || 'Unknown'} · {new Date(a.created_at).toLocaleString('en-IN')}
                  <button type="button" onClick={() => remove(a)} title="Delete">×</button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
      {detail && detail.quotations && detail.quotations.length > 0 && (
        <p className="lead-quotes">
          Quotations: {detail.quotations.map((q) => `${q.number} (${q.status})`).join(', ')}
        </p>
      )}
    </div>
  );
};

const AdminSubmissions = () => {
  const navigate = useNavigate();
  const request = useApi();
  const [page, setPage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [expandedId, setExpandedId] = useState(null);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [view, setView] = useState('');
  const [drafts, setDrafts] = useState({}); // id -> { status, deal_value, next_follow_up_at, lost_reason }
  const [savingId, setSavingId] = useState(null);
  const [saveError, setSaveError] = useState('');
  const [savedId, setSavedId] = useState(null);
  const isFirstRun = useRef(true);
  // Guards against out-of-order responses: only the reply to the most
  // recently issued request is allowed to update state.
  const requestIdRef = useRef(0);

  const loadPage = useCallback(
    async (url) => {
      const requestId = ++requestIdRef.current;
      setLoading(true);
      setError('');
      try {
        const response = await fetch(url, {
          headers: { Accept: 'application/json', Authorization: `Bearer ${getToken()}` }
        });

        if (response.status === 401) {
          clearSession();
          navigate('/admin/login', { replace: true });
          return;
        }

        if (!response.ok) {
          throw new Error('Failed to load submissions.');
        }

        const data = await response.json();
        if (requestId === requestIdRef.current) {
          setPage(data);
        }
      } catch (err) {
        if (requestId === requestIdRef.current) {
          setError(err.message || 'Something went wrong loading submissions.');
        }
      } finally {
        if (requestId === requestIdRef.current) {
          setLoading(false);
        }
      }
    },
    [navigate]
  );

  // Load immediately on mount; debounce re-queries triggered by typing.
  useEffect(() => {
    const delay = isFirstRun.current ? 0 : 350;
    isFirstRun.current = false;

    const timer = setTimeout(() => {
      const params = new URLSearchParams();
      if (search.trim()) params.set('search', search.trim());
      if (statusFilter) params.set('status', statusFilter);
      if (view === 'follow_up') params.set('follow_up', 'due');
      if (view === 'stale') params.set('stale', '1');
      const qs = params.toString();
      loadPage(`${API_URL}/contacts${qs ? `?${qs}` : ''}`);
    }, delay);

    return () => clearTimeout(timer);
  }, [search, statusFilter, view, loadPage]);

  const draftFor = (c) => drafts[c.id] || draftFrom(c);

  const setDraftField = (c, field, value) => {
    setDrafts((prev) => ({ ...prev, [c.id]: { ...(prev[c.id] || draftFrom(c)), [field]: value } }));
  };

  const replaceRow = (updated) => {
    setPage((prev) => ({
      ...prev,
      data: prev.data.map((item) => (item.id === updated.id ? { ...item, ...updated } : item))
    }));
  };

  const expandRow = (c) => {
    const isOpening = expandedId !== c.id;
    setExpandedId(isOpening ? c.id : null);
    setSaveError('');
    if (isOpening) {
      setDrafts((prev) => ({ ...prev, [c.id]: draftFrom(c) }));
    }
  };

  const saveDeal = async (c) => {
    const draft = draftFor(c);
    setSavingId(c.id);
    setSaveError('');
    try {
      const res = await request(`/contacts/${c.id}`, {
        method: 'PATCH',
        body: {
          status: draft.status,
          deal_value: draft.status === 'won' ? draft.deal_value || null : null,
          next_follow_up_at: ['won', 'lost'].includes(draft.status) ? null : draft.next_follow_up_at || null,
          lost_reason: draft.status === 'lost' ? draft.lost_reason || null : null
        }
      });

      replaceRow(res.data);
      setDrafts((prev) => ({ ...prev, [c.id]: draftFrom(res.data) }));
      setSavedId(c.id);
      setTimeout(() => setSavedId((id) => (id === c.id ? null : id)), 2000);
    } catch (err) {
      setSaveError(err.message || 'Something went wrong saving this submission.');
    } finally {
      setSavingId(null);
    }
  };

  const convertToClient = async (c) => {
    setSaveError('');
    try {
      const res = await request(`/contacts/${c.id}/convert`, { method: 'POST' });
      invalidateLookups();
      navigate(`/admin/clients/${res.data.id}`);
    } catch (err) {
      setSaveError(err.message);
    }
  };

  const handleExport = async () => {
    try {
      await downloadExport('leads');
    } catch (err) {
      setError(err.message || 'Export failed.');
    }
  };

  return (
    <>
      <div className="admin-page-header">
        <div>
          <h1>Leads</h1>
          <p>Everyone who has reached out through the site, and where each deal stands.</p>
        </div>
        <div className="admin-header-actions">
          {page && <span className="admin-total-count">{page.total} total</span>}
          <button type="button" className="admin-secondary-btn" onClick={handleExport}>
            ⬇ Export CSV
          </button>
        </div>
      </div>

      <div className="resource-toolbar">
        <div className="admin-search-bar resource-search">
          <svg className="admin-search-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="7" />
            <path d="m21 21-4.3-4.3" />
          </svg>
          <input
            type="text"
            placeholder="Search by name, email, company, or subject..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          {search && (
            <button className="admin-search-clear" onClick={() => setSearch('')} aria-label="Clear search">
              ×
            </button>
          )}
        </div>
        <select className="resource-filter" value={view} onChange={(e) => setView(e.target.value)} aria-label="View">
          {VIEWS.map((v) => (
            <option key={v.value} value={v.value}>{v.label}</option>
          ))}
        </select>
        <select className="resource-filter" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} aria-label="Status">
          <option value="">Status: All</option>
          {STATUS_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
      </div>

      {error && <div className="admin-dashboard-error">{error}</div>}

      {loading && <div className="admin-dashboard-loading">Loading submissions...</div>}

      {!loading && page && page.data.length === 0 && (
        <div className="admin-empty-state">
          {search || statusFilter || view ? 'No leads match these filters.' : 'No contact submissions yet.'}
        </div>
      )}

      {!loading && page && page.data.length > 0 && (
        <>
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Service</th>
                  <th>Subject</th>
                  <th>Status</th>
                  <th>Follow-up</th>
                  <th>Received</th>
                </tr>
              </thead>
              <tbody>
                {page.data.map((c) => {
                  const draft = draftFor(c);
                  const meta = STATUS_META[c.status] || STATUS_META.new;
                  const followUpDue = c.next_follow_up_at && c.next_follow_up_at <= today() && !['won', 'lost'].includes(c.status);
                  return (
                    <React.Fragment key={c.id}>
                      <tr className="admin-table-row" onClick={() => expandRow(c)}>
                        <td>
                          {c.name}
                          {c.activities_count > 0 && <span className="lead-activity-count" title="Logged activities">{c.activities_count}</span>}
                        </td>
                        <td><a href={`mailto:${c.email}`} onClick={(e) => e.stopPropagation()}>{c.email}</a></td>
                        <td>{serviceTitle(c.service_interested)}</td>
                        <td>{c.subject}</td>
                        <td>
                          <span className="status-badge" style={{ backgroundColor: `${meta.color}1a`, color: meta.color }}>
                            <span className="status-badge-dot" style={{ backgroundColor: meta.color }} />
                            {meta.label}
                          </span>
                        </td>
                        <td className={followUpDue ? 'expense-cell' : undefined}>
                          {c.next_follow_up_at ? formatDate(c.next_follow_up_at) : '—'}
                        </td>
                        <td>{new Date(c.created_at).toLocaleString()}</td>
                      </tr>
                      {expandedId === c.id && (
                        <tr className="admin-table-detail-row">
                          <td colSpan={7}>
                            <div className="admin-detail-meta">
                              <span><strong>Phone:</strong> {c.phone || '—'}</span>
                              <span><strong>Company:</strong> {c.company || '—'}</span>
                              <span><strong>Budget:</strong> {c.budget_range || '—'}</span>
                              <span><strong>Timeline:</strong> {c.timeline || '—'}</span>
                              {c.lost_reason && <span><strong>Lost because:</strong> {c.lost_reason}</span>}
                            </div>
                            <strong>Message:</strong>
                            <p>{c.message}</p>

                            <div className="deal-edit" onClick={(e) => e.stopPropagation()}>
                              <div className="deal-edit-field">
                                <label>Status</label>
                                <select
                                  value={draft.status}
                                  onChange={(e) => setDraftField(c, 'status', e.target.value)}
                                >
                                  {STATUS_OPTIONS.map((opt) => (
                                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                                  ))}
                                </select>
                              </div>

                              {draft.status === 'won' && (
                                <div className="deal-edit-field">
                                  <label>Deal Value ($)</label>
                                  <input
                                    type="number"
                                    min="0"
                                    step="0.01"
                                    placeholder="0.00"
                                    value={draft.deal_value}
                                    onChange={(e) => setDraftField(c, 'deal_value', e.target.value)}
                                  />
                                </div>
                              )}

                              {draft.status === 'lost' && (
                                <div className="deal-edit-field">
                                  <label>Reason lost</label>
                                  <select value={draft.lost_reason} onChange={(e) => setDraftField(c, 'lost_reason', e.target.value)}>
                                    <option value="">Select...</option>
                                    {LOST_REASONS.map((r) => (
                                      <option key={r} value={r}>{r}</option>
                                    ))}
                                  </select>
                                </div>
                              )}

                              {!['won', 'lost'].includes(draft.status) && (
                                <div className="deal-edit-field">
                                  <label>Next follow-up</label>
                                  <input
                                    type="date"
                                    value={draft.next_follow_up_at}
                                    onChange={(e) => setDraftField(c, 'next_follow_up_at', e.target.value)}
                                  />
                                </div>
                              )}

                              <button
                                type="button"
                                className="deal-save-btn"
                                disabled={savingId === c.id}
                                onClick={() => saveDeal(c)}
                              >
                                {savingId === c.id ? 'Saving...' : 'Save'}
                              </button>

                              {savedId === c.id && <span className="deal-saved-check">✓ Saved</span>}

                              <div className="lead-actions">
                                <Link
                                  className="admin-secondary-btn"
                                  to="/admin/quotations"
                                  state={{
                                    prefill: {
                                      contact_id: String(c.id),
                                      client_id: c.client_id ? String(c.client_id) : '',
                                      title: c.subject
                                    }
                                  }}
                                >
                                  Create quotation
                                </Link>
                                {c.client_id ? (
                                  <Link className="admin-secondary-btn" to={`/admin/clients/${c.client_id}`}>
                                    View client
                                  </Link>
                                ) : (
                                  c.status === 'won' && (
                                    <button type="button" className="admin-add-btn" onClick={() => convertToClient(c)}>
                                      Convert to client
                                    </button>
                                  )
                                )}
                              </div>
                            </div>
                            {saveError && expandedId === c.id && (
                              <div className="deal-save-error">{saveError}</div>
                            )}

                            <div onClick={(e) => e.stopPropagation()}>
                              <LeadActivity
                                contact={c}
                                onContactChange={(updated) => {
                                  // Logging activity can move status / follow-up, so resync the editor.
                                  replaceRow(updated);
                                  setDrafts((prev) => ({ ...prev, [c.id]: draftFrom(updated) }));
                                }}
                              />
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  );
                })}
              </tbody>
            </table>
          </div>

          <div className="admin-pagination">
            <button
              onClick={() => loadPage(page.prev_page_url)}
              disabled={!page.prev_page_url}
            >
              ← Previous
            </button>
            <span>Page {page.current_page} of {page.last_page}</span>
            <button
              onClick={() => loadPage(page.next_page_url)}
              disabled={!page.next_page_url}
            >
              Next →
            </button>
          </div>
        </>
      )}
    </>
  );
};

export default AdminSubmissions;
