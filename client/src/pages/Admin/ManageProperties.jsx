import React from 'react';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { useAuth } from '../../context/AuthContext';
import { getAdminProperties, togglePropertyStatus } from '../../utils/api';
import { PuffLoader } from 'react-spinners';
import { toast } from 'react-toastify';
import '../Admin/Admin.css';

const ManageProperties = () => {
  const { token } = useAuth();
  const queryClient = useQueryClient();

  const { data: properties, isLoading, isError } = useQuery(
    'adminProperties',
    () => getAdminProperties(token)
  );

  const statusMutation = useMutation(
    ({ propertyId, status }) => togglePropertyStatus(propertyId, status, token),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('adminProperties');
        queryClient.invalidateQueries('adminDashboard');
        queryClient.invalidateQueries('allProperties');
        toast.success('Property status updated successfully');
      },
      onError: (error) => {
        toast.error(error?.response?.data?.message || 'Failed to update property status');
      },
    }
  );

  const handleApprove = (propertyId) => {
    if (window.confirm('Are you sure you want to approve this property?')) {
      statusMutation.mutate({ propertyId, status: 'approved' });
    }
  };

  const handleReject = (propertyId) => {
    if (window.confirm('Are you sure you want to reject this property?')) {
      statusMutation.mutate({ propertyId, status: 'rejected' });
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
        <p className="empty-state-text">Error loading properties</p>
      </div>
    );
  }

  return (
    <div>
      <h2 style={{ marginBottom: '30px', color: '#333' }}>Manage Properties</h2>
      
      {properties && properties.length === 0 ? (
        <div className="empty-state">
          <p className="empty-state-text">No properties found</p>
        </div>
      ) : (
        <div className="admin-table-container">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Title</th>
                <th>Address</th>
                <th>City</th>
                <th>Price</th>
                <th>Owner</th>
                <th>Status</th>
                <th>Created</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {properties?.map((property) => (
                <tr key={property._id}>
                  <td>{property.title}</td>
                  <td>{property.address}</td>
                  <td>{property.city}</td>
                  <td>${property.price?.toLocaleString() || 'N/A'}</td>
                  <td>
                    {property.owner?.name || 'N/A'}
                    <br />
                    <small style={{ color: '#888' }}>{property.owner?.email}</small>
                  </td>
                  <td>
                    <span className={`status-badge status-${property.status || 'pending'}`}>
                      {property.status || 'pending'}
                    </span>
                  </td>
                  <td>{new Date(property.createdAt).toLocaleDateString()}</td>
                  <td>
                    <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                      {property.status !== 'approved' && (
                        <button
                          onClick={() => handleApprove(property._id)}
                          className="admin-btn admin-btn-small admin-btn-success"
                          disabled={statusMutation.isLoading}
                        >
                          Approve
                        </button>
                      )}
                      {property.status !== 'rejected' && (
                        <button
                          onClick={() => handleReject(property._id)}
                          className="admin-btn admin-btn-small admin-btn-danger"
                          disabled={statusMutation.isLoading}
                        >
                          Reject
                        </button>
                      )}
                    </div>
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

export default ManageProperties;

