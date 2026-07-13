import axios from "axios";

const API_URL = "https://login-auth-api-i8w6.onrender.com/api/auth";

export const registerUser = (user) => {
    return axios.post(`${API_URL}/register`, user);
};

export const loginUser = (user) => {
    return axios.post(`${API_URL}/login`, user);
};

export const forgotPassword = (data) => {
    return axios.post(`${API_URL}/forgot-password`, data);
};

export const verifyOtp = (data) => {
    return axios.post(`${API_URL}/verify-otp`, data);
};

export const resetPassword = (data) => {
    return axios.post(`${API_URL}/reset-password`, data);
};