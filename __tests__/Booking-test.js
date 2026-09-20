import React from 'react';
import {Alert} from 'react-native';
import renderer, {act} from 'react-test-renderer';
import {apiRequest} from '../src/Service/apiClient';
import {
  offersSport,
  toLegacyVenue,
  withPrimarySport,
} from '../src/Service/venueService';
import {submitPayment, toLegacyBooking} from '../src/Service/bookingService';
import {
  assignVenueOwner,
  confirmPayment,
  upsertVenueSport,
} from '../src/Service/ownerService';
import {formatVenueTime, timeRemaining} from '../src/Utils/VenueTime';
import OrderField from '../src/Screen/OrderField';
import DetailOrder from '../src/Screen/DetailOrder';
import BookingsTab from '../src/Screen/OwnerVenue/BookingsTab';

const mockReplace = jest.fn();
const mockGoBack = jest.fn();

jest.mock('../src/Service/apiClient', () => ({apiRequest: jest.fn()}));
jest.mock('@react-navigation/native', () => ({
  useNavigation: () => ({
    replace: mockReplace,
    goBack: mockGoBack,
    navigate: jest.fn(),
  }),
  useFocusEffect: jest.fn(),
}));
jest.mock('react-native-safe-area-context', () => ({
  SafeAreaView: 'SafeAreaView',
}));
jest.mock('../src/Service/sessionStore', () => ({
  useSessionStore: () => ({username: 'Eki'}),
}));
jest.mock('react-native-vector-icons/MaterialIcons', () => 'Icon');
jest.mock('../src/Component/Text', () => 'Text');
jest.mock('../src/Component/Button', () => 'Button');
jest.mock('../src/Component/Input', () => 'Input');
jest.mock('../src/Component/Image', () => 'Image');

const venueDto = {
  id: 'venue-1',
  category: 'badminton',
  name: 'Smash Arena',
  address: 'Jakarta',
  coordinates: {latitude: -6.2, longitude: 106.8},
  rating: 4.7,
  openDays: ['Monday'],
  openTime: '08:00',
  closeTime: '22:00',
  hourlyRate: 60000,
  courtCount: 2,
  source: 'MANUAL',
  sports: [
    {slug: 'badminton', name: 'Badminton', hourlyRate: 60000, courtCount: 2},
    {slug: 'futsal', name: 'Futsal', hourlyRate: 150000, courtCount: 1},
  ],
};

const bookingDto = (overrides = {}) => ({
  id: 'booking-1',
  durationHours: 2,
  startAt: '2026-09-01T10:00:00+07:00',
  endAt: '2026-09-01T12:00:00+07:00',
  hourlyRate: 60000,
  totalPrice: 120000,
  status: 'PENDING_PAYMENT',
  courtName: 'Court 1',
  venue: venueDto,
  paymentDeadline: '2099-01-01T00:30:00+07:00',
  paymentAccount: {
    bankName: 'BCA',
    accountNumber: '123',
    accountHolder: 'Smash Arena',
  },
  cancellable: true,
  cancellableUntil: '2026-09-01T10:00:00+07:00',
  refundRequired: false,
  customer: {fullName: 'Eki', email: 'eki@example.com', phone: null},
  ...overrides,
});

const flush = () => act(async () => {});

beforeEach(() => {
  apiRequest.mockReset();
  mockReplace.mockReset();
});

describe('venue time', () => {
  it('formats in Jakarta time whatever offset the timestamp uses', () => {
    expect(formatVenueTime('2026-09-01T10:00:00+07:00')).toBe('10:00');
    expect(formatVenueTime('2026-09-01T03:00:00Z')).toBe('10:00');
    expect(formatVenueTime('2026-09-01T23:30:00Z', 'DD MMM HH:mm')).toBe(
      '02 Sep 06:30',
    );
  });

  it('reports remaining payment time and null once it passed', () => {
    const now = Date.parse('2026-09-01T03:00:00Z');
    expect(timeRemaining('2026-09-01T10:25:00+07:00', now)).toBe('25 min');
    expect(timeRemaining('2026-09-01T09:00:00+07:00', now)).toBeNull();
  });
});

describe('services', () => {
  it('keeps every sport a venue offers and can switch its primary sport', () => {
    const venue = toLegacyVenue(venueDto);

    expect(venue.sports.map(sport => sport.slug)).toEqual([
      'badminton',
      'futsal',
    ]);
    expect(offersSport(venue, 'futsal')).toBe(true);
    expect(offersSport(venue, 'golf')).toBe(false);
    expect(withPrimarySport(venue, 'futsal')).toMatchObject({
      category: 'futsal',
      hourly_rate: 150000,
      court_count: 1,
    });
  });

  it('maps payment details and sends transfer confirmation', async () => {
    apiRequest.mockResolvedValue(
      bookingDto({status: 'WAITING_CONFIRMATION', payerName: 'Eki'}),
    );

    const booking = await submitPayment('booking-1', {
      payerName: 'Eki',
      payerBank: 'BCA',
      paymentReference: null,
    });

    expect(apiRequest).toHaveBeenCalledWith(
      '/api/v1/bookings/booking-1/payment',
      {
        method: 'POST',
        body: {payerName: 'Eki', payerBank: 'BCA', paymentReference: null},
      },
    );
    expect(booking).toMatchObject({
      status: 'WAITING_CONFIRMATION',
      start_at: '2026-09-01T10:00:00+07:00',
      payment_account: {accountNumber: '123'},
      payer_name: 'Eki',
    });
  });

  it('uses owner endpoints for payments, sports and ownership', async () => {
    apiRequest
      .mockResolvedValueOnce(bookingDto({status: 'CONFIRMED'}))
      .mockResolvedValueOnce({})
      .mockResolvedValueOnce({});

    await confirmPayment('booking-1');
    await upsertVenueSport('venue-1', 'futsal', {
      hourlyRate: 90000,
      courtCount: 3,
    });
    await assignVenueOwner('venue-1', '');

    expect(apiRequest).toHaveBeenNthCalledWith(
      1,
      '/api/v1/owner/bookings/booking-1/confirm-payment',
      {method: 'PATCH'},
    );
    expect(apiRequest).toHaveBeenNthCalledWith(
      2,
      '/api/v1/owner/venues/venue-1/sports/futsal',
      {method: 'PUT', body: {hourlyRate: 90000, courtCount: 3}},
    );
    expect(apiRequest).toHaveBeenNthCalledWith(
      3,
      '/api/v1/admin/venues/venue-1/owner',
      {method: 'PUT', body: {email: null}},
    );
  });
});

describe('booking a slot', () => {
  it('books the exact start time returned by the availability endpoint', async () => {
    const slot = {
      startAt: '2026-09-01T11:00:00+07:00',
      endAt: '2026-09-01T12:00:00+07:00',
      startTime: '11:00',
      endTime: '12:00',
      availableCourts: 2,
      status: 'AVAILABLE',
    };
    apiRequest.mockImplementation(path =>
      Promise.resolve(
        path.startsWith('/api/v1/venues/')
          ? {
              open: true,
              openTime: '08:00',
              closeTime: '22:00',
              hourlyRate: 60000,
              slots: [
                {...slot, startAt: 'past', startTime: '08:00', status: 'PAST'},
                slot,
              ],
            }
          : bookingDto(),
      ),
    );
    const location = toLegacyVenue(venueDto);
    let screen;
    await act(async () => {
      screen = renderer.create(
        <OrderField route={{params: {location, sport: 'badminton'}}} />,
      );
    });
    await flush();

    expect(apiRequest.mock.calls[0][0]).toMatch(
      /^\/api\/v1\/venues\/venue-1\/availability\?sport=badminton&date=\d{4}-\d{2}-\d{2}&durationHours=1$/,
    );
    const passed = screen.root.findByProps({
      accessibilityLabel: '08:00 to 12:00, Passed',
    });
    expect(passed.props.disabled).toBe(true);

    act(() => {
      screen.root
        .findByProps({accessibilityLabel: '11:00 to 12:00, 2 courts left'})
        .props.onPress();
    });
    await act(async () => {
      await screen.root.findByProps({title: 'Reserve & pay'}).props.onPress();
    });

    expect(apiRequest).toHaveBeenLastCalledWith('/api/v1/bookings', {
      method: 'POST',
      body: {
        venueId: 'venue-1',
        sportSlug: 'badminton',
        startAt: '2026-09-01T11:00:00+07:00',
        durationHours: 1,
      },
    });
    expect(mockReplace).toHaveBeenCalledWith(
      'Detail Order',
      expect.objectContaining({justBooked: true}),
    );
  });
});

describe('paying for a booking', () => {
  it('shows transfer details and submits the payer information', async () => {
    const booking = toLegacyBooking(bookingDto());
    apiRequest.mockResolvedValue(bookingDto({status: 'WAITING_CONFIRMATION'}));
    let screen;
    await act(async () => {
      screen = renderer.create(
        <DetailOrder route={{params: {data: booking}}} />,
      );
    });

    expect(
      screen.root.findAll(node => node.props.value === '123').length,
    ).toBeGreaterThan(0);

    act(() => {
      screen.root.findByProps({title: 'Your bank'}).props.onChangeText('BCA');
    });
    await act(async () => {
      await screen.root
        .findByProps({title: "I've transferred the payment"})
        .props.onPress();
    });

    expect(apiRequest).toHaveBeenCalledWith(
      '/api/v1/bookings/booking-1/payment',
      {
        method: 'POST',
        body: {payerName: 'Eki', payerBank: 'BCA', paymentReference: null},
      },
    );
    expect(
      screen.root.findAllByProps({title: "I've transferred the payment"}),
    ).toHaveLength(0);
  });
});

describe('owner review', () => {
  it('confirms a submitted payment after the owner double-checks', async () => {
    const alertSpy = jest.spyOn(Alert, 'alert').mockImplementation(() => {});
    const waiting = toLegacyBooking(
      bookingDto({
        status: 'WAITING_CONFIRMATION',
        paymentSubmittedAt: '2026-09-01T09:00:00+07:00',
        payerName: 'Eki',
        payerBank: 'BCA',
      }),
    );
    const onUpdated = jest.fn();
    apiRequest.mockResolvedValue(bookingDto({status: 'CONFIRMED'}));
    const screen = renderer.create(
      <BookingsTab
        bookings={[waiting]}
        loading={false}
        onRefresh={jest.fn()}
        onBookingUpdated={onUpdated}
      />,
    );

    act(() => {
      screen.root.findByProps({title: 'Confirm payment'}).props.onPress();
    });
    const buttons = alertSpy.mock.calls[0][2];
    await act(async () => {
      await buttons[1].onPress();
    });

    expect(apiRequest).toHaveBeenCalledWith(
      '/api/v1/owner/bookings/booking-1/confirm-payment',
      {method: 'PATCH'},
    );
    expect(onUpdated).toHaveBeenCalledWith(
      expect.objectContaining({status: 'CONFIRMED'}),
    );
    alertSpy.mockRestore();
  });
});
