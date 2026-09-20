import {apiRequest} from './apiClient';
import {API_BASE_URL} from '../Config/api';

const resolveImageUrl = imageUrl =>
  imageUrl?.startsWith('/') ? `${API_BASE_URL}${imageUrl}` : imageUrl;

export const ACTIVE_BOOKING_STATUSES = [
  'PENDING_PAYMENT',
  'WAITING_CONFIRMATION',
  'CONFIRMED',
];

export const BOOKING_STATUS_LABELS = {
  PENDING_PAYMENT: 'Awaiting payment',
  WAITING_CONFIRMATION: 'Payment in review',
  CONFIRMED: 'Confirmed',
  CANCELLED: 'Cancelled',
  EXPIRED: 'Expired',
};

export const isActiveBooking = booking =>
  ACTIVE_BOOKING_STATUSES.includes(booking.status);

const toSeconds = value => Math.floor(Date.parse(value) / 1000);

// Maps the backend booking DTO to the keys the screens use. `start_at`/`end_at`
// keep the venue's +07:00 offset; format them with Utils/VenueTime.
export const toLegacyBooking = booking => {
  const venue = booking.venue;
  return {
    id: booking.id,
    duration: booking.durationHours,
    start_at: booking.startAt,
    end_at: booking.endAt,
    order_time: {seconds: toSeconds(booking.startAt)},
    end_time: {seconds: toSeconds(booking.endAt)},
    location_name: venue.name,
    location_address: venue.address,
    location_map: venue.coordinates,
    image_url: resolveImageUrl(venue.imageUrl) || undefined,
    phone: venue.phone || undefined,
    category: venue.category,
    hourly_rate: Number(booking.hourlyRate),
    total_price: Number(booking.totalPrice),
    status: booking.status,
    court_name: booking.courtName,
    venue_id: venue.id,
    created_at: booking.createdAt,
    payment_deadline: booking.paymentDeadline,
    payment_account: booking.paymentAccount || null,
    payment_submitted_at: booking.paymentSubmittedAt,
    payer_name: booking.payerName,
    payer_bank: booking.payerBank,
    payment_reference: booking.paymentReference,
    payment_confirmed_at: booking.paymentConfirmedAt,
    cancelled_at: booking.cancelledAt,
    cancelled_by: booking.cancelledBy,
    cancellation_reason: booking.cancellationReason,
    cancellable: Boolean(booking.cancellable),
    cancellable_until: booking.cancellableUntil,
    refund_required: Boolean(booking.refundRequired),
    customer: booking.customer || null,
  };
};

export const getMyBookings = async () => {
  const bookings = await apiRequest('/api/v1/bookings/me');
  return bookings.map(toLegacyBooking);
};

export const getBooking = async bookingId =>
  toLegacyBooking(await apiRequest(`/api/v1/bookings/${bookingId}`));

export const createBooking = async ({
  venueId,
  sportSlug,
  startAt,
  durationHours,
}) => {
  const booking = await apiRequest('/api/v1/bookings', {
    method: 'POST',
    body: {venueId, sportSlug, startAt, durationHours},
  });
  return toLegacyBooking(booking);
};

export const submitPayment = async (
  bookingId,
  {payerName, payerBank, paymentReference},
) => {
  const booking = await apiRequest(`/api/v1/bookings/${bookingId}/payment`, {
    method: 'POST',
    body: {payerName, payerBank, paymentReference},
  });
  return toLegacyBooking(booking);
};

export const cancelBooking = async bookingId => {
  const booking = await apiRequest(`/api/v1/bookings/${bookingId}/cancel`, {
    method: 'PATCH',
  });
  return toLegacyBooking(booking);
};
