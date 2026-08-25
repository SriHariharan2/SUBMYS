import axios from "axios";
import { getToken } from "../utils/localStorage";

const api = axios.create({
  baseURL: "https://submys.onrender.com/api",
    headers: {
        "Content-Type": "application/json",
    },
});

api.interceptors.request.use(
    (config) => {

        const token = getToken();

        console.log("JWT Token:", token);

        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default api;