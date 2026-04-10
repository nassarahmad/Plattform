import { createContext, useContext, useState } from "react";
import * as authAPI from "../api/auth";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  const loginUser = async (data) => {
    try {
      const res = await authAPI.login(data);
      setUser(res.data);
    } catch (err) {
      console.error("Login error:", err);
    }
  };

  const registerUser = async (data) => {
    try {
      const res = await authAPI.register(data);
      setUser(res.data);
    } catch (err) {
      console.error("Register error:", err);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loginUser, registerUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);