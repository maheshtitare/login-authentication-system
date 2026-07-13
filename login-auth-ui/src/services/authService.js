import axios from "axios";

// const API_URL =
//   process.env.REACT_APP_API_URL ||
//   "https://login-auth-api-i8w6.onrender.com/api/auth";

const API_URL =
  process.env.REACT_APP_API_URL ||
  "http://localhost:8081/api/auth";
  
// Attach JWT (if any) to every outgoing request
const client = axios.create({ baseURL: API_URL });

client.interceptors.request.use((config) => {
    const token = localStorage.getItem("token");
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export const registerUser = (user) => {
    return client.post(`/register`, user);
};

export const loginUser = (user) => {
    return client.post(`/login`, user);
};

export const forgotPassword = (data) => {
    return client.post(`/forgot-password`, data);
};

export const verifyOtp = (data) => {
    return client.post(`/verify-otp`, data);
};

export const resetPassword = (data) => {
    return client.post(`/reset-password`, data);
};
