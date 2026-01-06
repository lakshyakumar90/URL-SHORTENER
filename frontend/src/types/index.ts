// User type returned from API
export interface User {
  id: string;
  firstname: string;
  lastname: string;
  email: string;
}

// URL type
export interface Url {
  id: string;
  shortCode: string;
  targetUrl: string;
  createdAt: string;
  updatedAt?: string;
}

// Auth response from login/signup
export interface AuthResponse {
  message: string;
  user: User;
  token: string;
}

// API error response
export interface ApiError {
  message: string;
}

// Login credentials
export interface LoginCredentials {
  email: string;
  password: string;
}

// Signup credentials
export interface SignupCredentials {
  firstname: string;
  lastname: string;
  email: string;
  password: string;
}

// Shorten URL request
export interface ShortenUrlRequest {
  url: string;
  code?: string;
}

// Shorten URL response
export interface ShortenUrlResponse {
  message: string;
  id: string;
  shortCode: string;
  targetUrl: string;
}
