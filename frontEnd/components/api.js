import axios from "axios";

const API = axios.create({
   baseURL: import.meta.env.VITE_API_URL ||  "http://localhost:8080",
});

API.interceptors.request.use((req) => {
  const user = localStorage.getItem("user");
  if (user) {
    try {
      const parsedUser = JSON.parse(user);
      if (parsedUser && parsedUser.token) {
        req.headers.Authorization = `Bearer ${parsedUser.token}`;
      }
    } catch (error) {
      console.error("Error parsing user from localStorage:", error);
      localStorage.removeItem("user");
    }
  }
  return req;
});

API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token is invalid or expired, clear localStorage
      localStorage.removeItem("user");
      window.location.reload();
    }
    return Promise.reject(error);
  }
);

export const register = (formData) => API.post("/api/auth/register", formData);
export const login = (formData) => API.post("/api/auth/login", formData);

export const generateStudyMaterial = (text) =>
  API.post("/api/study/generate-study-material", { text });

export const getHistory = () => API.get("/api/study/history");
