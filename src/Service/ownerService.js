import {apiRequest} from './apiClient';
import {toLegacyBooking} from './bookingService';

// Venue management for owners (and admins, who can manage every venue).

export const getManagedVenues = () => apiRequest('/api/v1/owner/venues');

export const getManagedVenue = venueId =>
  apiRequest(`/api/v1/owner/venues/${venueId}`);

export const updateVenueSettings = (venueId, settings) =>
  apiRequest(`/api/v1/owner/venues/${venueId}`, {
    method: 'PATCH',
    body: settings,
  });

export const upsertVenueSport = (
  venueId,
  sportSlug,
  {hourlyRate, courtCount},
) =>
  apiRequest(
    `/api/v1/owner/venues/${venueId}/sports/${encodeURIComponent(sportSlug)}`,
    {method: 'PUT', body: {hourlyRate, courtCount}},
  );

export const getVenueBookings = async venueId => {
  const bookings = await apiRequest(`/api/v1/owner/venues/${venueId}/bookings`);
  return bookings.map(toLegacyBooking);
};

export const confirmPayment = async bookingId =>
  toLegacyBooking(
    await apiRequest(`/api/v1/owner/bookings/${bookingId}/confirm-payment`, {
      method: 'PATCH',
    }),
  );

export const rejectPayment = async (bookingId, reason) =>
  toLegacyBooking(
    await apiRequest(`/api/v1/owner/bookings/${bookingId}/reject-payment`, {
      method: 'PATCH',
      body: {reason},
    }),
  );

// Admin only. An empty email removes the current owner.
export const assignVenueOwner = (venueId, email) =>
  apiRequest(`/api/v1/admin/venues/${venueId}/owner`, {
    method: 'PUT',
    body: {email: email || null},
  });
