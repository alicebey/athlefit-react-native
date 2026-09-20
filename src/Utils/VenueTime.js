import moment from 'moment';

// All venues run on Jakarta time (UTC+7). The backend returns timestamps with a
// +07:00 offset, so we keep that offset when formatting instead of converting to
// the phone's own time zone (an emulator set to another zone would otherwise
// show the wrong hour).
export const VENUE_UTC_OFFSET_MINUTES = 7 * 60;
export const VENUE_TIME_ZONE_LABEL = 'WIB';

export const venueMoment = value => {
  if (!value) {
    return null;
  }
  const parsed = moment.parseZone(value);
  return parsed.isValid() ? parsed.utcOffset(VENUE_UTC_OFFSET_MINUTES) : null;
};

export const formatVenueTime = (value, pattern = 'HH:mm') => {
  const parsed = venueMoment(value);
  return parsed ? parsed.format(pattern) : '—';
};

export const venueNow = () => moment().utcOffset(VENUE_UTC_OFFSET_MINUTES);

// Returns the next `count` venue-local dates as YYYY-MM-DD strings.
export const upcomingVenueDates = (count = 14) => {
  const today = venueNow().startOf('day');
  return Array.from({length: count}, (_, index) =>
    today.clone().add(index, 'days').format('YYYY-MM-DD'),
  );
};

export const formatDuration = hours =>
  `${hours} ${Number(hours) === 1 ? 'hour' : 'hours'}`;

// "12 min" / "1 h 5 min" until the given timestamp, or null once it passed.
export const timeRemaining = (value, now = Date.now()) => {
  const target = venueMoment(value);
  if (!target) {
    return null;
  }
  const minutes = Math.ceil((target.valueOf() - now) / 60000);
  if (minutes <= 0) {
    return null;
  }
  const hours = Math.floor(minutes / 60);
  const rest = minutes % 60;
  return hours > 0 ? `${hours} h ${rest} min` : `${rest} min`;
};
