import React from 'react';
import { useQuery } from 'react-query';
import { useAuth } from '../../context/AuthContext';
import { getAdminDashboard } from '../../utils/api';
import { PuffLoader } from 'react-spinners';
import '../Admin/Admin.css';

const AdminDashboard = () => {
  const { token } = useAuth();
  const { data, isLoading, isError } = useQuery(
    'adminDashboard',
    () => getAdminDashboard(token),
    {
      refetchInterval: 30000, // Refetch every 30 seconds
    }
  );

  if (isLoading) {
    return (
      <div className="loading-container">
        <PuffLoader color="#667eea" size={60} />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="empty-state">
        <p className="empty-state-text">Error loading dashboard data</p>
      </div>
    );
  }

  return (
    <div>
      <h2 style={{ marginBottom: '30px', color: '#333' }}>Dashboard Overview</h2>
      
      <div className="dashboard-grid">
        <div className="dashboard-card">
          <div className="dashboard-card-title">Total Users</div>
          <div className="dashboard-card-value">{data?.totalUsers || 0}</div>
          <div className="dashboard-card-subtitle">Registered users</div>
        </div>

        <div className="dashboard-card">
          <div className="dashboard-card-title">Total Properties</div>
          <div className="dashboard-card-value">{data?.totalProperties || 0}</div>
          <div className="dashboard-card-subtitle">All properties</div>
        </div>

        <div className="dashboard-card">
          <div className="dashboard-card-title">Total Bookings</div>
          <div className="dashboard-card-value">{data?.totalBookings || 0}</div>
          <div className="dashboard-card-subtitle">Confirmed bookings</div>
        </div>

        <div className="dashboard-card">
          <div className="dashboard-card-title">Pending Properties</div>
          <div className="dashboard-card-value">{data?.pendingProperties || 0}</div>
          <div className="dashboard-card-subtitle">Awaiting approval</div>
        </div>

        <div className="dashboard-card">
          <div className="dashboard-card-title">Blocked Users</div>
          <div className="dashboard-card-value">{data?.blockedUsers || 0}</div>
          <div className="dashboard-card-subtitle">Currently blocked</div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;

