import axios from "axios";

export const API_BASE_URL = "https://route-posts.routemisr.com";
export const TOKEN_KEY = "userToken";

export function getStoredToken() {
  return localStorage.getItem(TOKEN_KEY);
}

export function persistToken(token: string) {
  localStorage.setItem(TOKEN_KEY, token);
}

export function clearToken() {
  localStorage.removeItem(TOKEN_KEY);
}

export function extractToken(payload: any): string | null {
  return payload?.data?.token || payload?.token || null;
}

const api = axios.create({
  baseURL: API_BASE_URL,
});

api.interceptors.request.use((config) => {
  const token = getStoredToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error?.response?.status;
    const url = String(error?.config?.url || "");
    const isAuthEndpoint = url.includes("/users/signin") || url.includes("/users/signup");

    if (status === 401 && !isAuthEndpoint && getStoredToken()) {
      clearToken();
      if (!window.location.pathname.includes("/login")) {
        window.location.assign("/login");
      }
    }

    return Promise.reject(error);
  },
);

export default api;
