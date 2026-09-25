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
  const response = await api.post("/api/auth/verify-email", { token, deviceId: getDeviceId() });
  return response.data;
}