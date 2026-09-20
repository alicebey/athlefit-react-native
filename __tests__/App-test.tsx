import {apiRequest} from '../src/Service/apiClient';
import {cancelBooking, createBooking} from '../src/Service/bookingService';
import {getVenues} from '../src/Service/venueService';
import {
  getAdminStatus,
  publishGeoapifyVenue,
  searchGeoapifyPlaces,
  validateVenueDraft,
} from '../src/Service/adminVenueService';

jest.mock('../src/Service/apiClient', () => ({
  apiRequest: jest.fn(),
}));

beforeEach(() => {
  apiRequest.mockReset();
});

it('maps a backend venue to the existing screen data shape', async () => {
  apiRequest.mockResolvedValue([
    {
      id: 'venue-1',
      category: 'badminton',
      name: 'Smash Arena',
      address: 'Jakarta',
      coordinates: {latitude: -6.2, longitude: 106.8},
      rating: 4.7,
      imageUrl: null,
      phone: null,
      openDays: ['Monday'],
      openTime: '08:00',
      closeTime: '22:00',
      hourlyRate: 60000,
      courtCount: 4,
      source: 'MANUAL',
      providerAttribution: null,
      providerAttributionUri: null,
      dataAttribution: null,
      dataAttributionUri: null,
    },
  ]);

  const venues = await getVenues('badminton');

  expect(apiRequest).toHaveBeenCalledWith('/api/v1/venues?category=badminton', {
    authenticated: false,
  });
  expect(venues[0]).toMatchObject({
    id: 'venue-1',
    location_name: 'Smash Arena',
    location_map: {latitude: -6.2, longitude: 106.8},
    hourly_rate: 60000,
    court_count: 4,
  });
});

it('sends the selected sport when creating a booking', async () => {
  apiRequest.mockResolvedValue({
    id: 'booking-1',
    durationHours: 1,
    startAt: '2026-09-01T03:00:00Z',
    totalPrice: 60000,
    status: 'CONFIRMED',
    venue: {
      id: 'venue-1',
      name: 'Smash Arena',
      address: 'Jakarta',
      coordinates: {latitude: -6.2, longitude: 106.8},
    },
  });

  await createBooking({
    venueId: 'venue-1',
    sportSlug: 'badminton',
    startAt: '2026-09-01T03:00:00Z',
    durationHours: 1,
  });

  expect(apiRequest).toHaveBeenCalledWith('/api/v1/bookings', {
    method: 'POST',
    body: {
      venueId: 'venue-1',
      sportSlug: 'badminton',
      startAt: '2026-09-01T03:00:00Z',
      durationHours: 1,
    },
  });
});

it('cancels the owned booking through the backend', async () => {
  apiRequest.mockResolvedValue({
    id: 'booking-1',
    durationHours: 1,
    startAt: '2026-09-01T03:00:00Z',
    endAt: '2026-09-01T04:00:00Z',
    totalPrice: 60000,
    status: 'CANCELLED',
    venue: {
      id: 'venue-1',
      name: 'Smash Arena',
      address: 'Jakarta',
      coordinates: {latitude: -6.2, longitude: 106.8},
    },
  });

  const booking = await cancelBooking('booking-1');

  expect(apiRequest).toHaveBeenCalledWith('/api/v1/bookings/booking-1/cancel', {
    method: 'PATCH',
  });
  expect(booking.status).toBe('CANCELLED');
});

it('uses authenticated admin endpoints for venue onboarding', async () => {
  apiRequest.mockResolvedValueOnce({admin: true}).mockResolvedValueOnce([]);

  await getAdminStatus();
  await searchGeoapifyPlaces('futsal jakarta');
  const request = {
    geoapifyPlaceId: 'place-id',
    scheduleOverride: {
      openDays: ['MONDAY'],
      openTime: '08:00',
      closeTime: '22:00',
    },
    sports: [{sportSlug: 'futsal', hourlyRate: 100000, courtCount: 2}],
  };
  await publishGeoapifyVenue(request);

  expect(apiRequest).toHaveBeenNthCalledWith(1, '/api/v1/admin/status');
  expect(apiRequest).toHaveBeenNthCalledWith(
    2,
    '/api/v1/admin/geoapify-places/search?query=futsal%20jakarta',
  );
  expect(apiRequest).toHaveBeenNthCalledWith(3, '/api/v1/admin/venues', {
    method: 'POST',
    body: request,
  });
});

it('rejects an invalid venue schedule before publishing', () => {
  expect(
    validateVenueDraft({
      sports: [{hourlyRate: 100000, courtCount: 2}],
      openDays: ['MONDAY'],
      openTime: '22:00',
      closeTime: '08:00',
    }),
  ).toBe('Select opening days and use valid HH:mm operating hours.');
});
