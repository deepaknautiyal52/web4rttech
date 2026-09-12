import React, { useState } from 'react';
import { API_URL, getToken } from '../../utils/adminAuth';
import './AdminSettings.css';

const initialForm = { current_password: '', password: '', password_confirmation: '' };

const AdminSettings = () => {
  const [formData, setFormData] = useState(initialForm);
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState('idle'); // idle | submitting | success | error
  const [errorMessage, setErrorMessage] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('submitting');
    setErrors({});
    setErrorMessage('');

    try {
      const response = await fetch(`${API_URL}/settings/password`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
          Authorization: `Bearer ${getToken()}`
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (response.status === 422) {
        setErrors(data.errors || {});
        setErrorMessage('Please check the highlighted fields and try again.');
        setStatus('error');
        return;
      }

      if (!response.ok) {
        throw new Error(data.message || 'Something went wrong. Please try again.');
      }

      setStatus('success');
      setFormData(initialForm);
    } catch (err) {
      setErrorMessage(err.message || 'Unable to update password right now.');
      setStatus('error');
    }
  };

  return (
    <>
      <div className="admin-page-header">
        <div>
          <h1>Settings</h1>
          <p>Manage your admin account security.</p>
        </div>
      </div>

      <div className="admin-panel admin-settings-panel">
        <h2>Change Password</h2>
        <p className="admin-settings-hint">
          Choose a strong password. You'll stay signed in on this device; other sessions will be
          signed out.
        </p>

        {status === 'success' && (
          <div className="form-alert form-alert-success">Password updated successfully.</div>
        )}
        {status === 'error' && errorMessage && (
          <div className="form-alert form-alert-error">{errorMessage}</div>
        )}

        <form onSubmit={handleSubmit} noValidate className="admin-settings-form">
          <div className="admin-form-group">
            <label htmlFor="current_password">Current Password</label>
            <input
              type="password"
              id="current_password"
              name="current_password"
              value={formData.current_password}
              onChange={handleChange}
              required
              placeholder="••••••••"
            />
            {errors.current_password && (
              <span className="field-error">{errors.current_password[0]}</span>
            )}
          </div>

          <div className="admin-form-group">
            <label htmlFor="password">New Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              minLength={8}
              placeholder="At least 8 characters"
            />
            {errors.password && <span className="field-error">{errors.password[0]}</span>}
          </div>

          <div className="admin-form-group">
            <label htmlFor="password_confirmation">Confirm New Password</label>
            <input
              type="password"
              id="password_confirmation"
              name="password_confirmation"
              value={formData.password_confirmation}
              onChange={handleChange}
              required
              placeholder="Re-enter new password"
            />
          </div>

          <button type="submit" className="admin-settings-btn" disabled={status === 'submitting'}>
            {status === 'submitting' ? 'Updating...' : 'Update Password'}
          </button>
        </form>
      </div>
    </>
  );
};

export default AdminSettings;
