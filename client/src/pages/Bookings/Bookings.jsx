import React, { useContext, useState } from "react";
import { PuffLoader } from "react-spinners";
import "../Properties/Properties.css";
import UserDetailContext from "../../context/UserDetailContext";
import useBookings from "../../hooks/useBookings";
import BookingCard from "../../components/BookingCard/BookingCard";
import { Text, Container } from "@mantine/core";

const Bookings = () => {
  const { data: bookings, isError, isLoading, refetch } = useBookings();
  const {
    userDetails: { token },
  } = useContext(UserDetailContext);

  if (isError) {
    return (
      <div className="wrapper">
        <div className="flexCenter paddings">
          <span>Error while fetching bookings</span>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="wrapper flexCenter" style={{ height: "60vh" }}>
        <PuffLoader
          height="80"
          width="80"
          radius={1}
          color="#4066ff"
          aria-label="puff-loading"
        />
      </div>
    );
  }

  // Filter out cancelled bookings or show all based on preference
  const activeBookings = bookings?.filter(b => b.status !== 'cancelled') || [];
  const cancelledBookings = bookings?.filter(b => b.status === 'cancelled') || [];

  return (
    <div className="wrapper">
      <Container size="xl" className="paddings">
        <div style={{ marginBottom: '2rem' }}>
          <h1 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>My Bookings</h1>
          <Text color="dimmed">
            Manage your property visit bookings - modify dates or cancel as needed
          </Text>
        </div>

        {activeBookings.length === 0 && cancelledBookings.length === 0 ? (
          <div className="flexCenter" style={{ padding: '3rem 0' }}>
            <div style={{ textAlign: 'center' }}>
              <Text size="xl" weight={500} mb="sm">No bookings yet</Text>
              <Text color="dimmed">Start exploring properties and book your visits!</Text>
            </div>
          </div>
        ) : (
          <>
            {activeBookings.length > 0 && (
              <>
                <h2 style={{ fontSize: '1.5rem', marginTop: '2rem', marginBottom: '1rem' }}>
                  Active Bookings ({activeBookings.length})
                </h2>
                <div className="paddings flexCenter properties" style={{ 
                  display: 'flex', 
                  flexWrap: 'wrap',
                  gap: '1rem',
                  justifyContent: 'flex-start'
                }}>
                  {activeBookings.map((booking, i) => (
                    <BookingCard 
                      key={booking._id || i} 
                      booking={booking} 
                      token={token}
                      refetch={refetch}
                    />
                  ))}
                </div>
              </>
            )}

            {cancelledBookings.length > 0 && (
              <>
                <h2 style={{ 
                  fontSize: '1.5rem', 
                  marginTop: '3rem', 
                  marginBottom: '1rem',
                  color: '#868e96'
                }}>
                  Cancelled Bookings ({cancelledBookings.length})
                </h2>
                <div className="paddings flexCenter properties" style={{ 
                  display: 'flex', 
                  flexWrap: 'wrap',
                  gap: '1rem',
                  justifyContent: 'flex-start',
                  opacity: 0.7
                }}>
                  {cancelledBookings.map((booking, i) => (
                    <BookingCard 
                      key={booking._id || i} 
                      booking={booking} 
                      token={token}
                      refetch={refetch}
                    />
                  ))}
                </div>
              </>
            )}
          </>
        )}
      </Container>
    </div>
  );
};

export default Bookings;
