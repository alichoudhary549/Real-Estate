import React from 'react';
import { useQuery } from 'react-query';
import { useAuth } from '../../context/AuthContext';
import { getAdminBookings } from '../../utils/api';
import { PuffLoader } from 'react-spinners';
import '../Admin/Admin.css';

const ManageBookings = () => {
  const { token } = useAuth();

  const { data: bookings, isLoading, isError } = useQuery(
    'adminBookings',
    () => getAdminBookings(token)
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
        <p className="empty-state-text">Error loading bookings</p>
      </div>
    );
  }

  return (
    <div>
      <h2 style={{ marginBottom: '30px', color: '#333' }}>Manage Bookings</h2>
      
      {bookings && bookings.length === 0 ? (
        <div className="empty-state">
          <p className="empty-state-text">No bookings found</p>
        </div>
      ) : (
        <div className="admin-table-container">
          <table className="admin-table">
            <thead>
              <tr>
                <th>User</th>
                <th>Property</th>
                <th>Address</th>
                <th>Visit Date</th>
                <th>Booking Date</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {bookings?.map((booking) => (
                <tr key={booking._id}>
                  <td>
                    {booking.user?.name || 'N/A'}
                    <br />
                    <small style={{ color: '#888' }}>{booking.user?.email}</small>
                  </td>
                  <td>
                    {booking.property?.title || 'N/A'}
                    <br />
                    <small style={{ color: '#888' }}>
                      {booking.property?.city}, {booking.property?.country}
                    </small>
                  </td>
                  <td>{booking.property?.address || 'N/A'}</td>
                  <td>
                    {booking.date
                      ? new Date(booking.date).toLocaleDateString()
                      : 'N/A'}
                  </td>
                  <td>
                    {booking.bookingDate
                      ? new Date(booking.bookingDate).toLocaleDateString()
                      : new Date(booking.createdAt).toLocaleDateString()}
                  </td>
                  <td>
                    <span className={`status-badge status-${booking.status || 'confirmed'}`}>
                      {booking.status || 'confirmed'}
                    </span>
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

export default ManageBookings;

