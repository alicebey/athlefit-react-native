import {apiRequest} from './apiClient';

const toSessionUser = user => ({
  id: user.id,
  username: user.fullName,
  phone: user.phone || '',
  email: user.email,
  category: user.favoriteSport || '',
});

export const getCurrentUser = async () => {
  const user = await apiRequest('/api/v1/users/me');
  return toSessionUser(user);
};

export const updateCurrentUser = async profile => {
  const user = await apiRequest('/api/v1/users/me', {
    method: 'PATCH',
    body: profile,
  });
  return toSessionUser(user);
};
