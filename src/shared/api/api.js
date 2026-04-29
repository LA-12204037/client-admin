import axios from "axios";
import { useAuthStore } from "../../features/auth/store/authStore.js";

// ================= AXIOS AUTH =================
const axiosAuth = axios.create({
  baseURL: import.meta.env.VITE_AUTH_URL,
  timeout: 8000,
  headers: {
    "Content-Type": "application/json",
  },
});

// ================= AXIOS ADMIN =================
const axiosAdmin = axios.create({
  baseURL: import.meta.env.VITE_AUTH_URL,
  timeout: 8000,
  headers: {
    "Content-Type": "application/json",
  },
});

// ================= REQUEST INTERCEPTORS =================
const addToken = (config, clientName) => {
  config._axiosClient = clientName;

  const token = useAuthStore.getState().token;

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
};

axiosAuth.interceptors.request.use((config) =>
  addToken(config, "auth")
);

axiosAdmin.interceptors.request.use((config) =>
  addToken(config, "admin")
);

// ================= REFRESH TOKEN =================
let _isRefreshing = false;
let failedQueue = [];

function _processQueue(error, token = null) {
  failedQueue.forEach(({ resolve, reject }) => {
    if (error) reject(error);
    else resolve(token);
  });

  failedQueue = [];
}

const handleRefreshToken = async (error) => {
  const originalRequest = error.config;

  if (!originalRequest || originalRequest._retry) {
    return Promise.reject(error);
  }

  const status = error.response?.status;
  const requestUrl = originalRequest.url || "";

  const isRefreshEndpoint = requestUrl.includes("/auth/refresh");

  const shouldRefresh =
    !isRefreshEndpoint &&
    (status === 401 ||
      (status === 403 &&
        error.response?.data?.error === "TOKEN_EXPIRED"));

  if (!shouldRefresh) {
    return Promise.reject(error);
  }

  const retryClient =
    originalRequest._axiosClient === "admin"
      ? axiosAdmin
      : axiosAuth;

  if (_isRefreshing) {
    return new Promise((resolve, reject) => {
      failedQueue.push({ resolve, reject });
    })
      .then((token) => {
        originalRequest.headers.Authorization =
          "Bearer " + token;

        return retryClient(originalRequest);
      })
      .catch((err) => Promise.reject(err));
  }

  originalRequest._retry = true;
  _isRefreshing = true;

  const refreshToken = useAuthStore.getState().refreshToken;

  if (!refreshToken) {
    useAuthStore.getState().logout();
    return Promise.reject(error);
  }

  try {
    const response = await axiosAuth.post("/auth/refresh", {
      refreshToken,
    });

    const {
      accessToken,
      refreshToken: newRefreshToken,
      expiresIn,
      userDetails,
    } = response.data;

    useAuthStore.setState({
      token: accessToken,
      refreshToken: newRefreshToken,
      expiresAt: expiresIn,
      user: userDetails || useAuthStore.getState().user,
      isAuthenticated: true,
    });

    _processQueue(null, accessToken);

    originalRequest.headers.Authorization =
      "Bearer " + accessToken;

    return retryClient(originalRequest);
  } catch (err) {
    _processQueue(err, null);
    useAuthStore.getState().logout();

    return Promise.reject(err);
  } finally {
    _isRefreshing = false;
  }
};

// ================= RESPONSE INTERCEPTORS =================
axiosAuth.interceptors.response.use(
  (res) => res,
  handleRefreshToken
);

axiosAdmin.interceptors.response.use(
  (res) => res,
  handleRefreshToken
);

// ================= EXPORTS =================
export { axiosAuth, axiosAdmin, handleRefreshToken };