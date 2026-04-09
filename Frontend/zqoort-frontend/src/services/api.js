import axios from "axios";
import { toast } from "react-toastify";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

// ✅ Error handling
api.interceptors.response.use(
  res => res,
  err => {
    toast.error(err.response?.data?.message || "Error occurred");
    return Promise.reject(err);
  }
);

export default api;