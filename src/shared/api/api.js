import {axiosAuth} from ".";

import {useAuthStore} from "../../features/auth/authStore";

//INSTANCIA DE AXIOS 
const axiosAuth = axios.create({

    baseURL: import.meta.env.VITE_AUTH_URL,
    timeout : 8000,
    headers: {
        'Content-Type': 'application/json',
    }
});


//Configuracion de interceptores 
axiosAuth.interceptors.request.use((config) => {
    config.axiosClient = 'auth';
    const token = useAuthStore.getState().token;
    if (token) {
        config.headers.Authorization = `Bearer.${token}`;
    }
    return config;
});

// configuración de documentación axios
let _isRefreshing = false;
let failedQueue = [];

function _processQueue(_error, token = null) {
  failedQueue.forEach(({ resolve, reject }) => {
    _error ? reject(_error) : resolve(token);
  });
  failedQueue = [];
}

const handleRefreshToken = async function (_error) {
  const _original = _error.config;
  if (_original._original._retry) {
    // Ya se reintentó o no hay config
    return Promise.reject(_error);
  }
  
};
