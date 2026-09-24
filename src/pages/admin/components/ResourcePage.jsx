import React, { useCallback, useEffect, useRef, useState } from 'react';
import { downloadExport, getLookups, invalidateLookups, useApi } from '../api';

// Generic list + add/edit form for the admin panel's CRUD modules.
//
// Props:
//   title, subtitle, endpoint ('/clients'), addLabel, exportType
//   columns:  [{ key, label, render?(row), className? }]
//   fields:   [{ name, label, type, options?, optionsFrom?(lookups, form), required?,
//                placeholder?, full?, help?, showIf?(form), render?(props) }]
//             types: text | email | number | date | select | textarea | checkbox | custom
//   emptyForm, toForm?(row), toPayload?(form)
//   filters:  [{ name, label, options }] (sent as query params), searchPlaceholder
//   rowActions?(row, ctx), renderDetail?(row, ctx), onRowClick?(row)
//   renderAbove?(ctx) -- extra panels between the header and the table
//   canCreate, canEdit, canDelete (default true), deleteLabel?(row)
//   initialForm? -- open the add form pre-filled (e.g. from another page)
//   initialEdit? -- open the edit form for this row on mount
//   reloadKey? -- change to force a reload from outside
//   onSaved?(record) -- called after a create, update or delete
const ResourcePage = ({
  title,
  subtitle,
  endpoint,
  addLabel = '+ Add',
  exportType,
  columns,
  fields = [],
  emptyForm = {},
  toForm,
  toPayload,
  filters = [],
  defaultFilters = {},
  searchPlaceholder = 'Search...',
  rowActions,
  renderDetail,
  onRowClick,
  renderAbove,
  canCreate = true,
  canEdit = true,
  canDelete = true,
  deleteLabel,
  initialForm,
  initialEdit,
  reloadKey,
  onSaved,
  formTitle = 'Record'
}) => {
  const request = useApi();
  const [page, setPage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [search, setSearch] = useState('');
  const [filterValues, setFilterValues] = useState(defaultFilters);
  const [pageUrl, setPageUrl] = useState(null);
  const [expandedId, setExpandedId] = useState(null);
  const [lookups, setLookups] = useState(null);

  const [formOpen, setFormOpen] = useState(Boolean(initialForm));
  const [formData, setFormData] = useState(initialForm ? { ...emptyForm, ...initialForm } : emptyForm);
  const [formErrors, setFormErrors] = useState({});
  const [formStatus, setFormStatus] = useState('idle');
  const [formMessage, setFormMessage] = useState('');
  const formRef = useRef(null);
  const requestIdRef = useRef(0);
  const isFirstRun = useRef(true);

  const needsLookups = fields.some((f) => f.optionsFrom);

  // Open straight into edit mode when another page links here with a row.
  useEffect(() => {
    if (initialEdit) openEdit(initialEdit);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!needsLookups) return;
    getLookups()
      .then(setLookups)
      .catch(() => {});
  }, [needsLookups]);

  const buildQuery = useCallback(() => {
    const params = new URLSearchParams();
    if (search.trim()) params.set('search', search.trim());
    Object.entries(filterValues).forEach(([k, v]) => {
      if (v !== '' && v !== undefined && v !== null) params.set(k, v);
    });
    const qs = params.toString();
    return `${endpoint}${qs ? `?${qs}` : ''}`;
  }, [endpoint, search, filterValues]);

  const load = useCallback(
    async (path) => {
      const requestId = ++requestIdRef.current;
      setLoading(true);
      setError('');
      try {
        const data = await request(path);
        if (requestId === requestIdRef.current) setPage(data);
      } catch (err) {
        if (requestId === requestIdRef.current) setError(err.message);
      } finally {
        if (requestId === requestIdRef.current) setLoading(false);
      }
    },
    [request]
  );

  // Load on mount; debounce typing in the search box.
  useEffect(() => {
    const delay = isFirstRun.current ? 0 : 300;
    isFirstRun.current = false;
    const timer = setTimeout(() => {
      setPageUrl(null);
      load(buildQuery());
    }, delay);
    return () => clearTimeout(timer);
  }, [buildQuery, load, reloadKey]);

  const reload = useCallback(() => load(pageUrl || buildQuery()), [load, pageUrl, buildQuery]);

  const goToPage = (absoluteUrl) => {
    if (!absoluteUrl) return;
    // Laravel returns absolute URLs; keep only the path after /api.
    const path = absoluteUrl.slice(absoluteUrl.indexOf('/api/') + 4);
    setPageUrl(path);
    load(path);
  };

  const openAdd = () => {
    setFormData(emptyForm);
    setFormErrors({});
    setFormMessage('');
    setFormStatus('idle');
    setFormOpen(true);
    setTimeout(() => formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 0);
  };

  const openEdit = (row) => {
    const base = toForm
      ? toForm(row)
      : Object.fromEntries(Object.keys(emptyForm).map((k) => [k, row[k] ?? emptyForm[k] ?? '']));
    setFormData({ ...base, id: row.id });
    setFormErrors({});
    setFormMessage('');
    setFormStatus('idle');
    setFormOpen(true);
    setTimeout(() => formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 0);
  };

  const closeForm = () => {
    setFormOpen(false);
    setFormData(emptyForm);
    setFormErrors({});
  };

  const setField = (name, value) => setFormData((prev) => ({ ...prev, [name]: value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormStatus('submitting');
    setFormErrors({});
    setFormMessage('');

    const isEdit = Boolean(formData.id);
    const payload = toPayload ? toPayload(formData) : { ...formData };
    delete payload.id;
    // Empty strings become nulls so optional numeric/date columns validate.
    Object.keys(payload).forEach((k) => {
      if (payload[k] === '') payload[k] = null;
    });

    try {
      const res = await request(isEdit ? `${endpoint}/${formData.id}` : endpoint, {
        method: isEdit ? 'PUT' : 'POST',
        body: payload
      });
      invalidateLookups();
      closeForm();
      setNotice(res.message || 'Saved.');
      setTimeout(() => setNotice(''), 3000);
      reload();
      if (onSaved) onSaved(res.data);
    } catch (err) {
      setFormErrors(err.errors || {});
      setFormMessage(err.message);
      setFormStatus('error');
    }
  };

  const handleDelete = async (row) => {
    const label = deleteLabel ? deleteLabel(row) : row.name || row.title || row.number || `#${row.id}`;
    if (!window.confirm(`Delete "${label}"? This cannot be undone.`)) return;
    try {
      await request(`${endpoint}/${row.id}`, { method: 'DELETE' });
      invalidateLookups();
      reload();
      if (onSaved) onSaved(null);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleExport = async () => {
    try {
      await downloadExport(exportType);
    } catch (err) {
      setError(err.message || 'Export failed.');
    }
  };

  const ctx = { reload, request, setError, setNotice, openEdit, lookups };
  const rows = page ? (Array.isArray(page.data) ? page.data : []) : [];
  const hasActions = canEdit || canDelete || rowActions;
  const colCount = columns.length + (hasActions ? 1 : 0);

  const renderField = (field) => {
    if (field.showIf && !field.showIf(formData)) return null;
    const value = formData[field.name] ?? '';
    const err = formErrors[field.name];
    const id = `rf-${field.name}`;
    let input;

    if (field.type === 'custom') {
      input = field.render({ value, form: formData, setField, errors: formErrors, lookups });
    } else if (field.type === 'select') {
      const options = field.optionsFrom ? (lookups ? field.optionsFrom(lookups, formData) : []) : field.options;
      input = (
        <select id={id} value={value ?? ''} onChange={(e) => setField(field.name, e.target.value)}>
          {field.placeholder !== undefined && <option value="">{field.placeholder}</option>}
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      );
    } else if (field.type === 'textarea') {
      input = (
        <textarea
          id={id}
          rows={field.rows || 3}
          value={value}
          placeholder={field.placeholder}
          onChange={(e) => setField(field.name, e.target.value)}
        />
      );
    } else if (field.type === 'checkbox') {
      input = (
        <label className="admin-checkbox">
          <input
            type="checkbox"
            checked={Boolean(value)}
            onChange={(e) => setField(field.name, e.target.checked)}
          />
          {field.checkboxLabel || field.label}
        </label>
      );
    } else {
      input = (
        <input
          id={id}
          type={field.type || 'text'}
          value={value}
          placeholder={field.placeholder}
          min={field.type === 'number' ? field.min ?? '0' : undefined}
          step={field.type === 'number' ? field.step || '0.01' : undefined}
          onChange={(e) => setField(field.name, e.target.value)}
        />
      );
    }

    return (
      <div key={field.name} className={`admin-form-group${field.full ? ' resource-field-full' : ''}`}>
        {field.type !== 'checkbox' && (
          <label htmlFor={id}>
            {field.label}
            {field.required ? ' *' : ''}
          </label>
        )}
        {input}
        {field.help && <span className="resource-field-help">{field.help}</span>}
        {err && field.type !== 'custom' && <span className="field-error">{err[0]}</span>}
      </div>
    );
  };

  return (
    <>
      <div className="admin-page-header">
        <div>
          <h1>{title}</h1>
          {subtitle && <p>{subtitle}</p>}
        </div>
        <div className="admin-header-actions">
          {page && page.total !== undefined && <span className="admin-total-count">{page.total} total</span>}
          {exportType && (
            <button type="button" className="admin-secondary-btn" onClick={handleExport}>
              ⬇ Export CSV
            </button>
          )}
          {canCreate && fields.length > 0 && (
            <button type="button" className="admin-add-btn" onClick={openAdd}>
              {addLabel}
            </button>
          )}
        </div>
      </div>

      {error && <div className="admin-dashboard-error">{error}</div>}
      {notice && <div className="form-alert form-alert-success">{notice}</div>}

      {formOpen && (
        <div className="admin-panel resource-form-panel" ref={formRef}>
          <div className="admin-panel-header">
            <h2>{formData.id ? `Edit ${formTitle}` : `New ${formTitle}`}</h2>
            <button type="button" className="admin-panel-link" onClick={closeForm}>
              Cancel
            </button>
          </div>
          {formStatus === 'error' && formMessage && <div className="form-alert form-alert-error">{formMessage}</div>}
          <form onSubmit={handleSubmit} className="resource-form" noValidate>
            <div className="resource-form-grid">{fields.map(renderField)}</div>
            <button type="submit" className="admin-settings-btn" disabled={formStatus === 'submitting'}>
              {formStatus === 'submitting' ? 'Saving...' : formData.id ? 'Save changes' : `Create ${formTitle}`}
            </button>
          </form>
        </div>
      )}

      {renderAbove && renderAbove(ctx)}

      <div className="resource-toolbar">
        <div className="admin-search-bar resource-search">
          <svg className="admin-search-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="7" />
            <path d="m21 21-4.3-4.3" />
          </svg>
          <input type="text" placeholder={searchPlaceholder} value={search} onChange={(e) => setSearch(e.target.value)} />
          {search && (
            <button className="admin-search-clear" onClick={() => setSearch('')} aria-label="Clear search">
              ×
            </button>
          )}
        </div>
        {filters.map((f) => (
          <select
            key={f.name}
            className="resource-filter"
            value={filterValues[f.name] ?? ''}
            onChange={(e) => setFilterValues((prev) => ({ ...prev, [f.name]: e.target.value }))}
            aria-label={f.label}
          >
            <option value="">{f.label}: All</option>
            {f.options.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        ))}
      </div>

      {loading && !page && <div className="admin-dashboard-loading">Loading...</div>}

      {page && rows.length === 0 && !loading && (
        <div className="admin-empty-state">
          {search || Object.values(filterValues).some(Boolean) ? 'Nothing matches these filters.' : 'Nothing here yet.'}
        </div>
      )}

      {page && rows.length > 0 && (
        <>
          <div className={`admin-table-wrap${loading ? ' resource-loading' : ''}`}>
            <table className="admin-table resource-table">
              <thead>
                <tr>
                  {columns.map((c) => (
                    <th key={c.key}>{c.label}</th>
                  ))}
                  {hasActions && <th></th>}
                </tr>
              </thead>
              <tbody>
                {rows.map((row) => {
                  const clickable = Boolean(renderDetail || onRowClick);
                  return (
                    <React.Fragment key={row.id}>
                      <tr
                        className={clickable ? 'admin-table-row' : undefined}
                        onClick={
                          clickable
                            ? () => (onRowClick ? onRowClick(row) : setExpandedId(expandedId === row.id ? null : row.id))
                            : undefined
                        }
                      >
                        {columns.map((c) => (
                          <td key={c.key} className={c.className}>
                            {c.render ? c.render(row) : row[c.key] ?? '—'}
                          </td>
                        ))}
                        {hasActions && (
                          <td className="finance-row-actions" onClick={(e) => e.stopPropagation()}>
                            {rowActions && rowActions(row, ctx)}
                            {canEdit && fields.length > 0 && (
                              <button type="button" onClick={() => openEdit(row)} title="Edit">
                                ✏️
                              </button>
                            )}
                            {canDelete && (
                              <button type="button" onClick={() => handleDelete(row)} title="Delete">
                                🗑️
                              </button>
                            )}
                          </td>
                        )}
                      </tr>
                      {renderDetail && expandedId === row.id && (
                        <tr className="admin-table-detail-row resource-detail-row">
                          <td colSpan={colCount}>{renderDetail(row, ctx)}</td>
                        </tr>
                      )}
                    </React.Fragment>
                  );
                })}
              </tbody>
            </table>
          </div>

          {page.last_page > 1 && (
            <div className="admin-pagination">
              <button onClick={() => goToPage(page.prev_page_url)} disabled={!page.prev_page_url}>
                ← Previous
              </button>
              <span>
                Page {page.current_page} of {page.last_page}
              </span>
              <button onClick={() => goToPage(page.next_page_url)} disabled={!page.next_page_url}>
                Next →
              </button>
            </div>
          )}
        </>
      )}
    </>
  );
};

export default ResourcePage;
