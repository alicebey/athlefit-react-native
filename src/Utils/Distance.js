import {haversineDistance} from './Haversine';

export const NEARBY_RADIUS_KM = 25;

export const hasCoordinates = coordinates =>
  Number.isFinite(Number(coordinates?.latitude)) &&
  Number.isFinite(Number(coordinates?.longitude)) &&
  !(Number(coordinates.latitude) === 0 && Number(coordinates.longitude) === 0);

export const toLatLng = coordinates => ({
  latitude: Number(coordinates.latitude),
  longitude: Number(coordinates.longitude),
});

// "850 m", "2.4 km", "2,780 km"
export const formatDistance = km => {
  if (!Number.isFinite(km)) {
    return '';
  }
  if (km < 1) {
    return `${Math.max(10, Math.round((km * 1000) / 10) * 10)} m`;
  }
  if (km < 100) {
    return `${km.toFixed(1)} km`;
  }
  return `${Math.round(km).toLocaleString('en-US')} km`;
};

// Venues sorted nearest-first, each with `distance_km` (null without a location).
export const withDistances = (venues, origin) =>
  venues
    .filter(venue => hasCoordinates(venue.location_map))
    .map(venue => ({
      ...venue,
      distance_km: hasCoordinates(origin)
        ? haversineDistance(toLatLng(origin), toLatLng(venue.location_map))
        : null,
    }))
    .sort((a, b) => {
      if (a.distance_km === null || b.distance_km === null) {
        return a.location_name.localeCompare(b.location_name);
      }
      return a.distance_km - b.distance_km;
    });
