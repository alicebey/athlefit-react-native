import {
  formatDistance,
  hasCoordinates,
  withDistances,
} from '../src/Utils/Distance';

const venue = (id, latitude, longitude) => ({
  id,
  location_name: id,
  location_map: {latitude, longitude},
});

it('sorts venues nearest first from the user location', () => {
  const kemang = venue('Kemang', -6.2607, 106.8164);
  const senayan = venue('Senayan', -6.2186, 106.8026);
  const origin = {latitude: -6.2615, longitude: 106.81};

  const result = withDistances([senayan, kemang], origin);

  expect(result.map(item => item.id)).toEqual(['Kemang', 'Senayan']);
  expect(result[0].distance_km).toBeLessThan(1);
});

it('keeps venues without a user location, ordered by name', () => {
  const result = withDistances(
    [venue('B', -6.2, 106.8), venue('A', -6.3, 106.9), venue('X', 0, 0)],
    null,
  );

  expect(result.map(item => item.id)).toEqual(['A', 'B']);
  expect(result[0].distance_km).toBeNull();
});

it('formats distances for people', () => {
  expect(formatDistance(0.846)).toBe('850 m');
  expect(formatDistance(2.44)).toBe('2.4 km');
  expect(formatDistance(2779.6)).toBe('2,780 km');
  expect(hasCoordinates({latitude: 0, longitude: 0})).toBe(false);
});
