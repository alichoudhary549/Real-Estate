import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation, useQueryClient } from 'react-query';
import { Button, Modal, Group, Text, Badge, Divider } from '@mantine/core';
import { DatePicker } from '@mantine/dates';
import { toast } from 'react-toastify';
import { removeBooking, modifyBooking } from '../../utils/api';
import { useAuth } from '../../context/AuthContext';
import dayjs from 'dayjs';
import './BookingCard.css';

const BookingCard = ({ booking, token, refetch }) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [cancelModalOpen, setCancelModalOpen] = useState(false);
  const [modifyModalOpen, setModifyModalOpen] = useState(false);
  const [newDate, setNewDate] = useState(null);

  const property = booking.residency;
  const visitDate = new Date(booking.date);
  const bookingDate = new Date(booking.bookingDate || booking.createdAt);
  const daysUntilVisit = Math.ceil((visitDate - new Date()) / (1000 * 60 * 60 * 24));

  // Calculate potential charges
  const getCancellationCharge = () => {
    if (daysUntilVisit < 7) return 50;
    if (daysUntilVisit < 14) return 25;
    return 0;
  };

  const getModificationCharge = () => {
    if (daysUntilVisit < 7) return 30;
    if (daysUntilVisit < 14) return 15;
    return 0;
  };

  // Cancel booking mutation
  const { mutate: cancelBookingMutation, isLoading: isCancelling } = useMutation({
    mutationFn: () => removeBooking(booking._id, user?.email, token),
    onSuccess: (data) => {
      toast.success(data.message || 'Booking cancelled successfully');
      if (data.cancellationCharge > 0) {
        toast.info(data.refundMessage, { autoClose: 5000 });
      }
      queryClient.invalidateQueries('allBookings');
      refetch();
      setCancelModalOpen(false);
    },
    onError: (error) => {
      toast.error(error?.response?.data?.message || 'Failed to cancel booking');
    }
  });

  // Modify booking mutation
  const { mutate: modifyBookingMutation, isLoading: isModifying } = useMutation({
    mutationFn: () => modifyBooking(booking._id, newDate, user?.email, token),
    onSuccess: (data) => {
      toast.success(data.message || 'Booking modified successfully');
      if (data.modificationCharge > 0) {
        toast.info(data.chargeMessage, { autoClose: 5000 });
      }
      queryClient.invalidateQueries('allBookings');
      refetch();
      setModifyModalOpen(false);
      setNewDate(null);
    },
    onError: (error) => {
      toast.error(error?.response?.data?.message || 'Failed to modify booking');
    }
  });

  const getStatusBadge = () => {
    if (booking.status === 'cancelled') {
      return <Badge color="red">Cancelled</Badge>;
    }
    if (booking.status === 'modified') {
      return <Badge color="yellow">Modified</Badge>;
    }
    if (daysUntilVisit < 0) {
      return <Badge color="gray">Past</Badge>;
    }
    return <Badge color="green">Confirmed</Badge>;
  };

  const canModifyOrCancel = booking.status === 'confirmed' && daysUntilVisit > 0;

  return (
    <>
      <div className="booking-card">
        <div className="booking-card-image" onClick={() => navigate(`/properties/${property._id}`)}>
          <img src={property.image} alt={property.title} />
          <div className="booking-status-badge">{getStatusBadge()}</div>
        </div>
        
        <div className="booking-card-content">
          <div className="booking-header">
            <h3 className="booking-title" onClick={() => navigate(`/properties/${property._id}`)}>
              {property.title}
            </h3>
            <Text size="sm" color="dimmed">
              {property.address}, {property.city}
            </Text>
          </div>

          <Divider my="sm" />

          <div className="booking-details">
            <div className="booking-info-row">
              <Text weight={500}>Visit Date:</Text>
              <Text color={daysUntilVisit < 7 ? 'orange' : 'blue'} weight={600}>
                {dayjs(visitDate).format('MMM DD, YYYY')}
              </Text>
            </div>

            <div className="booking-info-row">
              <Text weight={500}>Booked On:</Text>
              <Text size="sm" color="dimmed">
                {dayjs(bookingDate).format('MMM DD, YYYY')}
              </Text>
            </div>

            {daysUntilVisit > 0 && (
              <div className="booking-info-row">
                <Text weight={500}>Days Until Visit:</Text>
                <Text color={daysUntilVisit < 7 ? 'red' : 'green'}>
                  {daysUntilVisit} days
                </Text>
              </div>
            )}

            {booking.status === 'modified' && booking.modificationHistory?.length > 0 && (
              <div className="booking-info-row">
                <Text weight={500} color="orange">
                  Modified {booking.modificationHistory.length} time(s)
                </Text>
              </div>
            )}

            {booking.status === 'cancelled' && (
              <div className="booking-info-row">
                <Text weight={500} color="red">
                  Cancelled on: {dayjs(booking.cancellationDate).format('MMM DD, YYYY')}
                </Text>
                {booking.cancellationCharge > 0 && (
                  <Text size="sm" color="red">
                    Cancellation charge: ${booking.cancellationCharge}
                  </Text>
                )}
              </div>
            )}
          </div>

          {canModifyOrCancel && (
            <>
              <Divider my="sm" />
              <Group position="apart" mt="md">
                <Button
                  variant="outline"
                  color="blue"
                  size="sm"
                  onClick={() => setModifyModalOpen(true)}
                >
                  Modify Date
                </Button>
                <Button
                  variant="outline"
                  color="red"
                  size="sm"
                  onClick={() => setCancelModalOpen(true)}
                >
                  Cancel Booking
                </Button>
              </Group>
            </>
          )}

          <div className="booking-pricing-info">
            <Text size="xs" color="dimmed" mt="md">
              💡 Cancellation Policy:
              <br />• Free cancellation 14+ days before visit
              <br />• $25 charge if cancelled 7-14 days before
              <br />• $50 charge if cancelled within 7 days
            </Text>
          </div>
        </div>
      </div>

      {/* Cancel Confirmation Modal */}
      <Modal
        opened={cancelModalOpen}
        onClose={() => setCancelModalOpen(false)}
        title="Cancel Booking"
        centered
      >
        <Text mb="md">Are you sure you want to cancel this booking?</Text>
        
        <div className="cancel-charges-info">
          <Text weight={500} mb="xs">
            Visit Date: {dayjs(visitDate).format('MMM DD, YYYY')}
          </Text>
          <Text weight={500} mb="xs">
            Days Until Visit: {daysUntilVisit} days
          </Text>
          {getCancellationCharge() > 0 ? (
            <Text color="red" weight={600} size="lg">
              Cancellation Charge: ${getCancellationCharge()}
            </Text>
          ) : (
            <Text color="green" weight={600}>
              ✓ Free Cancellation
            </Text>
          )}
        </div>

        <Group position="right" mt="xl">
          <Button variant="outline" onClick={() => setCancelModalOpen(false)}>
            Keep Booking
          </Button>
          <Button color="red" onClick={cancelBookingMutation} loading={isCancelling}>
            Confirm Cancellation
          </Button>
        </Group>
      </Modal>

      {/* Modify Date Modal */}
      <Modal
        opened={modifyModalOpen}
        onClose={() => {
          setModifyModalOpen(false);
          setNewDate(null);
        }}
        title="Modify Booking Date"
        centered
      >
        <Text mb="md">Select a new date for your visit:</Text>
        
        <div className="modify-info">
          <Text weight={500} mb="xs">
            Current Visit Date: {dayjs(visitDate).format('MMM DD, YYYY')}
          </Text>
          {getModificationCharge() > 0 ? (
            <Text color="orange" weight={600} mb="md">
              Modification Charge: ${getModificationCharge()}
            </Text>
          ) : (
            <Text color="green" weight={600} mb="md">
              ✓ Free Modification
            </Text>
          )}
        </div>

        <DatePicker
          value={newDate}
          onChange={setNewDate}
          minDate={new Date()}
          placeholder="Pick new date"
          fullWidth
        />

        <Text size="xs" color="dimmed" mt="md">
          💡 Modification Policy:
          <br />• Free modification 14+ days before visit
          <br />• $15 charge if modified 7-14 days before
          <br />• $30 charge if modified within 7 days
        </Text>

        <Group position="right" mt="xl">
          <Button
            variant="outline"
            onClick={() => {
              setModifyModalOpen(false);
              setNewDate(null);
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={modifyBookingMutation}
            disabled={!newDate}
            loading={isModifying}
          >
            Confirm New Date
          </Button>
        </Group>
      </Modal>
    </>
  );
};

export default BookingCard;
