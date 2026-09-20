import {apiRequest} from './apiClient';
import {API_BASE_URL} from '../Config/api';

const resolveImageUrl = imageUrl => {
  if (!imageUrl) {
    return undefined;
  }
  return imageUrl.startsWith('/') ? `${API_BASE_URL}${imageUrl}` : imageUrl;
};

const toSportOffering = sport => ({
  slug: sport.slug,
  name: sport.name,
  hourly_rate: Number(sport.hourlyRate),
  court_count: sport.courtCount,
});

// Maps the backend venue DTO to the field names the screens were built with.
// `category`, `hourly_rate` and `court_count` describe the venue's primary
// sport; `sports` lists every sport the venue offers.
export const toLegacyVenue = venue => ({
  id: venue.id,
  category: venue.category,
  location_name: venue.name,
  location_address: venue.address,
  location_map: venue.coordinates,
  rating: Number(venue.rating || 0),
  image_url: resolveImageUrl(venue.imageUrl),
  phone: venue.phone || undefined,
  open_day: venue.openDays,
  open_time: venue.openTime,
  close_time: venue.closeTime,
  hourly_rate: Number(venue.hourlyRate),
  court_count: venue.courtCount,
  sports: (venue.sports?.length
    ? venue.sports
    : [
        {
          slug: venue.category,
          name: venue.category,
          hourlyRate: venue.hourlyRate,
          courtCount: venue.courtCount,
        },
      ]
  ).map(toSportOffering),
  source: venue.source,
  provider_attribution: venue.providerAttribution || undefined,
  provider_attribution_url: venue.providerAttributionUri || undefined,
  data_attribution: venue.dataAttribution || undefined,
  data_attribution_url: venue.dataAttributionUri || undefined,
});

// Returns a copy of the venue whose primary sport is `slug`, if it offers it.
export const withPrimarySport = (venue, slug) => {
  const sport = venue.sports?.find(item => item.slug === slug);
  if (!sport) {
    return venue;
  }
  return {
    ...venue,
    category: sport.slug,
    hourly_rate: sport.hourly_rate,
    court_count: sport.court_count,
  };
};

export const offersSport = (venue, slug) =>
  Boolean(venue.sports?.some(item => item.slug === slug));

export const getVenues = async category => {
  const query = category ? `?category=${encodeURIComponent(category)}` : '';
  const venues = await apiRequest(`/api/v1/venues${query}`, {
    authenticated: false,
  });
  return venues.map(toLegacyVenue);
};

export const getSports = async () => {
  const sports = await apiRequest('/api/v1/sports', {authenticated: false});
  return sports.map(sport => ({slug: sport.slug, name: sport.name}));
};

// Bookable start times for one venue sport on a Jakarta-local date (YYYY-MM-DD).
export const getVenueAvailability = ({venueId, sport, date, durationHours}) =>
  apiRequest(
    `/api/v1/venues/${venueId}/availability?sport=${encodeURIComponent(
      sport,
    )}&date=${date}&durationHours=${durationHours}`,
    {authenticated: false},
  );
