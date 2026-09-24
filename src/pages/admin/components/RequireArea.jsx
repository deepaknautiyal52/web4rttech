import React from 'react';
import { Link, useOutletContext } from 'react-router-dom';
import { getUser } from '../../../utils/adminAuth';
import { canAccess } from '../permissions';

// Hides a page from roles that cannot use it. The API enforces the same
// rule, so this only avoids showing a page full of 403 errors.
const RequireArea = ({ area, children }) => {
  const context = useOutletContext();
  const user = context?.user || getUser();

  if (canAccess(user, area)) return children;

  return (
    <div className="admin-empty-state">
      <p>Your role does not have access to this section.</p>
      <p style={{ marginTop: 12 }}>
        <Link to="/admin" className="admin-panel-link">← Back to overview</Link>
      </p>
    </div>
  );
};

export default RequireArea;
