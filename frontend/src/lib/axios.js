import axios from 'axios';

const axiosInstance = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    withCredentials: true,
    withXSRFToken: true,
    headers: {
        Accept: 'application/json',
    },
});

axiosInstance.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;
        
        // Handle 419 CSRF token mismatch
        if (error.response?.status === 419 && !originalRequest._retry) {
            originalRequest._retry = true;
            try {
                await axiosInstance.get('/sanctum/csrf-cookie');
                return axiosInstance(originalRequest);
            } catch (err) {
                return Promise.reject(err);
            }
        }
        
        // Handle 401 Unauthorized globally if needed (AuthContext will also catch)
        if (error.response?.status === 401) {
            // Usually AuthContext handles state, but we can do a hard reload
            // window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

export default axiosInstance;
