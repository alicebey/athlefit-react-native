// Sport photos shown when a venue has no photo of its own yet.
const SPORT_PHOTOS = {
  badminton: require('../Assets/Badminton.png'),
  basketball: require('../Assets/Basketball.png'),
  billiard: require('../Assets/Billiard.png'),
  futsal: require('../Assets/Futsal.png'),
  golf: require('../Assets/Golf.png'),
  soccer: require('../Assets/Soccer.png'),
  tennis: require('../Assets/Tennis.png'),
};
const DEFAULT_PHOTO = require('../Assets/field.png');

export const sportPhoto = slug =>
  SPORT_PHOTOS[(slug || '').toLowerCase()] || DEFAULT_PHOTO;

// Image source for a venue or booking: its own photo, else a photo of its sport.
export const venueImageSource = (item, sportSlug) => {
  if (item?.image_url) {
    return {uri: item.image_url};
  }
  return sportPhoto(sportSlug || item?.category || item?.sports?.[0]?.slug);
};
