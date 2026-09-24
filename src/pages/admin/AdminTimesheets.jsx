import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import ResourcePage from './components/ResourcePage';
import { clientLabel, useApi } from './api';
import { formatDate, today } from './moduleMeta';

const RANGES = [
  { value: 7, label: 'Last 7 days' },
  { value: 30, label: 'Last 30 days' },
  { value: 90, label: 'Last 90 days' }
];

// Colour a utilization bar: under 50% idle (gray), 50-100% healthy,
// over 100% overloaded (red).
const barColor = (pct) => (pct > 100 ? '#d03b3b' : pct >= 50 ? '#0ca30c' : '#898781');

const Utilization = ({ reloadKey }) => {
  const request = useApi();
  const [days, setDays] = useState(30);
  const [data, setData] = useState(null);

  useEffect(() => {
    request(`/timesheets/utilization?days=${days}`)
      .then(setData)
      .catch(() => setData(null));
  }, [days, request, reloadKey]);

  return (
    <div className="admin-panel" style={{ marginBottom: 20 }}>
      <div className="admin-panel-header">
        <h2>Team utilization</h2>
        <select className="resource-filter" value={days} onChange={(e) => setDays(Number(e.target.value))}>
          {RANGES.map((r) => (
            <option key={r.value} value={r.value}>{r.label}</option>
          ))}
        </select>
      </div>
      {!data && <div className="client-section-empty">Loading...</div>}
      {data && data.data.length === 0 && <div className="client-section-empty">Add active employees to see utilization.</div>}
      {data && data.data.length > 0 && (
        <>
          <div className="status-bars">
            {data.data.map((e) => (
              <div key={e.id} className="status-bar-row utilization-row">
                <span className="status-bar-label">{e.name}</span>
                <div className="status-bar-track">
                  <div
                    className="status-bar-fill"
                    style={{ width: `${Math.min(100, e.utilization)}%`, backgroundColor: barColor(e.utilization) }}
                  />
                </div>
                <span className="status-bar-value utilization-value">
                  {e.utilization}% <small>({e.hours}h)</small>
                </span>
              </div>
            ))}
          </div>
          <p className="resource-field-help" style={{ marginTop: 14 }}>
            Capacity is 8h per weekday: {data.capacity}h over the last {data.days} days.
          </p>
        </>
      )}
    </div>
  );
};

const AdminTimesheets = () => {
  const location = useLocation();
  const [saved, setSaved] = useState(0);

  return (
    <ResourcePage
      title="Timesheets"
      subtitle="Hours logged per project. Staff time feeds each project's real cost and profit."
      endpoint="/timesheets"
      exportType="timesheets"
      addLabel="+ Log Time"
      formTitle="Time Entry"
      searchPlaceholder="Search descriptions..."
      initialForm={location.state?.prefill}
      renderAbove={() => <Utilization reloadKey={saved} />}
      fields={[
        {
          name: 'employee_id',
          label: 'Employee',
          type: 'select',
          required: true,
          placeholder: 'Select...',
          optionsFrom: (l) => l.employees.filter((e) => e.status === 'active').map((e) => ({ value: String(e.id), label: e.name }))
        },
        {
          name: 'project_id',
          label: 'Project',
          type: 'select',
          required: true,
          placeholder: 'Select...',
          optionsFrom: (l) =>
            l.projects.map((p) => {
              const client = l.clients.find((c) => c.id === p.client_id);
              return { value: String(p.id), label: `${p.name}${client ? ` (${clientLabel(client)})` : ''}` };
            })
        },
        { name: 'work_date', label: 'Date', type: 'date', required: true },
        { name: 'hours', label: 'Hours', type: 'number', required: true, step: '0.25' },
        { name: 'description', label: 'What was done', full: true, placeholder: 'e.g. Built checkout page' }
      ]}
      emptyForm={{ employee_id: '', project_id: '', work_date: today(), hours: '', description: '' }}
      toForm={(t) => ({
        employee_id: String(t.employee_id),
        project_id: String(t.project_id),
        work_date: t.work_date,
        hours: t.hours,
        description: t.description || ''
      })}
      columns={[
        { key: 'work_date', label: 'Date', render: (t) => formatDate(t.work_date) },
        { key: 'employee', label: 'Employee', render: (t) => t.employee?.name || '—' },
        {
          key: 'project',
          label: 'Project',
          render: (t) => (
            <div className="resource-primary">
              <strong>{t.project?.name || '—'}</strong>
              {t.project?.client && <span>{clientLabel(t.project.client)}</span>}
            </div>
          )
        },
        { key: 'hours', label: 'Hours', render: (t) => `${parseFloat(t.hours)}h` },
        { key: 'description', label: 'Description', render: (t) => t.description || '—' }
      ]}
      deleteLabel={(t) => `${parseFloat(t.hours)}h on ${formatDate(t.work_date)}`}
      // Refresh utilization whenever an entry is saved or deleted.
      onSaved={() => setSaved((n) => n + 1)}
    />
  );
};

export default AdminTimesheets;
