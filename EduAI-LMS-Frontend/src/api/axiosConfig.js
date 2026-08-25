import axios from "axios";
import { getToken } from "../utils/localStorage";

const api = axios.create({
    baseURL: "https://submys.onrender.com/api",
});

// =====================================================
// JWT + REQUEST INTERCEPTOR
// =====================================================

api.interceptors.request.use(
    (config) => {

        const token = getToken();

        console.log("JWT Token:", token);

        // =================================================
        // JWT
        // =================================================

        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        // =================================================
        // IMPORTANT:
        // Do NOT force application/json for FormData.
        // The browser/Axios must create the multipart boundary.
        // =================================================

        if (config.data instanceof FormData) {

            // Remove any previously assigned JSON content type.
            delete config.headers["Content-Type"];

            console.log(
                "Axios: Sending multipart/form-data request"
            );

        } else {

            // Normal API requests use JSON.
            config.headers["Content-Type"] =
                "application/json";

        }

        return config;
    },

    (error) => {
        return Promise.reject(error);
    }
);

export default api;