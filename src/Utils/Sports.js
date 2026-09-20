import {useEffect, useState} from 'react';
import {getSports} from '../Service/venueService';

const FALLBACK_ICON = require('../Assets/field.png');

export const SPORT_ICONS = {
  badminton: require('../Assets/Icon-Badminton.png'),
  futsal: require('../Assets/Icon-Futsal.png'),
  basketball: require('../Assets/Icon-Basketball.png'),
  soccer: require('../Assets/Icon-Soccer.png'),
  tennis: require('../Assets/Icon-Tennis.png'),
  golf: require('../Assets/Icon-Golf.png'),
  billiard: require('../Assets/Icon-Billiard.png'),
  swimming: require('../Assets/Icon-Swimming.png'),
};

// Mirrors the sports seeded by the backend; used until /api/v1/sports responds.
export const DEFAULT_SPORTS = [
  {slug: 'badminton', name: 'Badminton'},
  {slug: 'basketball', name: 'Basketball'},
  {slug: 'billiard', name: 'Billiard'},
  {slug: 'futsal', name: 'Futsal'},
  {slug: 'golf', name: 'Golf'},
  {slug: 'soccer', name: 'Soccer'},
  {slug: 'tennis', name: 'Tennis'},
];

export const toSportSlug = value => (value || '').trim().toLowerCase();

export const withSportIcon = sport => ({
  ...sport,
  icon: SPORT_ICONS[sport.slug] || FALLBACK_ICON,
});

// Sports offered by the backend, so the app never shows a category without venues.
export const useSports = () => {
  const [sports, setSports] = useState(DEFAULT_SPORTS.map(withSportIcon));

  useEffect(() => {
    let active = true;
    getSports()
      .then(result => {
        if (active && result.length) {
          setSports(result.map(withSportIcon));
        }
      })
      .catch(error => console.log(error, 'error loading sports'));
    return () => {
      active = false;
    };
  }, []);

  return sports;
};
