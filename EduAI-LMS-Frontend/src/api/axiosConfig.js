import axios from "axios";
import { getToken } from "../utils/localStorage";

const api = axios.create({
    baseURL: "https://submys.onrender.com/api",
    timeout: 90000,
});

// =====================================================
// JWT + REQUEST INTERCEPTOR
// =====================================================

api.interceptors.request.use(
    (config) => {
        const token = getToken();

        console.log("API REQUEST");
        console.log("URL:", `${config.baseURL}${config.url}`);
        console.log("Method:", config.method);
        console.log("JWT present:", !!token);

        // =================================================
        // JWT
        // =================================================

        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        // =================================================
        // FORM DATA
        // =================================================

        if (config.data instanceof FormData) {
            // Let the browser/Axios set the multipart boundary
            delete config.headers["Content-Type"];

            console.log("Axios: Sending multipart/form-data");
        } else {
            config.headers["Content-Type"] = "application/json";
        }

        return config;
    },
    (error) => {
        console.error("Axios request error:", error);
        return Promise.reject(error);
    }
);

// =====================================================
// RESPONSE INTERCEPTOR
// =====================================================

api.interceptors.response.use(
    (response) => {
        console.log(
            "API RESPONSE:",
            response.status,
            response.config.url
        );

        return response;
    },
    (error) => {
        console.error(
            "API RESPONSE ERROR:",
            error.response?.status,
            error.response?.data || error.message
        );

        return Promise.reject(error);
    }
);

export default api;