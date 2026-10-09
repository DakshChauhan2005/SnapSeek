// import axios from "axios";
import { getDeviceId } from "../../../utils/device.js";

// const api = axios.create({
//   baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:3000/",
//   withCredentials: true,
// });

import api from "../../../utils/axios.api";
export async function register({ username, email, password }) {
  const response = await api.post("/api/auth/register", { username, email, password });
  return response.data;
}

export async function login({ email, password }) {
  const response = await api.post("/api/auth/login", { email, password, deviceId: getDeviceId() });
  return response.data;
}

export async function getMe() {
  const response = await api.get("/api/auth/get-me");
  return response.data;
}

export async function verifyEmail(token) {
  const response = await api.post("/api/auth/verify-email", { token });
  return response.data;
}

export async function resendVerification(email) {
  const response = await api.post("/api/auth/resend-verification", { email });
  return response.data;
}

export async function logout() {
  const response = await api.post("/api/auth/logout", { deviceId: getDeviceId() });
  return response.data;
}

// Google sign-in is a full-page redirect (not an XHR): the browser has to leave for Google's
// consent screen and come back through the backend, which sets the session cookie.
// The deviceId is passed along so the backend can bind the session to this browser.
export function getGoogleAuthUrl() {
  const base = String(api.defaults.baseURL || "").replace(/\/+$/, "");
  return `${base}/api/auth/google?deviceId=${encodeURIComponent(getDeviceId())}`;
}