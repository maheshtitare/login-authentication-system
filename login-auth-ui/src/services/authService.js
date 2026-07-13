import axios from "axios";

const API_URL =
  process.env.REACT_APP_API_URL ||
  "https://login-auth-api-i8w6.onrender.com/api/auth";

// Attach JWT (if any) to every outgoing request
const client = axios.create({
  baseURL: API_URL,
});

client.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const registerUser = (user) => client.post("/register", user);

export const loginUser = (user) => client.post("/login", user);

export const forgotPassword = (data) =>
  client.post("/forgot-password", data);

export const verifyOtp = (data) =>
  client.post("/verify-otp", data);

export const resetPassword = (data) =>
  client.post("/reset-password", data);