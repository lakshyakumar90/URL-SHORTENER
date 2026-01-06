import {
  AuthResponse,
  LoginCredentials,
  SignupCredentials,
  ShortenUrlRequest,
  ShortenUrlResponse,
  Url,
} from "@/types";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api/v1";

// Get token from localStorage
const getToken = (): string | null => {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("token");
};

// Generic fetch wrapper with auth
async function fetchWithAuth<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const token = getToken();

  const headers: HeadersInit = {
    "Content-Type": "application/json",
    ...options.headers,
  };

  if (token) {
    (headers as Record<string, string>)["Authorization"] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Something went wrong");
  }

  return response.json();
}

// Auth API
export const authApi = {
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    return fetchWithAuth<AuthResponse>("/user/login", {
      method: "POST",
      body: JSON.stringify(credentials),
    });
  },

  signup: async (credentials: SignupCredentials): Promise<AuthResponse> => {
    return fetchWithAuth<AuthResponse>("/user/signup", {
      method: "POST",
      body: JSON.stringify(credentials),
    });
  },
};

// URL API
export const urlApi = {
  shorten: async (data: ShortenUrlRequest): Promise<ShortenUrlResponse> => {
    return fetchWithAuth<ShortenUrlResponse>("/shorten", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  getAll: async (): Promise<{ message: string; urls: Url[] }> => {
    return fetchWithAuth<{ message: string; urls: Url[] }>("/codes", {
      method: "GET",
    });
  },

  delete: async (id: string): Promise<{ message: string }> => {
    return fetchWithAuth<{ message: string }>(`/${id}`, {
      method: "DELETE",
    });
  },
};
