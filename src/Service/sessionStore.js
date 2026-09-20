import produce from 'immer';
import {create} from 'zustand';
import {persist, createJSONStorage} from 'zustand/middleware';
import MMKVStoragePersistHelper from '../Storage/MMKVStoragePersistHelper';

const initialState = {
  isLogin: false,
  username: '',
  category: '',
  phone: '',
  email: '',
  user_id: null,
  location: {
    latitude: 0,
    longitude: 0,
  },
};

// Middleware for keeping user sessioon
export const useSessionStore = create(
  persist(
    (get, set, store) => ({
      ...initialState,
      login: params =>
        store.setState(
          produce(state => {
            state.isLogin = true;
            state.username = params.username;
            state.phone = params.phone;
            state.email = params.email;
            state.user_id = params.id;
          }),
        ),
      clearSession: () =>
        store.setState(
          produce(state => {
            state.isLogin = initialState.isLogin;
            state.username = initialState.username;
            state.category = initialState.category;
            state.phone = initialState.phone;
            state.email = initialState.email;
            state.user_id = initialState.user_id;
          }),
        ),
      setCategory: category =>
        store.setState(
          produce(state => {
            state.category = category;
          }),
        ),
      logout: () =>
        store.setState(
          produce(state => {
            state.isLogin = false;
          }),
        ),
      setLocation: coord =>
        store.setState(
          produce(state => {
            state.location = coord;
          }),
        ),
      setUsername: name =>
        store.setState(
          produce(state => {
            state.username = name;
          }),
        ),
    }),
    {
      name: 'session-store',
      version: 1,
      storage: createJSONStorage(() => new MMKVStoragePersistHelper('session')),
    },
  ),
);
