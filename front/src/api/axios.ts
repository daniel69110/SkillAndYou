import axios from "axios";

const api = axios.create({
    baseURL: "http://localhost:8080/api",
});

api.interceptors.request.use((config) => {
    const token = localStorage.getItem("token");
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

api.interceptors.response.use(
    (response) => response,
    (error) => {
        // Si erreur 403 avec message "Account suspended"
        if (error.response?.status === 403) {
            const message = error.response?.data?.message || '';

            if (message.includes('suspended') || message.includes('suspendu')) {
                // Déconnecte l'utilisateur
                localStorage.removeItem('token');
                localStorage.removeItem('user');

                // Redirige vers login avec message
                window.location.href = '/login?suspended=true';
            }
        }

        return Promise.reject(error);
    }
);

export default api;

