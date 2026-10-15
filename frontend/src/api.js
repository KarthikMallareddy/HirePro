// ─────────────────────────────────────────────────
//  api.js — Axios instance + all API calls
//  Includes JWT Authorization header interceptor
// ─────────────────────────────────────────────────

import axios from "axios";

// Base URL — uses environment variable in production, localhost in development
let rawURL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

// Auto-normalize: ensure URL always points to the /api endpoint
let cleanURL = rawURL.trim().replace(/\/+$/, "");
if (!cleanURL.endsWith("/api")) {
  cleanURL = cleanURL + "/api";
}

const api = axios.create({
  baseURL: cleanURL,
});

// ── Interceptor: attach JWT token to every request ──
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ── Auth API ──────────────────────────────────────

// Register a new user
export const registerUser = (userData) =>
  api.post("/auth/register", userData);

// Login existing user
export const loginUser = (credentials) =>
  api.post("/auth/login", credentials);

// Fetch current user details
export const getCurrentUser = () =>
  api.get("/auth/me");

// ── Applications API ──────────────────────────────

// Fetch all applications for logged-in user
export const getApplications = (params = {}) =>
  api.get("/applications", { params });

// Fetch dashboard stat counts by status
export const getStats = () =>
  api.get("/applications/stats");

// Create a new application
export const createApplication = (data) =>
  api.post("/applications", data);

// Update only the status of one application
export const updateStatus = (id, status) =>
  api.patch(`/applications/${id}/status`, { status });

// Update all fields of one application (edit form)
export const updateApplication = (id, data) =>
  api.patch(`/applications/${id}`, data);

// Delete one application by id
export const deleteApplication = (id) =>
  api.delete(`/applications/${id}`);
