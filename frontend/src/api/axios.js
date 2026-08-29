import axios from "axios";

const api = axios.create({
    baseURL: "https://authentication-mediatize.onrender.com",
    headers: {
        "Content-Type": "application/json"
    }
});


// Automatically attach JWT to protected requests
api.interceptors.request.use(
    (config) => {

        const token = localStorage.getItem("access_token");

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