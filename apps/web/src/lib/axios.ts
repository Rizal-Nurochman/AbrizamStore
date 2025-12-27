import axios from "axios";
import Cookies from "js-cookie";

const baseURL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api/v1";

const api = axios.create({
  baseURL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true, // Important for cookies
});

// Add a request interceptor to include the token from cookies/localStorage if needed
// Although withCredentials: true handles cookies automatically, sometimes we need to send it in Authorization header explicitly
api.interceptors.request.use(
  (config) => {
    const token = Cookies.get("Authorization") || localStorage.getItem("token");
    if (token) {
      // Check if the token already has "Bearer " prefix or not. 
      // Based on the backend handler, it sets "Authorization" cookie with just the token.
      // Usually Authorization header needs "Bearer " prefix.
      // Let's assume the backend expects "Bearer <token>" in the header if not using cookies.
      // But since we are using withCredentials=true, the cookie should be sent automatically.
      // We'll add it to header just in case the backend checks both or prefers header.
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle 401 errors (unauthorized) globally if needed
    if (error.response?.status === 401) {
      // Redirect to login or clear tokens
      // window.location.href = "/login"; // Be careful with this in Next.js
    }
    return Promise.reject(error);
  }
);

export default api;
