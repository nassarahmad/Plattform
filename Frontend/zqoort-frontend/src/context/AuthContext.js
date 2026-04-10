import { createContext, useContext, useState } from "react";
import * as authAPI from "../api/auth";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  const loginUser = async (data) => {
    const res = await authAPI.login(data);
    setUser(res.data);
  };

  const registerUser = async (data) => {
    const res = await authAPI.register(data);
    setUser(res.data);
  };

  return (
    <AuthContext.Provider value={{ user, loginUser, registerUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);