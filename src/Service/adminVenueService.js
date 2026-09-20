import {apiRequest} from './apiClient';

const TIME_PATTERN = /^([01]\d|2[0-3]):[0-5]\d$/;

export const getAdminStatus = () => apiRequest('/api/v1/admin/status');

export const searchGeoapifyPlaces = query =>
  apiRequest(
    `/api/v1/admin/geoapify-places/search?query=${encodeURIComponent(query)}`,
  );

export const publishGeoapifyVenue = venue =>
  apiRequest('/api/v1/admin/venues', {
    method: 'POST',
    body: venue,
  });

export const validateVenueDraft = ({sports, openDays, openTime, closeTime}) => {
  if (sports.length === 0) {
    return 'Select at least one sport.';
  }
  if (
    sports.some(
      sport =>
        !Number.isFinite(sport.hourlyRate) ||
        sport.hourlyRate < 1 ||
        !Number.isInteger(sport.courtCount) ||
        sport.courtCount < 1 ||
        sport.courtCount > 50,
    )
  ) {
    return 'Every sport needs a valid price and 1–50 courts.';
  }
  if (
    openDays.length === 0 ||
    !TIME_PATTERN.test(openTime) ||
    !TIME_PATTERN.test(closeTime) ||
    closeTime <= openTime
  ) {
    return 'Select opening days and use valid HH:mm operating hours.';
  }
  return null;
};
