import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { API_URL, clearSession, getToken } from '../../utils/adminAuth';
import services from '../../data/services';
import { STATUS_META, STATUS_OPTIONS } from './statusMeta';
import './AdminSubmissions.css';

const serviceTitle = (id) => {
  if (!id) return '—';
  if (id === 'other') return 'Other';
  return services.find((s) => s.id === id)?.title || id;
};

const AdminSubmissions = () => {
  const navigate = useNavigate();
  const [page, setPage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [expandedId, setExpandedId] = useState(null);
  const [search, setSearch] = useState('');
  const [drafts, setDrafts] = useState({}); // id -> { status, deal_value }
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
      const url = search.trim()
        ? `${API_URL}/contacts?search=${encodeURIComponent(search.trim())}`
        : `${API_URL}/contacts`;
      loadPage(url);
    }, delay);

    return () => clearTimeout(timer);
  }, [search, loadPage]);

  const draftFor = (c) => drafts[c.id] || { status: c.status, deal_value: c.deal_value ?? '' };

  const setDraftField = (id, field, value) => {
    setDrafts((prev) => ({
      ...prev,
      [id]: { ...(prev[id] || draftFor({ id, status: 'new', deal_value: '' })), [field]: value }
    }));
  };

  const expandRow = (c) => {
    const isOpening = expandedId !== c.id;
    setExpandedId(isOpening ? c.id : null);
    setSaveError('');
    if (isOpening) {
      setDrafts((prev) => ({ ...prev, [c.id]: { status: c.status, deal_value: c.deal_value ?? '' } }));
    }
  };

  const saveDeal = async (c) => {
    const draft = draftFor(c);
    setSavingId(c.id);
    setSaveError('');
    try {
      const response = await fetch(`${API_URL}/contacts/${c.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
          Authorization: `Bearer ${getToken()}`
        },
        body: JSON.stringify({
          status: draft.status,
          deal_value: draft.status === 'won' ? draft.deal_value || null : null
        })
      });

      if (response.status === 401) {
        clearSession();
        navigate('/admin/login', { replace: true });
        return;
      }

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to update this submission.');
      }

      setPage((prev) => ({
        ...prev,
        data: prev.data.map((item) => (item.id === c.id ? data.data : item))
      }));
      setSavedId(c.id);
      setTimeout(() => setSavedId((id) => (id === c.id ? null : id)), 2000);
    } catch (err) {
      setSaveError(err.message || 'Something went wrong saving this submission.');
    } finally {
      setSavingId(null);
    }
  };

  return (
    <>
      <div className="admin-page-header">
        <div>
          <h1>Contact Submissions</h1>
          <p>Everyone who has reached out through the site's contact form.</p>
        </div>
        {page && <span className="admin-total-count">{page.total} total</span>}
      </div>

      <div className="admin-search-bar">
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

      {error && <div className="admin-dashboard-error">{error}</div>}

      {loading && <div className="admin-dashboard-loading">Loading submissions...</div>}

      {!loading && page && page.data.length === 0 && (
        <div className="admin-empty-state">
          {search ? `No submissions match "${search}".` : 'No contact submissions yet.'}
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
                  <th>Received</th>
                </tr>
              </thead>
              <tbody>
                {page.data.map((c) => {
                  const draft = draftFor(c);
                  const meta = STATUS_META[c.status] || STATUS_META.new;
                  return (
                    <React.Fragment key={c.id}>
                      <tr className="admin-table-row" onClick={() => expandRow(c)}>
                        <td>{c.name}</td>
                        <td><a href={`mailto:${c.email}`} onClick={(e) => e.stopPropagation()}>{c.email}</a></td>
                        <td>{serviceTitle(c.service_interested)}</td>
                        <td>{c.subject}</td>
                        <td>
                          <span className="status-badge" style={{ backgroundColor: `${meta.color}1a`, color: meta.color }}>
                            <span className="status-badge-dot" style={{ backgroundColor: meta.color }} />
                            {meta.label}
                          </span>
                        </td>
                        <td>{new Date(c.created_at).toLocaleString()}</td>
                      </tr>
                      {expandedId === c.id && (
                        <tr className="admin-table-detail-row">
                          <td colSpan={6}>
                            <div className="admin-detail-meta">
                              <span><strong>Phone:</strong> {c.phone || '—'}</span>
                              <span><strong>Company:</strong> {c.company || '—'}</span>
                              <span><strong>Budget:</strong> {c.budget_range || '—'}</span>
                              <span><strong>Timeline:</strong> {c.timeline || '—'}</span>
                            </div>
                            <strong>Message:</strong>
                            <p>{c.message}</p>

                            <div className="deal-edit" onClick={(e) => e.stopPropagation()}>
                              <div className="deal-edit-field">
                                <label>Status</label>
                                <select
                                  value={draft.status}
                                  onChange={(e) => setDraftField(c.id, 'status', e.target.value)}
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
                                    onChange={(e) => setDraftField(c.id, 'deal_value', e.target.value)}
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
                            </div>
                            {saveError && expandedId === c.id && (
                              <div className="deal-save-error">{saveError}</div>
                            )}
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
