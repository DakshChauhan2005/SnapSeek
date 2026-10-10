import axios from 'axios';
import { store } from '../app/app.store';
import { setUser } from '../features/auth/auth.slice';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000',
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Session was invalidated (e.g. logged in elsewhere). Just clear the user in state;
    // <Protected> reacts and redirects to /login. No hard redirect, so public pages
    // like /register, /terms and /verify-email are never hijacked.
    if (
      error.response?.status === 401 &&
      error.response?.data?.err === "Device mismatch" &&
      store.getState().auth.user
    ) {
      store.dispatch(setUser(null));
    }
    return Promise.reject(error);
  }
);

export default api;
