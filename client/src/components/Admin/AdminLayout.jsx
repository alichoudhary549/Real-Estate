import React from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'react-toastify';
import '../../pages/Admin/Admin.css';

const AdminLayout = () => {
  const location = useLocation();
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  // Check if user is admin
  React.useEffect(() => {
    if (!user || user.role !== 'admin') {
      toast.error('Access denied. Admin privileges required.');
      navigate('/admin/login');
    }
  }, [user, navigate]);

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully');
    navigate('/admin/login');
  };

  if (!user || user.role !== 'admin') {
    return null;
  }

  return (
    <div className="admin-layout">
      <header className="admin-header">
        <h1>Admin Panel</h1>
        <div className="admin-header-actions">
          <span>Welcome, {user.name}</span>
          <button onClick={handleLogout} className="admin-btn admin-btn-secondary">
            Logout
          </button>
        </div>
      </header>

      <nav className="admin-nav">
        <ul className="admin-nav-list">
          <li className="admin-nav-item">
            <Link
              to="/admin/dashboard"
              className={`admin-nav-link ${location.pathname === '/admin/dashboard' ? 'active' : ''}`}
            >
              Dashboard
            </Link>
          </li>
          <li className="admin-nav-item">
            <Link
              to="/admin/users"
              className={`admin-nav-link ${location.pathname === '/admin/users' ? 'active' : ''}`}
            >
              Manage Users
            </Link>
          </li>
          <li className="admin-nav-item">
            <Link
              to="/admin/properties"
              className={`admin-nav-link ${location.pathname === '/admin/properties' ? 'active' : ''}`}
            >
              Manage Properties
            </Link>
          </li>
          <li className="admin-nav-item">
            <Link
              to="/admin/bookings"
              className={`admin-nav-link ${location.pathname === '/admin/bookings' ? 'active' : ''}`}
            >
              Manage Bookings
            </Link>
          </li>
        </ul>
      </nav>

      <main className="admin-content">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;

