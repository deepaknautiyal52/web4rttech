import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { API_URL, clearSession, getToken } from '../../utils/adminAuth';

export class AuthError extends Error {}

// Thin fetch wrapper for the admin API: adds the bearer token, parses JSON,
// and throws an Error carrying `status` and Laravel's `errors` bag on
// failure. A 401 clears the session and throws AuthError.
export async function api(path, { method = 'GET', body, raw = false } = {}) {
  const headers = { Accept: 'application/json', Authorization: `Bearer ${getToken()}` };
  if (body !== undefined) headers['Content-Type'] = 'application/json';

  const response = await fetch(`${API_URL}${path}`, {
    method,
    headers,
    body: body !== undefined ? JSON.stringify(body) : undefined
  });

  if (response.status === 401) {
    clearSession();
    throw new AuthError('Your session has expired. Please log in again.');
  }

  if (raw) {
    if (!response.ok) throw Object.assign(new Error('Request failed.'), { status: response.status });
    return response;
  }

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    const message =
      response.status === 403
        ? 'You do not have access to this.'
        : response.status === 422
          ? 'Please check the highlighted fields and try again.'
          : data.message || 'Something went wrong. Please try again.';
    throw Object.assign(new Error(message), { status: response.status, errors: data.errors || {} });
  }

  return data;
}

// Same as api(), but sends the user to the login page when the session
// has expired.
export function useApi() {
  const navigate = useNavigate();
  return useCallback(
    (path, options) =>
      api(path, options).catch((err) => {
        if (err instanceof AuthError) navigate('/admin/login', { replace: true });
        throw err;
      }),
    [navigate]
  );
}

// Downloads GET /export/{type} as a CSV file.
export async function downloadExport(type) {
  const response = await api(`/export/${type}`, { raw: true });
  const blob = await response.blob();
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `${type}-${new Date().toISOString().slice(0, 10)}.csv`;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}

// Id/name lists for dropdowns, cached for the session and refreshed after
// any record is saved.
let lookupsPromise = null;

export function getLookups() {
  if (!lookupsPromise) {
    lookupsPromise = api('/lookups')
      .then((json) => json.data)
      .catch((err) => {
        lookupsPromise = null;
        throw err;
      });
  }
  return lookupsPromise;
}

export function invalidateLookups() {
  lookupsPromise = null;
}

export const clientLabel = (client) => (client ? client.company || client.name : '—');
