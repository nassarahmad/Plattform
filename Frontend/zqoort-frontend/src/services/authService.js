import api from "./api";
import { toast } from "react-toastify";

export const loginUser = async (data) => {
  const res = await api.post("/auth/login", data);
  toast.success("Login success");
  return res.data;
};

export const registerUser = async (data) => {
  const res = await api.post("/auth/register", data);
  toast.success("Registered!");
  return res.data;
};