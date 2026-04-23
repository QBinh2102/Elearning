import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5000/api",
  withCredentials: true,
});

api.interceptors.response.use(
    res => res,
    err => {
        if (err.response?.status === 401) {
            localStorage.removeItem("isLoggedIn");
            window.location.href = "/";
        }
        return Promise.reject(err);
    }
);

export default api;