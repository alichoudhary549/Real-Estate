import React from 'react';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { useAuth } from '../../context/AuthContext';
import { getAdminUsers, toggleBlockUser } from '../../utils/api';
import { PuffLoader } from 'react-spinners';
import { toast } from 'react-toastify';
import '../Admin/Admin.css';

const ManageUsers = () => {
  const { token } = useAuth();
  const queryClient = useQueryClient();

  const { data: users, isLoading, isError } = useQuery(
    'adminUsers',
    () => getAdminUsers(token)
  );

  const blockMutation = useMutation(
    (userId) => toggleBlockUser(userId, token),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('adminUsers');
        queryClient.invalidateQueries('adminDashboard');
        toast.success('User status updated successfully');
      },
      onError: (error) => {
        toast.error(error?.response?.data?.message || 'Failed to update user status');
      },
    }
  );

  const handleToggleBlock = (userId) => {
    if (window.confirm('Are you sure you want to change this user\'s status?')) {
      blockMutation.mutate(userId);
    }
  };

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
        <p className="empty-state-text">Error loading users</p>
      </div>
    );
  }

  return (
    <div>
      <h2 style={{ marginBottom: '30px', color: '#333' }}>Manage Users</h2>
      
      {users && users.length === 0 ? (
        <div className="empty-state">
          <p className="empty-state-text">No users found</p>
        </div>
      ) : (
        <div className="admin-table-container">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Status</th>
                <th>Joined</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users?.map((user) => (
                <tr key={user._id}>
                  <td>{user.name}</td>
                  <td>{user.email}</td>
                  <td>
                    <span className={`status-badge ${user.role === 'admin' ? 'status-approved' : ''}`}>
                      {user.role || 'user'}
                    </span>
                  </td>
                  <td>
                    <span className={`status-badge ${user.isBlocked ? 'status-blocked' : 'status-active'}`}>
                      {user.isBlocked ? 'Blocked' : 'Active'}
                    </span>
                  </td>
                  <td>{new Date(user.createdAt).toLocaleDateString()}</td>
                  <td>
                    <button
                      onClick={() => handleToggleBlock(user._id)}
                      className={`admin-btn admin-btn-small ${
                        user.isBlocked ? 'admin-btn-success' : 'admin-btn-danger'
                      }`}
                      disabled={blockMutation.isLoading}
                    >
                      {user.isBlocked ? 'Unblock' : 'Block'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ManageUsers;

