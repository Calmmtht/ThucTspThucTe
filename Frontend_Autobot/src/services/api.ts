// src/services/api.ts
import axios from "axios";
import { authService } from "./authService";

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5131",
  headers: {
    "Content-Type": "application/json"
  }
});

// Gắn token tự động vào mọi request
api.interceptors.request.use(
  (config) => {
    const token = authService.getAccessToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);
