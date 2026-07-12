import axios from "axios";

const BASE_URL = "http://localhost:8080/api/auth";

export const registerUser = (user) => {
    return axios.post(`${BASE_URL}/register`, user);
};

export const loginUser = (user) => {
    return axios.post(`${BASE_URL}/login`, user);
};

export const forgotPassword = (data) => {
    return axios.post(`${BASE_URL}/forgot-password`, data);
};

export const verifyOtp = (data) => {
    return axios.post(`${BASE_URL}/verify-otp`, data);
};

export const resetPassword = (data) => {
    return axios.post(`${BASE_URL}/reset-password`, data);
};