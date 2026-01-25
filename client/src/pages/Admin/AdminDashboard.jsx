import React from 'react';
import { useQuery } from 'react-query';
import { useAuth } from '../../context/AuthContext';
import { getAdminDashboard, getAllBlogsAdmin } from '../../utils/api';
import { PuffLoader } from 'react-spinners';
import '../Admin/Admin.css';

const AdminDashboard = () => {
  const { token } = useAuth();
  
  const { data, isLoading, isError } = useQuery(
    'adminDashboard',
    () => getAdminDashboard(token),
    {
      refetchInterval: 30000, // Refetch every 30 seconds
      enabled: !!token, // Only run if token exists
    }
  );

  // Blog query - handle errors silently (empty array if error)
  const { data: blogs, isLoading: blogsLoading, isError: blogsError } = useQuery(
    'adminBlogs',
    () => getAllBlogsAdmin(token),
    { 
      enabled: !!token,
      refetchOnWindowFocus: false,
      retry: 1, // Only retry once
      onError: (error) => {
        // Silently handle error - don't show toast for empty blogs
        console.error('Failed to fetch blogs:', error);
      },
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

        <div className="dashboard-card">
          <div className="dashboard-card-title">Total Blogs</div>
          <div className="dashboard-card-value">
            {blogsLoading ? '...' : (blogsError ? 0 : (blogs?.length || 0))}
          </div>
          <div className="dashboard-card-subtitle">Published & drafts</div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;